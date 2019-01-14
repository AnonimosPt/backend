/**
 * Contrato.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    numero: {
      type: 'string',
      required: true
    },
    referencia:{
      type: 'string',
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
    estadocontrato:{
      type: 'string',
      enum:[
        'pagado',
        'guardada'
      ],
      defaultsTo: 'guardada',
    },
    blog:{
      model: 'blog',
      required: true
    },
    blogapi:{
      model: 'blog',
      required: true
    },
    descripcion:{
      type: 'string'
    },
    iva:{
      type: 'float',
      defaultsTo: 0
    },
    valor:{
      type: 'float',
      defaultsTo: 0
    },
    valortotal:{
      type: 'float',
      defaultsTo: 0
    },
    tipo:{
      type: 'string',
      enum:[
        'factura',
        'recibo',
        'cotizacion',
        'comprobante',
        'compra',
        'gasto'
      ],
      defaultsTo: 'factura'
    },
    descripcion:{
      type: 'string'
    },
    cajero:{
      model: 'usuario'
    },
    vendedor:{
      model: 'usuario'
    },
    cliente:{
      model: 'usuario'
    },
    contratopago:{
      collection: 'contratopago',
      via: 'contrato'
    },
    contrartoarticulo:{
      collection: 'contratoarticulo',
      via: 'contrato'
    },
    contratousuario:{
      collection: 'contratousuario',
      via: 'contrato'
    },
    direccion:{
      model: 'ciudadbarrio'
    }
  },

};
