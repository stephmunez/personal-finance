const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// static sign up method
userSchema.statics.signUp = async function (
  firstName,
  lastName,
  email,
  password
) {
  // validation

  if (!validator.isStrongPassword(password)) {
    throw Error('Password not strong enough');
  }

  const exists = await this.findOne({ email });

  if (exists) {
    throw Error('Email already in use.');
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({
    firstName,
    lastName,
    email,
    password: hash,
  });

  return user;
};

// static login method
userSchema.statics.login = async function (email, password) {
  // validation
  const user = await this.findOne({ email });

  if (!user) {
    throw Error('Email does not exist');
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw Error('Password is not correct');
  }

  return user;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
