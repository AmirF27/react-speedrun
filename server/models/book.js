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
    populate('owner', { local: 1, twitter: 1, address: 1 }).
    exec(function(err, books) {
      if (err) return callback(err);

      books = books.map(function(book) {
        return book.formatInfo();
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

bookSchema.methods.formatInfo = function formatInfo() {
  return {
    id: this._id,
    title: this.title,
    imageUrl: this.imageUrl,
    owner: this.owner.format()
    // owner: {
    //   _id: this.owner._id,
    //   name: this.owner.local
    //     ? this.owner.local.name || this.owner.local.email
    //     : this.owner.twitter.displayName,
    //   address: this.owner.address
    // }
  };
};

module.exports = bookSchema;
