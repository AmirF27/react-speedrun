const Server = require('socket.io');

module.exports = function(server, wagner) {
  const io = new Server(server);

  wagner.factory('socket', function() {
    return io;
  });
};
