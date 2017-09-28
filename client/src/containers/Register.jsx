import React, { Component } from 'react';

import makeAuthable from './Authable.jsx';

class Register extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <main className="container">
        {this.props.children}
        <form action="/api/register"
              method="post"
              onSubmit={this.props.authenticate}
              className="form">
          <label htmlFor="name">Name</label>
          <input id="name"
                 type="text"
                 name="name"
                 className="form__input" />
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
                 required />
          <label htmlFor="confirm">Confirm Password</label>
          <input id="confirm"
                 type="password"
                 name="confirm"
                 className="form__input"
                 required />
          <input type="submit"
                 value="Register"
                 className="button button--primary button--block" />
        </form>
      </main>
    );
  }
}

Register = makeAuthable(Register);

export default Register;
