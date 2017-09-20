const Schema = require('mongoose').Schema;

const pollSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  options: {
    type: [String],
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

pollSchema.index({ title: 1 });
pollSchema.index({ author: 1 });

pollSchema.statics.allPolls = function allPolls(cb) {
  this.find({}).
       sort({ title: 1 }).
       exec(cb);
};

pollSchema.statics.findByTitle = function findByTitle(title, cb) {
  this.findOne({ title }).
       select({ _id: 0, title: 1, options: 1, author: 1 }).
       populate('author', { _id: 0, name: 1, email: 1 }).
       exec(cb);
};

pollSchema.statics.findByAuthorId = function findByAuthorId(id, cb) {
  this.find({ author: id }).
       select({ _id: 0, title: 1, options: 1 }).
       exec(cb);
};

module.exports = pollSchema;
