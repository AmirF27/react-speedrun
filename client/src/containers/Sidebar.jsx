import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Sidebar extends Component {
  render() {
    return (
      <aside>
        <ul>
          <li><Link to="/timestamp">Timestamp Microservice</Link></li>
          <li><Link to="/header-parser">Header Parser Microservice</Link></li>
          <li><Link to="/file-upload">File Metadata Microservice</Link></li>
        </ul>
      </aside>
    );
  }
};
