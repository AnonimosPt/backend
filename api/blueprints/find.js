/**
 * Created by hender on 20/06/17.
 */

/**
 * Module dependencies
 */
var _ = _ || require('lodash');

/**
 * Find Records
 *
 *  get   /:modelIdentity
 *   *    /:modelIdentity/find
 *
 * An API call to find and return model instances from the data adapter
 * using the specified criteria.  If an id was specified, just the instance
 * with that unique id will be returned.
 *
 * Optional:
 * @param {Object} where       - the find criteria (passed directly to the ORM)
 * @param {Integer} limit      - the maximum number of records to send back (useful for pagination)
 * @param {Integer} skip       - the number of records to skip (useful for pagination)
 * @param {String} sort        - the order of returned records, e.g. `name ASC` or `age DESC`
 * @param {String} callback - default jsonp callback param (i.e. the name of the js function returned)
 */

module.exports = function findRecords(req, res) {

  // Look up the model
  var Model = ActionUtilityService.util.parseModel(req);
  sails.log.info(32, ActionUtilityService.util.parseCriteria(req));
  // If an `id` param was specified, use the findOne blueprint action
  // to grab the particular instance with its primary key === the value
  // of the `id` param.   (mainly here for compatibility for 0.9, where
  // there was no separate `findOne` action)
  if (ActionUtilityService.util.parsePk(req)) {
    return require('../../node_modules/sails/lib/hooks/blueprints/actions/findOne')(req, res);
  }
  // Lookup for records that match the specified criteria
  var
    page = ActionUtilityService.util.parsePage(req) || 1,
    limit = ActionUtilityService.util.parseLimit(req);
  //sails.log.info('46 find LIMIT \n',limit, page)
  var query = Model
    .find()
    .where(ActionUtilityService.util.parseCriteria(req))
    .limit(limit)
    .skip(ActionUtilityService.util.parseSkip(req))
    .sort(ActionUtilityService.util.parseSort(req))
    .paginate({
      page: page,
      limit: limit || ActionUtilityService.util.parsePerPage(req)
    });
  //sails.log.info(req.allParams(), ActionUtilityService.util.parseCriteria(req))
  query = ActionUtilityService.util.populateRequest(query, req);
  query
    .then(function(matchingRecords) {
      sails.log.info(519, matchingRecords);
      if (req._sails.hooks.pubsub && req.isSocket) {
        Model.subscribe(req, matchingRecords);
        if (req.options.autoWatch) {
          Model.watch(req);
        }
        // Also subscribe to instances of all associated models
        _.each(matchingRecords, function(record) {
          ActionUtilityService.util.subscribeDeep(req, record);
        });
      }
      return Model
        .count()
        .then(function(total) {
          var
            last = Math.ceil(total / limit),
            start = (page * limit) - limit,
            end = start + matchingRecords.length,
            info = {
              total: total,
              limit: limit,
              ini: start + 1,
              end: end,
              page: {
                here: page,
                first: 1,
                last: last,
                next: total > end && end > 1 ? page + 1 : 1,
                prev: page > 1 ? page - 1 : last
              }
            };
          return res
            .set('info', info)
            .set('total', info.total)
            .set('limit', info.limit)
            .set('ini', info.ini)
            .set('end', info.end)
            .set('page', info.page.here)
            .set('last-page', info.page.last)
            .set('first-page', info.page.first)
            .set('next-page', info.page.next)
            .set('prev-page', info.page.prev)
            .ok(matchingRecords);
        });
    })
    .catch(function(err) {
      if (err) return res.serverError(err);
    })
};
