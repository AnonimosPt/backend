/**
 * Archivogaleria.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    usuarioblog: {
      model: 'usuarioblog'
    },
    archivo: {
      model: 'archivo',
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
    galeria: {
      model: 'galeria',
      required: true
    }
    },
    index: [
    {
      ind: {
        archivo: 1,
        galeria: 1
      },
      ops: {
        unique: true
      }
    }
    ]
};
