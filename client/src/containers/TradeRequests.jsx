import React, { Component } from 'react';
import Ajax from '../js/ajax';

import RequireLogin from './RequireLogin.jsx';
import makeAlertable from './Alertable.jsx';

class TradeRequests extends Component {
  constructor(props) {
    super(props);

    this.getTradeRequests = this.getTradeRequests.bind(this);
    this.getRequestsByType = this.getRequestsByType.bind(this);
    this.constructRequestList = this.constructRequestList.bind(this);

    this.state = {
      tradeRequests: {
        made: [],
        received: []
      }
    };
  }

  getTradeRequests() {
    Promise.all([
      this.getRequestsByType('made'),
      this.getRequestsByType('received')
    ]).
    then(tradeRequests => {
      const [made, received] = tradeRequests;
      this.setState({ tradeRequests: { made, received } });
    }).
    catch(console.error);
  }

  getRequestsByType(type) {
    return new Promise((resolve, reject) => {
      Ajax.get('/api/profile/trade-requests', { params: { type } }).
        then(resolve).
        catch(reject);
    });
  }

  constructRequestList(type) {
    return this.state.tradeRequests[type].map(request => {
      return (
        <li className="list__item">
          <div className="grid">
            <div className="col col-d-2">
              <img src={request.book.imageUrl} alt={request.book.title}
                className="full-width" />
            </div>
            <div className="col col-d-10">
              <h4>{request.book.title}</h4>
              <p>
                {type == 'made'
                  ? `To: ${this.getUser(request.owner)}`
                  : `By: ${this.getUser(request.requester)}`
                }
              </p>
            </div>
          </div>
        </li>
      );
    });
  }

  getUser(user) {
    return user.local
      ? user.local.name || user.local.email
      : user.twitter.displayName;
  }

  render() {
    return (
      <main className="container">
        <RequireLogin callback={this.getTradeRequests} />
        {this.props.children}
        <div className="grid">
          <section className="col col-d-6">
            <h2>My Trade Requests</h2>
            <ul className="list">
              {this.constructRequestList('made')}
            </ul>
          </section>
          <section className="col col-d-6">
            <h2>Trade Requests for Me</h2>
            <ul className="list">
              {this.constructRequestList('received')}
            </ul>
          </section>
        </div>
      </main>
    );
  }
}

export default makeAlertable(TradeRequests);
