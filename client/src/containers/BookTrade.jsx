import React, { Component } from 'react';
import Ajax from '../js/ajax';

import makeAlertable from './Alertable.jsx';
import RequireLogin from './RequireLogin.jsx';
import BookList from './BookList.jsx';

class BookTrade extends Component {
  render() {
    return (
      <main className="container">
        <RequireLogin />
        {this.props.children}
        <BookList type="all" />
      </main>
    );
  }
}

export default makeAlertable(BookTrade);
