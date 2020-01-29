/*jshint esversion: 6 */
/*eslint strict: ["error", "function"]*/
// 'use strict';

const AWS = require('aws-sdk');
const conf = require('../cnf.js');
const lambda = new AWS.Lambda();

// fetch all abilities from the database
// module.exports.listOcc = (event, context, callback) => {
module.exports.listOcc = (event, context) => {

  console.log('Executing: listOcc');

  const params = {
    FunctionName: process.env.func_prefix + 'listoccupations', // the lambda function we are going to invoke
    InvocationType: 'RequestResponse',
    LogType: 'Tail',
    // Payload: '{ "per_page" : "1", "page_number": "1" }'
    Payload: '{"queryStringParameters": { "per_page" : "1", "page_number": "1" }}'
  };

  console.log('listOcc params:', params);

  lambda.invoke(params, function (err, data) {
    if (err) {
      console.log('failed the execution', err);
      context.fail(err);
    } else {
      console.log('listOcc execution completed');
      context.succeed('List DB said ' + data.Payload);
    }
  })

  // create a response
  // const response = {
  //   statusCode: 200,
  //   body: JSON.stringify({
  //     'res': 'ok',
  //   }),
  // };

  // callback(null, response);

};

exports.handler = function (event, context) {

};