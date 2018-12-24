
const { RedisPubSub } = require('graphql-redis-subscriptions');
const Redis = require('ioredis');

console.log(`Connecting to redis at ${process.env.REDIS_DOMAIN}:${process.env.REDIS_PORT}`)

const options = {
  host: process.env.REDIS_DOMAIN,
  port: process.env.REDIS_PORT,
  retry_strategy: options => {
    // reconnect after
    return Math.max(options.attempt * 100, 3000);
  }
};

const pubsub = new RedisPubSub({
  publisher: new Redis(options),
  subscriber: new Redis(options)
});

module.exports = pubsub;
