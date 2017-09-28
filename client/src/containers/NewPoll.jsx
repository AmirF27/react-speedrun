import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Ajax from '../js/ajax';
import { checkAuth, mapStateToProps } from '../js/util';

import makeAlertable from './Alertable.jsx';
import { login, logout } from '../actions';

class NewPoll extends Component {
  constructor() {
    super();

    this.addOption = this.addOption.bind(this);
    this.submitPoll = this.submitPoll.bind(this);

    this.state = {
      nOptions: 2,
      checkedAuth: false
    };
  }

  render() {
    const options = [];

    for (let i = 0; i < this.state.nOptions; i++) {
      options.push(
        <input id={`poll-option${i + 1}`}
               type="text"
               name={`options[${i}]`}
               key={i}
               className="form__input"
               required />
      );
    }

    if (this.state.checkedAuth && !this.props.authed) {
      return (<Redirect to="/login" />);
    }

    return (
      <main className="container">
        <h3>Create a new poll</h3>
        {this.props.children}
        <form action="/api/voting-app/new-poll"
              method="post"
              onSubmit={this.submitPoll}
              className="form">
          <label htmlFor="poll-title">Poll title</label>
          <input id="poll-title"
                 type="text"
                 name="title"
                 className="form__input"
                 required />
          <label htmlFor="poll-option1">Options</label>
          {options}
          <button
            onClick={this.addOption}
            type="button"
            className="button button--default">
            <i className="fa fa-plus" aria-hidden="true"></i> Add Option
          </button>
          <input type="submit"
                 value="Add Poll"
                 className="button button--primary button--block" />
        </form>
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
    event.persist();

    Ajax.submitForm(event.target, (err, data) => {
      this.props.alert(err || {
        ...data,
        link: data.type == 'success'
          ? {
              text: 'View poll.',
              to: `/voting-app/poll/${event.target.elements['title'].value}`
            }
          : null
      });
    });
  }
};

NewPoll = makeAlertable(NewPoll);

export default connect(
  mapStateToProps,
  { login, logout }
)(NewPoll);
