import React, { Component } from 'react';
import Url from '../js/url';

export default class Timestamp extends Component {
  render() {
    const url = new Url(window.location.href);

    url.formatForApi();

    return (
      <section>
        <h2>Timestamp Microservice</h2>
        <p>
          This microservice converts between Unix timestamps and natural language
          dates.
        </p>
        <h3>Usage</h3>
        <p>
          <code>{url.apiUrl}/&lt;natural date or Unix timestamp&gt;</code>
        </p>
        <h3>Examples</h3>
        <ol>
          <li>Natural language date (multiple formats work):
            <p><code>{url.apiUrl}/December 27, 1991</code></p>
            <p>or</p>
            <p><code>{url.apiUrl}/27 Dec 91</code></p>
            <p>Output: <code>&#123;"unix":693784800,"natural":"December 27, 1991"&#125;</code></p>
          </li>
          <li>Unix timestamp:
            <p><code>{url.apiUrl}/1505077200</code></p>
            <p>Output: <code>&#123;"unix":1505077200,"natural":"September 11, 2017"&#125;</code></p>
          </li>
          <li>Any other value:
            <p><code>{url.apiUrl}/x</code></p>
            <p>Output: <code>&#123;"unix":null,"natural":null&#125;</code></p>
          </li>
        </ol>
      </section>
    );
  }
};
