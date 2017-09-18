const LocalStrategy = require('passport-local').Strategy;

module.exports = function(User, passport) {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  function(req, email, password, done) {
    process.nextTick(function() {
      if (req.body.password !== req.body.confirm) {
        done(null, null, 'Passwords don\'t match');
      }

      User.findOne({ email }, function(err, user) {
        if (err) return done(err);

        if (user) {
          return done(null, null, 'Email already exists');
        } else {
          User.encryptPassword(password, function(err, encrypted) {
            const newUser = new User({
              name: req.body.name,
              email: email,
              password: encrypted
            });

            newUser.save(function(err) {
              if (err) throw err;

              return done(null, newUser);
            });
          });
        }
      });
    });
  }));
};
