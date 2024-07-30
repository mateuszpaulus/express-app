const User = require('../models/userModel');
const catchAsync = require('./../utils/catchAsync');


exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();

  res.status(200).json({
    status: 'Success',
    requestedAt: req.requestTime,
    results: users.length,
    data: {
      users,
    }
  });
});
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'No such users',
  });
};
exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'No such users',
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'No such users',
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'No such users',
  });
};
