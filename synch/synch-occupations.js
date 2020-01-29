/*jshint esversion: 6 */
/*eslint strict: ["error", "function"]*/
'use strict';

const Redis = require('ioredis');

const conf = require('../cnf.js');
const keys = require('../util/kms.js');

// redis
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

const config_db = {
  port: conf.postgres.port,
  schema: conf.postgres.schema,
};

module.exports.synchoccupations = (event, context, callback) => {

  keys.decryptSecrets(cb);

  // callback to execute after decryption
  function cb(kms_obj) {
    let db = kms_obj.db;
    let config_db = kms_obj.config_db;

    // a.s. ioredis client
    const redis = new Redis(config_rd);

    // a.s. will need to be a different table to get a list of all occupations
    db.query(`select soc_code, title from ${config_db.schema}.occupation;`, (err, res) => {

      if (err) {
        console.log('there was an error', err);
      }

      const pipeline = redis.pipeline();
      const rowCount = res.rowCount;

      for (let i = 0; i < rowCount; i++) {
        const element = res.rows[i];
        pipeline.sadd('occupations', JSON.stringify(element));
        console.log('element:', element);
      }

      // redis.exec(function (err, result) {
      // a.s. not needed here, but can keep it
      // a.s. switch pipeline from const to let
      // if (!pipeline) pipeline = redis.pipeline();
      pipeline.exec(function (err, result) {
        // a.s. err is always null
        // result === [[null, 'OK'], [null, 'bar']]
        console.log('redis exec completed');

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