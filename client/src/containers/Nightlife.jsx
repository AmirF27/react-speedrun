import React, { Component } from 'react';
import { connect } from 'react-redux';
import Ajax from '../js/ajax';
import { checkAuth, mapStateToProps } from '../js/util';

import { login, logout } from '../actions';

class Nightlife extends Component {
  constructor(props) {
    super(props);

    this.getBars = this.getBars.bind(this);
    this.addBar = this.addBar.bind(this);
    this.recallLastSearch = this.recallLastSearch.bind(this);

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

  addBar(event) {
    event.preventDefault();
    event.persist();

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
          Ajax.post(event.target.getAttribute('href')).
            then(function fulfilled(res) {}).
            catch(function rejected(err) {});
        }
      }
    );
  }

  recallLastSearch() {
    const lastSearch = sessionStorage.getItem('lastSearch');

    if (lastSearch) {
      this.refs.location.value = lastSearch;
      sessionStorage.removeItem('lastSearch');
      this.getBars();
    }
  }

  componentDidMount() {
    this.recallLastSearch();
  }

  render() {
    let bars;

    if (this.state.bars) {
      bars = this.state.bars.map(bar => {
        return (
          <li>
            {bar.name}
            <a href={`/api/nightlife/add-bar/${bar.id}`}
              onClick={this.addBar}>I'm Going Tonight
            </a>
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
  { login, logout }
)(Nightlife);
