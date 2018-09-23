/**
 * Barrio.js
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
    ciudad:{
      model: 'ciudades'
    },
    descripcion:{
      type: 'string'
    },
    usuario:{
      collection: 'usuario'
    },
    usuarioblog:{
      collection: 'usuarioblog'
    },
  },

};
