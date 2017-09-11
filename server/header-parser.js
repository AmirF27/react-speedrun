const useragent = require('express-useragent');

function HeaderParser(req) {
  this.req = req;
}

HeaderParser.prototype.getIp = function() {
  return this.req.headers['x-forwarded-for']
      || this.req.connection.remoteAddress
      || this.req.socket.remoteAddress
      || this.req.connection.socket.remoteAdress;
};

HeaderParser.prototype.getLanguage = function() {
  let lang = this.req.headers['accept-language'];

  return lang.slice(0, lang.indexOf(','));
};

HeaderParser.prototype.getOS = function() {
  const ua = useragent.parse(this.req.headers['user-agent']);

  return ua.os;
};

module.exports = HeaderParser;
