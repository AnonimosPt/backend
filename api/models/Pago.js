/**
 * Pago.js
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
    estado: {
      type: 'string',
      enum:[
        'activo',
        'inactivo',
        'borrado',
      ],
      defaultsTo: 'activo',
    },
    tipo:{
      type: 'string',
      enum:[
        'efectivo',
        'tarjeta',
        'bono'
      ],
      defaultsTo: 'efectivo'
    },
    pago:{
      model: 'pago'
    },
    pais:{
      model: 'pais'
    },
    tipos:{
      collection: 'pago',
      via: 'pago'
    },
    descripcion:{
      type: 'string'
    }
  }

};
