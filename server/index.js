const express = require('express');
const path = require('path');

const INDEX_PAGE = path.resolve(__dirname, '../dist', 'index.html');
const STATIC_PATH = path.resolve(__dirname, '../dist');
const DEFAULT_PORT = 3000;
const PORT = process.env.PORT || DEFAULT_PORT;

const app = express();

app.use(express.static(STATIC_PATH));

app.use('/api', require('./api'));

app.get('*', function(req, res) {
  res.sendFile(INDEX_PAGE);
});

const server = app.listen(PORT, function() {
  console.log('Listening on port ' + server.address().port);
});
