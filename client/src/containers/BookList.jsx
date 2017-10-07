import React, { Component } from 'react';

class BookList extends Component {
  render() {
    const bookList = this.props.books.map(book => {
      return (
        <li className="list__item">
          <img src={book.image_url} alt={book.title} />
          <h3>{book.title}</h3>
        </li>
      );
    });

    return (
      <ul className="list">
        {bookList}
      </ul>
    );
  }
}

export default BookList;
