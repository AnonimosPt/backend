/**
 * UsuariorolController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  reportes: function(req, res){
    var
      params = req.allParams()
    ;
    if (params.where) {
      params.blog = params.where.blog;
    }
  if (params.blog) {
    var
      data = {
        usuario: {
          cantidad: 0,
          total: 0
        },
        vendedor:{
          cantidad: 0,
          total: 0
        },
        empleado: {
          cantidad: 0,
          total: 0
        },
        cliente: {
          cantidad: 0,
          total: 0
        },
        proveedor: {
          cantidad: 0,
          total: 0
        },
        prospecto: {
          cantidad: 0,
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
        return Usuariorol
        .find({
          rol: '5b8c59812093fe35a832e9ee', //usuario
          estado: 'activo'
        })
        .then(function(user){
          var suma = 0;
          _.forEach(user, function(item, val){
            if (val === 0) {
              suma+=val+1;
            }
            suma+=val;
            data.usuario.cantidad = suma;
          })
          ;
          return data;
        })
        .then(function(reporte){
          return Usuariorol
          .find({
            rol: '5b8c71d58e952829481aeaaf', //cliente,
            estado: 'activo'
          })
          .then(function(user){
            var suma = 0;
            _.forEach(user, function(item, val){
              if (val === 0) {
                suma+=val+1;
              }
              suma+=val;
              data.cliente.cantidad = suma;
            })
            ;
          })
          ;
          return data;
        })
        .then(function(reporte){
          return Usuariorol
          .find({
            rol: '5b8c71e28e952829481aeab0', //vendedor,
            estado: 'activo'
          })
          .then(function(user){
            var suma = 0;
            _.forEach(user, function(item, val){
              if (val === 0) {
                suma+=val+1;
              }
              suma+=val;
              data.vendedor.cantidad = suma;
            })
            ;
            return data;
          })
          ;
          return data;
        })
        .then(function(reporte){
          return Usuariorol
          .find({
            rol: '5b8c71e28e952829481aeab0', //vendedor,
            estado: 'activo'
          })
          .then(function(user){
            var suma = 0;
            _.forEach(user, function(item, val){
              if (val === 0) {
                suma+=val+1;
              }
              suma+=val;
              data.vendedor.cantidad = suma;
            })
            ;
            return data;
          })
          ;
          return data;
        })
        .then(function(reporte){
          return Usuariorol
          .find({
            rol: '5b933c086f141a328c72bfc8', //empleado,
            estado: 'activo'
          })
          .then(function(user){
            var suma = 0;
            _.forEach(user, function(item, val){
              if (val === 0) {
                suma+=val+1;
              }
              suma+=val;
              data.empleado.cantidad = suma;
            })
            ;
            return data;
          })
          ;
          return data;
        })
        .then(function(reporte){
          return Usuariorol
          .find({
            rol: '5b9a8e08382e511f4834686a', //prospecto,
            estado: 'activo'
          })
          .then(function(user){
            var suma = 0;
            _.forEach(user, function(item, val){
              if (val === 0) {
                suma+=val+1;
              }
              suma+=val;
              data.prospecto.cantidad = suma;
            })
            ;
            return data;
          })
          ;
          return data;
        })
        .then(function(reporte){
          return Usuariorol
          .find({
            rol: '5b9b24e3382e511f48346880', //proveedor,
            estado: 'activo'
          })
          .then(function(user){
            var suma = 0;
            _.forEach(user, function(item, val){
              if (val === 0) {
                suma+=val+1;
              }
              suma+=val;
              data.proveedor.cantidad = suma;
            })
            ;
            return data;
          })
          ;
          return data;
        })
        ;
        return data;
      })
      .then(function(reporte){
        console.log(reporte);
        res.ok(reporte);
      }, function(err){
        res.negotiate(err);
      })
      ;
    }
  }
};
