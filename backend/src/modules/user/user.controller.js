import User from './user.model.js';
import catchAsync from '../../utils/error/catchAsync.js';
import AppError from '../../utils/error/appError.js';
import APIFeatures from '../../utils/apiFeatures.js';

const getAllUsers = catchAsync(async (req, res, next) => {
  const apiFeatures = new APIFeatures(User.find(), req.query)
    .filter()
    .sort()
    .projection()
    .paginate();

  const users = await apiFeatures.mongooseQuery;
  const totalUsers = await User.countDocuments();

  res.status(200).json({
    status: 'success',
    results: users.length,
    totalUsers,
    data: {
      users,
    },
  });
});

const getUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);

  if (!user) {
    return next(new AppError('No user found with the provided ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

const updateUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { firstName, secondName, email, password } = req.body;

  const user = await User.findByIdAndUpdate(
    id,
    {
      firstName,
      secondName,
      email,
      password,
    },
    { new: true, runValidators: true },
  );

  if (!user) {
    return next(new AppError('No user found with the provided ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

const deleteUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findByIdAndDelete(id);

  if (!user) {
    return next(new AppError('No user found with the provided ID', 404));
  }

  res.status(204).send();
});

export { getAllUsers, getUser, updateUser, deleteUser };
