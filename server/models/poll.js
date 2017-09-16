const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  options: {
    type: [String],
    required: true
  }
});

pollSchema.index({ title: 1 });

module.exports = pollSchema;
