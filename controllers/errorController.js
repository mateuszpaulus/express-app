const AppError = require('../utils/appError');

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {

  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicatefield value: ${value}. Please use another value.`;
  return new AppError(message, 400);
};
const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(e => e.message);

  const message = `Invalid input data. ${errors.join}`;
  return new AppError(message, 400);
};

module.exports = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'Error';

  if (process.env.NODE_ENV === 'development') {

    res.status(error.statusCode).json({
      status: error.status,
      error: error,
      message: error.message,
      stack: error.stack,
    });
  } else if (process.env.NODE_ENV === 'production') {
    let err = {...error};
    if (err.name === 'CastError') {
      err = handleCastErrorDB(err);
    }
    if (err.code === 11000) {
      err = handleDuplicateFieldsDB(error);
    }
    if (err.name === 'ValidationError') {
      err = handleValidationErrorDB(error);
    }

    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      res.status(500).json({
        status: 'Error',
        message: 'Something went wrong!',
      });
    }
  }
};