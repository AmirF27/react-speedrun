import React, { Component } from 'react';
import io from 'socket.io-client';
import Ajax from '../js/ajax';

import ChartView from './ChartView.jsx';

const socket = io();

class StockMarket extends Component {
  constructor(props) {
    super(props);

    this.getStockData = this.getStockData.bind(this);
    this.addStock = this.addStock.bind(this);

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

  componentDidMount() {
    this.getStockData();

    socket.on('add stock', stock => {
      const dataset = { label: stock.symbol, data: stock.data };
      this.setState({
        stocks: this.state.stocks.concat(stock),
        datasets: this.state.datasets.concat(dataset)
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

    return (
      <main className="container">
        <ChartView title="Stocks" type="line"
          labels={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
          datasets={this.state.datasets} />
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
