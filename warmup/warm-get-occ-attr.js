/*jshint esversion: 6 */
/*eslint strict: ["error", "function"]*/
// 'use strict';

const AWS = require('aws-sdk');
const conf = require('../cnf.js');
const lambda = new AWS.Lambda();

// a.s. only used to warm up the lambda function
module.exports.getOccAttr = (event, context) => {

  console.log('Executing: getOccAttr');

  const params = {
    FunctionName: process.env.func_prefix + 'getoccupationattribute', // the lambda function we are going to invoke
    InvocationType: 'RequestResponse',
    LogType: 'Tail',
    Payload: '{"pathParameters": { "id": "11-1011.00" }}'
  };

  console.log('getOcc params:', params);

  lambda.invoke(params, function (err, data) {
    if (err) {
      console.log('failed the execution', err);
      context.fail(err);
    } else {
      console.log('getOcc execution completed');
      context.succeed('Get Occ DB said ' + data.Payload);
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