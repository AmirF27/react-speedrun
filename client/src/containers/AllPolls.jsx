import React, { Component } from 'react';
import Ajax from '../js/ajax';

export default class AllPolls extends Component {
  constructor() {
    super();

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
    Ajax.
      get(`/api${window.location.pathname}`).
      then(
        function fulfilled(response) {
          this.displayPolls(JSON.parse(response));
        }.bind(this),
        function rejected(reason) {});
  }

  displayPolls(polls) {
    this.setState({
      polls: polls.map((poll, i) => {
        return (
          <li key={i}>{poll.title}</li>
        );
      })
    });
  }
};
