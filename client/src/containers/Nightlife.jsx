import React, { Component } from 'react';
import Ajax from '../js/ajax';

class Nightlife extends Component {
  constructor(props) {
    super(props);

    this.getBars = this.getBars.bind(this);

    this.state = {
      bars: null
    };
  }

  getBars(event) {
    event.preventDefault();
    event.persist();

    const url = event.target.getAttribute('action');
    const params = {
      location: event.target.elements['location'].value
    };

    Ajax.get(url, { params }).
      then(function fulfilled(bars) {
        this.setState({ bars });
      }.bind(this));
  }

  render() {
    let bars;

    if (this.state.bars) {
      bars = this.state.bars.map(bar => {
        return (
          <li>{bar.name}</li>
        );
      });
    }

    return (
      <main className="container">
        <form
          action="/api/nightlife/search" method="get"
          className="form form--inline" onSubmit={this.getBars}>
          <input type="text" name="location"
            id="location" className="form__input"
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

export default Nightlife;
