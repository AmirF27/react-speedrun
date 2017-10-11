import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import Ajax from '../js/ajax';
import { checkAuth, mapStateToProps } from '../js/util';
import { login, logout } from '../actions';

class RequireLogin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      checked: false
    };
  }

  componentDidMount() {
    checkAuth(
      this.props.login,
      this.props.logout,
      () => {
        this.setState({ checked: true });
        if (this.props.callback) return this.props.callback();
      }
    );
  }

  render() {
    if (this.state.checked && !this.props.authed) {
      return (
        <Redirect push to={{
            pathname: "/login",
            state: { referrer: window.location.pathname }
          }} />
      );
    }

    return null;
  }
}

export default connect(
  mapStateToProps,
  { login, logout }
)(RequireLogin);
