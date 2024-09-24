
const Transaction = require('../models/Transaction');
const { StatusCodes } = require('http-status-codes');

const getRecurringBills = async (req, res) => {
    const recurringBills = await Transaction.find({recurring: true}).sort({ createdAt: -1 });
    res.status(StatusCodes.OK).send({ recurringBills, count: recurringBills.length });
  };

module.exports = { getRecurringBills};
