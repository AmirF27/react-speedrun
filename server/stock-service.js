const rp = require('request-promise');
const moment = require('moment');

const SYMBOL_PLACEHOLDER = ':symbol';
const QUANDL_URL = `https://www.quandl.com/api/v3/datasets/WIKI/${SYMBOL_PLACEHOLDER}.json`;
const YEAR = 365;
const DATE_FORMAT = 'YYYY-MM-DD';

function StockService(options) {
  this.symbol = options.symbol;
  this.duration = options.duration || 1;
}

StockService.prototype.getData = function getData() {
  return new Promise(function(resolve, reject) {
    rp(this.getRequestOptions()).
      then(function fulfilled(res) {
        resolve({
          symbol: res.dataset.dataset_code,
          name: res.dataset.name,
          data: formatData(res.dataset.data)
        });
      }).
      catch(reject);
  }.bind(this));
};

StockService.prototype.getRequestOptions = function getRequestOptions() {
  const params = {
    api_key: process.env.QUANDL_API_KEY,
    order: 'asc',
    collapse: 'monthly',
    start_date: moment().subtract(this.duration * YEAR, 'd').format(DATE_FORMAT),
    end_date: moment().format(DATE_FORMAT)
  };

  return {
    url: QUANDL_URL.replace(SYMBOL_PLACEHOLDER, this.symbol),
    qs: params,
    json: true
  };
};

function formatData(data) {
  return data.map(function(datum) {
    return datum[4];

    // return {
    //   date: moment(datum[0], DATE_FORMAT).toDate(),
    //   value: datum[4]
    // };
  });
}

module.exports = StockService;
