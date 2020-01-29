/*jshint esversion: 6 */
/*eslint strict: ["error", "function"]*/
// 'use strict';

const keys = require('../util/kms.js');

module.exports.get = (event, context, callback) => {
  const params = {
    id: event.pathParameters.id,
  };

  // a.s. call decryptSecrets, and execute callback procedure once keys are decrypted
  keys.decryptSecrets(cb);

  // callback to execute after decryption
  function cb(kms_obj) {
    let db = kms_obj.db;
    let config_db = kms_obj.config_db;

    // a.s. will need to be a different table to get a list of all occupations
    db.query(`select * from ${config_db.schema}.get_details('${params.id}');`, (err, res) => {

      if (err) {
        console.log('There was an error: ', err);
      }
      db.end();

      // create a response
      const response = {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        }, // a.s. for now allow calls from anywhere
        body: JSON.stringify(res),
      };

      callback(null, response);
    });
  }
};