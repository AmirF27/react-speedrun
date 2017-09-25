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
      return this.processRequest('POST', url, options);
    }

    static delete(url, options = {}) {
      return this.processRequest('DELETE', url, options);
    }

    static processRequest(type, url, options) {
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

          xhr.open(type, url, true);
          if (options.headers) {
              this.setHeaders(xhr, options.headers);
          }
          xhr.send(options.form || null);
      }.bind(this));
    }

    static submitForm(form, cb) {
      const url = form.getAttribute('action');
      const options = {
        headers: [
          { 'Content-type': 'application/x-www-form-urlencoded' }
        ],
        form: new FormData(form)
      };

      this.
        post(url, options).
        then(
          function fulfilled(response) {
            cb(null, response);
          },
          function rejected(reason) {
            cb(reason);
          });
    }
};
