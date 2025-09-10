import express from 'express';
import * as userConteroller from './user.controller.js';
import * as authController from '../auth/auth.controller.js';

const userRouter = express.Router();

userRouter
  .route('/')
  .get(
    authController.isAuthenticated,
    authController.restrictTo('admin'),
    userConteroller.getAllUsers,
  );

userRouter
  .route('/:id')
  .get(userConteroller.getUser)
  .patch(userConteroller.updateUser)
  .delete(userConteroller.deleteUser);

export default userRouter;
