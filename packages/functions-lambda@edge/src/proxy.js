"use strict";

const axios = require("axios");

const hostUtils = require("./host");
const responseMiddleware = require("./responseMiddleware");

const fetchContent = async ({ url, method }) => {
  // perform a head event to determine type
  const { headers } = await axios({
    url,
    method: "HEAD"
  });

  // get the responseType this time
  const isByteArray = headers["accept-ranges"] === "bytes";
  const isBinary = !headers["content-type"].startsWith("text");
  console.log("[Fetch] is byteArray?", isByteArray);
  console.log("[Fetch] is isBinary?", isBinary);

  // fetch the data
  const axiosResponse = await axios({
    url: url,
    method,
    ...(isByteArray ? { responseType: "arraybuffer" } : {})
  });

  // if its a byte array and not a binary format
  // we need to convert it back to a string before working with it
  const data =
    !isBinary && isByteArray
      ? Buffer.from(axiosResponse.data, "binary").toString("utf-8")
      : axiosResponse.data;

  return {
    ...axiosResponse,
    data,
    isByteArray,
    isBinary
  };
};

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
    const {
      origin: originHost,
      protocol: originProtocol
    } = await hostUtils.getHost(versionHost, scheme, uri, querystring);

    console.log("Mapped", versionHost, "to", originHost);

    // we dont have an origin host
    if (originHost == null) {
      console.log("No origin available, sending default page");
      return hostUtils.defaultPage();
    }

    // Build our content origin url
    const url = `${originProtocol}://${originHost}${uri}${
      querystring.trim().length > 0 ? "?" + querystring : ""
    }`;
    const xFrameOrigin = `${originProtocol}://${originHost}`;

    // fetch our content
    const { data, headers: axiosResHeaders, isBinary } = await fetchContent({
      url,
      method
    });

    // generate a new response
    const editMode = querystring.indexOf("diffEditMode=true") !== -1;
    console.log("is active edit mode?", editMode);
    const response = await responseMiddleware.generateResponse(request, {
      data,
      headers: axiosResHeaders,
      isBinary,
      originHost,
      versionHost,
      xFrameOrigin,
      editMode
    });

    console.log("--[Event Response]--");
    console.log(response);
    console.log("------------------");

    callback(null, response);
  } catch (error) {
    console.error("Failed to perform mapping", error);
    /// todo: return an s3 failed bucket
    throw error;
  }
};
