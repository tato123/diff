"use strict";


const middleware = opts => (req, res, next) => {
  console.log('[proxy] executing middleware');

  if (!opts.proxy) {
    next("Proxy was not set");
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
