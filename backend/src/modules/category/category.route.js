import express from 'express';
import * as categoryConteroller from './category.controller.js';

const categoryRouter = express.Router();

categoryRouter
  .route('/')
  .post(categoryConteroller.createCategory)
  .get(categoryConteroller.getAllCategories);

categoryRouter
  .route('/:id')
  .get(categoryConteroller.getCategory)
  .patch(categoryConteroller.updateCategory)
  .delete(categoryConteroller.deleteCategory);

export default categoryRouter;
