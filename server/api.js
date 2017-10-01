const express = require('express');
const status = require('http-status');
const upload = require('multer')();
const Timestamp = require('./timestamp');
const HeaderParser = require('./header-parser');
const Nightlife = require('./nightlife');
const message = require('./message.js');
const ErrorMessage = message.ErrorMessage;
const SuccessMessage = message.SuccessMessage;

module.exports = function(wagner, passport) {
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

  api.post('/voting-app/new-poll', upload.any(), wagner.invoke(function(User, Poll) {
    return function(req, res) {
      if (!req.user) {
        return res.status(status.UNAUTHORIZED).
                   json(new ErrorMessage('Not logged in!'));
      }

      const poll = new Poll({
        title: req.body.title,
        options: req.body.options.map(option => ({ name: option })),
        author: req.user._id
      });

      poll.save(function(err) {
        if (err) {
          // check for duplicate key error
          if (err.name === 'MongoError' && err.code === 11000) {
            return res.json(new ErrorMessage('Poll title already exists.'));
          } else {
            return res.status((status.INTERNAL_SERVER_ERROR)).
                       json(new ErrorMessage('An error occured while attempting to add poll.'));
          }
        }

        res.json(new SuccessMessage('Poll added successfully!'));
      });
    };
  }));

  api.get('/voting-app/all-polls', wagner.invoke(function(Poll) {
    return function(req, res) {
      Poll.allPolls(function(err, polls) {
        if (err) {
          res.status(status.INTERNAL_SERVER_ERROR).
              json({ error: 'Could not retrieve poll data.' });
        } else {
          res.json(polls);
        }
      });
    };
  }));

  api.get('/voting-app/poll/:title', wagner.invoke(function(Poll) {
    return function(req, res) {
      Poll.findByTitle(req.params.title, function(err, poll) {
        if (err) {
          return res.status(status.INTERNAL_SERVER_ERROR).
                     json(new ErrorMessage('Could not retrieve poll data.'));
        }

        if (!poll) {
          res.status(status.NOT_FOUND).
              json(new ErrorMessage('Poll not found.'));
        } else {
          res.json(poll);
        }
      });
    };
  }));

  api.post('/voting-app/vote/:pollTitle',
    upload.any(),
    wagner.invoke(function(Poll) {
      return function(req, res) {
        if (!req.body.vote) {
          return res.status(status.BAD_REQUEST).
                     json(new ErrorMessage('No option was specified.'));
        }

        Poll.vote(req.params.pollTitle, req.body.vote, function(err) {
          if (err) {
            res.status(status.INTERNAL_SERVER_ERROR).
                json(new ErrorMessage(
                  'An error occured while attempting to submit vote.'
                ));
          } else {
            res.json(new SuccessMessage('Vote submitted successfully!'));
          }
        });
      };
    }));

  api.post('/voting-app/add-option/:pollTitle',
    upload.any(),
    wagner.invoke(function(Poll) {
      return function(req, res) {
        if (!req.user) {
          return res.
            status(status.UNAUTHORIZED).
            json(new ErrorMessage(
              'You need to be logged in to add custom options to polls'
            ));
        }

        if (!req.body.option) {
          return res.
            status(status.BAD_REQUEST).
            json(new ErrorMessage('Option not specified.'));
        }

        Poll.addOption(req.params.pollTitle, req.body.option, function(err) {
          if (err) {
            res.
              status(status.INTERNAL_SERVER_ERROR).
              json(new ErrorMessage('An error occured while attempting to add option.'));
          } else {
            res.json(new SuccessMessage('Option added successfully!'));
          }
        });
      };
    }));

  api.delete('/voting-app/delete/:pollTitle',
    upload.any(),
    wagner.invoke(function(Poll) {
      return function(req, res) {
        if (req.user) {
          Poll.findOne({ title: req.params.pollTitle }, function(err, poll) {
            if (err) {
              return res.
                status(status.INTERNAL_SERVER_ERROR).
                json(new ErrorMessage(
                  'An error occured while attempting to delete poll.'
                ));
            }

            if (!poll) {
              return res.
                status(status.NOT_FOUND).
                json(new ErrorMessage('Poll not found.'));
            }

            if (poll.verifyAuthor(req.user)) {
              poll.remove(function(err) {
                if (err) {
                  return res.
                    status(status.INTERNAL_SERVER_ERROR).
                    json(new ErrorMessage(
                      'An error occured while attempting to delete poll.'
                    ));
                }

                return res.json(new SuccessMessage('Poll deleted successfully!'));
              });
            } else {
              res.status(status.UNAUTHORIZED).
                  json(new ErrorMessage('This poll belongs to someone else.'));
            }
          });
        } else {
          res.status(status.UNAUTHORIZED).
              json(new ErrorMessage('Not logged in!'));
        }
      };
    }));

  api.get('/nightlife/search', wagner.invoke(function(Bar) {
    return function(req, res) {
      const nightlife = new Nightlife({ location: req.query.location });

      nightlife.search(function(err, bars) {
        Bar.countAttendees(bars, function(err, countedBars) {
          if (req.user) {
            Bar.getUserBars(req.user._id, function(err, userBars) {
              nightlife.userBars = userBars;

              if (err) {
                return res.
                  status(status.INTERNAL_SERVER_ERROR).
                  json(new ErrorMessage('An error occured.'));
              }

              res.json(nightlife.markUserAttendance(countedBars));
            });
          } else {
            res.json(err || countedBars);
          }
        });
      });
    }
  }));

  api.post('/nightlife/add-bar/:yelpId', wagner.invoke(function(Bar) {
    return function(req, res) {
      if (!req.user) {
        return res.
          status(status.UNAUTHORIZED).
          json(new ErrorMessage('Not logged in!'));
      }

      if (!req.user.twitter.id) {
        return res.json(new ErrorMessage('You need to be logged in with Twitter.'));
      }

      Bar.addAttendee(req.params.yelpId, req.user._id, function(err) {
        if (err) {
          return res.
            status(status.INTERNAL_SERVER_ERROR).
            json(new ErrorMessage('An error occured.'));
        }
        res.json(new SuccessMessage('Bar added successfully!'));
      });
    }
  }));

  api.delete('/nightlife/remove-bar/:yelpId', wagner.invoke(function(Bar) {
    return function(req, res) {
      if (!req.user) {
        return res.
          status(status.UNAUTHORIZED).
          json(new ErrorMessage('Not logged in!'));
      }

      Bar.removeAttendee(req.params.yelpId, req.user._id, function(err) {
        if (err) {
          return res.
            status(status.INTERNAL_SERVER_ERROR).
            json(new ErrorMessage('An error occured.'));
        }
        res.json(new SuccessMessage('Event canceled successfully.'));
      });
    }
  }));

  api.get('/profile/polls', wagner.invoke(function(Poll) {
    return function(req, res) {
      if (!req.user) {
        return res.
          status(status.UNAUTHORIZED).
          json(new ErrorMessage('Not logged in!'));
      }

      Poll.findByAuthorId(req.user._id, function(err, polls) {
        if (err) {
          return res.
            status(status.INTERNAL_SERVER_ERROR).
            json({ error: 'An error occured.' });
        }

        res.json(polls);
      });
    };
  }));

  api.get('/user', function(req, res) {
    if (req.user) {
      const user = {};
      if (req.user.local.email) {
        user.local = {
          name: req.user.local.name,
          email: req.user.local.email
        };
      } else {
        user.twitter = {
          displayName: req.user.twitter.displayName,
          username: req.user.twitter.username
        };
      }
      user.bars = req.user.bars;
      res.json({ user });
    } else {
      res.json({ user: null });
    }
  });

  return api;
};
