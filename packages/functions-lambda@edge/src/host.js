"use strict";

const AWS = require("aws-sdk");
const zlib = require("zlib");

const dynamoDb = new AWS.DynamoDB({
  region: "us-east-1"
});
const DYNAMODB_TABLE = "Origins";

// Performs a lookup in dynamodb to match our account
module.exports.getHost = (host, scheme, uri, querystring) => {
  const params = {
    TableName: DYNAMODB_TABLE,
    Key: {
      Host: {
        S: host
      }
    }
  };

  return new Promise((resolve, reject) => {
    // fetch todo from the database
    dynamoDb.getItem(params, function (err, data) {
      if (err) {
        console.log(err, err.stack); // an error occurred
        return resolve(null);
      } else if (!data.Item) {
        console.log("No mapping origin found");
        return resolve(null);
      }
      const origin = data.Item.Origin.S;
      const protocol = data.Item.Proto.S;
      return resolve({origin, protocol});
    });
  });
};

module.exports.defaultPage = () => {
  const html = `
      <html>
        <head></head>
        <body><h1>Sorry, I cant route there dave</h1></body>
      </html>
    `;

  const buffer = zlib.gzipSync(html);
  const base64EncodedBody = buffer.toString("base64");

  const response = {
    headers: {
      "content-type": [
        { key: "Content-Type", value: "text/html; charset=utf-8" }
      ],
      "content-encoding": [{ key: "Content-Encoding", value: "gzip" }],
      expires: [{ key: "Expires", value: "0" }],
      "cache-control": [{ key: "Cache-control", value: "no-cache,no-store" }]
    },
    body: base64EncodedBody,
    bodyEncoding: "base64",
    status: "200",
    statusDescription: "OK"
  };

  return response;
};
