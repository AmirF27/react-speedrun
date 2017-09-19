import React, { Component } from 'react';
import { Redirect } from 'react-router';
import Ajax from '../js/ajax';

export default class NewPoll extends Component {
  constructor() {
    super();

    this.addPoll = this.addPoll.bind(this);

    this.state = {
      nPolls: 2,
      checkedAuth: false,
      authed: false
    };
  }

  render() {
    const polls = [];

    for (let i = 0; i < this.state.nPolls; i++) {
      polls.push(<input id={`poll-option${i + 1}`} type='text' name={`options[${i}]`} key={i} required />);
    }

    if (this.state.checkedAuth && !this.state.authed) {
      return (<Redirect to='/login' />);
    }

    return (
      <main>
        <h3>Create a new poll</h3>
        <form action='/api/voting-app/new-poll' method='post' onSubmit={this.addPoll}>
          <label htmlFor='poll-title'>Poll title</label>
          <input id='poll-title' type='text' name='title' required />
          <label htmlFor='poll-option1'>Options</label>
          {polls}
          <input type='submit' value='Add Poll' />
        </form>
      </main>
    );
  }

  componentDidMount() {
    Ajax.get('/api/user').then(data => {
      const user = JSON.parse(data).user;
      this.setState({
        checkedAuth: true,
        authed: user ? true : false
      });
    });
  }

  addPoll(event) {
    event.preventDefault();

    Ajax.submitForm(event.target, (err, data) => {
      if (!err) {
        console.log(data);
      } else {
        console.error(err);
      }
    });
  }
};
