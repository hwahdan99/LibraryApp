const express = require('express');
const router = express.Router();

const booksRouter = require('./books');
const borrowersRouter = require('./borrowers');
const borrowingRouter = require('./borrowing');

router.use('/books', booksRouter);
router.use('/borrowers', borrowersRouter);
router.use('/borrowing', borrowingRouter);

router.get('/', (req,res) => {
    res.send('Welcome to the Library Management System');
})

module.exports = router;