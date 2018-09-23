/**
 * Contenidoarticulo.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    Contenido:{
      model: 'Contenido',
      required: true
    },
    creador:{
      model: 'usuarioblog'
    },
    articulo:{
      model: 'articulo',
      required: true
    },
    tipounidad:{
      type: 'string'
    },
    unidad:{
      type: 'string'
    },
    tipo:{
      type: 'string',
      enum:[
        'producto',
        'materiaprima',
        'materiaprocesada',
        'servicio',
      ],
      defaultsTo: 'producto',
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
    articuloblog:{
      model: 'articuloblog',
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
