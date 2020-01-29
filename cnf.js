module.exports = {
  "slack": {
    "postMessageUrl": "...",
    "token": "..."
  },
  "api": {
    "limit": 20,
    "activityLimit": 10
  },
  "postgres": {
    "port": 5432,
    "schema": "pathway",
  },
  "redis": {
    "prefix": "",
    "connectTimeout": 10000,
    "hostDev": "...",
    "hostProd": "...",
    "port": "6379"
  },
  "sns-synch": {
    Message: 'Initiate RDS->Redis Synch Process',
    TopicArn: process.env.sns_topic_sync
  },
  "sns-warm": {
    Message: 'Warmup lambda functions',
    TopicArn: process.env.sns_topic_warm
  },
};