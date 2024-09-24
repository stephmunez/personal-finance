const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');
const { StatusCodes } = require('http-status-codes');

const getTransactions = async (req, res) => {
  const transactions = await Transaction.find({}).sort({ createdAt: -1 });
  res.status(StatusCodes.OK).send({ transactions, count: transactions.length });
};

const getTransaction = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .send({ error: `No transaction with id ${id}` });
  }

  const transaction = await Transaction.findOne({ _id: id });

  if (!transaction) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .send({ error: `No job with id ${id}` });
  }

  res.status(StatusCodes.OK).send(transaction);
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
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .send({ error: `No transaction with id ${id}` });
  }

  try {
    const transaction = await Transaction.findOneAndUpdate(
      { _id: id },
      req.body,
      { new: true, runValidators: true }
    );
    res.status(StatusCodes.OK).send({ transaction });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).send({ error: error.message });
  }
};

const deleteTransaction = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .send({ error: `No transaction with id ${id}` });
  }

  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: id,
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
