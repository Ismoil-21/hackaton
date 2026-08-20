import { User } from '../models/User.js';
import { signToken } from '../middleware/auth.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (await User.findOne({ email: email.toLowerCase() }))
    throw ApiError.badRequest('Ma’lumotlar noto‘g‘ri', { email: 'Bu email ro‘yxatdan o‘tgan' });

  // Birinchi foydalanuvchi avtomatik admin bo'ladi (hackathon uchun qulay)
  const isFirst = (await User.estimatedDocumentCount()) === 0;
  const user = await User.create({ name, email, password, role: isFirst ? 'admin' : 'user' });

  res.status(201).json({ success: true, data: { user, token: signToken(user) } });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: String(email).toLowerCase() }).select('+password');

  if (!user || !(await user.comparePassword(password)))
    throw ApiError.unauthorized('Email yoki parol noto‘g‘ri');
  if (!user.isActive) throw ApiError.forbidden('Hisobingiz bloklangan');

  user.password = undefined;
  res.json({ success: true, data: { user, token: signToken(user) } });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ success: true, data: { user: req.user } });
});

/** Token client tomonda saqlanadi — logout uni bekor qiladi. */
export const logout = asyncHandler(async (_req, res) => {
  res.json({ success: true, message: 'Chiqildi' });
});
