/**
 * Created by hender on 16/05/17.
 */
var Cacheman = Cacheman || require('cacheman');

module.exports = (function() {
  var
    cachenames = ['cms'],
    defaults = {
      ttl: 604800
    },
    cache = new Cacheman(cachenames[0], {
      ttl: defaults.ttl,
      port: 6379,
      engine: 'redis',
      host: '127.0.0.1'
    });
  return {
    set: setItem,
    get: getItem,
    del: delItem,
    clear: clearCache
  };


  function setItem(key, val, ttl) {
    console.log(key, val, ttl)
    return cache.set(key, val, ttl || defaults.ttl);
  }

  function getItem(key) {
    // sails.log.infog(key);
    console.log(key);
    return cache.get(key);
  }

  function delItem(key) {
    console.log(key)
    return cache.del(key);
  }

  function clearCache() {
    console.log("men")
    return cache.clear();
  }
})();
