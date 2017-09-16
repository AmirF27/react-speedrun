import React, { Component } from 'react';

export default class NewPoll extends Component {
  constructor() {
    super();
    this.state = {
      nPolls: 2
    };
  }

  render() {
    const polls = [];

    for (let i = 1; i <= this.state.nPolls; i++) {
      polls.push(<input id={'pollOption' + i} type='text' key={i} required></input>);
    }

    return (
      <main>
        <h3>Create a new poll</h3>
        <form action='' method='post'>
          <label htmlFor='pollTitle'>Poll title</label>
          <input id='pollTitle' type='text' required></input>
          <label htmlFor='pollOption1'>Options</label>
          {polls}
          <input type='submit' value='Add Poll'></input>
        </form>
      </main>
    );
  }
};
