import express from 'express';
import * as bookConteroller from './book.controller.js';

const bookRouter = express.Router();

bookRouter
  .route('/')
  .post(bookConteroller.createBook)
  .get(bookConteroller.getAllBooks);

bookRouter
  .route('/:id')
  .get(bookConteroller.getBook)
  .patch(bookConteroller.updateBook)
  .delete(bookConteroller.deleteBook);

export default bookRouter;
