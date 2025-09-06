import mongoose from 'mongoose';
import slugify from 'slugify';

const bookSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      required: [true, 'Name is required.'],
      minlength: [3, 'Name must be at least 3 characters.'],
      maxlength: [50, 'Name must not exceed 50 characters.'],
    },
    slug: {
      type: String,
      lowercase: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
      minlength: [10, 'Description must be at least 10 characters.'],
      maxlength: [500, 'Description must not exceed 500 characters.'],
      required: [true, 'Description is required.'],
    },
    imageCover: {
      type: String,
      required: [true, 'Image cover is required.'],
    },
    authorName: {
      type: String,
      trim: true,
      required: [true, 'Author is required.'],
      minlength: [7, 'Author must be at least 7 characters.'],
      maxlength: [50, 'Author must not exceed 50 characters.'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required.'],
    },
    language: {
      type: String,
      enum: {
        values: ['arabic', 'english', 'french'],
        message: 'Language must be either: Arabic, English, French.',
      },
      required: [true, 'Language is required.'],
    },
    file: {
      type: String,
      required: [true, 'File is required.'],
    },
    ratingAverage: {
      type: Number,
      min: [0, 'RatingAverage must be positive.'],
      max: [5, 'RatingAverage must not exceed 5.'],
      default: 0,
    },
    ratingQuantity: {
      type: Number,
      min: [0, 'RatingQuantity must be positive.'],
      default: 0,
    },
    downloadQuantity: {
      type: Number,
      min: [0, 'DownloadQuantity must be positive.'],
      default: 0,
    },
    usersDownload: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  },
);

function generateSlug(name) {
  return slugify(name, { lower: true });
}

bookSchema.pre('save', function (next) {
  if (this.name) {
    this.slug = generateSlug(this.name);
  }
  next();
});

bookSchema.pre('findOneAndUpdate', function (next) {
  const { name } = this.getUpdate();
  if (name) {
    this.set({ slug: generateSlug(name) });
  }
  next();
});

bookSchema.index({ slug: 1 });

const Book = mongoose.model('Book', bookSchema);

export default Book;
