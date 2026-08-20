import { ApiError } from '../utils/ApiError.js';
import { env } from '../config/env.js';

export const notFound = (req, _res, next) =>
  next(ApiError.notFound(`Route topilmadi: ${req.method} ${req.originalUrl}`));

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, _req, res, _next) => {
  let status = err.status || 500;
  let message = err.message || 'Server xatosi';
  let details = err.details || null;

  // Mongoose validation
  if (err.name === 'ValidationError') {
    status = 400;
    message = 'Ma’lumotlar noto‘g‘ri';
    details = Object.fromEntries(Object.entries(err.errors).map(([k, v]) => [k, v.message]));
  }
  // Noto'g'ri ObjectId
  if (err.name === 'CastError') {
    status = 400;
    message = `Noto‘g‘ri ${err.path}`;
  }
  // Unique index
  if (err.code === 11000) {
    status = 409;
    const field = Object.keys(err.keyPattern || { field: 1 })[0];
    message = `Bu ${field} allaqachon band`;
    details = { [field]: `${field} band` };
  }

  if (status >= 500) console.error(err);

  res.status(status).json({
    success: false,
    message,
    ...(details ? { errors: details } : {}),
    ...(env.isProd ? {} : { stack: status >= 500 ? err.stack : undefined }),
  });
};
