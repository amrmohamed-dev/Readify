import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      trim: true,
      maxlength: [500, 'Comment must not exceed 500 characters'],
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be at least 1.'],
      max: [5, 'Rating must not exceed 5.'],
      required: [true, 'Rating is required.'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required.'],
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: [true, 'Book is required.'],
    },
  },
  {
    timestamps: true,
  },
);

const Review = mongoose.model('Review', reviewSchema);

export default Review;
