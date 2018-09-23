/**
 * Extra.js
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
    usuario:{
      model: 'usuario'
    },
    usuarioblog:{
      model: 'usuarioblog',
      required: true
    },
    tipo:{
      type: 'string',
      enum:[
        'primarios',
        'secundaria',
        'seminarios',
        'cursosrapido',
        'referencia',
        'tecnico',
        'tecnologo',
        'ingenieria',
        'experiencia',
      ],
      required: true
    },
    fechainicio:{
      type: 'date'
    },
    fechafinal:{
      type: 'date'
    },
    direccion:{
      type: 'string'
    },
    descripcion:{
      type: 'string'
    },
    empleador:{
      type: 'string'
    },
    telefono:{
      type: 'float'
    },
    empresa:{
      type: 'string'
    },
    extracategoria:{
      collection: 'extracategoria',
      via: 'extra'
    }
  },

};
