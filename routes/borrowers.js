const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const db = require("../sequelize/models");
const Borrower = db.Borrower;

// Validation middleware for creating and updating borrowers
const validateBorrower = [
  check('name').notEmpty().withMessage('Name is required'),
  check('email').isEmail().withMessage('Invalid email address'),
];

// Error handling middleware for validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Create a borrower
router.post('/', validateBorrower, handleValidationErrors, async (req, res) => {
  try {
    const borrower = await Borrower.create(req.body);
    res.status(201).json(borrower);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a borrower
router.put('/:borrowerId', validateBorrower, handleValidationErrors, async (req, res) => {
  try {
    const borrower = await Borrower.findByPk(req.params.borrowerId);
    if (!borrower) {
      return res.status(404).json({ error: 'Borrower not found' });
    }
    await borrower.update(req.body);
    res.json(borrower);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a borrower
router.delete('/:borrowerId', async (req, res) => {
  try {
    const borrower = await Borrower.findByPk(req.params.borrowerId);
    if (!borrower) {
      return res.status(404).json({ error: 'Borrower not found' });
    }
    await borrower.destroy();
    res.json({ message: 'Borrower deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a list of all borrowers
router.get('/', async (req, res) => {
  const borrowers = await Borrower.findAll();
  res.json(borrowers);
});

module.exports = router;
