import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import { checkAuth, mapStateToProps } from '../js/util';

import { login, logout } from '../actions';

class UserProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      checkedAuth: false
    };
  }

  componentDidMount() {
    checkAuth(
      this.props.login,
      this.props.logout,
      () => this.setState({ checkedAuth: true })
    );
  }

  render() {
    if (this.state.checkedAuth && !this.props.authed) {
      return (<Redirect to="/login" />);
    }

    return (
      <main className="container">
        <Link to={`/profile/polls`}>Polls</Link>
      </main>
    );
  }
}

export default connect(
  mapStateToProps,
  { login, logout }
)(UserProfile);
