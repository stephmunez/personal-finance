const mongoose = require('mongoose');
const { Schema } = mongoose;

const budgetSchema = new Schema(
  {
    category: {
      type: String,
      required: true,
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
    },
    maximum: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Budget = mongoose.model('Budget', budgetSchema);
module.exports = Budget;
