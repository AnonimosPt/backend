/**
 * Estado.js
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
      type: 'string'
    },
    creador:{
      model: 'usuarioblog'
    },
    descripcion:{
      type: 'string'
    },
    blog:{
      model: 'blog'
    },
    blogapi:{
      model: 'blog'
    },
    valor:{
      type: 'string'
    }
  },

};
