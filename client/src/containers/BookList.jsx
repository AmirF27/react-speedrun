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
          <img className="list--book__image" src={book.imageUrl} alt={book.title} />
          <h4>{book.title}</h4>
          {this.props.type == 'all' &&
            this.getUserInfo(book)
          }
          {this.getCorrectButton(book)}
        </li>
      );
    });
  }

  getUserInfo(book) {
    return [
      <span className="list--book__info">Owner: {book.owner.name}</span>,
      <span className="list--book__info">Location: {this.formatAddress(book.owner.address)}</span>
    ];
  }

  formatAddress(address) {
    if (!address) return 'N/A';

    return `${address.city}, ` +
           `${address.state ? `${address.state}, ` : ''}` +
           `${address.country}`;
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
        button.icon = <i className="fa fa-trash" aria-hidden="true"></i>;
        button.text = 'Delete Book';
        break;
      case 'all':
        button.props.className = 'button button--default';
        button.props.onClick = this.props.onRequestTrade;
        button.icon = <i className="fa fa-exchange" aria-hidden="true"></i>;
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
