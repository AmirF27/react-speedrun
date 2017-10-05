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
      <section>
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
    const chart = new Chart('chart', {
      type: this.props.type || 'bar',
      data: {
        labels: this.props.labels,
        datasets: this.formatDatasets()
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
    this.state.chart.update();
  }
}

export default ChartView;
