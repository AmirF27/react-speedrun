const mongoose = require('mongoose');
const urlSchema = require('./models/url');
const imageSchema = require('./models/image');
const pollSchema = require('./models/poll');
const userSchema = require('./models/user');

module.exports = function(wagner) {
  if (!process.env.DB_PATH) {
    console.error('Database path not set');
    process.exit(1);
  }

  mongoose.connect(process.env.DB_PATH);

  const models = {
    Url: mongoose.model('Url', urlSchema, 'urls'),
    Image: mongoose.model('Image', imageSchema, 'images'),
    Poll: mongoose.model('Poll', pollSchema, 'polls'),
    User: mongoose.model('User', userSchema, 'users')
  };

  for (const [key, value] of Object.entries(models)) {
    wagner.factory(key, function() {
      return value;
    });
  }
};
