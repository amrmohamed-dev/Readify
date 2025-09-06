import express from 'express';
import * as reviewConteroller from './review.controller.js';

const reviewRouter = express.Router();

reviewRouter
  .route('/')
  .post(reviewConteroller.createReview)
  .get(reviewConteroller.getAllReviews);

reviewRouter
  .route('/:id')
  .get(reviewConteroller.getReview)
  .patch(reviewConteroller.updateReview)
  .delete(reviewConteroller.deleteReview);

export default reviewRouter;
