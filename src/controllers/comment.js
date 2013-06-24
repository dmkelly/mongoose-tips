var _ = require('underscore');
var mongoose = require('mongoose');
var models = require('../models');

function create(req, res) {
  var comment = new models.Comment({
    author: req.session.user._id,
    entity: res.locals.user.id,
    text: req.body.text
  });
  comment.save(function(err) {
    if (err) {
      // Check if the error is due to a conflict.
      if (err instanceof mongoose.Error.ValidationError) {
        return res.badRequest('Requires comment text');
      }
      return res.error(err);
    }
    res.redirect('/users/' + req.params.user + '/comments/' + comment.id);
  });
}

function sent(req, res) {
  models.Comment.findByAuthorId(res.locals.user.id).sort('_id').exec(function(err, comments) {
    if (err) {
      return res.error(err);
    }
    res.locals.comments = comments;
    if (req.params.ext === 'json') {
      return res.json(comments);
    }
    res.render('userComments');
  });
}

function show(req, res) {
  res.locals.comment.populate('entity', function(err, comment) {
    if (err) {
      return res.error(err);
    }
    res.locals.comment = comment;
    if (req.params.ext === 'json') {
      return res.json(comment);
    }
    res.render('comment');
  });
}

function edit(req, res) {
  var comment = res.locals.comment;
  comment = _.extend(comment, req.body);
  comment.save(function(err) {
    if (err) {
      return res.error(err);
    }
    res.redirect('/users/' + req.params.user);
  });
}

function remove(req, res) {
  res.locals.comment.remove(function(err) {
    if (err) {
      return res.error(err);
    }
    res.redirect('/users/' + req.params.user);
  });
}

module.exports.create = create;
module.exports.sent = sent;
module.exports.show = show;
module.exports.edit = edit;
module.exports.remove = remove;
