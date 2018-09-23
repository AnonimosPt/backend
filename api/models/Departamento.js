/**
 * Departamento.js
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
    pais:{
      model: 'pais',
      required: true
    },
    descripcion:{
      type: 'string'
    },
    ciudad:{
      collection: 'ciudades'
    }
  },

};
