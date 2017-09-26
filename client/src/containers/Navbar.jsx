import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import { checkAuth, mapStateToProps } from '../js/util';

import Logout from './Logout.jsx';

import {
  login,
  logout
} from '../actions';

class Navbar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedOut: false
    };
  }

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
        <Logout onLogout={this.props.logout}></Logout>
      </nav>
    );
  }

  componentDidMount() {
    checkAuth(this.props.login, this.props.logout);
  }
}

export default connect(
  mapStateToProps,
  {
    login,
    logout
  }
)(Navbar);
