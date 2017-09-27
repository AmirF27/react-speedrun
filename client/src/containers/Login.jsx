import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import Ajax from '../js/ajax';
import { mapStateToProps } from '../js/util';

import {
  login,
  logout
} from '../actions';

class Login extends Component {
  constructor() {
    super();

    this.login = this.login.bind(this);

    this.state = {
      error: null
    };
  }

  render() {
    if (this.props.authed) {
      return (<Redirect to='/' />);
    }

    return (
      <main className="container">
        <form action="/api/login"
              method="post"
              onSubmit={this.login}
              className="form">
          <label htmlFor="email">Email</label>
          <input id="email"
                 type="email"
                 name="email"
                 className="form__input"
                 required />
          <label htmlFor="password">Password</label>
          <input id="password"
                 type="password"
                 name="password"
                 className="form__input"
                 required></input>
          <input type="submit"
                 value="Login"
                 className="button button--primary button--block" />
        </form>
        {this.state.error &&
          <p>{this.state.error}</p>
        }
      </main>
    );
  }

  login(event) {
    event.preventDefault();

    Ajax.submitForm(event.target, (err, data) => {
      if (data.error) {
        this.setState({
          error: data.error
        });
      } else {
        this.props.login(data.user);
      }
    });
  }
};

export default connect(
  mapStateToProps,
  { login },
)(Login);
