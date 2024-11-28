const mongoose = require('mongoose');
const { Schema } = mongoose;

const recurringBillSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: [
        'Entertainment',
        'Bills',
        'Groceries',
        'Dining Out',
        'Transportation',
        'Personal Care',
        'Education',
        'Lifestyle',
        'Shopping',
        'General',
      ],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    frequency: {
      type: String,
      enum: ['monthly', 'weekly', 'biweekly'],
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['due', 'paid'],
      default: 'due',
    },
    dueDate: {
      type: Date,
      required: true,
    },
    nextDueDate: {
      type: Date,
      required: false,
    },
    user_id: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const RecurringBill = mongoose.model('RecurringBill', recurringBillSchema);
module.exports = RecurringBill;
