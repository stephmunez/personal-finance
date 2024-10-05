const express = require('express');
const router = express.Router();
const {
  getRecurringBills,
  getRecurringBill,
  createRecurringBill,
  updateRecurringBill,
  deleteRecurringBill,
} = require('../controllers/recurring-bills');

router.get('/', getRecurringBills);
router.get('/:id', getRecurringBill);
router.post('/', createRecurringBill);
router.patch('/:id', updateRecurringBill);
router.delete('/:id', deleteRecurringBill);

module.exports = router;
