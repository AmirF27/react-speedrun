import React, { Component } from 'react';
import Ajax from '../js/ajax';

import makeAlertable from './Alertable.jsx';
import RequireLogin from './RequireLogin.jsx';
import BookList from './BookList.jsx';

class BookSearch extends Component {
  constructor(props) {
    super(props);

    this.search = this.search.bind(this);
    this.addBook = this.addBook.bind(this);

    this.state = {
      books: []
    };
  }

  search(event) {
    event.preventDefault();
    
    this.refs.bookList.getBooks(event.target.elements['title'].value);
  }

  addBook(book) {
    const body = {
      title: book.title,
      imageUrl: book.imageUrl
    };

    Ajax.post('/api/book-trading-club/add-book', { body }).
      then(this.props.alert).
      catch(this.props.alert);
  }

  render() {
    return (
      <main className="container">
        <RequireLogin />
        {this.props.children}
        <form action="/api/book-trading-club/search" method="get"
          className="form form--inline" onSubmit={this.search}>
          <input type="text" name="title" className="form__input"
            placeholder="Book title..." required />
          <button type="submit" className="button button--primary">
            <i className="fa fa-search" aria-hidden="true"></i>
          </button>
        </form>
        <BookList type="search" onAddBook={this.addBook} ref="bookList" />
      </main>
    );
  }
}

export default makeAlertable(BookSearch);
