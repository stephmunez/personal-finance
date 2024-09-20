const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Get all budgets');
});

router.get('/:id', (req, res) => {
  res.send('Get a specific budget');
});

router.get('/:id/transactions', (req, res) => {
  res.send('Fetch the latest three transactions for a budget category');
});

router.post('/', (req, res) => {
  res.send('Create a new budget');
});

router.patch('/:id', (req, res) => {
  res.send('Update an existing budget');
});

router.delete('/:id', (req, res) => {
  res.send('Delete a budget');
});

module.exports = router;
