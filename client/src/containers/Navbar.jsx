import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Ajax from '../js/ajax';
import { checkAuth, mapStateToProps } from '../js/util';

import {
  authenticate,
  unauthenticate
} from '../actions';

class Navbar extends Component {
  render() {
    if (!this.props.authed) {
      return (
        <nav>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </nav>
      );
    }

    return (
      <nav>
        <Link to={`/profile/${this.props.user.email}`}>Profile</Link>
        <Link to="/logout">Logout</Link>
      </nav>
    );
  }

  componentDidMount() {
    checkAuth(this.props.authenticate, this.props.unauthenticate);
  }
}

export default connect(
  mapStateToProps,
  {
    authenticate,
    unauthenticate
  }
)(Navbar);
