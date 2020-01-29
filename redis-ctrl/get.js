/*jshint esversion: 6 */
/*eslint strict: ["error", "function"]*/
// 'use strict';

const Redis = require('ioredis');
const conf = require('../cnf.js');

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

module.exports.get = (event, context, callback) => {

  let attribute = '';

  console.log('request:', JSON.stringify(event));

  if (event.queryStringParameters !== null && event.queryStringParameters !== undefined) {
    if (event.queryStringParameters.attribute !== undefined &&
      event.queryStringParameters.attribute !== null &&
      event.queryStringParameters.attribute !== "") {
      console.log("Received attribute: " + event.queryStringParameters.attribute);
      attribute = event.queryStringParameters.attribute;
    }
  }
  const params = {
    id: event.pathParameters.id,
    attribute: undefined || attribute
  };

  // a.s. need a soc_code to proceed
  if (params.id.length == 0) {
    const response = {
      statusCode: 200,
      body: JSON.stringify({
        'result': 'not ok',
        'reason': 'soc_code parameter not provided'
      })
    };

    callback(null, response);

  }

  // a.s. ioredis client
  const redis = new Redis(config);

  if (params.attribute && params.attribute.length > 0) {
    redis.hget(`details:${params.id}`, params.attribute, (err, result) => {
      if (err) {
        console.log('reading Occupations error:', err);
      } else {
        console.log('Occupations result: ', result);

        redis.disconnect();

        const response = {
          statusCode: 200,
          body: JSON.stringify({
            'result': result
          })
        };

        callback(null, response);
      }
    });
  } else {
    redis.hgetall(`details:${params.id}`, function (err, result) {

      if (err) {
        console.log('reading Occupation Details error:', err);
      } else {
        console.log('Occupation Details: ', result);

        redis.disconnect();

        const response = {
          statusCode: 200,
          body: JSON.stringify({
            'result': result
          })
        };

        callback(null, response);

      }

    });

  }

};