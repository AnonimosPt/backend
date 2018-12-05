/**
 * UsuarioblogController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

 // var Promise = Promise || require('bluebird');

 var Promise = Promise || require('bluebird');

 module.exports = {
   pul: function(req, res) {
     var
       userid = req.param('user')
     ;
     Usuarioblog
       .findOne({
         id: userid
       })
       .then(function(usr){
         if(usr && usr.id){
           return usr;
         }
         return Promise.reject('not found');
       })
       .then(function(usr){
         var msg = {
           user: usr,
           type: 'ping'
         };

         sails.sockets.blast('ping', {
           user: usr,
           type: 'pul'
         });

         Usuario.message(userid, msg);

         res.ok('Send PING, wait for PONG');
       }, res.negotiate)
     ;
   },
   pus: function(req, res) {
     var
       userId = req.param('user'),
       fromId = req.param('userFrom'),
       msg = {
         user: fromId,
         type: 'pus'
       }
     ;
     return Usuarioblog
       .find({
         id: [userId, fromId]
       })
       .then(function(list){
         //sails.log.info(list)
         if(list.length === 2){
           var
             user = _.filter(list, function(item){
               return item.id === userId;
             })[0],
             from = _.filter(list, function(item){
               return item.id === fromId;
             })[0]
           ;
           //sails.log.info('INDEXES\n',user, from)
           if(user && from && user.id && from.id){
             sails.sockets.blast('pus', {
               user: user,
               fromUser: from,
               type: 'pus'
             });
             return res.ok('PUS');
           }
         }
         res.badRequest();
       })
     ;
   },
   create: function(req, res) {
     if (req.body.password !== req.body.confirmation) {
       return res.json(401, {err: ['Password doesn\'t match']});
     }
     var params = req.allParams();

     Blog
       .findOne({
         where: {
           or: [
             {
               id: params.blog
             },
             {
               dominio: params.blog
             },
             {
               slug: Tools.getSlug(params.blog)
             }
           ]
         }
       })
       .then(function(blog){
         if(blog && blog.id){
           return blog;
         }
         return Promise.reject('not found blog');
       })
       .then(function(blog){
         Rol
           .findOne({
             or: [
               {
                 id: params.rol
               },
               {
                 slug: Tools.getSlug(params.rol)
               }
             ]
           })
           .then(function(rol){
             var data = {
               usuario: params.usuario,
               username: params.username,
               nombre: params.nombre,
               slugnombre: params.slugnombre,
               estado: params.estado,
               creador: params.creador,
               email: params.email,
               password: params.password,
               confirmation: params.confirmation,
               apellido: params.apellido,
               slugapellido: params.slugapellido,
               doctipo: params.doctipo,
               documento: params.documento,
               departamentonacimiento: params.departamentonacimiento || '',
               fechadenacimiento: params.fechadenacimiento || '',
               ciudadnacimiento: params.ciudadnacimiento || '',
               estadocivil: params.estadocivil || '',
               pais: params.pais || '',
               telefono: params.telefono || 0,
               celular: params.celular || 0,
               blog: params.blog,
               blogapi: params.blogapi,
               direccion: params.direccion || '',
               namerol: params.namerol,
               descripcion: params.descripcion

             };
             if(params.barrio){
               data.barrio = params.barrio;
             }
             if(params.ciudad){
               data.ciudad = params.ciudad;
             }
             if(rol && rol.id){
              data.rol = rol.id;
              }
             var articulo = params.articulo || params.inmueble || params.proyecto;
             Usuarioblog
               .create(data)
               .then(function(user){
                 return user;
               })
               .then(function(user) {
                 Usuarioblog.publishCreate(user);
                   return res.json({
                     user: user,
                     token: sailsTokenAuth.issueToken({
                       sid: user.id
                     })
                 })
                 ;
                 return user;
               })
               .then(function(user){
                 res.ok(user);
               })
             ;
           })
           ;
       }, function(err){
         res.negotiate(err);
       })
     ;
   },
   identify: function(req, res){
     var token = req.param('token');

     if (!_.isString(token)) {
       return res.json(403, {err: ['invalid user']});
     }

     Token
       .findOne({
         token: token
       })
       .populate('usuario')
       .exec(function(err, user){
         if(err || !user){
           return res.json(401, {err: ['user not found']});
         }
         user = user.usuario;
         var usr = {
           id: user.id,
           email: user.email,
           nombre: user.nombre,
           username: user.username
         };

         sails.sockets.blast('identify', {
           user: usr,
           type: 'identify'
         }, req);
         res.json(usr);
       })
     ;
   },
   authenticate: function(req, res) {
     var username = req.param('username');
     var email = req.param('email');
     var password = req.param('password');
     //sails.log.info(req.allParams())
     if ((!_.isString(email) && !_.isString(username)) || !_.isString(password)) {
       return res.json(401, {err: ['username and password required']});
     }

     var promise = null;

     if(_.isString(username)){
       promise = new Promise(function(resolve, reject){
         Usuarioblog.findOneBySlug(Tools.getSlug(username), function(err, user) {
           if (!user) {
             return reject({err: ['invalid username or password']});
           }
           resolve(user);
         });
       });
     }else{
       promise = new Promise(function(resolve, reject){
         Usuarioblog.findOneByEmail(email.toLowerCase(), function(err, user) {
           // sails.log.info(253, err, user);
           if (!user) {
             return reject({err: ['invalid email or password']});
           }
           resolve(user);
         });
       });
     }

     promise
       .then(function(user){
         // sails.log.info(262, user);
         Usuarioblog.validPassword(password, user, function(err, valid) {
           if (err) {
             return res.json(403, {err: ['forbidden']});
           }

           if (!valid) {
             return res.json(401, {err: ['invalid username or password']});
           } else {
             var rta = {
               email: user.email,
               nombre: user.nombre,
               username: user.username
             };
             /*Usuario.message(user.id, {
               user: rta,
               type: 'authenticated'
             });*/
             // sails.log.info(281, user);
             Token.create({
               usuario: user.usuario
             }).exec(function(err, token){
               // sails.log.error(err, token)
               if(err){
                 return res.json(401,{err: ['invalid token']})
               }
               rta.token = token.token;
               // Emit user connected
               sails.sockets.blast('authenticated', {
                 user: {
                   id: user.id,
                   email: user.email,
                   nombre: user.nombre,
                   username: user.username
                 },
                 type: 'authenticated'
               }, req);
               res.json(rta);
             });
           }
         });
       }, function(err){
         return res.json(401, err);
       })
     ;
   },
   reportes: function (req, res) {
     var
        params = req.allParams()
     ;
     if (params.where) {
       params.blog = params.where.blog;
     }
     if (params.blog) {
       var
        data = {
          usuario:{
            total: 0
          },
          masculino:{
            total: 0
          },
          femenino:{
            total: 0
          }
        }
        ;
        return Blog
          .findOne({
            where:{
              or:[
                {
                  id: params.blog
                },
                {
                  host: params.blog
                },
                {
                  slug: params.blog
                }
              ]
            }
          })
          .then(function(blog){
            if (blog && blog.id) {
              return blog;
            }
          })
          .then(function(blog){
            sails.log.info(399, blog);
            return Usuarioblog
            .find({
              limit: -1,
              where:{
                usuario: {
                  '!': null
                },
                blog: blog.id,
                estado: 'activo'
              }
            })
            .then(function(rta){
              data.usuario.total = rta.length+1;
              return data;
            })
            .then(function(reporte){
              return Usuarioblog
              .find({
                limit: -1,
                where:{
                  usuario: {
                    '!': null
                  },
                  sexo: 'masculino',
                  blog: blog.id,
                  estado: 'activo'
                }
              })
              .then(function(rta){
                data.masculino.total = rta.length+1;
                return data;
              })
              ;
            })
            .then(function(reporte){
              return Usuarioblog
              .find({
                limit: -1,
                where:{
                  usuario: {
                    '!': null
                  },
                  sexo: 'femenino',
                  blog: blog.id,
                  estado: 'activo'
                }
              })
              .then(function(rta){
                data.femenino.total = rta.length+1;
                return data;
              })
              ;
            })
            ;
          })
          .then(function(reporte){
            sails.log.info(399, reporte);
            res.ok(reporte);
          }, function(err){
            res.negotiate(err);
          })
          ;
     }

   }
 };
