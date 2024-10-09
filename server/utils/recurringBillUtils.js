const moment = require('moment');
const RecurringBill = require('../models/RecurringBill');

const calculateNextDueDate = (frequency, fromDate) => {
  const start = moment(fromDate);
  let nextDueDate;

  switch (frequency) {
    case 'monthly':
      nextDueDate = start.add(1, 'months');
      break;
    case 'weekly':
      nextDueDate = start.add(1, 'weeks');
      break;
    case 'biweekly':
      nextDueDate = start.add(2, 'weeks');
      break;
    default:
      throw new Error('Invalid frequency');
  }

  return nextDueDate.toDate();
};

const createNextRecurringBill = async (bill) => {
  try {
    const today = new Date();
    const newDueDate = calculateNextDueDate(bill.frequency, today);

    const newBill = await RecurringBill.create({
      avatar: bill.avatar,
      name: bill.name,
      category: bill.category,
      amount: bill.amount,
      dueDate: newDueDate.getDate(),
      frequency: bill.frequency,
      status: 'due',
      startDate: today,
    });

    bill.nextDueDate = newDueDate;
    await bill.save();

    return newBill;
  } catch (error) {
    throw new Error('Failed to create next recurring bill');
  }
};

module.exports = { createNextRecurringBill, calculateNextDueDate };
