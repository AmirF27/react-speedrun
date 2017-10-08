import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Ajax from '../js/ajax';
import { mapStateToProps } from '../js/util';

import RequireLogin from './RequireLogin.jsx';
import makeAlertable from './Alertable.jsx';

class UserProfile extends Component {
  constructor(props) {
    super(props);

    this.updateAddress = this.updateAddress.bind(this);
  }

  updateAddress(event) {
    event.preventDefault();

    Ajax.submitForm(event.target, (err, data) => {
      this.props.alert(err || data);
    });
  }

  render() {
    return (
      <main className="container">
        <RequireLogin />
        {this.props.children}
        {this.props.authed &&
          <div className="grid">
            <section className="col col-d-6">
              <h2>My Stuff</h2>
              <ul className="list">
                <li className="list__item list__item--link">
                  <Link to="/profile/polls">Polls</Link>
                </li>
                <li className="list__item list__item--link">
                  <Link to="/profile/books">Books</Link>
                </li>
              </ul>
            </section>
            <section className="col col-d-6">
              <h2>Account Settings</h2>
              <h3>Address</h3>
              <form action="/api/profile/address" method="put" className="form"
                onSubmit={this.updateAddress}>
                <label htmlFor="city">City</label>
                <input id="city" type="text" name="address[city]"
                  className="form__input" defaultValue={this.props.user.address.city}
                />
                <label htmlFor="state">State</label>
                <input id="state" type="text" name="address[state]"
                  className="form__input" defaultValue={this.props.user.address.state}
                />
                <label htmlFor="country">Country</label>
                <input id="country" type="text" name="address[country]"
                  className="form__input" defaultValue={this.props.user.address.country}
                />
                <input className="button button--default" type="submit"
                  value="Update Address"
                />
              </form>
            </section>
          </div>
        }
      </main>
    );
  }
}

export default connect(mapStateToProps)(makeAlertable(UserProfile));
