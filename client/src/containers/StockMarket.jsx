import React, { Component } from 'react';
import io from 'socket.io-client';
import moment from 'moment';
import Ajax from '../js/ajax';

import ChartView from './ChartView.jsx';

const socket = io();

class StockMarket extends Component {
  constructor(props) {
    super(props);

    this.getStockData = this.getStockData.bind(this);
    this.addStock = this.addStock.bind(this);
    this.deleteStock = this.deleteStock.bind(this);
    this.generateMonths = this.generateMonths.bind(this);

    this.state = {
      stocks: null,
      datasets: null
    };
  }

  getStockData() {
    Ajax.get('/api/stock-market').
      then(function fulfilled(res) {
        const datasets = res.map(stock => {
          return {
            label: stock.symbol,
            data: stock.data
          };
        });
        this.setState({ stocks: res, datasets });
      }.bind(this)).
      catch(function rejected(err) {
        console.error(err);
      });
  }

  addStock(event) {
    event.preventDefault();

    Ajax.submitForm(event.target, function(err, res) {
      console.log(err || res);
      // if (err) return console.error(err);
      //
      // if (res.type != 'error') {
      //   const dataset = { label: res.symbol, data: res.data };
      //
      //   this.setState({
      //     stocks: this.state.stocks.concat(res),
      //     datasets: this.state.datasets.concat(dataset)
      //   });
      // }
    }.bind(this));
  }

  deleteStock(symbol) {
    const body = { symbol };

    Ajax.delete('/api/stock-market', { body }).
      then(function fulfilled(res) {

      }.bind(this)).
      catch(function rejected(err) {
        console.error(err);
      });
  }

  generateMonths() {
    const m = moment();
    const months = [];

    for (let i = 0; i < 12; i++) {
      months.unshift(m.subtract(i, 'm').startOf('month').format('MMM YY'));
    }

    return months;
  }

  componentDidMount() {
    this.getStockData();

    socket.on('add stock', stock => {
      const dataset = { label: stock.symbol, data: stock.data };
      this.setState({
        stocks: this.state.stocks.concat(stock),
        datasets: this.state.datasets.concat(dataset)
      });
    });

    socket.on('delete stock', symbol => {
      const index = this.state.stocks.findIndex(stock => stock.symbol == symbol);
      this.setState({
        stocks: this.state.stocks.filter(stock => stock.symbol != symbol),
        datasets: this.state.datasets.filter(dataset => dataset.label != symbol)
      });
    });
  }

  render() {
    if (!this.state.stocks) {
      return (
        <main className="container">
          <p>Loading...</p>
        </main>
      );
    }

    const stockList = this.state.stocks.map(stock => {
      return (
        <li className="list__item col col-d-4">
          <h3>
            {stock.symbol}
            <button className="button button--negative button--small right"
              onClick={() => this.deleteStock(stock.symbol)}>
              DELETE
            </button>
          </h3>
          <p>{stock.name}</p>
        </li>
      );
    });

    return (
      <main className="container">
        <ChartView title="Stocks" type="line"
          labels={this.generateMonths()}
          datasets={this.state.datasets} />
        <ul className="list grid">
          {stockList}
        </ul>
        <form action="/api/stock-market" method="post"
          className="form form--inline" onSubmit={this.addStock}>
          <input className="form__input" type="text" name="symbol"
            placeholder="Enter stock symbol" required />
          <input className="button button--default" type="submit" value="Add Stock" />
        </form>
      </main>
    );
  }
}

export default StockMarket;
