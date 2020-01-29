/*jshint esversion: 6 */
/*eslint strict: ["error", "function"]*/
// 'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const conf = require('../cnf.js');
const sns = require('../util/sns-publish-helper');

const topic = 'sns-synch';

module.exports.synch = (event, context, callback) => {

  // console.log('sns creds:', conf.sns);

  // usage:
  function publishThisThing(param = None, paramtwo = None) {
    return sns.publish(sns.jsonToSnsParams({
      'keyOne': 'blah',
      'paramOne': param,
      'paramTwo': paramtwo
    }), topic);
  }

  publishThisThing('p1', 'p2');
  console.log('sns after publishing');




  // console.log('sns creds:', conf.sns);
  // // Create promise and SNS service object
  // const publishTextPromise = new AWS.SNS().publish(conf.sns).promise();
  // console.log('after sns');

  // const promisePublish = params => sns
  //   .publish({
  //     Message: JSON.stringify(params.message),
  //     TopicArn: params.topicArn
  //   })
  //   .promise();

  // // Handle promise's fulfilled/rejected states
  // publishTextPromise.then(
  //   function (data) {
  //     console.log(`Message ${conf.sns.Message} sent to the topic ${conf.sns.TopicArn}`);
  //     console.log("MessageID is " + data.MessageId);
  //   }).catch(
  //   function (err) {
  //     console.error(err, err.stack);
  //   });

  // create a response
  const response = {
    statusCode: 200,
    body: JSON.stringify('result'),
  };
  callback(null, response);
};