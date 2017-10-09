const Schema = require('mongoose').Schema;
const status = require('http-status');

const pollSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  options: [{
    name: String,
    votes: {
      type: Number,
      default: 0
    },
    _id: false
  }],
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

pollSchema.index({ title: 1 });
pollSchema.index({ author: 1 });

pollSchema.statics.allPolls = function allPolls(callback) {
  this.find({}).
       select({ _id: 0, title: 1, options: 1 }).
       sort({ title: 1 }).
       exec(callback);
};

pollSchema.statics.findByTitle = function findByTitle(title, callback) {
  this.findOne({ title }).
       select({ _id: 0, title: 1, options: 1, author: 1 }).
       populate('author', { _id: 0, name: 1, email: 1 }).
       exec(callback);
};

pollSchema.statics.findByAuthorId = function findByAuthorId(id, callback) {
  this.find({ author: id }).
       select({ _id: 0, title: 1, options: 1 }).
       exec(callback);
};

pollSchema.statics.vote = function vote(title, option, callback) {
  this.findByTitle(title, function(err, poll) {
    if (err || !poll) return callback(err);

    const index = poll.options.findIndex(op => op.name === option);
    this.update({ title }, { $inc: { [`options.${index}.votes`]: 1 } }, callback);
  }.bind(this));
};

pollSchema.statics.addOption = function addOption(title, option, callback) {
  this.update({ title }, { $push: { options: { name: option } } }, callback);
};

pollSchema.methods.verifyAuthor = function verifyAuthor(user) {
  return this.author.equals(user._id);
};

module.exports = pollSchema;
