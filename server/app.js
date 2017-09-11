const express = require('express');
const path = require('path');

const convertTime = require('./timestamp');

const app = express();

app.use(express.static(path.resolve(__dirname, '../dist')));

app.get('/timestamp/:ts', function(req, res) {
  res.json(convertTime(req.params.ts));
});

app.get('*', function(req, res) {
  res.sendFile(path.resolve(__dirname, '../dist', 'index.html'));
});

const server = app.listen(3000, function() {
  console.log('Listening on port ' + server.address().port);
});
