const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} = require('../controllers/transaction');

router.get('/', getTransactions);
router.post('/', createTransaction);
router.patch('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

module.exports = router;
