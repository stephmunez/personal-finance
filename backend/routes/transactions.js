const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const { getTransactions } = require('../controllers/transaction');

router.get('/', getTransactions);

router.get('/search', (req, res) => {
  res.send('Search and filter transactions');
});

router.post('/', async (req, res) => {
  try {
    const transaction = await Transaction.create(req.body);
    res.status(StatusCodes.OK).send(transaction);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).send({ error: error.message });
  }
});

router.patch('/:id', (req, res) => {
  res.send('Update an existing transaction');
});

router.delete('/:id', (req, res) => {
  res.send('Delete a transaction');
});

module.exports = router;
