const express = require('express');

function routes(Book) {
  const bookRouter = express.Router();
  bookRouter.route('/books')
    .post((req, res) => {
      const book = new Book(req.body);

      book.save(book);
      return res.status(201).json(book);
    })
    .get((req, res) => {
      const query = {};
      if (req.query.genre) {
        query.genre = req.query.genre;
      }
      Book.find(query, (err, books) => {
        if (err) {
          return res.send(err);
        }
        return res.json(books);
      });
    });
  bookRouter.use('/books/:bookId', (req, res, next) => {
    Book.findById(req.params.bookId, (err, books) => {
      if (err) {
        return res.send(err);
      }
      if (books) {
        req.books = books;
        return next();
      }
      return res.sendStatus(404);
    });
  });

  bookRouter.route('/books/:bookId')
    .get((req, res) => res.json(req.books))
    .put((req, res) => {
      const books = { req }
      books.title = req.body.title;
      books.author = req.body.author;
      books.genre = req.body.genre;
      books.read = req.body.read;
      req.books.save((err) => {
        if (err) {
          return res.send(err);
        }
        return res.json(books);
      });
    })
    .patch((req, res) => {
      const { books } = req;
      if (req.body._id) {
        delete req.body._id;
      }
      Object.entries(req.body).forEach((item) => {
        const key = item[0];
        const value = item[1];
        books[key] = value;
      });
      req.books.save((err) => {
        if (err) {
          return res.send(err);
        }
        return res.json(books);
      });
    })
    .delete((req, res) => {
      req.books.remove((err) => {
        if (err) {
          return res.send(err);
        }
        return res.sendStatus(204);
      });
    });

  return bookRouter;
}

module.exports = routes;

