const express = require('express');
const path = require('path');
const wagner = require('wagner-core');

const INDEX_PAGE = path.resolve(__dirname, '../dist', 'index.html');
const STATIC_PATH = path.resolve(__dirname, '../dist');
const DEFAULT_PORT = 3000;
const PORT = process.env.PORT || DEFAULT_PORT;

if (process.env.NODE_ENV != 'production') {
  require('dotenv').config();
}

require('./db')(wagner);

const app = express();

app.use(express.static(STATIC_PATH));

app.use('/api', require('./api')(wagner));

app.get('*', function(req, res) {
  res.sendFile(INDEX_PAGE);
});

const server = app.listen(PORT, function() {
  console.log('Listening on port ' + server.address().port);
});
