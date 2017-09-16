import React, { Component } from 'react';

export default class ViewPolls extends Component {
  constructor() {
    super();

    this.getPolls = this.getPolls.bind(this);

    this.state = {
      polls: []
    };
  }

  render() {
    return (
      <main>
        <ul>
          {this.state.polls}
        </ul>
      </main>
    );
  }

  componentDidMount() {
    this.getPolls();
  }

  getPolls() {
    this.setState({
      polls: [
        <li>Poll 1</li>,
        <li>Poll 2</li>
      ]
    });
  }
};
