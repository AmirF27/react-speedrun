const Schema = require('mongoose').Schema;

const bookSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  image_url: String,
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = bookSchema;
