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

const createTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.create(req.body);
    res.status(StatusCodes.OK).send(transaction);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).send({ error: error.message });
  }
};

const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    res.status(StatusCodes.OK).send({ transaction });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).send({ error: error.message });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
    });
    res.status(StatusCodes.OK).send();
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).send({ error: error.message });
  }
};

module.exports = {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
