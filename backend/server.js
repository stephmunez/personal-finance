require('dotenv').config();
const express = require('express');
const morgan = require('morgan');

// express app
const app = express();

// middleware
app.use(morgan('dev'));

// routes
app.get('/', (req, res) => {
  res.send({ msg: 'personal finance app' });
});

// listen for requests
app.listen(process.env.PORT, () => {
  console.log('listening on port 4000..');
});
