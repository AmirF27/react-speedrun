import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import Ajax from '../js/ajax';
import { mapStateToProps } from '../js/util';

import makeAlertable from './Alertable.jsx';
import { login } from '../actions';

const makeAuthable = WrappedComponent => {
  class Authable extends Component {
    constructor(props) {
      super(props);

      this.authenticate = this.authenticate.bind(this);
    }

    authenticate(event) {
      event.preventDefault();

      Ajax.submitForm(event.target, (err, data) => {
        if (data.error) {
          this.props.alert({
            type: 'error',
            message: data.error
          });
        } else {
          Ajax.get('/api/user').
            then(res => this.props.login(res.user)).
            catch(console.error);
        }
      });
    }

    render() {
      if (this.props.authed) {
        return (<Redirect to='/' />);
      }

      return (
        <WrappedComponent
        { ...this.props }
        authenticate={this.authenticate} />
      );
    }
  }

  Authable = makeAlertable(Authable);

  return connect(
    mapStateToProps,
    { login },
  )(Authable);
};

export default makeAuthable;
