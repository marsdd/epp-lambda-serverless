/*jshint esversion: 6 */
/*eslint strict: ["error", "function"]*/
// 'use strict';

const keys = require('../util/kms.js');

module.exports.listdb = (event, context, callback) => {

  let per_page = null;
  let page_number = null;

  const query = event.queryStringParameters;

  // check for query parameters
  if (query !== null && query !== undefined) {
    console.log('Received a query: ', query);
    if (query.per_page !== undefined &&
      query.per_page !== null &&
      query.per_page !== "") {
      per_page = query.per_page;
    }

    if (query.page_number !== undefined &&
      query.page_number !== null &&
      query.page_number !== "") {

      page_number = query.page_number;
    }
  }

  per_page = null || per_page;
  page_number = null || page_number;

  // a.s. call decryptSecrets, and execute callback procedure once keys are decrypted
  keys.decryptSecrets(cb);

  // callback to execute after decryption
  function cb(kms_obj) {
    let db = kms_obj.db;
    let config_db = kms_obj.config_db;


    const q = `select * from ${config_db.schema}.get_socs(` +
      `${per_page}` + `,` +
      `${page_number}` +
      `);`;

    // a.s. call the SP to get a list of all occupations
    db.query(q, (err, res) => {
      db.end();

      console.log('Requested query:', q);

      if (err) {
        console.log('There was an error: ', err);
      }

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