/**
 * Actividadarticulo.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    articulo: {
      model: 'articulo',
      required: true
    },
    articuloblog: {
      model: 'articuloblog',
      required: true
    },
    actividad:{
      model: 'actividad',
      required: true
    },
    descripcion:{
      type: 'string'
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
    creador:{
      model: 'usuarioblog',
      required: true
    },
    blog:{
      model: 'blog',
      required: true
    },
    blogapi:{
      model: 'blog'
    },
    preciocompra:{
      type: 'float',
      defaultsTo: 0
    },
    cantidad:{
      type: 'float',
      defaultsTo: 0
    },
    tipounidad:{
      type: 'string'
    },
    unidad:{
      type: 'string'
    }

  },

};
