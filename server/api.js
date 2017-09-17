const express = require('express');
const status = require('http-status');
const Timestamp = require('./timestamp');
const HeaderParser = require('./header-parser');
const upload = require('multer')();

module.exports = function(wagner) {
  const ImageSearch = require('./image-search')(wagner);

  const api = express.Router();

  api.get('/timestamp/:date', function(req, res) {
    const timestamp = new Timestamp(req.params.date);

    res.json(timestamp.convert());
  });

  api.get('/header-parser', function(req, res) {
    const parser = new HeaderParser(req);

    res.json(parser.getClientInfo());
  });

  api.get('/url-shortener/new/:url(*)', wagner.invoke(function(Url) {
    return function(req, res) {
      const url = new Url({
        original: req.params.url
      });

      url.shorten(function(err, data) {
        if (data) {
          data.shortened = Url.extractShortenedPath(req) + data.shortened;
        }

        res.json(err || data);
      });
    };
  }));

  api.get('/url-shortener/:url', wagner.invoke(function(Url) {
    return function(req, res) {
      Url.lookupUrl(req.params.url, function(err, url) {
        if (url) {
          res.redirect(url);
        } else {
          res.status(status.NOT_FOUND).
              json({ error: 'URL not found' });
        }
      });
    }
  }));

  api.get('/image-search/:term', function(req, res) {
    const search = new ImageSearch({
      search_term: req.params.term,
      offset: +req.query.offset
    });

    search.performSearch(function(results) {
      res.json(results);
    });
  });

  api.get('/image-search', wagner.invoke(function(Image) {
    return function(req, res) {
      Image.mostRecent(function(err, data) {
        if (err) {
          res.status(status.INTERNAL_SERVER_ERROR).
              json({ error: 'An error occured while retrieving the data' });
        } else {
          res.json(data);
        }
      });
    };
  }));

  api.post('/file-upload', upload.single('file'), function(req, res) {
    res.json({ size: req.file.size });
  });

  api.post('/voting-app/new-poll', upload.any(), wagner.invoke(function(Poll) {
    return function(req, res) {
      const poll = new Poll({
        title: req.body.title,
        options: req.body.options
      });

      poll.save();
    };
  }));

  api.get('/voting-app/polls', wagner.invoke(function(Poll) {
    return function(req, res) {
      Poll.allPolls(function(err, polls) {
        if (err) {
          res.status(status.INTERNAL_SERVER_ERROR).
              json({ error: 'Could not retrieve poll data' });
        } else {
          res.json(polls);
        }
      });
    };
  }));

  return api;
};
