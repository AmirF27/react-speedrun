import React, { Component } from 'react';
import { Redirect } from 'react-router';
import Ajax from '../js/ajax';

class Logout extends Component {
  constructor() {
    super();

    this.logout = this.logout.bind(this);

    this.state = {
      loggedOut: false
    };
  }

  render() {
    return (
      <a href="/auth/logout" onClick={this.logout}>
        Logout
        {this.state.loggedOut &&
          <Redirect to="/" />
        }
      </a>
    );
  }

  logout(event) {
    event.preventDefault();

    Ajax.post(event.target.getAttribute('href')).
      then(
        function fulfilled(res) {
          this.setState({
            loggedOut: res.done
          });
          this.props.onLogout();
        }.bind(this),
        function rejected(err) {
          console.error(err);
        }
      );
  }
}

export default Logout;
