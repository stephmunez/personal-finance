const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');
const { StatusCodes } = require('http-status-codes');

// Get all budgets
router.get('/', (req, res) => {
  res.send('Get all budgets');
});

// Get a specific budget by ID
router.get('/:id', (req, res) => {
  res.send('Get a specific budget');
});

// Fetch the latest three transactions for a specific budget category
router.get('/:id/transactions', (req, res) => {
  res.send('Fetch the latest three transactions for a budget category');
});

// Create a new budget
router.post('/', async (req, res) => {
  try {
    const budget = await Budget.create(req.body);
    res.status(StatusCodes.OK).send(budget);
  } catch (error) {
    console.log(error);
  }
});

// Update an existing budget by ID
router.patch('/:id', (req, res) => {
  res.send('Update an existing budget');
});

// Delete a budget by ID
router.delete('/:id', (req, res) => {
  res.send('Delete a budget');
});

module.exports = router;
