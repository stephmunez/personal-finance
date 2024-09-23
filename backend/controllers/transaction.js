const Transaction = require('../models/Transaction');
const { StatusCodes } = require('http-status-codes');

const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({});

    res.status(StatusCodes.OK).send(transactions);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).send({ message: error.message });
  }
};

module.exports = { getTransactions };
