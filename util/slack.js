// slack
var slack = require('../lib/slack.js');
var moment = require('moment');

var slackBot = 'mymars_bot';

/**
 * Slack wrapper (info msg)
 * @param  {} msgText
 * @param  {} emoji (':white_check_mark:')
 */
var info = function (msgText, emoji) {
  msg(msgText, 'info', emoji);
};

/**
 * Slack wrapper (error msg)
 * @param  {} msgText
 * @param  {} emoji (':white_check_mark:')
 */
var error = function (msgText, emoji) {
  emoji = emoji || ':heavy_exclamation_mark:';
  msg(msgText, 'error', emoji);
};

// post a message in Slack channel
/**
 * @param  {} msgText
 * @param  {} msgType ('info', 'error')
 * @param  {} emoji (':white_check_mark:')
 */
var msg = function (msgText, msgType, emoji) {
  var channel;

  msgType = msgType || 'info';
  emoji = typeof emoji !== 'undefined' ? emoji : '';

  var subject = msgType;

  switch (msgType) {
    case 'info':
      channel = 'mymars_status';
      break;

    case 'error':
      channel = 'mymars_error';
      break;

    default:
      channel = 'mymars_status';
  }

  slack.notifyChannel(
    channel,
    '*MM Lambda info: ' + moment().format('MMMM Do YYYY, h:mm:ss a') + '* ' + emoji +
    '```' + JSON.stringify(msgText) + '```',
    slackBot); // bot username

};

module.exports = {
  info: info,
  error: error,
};