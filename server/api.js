const express = require('express');
const status = require('http-status');
const upload = require('multer')();
const Timestamp = require('./timestamp');
const HeaderParser = require('./header-parser');
const Nightlife = require('./nightlife');
const BookService = require('./book-service');
const message = require('./message.js');
const ErrorMessage = message.ErrorMessage;
const SuccessMessage = message.SuccessMessage;

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

  api.get('/stock-market', wagner.invoke(function(Stock) {
    return function(req, res) {
      Stock.getStockData(function(err, stocks) {
        res.json(err || stocks);
      });
    };
  }));

  api.post('/stock-market', upload.any(), wagner.invoke(function(Stock, socket) {
    return function(req, res) {
      if (!req.body.symbol) {
        return res.
          status(status.BAD_REQUEST).
          json(new ErrorMessage('Missing symbol.'));
      }

      Stock.addStock(req.body.symbol, function(err, stock) {
        if (err) {
          // check stock symbol validity
          if (err.quandl_error && err.quandl_error.code == 'QECx02') {
            return res.
              staus(status.NOT_FOUND).
              json(new ErrorMessage('Invalid stock symbol.'));
          } else if (err.name === 'MongoError' && err.code === 11000) {
            return res.json(new ErrorMessage('Stock already exists.'));
          } else {
            return res.
              status(status.INTERNAL_SERVER_ERROR).
              json(new ErrorMessage('An error occured while attempting to save stock.'));
          }
        }

        socket.emit('add stock', stock);
        res.json(new SuccessMessage('Stock added successfully.'));
      });
    };
  }));

  api.delete('/stock-market', wagner.invoke(function(Stock, socket) {
    return function(req, res) {
      Stock.findOne({ symbol: req.body.symbol }, function(err, stock) {
        if (err) {
          return res.
            status(status.INTERNAL_SERVER_ERROR).
            json(new ErrorMessage(
              'An error occured while attempting to delete stock.'
            ));
        }

        if (!stock) {
          return res.
            status(status.NOT_FOUND).
            json(new ErrorMessage('Stock not found.'));
        }

        stock.remove(function(err) {
          if (err) {
            return res.
              status(status.INTERNAL_SERVER_ERROR).
              json(new ErrorMessage(
                'An error occured while attempting to delete stock.'
              ));
          }

          socket.emit('delete stock', req.body.symbol);
          return res.json(new SuccessMessage('Stock deleted successfully!'));
        });
      });
    };
  }));

  api.get('/book-trading-club', wagner.invoke(function(Book) {
    return function(req, res) {
      if (!req.user) {
        return res.
          status(status.UNAUTHORIZED).
          json(new ErrorMessage('Not logged in!'));
      }

      Book.getAllBooks(req.user._id, function(err, books) {
        if (err) {
          return res.
            status(status.INTERNAL_SERVER_ERROR).
            json(new ErrorMessage('An error occured while attempting to retireve books.'));
        }

        res.json(books);
      });
    };
  }));

  api.get('/book-trading-club/search', function(req, res) {
    if (!req.query.title) {
      return res.
        status(status.BAD_REQUEST).
        json(new ErrorMessage('Book title missing.'));
    }

    const bookService = new BookService(req.query.title);

    bookService.search(function(err, books) {
      if (err) {
        return res.
          status(status.INTERNAL_SERVER_ERROR).
          json(new ErrorMessage('An error occured.'));
      }

      res.json(books);
    });
  });

  api.post('/book-trading-club/add-book', wagner.invoke(function(Book) {
    return function(req, res) {
      if (!req.user) {
        return res.
          status(status.UNAUTHORIZED).
          json(new ErrorMessage('Not logged in!'));
      }

      if (!req.body.title || !req.body.imageUrl) {
        return res.
          status(status.BAD_REQUEST).
          json(new ErrorMessage('Book title or image not specified.'));
      }

      const book = new Book({
        title: req.body.title,
        imageUrl: req.body.imageUrl,
        owner: req.user._id
      });

      book.save(function(err) {
        if (err) {
          res.
            status(status.INTERNAL_SERVER_ERROR).
            json(new ErrorMessage('An error occured while attempting to add book'));
        } else {
          res.json(new SuccessMessage('Book added successfully!'));
        }
      });
    };
  }));

  api.post('/book-trading-club/trade-request',
    wagner.invoke(function(Book, TradeRequest) {
      return function(req, res) {
        if (!req.user) {
          return res.
            status(status.UNAUTHORIZED).
            json(new ErrorMessage('Not logged in!'));
        }

        Book.findOne({ _id: req.body.bookId }, function(err, book) {
          if (err) {
            return res.
              status(status.INTERNAL_SERVER_ERROR).
              json(new ErrorMessage('An error occured.'));
          }

          if (!book) {
            return res.
              status(status.NOT_FOUND).
              json(new ErrorMessage('Book not found.'));
          }

          const tradeRequest = new TradeRequest({
            book: req.body.bookId,
            owner: book.owner,
            requester: req.user._id
          });

          tradeRequest.save(function(err) {
            if (err) {
              res.
                status(status.INTERNAL_SERVER_ERROR).
                json(new ErrorMessage('An error occured.'));
            } else {
              res.json(new SuccessMessage('Trade request submitted successfully!'));
            }
          });
        });
      };
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
            json(new ErrorMessage('An error occured.'));
        }

        res.json(polls);
      });
    };
  }));

  api.get('/profile/books', wagner.invoke(function(Book) {
    return function(req, res) {
      if (!req.user) {
        return res.
          status(status.UNAUTHORIZED).
          json(new ErrorMessage('Not logged in!'));
      }

      Book.findByOwnerId(req.user._id, function(err, books) {
        if (err) {
          return res.
            status(status.INTERNAL_SERVER_ERROR).
            json(new ErrorMessage('An error occured.'));
        }

        res.json(books);
      });
    };
  }));

  api.get('/profile/trade-requests', wagner.invoke(function(TradeRequest) {
    return function(req, res) {
      if (!req.user) {
        return res.
          status(status.UNAUTHORIZED).
          json(new ErrorMessage('Not logged in!'));
      }

      if (!req.query.type) {
        return res.
          status().
          json(new ErrorMessage('Trade request type missing.'));
      }

      TradeRequest.getRequests(req.query.type, req.user._id, function(err, requests) {
        if (err) {
          return res.
            status(status.INTERNAL_SERVER_ERROR).
            json(new ErrorMessage('An error occured.'));
        }

        res.json(requests);
      });
    };
  }));

  api.delete('/profile/trade-requests', wagner.invoke(function(TradeRequest) {
    return function(req, res) {
      if (!req.user) {
        return res.
          status(status.UNAUTHORIZED).
          json(new ErrorMessage('Not logged in!'));
      }

      TradeRequest.deleteOne({ _id: req.body.requestId }, function(err) {
        if (err) {
          return res.
            status(status.INTERNAL_SERVER_ERROR).
            json(new ErrorMessage('An error occured.'));
        }

        res.json(new SuccessMessage('Trade request canceled successfully.'));
      });
    }
  }));

  api.put('/profile/trade-requests', wagner.invoke(function(TradeRequest) {
    return function(req, res) {
      if (!req.user) {
        return res.
          status(status.UNAUTHORIZED).
          json(new ErrorMessage('Not logged in!'));
      }

      TradeRequest.markApproved(req.body.requestId, function(err) {
        if (err) {
          return res.
            status(status.INTERNAL_SERVER_ERROR).
            json(new ErrorMessage('An error occured.'));
        }

        res.json(new SuccessMessage('Trade request approved.'));
      });
    }
  }));

  api.put('/profile/address', upload.any(), function(req, res) {
    if (!req.user) {
      return res.
        status(status.UNAUTHORIZED).
        json(new ErrorMessage('Not logged in!'));
    }

    req.user.setAddress(req.body.address, function(err) {
      if (err) {
        return res.
          status().
          json(new ErrorMessage('Could not update address.'));
      }
      res.json(new SuccessMessage('Address updated successfully!'));
    });
  });

  api.get('/user', function(req, res) {
    if (req.user) {
      res.json({ user: req.user.format() });
    } else {
      res.json({ user: null });
    }
  });

  return api;
};
