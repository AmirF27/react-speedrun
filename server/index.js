const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const wagner = require('wagner-core');
const passport = require('passport');

const INDEX_PAGE = path.resolve(__dirname, '../dist', 'index.html');
const STATIC_PATH = path.resolve(__dirname, '../dist');
const DEFAULT_PORT = 3000;
const PORT = process.env.PORT || DEFAULT_PORT;

if (process.env.NODE_ENV != 'production') {
  require('dotenv').config();
}

require('./db')(wagner);

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(require('express-session')({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(express.static(STATIC_PATH));

app.use(passport.initialize());
app.use(passport.session());

wagner.invoke(require('./auth'), { passport });

app.use('/api', require('./api')(wagner, passport));

app.get('*', function(req, res) {
  res.sendFile(INDEX_PAGE);
});

const server = app.listen(PORT, function() {
  console.log('Listening on port ' + server.address().port);
});
