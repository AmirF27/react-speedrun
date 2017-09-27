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
        <form action="/api/register"
              method="post"
              onSubmit={this.register}
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
