/**
 * Token.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    // Token usado por el Usuario
    token: {
      type: 'text',
      required: true,
      unique: true
    },
    // Usuario dueño del Token
    usuario: {
      model: 'usuario'
    },
    usuarioblog:{
      model: 'usuarioblog'
    },
    // Si el Token es para pagos
    pago: {
      type: 'boolean',
      defaultsTo: false
    },
    // Customer ID
    customer: {
      type: 'string'
    },
    // Nombre de la franquicia de la tarjeta
    nombre: {
      type: 'string'
    },
    // Número de la tarjeta
    numero: {
      type: 'string'
    },
    // Fecha de creada de la tarjeta
    fecha: {
      type: 'string'
    },
    // Fecha de expiración de la tarjeta
    fechaexpira: {
      type: 'string'
    }
  },

  beforeValidate: function (values, cb){
    if(!values.usuario){
      return cb('invalid user');
    }
    if(!values.token){
      values.token = sailsTokenAuth.issueToken({
        sid: values.usuario
      });
    }

    cb();
  }

};
