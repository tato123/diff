const { RedisPubSub } = require("graphql-redis-subscriptions");
const Redis = require("ioredis");
const fs = require("fs");

const data = fs.readFileSync("/var/nodelist", "UTF8", function(err) {
  if (err) throw err;
});

const nodeList = [];
if (data) {
  var lines = data.split("\n");
  for (var i = 0; i < lines.length; i++) {
    if (lines[i].length > 0) {
      nodeList.push(lines[i]);
    }
  }
}

if (nodeList.length === 0) {
  console.error("No  elasticache nodes present!!");
  throw new Error("Elasticache list empty");
}

const redisServer = nodeList[0].split(":")[0];

console.log(`Connecting to redis at ${redisServer}:${process.env.REDIS_PORT}`);
console.log(`AWS created a redis node: ${process.env.REDIS}`);

const options = {
  host: redisServer,
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
