const cron = require('node-cron');
const RecurringBill = require('../models/RecurringBill');
const { calculateNextDueDate } = require('../controllers/recurring-bills');

// Schedule the task to run every day at midnight
cron.schedule('0 0 * * *', async () => {
  try {
    const today = new Date();

    const bills = await RecurringBill.find({
      nextDueDate: { $lte: today },
    });

    for (const bill of bills) {
      await RecurringBill.create({
        avatar: bill.avatar,
        name: bill.name,
        amount: bill.amount,
        category: bill.category,
        frequency: bill.frequency,
        dueDate: bill.dueDate,
        nextDueDate: calculateNextDueDate(bill.frequency, bill.nextDueDate),
        status: 'due',
        startDate: bill.startDate,
      });

      // Update the next due date of the existing bill
      bill.nextDueDate = calculateNextDueDate(bill.frequency, bill.nextDueDate);
      await bill.save();
    }

    console.log(`Checked and processed ${bills.length} bills.`);
  } catch (error) {
    console.error('Error processing bills:', error.message);
  }
});

module.exports = cron;
