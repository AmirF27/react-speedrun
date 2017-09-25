import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import Ajax from '../js/ajax';

import {
  authenticate,
  unauthenticate
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
      <main>
        <form action="/api/login" method="post" onSubmit={this.login}>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" name="email" required />
          <label htmlFor="password">Password</label>
          <input id="password" type="password" name="password" required></input>
          <input type="submit" value="Login" />
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
        this.props.authenticate(data.user);
      }
    });
  }
};

const mapStateToProps = state => {
  return {
    authed: state.auth.authed
  };
};

export default connect(
  mapStateToProps,
  { authenticate },
)(Login);
