"use strict";

const middleware = opts => (req, res, next) => {
  if (!opts.proxy) {
    next("Proxy was not set");
  }

  opts.proxy.web(req, res, {
    target: req.proxyTarget
  });

  next();
};

module.exports = {
  id: "Proxy Middleware",
  route: "",
  handle: middleware
};
