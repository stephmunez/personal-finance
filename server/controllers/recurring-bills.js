const mongoose = require('mongoose');
const RecurringBill = require('../models/RecurringBill');
const { StatusCodes } = require('http-status-codes');

const calculateNextDueDate = (frequency, startDate) => {
  const date = new Date(startDate);
  switch (frequency) {
    case 'weekly':
      date.setDate(date.getDate() + 7);
      break;
    case 'biweekly':
      date.setDate(date.getDate() + 14);
      break;
    case 'monthly':
      date.setMonth(date.getMonth() + 1);
      break;
    default:
      throw new Error('Invalid frequency');
  }
  return date;
};

const getRecurringBills = async (req, res) => {
  try {
    const recurringBills = await RecurringBill.find({}).sort({ createdAt: -1 });
    res
      .status(StatusCodes.OK)
      .send({ recurringBills, count: recurringBills.length });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).send({ error: error.message });
  }
};

const getRecurringBill = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .send({ error: `No recurring bill with id ${id}` });
  }

  const recurringBill = await RecurringBill.findOne({ _id: id });

  if (!recurringBill) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .send({ error: `No bill with id ${id}` });
  }

  res.status(StatusCodes.OK).send(recurringBill);
};

const createRecurringBill = async (req, res) => {
  try {
    const { frequency, startDate } = req.body;

    const nextDueDate = calculateNextDueDate(frequency, startDate);

    const recurringBill = await RecurringBill.create({
      ...req.body,
      nextDueDate,
    });

    res.status(StatusCodes.CREATED).send(recurringBill);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).send({ error: error.message });
  }
};

const updateRecurringBill = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .send({ error: `No recurring bill with id ${id}` });
  }

  try {
    const { frequency, startDate } = req.body;

    const updatedData = {
      ...req.body,
      nextDueDate: calculateNextDueDate(frequency, startDate),
    };

    const recurringBill = await RecurringBill.findOneAndUpdate(
      { _id: id },
      updatedData,
      { new: true, runValidators: true }
    );

    if (!recurringBill) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send({ error: `No bill with id ${id}` });
    }

    res.status(StatusCodes.OK).send(recurringBill);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).send({ error: error.message });
  }
};

const deleteRecurringBill = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .send({ error: `No recurring bill with id ${id}` });
  }

  try {
    const recurringBill = await RecurringBill.findOneAndDelete({ _id: id });

    if (!recurringBill) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send({ error: `No bill with id ${id}` });
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
