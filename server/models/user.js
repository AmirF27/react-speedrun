const Schema = require('mongoose').Schema;
const ObjectId = Schema.Types.ObjectId;
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

const userSchema = new Schema({
  local: {
    name: String,
    email: {
      type: String,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      bcrypt: true
    }
  },
  twitter: {
    id: String,
    token: String,
    username: String,
    displayName: String
  }
});

userSchema.statics.encryptPassword = function encryptPassword(password) {
  return bcrypt.hashSync(password, SALT_ROUNDS);
};

userSchema.methods.verifyPassword = function verifyPassword(password) {
  return bcrypt.compareSync(password, this.local.password);
};

module.exports = userSchema;
