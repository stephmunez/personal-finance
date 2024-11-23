const mongoose = require('mongoose');
const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');

// login
const loginUser = async (req, res) => {
  res.send({ message: 'login user' });
};

// sign up
const signUpUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const user = await User.signUp(firstName, lastName, email, password);

    res.status(StatusCodes.OK).send(user);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).send({ error: error.message });
  }

  res.send({ message: 'sign up user' });
};

module.exports = { loginUser, signUpUser };
