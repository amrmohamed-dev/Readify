import express from 'express';
import * as authController from './auth.controller.js';
import * as rateLimiter from '../../middlewares/limiter.js';

const authRouter = express.Router();

authRouter.post(
  '/register',
  rateLimiter.registerLimiter,
  authController.register,
);
authRouter.post('/login', rateLimiter.loginLimiter, authController.login);

authRouter.get(
  '/verify-email/:token',
  rateLimiter.verifyLimiter,
  authController.verifyEmail,
);
authRouter.post(
  '/resend-verification',
  rateLimiter.strictLimiter,
  authController.resendVerificationLink,
);

authRouter.post(
  '/forgot-password',
  rateLimiter.strictLimiter,
  authController.forgotPassword,
);
authRouter.post(
  '/verify-reset-otp',
  rateLimiter.verifyLimiter,
  authController.verifyOtp,
);
authRouter.patch(
  '/reset-password',
  rateLimiter.resetLimiter,
  authController.resetPassword,
);

export default authRouter;
