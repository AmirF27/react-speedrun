const moment = require('moment');

const formats = [
  'MMMM DD YYYY',
  'MM DD YYYY',
  'DD MMMM YYYY',
  'DD MM YYYY',
  'X'
];

function Timestamp(date) {
  this.date = date;
  this.unix = null;
  this.natural = null;
}

Timestamp.prototype.convert = function() {
  this.unix = null;
  this.natural = null;

  let date = moment(this.date, formats);

  if (date.isValid()) {
    this.unix = date.unix();
    this.natural = date.format('MMMM DD, YYYY');
  }

  return this;
}

module.exports = Timestamp;
