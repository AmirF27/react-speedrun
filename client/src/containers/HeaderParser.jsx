import React, { Component } from 'react';
import Url from '../js/url'

class HeaderParser extends Component {
  render() {
    const url = new Url(window.location.href);

    url.formatForApi();

    return (
      <section>
        <h2>Request Header Parser Microservice</h2>
        <p>
          Returns information about the client, a JSON object containing the IP
          address, lanuage, and operating system of the client.
        </p>
        <h3>Usage</h3>
        <p><code>{url.apiUrl}</code></p>
        <p>Example output:</p>
        <p><code>&#123;"ip":"127.0.0.1","language":"en-US","os":"Linux 64"&#125;</code></p>
      </section>
    );
  }
}

export default HeaderParser;
