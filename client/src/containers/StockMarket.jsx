import React, { Component } from 'react';
import Ajax from '../js/ajax';

import ChartView from './ChartView.jsx';

class StockMarket extends Component {
  constructor(props) {
    super(props);

    this.getStockData = this.getStockData.bind(this);

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
        console.log(res);
      }.bind(this)).
      catch(function rejected(err) {
        console.error(err);
      });
  }

  componentDidMount() {
    this.getStockData();
  }

  render() {
    return (
      <main className="container">
        {this.state.stocks
          ? <ChartView title="Stocks" type="line"
              labels={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
              datasets={this.state.datasets} />
          : <p>Loading...</p>
        }
      </main>
    );
  }
}

export default StockMarket;
