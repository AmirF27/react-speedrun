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
  // bars user is going to (for nightlife coordination app)
  bars: [{
    barId: String,
    date: Date,
    _id: false
  }]
});

userSchema.statics.encryptPassword = function encryptPassword(password) {
  return bcrypt.hashSync(password, SALT_ROUNDS);
};

userSchema.methods.verifyPassword = function verifyPassword(password) {
  return bcrypt.compareSync(password, this.local.password);
};

userSchema.methods.addBar = function addBar(barId, callback) {
  if (this.barExists(barId)) return callback();

  this.
    update({
      $push: { bars: { barId, date: Date.now() } }
    }).
    exec(callback);
};

userSchema.methods.barExists = function barExists(barId) {
  return this.bars.findIndex(bar => bar.barId == barId) >= 0;
};

module.exports = userSchema;
