import React, { Component } from 'react';
import Ajax from '../js/ajax';

class FileUpload extends Component {
  constructor() {
    super();

    this.uploadFile = this.uploadFile.bind(this);

    this.state = {
      uploaded: false,
      size: 0,
      error: null
    };
  }

  render() {
    return (
      <main className="container">
        <h2>File Metadata Microservice</h2>
        <p>
          Allows you to upload a file to the server and returns the file's size.
        </p>
        <form method="post" action="/api/file-upload" onSubmit={this.uploadFile}>
          <input type="file" name="file" />
          <input type="submit" value="Upload" className="button button--primary" />
        </form>
        {this.state.uploaded &&
          <div>
            <p>File uploaded successfully!</p>
            <p>Size: {this.state.size} bytes</p>
          </div>
        }
        {this.state.error &&
          <div>
            <p>{this.state.error}</p>
          </div>
        }
      </main>
    );
  }

  uploadFile(event) {
    event.preventDefault();

    Ajax.submitForm(event.target, (err, data) => {
      if (!err) {
        this.setState({
          uploaded: true,
          size: data.size,
          error: null
        });
      } else {
        this.setState({
          uploaded: false,
          size: 0,
          error: 'An error occured while uploading the file.'
        });
      }
    });
  }
}

export default FileUpload;
