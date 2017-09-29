const Schema = require('mongoose').Schema;
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

const userSchema = new Schema({
  local: {
    name: String,
    email: {
      type: String,
      unique: true
    },
    password: {
      type: String,
      bcrypt: true
    }
  },
  twitter: {
    id: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true
    },
    displayName: String
  }
});

userSchema.index({ email: 1 });

userSchema.statics.encryptPassword = function encryptPassword(password) {
  return bcrypt.hashSync(password, SALT_ROUNDS);
};

userSchema.methods.verifyPassword = function verifyPassword(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = userSchema;
