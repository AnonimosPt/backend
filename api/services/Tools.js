/**
 * Created by hender on 16/05/17.
 */

module.exports = (function() {
  var Cache = Cache || require("sailsjs-cacheman").sailsCacheman('tools');
  return {
    getSlug: slug,
    destroyRels: destroyRels,
    getCollectionCache: getCollectionCache,
    deleteCollectionCache: deleteCollectionCache
  };

  function deleteCollectionCache(name) {
    return new Promise(function(resolve, reject) {
      if (getCollectionCache(name)) {
        return resolve(Cache.del(name));
      }
      reject(name + ' not found');
    });
  }

  function getCollectionCache(name, value) {
    // console.log(name, value)
    // sails.log.infog(name. value);
    if (_.isString(name)) {
      if (value) {
        // console.log(value)
        // sails.log.infog(value);
        // sails.log.info(name + '-value => ', value)
        return Cache.set(name, value, '2d');
      }
      // console.log(name)
      return Cache.get(name);
    }

    return Cache;
  }

  function slug(str) {
    var rta = str;
    if (!_.isString(rta)) {
      if (rta && rta.slug) {
        rta = rta.slug;
      }
    } else {
      rta = _.kebabCase(rta.toLowerCase());
    }
    return rta;
  }

  function destroyRels(Models, query, cb) {
    var promises = [];
    _.forEach(Models, function(Model) {
      promises.push(
        Model
        .find(query)
        .then(function(list) {
          if (list.length > 0) {
            return Model.destroy(_.map(list, 'id'));
          }
          return 'no found';
        })
      );
    });

    if (_.isFunction(cb)) {
      return Promise
        .all(promises)
        .then(function() {
          cb();
        });
    }
    return promises;
  }
})();
