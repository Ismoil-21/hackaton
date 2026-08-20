import { User, ROLES } from '../models/User.js';
import { Request } from '../models/Request.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// GET /api/users  (admin)
export const list = asyncHandler(async (req, res) => {
  const { search, role } = req.query;
  const filter = {};
  if (role && ROLES.includes(role)) filter.role = role;
  if (search?.trim()) {
    const rx = new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [{ name: rx }, { email: rx }];
  }
  const users = await User.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, data: users });
});

// PATCH /api/users/:id  (admin) — rol va bloklashni boshqarish
export const update = asyncHandler(async (req, res) => {
  const { role, isActive } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) throw ApiError.notFound('Foydalanuvchi topilmadi');
  if (String(user._id) === String(req.user._id))
    throw ApiError.badRequest('O‘zingizni o‘zgartira olmaysiz');

  if (role !== undefined) {
    if (!ROLES.includes(role)) throw ApiError.badRequest('Noto‘g‘ri rol');
    user.role = role;
  }
  if (isActive !== undefined) user.isActive = Boolean(isActive);

  await user.save();
  res.json({ success: true, data: user });
});

// DELETE /api/users/:id (admin) — user va uning yozuvlari
export const remove = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw ApiError.notFound('Foydalanuvchi topilmadi');
  if (String(user._id) === String(req.user._id))
    throw ApiError.badRequest('O‘zingizni o‘chira olmaysiz');

  await Request.deleteMany({ userId: user._id });
  await user.deleteOne();
  res.json({ success: true, message: 'Foydalanuvchi o‘chirildi' });
});
