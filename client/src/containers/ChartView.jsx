import React, { Component } from 'react';
import Chart from 'chart.js';

import { palette } from '../js/util';

class ChartView extends Component {
  constructor(props) {
    super(props);

    this.displayChart = this.displayChart.bind(this);
    this.updateChart = this.updateChart.bind(this);
    this.generatePalette = this.generatePalette.bind(this);

    this.state = {
      chart: null
    };
  }

  render() {
    return (
      <section style={{width: '400px'}}>
        <h2>{this.props.title || 'Chart'}</h2>
        <canvas id="chart"></canvas>
      </section>
    );
  }

  componentDidMount() {
    this.displayChart();
    console.dir(palette.slice(0, this.props.data.length));
  }

  componentDidUpdate() {
    this.updateChart();
  }

  displayChart() {
    const chart = new Chart('chart', {
      type: 'pie',
      data: {
        labels: this.props.labels,
        datasets: [{
          label: 'Votes',
          data: this.props.data,
          backgroundColor: this.generatePalette()
        }]
      }
    });

    this.setState({ chart });
  }

  generatePalette() {
    return palette.slice(0, this.props.data.length);
  }

  updateChart() {
    this.state.chart.data.labels = this.props.labels;
    this.state.chart.data.datasets[0].data = this.props.data;
    this.state.chart.data.datasets[0].backgroundColor = this.generatePalette();
    this.state.chart.update();
  }
}

export default ChartView;
