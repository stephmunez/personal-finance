const Transaction = require('../models/Transaction');
const { StatusCodes } = require('http-status-codes');

const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({});
    res
      .status(StatusCodes.OK)
      .send({ transactions, count: transactions.length });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).send({ message: error.message });
  }
};

const getTransaction = async (req, res) => {
  try {
    const { params } = req;
    const transaction = await Transaction.findOne({ _id: params.id });
    res.status(StatusCodes.OK).send(transaction);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).send({ error: error.message });
  }
};

const createTransaction = async (req, res) => {
  const { body } = req;
  try {
    const transaction = await Transaction.create(body);
    res.status(StatusCodes.OK).send(transaction);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).send({ error: error.message });
  }
};

const updateTransaction = async (req, res) => {
  const { params } = req;
  try {
    const transaction = await Transaction.findOneAndUpdate(
      { _id: params.id },
      req.body,
      { new: true, runValidators: true }
    );
    res.status(StatusCodes.OK).send({ transaction });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).send({ error: error.message });
  }
};

const deleteTransaction = async (req, res) => {
  const { params } = req;
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: params.id,
    });
    res.status(StatusCodes.OK).send();
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).send({ error: error.message });
  }
};

module.exports = {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
