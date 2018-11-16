/**
 * ContratoController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
module.exports = {
  print: function(req, res){
    var
      print = require('print-js')
    ;
    console.log("helo");
  },
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
          factura:{
            cantidad: 0,
            total: 0
          },
          recibo:{
            cantidad: 0,
            total: 0
          },
          comprobante:{
            cantidad: 0,
            total: 0
          },
          compra:{
            cantidad: 0,
            total: 0
          },
          // gasto:{
          //   cantidad: 0,
          //   total: 0
          // }
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
            return Contrato
            .find({
              limit: -1,
              where:{
                tipo: 'factura',
                blog: blog.id,
                estado: 'activo'
              }
            })
            .then(function(rta){
              _.forEach(rta, function(item, val){
                if (item.valortotal) {
                  data.factura.total+= item.valortotal;
                }
              })
              ;
              data.factura.cantidad = rta.length+1;
              return data;
            })
            .then(function(reporte){
              return Contrato
              .find({
                limit: -1,
                where:{
                  tipo: 'recibo',
                  blog: blog.id,
                  estado: 'activo'
                }
              })
              .then(function(rta){
                _.forEach(rta, function(item, val){
                  if (item.valortotal) {
                    data.recibo.total+= item.valortotal;
                  }
                })
                ;
                data.recibo.cantidad = rta.length+1;
                return data;
              })
              ;
            })
            .then(function(reporte){
              return Contrato
              .find({
                limit: -1,
                where:{
                  tipo: 'comprobante',
                  blog: blog.id,
                  estado: 'activo'
                }
              })
              .then(function(rta){
                _.forEach(rta, function(item, val){
                  if (item.valortotal) {
                    data.comprobante.total+= item.valortotal;
                  }
                })
                ;
                data.comprobante.cantidad = rta.length+1;
                return data;
              })
              ;
            })
            .then(function(reporte){
              return Contrato
              .find({
                limit: -1,
                where:{
                  tipo: 'compra',
                  blog: blog.id,
                  estado: 'activo'
                }
              })
              .then(function(rta){
                _.forEach(rta, function(item, val){
                  if (item.valortotal) {
                    data.compra.total+= item.valortotal;
                  }
                })
                ;
                data.compra.cantidad = rta.length+1;
                return data;
              })
              ;
            })
            .then(function(reporte){
              return reporte
              // return Contrato
              // .find({
              //   limit: -1,
              //   where:{
              //     tipo: 'gasto',
              //     blog: blog.id,
              //     estado: 'activo'
              //   }
              // })
              // .then(function(rta){
              //   _.forEach(rta, function(item, val){
              //     if (item.valortotal) {
              //       data.gasto.total+= item.valortotal;
              //     }
              //   })
              //   ;
              //   return data;
              // })
              // ;
            })
            ;
          })
          .then(function(reporte){
            res.ok(reporte);
          }, function(err){
            res.negotiate(err);
          })
          ;
    }
  }

};
