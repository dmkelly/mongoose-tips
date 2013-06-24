var _ = require('underscore');
var moment = require('moment');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentModel;

var Comment = new Schema({
  author: {
    type: Schema.ObjectId,
    required: true,
    ref: 'User'
  },
  entity: {
    type: Schema.ObjectId,
    required: true,
    ref: 'User'
  },
  text: {
    type: String,
    required: true,
    set: _.escape
  }
});

Comment.set('toJSON', {
  transform: function(doc, ret, options) {
    delete ret.__v;
    return ret;
  }
});

Comment.virtual('time').get(function() {
  return moment(this._id.getTimestamp()).fromNow();
});

Comment.methods.isAuthored = function(userId) {
  var authorId = _.isUndefined(this.author.username) ? this.author : this.author.id;
  return userId.toString() === authorId.toString();
};

Comment.methods.isOwned = function(userId) {
  var entityId = _.isUndefined(this.entity.username) ? this.entity : this.entity.id;
  return this.isAuthored(userId) || userId.toString() === entityId.toString();
};

Comment.statics.findByAuthorId = function(authorId, callback) {
  var query = CommentModel.find({
    author: authorId
  }).populate('entity');

  if (!callback) {
    return query;
  }
  query.exec(callback);
};

Comment.statics.findByEntityId = function(entityId, callback) {
  var query = CommentModel.find({
    entity: entityId
  }).populate('author', 'username about');

  if (!callback) {
    return query;
  }
  query.exec(callback);
};

CommentModel = mongoose.model('Comment', Comment);
module.exports.model = CommentModel;
module.exports.schema = Comment;
