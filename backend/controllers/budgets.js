const Budget = require('../models/Budget');
const { StatusCodes } = require('http-status-codes');

const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({});
    res.status(StatusCodes.OK).send(budgets);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).send({ message: error.message });
  }
};

const getBudget = async (req, res) => {
  try {
    const { params } = req;
    const budget = await Budget.findOne({ _id: params.id });
    res.status(StatusCodes.OK).send(budget);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).send({ error: error.message });
  }
};

const createBudget = async (req, res) => {
  const { body } = req;
  try {
    const budget = await Budget.create(body);
    res.status(StatusCodes.OK).send(budget);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).send({ error: error.message });
  }
};

const updateBudget = async (req, res) => {
  const { params } = req;
  try {
    const budget = await Budget.findOneAndUpdate({ _id: params.id }, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(StatusCodes.OK).send({ budget });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).send({ error: error.message });
  }
};

const deleteBudget = async (req, res) => {
  const { params } = req;
  try {
    const budget = await Budget.findOneAndDelete({
      _id: params.id,
    });
    res.status(StatusCodes.OK).send();
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
