const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const { StatusCodes } = require('http-status-codes');

router.get('/', (req, res) => {
  res.send('Get all transactions');
});

router.get('/search', (req, res) => {
  res.send('Search and filter transactions');
});

router.post('/', async (req, res) => {
  try {
    const transaction = await Transaction.create(req.body);
    res.status(StatusCodes.OK).send(transaction);
  } catch (error) {
    console.log(error);
  }
});

router.patch('/:id', (req, res) => {
  res.send('Update an existing transaction');
});

router.delete('/:id', (req, res) => {
  res.send('Delete a transaction');
});

module.exports = router;
