var ctrl = require('./controllers');
var mid = require('./middleware');

function router(app) {
  app.get('/', ctrl.user.list);
  app.get('/signup', mid.requireNoAuth, ctrl.user.showSignup);
  app.post('/signup', mid.requireNoAuth, ctrl.user.signup);
  app.get('/login', mid.requireNoAuth, ctrl.user.showLogin);
  app.post('/login', mid.requireNoAuth, ctrl.user.login);
  app.get('/logout', ctrl.user.logout);
  app.get('/users/:user', mid.attachUser, ctrl.user.show);
  app.post('/users/:user', mid.requireUser, ctrl.user.edit);
  app.get('/users/:user/comments', mid.attachUser, ctrl.comment.sent);
  app.post('/users/:user/comments', mid.requireAuth, mid.attachUser, ctrl.comment.create);
  app.get('/users/:user/comments/:comment', mid.attachUser, mid.attachComment, ctrl.comment.show);
  app.post('/users/:user/comments/:comment', mid.requireCommentAuthor, ctrl.comment.edit);
  app.post('/users/:user/comments/:comment/delete', mid.requireCommentOwner, ctrl.comment.remove);

  // Prepend an extension for a different representation. Only 'json' is supported.
  app.get('/:ext/users/:user', mid.attachUser, ctrl.user.show);
  app.get('/:ext/users/:user/comments', mid.attachUser, ctrl.comment.sent);
  app.get('/:ext/users/:user/comments/:comment', mid.attachUser, mid.attachComment, ctrl.comment.show);
}

module.exports = router;
