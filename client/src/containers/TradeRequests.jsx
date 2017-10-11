import React, { Component } from 'react';
import Ajax from '../js/ajax';
import { deleteItem } from '../js/util';

import RequireLogin from './RequireLogin.jsx';
import makeAlertable from './Alertable.jsx';
import User from '../js/user';

class TradeRequests extends Component {
  constructor(props) {
    super(props);

    this.getTradeRequests = this.getTradeRequests.bind(this);
    this.getRequestsByType = this.getRequestsByType.bind(this);
    this.deleteRequest = this.deleteRequest.bind(this);
    this.deleteRequestFromState = this.deleteRequestFromState.bind(this);
    this.approveRequest = this.approveRequest.bind(this);
    this.markApproved = this.markApproved.bind(this);
    this.setTradeRequests = this.setTradeRequests.bind(this);
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

  deleteRequest(requestId, type) {
    const body = { requestId };

    Ajax.delete('/api/profile/trade-requests', { body }).
      then(res => {
        if (res.type == 'error') return this.prop.alert(res);
        this.deleteRequestFromState(requestId, type);
        this.props.alert(res);
      }).
      catch(this.props.alert);
  }

  deleteRequestFromState(requestId, type) {
    const updatedRequests = deleteItem(
      this.state.tradeRequests[type],
      request => request.id == requestId
    );

    this.setTradeRequests(updatedRequests, type);
  }

  approveRequest(requestId) {
    const body = { requestId };

    Ajax.put('/api/profile/trade-requests', { body }).
      then(res => {
        if (res.type == 'error') return this.prop.alert(res);
        this.markApproved(requestId);
        this.props.alert(res);
      }).
      catch(console.error);
  }

  markApproved(requestId) {
    const updatedRequests = this.state.tradeRequests.received.slice();
    const requestIndex = updatedRequests.findIndex(request => request.id == requestId);

    updatedRequests[requestIndex].approved = true;

    this.setTradeRequests(updatedRequests, 'received');
  }

  setTradeRequests(requests, type) {
    this.setState({
      tradeRequests: {
        ...this.state.tradeRequests,
        [type]: requests
      }
    });
  }

  constructRequestList(type) {
    return this.state.tradeRequests[type].map(request => {
      const owner = new User(request.owner);
      const requester = new User(request.requester);

      return (
        <li className="list__item">
          <div className="grid">
            <div className="col col-d-2">
              <img src={request.book.imageUrl} alt={request.book.title}
                className="full-width" />
            </div>
            <div className="col col-d-7">
              <h4>{request.book.title}</h4>
              <span className="list--books__info">
                {type == 'made'
                  ? `To: ${owner.getName()}`
                  : `By: ${requester.getName()}`
                }
              </span>
              <span className="list--books__info">
                {type == 'made'
                  ? `Location: ${owner.formatAddress()}`
                  : `Location: ${requester.formatAddress()}`
                }
              </span>
            </div>
            <div className="col col-d-3">
              {request.approved
                ? <span className="list--books__info right">
                    <i className="fa fa-check" aria-hidden="true"></i> Approved
                  </span>
                : <span className="list--books__info right">
                    <i className="fa fa-clock-o" aria-hidden="true"></i> Pending
                  </span>
              }
              {type == 'made'
                ? <button className="button button--negative button--small button--block"
                    onClick={() => this.deleteRequest(request.id, 'made')}>
                    <i className="fa fa-ban" aria-hidden="true"></i> Cancel
                  </button>
                : [
                    <button className="button button--primary button--small button--block"
                      onClick={() => this.approveRequest(request.id)}>
                      <i className="fa fa-check" aria-hidden="true"></i> Approve
                    </button>,
                    <button className="button button--negative button--small button--block"
                      onClick={() => this.deleteRequest(request.id, 'received')}>
                      <i className="fa fa-times" aria-hidden="true"></i> Refuse
                    </button>
                  ]
              }
            </div>
          </div>
        </li>
      );
    });
  }

  render() {
    return (
      <main className="container">
        <RequireLogin callback={this.getTradeRequests} />
        {this.props.children}
        <div className="grid">
          <section className="col col-d-6">
            <h2>My Trade Requests</h2>
            <ul className="list list--books">
              {this.constructRequestList('made')}
            </ul>
          </section>
          <section className="col col-d-6">
            <h2>Trade Requests for Me</h2>
            <ul className="list list--books">
              {this.constructRequestList('received')}
            </ul>
          </section>
        </div>
      </main>
    );
  }
}

export default makeAlertable(TradeRequests);
