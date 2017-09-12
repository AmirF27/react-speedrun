const express = require('express');
const Timestamp = require('./timestamp');
const HeaderParser = require('./header-parser');

const api = express.Router();

api.get('/timestamp/:date', function(req, res) {
  const timestamp = new Timestamp(req.params.date);

  res.json(timestamp.convert());
});

api.get('/header-parser', function(req, res) {
  const parser = new HeaderParser(req);

  res.json(parser.getClientInfo());
});

module.exports = api;
