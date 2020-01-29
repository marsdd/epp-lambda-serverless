/*jshint esversion: 6 */
const AWS = require('aws-sdk');
const sns = new AWS.SNS();
const conf = require('../cnf.js');

function snsEventToJson(sns) {
  return JSON.parse(sns.Records[0].Sns.Message);
}

function jsonToSnsParams(jsonObject) {
  return {
    Message: JSON.stringify(jsonObject)
  };
}

function publish(params, snsTopic) {
  // sns topic from env
  // params.TargetArn = process.env.SNS_TOPIC;
  params = conf[snsTopic];
  console.log('topic params 1:', params);

  return new Promise((resolve, reject) => {
    sns.publish(params, (err, data) => {
      if (err) {
        console.log('sns not published:', err);
        return reject(err);
      } else {
        console.log('sns published:', data);
        return resolve(data);
      }
    });
  });
}

module.exports = {
  snsEventToJson,
  jsonToSnsParams,
  publish
};