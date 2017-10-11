export default class Ajax {
    static resolveUrl(url, params) {
        let paramsKeys = Object.keys(params);
        // check if params were provided
        if (paramsKeys.length > 0) {
            url += '?';
            // attach params to the url
            for (let param of paramsKeys) {
                url += `${param}=${params[param]}`;
                // add a "&" as long as it's not the last param
                if (param !== paramsKeys[paramsKeys.length - 1]) {
                    url += '&';
                }
            }
        }

        return url;
    }

    static setHeaders(xhr, headers) {
        let keys = Object.keys(headers);

        if (keys.length > 0) {
            for (let header of keys) {
                xhr.setRequestHeader(header, headers[header]);
            }
        }
    }

    static get(url, options = {}) {
        if (options.params) {
            url = this.resolveUrl(url, options.params);
        }

        return this.processRequest('GET', url, options);
    }

    static post(url, options = {}) {
      if (options.body) {
        // assign an empty object to headers if it's undefined
        options.headers = options.headers || {};
        options.headers['Content-Type'] = 'application/json';
      }

      return this.processRequest('POST', url, options);
    }

    static delete(url, options = {}) {
      // assign an empty object to headers if it's undefined
      options.headers = options.headers || {};
      options.headers['Content-Type'] = 'application/json';

      return this.processRequest('DELETE', url, options);
    }

    static put(url, options = {}) {
      // assign an empty object to headers if it's undefined
      options.headers = options.headers || {};
      options.headers['Content-Type'] = 'application/json';

      return this.processRequest('PUT', url, options);
    }

    static processRequest(method, url, options) {
      return new Promise(function(resolve, reject) {
          let xhr = new XMLHttpRequest();

          xhr.onreadystatechange = function() {
              if (xhr.readyState === XMLHttpRequest.DONE) {
                  if (xhr.status === 200) {
                      resolve(JSON.parse(xhr.responseText));
                  }
                  else {
                      reject(JSON.parse(xhr.responseText));
                  }
              }
          };

          xhr.open(method, url, true);
          if (options.headers) {
              this.setHeaders(xhr, options.headers);
          }
          xhr.send(JSON.stringify(options.body) || options.form || null);
      }.bind(this));
    }

    static submitForm(form, callback) {
      const method = form.getAttribute('method');
      const url = form.getAttribute('action');
      const options = {
        headers: [
          { 'Content-Type': 'application/x-www-form-urlencoded' }
        ],
        form: new FormData(form)
      };

      this.processRequest(method, url, options).
        then(
          function fulfilled(response) {
            callback(null, response);
          },
          function rejected(reason) {
            callback(reason);
          });
    }
};
