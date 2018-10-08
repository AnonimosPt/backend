/**
 * UsuarioController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
 var Promise = Promise || require('bluebird');

 module.exports = {
   ping: function(req, res) {
     var
       userid = req.param('user')
     ;
     /*if(!req.isSocket || !userid){
       return res.badRequest();
     }*/
     Usuario
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
           type: 'ping'
         });

         Usuario.message(userid, msg);

         //res.json(msg);
         res.ok('Send PING, wait for PONG');
       }, res.negotiate)
     ;
   },
   pong: function(req, res) {
     var
       userId = req.param('user'),
       fromId = req.param('userFrom'),
       msg = {
         user: fromId,
         type: 'pong'
       }
     ;
     /*if(!req.isSocket || !userid){
       return res.badRequest();
     }*/

     //sails.log.info('ID\'s\n',userId, fromId)
     return Usuario
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
             sails.sockets.blast('pong', {
               user: user,
               fromUser: from,
               type: 'pong'
             });
             return res.ok('PONG');
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
               nombre: params.nombre,
               activo: params.activo,
               creador: params.creador,
               blog: params.blog,
               telefono: params.telefono,
               direccion: params.direccion,
               numid: params.numid,
               documento: params.documento,
               doctipo: params.doctipo,
               apellido: params.apellido,
               descripcion: params.descripcion,

               email: params.email,
               username: params.username,
               password: params.password,
               confirmation: params.confirmation
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
             Usuario
               .create(data)
               .then(function(user){
                 if(data.email && data.email.split('@')[1] === blog.dominio){
                   return Mailjet
                     .getSender(user)
                     .then(function(usr){
                       return Mailjet.getParseroute(usr, blog)
                     })
                     .then(function(usr){
                       user.emailactive = usr.active;
                       return user;
                     })
                   ;
                 }
                 return user;
               })
               .then(function(user){
                 res.ok(user);
                 // return Usuarioblog
                 //   .create(data)
                 //   .then(function () {
                 //     Usuario.publishCreate(user);
                 //     return res.json({
                 //       user: user,
                 //       token: sailsTokenAuth.issueToken({
                 //         sid: user.id
                 //       })
                 //     });
                 //   })
                 // ;
               }, function(err){
                 res.negotiate(err);
                 /*res.json(err.status, {
                   err: err
                 });*/
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
     sails.log.info(288, token);
     if (!_.isString(token)) {
       return res.json(403, {err: ['invalid user']});
     }
     Token
       .findOne({
         token: token
       })
       .populate('usuario')
       .exec(function(err, user){
         sails.log.info(215, user);
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
         Usuario.findOneBySlug(Tools.getSlug(username), function(err, user) {
           if (!user) {
             return reject({err: ['invalid username or password']});
           }
           resolve(user);
         });
       });
     }else{
       promise = new Promise(function(resolve, reject){
         Usuario.findOneByEmail(email.toLowerCase(), function(err, user) {
           if (!user) {
             return reject({err: ['invalid email or password']});
           }
           resolve(user);
         });
       });
     }
     // sails.log.info(264);
     promise
       .then(function(user){
         // sails.log.info(267, user);
         Usuario.validPassword(password, user, function(err, valid) {
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
             // sails.log.info(285, rta);
             Token.create({
               usuario: user.id
             }).exec(function(err, token){
               // sails.log.error(289,err)
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
   // Estadísticas personas
   stats: function(req, res){
     var
       params = req.allParams()
     ;
     params = params.where || params;
     if(params.blog){
       return Blog
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
             // Cantidad de Inquilinos - Personas arrendadas
             return Usuarioblog
               .count({
                 blog: blog.id,
                 rol: '5974d36182e68f23497d5050'
               })
               .then(function(inquilinos){
                 return {
                   inquilinos: inquilinos
                 };
               })
               .then(function(stats){
                 // Cantidad propietarios - Personas dueñas de inmuebles
                 return Usuarioblog
                   .count({
                     blog: blog.id,
                     rol: '593dd35a5db3543b370b17cf'
                   })
                   .then(function(propietarios){
                     stats.propietarios = propietarios;
                     return stats;
                   })
                   ;
               })
               .then(function(stats){
                 // Cantidad visitantes - Personas que visitan el sitio y se registran
                 return Usuarioblog
                   .count({
                     blog: blog.id,
                     rol: '5929e518af35d79f27da2d04'
                   })
                   .then(function(visitantes){
                     stats.visitantes = visitantes;
                     return stats;
                   })
                   ;
               })
               .then(function(stats){
                 // Cantidad asesores - Personas que son asesores de la inmobiliaria
                 return Usuarioblog
                   .count({
                     blog: blog.id,
                     rol: '5929e551af35d79f27da2d05'
                   })
                   .then(function(asesores){
                     stats.asesores = asesores;
                     return stats;
                   })
                   ;
               })
               .then(function(stats){
                 res.ok(stats);
               }, function(err){
                 res.negotiate(err);
               })
               ;
           }
           res.notFound('blog');
         })
         ;
     }
     res.notFound('params');
   }
 };
