/*jshint esversion: 6 */
/*eslint strict: ["error", "function"]*/
// 'use strict';

const AWS = require('aws-sdk');
const kms = new AWS.KMS();
const conf = require('../cnf.js');
const pg = require("pg");

const keys1 = [
  process.env.db_host,
  process.env.db_name,
  process.env.db_username,
  process.env.db_password,
  process.env.redis_host,
  process.env.db_name
];

module.exports.decryptSecrets = async function decryptKeys(cb) {
  let plainDecryptedKeys = await Promise.all(keys1.map(decryptKMS));

  let config_db = {
    host: plainDecryptedKeys[0],
    database: plainDecryptedKeys[1],
    user: plainDecryptedKeys[2],
    password: plainDecryptedKeys[3],
    db_name: plainDecryptedKeys[4],
    port: conf.postgres.port,
    schema: conf.postgres.schema,
  };

  const db = new pg.Client(config_db);

  let return_obj = {
    db: db,
    config_db: config_db,
  };

  db.connect((err) => {
    if (err) {
      console.error('Connection error', err.stack);
      new Error('Connection error', err.stack);
    } else {
      console.log('Connected to PostgreSQL database');
      cb(return_obj);
    }
  });

}

function decryptKMS(key) {
  return new Promise((resolve, reject) => {

    kms.decrypt({
      CiphertextBlob: new Buffer(key, 'base64')
    }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.Plaintext.toString('ascii'));
      }
    });
  });
}
