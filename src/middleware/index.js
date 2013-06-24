var response = require('./response');
var models = require('../models');

function attachResponseHandlers(req, res, next) {
  response.attachHandlers(req, res);
  next();
}

function attachSessionUser(req, res, next) {
  res.locals.session = req.session.user;
  next();
}

function attachUser(req, res, next) {
  models.User.findByName(req.params.user, function(err, user) {
    if (err) {
      return res.error(err);
    }
    if (!user) {
      return res.notFound();
    }
    res.locals.user = user;
    next();
  });
}

function attachComment(req, res, next) {
  models.Comment.findById(req.params.comment, function(err, comment) {
    if (err) {
      return res.error(err);
    }
    if (!comment) {
      return res.notFound();
    }
    res.locals.comment = comment;
    next();
  });
}

function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
}

function requireNoAuth(req, res, next) {
  if (req.session.user) {
    return res.redirect('/');
  }
  next();
}

function requireUser(req, res, next) {
  if (!req.session.user) {
    return res.forbidden();
  }
  attachUser(req, res, function() {
    if (req.session.user._id.toString() !== res.locals.user.id.toString()) {
      return res.forbidden();
    }
    next();
  });
}

function requireCommentAuthor(req, res, next) {
  if (!req.session.user) {
    return res.forbidden();
  }
  attachComment(req, res, function() {
    if (!res.locals.comment.isAuthored(req.session.user._id)) {
      return res.forbidden();
    }
    next();
  });
}

function requireCommentOwner(req, res, next) {
  if (!req.session.user) {
    return res.forbidden();
  }
  attachComment(req, res, function() {
    if (!res.locals.comment.isOwned(req.session.user._id)) {
      return res.forbidden();
    }
    next();
  });
}

module.exports.attachResponseHandlers = attachResponseHandlers;
module.exports.attachSessionUser = attachSessionUser;
module.exports.attachUser = attachUser;
module.exports.attachComment = attachComment;
module.exports.requireAuth = requireAuth;
module.exports.requireNoAuth = requireNoAuth;
module.exports.requireUser = requireUser;
module.exports.requireCommentAuthor = requireCommentAuthor;
module.exports.requireCommentOwner = requireCommentOwner;
