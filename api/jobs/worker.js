var _ = require('lodash'),
  kue = require('kue'),
  q = require('q');

require('sails').load({
  hooks: {
    blueprints: false,
    controllers: false,
    cors: false,
    csrf: false,
    grunt: false,
    http: false,
    i18n: false,
    logger: false,
    //orm: leave default hook,
    policies: false,
    //pubsub: require('pubsub-emitter'),
    request: false,
    responses: false,
    //services: leave default hook,
    session: false,
    sockets: false,
    views: false
  }
}, function(err, app) {

  sails.log.info("Starting kue")
  var kue_engine = sails.config.kue;

  //register kue.
  sails.log.info("Registering jobs")
  var jobs = require('include-all')({
    dirname: __dirname + '/jobs',
    filter: /(.+)\.js$/,
    excludeDirs: /^\.(git|svn)$/,
    optional: true
  });

  _.forEach(jobs, function(job, name) {
    sails.log.info("Registering kue handler: " + name)
    kue_engine.process(name, job);
  });

  kue_engine.on('job complete', function(id) {
    sails.log.info("Removing completed job: " + id);
    kue.Job.get(id, function(err, job) {
      job.remove();
    });
  });

  process.once('SIGTERM', function(sig) {
    kue_engine.shutdown(function(err) {
      console.log('Kue is shut down.', err || '');
      process.exit(0);
    }, 5000);
  });

});
