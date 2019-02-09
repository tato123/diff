"use strict";

const middleware = opts => (req, res, next) => {
  req.proxyTarget = "https://www.google.com";
  req.proxyHostname = "www.google.com";
  return next();
};

module.exports = {
  id: "Get the middleware target",
  route: "",
  handle: middleware
};
