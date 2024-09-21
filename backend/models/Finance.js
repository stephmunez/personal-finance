const mongoose = require('mongoose');
const { Schema } = mongoose;

// Schema for Balance
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

// Schema for Transactions
const transactionSchema = new Schema({
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
  date: {
    type: Date,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  recurring: {
    type: Boolean,
    required: true,
  },
});

// Schema for Budgets
const budgetSchema = new Schema({
  category: {
    type: String,
    required: true,
  },
  maximum: {
    type: Number,
    required: true,
  },
  theme: {
    type: String,
    required: true,
  },
});

// Schema for Pots
const potSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  target: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  theme: {
    type: String,
    required: true,
  },
});

// Main Schema that includes the balance, transactions, budgets, and pots
const financeSchema = new Schema({
  balance: balanceSchema,
  transactions: [transactionSchema],
  budgets: [budgetSchema],
  pots: [potSchema],
});

// Create and export the model
const Finance = mongoose.model('Finance', financeSchema);
module.exports = Finance;
