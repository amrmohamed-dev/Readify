import sendEmail from './emailService.js';
import AppError from '../../utils/error/appError.js';

const createSendEmail = async (options, user, resetFields = []) => {
  try {
    await sendEmail(options);
    return true;
  } catch (err) {
    resetFields.forEach((field) => {
      user[field] = undefined;
    });
    await user.save({ validateBeforeSave: false });
    throw new AppError(
      'We could not send the email. Please try again later.',
      500,
    );
  }
};

export default createSendEmail;
