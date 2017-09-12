const mongoose = require('mongoose');
const UrlSchema = require('./models/url');

module.exports = function(wagner) {
  if (!process.env.DB_PATH) {
    console.error('Database path not set');
    process.exit(1);
  }

  mongoose.connect(process.env.DB_PATH);

  const models = {
    Url: mongoose.model('Url', UrlSchema, 'urls')
  };

  for (const [key, value] of Object.entries(models)) {
    wagner.factory(key, function() {
      return value;
    });
  }
};
