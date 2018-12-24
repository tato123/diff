"use strict";

const querystring = require("querystring");

exports.handler = (event, context, callback) => {
  const request = event.Records[0].cf.request;
  const method = request.method;

  if (method !== "GET") {
    return callback(null, request);
  }
  /**
   * Reads query string to check if custom origin should be used, and
   * if true, sets custom origin properties.
   */

  const params = querystring.parse(request.querystring);

  if (params["useCustomOrigin"]) {
    if (params["useCustomOrigin"] === "true") {
      /* Set custom origin fields*/
      request.origin = {
        custom: {
          domainName: "www.lipsum.com",
          port: 443,
          protocol: "https",
          path: "",
          sslProtocols: ["TLSv1", "TLSv1.1"],
          readTimeout: 5,
          keepaliveTimeout: 5,
          customHeaders: {}
        }
      };
      request.headers["host"] = [{ key: "host", value: "www.lipsum.com" }];
    }
  }
  callback(null, request);
};
