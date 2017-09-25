import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Ajax from '../js/ajax';

export default class UserPolls extends Component {
  constructor(props) {
    super(props);

    this.getUserPolls = this.getUserPolls.bind(this);

    this.state = {
      ready: false,
      polls: []
    };
  }

  render() {
    if (!this.state.ready) {
      return (<main></main>);
    }

    if (this.state.polls.length == 0) {
      return (
        <main>
          <p>Looks like this user has no polls yet.</p>
        </main>
      );
    }

    const polls = this.state.polls.map(poll => {
      return (
        <li><Link to={`/voting-app/poll/${poll.title}`}>{poll.title}</Link></li>
      );
    });

    return (
      <main>
        <ul>{polls}</ul>
      </main>
    );
  }

  componentDidMount() {
    this.getUserPolls();
  }

  getUserPolls() {
    Ajax.get(`/api/profile/${this.props.match.params.email}/polls`).
      then(
        function fulfilled(res) {
          this.setState({
            ready: true,
            polls: JSON.parse(res)
          });
        }.bind(this),
        function rejected(err) {
          console.error(err);
        }
      );
  }
};
