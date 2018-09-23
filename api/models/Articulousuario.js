/**
 * Articulousuario.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    articulo:{
      model: 'articulo'
    },
    articuloblog:{
      model: 'articuloblog'
    },
    creador:{
      model: 'usuarioblog'
    },
    usuario:{
      model: 'usuario'
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
    usuarioblog:{
      model: 'usuarioblog'
    },
    blog:{
      model: 'blog'
    },
    descripcion:{
      type: 'string'
    }
  },

};
