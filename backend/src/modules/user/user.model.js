import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: [true, 'First name is required.'],
      minlength: [3, 'First name must be at least 3 characters.'],
      maxlength: [25, 'First name must not exceed 25 characters.'],
    },
    secondName: {
      type: String,
      trim: true,
      minlength: [3, 'Second name must be at least 3 characters.'],
      maxlength: [25, 'Second name must not exceed 25 characters.'],
    },
    email: {
      type: String,
      trim: true,
      unique: [true, 'Email is already in use.'],
      lowercase: true,
      required: [true, 'Email is required.'],
    },
    password: {
      type: String,
      required: [true, 'Password is required.'],
      minlength: [8, 'Password must be at least 8 characters long.'],
      maxlength: [30, 'Password must not exceed 30 characters.'],
    },
    img: String,
    role: {
      type: String,
      enum: {
        values: ['admin', 'user'],
        message: 'Role must be either: admin, user.',
      },
      default: 'user',
    },
    savedBooks: {
      type: [
        {
          book: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Book',
            required: [true, 'Book is required.'],
          },
          savedAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model('User', userSchema);

export default User;
