import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import User from '../user/user.model.js';
import catchAsync from '../../utils/error/catchAsync.js';
import AppError from '../../utils/error/appError.js';
import createSendEmail from '../../emails/services/emailHelper.js';
import * as authService from './auth.service.js';

const register = catchAsync(async (req, res, next) => {
  const { firstName, secondName, email, password, passwordConfirm } =
    req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(
      new AppError(
        'An account with this email already exists. Please login instead.',
        409,
      ),
    );
  }
  const user = await User.create({
    firstName,
    secondName,
    email,
    password,
    passwordConfirm,
  });
  const verificationToken = user.generateEmailVerificationToken();
  await user.save({ validateBeforeSave: false });
  const verifyEmailUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/verify-email/${verificationToken}`;
  const options = {
    name: user.firstName,
    email,
    subject: 'Email Confirmation',
    url: verifyEmailUrl,
    template: 'verifyEmail',
  };
  await createSendEmail(options, user, [
    'emailVerification.token',
    'emailVerification.tokenExpires',
  ]);
  authService.createSendToken(
    user,
    201,
    res,
    'We have sent a verification link to your email. Please check your inbox and spam folder.',
  );
});

const resendVerificationLink = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email, isVerified: false });
  if (!user) {
    return next(
      new AppError(
        'This email is either already verified or does not exist.',
        400,
      ),
    );
  }
  const verificationToken = user.generateEmailVerificationToken();
  await user.save({ validateBeforeSave: false });
  const verifyEmailUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/verify-email/${verificationToken}`;
  const options = {
    name: user.firstName,
    email,
    subject: 'Email Confirmation',
    url: verifyEmailUrl,
    template: 'verifyEmail',
  };
  await createSendEmail(options, user, [
    'emailVerification.token',
    'emailVerification.tokenExpires',
  ]);
  authService.createSendToken(
    user,
    200,
    res,
    'If a verification link was sent, please check your email.',
  );
});

const verifyEmail = catchAsync(async (req, res, next) => {
  const { token } = req.params;
  const user = await authService.verifyVerificationToken(token);
  user.isVerified = true;
  user.emailVerification.token = undefined;
  user.emailVerification.tokenExpires = undefined;
  await user.save({ validateBeforeSave: false });
  authService.createSendToken(
    user,
    200,
    res,
    'Email confirmed successfully',
  );
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password))) {
    return next(new AppError('Incorrect email or password.', 400));
  }
  if (!user.isVerified) {
    return next(
      new AppError('Please verify your email before logging in', 401),
    );
  }
  authService.createSendToken(user, 200, res);
});

const forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email, isVerified: true });
  if (!user) {
    return next(
      new AppError(
        'This email is not eligible for password recovery.',
        400,
      ),
    );
  }
  const otp = user.generatePasswordResetOtp();
  await user.save({ validateBeforeSave: false });
  const options = {
    name: user.firstName,
    email,
    subject: 'Password Recovery',
    url: otp,
    template: 'resetPassword',
  };
  await createSendEmail(options, user, [
    'passwordReset.otp',
    'passwordReset.otpExpires',
  ]);
  res.status(200).json({
    status: 'success',
    message: 'If an OTP was sent, please check your email.',
  });
});

const verifyOtp = catchAsync(async (req, res, next) => {
  const { email, otp } = req.body;
  await authService.verifyOtpForReset(email, otp);
  res.status(200).json({
    status: 'success',
    message: 'OTP verified successfully',
  });
});

const resetPassword = catchAsync(async (req, res, next) => {
  const { email, otp } = req.body;
  const user = await authService.verifyOtpForReset(email, otp);
  user.passwordReset.otp = undefined;
  user.passwordReset.otpExpires = undefined;
  const { password, passwordConfirm } = req.body;
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  await user.save();
  authService.createSendToken(
    user,
    200,
    res,
    'Password updated successfully',
  );
});

const isAuthenticated = catchAsync(async (req, res, next) => {
  const token = req.cookies?.jwt;
  if (!token) {
    return next(
      new AppError('Authentication required. Please log in.', 401),
    );
  }
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET,
  );
  const user = await User.findById(decoded.userId);
  if (!user || user.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('Authentication failed. Please log in again.', 401),
    );
  }
  req.user = user;
  next();
});

const restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          'You do not have permission to perform this action.',
          403,
        ),
      );
    }
    next();
  };

export {
  register,
  resendVerificationLink,
  verifyEmail,
  login,
  forgotPassword,
  verifyOtp,
  resetPassword,
  isAuthenticated,
  restrictTo,
};
