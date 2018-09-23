/**
 * Articulogaleria.js
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
    articuloblog:{
      model: 'articuloblog'
    },
    galeria: {
      model: 'galeria',
      required: true
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
    usuario: {
      model: 'usuario',
      required: true
    },
    usuarioblog:{
      model: 'usuarioblog',
      required: true
    }

  },

};
