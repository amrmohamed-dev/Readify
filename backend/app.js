import express from 'express';
import morgan from 'morgan';
import queryString from 'qs';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import mongoSanitize from './src/middlewares/mongoSanitize.js';
import xssClean from './src/middlewares/xssClean.js';
import authRouter from './src/modules/auth/auth.route.js';
import userRouter from './src/modules/user/user.route.js';
import categoryRouter from './src/modules/category/category.route.js';
import bookRouter from './src/modules/book/book.route.js';
import reviewRouter from './src/modules/review/review.route.js';
import globalError from './src/utils/error/errorHandler.js';
import AppError from './src/utils/error/appError.js';

const app = express();

app.enable('trust proxy');

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(helmet());

app.use(cookieParser());
app.use(express.json({ limit: '2mb' }));

app.use(mongoSanitize);
app.use(xssClean);

app.set('query parser', (query) => queryString.parse(query));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/categories', categoryRouter);
app.use('/api/v1/books', bookRouter);
app.use('/api/v1/reviews', reviewRouter);

app.use((req, res, next) => {
  next(
    new AppError(
      `Can't find this route '${req.originalUrl}' on this server!`,
      404,
    ),
  );
});

app.use(globalError);

export default app;
