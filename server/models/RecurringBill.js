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
    amount: {
      type: Number,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    frequency: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: 'due',
    },
  },
  { timestamps: true }
);

const RecurringBill = mongoose.model('RecurringBill', recurringBillSchema);
module.exports = RecurringBill;
