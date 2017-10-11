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
        return {
          id: request._id,
          book: request.book,
          owner: request.owner.format(),
          requester: request.requester.format(),
          approved: request.approved
        };
      });

      return callback(null, requests);
    });
};

module.exports = tradeRequestSchema;
