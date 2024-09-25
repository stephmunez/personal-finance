const express = require('express');
const router = express.Router();
const Balance = require('../models/Balance');
const { StatusCodes } = require('http-status-codes');

// Get all balances
router.get('/', (req, res) => {
  res.send('Get all balance');
});

// Create a new balance
router.post('/', async (req, res) => {
  try {
    const balance = await Balance.create(req.body);
    res.status(StatusCodes.OK).send(balance);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).send({ error: error.message });
  }
});

// Update an existing balance by ID
router.patch('/:id', (req, res) => {
  res.send('Update an existing balance');
});

// Delete a balance by ID
router.delete('/:id', (req, res) => {
  res.send('Delete a balance');
});

module.exports = router;
