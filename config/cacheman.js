
module.exports.cacheman = {
  driver: 'redis',

  memory: {
    engine: 'cacheman-memory'
  },

  redis: {
    port: 6379,
    host: '127.0.0.1',
    //password: 'my-p@ssw0rd',
    database: 2,
    engine: 'cacheman-redis'
  }
};
