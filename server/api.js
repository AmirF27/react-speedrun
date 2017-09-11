const express = require('express');
const Timestamp = require('./timestamp');
const HeaderParser = require('./header-parser');

const api = express.Router();

api.get('/timestamp/:date', function(req, res) {
  let timestamp = new Timestamp(req.params.date);
  timestamp = timestamp.convert();

  res.json({
    unix: timestamp.unix,
    natural: timestamp.natural
  });
});

api.get('/header-parser', function(req, res) {
  const parser = new HeaderParser(req);

  const info = {
    ip: parser.getIp(),
    os: parser.getOS(),
    language: parser.getLanguage()
  };

  res.json(info);
});

module.exports = api;
