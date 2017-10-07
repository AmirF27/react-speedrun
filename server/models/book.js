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

bookSchema.statics.getAllBooks = function getAllBooks(callback) {
  this.
    find({}).
    select({ _id: 0, title: 1, imageUrl: 1, owner: 1 }).
    populate('owner', { local: 1, twitter: 1 }).
    exec(function(err, books) {
      if (err) return callback(err);

      books = books.map(function(book) {
        return {
          title: book.title,
          imageUrl: book.imageUrl,
          owner: {
            _id: book.owner._id,
            name: book.owner.local
              ? book.owner.local.name || book.owner.local.email
              : book.owner.twitter.displayName
          }
        };
      });

      return callback(null, books);
    });
};

module.exports = bookSchema;
