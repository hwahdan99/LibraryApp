const express = require('express');
const { Sequelize } = require('sequelize');

const router = express.Router();
const { check, validationResult } = require('express-validator');
const db = require("../sequelize/models");
const Book = db.Book;

const sequelize = new Sequelize('postgres://postgres:postgres@127.0.0.1:5432/library')



const validateBook = [
    check('title').notEmpty().withMessage('Title is required'),
    check('author').notEmpty().withMessage('Author is required'),
    check('isbn')
      .notEmpty()
      .withMessage('ISBN is required')
      .isLength({ min: 13, max: 13 })
      .withMessage('ISBN must be 13 characters'),
    check('availability').notEmpty().withMessage('Availability is required'),
    check('shelfLocation').notEmpty().withMessage('Shelf Location is required'),
];

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  };

  // Create a book
router.post('/', validateBook, handleValidationErrors, async (req, res) => {
    try {
      const book = await Book.create(req.body);
      res.status(201).json(book);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

//Update a Book
router.put('/:isbn', validateBook, handleValidationErrors, async (req, res) => {
    try {
        const book = await Book.findOne({where : {isbn: req.params.isbn}});
        if (!book) {
          return res.status(404).json({ error: 'Book not found' });
        }
        await book.update(req.body);
        res.json(book);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }

});

//Delete a Book
router.put('/:isbn', validateBook, handleValidationErrors, async (req, res) => {
    try {
        const book = await Book.findOne({where : {isbn: req.params.isbn}});
        if (!book) {
          return res.status(404).json({ error: 'Book not found' });
        }
        await book.destrroy();
        res.json({message: 'Book deleted successfully'});
      } catch (err) {
        res.status(500).json({ error: err.message });
      }

});


// Get a list of all books
router.get('/', async (req, res) => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
    const books = await Book.findAll();
    res.json(books);
  });

// Search for a book by title, author, or ISBN
router.get('/search', async (req, res) => {
    const { title, author, isbn } = req.query;
    const whereClause = {};
    if (title) whereClause.title = title;
    if (author) whereClause.author = author;
    if (isbn) whereClause.isbn = isbn;
  
    const books = await Book.findAll({ where: whereClause });
    res.json(books);
  });
  
  module.exports = router;