const Schema = require('mongoose').Schema;
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

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
  }
});

userSchema.index({ email: 1 });

userSchema.statics.encryptPassword = function encryptPassword(password) {
  return bcrypt.hashSync(password, SALT_ROUNDS);
};

userSchema.methods.verifyPassword = function verifyPassword(password) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.methods.addPoll = function addPoll(poll, cb) {
  this.polls.push(poll);
  this.save(cb);
};

module.exports = userSchema;
