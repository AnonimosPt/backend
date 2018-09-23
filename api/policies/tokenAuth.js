/**
 * tokenAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated token
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
module.exports = function(req, res, next) {
  var token;
  //sails.log.info(req.headers)

  if (req.headers && req.headers.authorization) {
    var parts = req.headers.authorization.split(' ');
    if (parts.length === 2) {
      var
        scheme = parts[0],
        credentials = parts[1];

      if (/^Bearer$/i.test(scheme)) {
        token = credentials;
      }
    } else {
      return res.json(401, {
        err: ['Format is Authorization: Bearer [token]']
      });
    }
  } else if (req.param('token')) {
    token = req.param('token');
    // We delete the token from param to not mess with blueprints
    delete req.query.token;
  } else {
    return res.json(401, {
      err: ['No Authorization header was found']
    });
  }

  sailsTokenAuth
    .verifyToken(token, function(err, token) {
      if (err) {
        return res.json(401, {
          err: ['The token is not valid']
        });
      }
      Usuario
        .findOne({
          populate: '',
          where: {
            id: token.sid
          }
        })
        .then(function(user) {
          //sails.log(token, user);
          req.token = null;
          if (user && user.id) {
            req.token = token;
            req.user = user;
            next();
          } else {
            return res.json(401, {
              err: ['not valid user']
            });
          }
        });
    });
};
