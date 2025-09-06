import express from 'express';
import * as userConteroller from './user.controller.js';

const userRouter = express.Router();

userRouter.route('/').get(userConteroller.getAllUsers);

userRouter
  .route('/:id')
  .get(userConteroller.getUser)
  .patch(userConteroller.updateUser)
  .delete(userConteroller.deleteUser);

export default userRouter;
