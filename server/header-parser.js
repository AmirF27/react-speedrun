const useragent = require('express-useragent');

function HeaderParser(req) {
  this.req = req;
}

Object.assign(HeaderParser.prototype, {
  getIp() {
    return this.req.headers['x-forwarded-for']
        || this.req.connection.remoteAddress
        || this.req.socket.remoteAddress
        || this.req.connection.socket.remoteAdress;
  },

  getLanguage() {
    let lang = this.req.headers['accept-language'];

    return lang.slice(0, lang.indexOf(','));
  },

  getOS() {
    const ua = useragent.parse(this.req.headers['user-agent']);

    return ua.os;
  }
});

module.exports = HeaderParser;
