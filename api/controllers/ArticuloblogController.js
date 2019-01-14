/**
 * ArticuloblogController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    reportes: function(req, res){
      var
        params = req.allParams()
      ;
      sails.log.info(13, params);
      if (params.where) {
        params.blog = params.where.blog;
        params.fechainit = params.where.fechainit;
        params.fechafin = params.where.fechafin;
      }
    if (params.blog) {
      var
        data = {
          producto: {
            cantidad: 0,
            total: 0,
            full: 0
          },
          materiaprima: {
            cantidad: 0,
            total: 0,
            full: 0
          },
          materiaprocesada: {
            cantidad: 0,
            total: 0,
            full: 0
          },
          servicio: {
            cantidad: 0,
            total: 0,
            full: 0
          }
        },
        fechas = null
      ;
      if (params.fechainit || params.fechafin ) {
        fechas =  {
          '>=': new Date(params.fechainit),
          '<=': new Date(params.fechafin)
        }
        ;
        // sails.log.info(49, fechas, params.fechainit);
      }
      // if (params.fechafin) {
      //   fechas = {
      //     '>=': new Date(),
      //     '<=': new Date(params.fechafin || null)
      //   }
      //   ;
      // }
      // if (params.fechainit && params.fechafin) {
      //   fechas = {
      //     '>=': new Date(params.fechainit),
      //     '<=': new Date(params.fechafin)
      //   }
      //   ;
      // }
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
          var
            query = {
              limit: -1,
              where:{
                tipo: 'producto',
                blog: blog.id,
                estado: 'activo',
                // createdAt: fechas
              }
            }
          ;
          if (fechas) {
            query.where.createdAt = fechas;
          }
          // sails.log.info(96, query, fechas);
          return Articuloblog
          .find(query)
          .then(function(rta){
            // console.log(rta);
            _.forEach(rta, function(item, val){
              if (item.precioventa) {
                data.producto.total+= item.precioventa;
              }
              if (item.cantidadtotal) {
                data.producto.cantidad+= item.cantidadtotal;
              }
            })
            ;
            data.producto.full = rta.length+1;
            return data;
          })
          .then(function(reporte){
            var
              query = {
                limit: -1,
                where:{
                  tipo: 'materiaprima',
                  blog: blog.id,
                  estado: 'activo'
                }
              }
            ;
            if (fechas) {
              query.where.createdAt = fechas;
            }
            return Articuloblog
            .find(query)
            .then(function(rta){
              // console.log(rta);
              _.forEach(rta, function(item, val){
                if (item.precioventa) {
                  data.materiaprima.total+= item.precioventa;
                }
                if (item.cantidadtotal) {
                  data.materiaprima.cantidad+= item.cantidadtotal;
                }
              })
              ;
              data.materiaprima.full = rta.length+1;
              return data;
            });
          })
          .then(function(reporte){
            var
              query = {
                limit: -1,
                where:{
                  tipo: 'materiaprocesada',
                  blog: blog.id,
                  estado: 'activo',
                  createdAt: fechas
                }
              }
            ;
            if (fechas) {
              query.where.createdAt = fechas;
            }
            return Articuloblog
            .find(query)
            .then(function(rta){
              // console.log(rta);
              _.forEach(rta, function(item, val){
                if (item.precioventa) {
                  data.materiaprocesada.total+= item.precioventa;
                }
                if (item.cantidadtotal) {
                  data.materiaprocesada.cantidad+= item.cantidadtotal;
                }
              })
              ;
              data.materiaprocesada.full = rta.length+1;
              return data;
            });
          })
          .then(function(reporte){
            var
              query = {
                limit: -1,
                where:{
                  tipo: 'servicio',
                  blog: blog.id,
                  estado: 'activo',
                  createdAt: fechas
                }
              }
            ;
            if (fechas) {
              query.where.createdAt = fechas;
            }
            return Articuloblog
            .find(query)
            .then(function(rta){
              // console.log(rta);
              _.forEach(rta, function(item, val){
                if (item.precioventa) {
                  data.servicio.total+= item.precioventa;
                }
                if (item.cantidadtotal) {
                  data.servicio.cantidad+= item.cantidadtotal;
                }
              })
              ;
              data.servicio.full = rta.length+1;
              return data;
            });
          })
          .then(function(reporte){
            // console.log(reporte);
            res.ok(reporte);
          }, function(err){
            res.negotiate(err);
          })
        })
        ;
    }
  }

};
