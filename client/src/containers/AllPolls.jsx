import React, { Component } from 'react';
import Ajax from '../js/ajax';

class AllPolls extends Component {
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
        function fulfilled(res) {
          this.displayPolls(res);
        }.bind(this),
        function rejected(err) {
          console.error(err);
        });
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
}

export default AllPolls;
