const express = require('express');
const router = express.Router();

// Get all recurring bills
router.get('/', (req, res) => {
  res.send('Get all recurring bills');
});

// Search and filter recurring bills
router.get('/search', (req, res) => {
  res.send('Search and filter recurring bills');
});

// Create a new recurring bill
router.post('/', (req, res) => {
  res.send('Create a new recurring bill');
});

// Update a recurring bill (e.g. change its name or goal)
router.patch('/:id', (req, res) => {
  res.send('Update a recurring bill');
});

// Delete a recurring bill
router.delete('/:id', (req, res) => {
  res.send('Delete a recurring bill');
});

module.exports = router;
