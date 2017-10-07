import React, { Component } from 'react';

class BookList extends Component {
  constructor(props) {
    super(props);

    this.constructBookList = this.constructBookList.bind(this);
    this.getCorrectButton = this.getCorrectButton.bind(this);
  }

  constructBookList() {
    return this.props.books.map(book => {
      return (
        <li className="list__item col col-d-3">
          <img src={book.imageUrl} alt={book.title} />
          <h3>{book.title}</h3>
          {this.getCorrectButton(book)}
        </li>
      );
    });
  }

  getCorrectButton(book) {
    const button = {
      props: {},
      text: ''
    };

    switch (this.props.type) {
      case 'search':
        button.props.className = 'button button--default';
        button.props.onClick = () => this.props.onAddBook(book);
        button.icon = <i className="fa fa-plus" aria-hidden="true"></i>;
        button.text = 'Add Book';
        break;
      case 'user':
        button.props.className = 'button button--negative';
        button.props.onClick = this.props.onDeleteBook;
        button.icon = <i class="fa fa-trash" aria-hidden="true"></i>;
        button.text = 'Delete Book';
        break;
      case 'all':
        button.props.className = 'button button--default';
        button.props.onClick = this.props.onRequestTrade;
        button.icon = <i class="fa fa-exchange" aria-hidden="true"></i>;
        button.text = 'Request Trade';
        break;
    }

    return (
      <button { ...button.props }>{button.icon} {button.text}</button>
    );
  }

  render() {
    return (
      <ul className="list list--books grid center-text">
        {this.constructBookList()}
      </ul>
    );
  }
}

export default BookList;
