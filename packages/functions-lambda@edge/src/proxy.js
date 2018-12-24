"use strict";

const axios = require("axios");
const zlib = require("zlib");
const AWS = require("aws-sdk");

const dynamoDb = new AWS.DynamoDB({
  region: "us-east-1"
});

// environment values not supported in lambda@edge
const SCRIPT_URL =
  "https://s3.amazonaws.com/getdiff-static-client/clientBridge.js";
const DYNAMODB_TABLE = "Origins";

// handles javascript injection to our bridge
function handleCustomHtml(data, headers) {
  console.log("Lambda modifying html content");
  const jsUrl = SCRIPT_URL;
  const script = `<script src="${jsUrl}"></script>`;
  const re = /<\/body>(?![\s\S]*<\/body>[\s\S]*$)/i;
  const subst = `${script}</body>`;
  return data.replace(re, subst);
}

// Performs a lookup in dynamodb to match our account
function getHost(host, scheme, uri, querystring) {
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
    dynamoDb.getItem(params, function(err, data) {
      if (err) {
        console.log(err, err.stack); // an error occurred
        return resolve(null);
      } else if (!data.Item) {
        console.log("No mapping origin found");
        return resolve(null);
      }
      const origin = data.Item.Origin.S;
      return resolve(origin);
    });
  });
}

function defaultPage() {
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
      "expires" :  [{ key: "Expires", value: "0" }],
      "cache-control":[{ key: "Cache-control", value: "no-cache,no-store" }]
    },
    body: base64EncodedBody,
    bodyEncoding: "base64",
    status: "200",
    statusDescription: "OK"
  };

  return response;
}

module.exports.edgeProxy = async (event, context) => {
  const request = event.Records[0].cf.request;
  const headers = request.headers;
  const method = request.method;
  const scheme = (headers["cloudfront-forwarded-proto"] || [
    { value: "https" }
  ])[0].value;

  const uri = request.uri;
  const querystring = request.querystring;

  //
  const viewHost = headers["host"][0].value;

  // debugging for our event
  console.log("--[Event Record]--");
  console.log(JSON.stringify(event, null, 4));
  console.log("------------------");

  try {
    const originHost = await getHost(viewHost, scheme, uri, querystring);
    if (originHost == null) {
      console.log("No origin available, sending default page");
      return defaultPage();
    }

    const url = `${scheme}://${originHost}${uri}${
      querystring.trim().length > 0 ? "?" + querystring : ""
    }`;

    console.log("contacting url", url);
    const response = await axios({
      url: url,
      method
    });

    const { data, headers: responseHeaders } = response;
    // check what sort of data was returned
    if (responseHeaders["content-type"].indexOf("text/html") !== -1) {
      const output = handleCustomHtml(data, responseHeaders);
      const buffer = zlib.gzipSync(output);
      const base64EncodedBody = buffer.toString("base64");

      const response = {
        headers: {
          "content-type": [
            { key: "Content-Type", value: responseHeaders["content-type"] }
          ],
          "content-encoding": [{ key: "Content-Encoding", value: "gzip" }]
        },
        body: base64EncodedBody,
        bodyEncoding: "base64",
        status: "200",
        statusDescription: "OK"
      };

      return response;
    }

    // in the case that its not an html file
    // go ahead and only modify to pass through and allow
    // cloudfront to manage this request
    console.log("passing through as a custom origin for cloudfront");

    request.origin.custom.domainName = originHost;
    request.headers["host"] = [{ key: "host", value: originHost }];

    return request;
  } catch (error) {
    console.error("Failed to perform mapping", error);
    throw error;
  }
};
