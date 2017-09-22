import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Ajax from '../js/ajax';

export default class Navbar extends Component {
  constructor() {
    super();

    this.checkAuth = this.checkAuth.bind(this);

    this.state = {
      user: null
    };
  }

  render() {
    if (!this.state.user) {
      return (
        <nav>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </nav>
      );
    }

    return (
      <nav>
        <Link to={`/profile/${this.state.user.email}`}>Profile</Link>
        <Link to="/logout">Logout</Link>
      </nav>
    );
  }

  componentDidMount() {
    this.checkAuth();
  }

  checkAuth() {
    Ajax.
      get('/api/user').
      then(
        function fulfilled(response) {
          this.setState({
            user: JSON.parse(response).user
          });
        }.bind(this),
        function rejected(reason) {
          console.error(reason);
        }
      );
  }
};
