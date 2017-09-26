import React, { Component } from 'react';
import { Redirect } from 'react-router';
import Ajax from '../js/ajax';

class Register extends Component {
  constructor() {
    super();

    this.register = this.register.bind(this);

    this.state = {
      error: null,
      success: false
    };
  }

  render() {
    return (
      <main className="container">
        <form action="/api/register" method="post" onSubmit={this.register}>
          <label htmlFor="name">Name</label>
          <input id="name" type="text" name="name" />
          <label htmlFor="email">Email</label>
          <input id="email" type="email" name="email" required />
          <label htmlFor="password">Password</label>
          <input id="password" type="password" name="password" required />
          <label htmlFor="confirm">Confirm Password</label>
          <input id="confirm" type="password" name="confirm" required />
          <input type="submit" value="Register" className="button button--primary" />
        </form>
        {this.state.error &&
          <p>{this.state.error}</p>
        }
        {this.state.success &&
          <Redirect to='/' />
        }
      </main>
    );
  }

  register(event) {
    event.preventDefault();

    Ajax.submitForm(event.target, (err, data) => {
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
}

export default Register;
