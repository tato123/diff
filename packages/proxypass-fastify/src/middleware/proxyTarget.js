"use strict";
const client = require("../apollo");
const url = require("url");

const middleware = opts => async (req, res, next) => {
  const query = `
    query getOrigin($host: String!) {
      origin(Host: $host) {
        host
        origin
        protocol
      }
    }
  `;

  console.log("my url is ", req.hostname);

  const variables = {
    host: "localhost"
  };

  try {
    const data = await client.request(query, variables);

    req.proxyTarget = `${data.origin.protocol}://${data.origin.origin}`;
    req.proxyHostname = data.origin.origin;
    return next();
  } catch (error) {
    console.error(error);
    return next(error.message);
  }
};

module.exports = {
  id: "Get the middleware target",
  route: "",
  handle: middleware
};
