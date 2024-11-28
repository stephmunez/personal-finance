const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');
const { StatusCodes } = require('http-status-codes');

const getTransactions = async (req, res) => {
  const { search, category, sort } = req.query;

  const queryObject = {};

  if (search) {
    queryObject.name = { $regex: search, $options: 'i' };
  }

  if (category && category !== 'All') {
    queryObject.category = category;
  }

  let sortOption = {};
  switch (sort) {
    case 'Latest':
      sortOption = { date: -1 };
      break;
    case 'Oldest':
      sortOption = { date: 1 };
      break;
    case 'A-Z':
      sortOption = { name: 1 };
      break;
    case 'Z-A':
      sortOption = { name: -1 };
      break;
    case 'Highest':
      sortOption = { amount: -1 };
      break;
    case 'Lowest':
      sortOption = { amount: 1 };
      break;
    default:
      sortOption = { createdAt: -1 };
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const transactions = await Transaction.find(queryObject)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    const totalTransactions = await Transaction.countDocuments(queryObject);

    res.status(StatusCodes.OK).send({
      transactions,
      count: totalTransactions,
      totalPages: Math.ceil(totalTransactions / limit),
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).send({ error: error.message });
  }
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
    const user_id = req.user._id;
    const transaction = await Transaction.create({ ...req.body, user_id });
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

    if (!transaction) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send({ error: `No job with id ${id}` });
    }

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

    if (!transaction) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send({ error: `No job with id ${id}` });
    }

    res.status(StatusCodes.OK).send(transaction);
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
