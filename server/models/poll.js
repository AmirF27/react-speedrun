const Schema = require('mongoose').Schema;

const pollSchema = new Schema({
  title: {
    type: String,
    required: true
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

pollSchema.statics.allPolls = function allPolls(cb) {
  this.find({}).
       sort({ title: 1 }).
       exec(cb);
};

module.exports = pollSchema;
