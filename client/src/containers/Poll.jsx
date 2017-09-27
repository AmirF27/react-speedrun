import React, { Component } from 'react';
import { connect } from 'react-redux';
import Ajax from '../js/ajax';
import { checkAuth, mapStateToProps } from '../js/util';

import { login, logout } from '../actions';
import ChartView from './ChartView.jsx';

class Poll extends Component {
  constructor(props) {
    super(props);

    this.getPoll = this.getPoll.bind(this);
    this.submitVote = this.submitVote.bind(this);
    this.addOption = this.addOption.bind(this);
    this.handleResponse = this.handleResponse.bind(this);

    this.state = {
      title: props.match.params.title,
      poll: null,
      error: null,
      message: null
    };
  }

  render() {
    if (!this.state.poll) {
      return (
        <main>
          <p>Loading poll...</p>
        </main>
      );
    }

    const options = this.state.poll.options.map(function(option, i) {
      return (
        <div>
          <input
            id={`option.name${i}`} className="form__radio" key={i} name="vote"
            type="radio" value={option.name} required />
          <label htmlFor={`option.name${i}`}>{option.name}</label>
        </div>
      );
    });

    return (
      <main className="container">
        <form
          action={`/api/voting-app/vote/${this.state.poll.title}`}
          method="post" onSubmit={this.submitVote} className="form">
          {options}
          <input type="submit" value="Vote" className="button button--primary" />
        </form>
        {this.props.authed &&
          <form
            action={`/api/voting-app/add-option/${this.state.poll.title}`}
            method="post" onSubmit={this.addOption} className="form form--inline">
            <input
              className="form__input" name="option" type="text"
              placeholder="Add a custom option..." required
            />
            <input
              className="button button--default" type="submit"
              value="Add Option"
            />
          </form>
        }
        <ChartView
          title="Votes"
          labels={this.state.poll.options.map(option => option.name)}
          data={this.state.poll.options.map(option => option.votes)}>
        </ChartView>
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
    checkAuth(this.props.login, this.props.logout);
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
    event.persist();

    Ajax.submitForm(event.target, (err, data) => {
      this.handleResponse(err, data);
      this.getPoll();
    });
  }

  addOption(event) {
    event.preventDefault();
    event.persist();

    Ajax.submitForm(event.target, (err, data) => {
      this.handleResponse(err, data);
      this.getPoll();
    });
  }

  handleResponse(err, data) {
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
  }
}

export default connect(
  mapStateToProps,
  { login, logout }
)(Poll);
