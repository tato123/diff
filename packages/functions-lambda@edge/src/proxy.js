"use strict";

const axios = require("axios");
const zlib = require("zlib");
const hostUtils = require("./host");
const htmlPlugins = require("./html");

/**
 * Our edge proxy that is responsible for reading the requests and
 * returning a modified version of the site if there is one.
 */
module.exports.edgeProxy = async (event, context, callback) => {
  // parse out our data
  const start = new Date();
  const request = event.Records[0].cf.request;
  const headers = request.headers;
  const method = request.method;
  const scheme = (headers["cloudfront-forwarded-proto"] || [
    { value: "https" }
  ])[0].value;

  const uri = request.uri;
  const querystring = request.querystring;

  // get the origin view host
  const versionHost = headers["host"][0].value;

  // debugging for our event
  console.log("--[Event Record]--");
  console.log(JSON.stringify(event, null, 4));
  console.log("------------------");

  try {
    // attempt to proxied origin host
    const startLookup = new Date();
    const originHost = await hostUtils.getHost(
      versionHost,
      scheme,
      uri,
      querystring
    );
    const endLookup = new Date() - startLookup;

    // we dont have an origin host
    if (originHost == null) {
      console.log("No origin available, sending default page");
      return hostUtils.defaultPage();
    }

    // --------------------
    // fetch proxied content
    const url = `${scheme}://${originHost}${uri}${
      querystring.trim().length > 0 ? "?" + querystring : ""
    }`;

    const axiosResponse = await axios({
      url: url,
      method
    });
    // --------------------

    const { data, headers: responseHeaders } = axiosResponse;

    if (responseHeaders["accept-ranges"] === "bytes") {
      console.log("attempting to retrieve as a byte aray");
      // rehit this as array buffer since we don't know how to handle this yet
      const { data: arrayData } = await axios({
        url: url,
        method,
        responseType: "arraybuffer"
      });

      const response = {
        headers: {
          "content-type": [
            { key: "Content-Type", value: responseHeaders["content-type"] }
          ],
          "access-control-allow-origin": [
            {
              key: "access-control-allow-origin",
              value: "*"
            }
          ]
        },
        body: arrayData,
        status: "200",
        statusDescription: "OK"
      };

      console.log("response is ", response);
      return response;
    }

    // if we are handling an html request, then use the modifier
    // function
    if (
      responseHeaders["content-type"] &&
      (responseHeaders["content-type"].indexOf("text/html") !== -1 ||
        responseHeaders["content-type"].indexOf("css") !== -1 ||
        responseHeaders["content-type"].indexOf("javascript") !== -1)
    ) {
      const modifiedResponse = modifyAndReturnResponse(
        originHost,
        versionHost,
        data,
        start,
        responseHeaders,
        endLookup
      );
      console.log("--[Modified Response]--");
      console.log(request);
      console.log("------------------");

      return modifiedResponse;
    }

    // otherwise just return the result from a different origin
    request.origin = {
      custom: {
        domainName: originHost,
        port: 443,
        protocol: "https",
        path: "",
        sslProtocols: ["TLSv1", "TLSv1.1", "TLSv1.2"],
        readTimeout: 30,
        keepaliveTimeout: 5,
        customHeaders: {}
      }
    };

    request.headers["host"] = [{ key: "host", value: originHost }];

    console.log("--[Event Response]--");
    console.log(request);
    console.log("------------------");

    callback(null, request);
  } catch (error) {
    console.error("Failed to perform mapping", error);
    throw error;
  }
};

function modifyAndReturnResponse(
  originHost,
  versionHost,
  data,
  start,
  responseHeaders,
  endLookup
) {
  console.log("-------------Modifying content-------------");
  console.log("User origin", originHost);
  console.log("Version Id", versionHost);
  // check what sort of data was returned
  const output = htmlPlugins(data, originHost, versionHost, false);
  const buffer = zlib.gzipSync(output);
  const base64EncodedBody = buffer.toString("base64");
  const end = new Date() - start;
  console.log("pending cookies", responseHeaders["set-cookie"]);
  console.log(responseHeaders);
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
      ],
      "x-diff-proxy-time": [
        {
          key: "x-diff-proxy-time",
          value: new String(end || "unknown")
        }
      ],
      "x-diff-proxy-lookup-time": [
        {
          key: "x-diff-proxy-lookup-time",
          value: new String(endLookup || "unknown")
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
