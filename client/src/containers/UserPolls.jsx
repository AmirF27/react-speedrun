import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Ajax from '../js/ajax';
import { checkAuth, mapStateToProps } from '../js/util';

import PollList from './PollList.jsx';
import makeAlertable from './Alertable.jsx';

import { login, logout } from '../actions';

class UserPolls extends Component {
  constructor(props) {
    super(props);

    this.getUserPolls = this.getUserPolls.bind(this);
    this.deletePoll = this.deletePoll.bind(this);

    this.state = {
      ready: false,
      polls: [],
      isProfileOwner: false
    };
  }

  render() {
    if (!this.state.ready) {
      return (
        <main className="container">
          <p>Loading polls...</p>
        </main>
      );
    }

    return (
      <main className="container">
        {this.props.children}
        <PollList
          polls={this.state.polls}
          type="user"
          isProfileOwner={this.state.isProfileOwner}
          onDeletePoll={this.deletePoll}>
        </PollList>
      </main>
    );
  }

  componentDidMount() {
    checkAuth(
      this.props.login,
      this.props.logout,
      this.getUserPolls
    );
  }

  getUserPolls() {
    const email = this.props.match.params.email;

    Ajax.get(`/api/profile/${email}/polls`).
      then(
        function fulfilled(res) {
          this.setState({
            ready: true,
            polls: res,
            isProfileOwner: this.props.user
              ? this.props.user.email == email
              : false
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

export default connect(
  mapStateToProps,
  {
    login,
    logout
  }
)(UserPolls);
