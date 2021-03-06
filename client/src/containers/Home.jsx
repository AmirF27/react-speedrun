import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Home extends Component {
  render() {
    return (
      <main className="container">
        <ul>
          <li><Link to="/timestamp">Timestamp Microservice</Link></li>
          <li><Link to="/header-parser">Header Parser Microservice</Link></li>
          <li><Link to="/file-upload">File Metadata Microservice</Link></li>
          <li><Link to="/voting-app">Voting App</Link></li>
          <li><Link to="/nightlife">Nightlife Coordination App</Link></li>
          <li><Link to="/stock-market">Stock Market Chart</Link></li>
          <li><Link to="/book-trading-club">Book Trading Club</Link></li>
        </ul>
      </main>
    );
  }
}

export default Home;
