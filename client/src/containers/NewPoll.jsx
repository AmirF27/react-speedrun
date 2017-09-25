import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import Ajax from '../js/ajax';
import { checkAuth } from '../js/util';

import {
  authenticate,
  unauthenticate
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
    const polls = [];

    for (let i = 0; i < this.state.nOptions; i++) {
      polls.push(<input id={`poll-option${i + 1}`} type='text' name={`options[${i}]`} key={i} required />);
    }

    if (this.props.checkedAuth && !this.props.authed) {
      return (<Redirect to='/login' />);
    }

    return (
      <main>
        <h3>Create a new poll</h3>
        <form action='/api/voting-app/new-poll' method='post' onSubmit={this.submitPoll}>
          <label htmlFor='poll-title'>Poll title</label>
          <input id='poll-title' type='text' name='title' required />
          <label htmlFor='poll-option1'>Options</label>
          {polls}
          <input type='submit' value='Add Poll' />
        </form>
        <button onClick={this.addOption}>+</button>
        <p>{this.state.message}</p>
      </main>
    );
  }

  componentDidMount() {
    checkAuth(this.props.authenticate, this.props.unauthenticate);
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
        data = JSON.parse(data);
        this.setState({
          message: data.error || data.message
        });
      } else {
        err = JSON.parse(err);
        console.error(err);
      }
    });
  }
};

const mapStateToProps = state => {
  return {
    authed: state.auth.authed,
    user: state.auth.user
  };
};

export default connect(
  mapStateToProps,
  {
    authenticate,
    unauthenticate
  }
)(NewPoll);
