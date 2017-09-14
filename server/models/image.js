const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  search_term: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  }
});

imageSchema.index({ date: -1 });

imageSchema.statics.mostRecent = function mostRecent(cb) {
  this.find({}).
       sort({ date: -1 }).
       limit(10).
       select({ _id: 0, search_term: 1, date: 1 }).
       exec(function(err, data) {
         cb(err, data);
       });
};

module.exports = imageSchema;
