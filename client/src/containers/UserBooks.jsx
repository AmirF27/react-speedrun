import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import RequireLogin from './RequireLogin.jsx';

class UserBooks extends Component {
  render() {
    return (
      <main className="container">
        <RequireLogin />
        <Link to="/book-trading-club/search" className="button button--default">
          <i className="fa fa-plus" aria-hidden="true"></i> Add a New Book
        </Link>
      </main>
    );
  }
}

export default UserBooks;
