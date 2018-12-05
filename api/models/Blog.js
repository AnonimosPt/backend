/**
 * Blog.js
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
    iniciales:{
      type: 'string'
    },
    slug:{
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
    url:{
      type: 'string',
      required: true
    },
    galeria:{
      collection: 'galeria',
      via: 'blog'
    },
    host:{
      type: 'string',
      required: true
    },
    blogs:{
      model: 'blog'
    },
    pais:{
      model: 'pais'
    },
    barrio:{
      model: 'barrio'
    },
    ciudad:{
      model: 'ciudades'
    },
    opcion:{
      type: 'string',
      enum: [
        'gratis',
        'arrendado',
        'pago'
      ],
      defaultsTo: 'gratis'
    },
    departamento:{
      model: 'departamento'
    },
    api:{
      type: 'boolean',
      default: false
    },
    ofrece: {
      type: 'string',
      enum: [
        'productos',
        'servicios',
      ],
      defaultsTo: 'producto'
    },
    tipo: {
      type: 'string',
      enum: [
        'sucursal',
        'bodega',
        'principal',
        'administrativo',
      ],
      defaultsTo: 'principal'
    },
    tipocontribuyente:{
      type: 'string',
      enum: [
        'regimen-simplificado',
        'regimencomun',
        'contribuyentes',
      ],
      defaultsTo: 'regimencomun'
    },
    identificacion:{
      type: 'string'
    },
    cierrecontable:{
      type: 'datetime'
    },
    actividadeconomica:{
      type: 'string',
      enum: [
        'empresa-general',
      ],
      defaultsTo: 'empresa-general'
    },
    direccion: {
      type: 'string'
    },
    telefono:{
      type: 'string'
    },
    email:{
      type: 'string'
    }
  },

};
