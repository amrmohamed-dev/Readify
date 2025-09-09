import express from 'express';
import * as authController from './auth.controller.js';

const authRouter = express.Router();

authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);

authRouter.get('/verify-email/:token', authController.verifyEmail);
authRouter.post(
  '/resend-verification',
  authController.resendVerificationLink,
);

authRouter.post('/forgot-password', authController.forgotPassword);
authRouter.post('/verify-reset-otp', authController.verifyOtp);
authRouter.patch('/reset-password', authController.resetPassword);

export default authRouter;
