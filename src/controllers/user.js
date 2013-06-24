var _ = require('underscore');
var mongoose = require('mongoose');
var models = require('../models');

function completeLogin(req, res, user) {
  req.session.user = user;
  res.redirect('/users/' + req.body.username);
}

function showSignup(req, res) {
  res.render('signup');
}

function signup(req, res) {
  if (req.body.password !== req.body.confirm) {
    return res.badRequest('Passwords must match');
  }
  var user = new models.User(req.body);
  user.save(function(err) {
    if (err) {
      // Check if the error is due to a conflict.
      if (err instanceof mongoose.Error.ValidationError) {
        return res.badRequest('Bad username or password');
      }
      // A duplicate key error is just a MongoError so we need to check the
      // code to differentiate conflictes from any other database error.
      if (err.code === 11000) {
        return res.conflict('A user with that name already exists');
      }
      return res.error(err);
    }
    completeLogin(req, res, user);
  });
}

function showLogin(req, res) {
  res.render('login');
}

function login(req, res) {
  models.User.findByName(req.body.username, function(err, user) {
    if (err) {
      return res.error(err);
    }
    if (!user || !user.checkPassword(req.body.password)) {
      return res.unauthorized('Bad username or password');
    }
    completeLogin(req, res, user);
  });
}

function logout(req, res) {
  req.session.destroy();
  res.redirect('/');
}

function show(req, res) {
  models.Comment.findByEntityId(res.locals.user.id).sort('-_id').exec(function(err, comments) {
    if (err) {
      return res.error(err);
    }
    res.locals.comments = comments;
    if (req.params.ext === 'json') {
      // Note that populate doesn't respect the custom toJSON on the user schema
      return res.json({
        user: res.locals.user,
        comments: res.locals.comments
      });
    }
    res.render('profile');
  });
}

function edit(req, res) {
  var user = res.locals.user;
  user = _.extend(user, req.body);
  user.save(function(err) {
    if (err) {
      return res.error(err);
    }
    res.redirect('/users/' + req.params.user);
  });
}

function list(req, res) {
  models.User.find({}, function(err, users) {
    if (err) {
      return res.error(err);
    }
    res.locals.users = users;
    res.render('home');
  });
}

module.exports.showSignup = showSignup;
module.exports.signup = signup;
module.exports.showLogin = showLogin;
module.exports.login = login;
module.exports.logout = logout;
module.exports.show = show;
module.exports.edit = edit;
module.exports.list = list;
