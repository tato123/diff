"use strict";

const htmlPlugins = require("./html");
const zlib = require("zlib");

const getContentType = headers => {
  console.log("headers", headers);
  return headers["content-type"] || "";
};

module.exports.generateResponse = async (request, context) => {
  const {
    data,
    headers,
    isBinary,
    originHost,
    versionHost,
    editMode = false
  } = context;
  const contentType = getContentType(headers);

  console.log("contentType", contentType);
  console.log("pending cookies", headers["set-cookie"]);
  // default
  const defaultResponse = {
    headers: {
      "content-type": [{ key: "Content-Type", value: contentType }],
      "content-encoding": [{ key: "Content-Encoding", value: "gzip" }],
      "access-control-allow-origin": [
        {
          key: "access-control-allow-origin",
          value: "*"
        }
      ]
    }
  };

  if (
    contentType.indexOf("text/html") !== -1 ||
    contentType.indexOf("css") !== -1 ||
    contentType.indexOf("javascript") !== -1
  ) {
    // check what sort of data was returned
    const output = await htmlPlugins(data, originHost, versionHost, editMode);
    const buffer = zlib.gzipSync(output);
    const base64EncodedBody = buffer.toString("base64");

    return Object.assign({}, defaultResponse, {
      body: base64EncodedBody,
      bodyEncoding: "base64",
      status: "200",
      statusDescription: "OK"
    });
  } else if (isBinary) {
    // aws cloudfront can only handle sending binary data as a base64 encoded
    // string
    const buffer = zlib.gzipSync(data);
    const base64EncodedBody = buffer.toString("base64");

    return Object.assign({}, defaultResponse, {
      body: base64EncodedBody,
      bodyEncoding: "base64",
      status: "200",
      statusDescription: "OK"
    });
  } else {
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
    return request;
  }

  throw new Error("Unable to process and provide a response");
};
