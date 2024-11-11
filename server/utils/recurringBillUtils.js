const moment = require('moment');
const RecurringBill = require('../models/RecurringBill');

const calculateNextDueDate = (frequency, fromDate) => {
  const start = moment(fromDate);
  let nextDueDate;

  switch (frequency) {
    case 'monthly':
      nextDueDate = start.add(1, 'months'); // Add 1 month for monthly bills
      break;
    case 'weekly':
      nextDueDate = start.add(1, 'weeks'); // Add 1 week for weekly bills
      break;
    case 'biweekly':
      nextDueDate = start.add(2, 'weeks'); // Add 2 weeks for biweekly bills
      break;
    default:
      throw new Error('Invalid frequency');
  }

  return nextDueDate.toDate(); // Return as a full date object
};

const createNextRecurringBill = async (bill) => {
  try {
    const today = new Date();
    const newDueDate = calculateNextDueDate(bill.frequency, today);

    let newAmount = bill.amount;
    if (bill.status !== 'paid') {
      newAmount += bill.amount; // Double the amount if the bill wasn't paid
    }

    // Delete the current bill (the old one)
    await RecurringBill.findByIdAndDelete(bill._id);

    // Create the new bill with the updated due date and new amount
    const newBill = await RecurringBill.create({
      name: bill.name,
      category: bill.category,
      amount: newAmount,
      dueDate: newDueDate, // Use the full date for dueDate
      frequency: bill.frequency,
      status: 'due',
    });

    // Update the original bill with the next due date
    bill.nextDueDate = newDueDate;
    await bill.save();

    return newBill; // Return the newly created bill
  } catch (error) {
    throw new Error('Failed to create next recurring bill');
  }
};

module.exports = { createNextRecurringBill, calculateNextDueDate };
