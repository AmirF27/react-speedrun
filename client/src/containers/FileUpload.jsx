import React, { Component } from 'react';
import Ajax from '../js/ajax';

export default class FileUpload extends Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render() {
    return (
      <section>
        <h2>File Metadata Microservice</h2>
        <p>
          Allows you to upload a file to the server and returns the file's size.
        </p>
        <form method='post' action='/api/file-upload' onSubmit={this.handleSubmit}>
          <input type='file' name='file' />
          <input type='submit' value='Upload' />
        </form>
      </section>
    );
  }

  handleSubmit(event) {
    event.preventDefault();

    const url = event.target.getAttribute('action');
    const options = {
      headers: [
        { 'Content-type': 'application/x-www-form-urlencoded' }
      ],
      form: new FormData(event.target)
    };

    Ajax.
      post(url, options).
      then(
        function fulfilled(response) {
          console.log(response);
        },
        function rejected(reason) {
          console.error('rejected');
        });
  }
};
