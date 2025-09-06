import mongoose from 'mongoose';
import slugify from 'slugify';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      minlength: [2, 'Name must be at least 2 characters.'],
      maxlength: [50, 'Name must not exceed 50 characters.'],
      required: [true, 'Name is required.'],
    },
    slug: {
      type: String,
      lowercase: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [300, 'Description must not exceed 300 characters.'],
    },
  },
  {
    timestamps: true,
  },
);

function generateSlug(name) {
  return slugify(name, { lower: true });
}

categorySchema.pre('save', function (next) {
  if (this.name) {
    this.slug = generateSlug(this.name);
  }
  next();
});

categorySchema.pre('findOneAndUpdate', function (next) {
  const { name } = this.getUpdate();
  if (name) {
    this.set({ slug: generateSlug(name) });
  }
  next();
});

categorySchema.index({ slug: 1 });

const Category = mongoose.model('Category', categorySchema);

export default Category;
