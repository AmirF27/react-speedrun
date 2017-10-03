import React, { Component } from 'react';
import Ajax from '../js/ajax';

import PollList from './PollList.jsx';

class AllPolls extends Component {
  constructor() {
    super();

    this.state = {
      polls: []
    };
  }

  render() {
    return (
      <main className="container">
        <PollList
          polls={this.state.polls}
          type="all">
        </PollList>
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
          this.setState({
            polls: res
          });
        }.bind(this),
        function rejected(err) {
          console.error(err);
        });
  }
}

export default AllPolls;
