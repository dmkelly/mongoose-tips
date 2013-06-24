var mongoose = require('mongoose');

function connect(url, callback) {
  mongoose.connect(url, callback);
}

function disconnect(callback) {
  mongoose.connection.close(callback);
}

module.exports = {
  connect: connect,
  disconnect: disconnect
};
