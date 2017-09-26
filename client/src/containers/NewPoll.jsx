import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import Ajax from '../js/ajax';
import { checkAuth, mapStateToProps } from '../js/util';

import {
  login,
  logout
} from '../actions';

class NewPoll extends Component {
  constructor() {
    super();

    this.addOption = this.addOption.bind(this);
    this.submitPoll = this.submitPoll.bind(this);

    this.state = {
      nOptions: 2,
      checkedAuth: false,
      authed: false,
      message: ''
    };
  }

  render() {
    const options = [];

    for (let i = 0; i < this.state.nOptions; i++) {
      options.push(<input id={`poll-option${i + 1}`} type="text" name={`options[${i}]`} key={i} required />);
    }

    if (this.state.checkedAuth && !this.props.authed) {
      return (<Redirect to="/login" />);
    }

    return (
      <main>
        <h3>Create a new poll</h3>
        <form action="/api/voting-app/new-poll" method="post" onSubmit={this.submitPoll}>
          <label htmlFor="poll-title">Poll title</label>
          <input id="poll-title" type="text" name="title" required />
          <label htmlFor="poll-option1">Options</label>
          {options}
          <input type="submit" value="Add Poll" />
        </form>
        <button onClick={this.addOption}>+</button>
        <p>{this.state.message}</p>
      </main>
    );
  }

  componentDidMount() {
    checkAuth(
      this.props.login,
      this.props.logout,
      () => this.setState({ checkedAuth: true })
    );
  }

  addOption() {
    this.setState({
      nOptions: this.state.nOptions + 1
    });
  }

  submitPoll(event) {
    event.preventDefault();

    Ajax.submitForm(event.target, (err, data) => {
      if (!err) {
        this.setState({
          message: data.error || data.message
        });
      } else {
        console.error(err);
      }
    });
  }
};

export default connect(
  mapStateToProps,
  {
    login,
    logout
  }
)(NewPoll);
