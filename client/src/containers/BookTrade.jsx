import React, { Component } from 'react';
import Ajax from '../js/ajax';

import makeAlertable from './Alertable.jsx';
import RequireLogin from './RequireLogin.jsx';
import BookList from './BookList.jsx';

class BookTrade extends Component {
  constructor(props) {
    super(props);

    this.getBooks = this.getBooks.bind(this);

    this.state = {
      books: []
    };
  }

  getBooks() {
    Ajax.get('/api/book-trading-club').
      then(books => this.setState({ books })).
      catch(console.error);
  }

  componentDidMount() {
    this.getBooks();
  }

  render() {
    return (
      <main className="container">
        <RequireLogin />
        {this.props.children}
        <BookList type="all" books={this.state.books} />
      </main>
    );
  }
}

export default makeAlertable(BookTrade);
