const mongoose = require('mongoose');
const { Schema } = mongoose;

const potSchema = new Schema(
  {
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
      enum: [
        '#277C78',
        '#F2CDAC',
        '#82C9D7',
        '#626070',
        '#C94736',
        '#826CB0',
        '#597C7C',
        '#93674F',
        '#934F6F',
        '#3F82B2',
        '#97A0AC',
        '#7F9161',
        '#AF81BA',
        '#CAB361',
        '#BE6C49',
      ],
    },
  },
  { timestamps: true }
);

const Pot = mongoose.model('Pot', potSchema);
module.exports = Pot;
