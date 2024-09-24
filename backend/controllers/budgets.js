const mongoose = require('mongoose');
const Budget = require('../models/Budget');
const { StatusCodes } = require('http-status-codes');

const getBudgets = async (req, res) => {
  const budgets = await Budget.find({}).sort({ createdAt: -1 });
  res.status(StatusCodes.OK).send({ budgets, count: budgets.length });
};

const getBudget = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .send({ error: `No budget with id ${id}` });
  }

  const budget = await Budget.findOne({ _id: id });

  if (!budget) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .send({ error: `No job with id ${id}` });
  }

  res.status(StatusCodes.OK).send(budget);
};

const createBudget = async (req, res) => {
  try {
    const budget = await Budget.create(req.body);
    res.status(StatusCodes.OK).send(budget);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).send({ error: error.message });
  }
};

const updateBudget = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .send({ error: `No budget with id ${id}` });
  }

  try {
    const budget = await Budget.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
      runValidators: true,
    });

    if (!budget) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send({ error: `No job with id ${id}` });
    }

    res.status(StatusCodes.OK).send({ budget });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).send({ error: error.message });
  }
};

const deleteBudget = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .send({ error: `No budget with id ${id}` });
  }

  try {
    const budget = await Budget.findOneAndDelete({
      _id: id,
    });

    if (!budget) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send({ error: `No job with id ${id}` });
    }

    res.status(StatusCodes.OK).send(budget);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).send({ error: error.message });
  }
};

module.exports = {
  getBudgets,
  getBudget,
  createBudget,
  updateBudget,
  deleteBudget,
};
