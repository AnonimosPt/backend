/**
 * Contratopago.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    pago: {
      model: 'pago',
      required: true
    },
    valor: {
      type: 'float',
      defaultsTo: 0
    },
    valortotal: {
      type: 'float',
      defaultsTo: 0
    },
    total: {
      type: 'float',
      defaultsTo: 0
    },
    totalbruto: {
      type: 'float',
      defaultsTo: 0
    },
    vueltos: {
      type: 'float',
      defaultsTo: 0
    },
    vueltostotal: {
      type: 'float',
      defaultsTo: 0
    },
    contrato:{
      model: 'contrato',
      required: true
    },
    creador:{
      model: 'usuarioblog'
    },
    estado: {
      type: 'string',
      enum:[
        'activo',
        'inactivo',
        'borrado',
      ],
      defaultsTo: 'activo',
    },
    blog:{
      model: 'blog',
      required: true
    },
    blogapi:{
      model: 'blog',
      required: true
    }
  },

};
