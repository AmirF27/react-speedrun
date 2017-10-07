import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Ajax from '../js/ajax';

import PollList from './PollList.jsx';
import makeAlertable from './Alertable.jsx';
import RequireLogin from './RequireLogin.jsx';

class UserPolls extends Component {
  constructor(props) {
    super(props);

    this.getUserPolls = this.getUserPolls.bind(this);
    this.deletePoll = this.deletePoll.bind(this);

    this.state = {
      ready: false,
      polls: []
    };
  }

  render() {
    return (
      <main className="container">
        <RequireLogin callback={this.getUserPolls} />
        {this.props.children}
        {this.state.ready
          ? <PollList
              polls={this.state.polls}
              type="user"
              onDeletePoll={this.deletePoll}>
            </PollList>
          : <p>Loading polls...</p>
        }
      </main>
    );
  }

  getUserPolls() {
    Ajax.get(`/api/profile/polls`).
      then(
        function fulfilled(res) {
          this.setState({
            ready: true,
            polls: res
          });
        }.bind(this),
        function rejected(err) {
          console.error(err);
        }
      );
  }

  deletePoll(pollTitle) {
    Ajax.delete(`/api/voting-app/delete/${pollTitle}`).
      then(
        function fulfilled(res) {
          this.props.alert(res);
          if (res.type == 'success') {
            const updatedPolls = this.state.polls;
            updatedPolls.splice(
              updatedPolls.findIndex(poll => poll.title == pollTitle),
              1
            );
            this.setState({
              polls: updatedPolls
            });
          }
        }.bind(this),
        function rejected(err) {
          this.props.alert(err);
        }
      );
  }
}

UserPolls = makeAlertable(UserPolls);

export default UserPolls;
