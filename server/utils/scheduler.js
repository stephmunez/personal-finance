const cron = require('node-cron');
const RecurringBill = require('../models/RecurringBill');
const { createNextRecurringBill } = require('./recurringBillUtils');

cron.schedule('0 0 * * *', async () => {
  try {
    const today = new Date();
    const recurringBills = await RecurringBill.find({
      nextDueDate: {
        $lte: today,
      },
    });

    for (const bill of recurringBills) {
      await createNextRecurringBill(bill);
    }
  } catch (error) {
    console.error('Error creating next recurring bill:', error);
  }
});
