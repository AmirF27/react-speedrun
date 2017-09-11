const express = require('express');
const convertTime = require('./timestamp');

const app = express();

app.get('/timestamp/:ts', function(req, res) {
  res.json(convertTime(req.params.ts));
});

const server = app.listen(3000, function() {
  console.log('Listening on port ' + server.address().port);
});
