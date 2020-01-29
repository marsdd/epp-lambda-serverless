/*jshint esversion: 6 */
/*eslint strict: ["error", "function"]*/
// 'use strict';
const Redis = require('ioredis');

const conf = require('../cnf.js');
const keys = require('../util/kms.js');


const config_rd = {
  host: conf.redis.hostDev,
  port: conf.redis.port,
  prefix: '' || conf.redis.prefix,
  retry_strategy: function (options) {
    if (options.error && options.error.code === 'ECONNREFUSED') {
      // End reconnecting on a specific error and flush all commands with
      // a individual error
      return new Error('The server refused the connection');
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
      // End reconnecting after a specific timeout and flush all commands
      // with a individual error
      return new Error('Retry time exhausted');
    }
    if (options.attempt > 10) {
      // End reconnecting with built in error
      return undefined;
    }
    // reconnect after
    return Math.min(options.attempt * 100, 3000);
  }
};

// fetch all skills from the database
module.exports.synchskills = (event, context, callback) => {

  // const params = {
  //   Key: {
  //     id: event.pathParameters.id,
  //   },
  // };

  // a.s. call decryptSecrets, and execute callback procedure once keys are decrypted
  keys.decryptSecrets(cb);

  // callback to execute after decryption
  function cb(kms_obj) {
    let db = kms_obj.db;
    let config_db = kms_obj.config_db;

    // a.s. ioredis client
    const redis = new Redis(config_rd);

    // a.s. will need to be a different table to get a list of all occupations
    db.query(`select soc_code, attr_id, attr_name, attr_level, attr_importance from ${config_db.schema}.occ_skill;`, (err, res) => {

      if (err) {
        console.log('there was an error', err);
      }

      const pipeline = redis.pipeline();
      const rowCount = res.rowCount;

      let previousSoc_Code = '';
      let aSkills = [];

      for (let i = 0; i < rowCount; i++) {
        const element = res.rows[i];

        if ((previousSoc_Code.length > 0 && previousSoc_Code !== element.soc_code) || (i > 0 && i + 1 === rowCount)) {

          // write to pipeline
          pipeline.hset(`details:${element.soc_code}`,
            'skills', JSON.stringify(aSkills));

          console.log(aSkills);

          // assign a new soc_code
          previousSoc_Code = element.soc_code;

          // init array again
          aSkills = [];
        } else {
          previousSoc_Code = element.soc_code;
        }

        aSkills.push({
          "attr_id": element.attr_id,
          "attr_name": element.attr_name,
          "attr_level": element.attr_level,
          "attr_importance": element.attr_importance
        });

      }

      // redis.exec(function (err, result) {
      // a.s. not needed here, but can keep it
      // a.s. switch pipeline from const to let
      // if (!pipeline) pipeline = redis.pipeline();
      pipeline.exec(function (err, result) {
        // a.s. err is always null
        console.log('redis exec results (array: err, res)', result);
        // result === [[null, 'OK'], [null, 'bar']]

        redis.disconnect();
      });

      db.end();

      // create a response
      const response = {
        statusCode: 200,
        body: JSON.stringify({
          'res': 'ok',
          'count': rowCount
        })
        // body: JSON.stringify(res),
      };

      callback(null, response);
    });
  }
};