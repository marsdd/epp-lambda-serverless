/*jshint esversion: 6 */
/*eslint strict: ["error", "function"]*/
// 'use strict';

var rp = require('request-promise');
var conf = require('../cnf.js');
var slack = conf.slack;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

function notifyChannel(channelName, notificationText, botUsername) {
  return rp({
      method: 'POST',
      uri: slack.postMessageUrl,
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      qs: {
        token: slack.token,
        channel: channelName,
        text: notificationText,
        as_user: true,
        encoding: 'utf8',
        username: botUsername
      },
      json: true
    })
    .then(function (body) {
      // console.log({
      //   'op': 'slackLib',
      //   body: body
      // });
      return {
        text: 'OK',
        body: body
      };
    })
    .catch(function (err) {
      console.log(err);
    });
}

module.exports = {
  notifyChannel: notifyChannel
};