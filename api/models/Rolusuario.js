/**
 * Rolusuario.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    rol:{
      model: 'rol',
      required: true
    },
    usuario:{
      model: 'usuario',
      required: true
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
      model: 'usuarioblog',
      required: true
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
