/**
 * Articuloblog.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    articulo: {
      model: 'articulo',
      required: true
    },
    blog:{
      model: 'blog',
      required: true
    },
    blogapi:{
      model: 'blog',
      required: true
    },
    creador:{
      model: 'usuarioblog',
      required: true
    },
    ubicacion:{
      model: 'ubicacion'
    },
    receta:{
      model: 'actividad'
    },
    titulo: {
      type: 'string'
    },
    slug:{
      type: 'string'
    },
    tipounidad:{
      type: 'string',
      defaultsTo: 'tipounidad'
    },
    unidad:{
      type: 'string',
      defaultsTo: 'unidad'
    },
    cantidadtotal:{
      type: 'float',
      defaultsTo: 0
    },
    cantidadstock:{
      type: 'float',
      defaultsTo: 0
    },
    descripcion:{
      type: 'string'
    },
    codigo:{
      type: 'string',
      required: true,
      unique: true
    },
    preciocompra:{
      type: 'float',
      defaultsTo: 0
    },
    precioventa:{
      type: 'float',
      defaultsTo: 0
    },
    precioss:{
      collection: 'articuloprecio'
    },
    categoria:{
      collection: 'categoria'
    },
    contenido:{
      collection: 'contenido'
    },
    comentario:{
      collection: 'comentario'
    },
    contrato:{
      collection: 'contrato'
    },
    usuario:{
      collection: 'usuarioblog'
    },
    galeria:{
      collection: 'galeria',
      via: 'articuloblog'
    },
    foto:{
      type: 'string',
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
      defaultsTo: 'inactivo',
    },
    fechavencimiento:{
      type: 'datetime'
    },
    iva:{
      type: 'float',
      defaultsTo: 0
    },
    ciudad:{
      model: 'ciudades'
    },
    barrio:{
      model: 'barrio'
    },
    megusta:{
      type: 'float',
      defaultsTo: 0
    },
    nomegusta:{
      type: 'float',
      defaultsTo: 0
    },
    vistas:{
      type: 'float',
      defaultsTo: 0
    }
  },

};
