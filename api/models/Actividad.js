/**
 * Actividad.js
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
      type: 'string',
      required: true
    },
    creador:{
      model: 'usuarioblog',
      required: true
    },
    usuario:{
      collection: 'actividadusuario',
      via: 'actividad'
    },
    articulos:{
      collection: 'actividadarticulo',
      via: 'actividad'
    },
    blog:{
      model: 'blog',
      required: true
    },
    blogapi:{
      model: 'blog'
    },
    descripcion:{
      type: 'string'
    },
    cantidad:{
      type: 'float',
      defaultsTo: 0
    },
    costototal:{
      type: 'float',
      defaultsTo: 0
    },
    costoinsumos:{
      type: 'float',
      defaultsTo: 0
    },
    costomanual:{
      type: 'float',
      defaultsTo: 0
    },
    valor:{
      type: 'float',
      defaultsTo: 0
    },
    fechainicia:{
      type: 'datetime'
    },
    fechafinal:{
      type: 'datetime'
    },
    finalizo:{
      type: 'boolean',
      defaultsTo: false
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
    tipoingrediente:{
      type: 'string',
      enum: [
        'producto',
        'materiaprocesada'
      ],
      defaultsTo: 'producto'
    },
    tipo:{
      type: 'string',
      enum: [
        'actividad',
        'evento',
        'ingrediente',
        'noticia'
      ],
      defaultsTo: 'actividad'
    }
  },

};
