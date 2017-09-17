const Schema = require('mongoose').Schema;
const pollSchema = require('./poll');

const userSchema = new Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    bcrypt: true
  },
  polls: [pollSchema]
});

userSchema.index({ email: 1 });

userSchema.plugin(require('mongoose-bcrypt'));

module.exports = userSchema;
