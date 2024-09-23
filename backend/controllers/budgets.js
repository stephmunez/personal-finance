const Budget = require('../models/Budget');
const { StatusCodes } = require('http-status-codes');

const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({});
    res.status(StatusCodes.OK).send({ budgets, count: budgets.length });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).send({ message: error.message });
  }
};

const getBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const budget = await Budget.findOne({ _id: id });
    res.status(StatusCodes.OK).send(budget);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).send({ error: error.message });
  }
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
  try {
    const budget = await Budget.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(StatusCodes.OK).send({ budget });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).send({ error: error.message });
  }
};

const deleteBudget = async (req, res) => {
  const { id } = req.params;
  try {
    const budget = await Budget.findOneAndDelete({
      _id: id,
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
