"use strict";

const validator = require("./validate");

const middleware = opts => (req, res, next) => {
  if (!opts.proxy) {
    return next("No proxy server set");
  }

  opts.proxy.web(req, res, {
    target: req.proxyTarget
  });
};

module.exports = {
  id: "Proxy Middleware",
  route: "",
  handle: middleware
};
