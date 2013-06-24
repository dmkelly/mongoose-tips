function attachHandlers(req, res) {
  function respond(message, code, details) {
    message = message || '-';
    code = code || 200;

    var data = {
      message: message,
      code: code,
      details: details
    };

    if (req.xhr) {
      return res.json(code, data);
    }
    res.status(code).render('response', data);
  }

  res.success = function(message) {
    respond(message || 'success', 200);
  };

  res.created = function(message) {
    respond(message || 'created', 201);
  };

  res.badRequest = function(message) {
    respond(message || 'bad request', 400);
  };

  res.unauthorized = function(message) {
    respond(message || 'unauthorized', 401);
  };

  res.forbidden = function(message) {
    respond(message || 'forbidden', 403);
  };

  res.notFound = function(message) {
    respond(message || 'not found', 404);
  };

  res.conflict = function(message) {
    respond(message || 'conflict', 409);
  };

  res.rateLimit = function(message) {
    respond(message || 'rate limit exceeded', 429);
  };

  res.error = function(err) {
    console.error('Error', err.message, err.stack);
    respond(err.message || 'server error', 500, err.stack);
  };
}

module.exports.attachHandlers = attachHandlers;
