import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class PollList extends Component {
  render() {
    if (this.props.polls.length == 0) {
      return (
        <p>
          {this.props.type == 'all'
            ? 'There are no polls at the moment.'
            : 'Looks like this user has no polls yet.'
          }
        </p>
      );
    }

    const list = this.props.polls.map(poll => {
      return (
        <li>
          <Link to={`/voting-app/poll/${poll.title}`}>{poll.title}</Link>
          {this.props.type == 'user' && this.props.isProfileOwner &&
            <button onClick={() => this.deletePoll(poll.title)}>DELETE</button>
          }
        </li>
      );
    });

    return (
      <ul>{list}</ul>
    );
  }
};