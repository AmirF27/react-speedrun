const Schema = require('mongoose').Schema;

const pollSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  options: {
    type: [String],
    required: true
  }
});

pollSchema.index({ title: 1 });

pollSchema.statics.allPolls = function allPolls(cb) {
  this.find({}).
       sort({ title: 1 }).
       select({ _id: 0, title: 1, options: 1 }).
       exec(function(err, polls) {
         cb(err, polls)
       });
};

module.exports = pollSchema;
