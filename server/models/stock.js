const Schema = require('mongoose').Schema;
const StockService = require('../stock-service');

const stockSchema = new Schema({
  symbol: {
    type: String,
    uppercase: true,
    required: true
  }
});

stockSchema.statics.getStockData = function getStockData(callback) {
  this.find({}, { _id: 0, symbol: 1 }, function(err, stocks) {
    if (err) return callback(err);

    Promise.all(this.generateRequests(stocks)).
      then(callback).
      catch(callback);
  }.bind(this));
};

stockSchema.statics.generateRequests = function generateRequests(stocks) {
  const requests = [];

  for (let stock of stocks) {
    const stockService = new StockService({ symbol: stock.symbol });
    requests.push(stockService.getData());
  }

  return requests;
};

module.exports = stockSchema;
