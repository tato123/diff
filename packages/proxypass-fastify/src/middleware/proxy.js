"use strict";
const ua = require("universal-analytics");
const visitor = ua("UA-124426207-2", "proxy_server");

const middleware = opts => (req, res, next) => {
  console.log("[proxy] executing middleware");

  if (!opts.proxy) {
    next("Proxy was not set");
  }

  try {
    visitor.event("Prototype", "View", req.headers.host).send();
  } catch (e) {
    // do nothing
    console.log("unable to send event");
  }

  try {
    opts.proxy.web(req, res, {
      target: req.proxyTarget
    });
  } catch (error) {
    console.error("Uh oh, something broke", error.message);
    return next(error.message);
  }
};

module.exports = middleware;
