const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Get all transactions');
});

router.get('/search', (req, res) => {
  res.send('Search and filter transactions');
});

router.post('/', (req, res) => {
  res.send('Create a new transaction');
});

router.patch('/:id', (req, res) => {
  res.send('Update an existing transaction');
});

router.delete('/:id', (req, res) => {
  res.send('Delete a transaction');
});

module.exports = router;
