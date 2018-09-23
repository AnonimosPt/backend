/**
 * Articulo.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
      blog:{
        model: 'blog',
        required: true
      },
      blogapi:{
        model: 'blog'
      },
      creador:{
        model: 'usuarioblog',
        required: true
      },
      titulo: {
        type: 'string',
        required: true
      },
      slug:{
        type: 'string',
        required: true
      },
      receta:{
        model: 'actividad'
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
        collection: 'galeria'
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
          'inactivo'
        ],
        defaultsTo: 'inactivo',
      },
      fechavencimiento:{
        type: 'string',
        columnType: 'datetime'
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
    }

};
