const mongoose = require('mongoose');
const { Schema } = mongoose;

const recurringBillSchema = new Schema(
  {
    avatar: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    dueDate: {
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
      default: 'due',
    },
    startDate: {
      type: Date,
      required: true,
    },
    nextDueDate: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true }
);

const RecurringBill = mongoose.model('RecurringBill', recurringBillSchema);
module.exports = RecurringBill;
