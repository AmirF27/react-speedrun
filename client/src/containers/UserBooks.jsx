import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Ajax from '../js/ajax';

import makeAlertable from './Alertable.jsx';
import RequireLogin from './RequireLogin.jsx';
import BookList from './BookList.jsx';

class UserBooks extends Component {
  render() {
    return (
      <main className="container">
        <RequireLogin />
        <Link to="/book-trading-club/search" className="button button--primary">
          Add a New Book
        </Link>
        {this.props.children}
        <BookList type="user" />
      </main>
    );
  }
}

export default makeAlertable(UserBooks);
