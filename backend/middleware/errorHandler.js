function errorHandler(err, req, res, next) {
  console.error('❌ Error:', err.message);
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? 'Internal Server Error' : message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = { errorHandler, AppError };
