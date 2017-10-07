import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import RequireLogin from './RequireLogin.jsx';

class UserProfile extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <main className="container">
        <RequireLogin />
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
        </div>
      </main>
    );
  }
}

export default UserProfile;
