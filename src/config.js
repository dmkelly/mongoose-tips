var env = process.env.NODE_ENV || 'development';
var _ = require('underscore');

var general = {
  locals: {
    TITLE: 'Mongoose Tips'
  }
};

var envs = {
  development: {
    server: {
      PORT: 3000
    },
    mongo: {
      URL: 'mongodb://localhost:27017/mongoose-tips'
    }
  }
};

module.exports = _.extend({}, general, envs[env], process.env);
