import React, { Component } from 'react';
import Ajax from '../js/ajax';

import RequireLogin from './RequireLogin.jsx';
import BookList from './BookList.jsx';

class BookSearch extends Component {
  constructor(props) {
    super(props);

    this.search = this.search.bind(this);

    this.state = {
      books: []
    };
  }

  search(event) {
    event.preventDefault();

    const params = {
      title: event.target.elements['title'].value
    };

    Ajax.get('/api/book-trading-club/search', { params }).
      then(books => this.setState({ books })).
      catch(err => console.error(err));
  }

  render() {
    return (
      <main className="container">
        <RequireLogin />
        <form action="/api/book-trading-club/search" method="get"
          className="form form--inline" onSubmit={this.search}>
          <input type="text" name="title" className="form__input"
            placeholder="Book title..." required />
          <button type="submit" className="button button--primary">
            <i className="fa fa-search" aria-hidden="true"></i>
          </button>
        </form>
        <BookList books={this.state.books} />
      </main>
    );
  }
}

export default BookSearch;
