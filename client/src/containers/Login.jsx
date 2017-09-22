import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import Ajax from '../js/ajax';

import { authenticate } from '../actions';

class Login extends Component {
  constructor() {
    super();

    this.login = this.login.bind(this);

    this.state = {
      error: null,
      success: false
    };
  }

  render() {
    if (this.state.success) {
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
      data = JSON.parse(data);

      if (data.error) {
        this.setState({
          error: data.error || null,
          success: false
        });
      } else {
        this.props.authenticate(data.user);
        this.setState({
          error: null,
          success: true
        });
      }
    });
  }
};

const mapStateToProps = (state) => {
  return {
    authed: state.auth.authed,
    user: state.auth.user
  };
};

export default connect(
  mapStateToProps,
  { authenticate },
)(Login);
