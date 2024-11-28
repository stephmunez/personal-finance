const mongoose = require('mongoose');
const Pot = require('../models/Pot');
const { StatusCodes } = require('http-status-codes');

const getPots = async (req, res) => {
  const pots = await Pot.find({}).sort({ createdAt: -1 });
  res.status(StatusCodes.OK).send({ pots, count: pots.length });
};

const getPot = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .send({ error: `No pot with id ${id}` });
  }

  const pot = await Pot.findOne({ _id: id });

  if (!pot) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .send({ error: `No job with id ${id}` });
  }

  res.status(StatusCodes.OK).send(pot);
};

const createPot = async (req, res) => {
  try {
    const user_id = req.user._id;
    const pot = await Pot.create({ ...req.body, user_id });
    res.status(StatusCodes.OK).send(pot);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).send({ error: error.message });
  }
};

const updatePot = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .send({ error: `No pot with id ${id}` });
  }

  try {
    const pot = await Pot.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
      runValidators: true,
    });

    if (!pot) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send({ error: `No job with id ${id}` });
    }

    res.status(StatusCodes.OK).send({ pot });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).send({ error: error.message });
  }
};

const deletePot = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .send({ error: `No pot with id ${id}` });
  }

  try {
    const pot = await Pot.findOneAndDelete({
      _id: id,
    });

    if (!pot) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send({ error: `No job with id ${id}` });
    }

    res.status(StatusCodes.OK).send(pot);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).send({ error: error.message });
  }
};

module.exports = {
  getPots,
  getPot,
  createPot,
  updatePot,
  deletePot,
};
