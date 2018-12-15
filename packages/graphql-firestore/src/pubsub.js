const { GooglePubSub } = require("@axelspringer/graphql-google-pubsub");

const pubsubOptions = {};
const topic2SubName = topicName => `${topicName}`;
const messageHandler = ({ data }) => {
  const d = JSON.parse(data.toString("utf-8"));
  return d;
};
const pubsub = new GooglePubSub(pubsubOptions, topic2SubName, messageHandler);

module.exports = pubsub;
