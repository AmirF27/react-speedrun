import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Ajax from '../js/ajax';
import { checkAuth, mapStateToProps } from '../js/util';

import {
  authenticate,
  unauthenticate
} from '../actions';

class UserPolls extends Component {
  constructor(props) {
    super(props);

    this.getUserPolls = this.getUserPolls.bind(this);
    this.deletePoll = this.deletePoll.bind(this);

    this.state = {
      ready: false,
      polls: [],
      error: null,
      message: null
    };
  }

  render() {
    if (!this.state.ready) {
      return (<main></main>);
    }

    const polls = this.state.polls.map(poll => {
      return (
        <li>
          <Link to={`/voting-app/poll/${poll.title}`}>{poll.title}</Link>
          {this.state.isProfileOwner &&
            <button onClick={() => this.deletePoll(poll.title)}>DELETE</button>
          }
        </li>
      );
    });

    return (
      <main>
        {this.state.polls.length == 0
          ? <p>Looks like this user has no polls yet.</p>
          : <ul>{polls}</ul>
        }
        {this.state.error &&
          <p>{this.state.error}</p>
        }
        {this.state.message &&
          <p>{this.state.message}</p>
        }
      </main>
    );
  }

  componentDidMount() {
    checkAuth(
      this.props.authenticate,
      this.props.unauthenticate,
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
          let updatedPolls = this.state.polls;
          if (!res.error) {
            updatedPolls.splice(
              updatedPolls.findIndex(poll => poll.title == pollTitle),
              1
            );
          }
          this.setState({
            polls: updatedPolls,
            error: res.error || null,
            message: res.message || null
          });
          console.dir(this.state);
        }.bind(this),
        function rejected(err) {
          console.log(err)
        }
      );
  }
}

export default connect(
  mapStateToProps,
  {
    authenticate,
    unauthenticate
  }
)(UserPolls);
