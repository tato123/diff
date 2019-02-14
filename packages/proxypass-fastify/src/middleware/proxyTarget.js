"use strict";
const { request } = require("graphql-request");
const url = require("url");

const middleware = opts => (req, res, next) => {
  console.log("[proxyTarget] executing middleware");

  const query = `
    query getOrigin($host: String!) {
      origin(Host: $host) {
        host
        origin
        protocol
      }
    }
  `;

  const variables = {
    host: req.headers.host
  };

  console.log("Querying with variables", variables);

  request(process.env.GRAPHQL_ENDPOINT, query, variables)
    .then(data => {
      if (data.origin == null) {
        return next("no data found");
      }

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
