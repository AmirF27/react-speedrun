const LocalStrategy = require('passport-local').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const upload = require('multer')();

module.exports = function(User, passport, app) {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  // Auth strategies

  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  function(req, email, password, done) {
    User.findOne({ 'local.email': email }, function(err, user) {
      if (err) return done(err);

      if (user) {
        return done(null, null, 'Email already exists.');
      }

      if (req.body.password !== req.body.confirm) {
        return done(null, null, 'Passwords don\'t match.');
      }

      const newUser = new User({
        local: {
          name: req.body.name,
          email: email,
          password: User.encryptPassword(password)
        }
      });

      newUser.save(function(err) {
        if (err) throw err;

        return done(null, newUser);
      });
    });
  }));

  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  function(req, email, password, done) {
    User.findOne({ 'local.email': email }, function(err, user) {
      if (err) return done(err);

      if (!user) {
        return done(null, null, 'No such user exists.');
      }

      if (!user.verifyPassword(password)) {
        return done(null, null, 'Wrong password.');
      }

      return done(null, user);
    });
  }));

  passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: process.env.TWITTER_CALLBACK_URL
  }, function(token, tokenSecret, profile, done) {
    User.findOne({ 'twitter.id': profile.id }, function(err, user) {
      if (err) return done(err);

      if (user) return done(null, user);

      const newUser = new User({
        twitter: {
          id: profile.id,
          token: token,
          username: profile.username,
          displayName: profile.displayName
        }
      });

      newUser.save(function(err) {
        if (err) throw err;

        return done(null, newUser);
      });
    });
  }));

  // Auth API routes

  app.post('/auth/register', upload.any(), function(req, res) {
    passport.authenticate('local-signup', function(err, user, info) {
      req.login(user, {}, function() {
        handleAuthResponse(res, err || info, user);
      });
    })(req, res);
  });

  app.post('/auth/login', upload.any(), function(req, res) {
    passport.authenticate('local-login', function(err, user, info) {
      req.login(user, {}, function() {
        handleAuthResponse(res, err || info, user);
      });
    })(req, res);
  });

  app.get('/auth/twitter', passport.authenticate('twitter'));

  app.get('/auth/twitter/callback', passport.authenticate('twitter', {
    successRedirect: '/nightlife',
    failureRedirect: '/'
  }));

  app.post('/auth/logout', function(req, res) {
    req.logout();
    res.json({ done: true });
  });
};
