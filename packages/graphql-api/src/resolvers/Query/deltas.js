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
                host: _.get(data, 'Item.Host.S', null),
                css: _.get(data, 'Item.CSS.S', null),
                changes: _.get(data, 'Item.Changes.S', null),
                created: _.get(data, 'Item.Created.N', null),
                uid: _.get(data, 'Item.Created.S', null)
            };

            return resolve(result);
        });
    });

};

module.exports = deltasQuery;
