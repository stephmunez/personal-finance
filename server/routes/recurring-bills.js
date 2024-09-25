const express = require('express');
const router = express.Router();
const { getRecurringBills } = require('../controllers/recurring-bills');

// Get all recurring bills
router.get('/', getRecurringBills);

module.exports = router;
