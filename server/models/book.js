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
    populate('owner', { local: 1, twitter: 1, address: 1 }).
    exec(function(err, books) {
      if (err) return callback(err);

      books = books.map(function(book) {
        return book.formatInfo();
      });

      return callback(null, books);
    });
};

bookSchema.methods.formatInfo = function formatInfo() {
  return {
    title: this.title,
    imageUrl: this.imageUrl,
    owner: {
      _id: this.owner._id,
      name: this.owner.local
        ? this.owner.local.name || this.owner.local.email
        : this.owner.twitter.displayName,
      address: this.owner.address
    }
  };
};

module.exports = bookSchema;
