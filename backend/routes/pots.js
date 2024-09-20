const express = require('express');
const router = express.Router();

// Get all pots
router.get('/', (req, res) => {
  res.send('Get all pots');
});

// Get a specific pot
router.get('/:id', (req, res) => {
  res.send('Get a specific pot');
});

// Create a new pot
router.post('/', (req, res) => {
  res.send('Create a new pot');
});

// Add money to a pot
router.patch('/:id/add', (req, res) => {
  res.send('Add money to a pot');
});

// Withdraw money from a pot
router.patch('/:id/withdraw', (req, res) => {
  res.send('Withdraw money from a pot');
});

// Update a pot (e.g. change its name or goal)
router.patch('/:id', (req, res) => {
  res.send('Update a pot');
});

// Delete a pot
router.delete('/:id', (req, res) => {
  res.send('Delete a pot');
});

module.exports = router;
