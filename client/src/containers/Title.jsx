import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Title extends Component {
  render() {
    return (
      <div className="navbar">
        <h1 className="navbar__logo"><Link to="/">React Speedrun</Link></h1>
      </div>
    );
  }
}

export default Title;
