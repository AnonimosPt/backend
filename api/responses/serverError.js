

module.exports = function serverError(data, options) {

  // Get access to `req`, `res`, & `sails`
  var req = this.req;
  var res = this.res;
  var sails = req._sails;

  // Set status code
  res.status(500);

  // Log error to console
  if (data !== undefined) {
    sails.log.error('Sending 500 ("Server Error") response: \n', data);
  } else sails.log.error('Sending empty 500 ("Server Error") response');

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
      title: 'Server Error'
    });
  }

  else return res.view('500', {
    data: viewData,
    title: 'Server Error'
  }, function(err, html) {

    // If a view error occured, fall back to JSON(P).
    if (err) {
      //
      // Additionally:
      // • If the view was missing, ignore the error but provide a verbose log.
      if (err.code === 'E_VIEW_FAILED') {
        sails.log.verbose('res.serverError() :: Could not locate view for error page (sending JSON instead).  Details: ', err);
      }
      // Otherwise, if this was a more serious error, log to the console with the details.
      else {
        sails.log.warn('res.serverError() :: When attempting to render error page view, an error occured (sending JSON instead).  Details: ', err);
      }
      return res.jsonx(data);
    }

    return res.send(html);
  });

};
