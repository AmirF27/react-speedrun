import React, { Component } from 'react';
import Ajax from '../js/ajax';

import makeAlertable from './Alertable.jsx';
import RequireLogin from './RequireLogin.jsx';
import BookList from './BookList.jsx';

class BookTrade extends Component {
  constructor(props) {
    super(props);

    this.submitTradeRequest = this.submitTradeRequest.bind(this);
  }

  submitTradeRequest(bookId) {
    const body = { bookId };

    Ajax.post('/api/book-trading-club/trade-request', { body }).
      then(this.props.alert).
      catch(this.props.alert);
  }

  render() {
    return (
      <main className="container">
        <RequireLogin />
        {this.props.children}
        <BookList type="all" onRequestTrade={this.submitTradeRequest} />
      </main>
    );
  }
}

export default makeAlertable(BookTrade);
