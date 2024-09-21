const mongoose = require('mongoose');
const { Schema } = mongoose;

const potSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  target: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  theme: {
    type: String,
    required: true,
  },
});

const Pot = mongoose.model('Pot', potSchema);
module.exports = Pot;
