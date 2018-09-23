/**
 * Log.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    titulo:{
      type: 'string',
      required: true
    },
    slug:{
      type: 'string',
      required: true
    },
    antes:{
      type: 'json'
    },
    despues:{
      type: 'json'
    },
    idantes: {
      type: 'string'
    },
    iddespues:{
      type: 'string'
    },
    blog:{
      model: 'blog'
    },
    blogapi:{
      model: 'blog'
    },
    opciono:{
      model: 'usuario',
      required: true
    },
    creador:{
      model: 'usuarioblog',
      required: true
    },
    modelo:{
      type: 'string',
      required: true
    },
    opcion:{
      type: 'string',
      required: true
    }
  },

};
