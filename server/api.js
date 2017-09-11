const express = require('express');
const convertTime = require('./timestamp');

const api = express.Router();

api.get('/timestamp/:ts', function(req, res) {
  res.json(convertTime(req.params.ts));
});

module.exports = api;
