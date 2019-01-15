"use strict";

const axios = require("axios");
const zlib = require("zlib");
const hostUtils = require("./host");
const handleCustomHtml = require("./html");

/**
 * Our edge proxy that is responsible for reading the requests and
 * returning a modified version of the site if there is one.
 */
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
    const originHost = await hostUtils.getHost(
      viewHost,
      scheme,
      uri,
      querystring
    );
    if (originHost == null) {
      console.log("No origin available, sending default page");
      return hostUtils.defaultPage();
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
          "content-encoding": [{ key: "Content-Encoding", value: "gzip" }],
          "access-control-allow-origin": [
            {
              key: "access-control-allow-origin",
              value: "*"
            }
          ]
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
