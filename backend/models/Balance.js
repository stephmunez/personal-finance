const mongoose = require('mongoose');
const { Schema } = mongoose;

const balanceSchema = new Schema({
  current: {
    type: Number,
    required: true,
  },
  income: {
    type: Number,
    required: true,
  },
  expenses: {
    type: Number,
    required: true,
  },
});

const Balance = mongoose.model('Balance', balanceSchema);
module.exports = Balance;
