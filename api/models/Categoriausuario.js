/**
 * Categoriausuario.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    categoria:{
      model: 'categoria',
      required: true
    },
    blog:{
      model: 'blog',
      required: true
    },
    apiblog:{
      model: 'blog',
      required: true
    },
    usuario:{
      model: 'usuario'
    },
    usuarioblog:{
      model: 'usuarioblog',
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
    creador:{
      model: 'usuarioblog'
    },

  },

};
