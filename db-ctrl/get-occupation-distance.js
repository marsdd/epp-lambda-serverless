/*jshint esversion: 6 */
/*eslint strict: ["error", "function"]*/
// 'use strict';

const keys = require('../util/kms.js');

let details = {};

module.exports.get = (event, context, callback) => {

  let rows_limit;
  let soc_exclude;
  let aSocExclude =[]; 

  const query = event.queryStringParameters;

  if (query !== null && query !== undefined) {
    if (query.rows_limit !== undefined &&
      query.rows_limit !== null &&
      query.rows_limit !== "") {
      console.log("Received rows_limit: " + query.rows_limit);
      rows_limit = query.rows_limit;
    }

    if (query.soc_exclude !== undefined &&
      query.soc_exclude !== null &&
      query.soc_exclude !== "") {

      let s = query.soc_exclude.replace('{','');
      s = s.replace('}','');

      aSocExclude=s.split(',');
      console.log('aSocExclude:', aSocExclude, aSocExclude.length);
      // soc_exclude = query.soc_exclude;
      soc_exclude = '{' + aSocExclude.toString() + '}';
      console.log("Socs excluded: ", soc_exclude);

    }
  }

  const params = {
    id: event.pathParameters.id,
    rows_limit: null || rows_limit,
    soc_exclude: null || soc_exclude
  };

  // a.s. call decryptSecrets, and execute callback procedure once keys are decrypted
  keys.decryptSecrets(cb);

  // callback to execute after decryption
  function cb(kms_obj) {
    let db = kms_obj.db;
    let config_db = kms_obj.config_db;

    const q = `select * from ${config_db.schema}.get_overlap_2('${params.id}'` + (rows_limit ? `, '${params.rows_limit}'` : '') + (soc_exclude ? `, '${params.soc_exclude}'` : '') + ');';

    console.log('Requested query:', q);

    db.query(q, (err, res_overlap) => {

      if (err) {
        console.log('There was an error res_overlap (a.s): ', err);
        return res_overlap.status(500).send();
      }

      // add overlap to the object
      details.overlap = {
        "count": res_overlap.rowCount,
        "data": res_overlap
      };

      console.log(JSON.stringify(details));
      db.end();

      // create a response
      const response = {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        }, // a.s. for now allow calls from anywhere
        body: JSON.stringify(details),
      };

      callback(null, response);

    });

  }

};