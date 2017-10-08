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
  },
  address: {
    city: String,
    state: String,
    country: String
  }
});

userSchema.statics.encryptPassword = function encryptPassword(password) {
  return bcrypt.hashSync(password, SALT_ROUNDS);
};

userSchema.methods.verifyPassword = function verifyPassword(password) {
  return bcrypt.compareSync(password, this.local.password);
};

userSchema.methods.format = function format() {
  const user = {};

  if (this.local.email) {
    user.local = {
      name: this.local.name,
      email: this.local.email
    };
  } else {
    user.twitter = {
      displayName: this.twitter.displayName,
      username: this.twitter.username
    };
  }
  user.address = this.address;

  return user;
};

userSchema.methods.setAddress = function setAddress(address, callback) {
  this.address = address;
  this.save(callback);
};

module.exports = userSchema;
