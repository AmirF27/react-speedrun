const Schema = require('mongoose').Schema;

const tradeRequestSchema = new Schema({
  book: {
    type: Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  requester: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  approved: {
    type: Boolean,
    default: false
  }
});

tradeRequestSchema.statics.getRequests = function getRequests(type, userId, callback) {
  this.
    find({ [type == 'made' ? 'requester' : 'owner']: userId }).
    populate('book').
    populate('owner').
    populate('requester').
    exec(function(err, requests) {
      if (err) return callback(err);

      requests = requests.map(function(request) {
        return request.format();
      });

      return callback(null, requests);
    });
};

tradeRequestSchema.statics.markApproved = function markApproved(id, callback) {
  this.
    updateOne({ _id: id }, { approved: true }).
    exec(callback);
};

tradeRequestSchema.methods.format = function format() {
  return {
    id: this._id,
    book: this.book,
    owner: this.owner.format(),
    requester: this.requester.format(),
    approved: this.approved
  };
};

module.exports = tradeRequestSchema;
