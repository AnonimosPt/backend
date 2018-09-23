/**
 * Extracategoria.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    extra:{
      model: 'extra',
      required: true
    },
    categoria:{
      model: 'categoria',
      required: true
    },
    tipo:{
      type: 'string',
      required: true
    }
  },

};
