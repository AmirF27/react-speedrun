import React, { Component } from 'react';
import { Redirect } from 'react-router';
import Ajax from '../js/ajax';

export default class extends Component {
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
        this.setState({
          error: null,
          success: true
        });
      }
    });
  }
};
