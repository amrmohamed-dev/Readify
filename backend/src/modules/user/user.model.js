import crypto from 'crypto';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

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
      minlength: [8, 'Password must be at least 8 characters long.'],
      maxlength: [30, 'Password must not exceed 30 characters.'],
      required: [true, 'Password is required.'],
      select: false,
    },
    passwordChangedAt: Date,
    passwordReset: {
      otp: String,
      otpExpires: Date,
    },
    emailVerification: {
      token: String,
      tokenExpires: Date,
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
    isActive: {
      type: Boolean,
      default: true,
      select: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() + 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ isActive: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generatePasswordResetOtp = function () {
  const otp = crypto.randomInt(100000, 900000).toString();
  this.passwordReset.otp = crypto
    .createHash('sha256')
    .update(otp)
    .digest('hex');
  this.passwordReset.otpExpires = Date.now() + 15 * 60 * 1000;
  return otp;
};

userSchema.methods.generateEmailVerificationToken = function () {
  const verificationToken = crypto.randomBytes(32).toString('hex');
  this.emailVerification.token = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');
  this.emailVerification.tokenExpires = Date.now() + 10 * 60 * 1000;
  return verificationToken;
};

const User = mongoose.model('User', userSchema);

export default User;
