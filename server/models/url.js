const mongoose = require('mongoose');
const shortid = require('shortid');

const urlSchema = new mongoose.Schema({
  original: {
    type: String,
    required: true,
    lowercase: true
  },
  shortened: {
    type: String,
    required: true
  }
});

urlSchema.index({ shortened: 1 });

urlSchema.methods.shorten = function shorten(cb) {
  if (this.hasValidUrl()) {
    this.shortened = shortid.generate();
    this.save(function(err, url) {
      return cb(null, {
        original: url.original,
        shortened: url.shortened
      });
    });
  } else {
    return cb({ error: 'Invalid URL' });
  }
};

urlSchema.methods.hasValidUrl = function hasValidUrl() {
  return (this.original.startsWith('http://') ||
         this.original.startsWith('https://')) &&
         this.original.indexOf('.') >= 0;
};

urlSchema.statics.lookupUrl = function lookupUrl(url, cb) {
  const query = { shortened: url };
  const projection = 'original';

  this.findOne(query, projection, function(err, data) {
    if (data) {
      data = data.original;
    }
    cb(err, data);
  });
};

urlSchema.statics.extractShortenedPath = function extractShortenedPath(req) {
  let protocol = req.protocol;
  let host = req.get('Host');
  let url = req.url.slice(0, req.url.indexOf('new'));

  return `${protocol}://${host}${req.baseUrl}${url}`;
};

module.exports = urlSchema;
