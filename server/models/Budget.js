const mongoose = require('mongoose');
const { Schema } = mongoose;

const categories = [
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
];

const budgetSchema = new Schema(
  {
    category: {
      type: String,
      required: true,
      enum: categories,
    },
    maximum: {
      type: Number,
      required: true,
    },
    user_id: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

budgetSchema.pre('save', async function (next) {
  const budgetCount = await Budget.countDocuments();
  if (budgetCount >= categories.length) {
    const error = new Error(`All categories are used`);
    error.statusCode = 400;
    return next(error);
  }
  next();
});

const Budget = mongoose.model('Budget', budgetSchema);
module.exports = Budget;
