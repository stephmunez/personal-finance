const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' });
};

// login
const loginUser = async (req, res) => {
  res.send({ message: 'login user' });
};

// sign up
const signUpUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const user = await User.signUp(firstName, lastName, email, password);

    const token = createToken(user._id);

    res.status(StatusCodes.OK).send({ email, token });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).send({ error: error.message });
  }
};

module.exports = { loginUser, signUpUser };
