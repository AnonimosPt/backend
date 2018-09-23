/**
 * Articuloprecio.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    articulo:{
      model: 'articulo'
    },
    articuloblog:{
      model: 'articuloblog'
    },
    contrato:{
      model: 'contrato'
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
    titulo:{
      type: 'string',
      required: true
    },
    slug:{
      type: 'string',
      required: true
    },
    moneda:{
      type: 'string',
      enum:[
        'cop',
        'usd'
      ],
      defaultsTo: 'cop'
    },
    tipo:{
      type: 'string',
      enum:[
        'compra',
        'venta'
      ],
      defaultsTo: 'cop'
    },
    valor:{
      type: 'float',
      required: true,
    },
    vueltos:{
      type: 'float',
      defaultsTo: 0
    }
  },

};
