/*jshint esversion: 6 */
/*eslint strict: ["error", "function"]*/
// 'use strict';

// a.s. List all Occupations from Redis
// Date: Nov 1, 2018

const conf = require('../cnf.js');

// a.s. between two clients
const Redis = require('ioredis');

// a.s. retry strategy not used for ioredis client
const config = {
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

console.log('redis config:', config);

exports.listredis = (event, context, callback) => {

  // a.s. redis client
  // const redis = Redis.createClient(config);

  // a.s. ioredis client
  const redis = new Redis(config);

  redis.smembers('occupations', function (err, result) {

    if (err) {
      console.log('reading Occupations error:', err);
    } else {
      console.log('Occupations result: ', result);
      // console.log('Occupations result: ', result.length);

      redis.disconnect();

      const response = {
        statusCode: 200,
        // body: {
        //   'result': result
        // }
        body: JSON.stringify({
          'result': result
        })
      };

      callback(null, response);

    }

  });

};