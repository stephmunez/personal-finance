const mongoose = require('mongoose');
const { Schema } = mongoose;

const financeSchema = new Schema({
  balance: {
    type: Schema.Types.ObjectId,
    ref: 'Balance',
  },
  transactions: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Transaction',
    },
  ],
  budgets: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Budget',
    },
  ],
  pots: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Pot',
    },
  ],
});

const Finance = mongoose.model('Finance', financeSchema);
module.exports = Finance;
