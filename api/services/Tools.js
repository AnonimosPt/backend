/**
 * Created by hender on 16/05/17.
 */

module.exports = (function() {
  var Cache = Cache || require("sailsjs-cacheman").sailsCacheman('tools');
  return {
    getSlug: slug,
    tokenauth: tokenauth,
    destroyRels: destroyRels,
    getCollectionCache: getCollectionCache,
    deleteCollectionCache: deleteCollectionCache
  };
  function tokenauth(data) {
    // upload file in specific folder
    /***** import primaries materials in order to build the Api code *****/
    // import Google api library
    var {
      google
    } = require("googleapis");
    // import the Google drive module in google library
    var drive = google.drive("v3");
    // import our private key
    var key = require("../keys/drive.json");

    // import path ° directories calls °
    var path = require("path");
    // import fs ° handle data in the file system °
    var
      fs = require("fs"),
      promises = []
    ;


    /***** make the request to retrieve an authorization allowing to works
          with the Google drive web service *****/
    // retrieve a JWT
    var jwToken = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key, ["https://www.googleapis.com/auth/drive"],
      null
    );

    jwToken.authorize((authErr) => {
      if (authErr) {
        console.log("error : " + authErr);
        return false;
      } else {
        console.log("Authorization accorded");
        return jwToken;
      }
    });
  }
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
