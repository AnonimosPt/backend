/**
 * Comentario.js
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
    descripcion:{
      type: 'string'
    },
    creador:{
      model: 'usuarioblog'
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
    valor:{
      type: 'string'
    },
    usuario:{
      model: 'usuario'
    },
    usuarioblog:{
      model: 'usuarioblog'
    },
    tipo:{
      type: 'string',
      enum:[
        'articulo'
      ],
      defaultsTo: 'articulo'
    },
    blog:{
      model: 'blog',
      required: true
    },
    blogapi:{
      model: 'blog',
      required: true
    },
    articulo:{
      model: 'articulo'
    },
    articuloblog:{
      model: 'articuloblog'
    }
  },

};
