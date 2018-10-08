/**
 * Created by hender on 9/07/17.
 */

module.exports = (function() {
  var
    Promise = Promise || require('bluebird'),
    mailjet = require('node-mailjet').connect(
      sails.config.mailjet.apiKey,
      sails.config.mailjet.secretKey
    );

  return {
    send: sendMail,
    sendSms: sendSms,
    active: activeEmail,
    //inactive: inactiveEmail,
    receive: receiveMail,

    getSender: getSender,
    getParseroute: getParseroute
  };

  /*function inactiveEmail(){
    return
  }*/

  /**
   * @name sendSms
   * @description Envía un SMS.
   *              1SMS  70 Character
   *              2SMS  134 Character
   *              3SMS  201 Character
   *              4SMS  268 Character
   *              5SMS  335 Character
   *
   * @param from    De quien es el mensaje
   * @param to      Para quien es el mensaje. Debe tener el código del país de acuerdo a E.164
   * @param text    Mensaje a enviar
   * @param country Abreviación del país
   * @return {Promise}
   */
  function sendSms(from, to, text, country) {
    var
      codeCountry = getCodeCountry(country || 'col'),
      postData = JSON.stringify({
        "From": from,
        "To": codeCountry + params.destino,
        "Text": params.msg
      }),
      opts = {
        hostname: 'https://api.mailjet.com/v4/sms-send',
        //port: 443,
        //path: '/post.php',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
          'Authorization': config.mailjet.smsKey
        }
      };

    return new Promise(function(resolve, reject) {
      var request = https
        .request(opts, function(response) {
          var data = '';
          response
            .on('data', function(chunk) {
              data += chunk;
            })
            .on('error', function(err) {
              reject(err);
            })
            .on('end', function() {
              data = JSON.parse(data);
              resolve(data);
            });
        });
      request.on('error', function(err) {
        reject(err);
      });
      request.write(postData);
      request.end();
    });

    /**
     * @name getCodeCountry
     * @description Revisar la codificación en "https://en.wikipedia.org/wiki/List_of_country_calling_codes"
     *
     * @param country   String del país
     * @return {string|null}
     */
    function getCodeCountry(country) {
      var code = (_.isString(country) && Tools.getSlug(country)) || null;
      switch (country) {
        case 'co':
          code = '+57';
      }
      return code;
    }
  }

  function activeEmail(params) {
    var
      email = params.email,
      blog = params.dominio || params.blog;
    if (!email || !blog) {
      return Promise.reject('not found email');
    }
    return getBlog(blog)
      .then(function(blg) {
        var domain = _.trim(email.split('@')[1]);
        sails.log.info('Mailjet:118\n', domain, blg.dominio)
        if (blg.dominio && domain === blg.dominio) {
          return Usuarioblog
            .findOne({
              email: email
            })
            .then(function(usr) {
              if (usr && usr.id) {
                return usr;
              }
              return Promise.reject('not found user');
            })
            .then(function(usr) {
              // Check if Sender registered
              return getSender(usr);
            })
            .then(function(usr) {
              // Buscar si ya tiene la ruta agregada
              return getParseroute(usr, blg);
            });
        }
        return Promise.reject('bad email domain');
      });
  }

  function sendMail(params) {
    params.tipoemail = params.tipoemail || 'enviado';
    return new Promise(function(resolve, reject) {
      return getBlog(params.blog)
        .then(function(blog) {
          var promise = null;
          if (params.id) {
            promise = Email
              .findOne(params.id)
              .then(function(_data) {
                var data = getDataEmail(params);
                data.id = _data.id;
                return data;
              });
          } else {
            promise = new Promise(function(resolve, reject) {
              var data = getDataEmail(params);
              if (_.isEmpty(data.remitente) || _.isEmpty(data.asunto) || (_.isEmpty(data.destino) && _.isEmpty(data.cc) && _.isEmpty(data.bcc))) {
                reject('bad params');
              }
              resolve(data);
            });
          }

          promise
            .then(function(data) {
              if (validateEmail(data.remitente) && (!_.isEmpty(data.cc) || !_.isEmpty(data.bcc) || !_.isEmpty(data.destino))) {
                return data;
              }
              return Promise.reject((_.isEmpty(data.cc) || _.isEmpty(data.bcc) || _.isEmpty(data.destino)) ? 'bad "to" emails' : 'bad "from" email');
            })
            .then(function(data) {
              return Usuarioblog
                .findOne({
                  where: {
                    email: data.remitente
                  }
                })
                .then(function(usr) {
                  if (usr && usr.id) {
                    return usr;
                  }
                  return Promise.reject('bad user ' + data.remitente);
                })
                .then(function(usr) {
                  var promise1 = null;
                  data.blog = data.blog || blog.id;
                  if (data.id) {
                    promise1 = Promise.resolve(data);
                  } else {
                    promise1 = Email
                      .create(data)
                      .then(function(email) {
                        if (email && email.id) {
                          Email.publishCreate(email);
                          return email;
                        }
                        return Promise.reject('bad created email');
                      });
                  }
                  return promise1
                    .then(function(email) {
                      var
                        promise2 = null,
                        created = false;
                      if (params.euid) {
                        promise2 = Emailusuario.findOne(params.euid);
                      } else if (params.id) {
                        promise2 = Emailusuario
                          .findOne({
                            tipo: 'borrador',
                            email: email.id,
                            usuario: usr.id
                          })
                          .then(function(eu) {
                            if (eu && eu.id) {
                              if (params.tipoemail) {
                                // Actualiza el tipo de email usuario porque es borrador y pasa a enviado
                                return Emailusuario
                                  .update(eu.id, {
                                    tipo: params.tipoemail,
                                    fecha: new Date()
                                  })
                                  .then(function() {
                                    eu.tipo = params.tipoemail;
                                    return eu;
                                  });
                              }
                              params.tipoemail = eu.tipo;
                              return eu;
                            }
                            return Promise.reject('not found email usuario');
                          });
                      } else {
                        created = true;
                        promise2 = Emailusuario
                          .create({
                            blog: email.blog.id || email.blog,
                            tipo: params.tipoemail,
                            email: email.id,
                            usuario: usr.id,
                            text: 'desde: ' + email.desde + '|destino: ' + (_.isArray(email.destino) ? email.destino.join(', ') : email.destino) + '|asunto:' + email.asunto + '|contenido-html:' + email.content.html + '|contenido-text:' + email.content.text
                          });
                      }
                      return promise2
                        .then(function(eu) {
                          if (eu && eu.id) {
                            eu.email = email;
                            if (created) {
                              Emailusuario.publishCreate(eu);
                            }
                            return eu;
                          }
                          // Si no crea la relación entonces borrar el email
                          return Email
                            .destroy({
                              id: email.id
                            })
                            .then(function() {
                              return Promise.reject('bad created email usuario');
                            });
                        })
                        .then(function(eu) {
                          if (eu.tipo === 'enviado') {
                            var
                              from = email.desde.split('<'),
                              quest = {
                              "FromName": from[0],
                              "FromEmail": from[1].replace('>',''),
                              "Subject": email.asunto,
                              "Text-part": email.content.text,
                              "Html-part": email.content.html,
                              "To": _.map(email.destino, function(item){
                                return item.Name + '<' + item.Email + '>'
                              }).join(', ')
                            };
                            if(email.cc){
                              quest.CC = _.map(email.cc, function(item){
                                return item.Name + '<' + item.Email + '>'
                              }).join(', ');
                            }
                            if(email.bcc){
                              quest.BCC = _.map(email.bcc, function(item){
                                return item.Name + '<' + item.Email + '>'
                              }).join(', ');
                            }
                            /*sails.log.info('\n======== EMAIL =======\n')
                            sails.log.info(email)
                            sails.log.info('\n======= QUEST ========\n')
                            sails.log.info(quest)
                            sails.log.info('\n===============\n')*/
                            return mailjet
                              .post("send")
                              .request(quest)
                              .then(function(rta) {
                                /*sails.log.info('\n========== RTA ========\n')
                                sails.log.info(rta.body.Sent)
                                sails.log.info('\n========== RTA ========\n')*/
                                var
                                  promises = []
                                ;
                                _.forEach(rta.body.Sent, function(sent) {
                                  promises.push(
                                    Usuario
                                    .findOne({
                                      email: sent.Email
                                    })
                                    .then(function(usr) {
                                      if (usr && usr.id) {
                                        // Existe el Usuario y agrega el email enviado
                                        return Emailusuario
                                          .create({
                                            blog: email.blog.id || email.blog,
                                            tipo: 'recibido',
                                            email: email.id,
                                            usuario: usr.id,
                                            messageid: sent.MessageID,
                                            text: 'desde: ' + email.desde + '|destino: ' + (_.isArray(email.destino)?(_.isString(email.destino[0])? email.destino.join(', '):_.map(email.destino, function(item){return item.Name + '<' + item.Email + '>' })) : email.destino) + '|asunto:' + email.asunto + '|contenido-html:' + email.content.html + '|contenido-text:' + email.content.text
                                          })
                                        ;
                                      }
                                      // No existe el usuario
                                      return null;
                                    })
                                  );
                                });
                                return Promise
                                  .all(promises)
                                  .then(function(list) {
                                    if (rta.response.status === 200) {
                                      return resolve(list);
                                    }
                                    reject(rta);
                                  });
                              }, function(err) {
                                sails.log.error('365 - ', err);
                                //reject(err);
                                return Emailusuario
                                  .destroy({
                                    id: eu.id
                                  })
                                  .then(function() {
                                    return Email
                                      .destroy({
                                        id: email.id
                                      })
                                      .then(function() {
                                        reject(err);
                                      })
                                    ;
                                  })
                                ;
                              });
                          }
                          resolve(eu);
                        });
                    }, reject);
                });
            })
            .then(resolve, reject);
        });
    });
  }

  function getDataEmail(params) {
    // contenidotexto contenttexto text contenido.text content.text
    // contenidohtml contenthtml html contenido.html content.html

    if (!params.contenidotexto && !params.contenidohtml && !params.contenttexto && !params.contenthtml && !params.text && !params.html && (params.contenido && !params.contenido.text && !params.contenido.html) && (params.content && !params.content.text && !params.content.html)) {
      return reject('bad "contenido" email');
    } else if (params.text && params.html) {
      params.contenidotexto = params.text;
      params.contenidohtml = params.html;
    } else if (params.contenido && params.contenido.text && params.contenido.html) {
      params.contenidotexto = params.contenido.text;
      params.contenidohtml = params.contenido.html;
    } else if (params.content && params.content.text && params.content.html) {
      params.contenidotexto = params.content.text;
      params.contenidohtml = params.content.html;
    }

    if (!params.asunto && !params.subject) {
      return reject('bad "asunto" email');
    } else if (params.subject) {
      params.asunto = params.subject;
    }

    params.deemail = params.deemail || (params.de && params.de.email) || (params.from && params.from.email);
    if (!params.deemail) {
      return reject('bad "from" email');
    }

    if (!params.para && !params.recipients && !params.cc && !params.cco && !params.bcc) {
      return reject('bad "to" email');
    } else if (params.recipients) {
      params.para = params.recipients;
    }

    if (params.deemail && !params.dename) {
      if (params.de && params.de.name) {
        params.dename = params.de.name;
      } else if (params.from && params.from.name) {
        params.dename = params.from.name;
      } else {
        var split = params.deemail.split('@');
        params.deename = split[0];
      }
    }
    var
      data = {
        remitente: params.deemail,
        destino: params.para,
        fecha: new Date(),
        desde: params.dename + '<' + params.deemail + '>',
        asunto: params.asunto,
        cc: params.cc,
        bcc: params.cco || params.bcc,
        content: {
          html: params.contenidohtml,
          text: params.contenidotexto
        }
      };
    data.cc = transformUser(data.cc);
    data.bcc = transformUser(data.bcc);
    data.destino = transformUser(data.destino);

    return data;
  }

  function receiveMail(email) {
    sails.log.info(email);
    var
      remitente = email.Sender,
      destino = !_.isArray(email.Recipient) ? [email.Recipient] : email.Recipient,
      fecha = new Date(email.Headers.Date),
      desde = email.From,
      asunto = email.Subject,
      spamScore = email.SpamAssassinScore,
      customId = email.CustomID,
      payload = email.Payload,
      para = email.To,
      cc = email.Cc,
      bcc = email.Bcc,
      content = {},
      headers = {
        recibido: email.Headers.Received,
        para: email.Headers.To,
        cc: email.Headers.Cc,
        bcc: email.Headers.Bcc,
        messageID: email.Headers['Message-ID'],
        reply: email.Headers['In-Reply-To']
      },
      idxName = '',
      name = '',
      str = '';
    for (var h = 0; h < email.Parts.length; h++) {
      if (email.Parts[h].Headers['Content-Transfer-Encoding'] === 'base64') {
        idxName = email.Parts[h].Headers['Content-Type'].indexOf('name=');
        name = email.Parts[h].Headers['Content-Type'].substr(idxName + 5);
        str = new Buffer(email[email.Parts[h].ContentRef], email.Parts[h].Headers['Content-Transfer-Encoding'])
        str = str.toString('utf8');
      } else {
        str = email[email.Parts[h].ContentRef];
      }
      sails.log.info(email.Parts[h].ContentRef)
      if(email.Parts[h].ContentRef){
        content[email.Parts[h].ContentRef.replace('-part', '').toLowerCase()] = str;
      }else{
        if(!content.text){
          content.text = str;
        }else{
          content.html = str;
        }
      }
    }
    var data = {
      remitente: remitente,
      destino: transformUser(destino),
      fecha: fecha,
      desde: desde,
      asunto: asunto,
      spamscore: spamScore,
      customid: customId,
      payload: payload,
      para: para,
      cc: transformUser(cc),
      bcc: transformUser(bcc),
      content: content
    };

    return Usuarioblog
      .find({
        populate: false,
        where: {
          email: destino
        }
      })
      .then(function(usrs) {
        if (usrs && _.isArray(usrs) && usrs.length > 0) {
          return usrs;
        }
        return Promise.reject('not found users ' + (_.isArray(destino) ? destino.join(', ') : destino));
      })
      .then(function(usrs) {
        return Email
          .create(data)
          .then(function(email) {
            Email.publishCreate(email);
            // Asociar Email a los Usuarios
            var promises = [];
            _.forEach(usrs, function(usr) {
              promises.push(
                Emailusuario
                .create({
                  tipo: 'recibido',
                  email: email.id,
                  usuario: usr.id,
                  messageid: headers.messageID,
                  text: 'desde: ' + email.desde + '|destino: ' + (_.isArray(email.destino) ? email.destino.join(', ') : email.destino) + '|asunto:' + email.asunto + '|contenido-html:' + email.content.html + '|contenido-text:' + email.content.text
                })
                .then(function(eu) {
                  eu.email = email;
                  Emailusuario.publishCreate(eu);
                  return eu;
                })
              );
            });
            return Promise
              .all(promises);
          });
      });
  }

  function transformUser(array) {
    return (_.isArray(array) && !_.isEmpty(array) && _.compact(_.map(array, function(email) {
      if (_.isString(email) && validateEmail(email)) {
        return {
          Email: email
        };
      } else if (_.isObject(email)) {
        /*if(email.Name && email.Email){
          return email;
        }*/
        var
          split = [],
          _email = email.email || email.Email,
          name = email.nombre || email.name || email.Name;
        if (_email && validateEmail(_email)) {
          if (!name) {
            split = _email.split('@');
            split[1] = split.join('@');
          }
          email = {
            Name: split[0] || name,
            Email: split[1] || _email
          }
        }
        return email;
      }
      return null;
    }))) || (_.isString(array) && validateEmail(array) && [{
      Email: array
    }]) || [];
  }

  function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  function getBlog(blog) {
    return Blog
      .findOne({
        where: {
          or: [{
              id: blog
            },
            {
              slug: Tools.getSlug(blog)
            },
            {
              dominio: blog
            }
          ]
        }
      })
      .then(function(blg) {
        if (blg && blg.id) {
          return blg;
        }
        return Promise.reject('not found domain');
      });
  }

  function getSender(usr) {
    return mailjet
      .get('sender')
      .request({
        Email: usr.email
      })
      .then(function(rta) {
        rta = rta.body || rta;
        if (rta.StatusCode === 404 || rta.Count === 0) {
          return mailjet
            .post('sender')
            .request({
              Name: usr.nombre || usr.username,
              Email: usr.email
            })
            .then(function(rta) {
              rta = rta.body || rta;
              if (rta.Count === 1) {
                return usr;
              }
              return Promise.reject('not active email');
            });
        }
        return usr;
      });
  }

  function getParseroute(usr, blg) {
    sails.log.info('\nUser\n', usr.email,'\n');
    sails.log.info('\nBlog\n', blg.dominio,'\n');
    return mailjet
      .get('parseroute',{
        params: {
          Email: usr.email
	}
      })
      .request({
        Email: usr.email
      })
      .then(function(rta) {
        rta = rta.body || rta;
        sails.log.info('Mailjet:604\n', rta, usr.email)
        if (rta.StatusCode === 404 || (rta.Data && _.isArray(rta.Data) && _.map(rta.Data, 'Email').indexOf(usr.email) < 0)) {
          return mailjet
            .post('parseroute')
            .request({
              "Url": "http://api." + blg.dominio + "/parseMail",
              "Email": usr.email
            })
            .then(function(rta) {
              rta = rta.body;
              sails.log.info('Mailjet:614\n', rta)
              if (rta.Count === 1) {
                return {
                  email: usr.email,
                  active: rta.Count > 0
                };
              }
              return Promise.reject('not active email');
            }, function(err) {
              sails.log.error(err);
              return err;
            });
        }
        if (usr.emailactive) {
          return {
            email: usr.email,
            active: usr.emailactive
          };
        }
        return Usuario
          .update({
            id: usr.id
          }, {
            emailactive: true
          })
          .then(function(usr_) {
            return {
              email: usr_.email,
              active: usr_.emailactive
            };
          });
      })
  }
})();
