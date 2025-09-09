import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../user/user.model.js';
import AppError from '../../utils/error/appError.js';

const signToken = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return token;
};

const createSendToken = (user, statusCode, res, message) => {
  let token;
  if (user.isVerified) {
    token = signToken({ userId: user._id, role: user.role });
    const cookieOptions = {
      expires: new Date(
        Date.now() +
          process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
      ),
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      httpOnly: true,
    };
    res.cookie('jwt', token, cookieOptions);
  }
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    message,
    token,
    data: {
      user,
    },
  });
};

const verifyOtpForReset = async (email, otp) => {
  const otpHashed = crypto.createHash('sha256').update(otp).digest('hex');
  const user = await User.findOne({
    email,
    isVerified: true,
    'passwordReset.otp': otpHashed,
    'passwordReset.otpExpires': { $gt: Date.now() },
  });
  if (!user)
    throw new AppError(
      'Verification failed. Please check your OTP or request a new one',
      400,
    );
  return user;
};

const verifyVerificationToken = async (token) => {
  const tokenHashed = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
  const user = await User.findOne({
    isVerified: false,
    'emailVerification.token': tokenHashed,
    'emailVerification.tokenExpires': { $gt: Date.now() },
  });
  if (!user)
    throw new AppError(
      'Verification failed. Please check your OTP or request a new one',
      400,
    );
  return user;
};

export { createSendToken, verifyVerificationToken, verifyOtpForReset };
