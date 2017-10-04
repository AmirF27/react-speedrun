import React, { Component } from 'react';
import Ajax from '../js/ajax';

import ChartView from './ChartView.jsx';

class StockMarket extends Component {
  constructor(props) {
    super(props);

    this.getStockData = this.getStockData.bind(this);

    this.state = {
      stocks: null
    };
  }

  getStockData() {
    const params = {
      symbol: 'GOOG'
    };

    Ajax.get('/api/stock-market', { params }).
      then(function fulfilled(res) {
        this.setState({ stocks: res });
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
              datasets={[{
                label: this.state.stocks.symbol,
                data: this.state.stocks.data.map(datum => datum.value)
              }]} />
          : <p>Loading...</p>
        }
      </main>
    );
  }
}

export default StockMarket;
