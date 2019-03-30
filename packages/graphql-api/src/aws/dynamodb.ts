import AWS = require("aws-sdk");

// Create the DynamoDB service object
export const dynamo = new AWS.DynamoDB({
    apiVersion: "2012-10-08",
    region: "us-east-1"
});

export const DELTAS = process.env.DELTAS || '';
export const ORIGINS = process.env.ORIGINS || '';
export const USERS = process.env.USERS || '';