"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AWS = require("aws-sdk");
// Create the DynamoDB service object
exports.dynamo = new AWS.DynamoDB({
    apiVersion: "2012-10-08",
    region: "us-east-1"
});
exports.DELTAS = process.env.DELTAS || '';
exports.ORIGINS = process.env.ORIGINS || '';
