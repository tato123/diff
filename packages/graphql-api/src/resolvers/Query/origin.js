"use strict";

const pubsub = require("../../context/pubsub");
const AWS = require("aws-sdk");
// Create the DynamoDB service object
const dynamo = new AWS.DynamoDB({
  apiVersion: "2012-10-08",
  region: "us-east-1"
});
const _ = require("lodash");

const ORIGINS = process.env.ORIGINS;

const noop = () => {
  return [{}];
};

const originQuery = (parent, args) => {
  if (!args.Host) {
    return Promist.reject("no address found");
  }

  const host = args.Host;
  const REDIS_KEY = `origin::${host}`;

  return pubsub.client.get(REDIS_KEY).then(result => {
    const data = result == null ? null : JSON.parse(result);

    if (data != null && _.has(data, "host")) {
      console.log("cache hit", result);
      return JSON.parse(result);
    }

    const params = {
      TableName: ORIGINS,
      Key: {
        Host: { S: host }
      }
    };

    console.log("querying params", params);

    return new Promise((resolve, reject) => {
      // Call DynamoDB to read the item from the table
      dynamo.getItem(params, (err, data) => {
        console.log("results", data);

        // check if we get an error
        if (err || _.isEmpty(data)) {
          console.log("Error", err);
          return resolve();
        }

        const result = {
          host: _.get(data, 'Item.Host.S', null),
          origin: _.get(data, 'Item.Origin.S', null),
          protocol: _.get(data, 'Item.Proto.S', null),
          created: _.get(data, 'Item.Created.N', null),
          uid: _.get(data, 'Item.Created.S', null)
        };

        pubsub.client.set(REDIS_KEY, JSON.stringify(result));
        return resolve(result);
      });
    });
  });
};

module.exports = originQuery;
