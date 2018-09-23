module.exports = function optionsHook(sails) {
  return {
    initialize: function(cb) {
      hook = this;

      //hook.models = sails.models;

      return cb();
    },
    routes: {
      before: {
        'OPTIONS /:modelname/attributes': function(req, res, next) {
          var
            params = req.allParams(),
            modelname = params[0] || params.modelname,
            Model = sails.models[modelname],
            attrs = {},
            attrsBanned = ['blog'];
          // Error al subir archivos corregir y activar options para todos los modelos

          /*sails.log.info(params)
          sails.log.info(Model.attributes)*/
          //sails.log.info(params[0])
          //sails.log('hook options index.js:20\n',!!Model, params)
          try {
            attrs = _.merge({}, Model.attributes);

            _.forEach(attrs, function(val, key) {
              if (attrsBanned.indexOf(key) > -1) {
                delete attrs[key];
              }
            });

            res.ok(attrs);
          } catch (err) {
            sails.log.error(err)
            res.notFound();
          }
        }
      }
    }
  };
};
