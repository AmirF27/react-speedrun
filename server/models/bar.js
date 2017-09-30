const Schema = require('mongoose').Schema;

const barSchema = new Schema({
  yelpId: {
    type: String,
    required: true,
    index: true
  },
  attendees: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true
  }]
});

barSchema.statics.addAttendee = function addAttendee(yelpId, userId, callback) {
  this.findOneAndUpdate(
    { yelpId },
    { $addToSet: { attendees: userId } },
    { upsert: true },
    callback
  );
};

barSchema.statics.removeAttendee = function removeAttendee(yelpId, userId, callback) {
  this.update({ yelpId }, { $pull: { attendees: userId } }).exec(callback);
}

barSchema.statics.getUserBars = function getUserBars(userId, callback) {
  this.
    find({ attendees: userId }).
    select({ _id: 0, yelpId: 1 }).
    exec(function(err, bars) {
      callback(err, err ? undefined : bars.map(bar => bar.yelpId));
    });
};

module.exports = barSchema;
