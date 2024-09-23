require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const overviewRouter = require('./routes/overview.js');
const balanceRouter = require('./routes/balance.js');
const transactionsRouter = require('./routes/transactions');
const budgetsRouter = require('./routes/budgets');
const potsRouter = require('./routes/pots');
const recurringBillsRouter = require('./routes/recurring-bills');

// express app
const app = express();

// middleware
app.use(express.json());
app.use(morgan('dev'));

// routes
app.use('/api/v1/overview', overviewRouter);
app.use('/api/v1/balance', balanceRouter);
app.use('/api/v1/transactions', transactionsRouter);
app.use('/api/v1/budgets', budgetsRouter);
app.use('/api/v1/pots', potsRouter);
app.use('/api/v1/recurring-bills', recurringBillsRouter);

// connect to db
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    // listen for requests
    app.listen(process.env.PORT, () => {
      console.log(`listening on port ${process.env.PORT}..`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
