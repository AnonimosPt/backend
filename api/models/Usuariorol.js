/**
 * Usuariorol.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    usuario:{
      model: 'usuario'
    },
    usuarioblog:{
      model: 'usuarioblog',
      required: true
    },
    slugnombre:{
      type: 'string',
      required: true
    },
    slugapellido:{
      type: 'string',
      required: true
    },
    documento:{
      type: 'string',
      required: true
    },
    blog: {
      model: 'blog'
    },
    creador:{
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
    rol:{
      model: 'rol',
      required: true
    }
  },

};
