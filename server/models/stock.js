const Schema = require('mongoose').Schema;
const StockService = require('../stock-service');

const stockSchema = new Schema({
  symbol: {
    type: String,
    uppercase: true,
    index: true,
    unique: true,
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

stockSchema.statics.addStock = function addStock(symbol, callback) {
  this.lookupStock(symbol, function(err, data) {
    if (err) return callback(err.error || err);

    const stock = new this({ symbol: data.symbol });

    stock.save(function (err) {
      if (err) return callback(err);
      return callback(null, data);
    });
  }.bind(this));
};

stockSchema.statics.lookupStock = function lookupStock(symbol, callback) {
  const stockService = new StockService({ symbol });

  stockService.getData().
    then(callback.bind(this, null)).
    catch(callback.bind(this));
};

module.exports = stockSchema;
