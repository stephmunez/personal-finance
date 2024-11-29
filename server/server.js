require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const overviewRouter = require('./routes/overview.js');
const balanceRouter = require('./routes/balance.js');
const transactionsRouter = require('./routes/transactions');
const budgetsRouter = require('./routes/budgets');
const potsRouter = require('./routes/pots');
const recurringBillsRouter = require('./routes/recurring-bills');
const userRouter = require('./routes/user');
require('./utils/scheduler');
const requireAuth = require('./middleware/requireAuth');

// express app
const app = express();

// middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

// routes
app.use('/api/v1/overview', requireAuth, overviewRouter);
app.use('/api/v1/balance', requireAuth, balanceRouter);
app.use('/api/v1/transactions', requireAuth, transactionsRouter);
app.use('/api/v1/budgets', requireAuth, budgetsRouter);
app.use('/api/v1/pots', requireAuth, potsRouter);
app.use('/api/v1/recurring-bills', requireAuth, recurringBillsRouter);
app.use('/api/v1/user', userRouter);

const port = process.env.PORT || 4000;

// connect to db
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    // listen for requests
    app.listen(port, () => {
      console.log(`listening on port ${process.env.PORT}..`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
