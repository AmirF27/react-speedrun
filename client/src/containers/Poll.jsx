import React, { Component } from 'react';

import Ajax from '../js/ajax';

class Poll extends Component {
  constructor(props) {
    super(props);

    this.getPoll = this.getPoll.bind(this);
    this.submitVote = this.submitVote.bind(this);

    this.state = {
      title: props.match.params.title,
      poll: null,
      error: null,
      message: null
    };
  }

  render() {
    let options;

    if (this.state.poll) {
      options = this.state.poll.options.map(function(option, i) {
        return (
          <div>
            <input id={`option.name${i}`} type="radio" value={option.name} name="vote" key={i} required />
            <label htmlFor={`option.name${i}`}>{option.name} ({option.votes} votes)</label>
          </div>
        );
      });

      return (
        <main>
          <form action="/api/voting-app/vote/" method="post" onSubmit={this.submitVote}>
            <input type="hidden" value={this.state.poll.title} name="pollTitle" />
            {options}
            <input type="submit" value="vote" />
          </form>
          {this.state.error &&
            <p>{this.state.error}</p>
          }
          {this.state.message &&
            <p>{this.state.message}</p>
          }
        </main>
      );
    }

    return null;
  }

  componentDidMount() {
    this.getPoll();
  }

  getPoll() {
    const url = `/api/voting-app/poll/${this.state.title}`;

    Ajax.
      get(url).
      then(
        function fulfilled(res) {
          this.setState({
            poll: res
          });
        }.bind(this),
        function rejected(err) {
          console.log(err);
        }
      );
  }

  submitVote(event) {
    event.preventDefault();

    Ajax.submitForm(event.target, (err, data) => {
      if (!err) {
        this.setState({
          error: data.error || null,
          message: data.message || null
        });
      } else {
        this.setState({
          error: err.error,
          message: null
        });
      }
    });
  }
}

export default Poll;
