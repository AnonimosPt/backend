module.exports = function(job, done) {
  //long running job code here.
  //SailsJS Models and Services are also available here.

  User.findOne({
      id: job.data.user_id
    })
    .then(function() {
      //do some processing.

      //call done() when complete (look at the kue docs for more infomation)
    })
    .then(done, done)

};
