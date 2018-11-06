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
    url:{
      type: 'string',
      required: true
    },
    urlprint:{
      type: 'string',
      required: true
    },
    icon:{
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
    type: {
      type: 'string',
      required: true
    },
    size: {
      type: 'json',
    },
    blog: {
      model: 'blog',
      required: true
    },
    tipo: {
      type: 'string',
      enum: [
        'archivo',
        'factura',
        'contrato',
        'documento'
      ],
      defaultsTo: 'archivo'
    },
    opcion: {
      type: 'string',
      enum: [
        'perfil',
        'logo',
        'galeria'
      ],
      defaultsTo: 'logo'
    },
    usuario: {
      model: 'usuarioblog',
      required: true
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
