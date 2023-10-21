const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const db = require('../sequelize/models'); 
const book = require('../sequelize/models/book');
const borrower = require('../sequelize/models/borrower');
const Borrowing = db.Borrowing;
const Book = db.Book;
const Borrower = db.Borrower;

// Validation middleware for checking out books
const validateBorrowing = [
    check('bookId')
      .notEmpty()
      .withMessage('bookId is required')
      .isLength({ min: 13, max: 13 })
      .withMessage('bookId must be 13 characters'),
    check('borrowerId').isNumeric().withMessage('Invalid borrower ID'),
  ];


// Error handling middleware for validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  };

  
// Check out a book
router.post('/checkout', validateBorrowing, handleValidationErrors, async (req, res) => {
    const { bookId, borrowerId } = req.body;
  
    try {
      const book = await Book.findOne({where : {isbn: bookId}});
      const borrower = await Borrower.findByPk(borrowerId);
  
      if (!book || !borrower) {
        return res.status(404).json({ error: 'Book or borrower not found' });
      }
  
      // Additional validation (e.g., checking if the book is already checked out is added here)
      const currentDate = new Date();
      const dueDate = new Date(currentDate);
      dueDate.setDate(currentDate.getDate() + 14);

      const borrowing = await Borrowing.create({
        bookId: book.isbn,
        borrowerId: borrower.borrowerId,
        checkoutDate: new Date(),
        dueDate: dueDate
      });
  
      res.status(201).json(borrowing);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

// Return a book
router.post('/return', validateBorrowing, handleValidationErrors, async (req, res) => {
    const { bookId, borrowerId } = req.body;
  
    try {
      const book = await Book.findOne({where : {isbn: bookId}});
      const borrower = await Borrower.findByPk(borrowerId);
  
      if (!book || !borrower) {
        return res.status(404).json({ error: 'Book or borrower not found' });
      }
  
      // Additional validation (checking if the book is currently checked out by the borrower)
      const borrowing = await Borrowing.findOne({
        where: {
          bookId: book.isbn,
          borrowerId: borrower.borrowerId,
          returnDate: null, // Check for checked-out books
        },
      });
  
      if (!borrowing) {
        return res.status(404).json({ error: 'Book is not checked out by the borrower' });
      }
  
      // Additional validation to check if the return date is within the due date
      const currentDate = new Date();
      if (borrowing.dueDate < currentDate) {
        return res.status(400).json({ error: 'Book is returned overdue' });
      }
  
      borrowing.returnDate = currentDate;
      await borrowing.save();
  
      // Update the book's availability
      book.availability = true;
      await book.save();
  
      res.json(borrowing);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
// Get a list of all borrowings
router.get('/', async (req, res) => {
    const borrowings = await Borrowing.findAll();
    res.json(borrowings);
  });

// Get a list of all overdue borrowings
router.get('/overdue', async (req, res) => {
    try {
      const currentDate = new Date();
      const overdueBorrowings = await Borrowing.findAll({
        where: {
          returnDate: null, // Book hasn't been returned
          dueDate: { [Sequelize.Op.lt]: currentDate }, // Due date is in the past
        },
        include: [{ model: book}, { model: borrower }],
      });
  
      res.json(overdueBorrowings);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

// Get a list of books currently borrowed by a specific borrower
router.get('/current-borrowings/:borrowerId', async (req, res) => {
    const borrowerId = req.params.borrowerId;
  
    try {
      // Find the borrower by their ID
      const borrower = await Borrower.findByPk(borrowerId);
      if (!borrower) {
        return res.status(404).json({ error: 'Borrower not found' });
      }
  
      // Find all borrowings associated with the borrower where the return date is null
      const currentBorrowings = await Borrowing.findAll({
        where: {
          borrowerId: borrower.borrowerId,
          returnDate: null,
        },
        include: [{ model: Book }],
      });
  
      res.json(currentBorrowings);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  