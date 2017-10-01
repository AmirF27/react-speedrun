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

barSchema.statics.countAttendees = function countAttendees(bars, callback) {
  let barsCounted = 0;

  for (let bar of bars) {
    this.findOne({ yelpId: bar.id }, function(err, b) {
      if (b) {
        bar.attendees = b.attendees.length;
      } else {
        bar.attendees = 0;
      }
      barsCounted++;
      if (barsCounted == bars.length) callback(null, bars);
    });
  }
};

module.exports = barSchema;
