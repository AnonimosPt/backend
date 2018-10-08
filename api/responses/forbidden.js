
module.exports = function forbidden(data, options) {

  // Get access to `req`, `res`, & `sails`
  var req = this.req;
  var res = this.res;
  var sails = req._sails;

  // Set status code
  res.status(403);

  // Log error to console
  if (data !== undefined) {
    sails.log.verbose('Sending 403 ("Forbidden") response: \n', data);
  } else sails.log.verbose('Sending 403 ("Forbidden") response');

  if (sails.config.environment === 'production' && sails.config.keepResponseErrors !== true) {
    data = undefined;
  }

  if (req.wantsJSON || sails.config.hooks.views === false) {
    return res.jsonx(data);
  }

  options = (typeof options === 'string') ? {
    view: options
  } : options || {};

  // Attempt to prettify data for views, if it's a non-error object
  var viewData = data;
  if (!(viewData instanceof Error) && 'object' == typeof viewData) {
    try {
      viewData = require('util').inspect(data, {
        depth: null
      });
    } catch (e) {
      viewData = undefined;
    }
  }

  if (options.view) {
    return res.view(options.view, {
      data: viewData,
      title: 'Forbidden'
    });
  }

  else return res.view('403', {
    data: viewData,
    title: 'Forbidden'
  }, function(err, html) {

    // If a view error occured, fall back to JSON(P).
    if (err) {
      //
      if (err.code === 'E_VIEW_FAILED') {
        sails.log.verbose('res.forbidden() :: Could not locate view for error page (sending JSON instead).  Details: ', err);
      }
      // Otherwise, if this was a more serious error, log to the console with the details.
      else {
        sails.log.warn('res.forbidden() :: When attempting to render error page view, an error occured (sending JSON instead).  Details: ', err);
      }
      return res.jsonx(data);
    }

    return res.send(html);
  });

};
