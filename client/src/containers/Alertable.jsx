import React, { Component } from 'react';
import { Link } from 'react-router-dom';

const makeAlertable = WrappedComponent => {
  return class Alertable extends Component {
    constructor(props) {
      super(props);

      this.getInitialState = this.getInitialState.bind(this);
      this.resetState = this.resetState.bind(this);
      this.alert = this.alert.bind(this);

      this.state = this.getInitialState();
    }

    getInitialState() {
      return {
        active: false,
        type: null,
        message: null,
        link: null
      };
    }

    resetState() {
      this.setState(this.getInitialState());
    }

    alert(options) {
      this.setState({ active: true, ...options });
    }

    render() {
      return (
        <WrappedComponent
          { ...this.props }
          alert={this.alert}>
          {this.state.active &&
            <div className={`alert alert--${this.state.type}`} role="alert">
              {this.state.message + ' '}
              {this.state.link &&
                <Link to={this.state.link.to}>{this.state.link.text}</Link>
              }
              <span className="alert__close" onClick={this.resetState}>
                <i className="fa fa-times" aria-hidden="true"></i>
                <span className="hidden">Close</span>
              </span>
            </div>
          }
        </WrappedComponent>
      );
    }
  };
};

export default makeAlertable;
