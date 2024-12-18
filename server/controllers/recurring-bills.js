const mongoose = require('mongoose');
const moment = require('moment');
const RecurringBill = require('../models/RecurringBill');
const { StatusCodes } = require('http-status-codes');
const { calculateNextDueDate } = require('../utils/recurringBillUtils');

const getRecurringBills = async (req, res) => {
  const user_id = req.user._id;
  const recurringBills = await RecurringBill.find({ user_id }).sort({
    createdAt: -1,
  });
  res
    .status(StatusCodes.OK)
    .send({ recurringBills, count: recurringBills.length });
};

const getRecurringBill = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .send({ error: `No recurring bill with id ${id}` });
  }

  const recurringBill = await RecurringBill.findOne({ _id: id, user_id });

  if (!recurringBill) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .send({ error: `No job with id ${id}` });
  }

  res.status(StatusCodes.OK).send(recurringBill);
};

const createRecurringBill = async (req, res) => {
  try {
    const { frequency, startDate } = req.body;
    const user_id = req.user._id;
    const nextDueDate = calculateNextDueDate(frequency, startDate);

    const recurringBill = await RecurringBill.create({
      ...req.body,
      nextDueDate,
      user_id,
    });
    res.status(StatusCodes.OK).send(recurringBill);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).send({ error: error.message });
  }
};

const updateRecurringBill = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .send({ error: `No recurring bill with id ${id}` });
  }

  try {
    const recurringBill = await RecurringBill.findOneAndUpdate(
      { _id: id, user_id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!recurringBill) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send({ error: `No job with id ${id}` });
    }

    res.status(StatusCodes.OK).send({ recurringBill });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).send({ error: error.message });
  }
};

const deleteRecurringBill = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .send({ error: `No recurring bill with id ${id}` });
  }

  try {
    const recurringBill = await RecurringBill.findOneAndDelete({
      _id: id,
      user_id,
    });

    if (!recurringBill) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send({ error: `No job with id ${id}` });
    }

    res.status(StatusCodes.OK).send(recurringBill);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).send({ error: error.message });
  }
};

module.exports = {
  getRecurringBills,
  getRecurringBill,
  createRecurringBill,
  updateRecurringBill,
  deleteRecurringBill,
  calculateNextDueDate,
};
