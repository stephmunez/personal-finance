const Balance = require('../models/Balance');
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const Pot = require('../models/Pot');
const { StatusCodes } = require('http-status-codes');

const getOverview = async (req, res) => {
  try {
    const balance = await Balance.findOne({});
    const transactions = await Transaction.find({});
    const budgets = await Budget.find({});
    const pots = await Pot.find({});

    const overview = {
      balance,
      transactions,
      budgets,
      pots,
    };

    // Send the overview data
    res.status(StatusCodes.OK).json(overview);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

module.exports = { getOverview };
