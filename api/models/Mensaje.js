/**
 * Mensaje.js
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
    creador:{
      model: 'usuarioblog',
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
    emisor:{
      model: 'usuario',
      required: true
    },
    reseptor:{
      model: 'usuario'
    },
    categoria:{
      model: 'categoria'
    },
    descripcion:{
      type: 'string'
    },
    tipo:{
      type: 'string',
      enum:[
        'mensaje'
      ],
      defaultsTo: 'mensaje'
    },
    blog:{
      model: 'blog'
    },
    blogapi:{
      model: 'blog'
    }
  },

};
