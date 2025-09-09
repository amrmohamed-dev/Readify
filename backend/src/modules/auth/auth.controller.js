import User from '../user/user.model.js';
import catchAsync from '../../utils/error/catchAsync.js';
import AppError from '../../utils/error/appError.js';
import createSendEmail from '../../emails/services/emailHelper.js';
import * as authService from './auth.service.js';

const register = catchAsync(async (req, res, next) => {
  const { firstName, secondName, email, password, passwordConfirm } =
    req.body;
  const user = await User.create({
    firstName,
    secondName,
    email,
    password,
    passwordConfirm,
  });
  const verificationToken = user.generateEmailVerificationToken();
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
    'We have sent a verification link to your email.',
  );
});

const resendVerificationLink = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email, isVerified: false });
  if (!user) {
    return next(new AppError('Invalid credentials.', 400));
  }
  const verificationToken = user.generateEmailVerificationToken();
  await user.save({ validateBeforeSave: false });
  const verifyEmailUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/verify-email/${verificationToken}`;
  const options = {
    name: user.firstName,
    email,
    subject: 'Email Confirmaiton',
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
    return next(new AppError('Invalid credentials.', 400));
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

export {
  register,
  resendVerificationLink,
  verifyEmail,
  login,
  forgotPassword,
  verifyOtp,
  resetPassword,
};
