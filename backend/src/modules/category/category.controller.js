import Category from './category.model.js';
import catchAsync from '../../utils/error/catchAsync.js';
import APIFeatures from '../../utils/apiFeatures.js';
import AppError from '../../utils/error/appError.js';

const createCategory = catchAsync(async (req, res, next) => {
  const { name, description } = req.body;

  const category = await Category.create({ name, description });

  res.status(201).json({
    status: 'success',
    data: {
      category,
    },
  });
});

const getAllCategories = catchAsync(async (req, res, next) => {
  const apiFeatures = new APIFeatures(Category.find(), req.query)
    .filter()
    .sort()
    .projection()
    .paginate();

  const categories = await apiFeatures.mongooseQuery;
  const totalCategories = await Category.countDocuments();

  res.status(200).json({
    status: 'success',
    page: apiFeatures.page,
    results: categories.length,
    totalCategories,
    data: {
      categories,
    },
  });
});

const getCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const category = await Category.findById(id);

  if (!category) {
    return next(
      new AppError('No category found with the provided ID', 404),
    );
  }

  res.status(200).json({
    status: 'success',
    data: {
      category,
    },
  });
});

const updateCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { name, description } = req.body;

  const category = await Category.findByIdAndUpdate(
    id,
    {
      name,
      description,
    },
    { new: true, runValidators: true },
  );

  if (!category) {
    return next(
      new AppError('No category found with the provided ID', 404),
    );
  }

  res.status(200).json({
    status: 'success',
    data: {
      category,
    },
  });
});

const deleteCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const category = await Category.findByIdAndDelete(id);

  if (!category) {
    return next(
      new AppError('No category found with the provided ID', 404),
    );
  }

  res.status(204).send();
});

export {
  createCategory,
  getAllCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
