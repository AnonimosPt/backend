/**
 * Created by hender on 20/06/17.
 */

const actionUtil = require('../../node_modules/sails/lib/hooks/blueprints/actionUtil');
const _ = require('lodash');
const isArray = _.isArray;
const isUndefined = _.isUndefined;
const isString = _.isString;
const isObject = _.isObject;

// Parameter used for jsonp callback is constant, as far as
// blueprints are concerned (for now.)
const JSONP_CALLBACK_PARAM = 'callback';

actionUtil.parsePage = function(req) {
  const DEFAULT_PAGE = 1;
  var page = req.param('page') || (typeof req.options.page !== 'undefined' ? req.options.page : DEFAULT_PAGE);
  if (page) {
    page = +page;
  }
  return page;
};

actionUtil.parsePerPage = function(req) {
  //const DEFAULT_PER_PAGE = req._sails.config.blueprints.perPage || 20;
  const DEFAULT_PER_PAGE = req._sails.config.blueprints.defaultLimit || 20;
  var perPage = req.param('perPage') || (typeof req.options.perPage !== 'undefined' ? req.options.perPage : DEFAULT_PER_PAGE);
  if (perPage) {
    perPage = +perPage;
  }
  return perPage;
};

actionUtil.parseCriteria = function(req) {
  // Allow customizable blacklist for params NOT to include as criteria.
  req.options.criteria = req.options.criteria || {};
  req.options.criteria.blacklist = req.options.criteria.blacklist || ['limit', 'skip', 'sort', 'populate', 'page', 'perPage'];

  // Validate blacklist to provide a more helpful error msg.
  var blacklist = req.options.criteria && req.options.criteria.blacklist;
  if (blacklist && !isArray(blacklist)) {
    throw new Error('Invalid `req.options.criteria.blacklist`. Should be an array of strings (parameter names.)');
  }

  // Look for explicitly specified `where` parameter.
  var where = req.params.all().where;

  // If `where` parameter is a string, try to interpret it as JSON
  if (isString(where)) {
    where = tryToParseJSON(where);
  }

  // If `where` has not been specified, but other unbound parameter variables
  // **ARE** specified, build the `where` option using them.
  if (!where) {

    // Prune params which aren't fit to be used as `where` criteria
    // to build a proper where query
    where = req.params.all();

    // Omit built-in runtime config (like query modifiers)
    where = _.omit(where, blacklist || ['limit', 'skip', 'sort', 'page', 'perPage']);

    // Omit any params w/ undefined values
    where = _.omit(where, function(p) {
      if (isUndefined(p)) {
        return true;
      }
    });

    // Omit jsonp callback param (but only if jsonp is enabled)
    var jsonpOpts = req.options.jsonp && !req.isSocket;
    jsonpOpts = isObject(jsonpOpts) ? jsonpOpts : {
      callback: JSONP_CALLBACK_PARAM
    };
    if (jsonpOpts) {
      where = _.omit(where, [jsonpOpts.callback]);
    }
  }

  // Merge w/ req.options.where and return
  where = _.merge({}, req.options.where || {}, where) || undefined;

  return where;
};

function tryToParseJSON(json) {
  if (!isString(json)) return null;
  try {
    return JSON.parse(json);
  } catch (e) {
    return e;
  }
}

module.exports = {
  util: actionUtil
};
