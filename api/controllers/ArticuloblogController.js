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
      if (params.where) {
        params.blog = params.where.blog;
      }
    if (params.blog) {
      var
        data = {
          producto: {
            cantidad: 0,
            total: 0
          },
          materiaprima: {
            cantidad: 0,
            total: 0
          },
          materiaprocesada: {
            cantidad: 0,
            total: 0
          },
          servicio: {
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
          return Articuloblog
          .find({
            limit: -1,
            where:{
              tipo: 'producto',
              blog: blog.id,
              estado: 'activo'
            }
          })
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
            return data;
          })
          .then(function(reporte){
            return Articuloblog
            .find({
              limit: -1,
              where:{
                tipo: 'materiaprima',
                blog: blog.id,
                estado: 'activo'
              }
            })
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
              return data;
            });
          })
          .then(function(reporte){
            return Articuloblog
            .find({
              limit: -1,
              where:{
                tipo: 'materiaprocesada',
                blog: blog.id,
                estado: 'activo'
              }
            })
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
              return data;
            });
          })
          .then(function(reporte){
            return Articuloblog
            .find({
              limit: -1,
              where:{
                tipo: 'servicio',
                blog: blog.id,
                estado: 'activo'
              }
            })
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
