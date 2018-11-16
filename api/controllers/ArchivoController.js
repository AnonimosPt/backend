/**
 * ArchivoController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
 var
  googleDrive = require('google-drive')
  ;
module.exports = {
  getlist:function(req, res){
    var
      params = req.allParams()
    ;

    sails.log.info(16, params);
    if (params.where.name) {
      params.name = params.where.name;
    }
    if (params.name) {
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
          // console.log("error : " + authErr);
          return false;
        } else {
          // console.log("Authorization accorded");
          return jwToken;
        }
      });
      var parents = "0B_4rhD_gCkABRUpWS20xQVdBU00"
      drive.files.list({
        auth: jwToken,
        pageSize: 10,
        q: "'" + parents + "' in parents and name="+"'"+params.name+"'",
        fields: 'files(*)',
      }, (err, {
        data
      }) => {
        if (err) return console.log('The API returned an error: ' + err);
        var files = data.files;
        if (files) {
          // console.log('Files:');
          res.ok(files);
        } else {
          // console.log('No files found.');
          res.negotiate(err);
        }
      });
    }else {
      res.negotiate({err: "error name"});
    }
  },
  pushdrive: function(req, res){
      var
        params = req.allParams()
      ;

      // sails.log.info(81, params);
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
          // console.log("error : " + authErr);
          return false;
        } else {
          // console.log("Authorization accorded");
          // return jwToken;
        }
      });
      req
        .file('files').upload(function (err, uploadFiles) {
        if (err) {
          return reject(err);
        }
          // sails.log.info(126, uploadFiles);
          // res.ok(uploadFiles);
          _.forEach(uploadFiles, function(item){
            if (item.fd) {
              var
                url = item.fd.split('\\', '10')
              ;
              if (jwToken) {
                var
                  folderId = "0B_4rhD_gCkABRUpWS20xQVdBU00",
                  name = new Date()+' '+item.filename+params.opciono
                ;
                var fileMetadata = {
                  'name': name,
                  parents: [folderId]
                };
                var media = {
                  mimeType: 'image/jpeg',
                  body: fs.createReadStream(path.join(__dirname,'../../.tmp/uploads/'+url[5]))
                };
                drive.files.create({
                  auth: jwToken,
                  resource: fileMetadata,
                  media: media
                  // fields: 'id'
                }, function(err, file) {
                  if (err) {
                    // Handle error
                    // console.error(err);
                    res.negotiate(err);
                  } else {
                    // sails.log.info(157, file);
                    // console.log('File Id: ', file.id);
                    archivopus(fileMetadata, params, name, jwToken, drive, params);
                    // res.ok(fileMetadata);
                  }
                });
              }
            }
          })
          ;
      })
      ;
      function archivopus(fileMetadata, params, name, jwToken, drive, params) {
        // sails.log.info(178,name);
        // "Tue Oct 30 2018 18:48:04 GMT-0500 (Hora est. Pacífico, Sudamérica) 0957d4b226dd51d.jpg"
        var
          parents = "0B_4rhD_gCkABRUpWS20xQVdBU00"
        drive.files.list({
          auth: jwToken,
          pageSize: 1,
          // q: "'" + parents + "' in parents and trashed=false",
          // q: "'" + parents + "' in parents and name='Tue Oct 30 2018 19:07:51 GMT-0500 (Hora est. Pacífico, Sudamérica) 0957d4b226dd51d.jpg'",
          q: "'" + parents + "' in parents and name="+"'"+name+"'",
          fields: 'files(*)',
        }, (err, {
          data
        }) => {
          if (err) return console.log('The API returned an error: ' + err);
          if (data) {
            var files = data.files;
          }
          if (files) {
            // console.log('Files:');
            // sails.log.info(193,files[0]);
            files = files[0];
            if (files) {
                Archivo
                .create({
                  titulo: name,
                  slug: _.kebabCase(name),
                  filename: name,
                  url: files.thumbnailLink,
                  urlprint: files.webViewLink,
                  icon: files.iconLink,
                  type: files.fileExtension,
                  size: files.imageMediaMetadata,
                  blog: params.blog,
                  usuario: params.usuario,
                  contrato: params.contrato
                })
                .then(function(archivo){
                  // sails.log.info(204, archivo);
                  if (archivo.id) {
                    var
                      bs = {}
                    ;
                    if (params.articuloblog) {
                      bs.articuloblog = params.articuloblog;
                    }
                    if (params.usuario) {
                      bs.usuario = params.usuario;
                    }
                    if (params.ingrediente) {
                      bs.ingrediente = params.ingrediente;
                    }
                    sails.log.info(222, bs);
                    Galeria
                      .find(bs)
                      .then(function(galeria){
                        sails.log.info(226, galeria);
                        galeria = galeria[0];
                        if (!galeria) {
                          sails.log.info(228, galeria);
                          var
                            query = {}
                          ;
                          if (params.usuario) {
                            query = {
                              titulo: params.usuarioblog+ new Date(),
                              usuario: params.usuario,
                              blog: params.blog
                            }
                            ;
                          }
                          if (params.articuloblog) {
                            query = {
                              titulo: params.articulo+ new Date(),
                              articulo: params.articulo,
                              articuloblog: params.articuloblog,
                              blog: params.blog
                            }
                            ;
                          }
                          if (params.ingrediente) {
                            query = {
                              titulo: params.ingrediente+new Date(),
                              ingrediente: params.ingrediente
                            }
                          }
                            query.slug = _.kebabCase(query.titulo);
                            sails.log.info(248, query);
                            Galeria
                            .create(query)
                            .then(function(pusgaleria){
                              sails.log.info(252, pusgaleria);
                              if (pusgaleria.id) {
                                archivogaleria(pusgaleria, archivo);
                              }
                            })
                        }else {
                          archivogaleria(galeria, archivo);
                        }
                        function archivogaleria(galeria, archivo) {
                          // sails.log.info(235, galeria, archivo);
                          var
                            data = {
                              archivo: archivo.id,
                              galeria: galeria.id,
                              usuario: params.usuario
                            }
                          ;
                          // sails.log.info(247, data);
                          Archivogaleria
                          .create(data)
                          .then(function(rta){
                            // sails.log.info(239, rta);
                            res.ok(rta);
                          })
                          ;
                        }
                      })
                      ;
                  }
                })
                ;
            }
          } else {
            // console.log('No files found.');
            res.negotiate(err);
          }
        });
      }
  }
};
