"use strict";

const AWS = require("aws-sdk");
// Create the DynamoDB service object
const dynamo = new AWS.DynamoDB({
    apiVersion: "2012-10-08",
    region: "us-east-1"
});
const _ = require("lodash");

const DELTAS = process.env.DELTAS;

const noop = () => {
    return [{}];
};

const deltasQuery = (parent, args) => {
    if (!args.Host) {
        return Promist.reject("no address found");
    }

    const host = args.Host;


    const params = {
        TableName: DELTAS,
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
                host: data.Item.Host.S,
                css: data.Item.CSS.S,
                changes: data.Item.Changes.S
            };

            return resolve(result);
        });
    });

};

module.exports = deltasQuery;
