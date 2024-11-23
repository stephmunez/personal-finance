const mongoose = require('mongoose');

// login
const loginUser = async (req, res) => {
  res.send({ message: 'login user' });
};

// sign up
const signUpUser = async (req, res) => {
  res.send({ message: 'sign up user' });
};

module.exports = { loginUser, signUpUser };
