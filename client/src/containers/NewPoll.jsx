import React, { Component } from 'react';
import { Redirect } from 'react-router';
import Ajax from '../js/ajax';

export default class NewPoll extends Component {
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

    if (this.state.checkedAuth && !this.state.authed) {
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
    Ajax.get('/api/check-auth').then(data => {
      data = JSON.parse(data);
      this.setState({
        checkedAuth: true,
        authed: data.authed
      });
    });
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
