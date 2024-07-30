const express = require('express');
const {getAllUsers, createUser, getUser, updateUser, deleteUser} = require('../controllers/userController');
const {signup, login, forgotPassword, resetPassword} = require('../controllers/authController');

const userRouter = express.Router();

userRouter.post('/signup', signup);
userRouter.post('/login', login);
userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/reset-password', resetPassword);
userRouter.route('/').get(getAllUsers).post(createUser);
userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = userRouter;