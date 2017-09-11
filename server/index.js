const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.resolve(__dirname, '../dist')));

app.use('/api', require('./api'));

app.get('*', function(req, res) {
  res.sendFile(path.resolve(__dirname, '../dist', 'index.html'));
});

const server = app.listen(3000, function() {
  console.log('Listening on port ' + server.address().port);
});
