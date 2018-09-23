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
      model: 'usuario',
      required: true
    }
  },

  beforeValidate: function(values, cb) {
    if (!values.usuario) {
      return cb('invalid user');
    }

    values.token = sailsTokenAuth.issueToken({
      sid: values.usuario
    });

    cb();
  }

};
