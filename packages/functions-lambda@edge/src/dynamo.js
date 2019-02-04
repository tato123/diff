const AWS = require("aws-sdk");

const dynamoDb = new AWS.DynamoDB({
    region: "us-east-1"
  });

module.exports = dynamoDb;