import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Navbar from './Navbar.jsx';

export default class Header extends Component {
  render() {
    return (
      <header>
        <Link to="/"><h1>React Speedrun</h1></Link>
        <Navbar></Navbar>
      </header>
    );
  }
};
