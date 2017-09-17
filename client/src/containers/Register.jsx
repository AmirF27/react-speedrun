import React, { Component } from 'react';
import Ajax from '../js/ajax';

export default class Register extends Component {
  render() {
    return (
      <main>
        <form action="/api/register" method="post" onSubmit={this.register}>
          <label htmlFor="name">Name</label>
          <input id="name" type="text" name="name" />
          <label htmlFor="email">Email</label>
          <input id="email" type="email" name="email" required />
          <label htmlFor="password">Password</label>
          <input id="password" type="password" name="password" required />
          <label htmlFor="confirm">Confirm Password</label>
          <input id="confirm" type="password" name="confirm" required />
          <input type="submit" value="Register" />
        </form>
      </main>
    );
  }

  register(event) {
    event.preventDefault();

    Ajax.submitForm(event.target, function(err, data) {
      console.dir(JSON.parse(data));
    });
  }
};
