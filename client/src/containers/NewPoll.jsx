import React, { Component } from 'react';
import Ajax from '../js/ajax';

export default class NewPoll extends Component {
  constructor() {
    super();

    this.addPoll = this.addPoll.bind(this);

    this.state = {
      nPolls: 2
    };
  }

  render() {
    const polls = [];

    for (let i = 0; i < this.state.nPolls; i++) {
      polls.push(<input id={`poll-option${i + 1}`} type='text' name={`options[${i}]`} key={i} required></input>);
    }

    return (
      <main>
        <h3>Create a new poll</h3>
        <form action='/api/voting-app/new-poll' method='post' onSubmit={this.addPoll}>
          <label htmlFor='poll-title'>Poll title</label>
          <input id='poll-title' type='text' name='title' required></input>
          <label htmlFor='poll-option1'>Options</label>
          {polls}
          <input type='submit' value='Add Poll'></input>
        </form>
      </main>
    );
  }

  addPoll(event) {
    event.preventDefault();

    const url = event.target.getAttribute('action');
    const options = {
      headers: [
        { 'Content-type': 'x-www-form-urlencoded' }
      ],
      form: new FormData(event.target)
    };

    Ajax.
      post(url, options).
      then(
        function fulfilled(response) {
          console.log(response);
        },
        function rejected(reason) {
          constole.error('rejected');
        });
  }
};
