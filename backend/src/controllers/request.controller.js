import mongoose from 'mongoose';
import { Request } from '../models/Request.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { normalizeMetadata } from '../middleware/validate.js';
import { domain, CATEGORY_VALUES, STATUS_VALUES, PRIORITY_VALUES } from '../../../shared/domain.js';

const POPULATE = [
  { path: 'userId', select: 'name email' },
  { path: 'assignedTo', select: 'name email' },
];

const isOwnerOrAdmin = (doc, user) =>
  user.role === 'admin' || String(doc.userId?._id ?? doc.userId) === String(user._id);

/** Query -> mongo filter. Admin hammasini, user faqat o'zinikini ko'radi. */
function buildFilter(req) {
  const { search, category, status, priority, assignedTo, mine } = req.query;
  const filter = {};

  if (req.user.role !== 'admin' || mine === 'true') filter.userId = req.user._id;
  if (category && CATEGORY_VALUES.includes(category)) filter.category = category;
  if (status && STATUS_VALUES.includes(status)) filter.status = status;
  if (priority && PRIORITY_VALUES.includes(priority)) filter.priority = priority;
  if (assignedTo && mongoose.isValidObjectId(assignedTo)) filter.assignedTo = assignedTo;

  if (search?.trim()) {
    const rx = new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [{ title: rx }, { description: rx }];
  }
  return filter;
}

// GET /api/requests
export const list = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
  const allowedSort = ['createdAt', 'updatedAt', 'title', 'priority', 'status'];
  const sortBy = allowedSort.includes(req.query.sortBy) ? req.query.sortBy : 'createdAt';
  const order = req.query.order === 'asc' ? 1 : -1;

  const filter = buildFilter(req);
  const [items, total] = await Promise.all([
    Request.find(filter).populate(POPULATE).sort({ [sortBy]: order }).skip((page - 1) * limit).limit(limit),
    Request.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: items,
    meta: { page, limit, total, pages: Math.ceil(total / limit) || 1 },
  });
});

// GET /api/requests/stats
export const stats = asyncHandler(async (req, res) => {
  const scopeAll = req.user.role === 'admin' && req.query.mine !== 'true';
  const match = scopeAll ? {} : { userId: req.user._id };
  const group = async (field) =>
    Object.fromEntries(
      (await Request.aggregate([{ $match: match }, { $group: { _id: `$${field}`, n: { $sum: 1 } } }]))
        .map((r) => [r._id, r.n])
    );

  const [total, byStatus, byPriority, byCategory] = await Promise.all([
    Request.countDocuments(match),
    group('status'),
    group('priority'),
    group('category'),
  ]);

  res.json({ success: true, data: { total, byStatus, byPriority, byCategory } });
});

// GET /api/requests/:id
export const getOne = asyncHandler(async (req, res) => {
  const doc = await Request.findById(req.params.id).populate(POPULATE);
  if (!doc) throw ApiError.notFound(`${domain.entity.one} topilmadi`);
  if (!isOwnerOrAdmin(doc, req.user)) throw ApiError.forbidden();
  res.json({ success: true, data: doc });
});

// POST /api/requests
export const create = asyncHandler(async (req, res) => {
  const { title, description, category, priority, status, assignedTo } = req.body;
  const { metadata, errors } = normalizeMetadata(req.body.metadata);
  if (Object.keys(errors).length) throw ApiError.badRequest('Ma’lumotlar noto‘g‘ri', errors);

  const doc = await Request.create({
    title,
    description,
    category,
    priority,
    metadata,
    userId: req.user._id,
    // status va assignedTo — faqat admin boshqaradi
    ...(req.user.role === 'admin' ? { status, assignedTo: assignedTo || null } : {}),
  });

  res.status(201).json({ success: true, data: await doc.populate(POPULATE) });
});

// PATCH /api/requests/:id
export const update = asyncHandler(async (req, res) => {
  const doc = await Request.findById(req.params.id);
  if (!doc) throw ApiError.notFound(`${domain.entity.one} topilmadi`);
  if (!isOwnerOrAdmin(doc, req.user)) throw ApiError.forbidden();

  const isAdmin = req.user.role === 'admin';
  const editable = isAdmin
    ? ['title', 'description', 'category', 'priority', 'status', 'assignedTo']
    : ['title', 'description', 'category', 'priority'];

  for (const key of editable) {
    if (req.body[key] !== undefined) doc[key] = key === 'assignedTo' ? req.body[key] || null : req.body[key];
  }

  if (req.body.metadata !== undefined) {
    const { metadata, errors } = normalizeMetadata(req.body.metadata, { partial: true });
    if (Object.keys(errors).length) throw ApiError.badRequest('Ma’lumotlar noto‘g‘ri', errors);
    doc.metadata = { ...doc.metadata, ...metadata };
  }

  await doc.save();
  res.json({ success: true, data: await doc.populate(POPULATE) });
});

// DELETE /api/requests/:id
export const remove = asyncHandler(async (req, res) => {
  const doc = await Request.findById(req.params.id);
  if (!doc) throw ApiError.notFound(`${domain.entity.one} topilmadi`);
  if (!isOwnerOrAdmin(doc, req.user)) throw ApiError.forbidden();
  await doc.deleteOne();
  res.json({ success: true, message: `${domain.entity.one} o‘chirildi` });
});
