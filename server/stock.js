const rp = require('request-promise');
const moment = require('moment');

const SYMBOL_PLACEHOLDER = ':symbol';
const QUANDL_URL = `https://www.quandl.com/api/v3/datasets/WIKI/${SYMBOL_PLACEHOLDER}.json`;
const YEAR = 365;
const DATE_FORMAT = 'YYYY-MM-DD';

function Stock(options) {
  this.symbol = options.symbol;
  this.duration = options.duration || 1;
}

Stock.prototype.getData = function getData(callback) {
  const url = QUANDL_URL.replace(SYMBOL_PLACEHOLDER, this.symbol);
  const params = {
    api_key: process.env.QUANDL_API_KEY,
    order: 'asc',
    collapse: 'monthly',
    start_date: moment().subtract(this.duration * YEAR, 'd').format(DATE_FORMAT),
    end_date: moment().format(DATE_FORMAT)
  };

  rp({ url, qs: params, json: true }).
    then(function fulfilled(res) {
      callback(null, {
        symbol: res.dataset.dataset_code,
        name: res.dataset.name,
        data: formatData(res.dataset.data)
      });
    }).
    catch(callback);
};

function formatData(data) {
  return data.map(function(datum) {
    return {
      date: moment(datum[0], DATE_FORMAT).toDate(),
      value: datum[4]
    };
  });
}

module.exports = Stock;
