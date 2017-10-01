import React, { Component } from 'react';
import { connect } from 'react-redux';
import Ajax from '../js/ajax';
import { checkAuth, mapStateToProps } from '../js/util';

import {
  login,
  logout,
  addBar,
  removeBar
} from '../actions';

class Nightlife extends Component {
  constructor(props) {
    super(props);

    this.getBars = this.getBars.bind(this);
    this.addBar = this.addBar.bind(this);
    this.removeBar = this.removeBar.bind(this);
    this.recallLastSearch = this.recallLastSearch.bind(this);
    this.userIsAttengdingBar = this.userIsAttengdingBar.bind(this);

    this.state = {
      bars: null
    };
  }

  getBars(event) {
    const url = this.refs.searchForm.getAttribute('action');
    const params = {
      location: this.refs.location.value
    };

    if (event) event.preventDefault();

    Ajax.get(url, { params }).
      then(function fulfilled(bars) {
        this.setState({ bars });
      }.bind(this));
  }

  addBar(id) {
    checkAuth(
      this.props.login,
      this.props.logout,
      () => {
        if (!this.props.user || !this.props.user.twitter) {
          // save the user's last search term in session storage
          const lastSearch = this.refs.location.value;
          sessionStorage.setItem('lastSearch', lastSearch);
          // redirect to Twitter auth API endpoint
          window.location.pathname = '/auth/twitter';
        } else {
          Ajax.post(`/api/nightlife/add-bar/${id}`).
            then(function fulfilled(res) {
              const barIndex = this.state.bars.findIndex(bar => bar.id == id);
              const bars = this.state.bars.slice();
              bars[barIndex].userAttending = true;
              this.setState({ bars });
            }.bind(this)).
            catch(function rejected(err) {});
        }
      }
    );
  }

  removeBar(id) {
    Ajax.delete(`/api/nightlife/remove-bar/${id}`).
      then(function fulfilled(res) {
        const barIndex = this.state.bars.findIndex(bar => bar.id == id);
        const bars = this.state.bars.slice();
        delete bars[barIndex].userAttending;
        this.setState({ bars });
      }.bind(this)).
      catch(function rejected(err) {
        console.error(err);
      });
  }

  recallLastSearch() {
    const lastSearch = sessionStorage.getItem('lastSearch');

    if (lastSearch) {
      this.refs.location.value = lastSearch;
      sessionStorage.removeItem('lastSearch');
      this.getBars();
    }
  }

  userIsAttengdingBar(barId) {
    if (!this.props.user) {
      return false;
    }

    return this.props.user.bars.findIndex(bar => bar.barId == barId) >= 0;
  }

  componentDidMount() {
    checkAuth(this.props.login, this.props.logout);
    this.recallLastSearch();
  }

  render() {
    let bars;

    if (this.state.bars) {
      bars = this.state.bars.map(bar => {
        return (
          <li className="grid">
            <div className="col col-d-3">
              <a href={bar.url}>
                <img src={bar.image_url} alt={bar.name} className="full-width" />
                <span>{bar.name}</span>
              </a>
            </div>
            <div className="col col-d-3">
              <span>{bar.attendees} people going</span>
            </div>
            <div className="col col-d-6">
              {bar.userAttending
                ? <button onClick={() => this.removeBar(bar.id)}
                    className="button button--negative button--small">
                    Cancel
                  </button>
                : <button onClick={() => this.addBar(bar.id)}
                    className="button button--default button--small">
                    I'm Going Tonight
                  </button>
              }
            </div>
          </li>
        );
      });
    }

    return (
      <main className="container">
        <form ref="searchForm"
          action="/api/nightlife/search" method="get"
          className="form form--inline" onSubmit={this.getBars}>
          <input type="text" name="location"
            ref="location" className="form__input"
            placeholder="Enter location..." required />
          <input type="submit" value="Search" className="button button--primary" />
        </form>
        {this.state.bars &&
          <ul>
            {bars}
          </ul>
        }
      </main>
    );
  }
}

export default connect(
  mapStateToProps,
  {
    login,
    logout,
    addBar,
    removeBar
  }
)(Nightlife);
