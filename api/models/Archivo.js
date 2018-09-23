/**
 * Archivo.js
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
    filename: {
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
    fd: {
      type: 'string',
      required: true,
      unique: true
    },
    fdthumbnail: {
      type: 'string',
      required: true,
      unique: true
    },
    type: {
      type: 'string',
      required: true
    },
    size: {
      type: 'integer',
      required: true
    },
    blog: {
      model: 'blog',
      required: true
    },
    blogapi: {
      model: 'blog'
    },
    tipo: {
      type: 'string',
      enum: [
        'archivo',
        'pago-recibido',
        'factura',
        'contrato',
        'documento'
      ],
      defaultsTo: 'archivo'
    },
    archivopago: {
      model: 'archivo'
    },
    pago: {
      type: 'boolean',
      defaultsTo: false,
    },
    usuario: {
      model: 'usuarioblog',
      required: true
    },
    estado: {
      model: 'estado'
    },
    galerias: {
      collection: 'archivogaleria',
    },
    articulos: {
      collection: 'articulo',
    },
    articuloblog: {
      collection: 'articuloblog',
    },
    contrato: {
      model: 'contrato'
    },
  },

};
