import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import { checkAuth, mapStateToProps } from '../js/util';

import Title from './Title.jsx';
import Logout from './Logout.jsx';
import { login, logout } from '../actions';

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
        <nav className="nav container">
          <Title></Title>
          <ul className="navbar navbar--right">
            <li className="navbar__link"><Link to="/login">Login</Link></li>
            <li className="navbar__link"><Link to="/register">Register</Link></li>
          </ul>
        </nav>
      );
    }

    return (
      <nav className="nav container">
        <Title></Title>
        <ul className="navbar navbar--right">
          <li className="navbar__link"><Link to={`/profile/${this.props.user.email}`}>Profile</Link></li>
          <li className="navbar__link"><Logout onLogout={this.props.logout}></Logout></li>
        </ul>
      </nav>
    );
  }

  componentDidMount() {
    checkAuth(this.props.login, this.props.logout);
  }
}

export default connect(
  mapStateToProps,
  { login, logout }
)(Navbar);
