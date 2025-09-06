import Book from './book.model.js';
import APIFeatures from '../../utils/apiFeatures.js';
import catchAsync from '../../utils/error/catchAsync.js';
import AppError from '../../utils/error/appError.js';

const createBook = catchAsync(async (req, res, next) => {
  const book = await Book.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      book,
    },
  });
});

const getAllBooks = catchAsync(async (req, res, next) => {
  const apiFeatures = new APIFeatures(Book.find(), req.query)
    .filter()
    .search()
    .sort()
    .projection()
    .paginate();

  const books = await apiFeatures.mongooseQuery;
  const totalBooks = await Book.countDocuments();

  res.status(200).json({
    status: 'success',
    page: apiFeatures.page,
    results: books.length,
    totalBooks,
    data: {
      books,
    },
  });
});

const getBook = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const book = await Book.findById(id);

  if (!book) {
    return next(new AppError('No book found with the provided ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      book,
    },
  });
});

const updateBook = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const book = await Book.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!book) {
    return next(new AppError('No book found with the provided ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      book,
    },
  });
});

const deleteBook = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const book = await Book.findByIdAndDelete(id);

  if (!book) {
    return next(new AppError('No book found with the provided ID', 404));
  }

  res.status(204).send();
});

export { createBook, getAllBooks, getBook, updateBook, deleteBook };
