/*jshint esversion: 6 */
/*eslint strict: ["error", "function"]*/
// 'use strict';

const conf = require('../cnf.js');
const PAGE_LIMIT = conf.api.limit;
const _ = require('lodash');
const async = require('async');

function RedisRequest (redis, type, req) {
  this.redis = redis
  this.type = type
  this.req = req
  this.query = {}
  this.getSelect()
  this.limit = this.getLimit()
  this.page = this.req.page || 0
  if (this.limit === false) {
    this.start = 0
    this.end = -1
  } else {
    this.start = this.page * this.limit
    this.end = this.start + this.limit - 1
  }
}

RedisRequest.prototype.withIndex = function (key, cb) {
  var self = this
  this.redis.lrange(key, 0, -1, function (err, index) {
    if (err) self.onDone(err)
    self.index = index
    cb()
  })
  return this
}

/*
 * with one or more sets (indices), populate a response for the given
 * cache 'type' defined via the constructor
 *
 * keys (array) - strings matching which redis key for the set
 */
RedisRequest.prototype.withSets = function (keys, cb) {
  async.map(keys, this.redis.smembers.bind(this.redis), function (err, indices) {
    this.index = _.flatten(indices || [])
    cb(err, this.index)
  }.bind(this))
}

RedisRequest.prototype.fetchWithIndex = function (key, cb) {
  var self = this
  this.withIndex(key, function () {
    self.fetch(cb)
  })
}

/*
 * keys (array) - string key for each index to fetch records off of
 */
RedisRequest.prototype.fetchWithSets = function (keys, cb) {
  console.log({ op: 'redisFetchSets', setKeys: keys })
  this.withSets(keys, function (err) {
    if (err) return cb(err)
    this.fetch(cb)
  }.bind(this))
}

/*
 * fetch records with a given array of ids for this type
 */
RedisRequest.prototype.fetchWithIds = function (ids, cb) {
  if (!ids.length) return cb(null, [])
  this.index = ids
  this.fetch(cb)
}

RedisRequest.prototype.fetch = function (cb) {
  this.onDone = cb
  console.log({ op: 'redisPagedFetch', type: this.type, start: this.start, end: this.end })
  if (this.index) return this.buildResponse(null, this.index)
  this.redis.zrevrange(this.type, this.start, this.end, this.buildResponse.bind(this))
}

RedisRequest.prototype.fetchOne = function (cb) {
  this.onDone = cb
  var self = this
  console.log({ op: 'redisFetchOne', type: this.type, params: this.req.params })
  var paramsId = this.type === 'partner' ? this.req.params.id : this.req.params.accountId
  this.redis.get(this.type + ':' + paramsId, function (err, result) {
    if (err) return cb(err)
    cb(null, self.parseResult([null, result]))
  })
}

RedisRequest.prototype.fetchMultiple = function (keys, cb) {
  this.onDone = cb
  console.log('redis fetchMultiple', {type: this.type})
  console.log('redis params', this.req.params)
  var self = this
  this.redis.mget(keys, function (err, results) {
    if (err) {
      return cb(err)
    }

    cb(null, _.map(results, function (row) {
      var data = JSON.parse(row)
      if (self.query.select) {
        return _.pick(data, self.query.select)
      }

      return data
    }))
  })
}

RedisRequest.prototype.parseResult = function (result) {
  var select = this.query.select
  var json
  try {
    json = JSON.parse(result[1])
    if (json && select && select.length) return _.pick(json, select)
    else return json
  } catch (e) {
    console.log({ op: 'redisParseError', error: e, result: result })
  }
}

RedisRequest.prototype.flushResults = function () {
  var self = this
  this.pipeline.exec(function (err, results) {
    console.log({ op: 'redisFlushPipeline', size: results ? results.length : 0, err: err })
    if (err) return this.onDone(err)
    var records = results.map(function (result, i) {
      return self.parseResult(result)
    })

    records = records.filter(function (record) {
      return record !== null && typeof record !== 'undefined'
    })

    self.onDone(null, _.without(records, null, undefined))
  })
}

RedisRequest.prototype.buildResponse = function (err, index) {
  if (err) return this.onDone(err)
  this.pipeline = this.redis.pipeline()
  var self = this
  console.log({ op: 'redisFetchRecords', size: index.length })

  index.forEach(function (id) {
    self.pipeline.get(self.type + ':' + id)
  })

  this.flushResults()
}

RedisRequest.prototype.getSelect = function () {
  var select = this.req.query.select
  if (!select) return
  if (typeof select === 'string') select = select.split(',')
  this.setWhere()
  this.query.select = select
}

RedisRequest.prototype.getLimit = function () {
  var limit = this.req.query.limit
  if (limit === 'false') return false
  limit = parseInt(limit, 10)
  if (isNaN(limit)) limit = PAGE_LIMIT
  return limit
}

RedisRequest.prototype.setWhere = function () {
  if (!this.query.where) this.query.where = {}
}

module.exports = RedisRequest
