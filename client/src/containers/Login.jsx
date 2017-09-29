import React, { Component } from 'react';

import makeAuthable from './Authable.jsx';

class Login extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <main className="container">
        {this.props.children}
        <form action="/auth/login"
              method="post"
              onSubmit={this.props.authenticate}
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
      </main>
    );
  }
}

Login = makeAuthable(Login);

export default Login;
