const Schema = require('mongoose').Schema;

const bookSchema = new Schema({
  title: {
    type: String,
    required: true,
    index: true
  },
  imageUrl: String,
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

bookSchema.statics.getAllBooks = function getAllBooks(userId, callback) {
  this.
    find({ owner: { $ne: userId } }).
    populate('owner', { local: 1, twitter: 1, address: 1 }).
    exec(function(err, books) {
      if (err) return callback(err);

      books = books.map(function(book) {
        return book.format();
      });

      return callback(null, books);
    });
};

bookSchema.statics.findByOwnerId = function findByOwnerId(id, callback) {
  this.
    find({ owner: id }).
    select({ _id: 0, title: 1, imageUrl: 1 }).
    exec(callback);
};

bookSchema.methods.format = function format() {
  return {
    id: this._id,
    title: this.title,
    imageUrl: this.imageUrl,
    owner: this.owner.format()
  };
};

module.exports = bookSchema;
