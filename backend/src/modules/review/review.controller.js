import Review from './review.model.js';
import catchAsync from '../../utils/error/catchAsync.js';
import AppError from '../../utils/error/appError.js';
import APIFeatures from '../../utils/apiFeatures.js';

const createReview = catchAsync(async (req, res, next) => {
  const { comment, rating, bookId: book } = req.body;
  const { userId: user } = req;

  const review = await Review.create({ comment, rating, book, user });

  res.status(201).json({
    status: 'success',
    data: {
      review,
    },
  });
});

const getAllReviews = catchAsync(async (req, res, next) => {
  const apiFeatures = new APIFeatures(Review.find(), req.query)
    .filter()
    .sort()
    .projection()
    .paginate();

  const reviews = await apiFeatures.mongooseQuery;
  const totalReviews = await Review.countDocuments();

  res.status(200).json({
    status: 'success',
    page: apiFeatures.page,
    results: reviews.length,
    totalReviews,
    data: {
      reviews,
    },
  });
});

const getReview = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const review = await Review.findById(id);

  if (!review) {
    return next(new AppError('No review found with the provided ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      review,
    },
  });
});

const updateReview = catchAsync(async (req, res, next) => {
  const { id: _id } = req.params;
  const { comment, rating } = req.body;
  const { userId: user } = req;

  const review = await Review.findOneAndUpdate(
    { _id, user },
    { comment, rating },
    { new: true, runValidators: true },
  );

  if (!review) {
    return next(
      new AppError('No review found or you are not authorized', 404),
    );
  }

  res.status(200).json({
    status: 'success',
    data: {
      review,
    },
  });
});

const deleteReview = catchAsync(async (req, res, next) => {
  const { id: _id } = req.params;
  const { userId: user } = req;

  const review = await Review.findOneAndDelete({ _id, user });

  if (!review) {
    return next(
      new AppError('No review found or you are not authorized', 404),
    );
  }

  res.status(204).send();
});

export {
  createReview,
  getReview,
  getAllReviews,
  updateReview,
  deleteReview,
};
