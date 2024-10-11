const mongoose = require('mongoose');
const { Schema } = mongoose;

const budgetSchema = new Schema(
  {
    category: {
      type: String,
      required: true,
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
