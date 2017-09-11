const moment = require('moment');

const formats = [
  'MMMM DD YYYY',
  'MM DD YYYY',
  'DD MMMM YYYY',
  'DD MM YYYY',
  'X'
];

module.exports = function(ts) {
  let unix = null;
  let natural = null;

  let date = moment(ts, formats);

  if (date.isValid()) {
    unix = date.unix();
    natural = date.format('MMMM DD, YYYY');
  }

  return { unix, natural };
};
