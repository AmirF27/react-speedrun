import React, { Component } from 'react';
import Chart from 'chart.js';

import { palette } from '../js/util';

class ChartView extends Component {
  constructor(props) {
    super(props);

    this.displayChart = this.displayChart.bind(this);
    this.formatDatasets = this.formatDatasets.bind(this);
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
  }

  componentDidUpdate() {
    this.updateChart();
  }

  displayChart() {
    console.log(this.props.labels);

    const chart = new Chart('chart', {
      type: this.props.type || 'bar',
      data: {
        labels: this.props.labels,
        datasets: this.formatDatasets()
        // datasets: [{
        //   label: 'Votes',
        //   data: this.props.data,
        //   backgroundColor: this.generatePalette()
        // }]
      }
    });

    this.setState({ chart });
  }

  formatDatasets() {
    return this.props.datasets.map((dataset, i) => {
      const formatted = {
        label: dataset.label,
        data: dataset.data
      };

      if (this.props.type == 'pie') {
        formatted.backgroundColor = this.generatePalette(dataset.data.length);
      } else {
        formatted.borderColor = palette[i];
        formatted.fill = false;
      }

      return formatted;
    });
  }

  generatePalette(length) {
    return palette.slice(0, length);
  }

  updateChart() {
    this.state.chart.data.labels = this.props.labels;
    this.state.chart.data.datasets = this.formatDatasets();
    // this.state.chart.data.datasets[0].data = this.props.datasets[0].data;
    // this.state.chart.data.datasets[0].backgroundColor = this.generatePalette(this.props.datasets[0].data.length);
    this.state.chart.update();
  }
}

export default ChartView;
