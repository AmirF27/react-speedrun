import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Ajax from '../js/ajax';

import PollList from './PollList.jsx';

export default class VotingApp extends Component {
  constructor() {
    super();

    this.getPolls = this.getPolls.bind(this);

    this.state = {
      ready: false,
      polls: []
    };
  }

  render() {
    if (!this.state.ready) {
      return (
        <main></main>
      );
    }

    return (
      <main>
        <Link to="/voting-app/new-poll">Make a New Poll</Link>
        <PollList polls={this.state.polls} type="all"></PollList>
      </main>
    );
  }

  componentDidMount() {
    this.getPolls();
  }

  getPolls() {
    Ajax.get('/api/voting-app/all-polls').
      then(
        function fulfilled(polls) {
          this.setState({ ready: true, polls });
        }.bind(this),
        function rejected(err) {
          console.error(err);
        }
      );
  }
};
