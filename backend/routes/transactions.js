const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const {
  getTransactions,
  createTransaction,
} = require('../controllers/transaction');

router.get('/', getTransactions);

router.get('/search', (req, res) => {
  res.send('Search and filter transactions');
});

router.post('/', createTransaction);

router.patch('/:id', (req, res) => {
  res.send('Update an existing transaction');
});

router.delete('/:id', (req, res) => {
  res.send('Delete a transaction');
});

module.exports = router;
