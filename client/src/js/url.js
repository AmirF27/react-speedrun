const API_PATH = '/api';

export class Url {
  constructor(url) {
    this.url = url;
  }

  formatForApi() {
    this.url = this.url.split('');
    this.url.splice(this.url.lastIndexOf('/'), 0, API_PATH);

    this.url = this.url.join('');
  }
}
