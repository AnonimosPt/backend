/**
 * ArchivoController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
 var
    googleDrive = require('google-drive'),
    token = 'AIzaSyB1y8FrySuQPsxPwn_ykr_l0buwl-BAO9g',
    fileId = '1097178329429'
  ;
module.exports = {
  getFile(token, fileId, callback) {
    googleDrive(token).files(fileId).get(callback)
  },
  listFiles(token, callback) {
    googleDrive(token).files().get(callback)
  },
  callback(err, response, body) {
    if (err) return console.log('err', err)
    console.log('response', response)
    console.log('body', JSON.parse(body))
  }
};
