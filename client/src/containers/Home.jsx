import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Home extends Component {
  render() {
    return (
      <aside>
        <ul>
          <li><Link to="/timestamp">Timestamp Microservice</Link></li>
          <li><Link to="/header-parser">Header Parser Microservice</Link></li>
          <li><Link to="/file-upload">File Metadata Microservice</Link></li>
          <li><Link to="/voting-app">Voting App</Link></li>
        </ul>
      </aside>
    );
  }
}

export default Home;
