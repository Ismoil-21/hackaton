import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });

/** Token ni tekshiradi va req.user ni to'ldiradi */
export const protect = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) throw ApiError.unauthorized();

  let payload;
  try {
    payload = jwt.verify(token, env.jwtSecret);
  } catch {
    throw ApiError.unauthorized('Token yaroqsiz yoki muddati tugagan');
  }

  const user = await User.findById(payload.id);
  if (!user || !user.isActive) throw ApiError.unauthorized('Foydalanuvchi topilmadi yoki bloklangan');

  req.user = user;
  next();
});

/** Rol tekshiruvi: restrictTo('admin') */
export const restrictTo = (...roles) => (req, _res, next) => {
  if (!roles.includes(req.user.role)) return next(ApiError.forbidden());
  next();
};
