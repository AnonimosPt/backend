/**
 * Created by hender on 16/05/17.
 */

var
  path = path || require('path'),
  mime = mime || require('mime'),
  Promise = Promise || require('bluebird'),
  concat = concat || require('concat-stream'),
  GCS = GCS || require('@google-cloud/storage'),
  Writable = Writable || require('stream').Writable,
  Transform = Transform || require('stream').Transform;

module.exports = (function() {

  return skipperGCS;


  function skipperGCS(globalOpts) {
    globalOpts = _.defaults(globalOpts, {
      //projectId: 'api-project-428657127076',
      //keyFilename: 'api/keys/keyfile.json'
      projectId: 'justsapiens-1082',
      keyFilename: 'api/keys/keyfile-justsapiens.json'
    });

    var blogBucket = GCS({
        projectId: globalOpts.projectId,
        keyFilename: globalOpts.keyFilename
      })
      .bucket(globalOpts.bucket);

    var
      created = false,
      bucketCreating = blogBucket
      .exists()
      .then(function(exist) {
        exist = exist[0];
        if (!exist) {
          blogBucket
            .create()
            .then(function(data) {
              var
                //zone = data[0],
                apiResponse = data[1];
              //sails.log(zone)// Config del bucket
              //sails.log(apiResponse)// datos del bucket
              created = true;
              return !!apiResponse.id;
            });
        }
        return exist;
      });
    return {
      ls: gcsLs,
      rm: gcsRm,
      read: gcsRead,
      receive: gcsReceive
    };

    function gcsLs(cb) {
      if (created) {
        list();
      } else {
        bucketCreating
          .then(function() {
            return list();
          });
      }

      function list() {
        var files = [];
        blogBucket
          .getFilesStream()
          .on('error', function(err) {
            cb(err);
          })
          .on('data', function(file) {
            files.push(file);
          })
          .on('end', function() {
            cb(null, files);
          });
      }
    }

    function gcsRm(fd, cb) {
      if (created) {
        return remove();
      } else {
        return bucketCreating
          .then(function() {
            return remove();
          });
      }

      function remove() {
        var file = blogBucket.file(fd);
        return file
          .exists()
          .then(function(exist) {
            //sails.log.info('\nservice/skiperGCS:102\n', exist)
            exist = exist[0];
            if (exist) {
              return file
                .delete()
                .then(function(response) {
                  response = response[0] || response;
                  if (_.isFunction(cb)) {
                    cb(null, response);
                  }
                  return response;
                }, function(err) {
                  if (_.isFunction(cb)) {
                    cb(err);
                  }
                  return err;
                });
            }
            //return Promise.reject('not found file "' + fd + '"');
            return true;
          }, function(err) {
            if (_.isFunction(cb)) {
              cb(err);
            }
            return err;
          });
      }
    }

    function gcsRead(fd, cb) {
      var
        __transform__ = new Transform(),
        check = false;
      __transform__._transform = function(chunk, encoding, callback) {
        return callback(null, chunk);
      };

      if (created) {
        read();
      } else {
        bucketCreating
          .then(function() {
            read();
          });
      }

      if (cb) {
        var firedCb;
        __transform__.on('error', function(err) {
          if (firedCb) {
            return;
          }
          firedCb = true;
          cb(err);
        });
        __transform__.pipe(concat(function(data) {
          if (firedCb) {
            return;
          }
          firedCb = true;
          cb(null, data);
        }));
      }

      return __transform__;

      function read() {
        var file = blogBucket.file(fd);
        return file
          .exists()
          .then(function(exist) {
            exist = exist[0];
            if (exist) {
              return file
                .createReadStream()
                .on('error', function(err) {
                  //sails.log.error('READ ERROR INI')
                  //sails.log.error(err)
                  //sails.log.error('READ ERROR END')
                  __transform__.emit('error', err);
                })
                .on('response', function(response) {
                  //sails.log.info('READ RESPONSE => \n');
                  //sails.log.info('RESPONSE => \n', response);
                  //cb(null, response);
                  //response.pipe(__transform__);
                  __transform__.emit('response', response);
                })
                .on('finish', function() {
                  //sails.log.info('READ FINISH => \n');
                  //sails.log.info('FINISH => \n', rta);
                  // The file upload is complete.
                  //cb(null, rta);
                  __transform__.emit('end');
                })
                .pipe(__transform__);
            }
            if (!check) {
              // Revisa nuevamente que exista el archivo
              setTimeout(function() {
                check = true;
                read();
              }, 1000)
            }
            // Error al
            __transform__.emit('error', {
              error: 'not found file "' + fd + '"'
            });
          });
      }
    }

    function gcsReceive(opts) {
      // console.log('`.receive()` was called...');
      var options = opts || {};
      options = _.defaults(options, globalOpts);

      //var bytesRemaining = options.maxBytes;

      var receiver__ = Writable({
        objectMode: true
      });

      receiver__._files = [];

      //var totalBytesWritten = 0;

      receiver__.on('error', function(err) {
        //sails.log.error('ERROR ON RECEIVER__ ::');
        //sails.log.error('ERROR ON RECEIVER__ ::',err);
        if (_.isFunction(options.onError)) {
          options.onError(err);
        }
      });

      receiver__.on('response', function(response) {
        //sails.log('RESPONSE ON RECEIVER__ ::');
        //sails.log('RESPONSE ON RECEIVER__ ::',response);
        if (_.isFunction(options.onResponse)) {
          options.onResponse(response);
        }
      });

      receiver__.on('writefile', function(file) {
        //sails.log('WRITE FILE ON RECEIVER__ ::');
        //sails.log('WRITE FILE ON RECEIVER__ ::',file);
        if (_.isFunction(options.onWritefile)) {
          options.onWritefile(file);
        }
      });

      // This `_write` method is invoked each time a new file is received
      // from the Readable stream (Upstream) which is pumping filestreams
      // into this receiver.  (filename === `__newFile.filename`).
      receiver__._write = function onFile(__newFile, encoding, next) {

        //var startedAt = new Date();

        __newFile.on('error', function(err) {
          //sails.log.error('ERROR ON file read stream in receiver (%s) ::', __newFile.filename, err);
          // TODO: the upload has been cancelled, so we need to stop writing
          // all buffered bytes, then call gc() to remove the parts of the file that WERE written.
          // (caveat: may not need to actually call gc()-- need to see how this is implemented
          // in the underlying knox-mpu module)
          //
          // Skipper core should gc() for us.
          if (_.isFunction(options.onError)) {
            options.onError(err);
          }
        });

        var bytesWritten = 0;

        if (created) {
          save(__newFile);
        } else {
          // Espera la creación del bucket
          bucketCreating
            .then(function() {
              // Guarda los archivos en el bucket
              save(__newFile);
            });
        }

        /**
         * @name save
         * @description guarda los archivos
         *
         * @param newFile
         */
        function save(newFile) {
          newFile
            .on('error', function(err) {
              // Dispara el error y continúa
              receiver__.emit('error', err);
              next(err);
            })
            .on('response', function(response) {
              // Dispara la recepción de un archivo
              //sails.log.info('RESPONSE => \n', response);
              receiver__.emit('response', __newFile);
            })
            .on('finish', function() {
              var file = _.find(receiver__._files, {
                fd: __newFile.fd
              });
              if (file) {
                // Set the byteCount of the stream to the "total" value of the file, which has
                // been updated as the file was written.
                __newFile.byteCount = file.total;
              }
              receiver__.emit('writefile', __newFile);

              next();
            })
            .pipe(
              blogBucket
              .file(__newFile.fd)
              .createWriteStream()
            );
        }

      };

      return receiver__;
    }
  }
})();
