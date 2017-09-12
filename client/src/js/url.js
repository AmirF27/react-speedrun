const API_PATH = '/api';

export default class Url {
  constructor(url) {
    this.url = url;
    this.apiUrl = null;
  }

  formatForApi() {
    if (!this.apiUrl) {
      this.apiUrl = this.url.split('');
      this.apiUrl.splice(this.apiUrl.lastIndexOf('/'), 0, API_PATH);

      this.apiUrl = this.apiUrl.join('');
    }

    return this;
  }
}
