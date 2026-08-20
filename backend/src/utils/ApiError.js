export class ApiError extends Error {
  constructor(status, message, details = null) {
    super(message);
    this.status = status;
    this.details = details;
  }
  static badRequest(msg, details) { return new ApiError(400, msg, details); }
  static unauthorized(msg = 'Avtorizatsiya talab qilinadi') { return new ApiError(401, msg); }
  static forbidden(msg = 'Ruxsat yo‘q') { return new ApiError(403, msg); }
  static notFound(msg = 'Topilmadi') { return new ApiError(404, msg); }
}
