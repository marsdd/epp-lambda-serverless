/*jshint esversion: 6 */
/*eslint strict: ["error", "function"]*/
// 'use strict';

const Redis = require("redis");

// const Redis = require('ioredis');
const conf = require('../cnf.js');

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

console.log('prefix, host:', config);

// const redis = new Redis(config);
const redis = Redis.createClient(config);

// redis.on("error", function (err) {
//   console.log({
//     op: 'redisError',
//     err: err
//   });
//   throw new Error('Unable to connect to Redis host: ' + err.hostname);
// });

// redis.on('close', function (param) {
//   console.log({
//     op: 'redisClose',
//     param: param
//   });
// });

// console.log('requested new Redis');

// redis.set('foo', 'bar');
// console.log('redis set bar');
// redis.get('foo', function (err, result) {
//   if (err) {
//     console.log('reading foo error:', err);
//   } else {
//     console.log('a.s. after redis retrieved 1...:', result);
//   }
// });


module.exports = redis;



// redis.on('connect', function (param) {
//   console.log({
//     op: 'redisConnect',
//     param: param
//   });
// });

// redis.on('reconnecting', function (param) {
//   console.log({
//     op: 'redisReconnecting',
//     param: param
//   });
// });

// redis.on('end', function (param) {
//   console.log({
//     op: 'redisEnd',
//     param: param
//   });
// });