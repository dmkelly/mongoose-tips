var _ = require('underscore');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');

var UserModel;

function encryptPassword(password) {
  return crypto.createHash("sha1").update(password).digest("hex");
}

var User = new Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    match: /^[A-Za-z0-9_\-\.]{1,16}$/,
    unique: true
  },
  password: {
    type: String,
    required: true,
    set: encryptPassword
  },
  about: {
    type: String,
    set: _.escape
  }
});

User.set('toJSON', {
  transform: function(doc, ret, options) {
    delete ret.password;
    delete ret.__v;
    delete ret._id;
    return ret;
  }
});

User.pre('remove', function(callback) {
  mongoose.models.Comment.remove({
    author: this.id
  }, callback);
});

User.methods.checkPassword = function(password) {
  return encryptPassword(password) === this.password;
};

User.statics.findByName = function(name, callback) {
  UserModel.findOne({
    username: new RegExp('^' + name + '$', 'i')
  }, callback);
};

UserModel = mongoose.model('User', User);
module.exports.model = UserModel;
module.exports.schema = User;
