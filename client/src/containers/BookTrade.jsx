import React, { Component } from 'react';
import Ajax from '../js/ajax';

import makeAlertable from './Alertable.jsx';
import RequireLogin from './RequireLogin.jsx';
import BookList from './BookList.jsx';

class BookTrade extends Component {
  constructor(props) {
    super(props);

    this.state = {
      books: []
    };
  }

  render() {
    return (
      <main className="container">
        <RequireLogin />
        <BookList type="all" books={this.state.books} />
      </main>
    );
  }
}

export default makeAlertable(BookTrade);
