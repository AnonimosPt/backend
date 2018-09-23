/**
 * Categoria.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    titulo: {
      type: 'string',
      required: true
    },
    slug:{
      type: 'string',
      required: true
    },
    categoriaDe:{
      type: 'string',
      enum:[
        'menu',
        'cargo',
        'producto',
        'funciones',
        'materiaprima'
      ],
      defaultsTo: 'producto'
    },
    valor:{
      type: 'string'
    },
    blogs:{
      collection: 'categoriablog'
    },
    categoria:{
      model: 'categoria'
    },
    codigo:{
      type: 'string'
    },
    descripcion:{
      type: 'string'
    }
  },

};
