"use strict";

const client = require("../apollo");
const url = require("url");

const middleware = opts => (req, res, next) => {
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

  client
    .request(query, variables)
    .then(data => {
      req.proxyTarget = `${data.origin.protocol}://${data.origin.origin}`;
      req.proxyHostname = data.origin.origin;
      next();
    })
    .catch(err => {
      next(err);
    });
};

module.exports = {
  id: "Get the middleware target",
  route: "",
  handle: middleware
};
