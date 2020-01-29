/*jshint esversion: 6 */
/*eslint strict: ["error", "function"]*/
// 'use strict';

const Redis = require('ioredis');
const conf = require('../cnf.js');

const config = {
  host: conf.redis.hostDev,
  port: conf.redis.port,
  connectTimeout: conf.redis.connectTimeout,
  prefix: '' || conf.redis.prefix,
};

console.log('prefix, host:', config);

const redis = new Redis(config);

console.log('requested new Redis');

redis.set('foo', 'bar');
console.log('redis set bar');
redis.get('foo', function (err, result) {
  if (err) {
    console.log('reading foo error:', err);
  } else {
    console.log('a.s. after redis retrieved...');
    console.log(result);
  }
});

module.exports = redis;

// console.log('redisjs redisConfig: ', redisConfig);

// var redis = new Redis(redisConfig);

// redis.set('redistest', 'bar14');
// redis.set('redistest1', 'bar22');

// // redis.get('redistest', function (err, result) {
// //   if (err) {
// //     console.log('error:', err);
// //   } else {
// //     console.log('redisjs value:',
// //       result);
// //   }
// // });



// // reports an error on initial connect
// redis.on('error', function (err) {
//   console.log({
//     op: 'redisError',
//     err: err
//   });
//   throw new Error('Unable to connect to Redis host: ' + err.hostname)
// });

// redis.on('close', function (param) {
//   // log.debug({ op: 'redisDisconnect' })
//   console.log({
//     op: 'redisDisconnect',
//     param: param
//   });
// });

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