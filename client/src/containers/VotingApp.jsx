import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Ajax from '../js/ajax';

import PollList from './PollList.jsx';

class VotingApp extends Component {
  constructor() {
    super();

    this.getPolls = this.getPolls.bind(this);

    this.state = {
      ready: false,
      polls: []
    };
  }

  render() {
    return (
      <main className="container">
        <div className="grid grid--center">
          <Link to="/voting-app/new-poll"
            className="button button--primary col col-d-5">
            Make a New Poll
          </Link>
        </div>
        {this.state.ready
          ? <PollList polls={this.state.polls} type="all"></PollList>
          : <p>Loading polls...</p>
        }
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
}

export default VotingApp;
