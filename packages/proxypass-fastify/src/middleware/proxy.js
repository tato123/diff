"use strict";

const middleware = opts => (req, res, next) => {
  console.log("[proxy] executing middleware");

  if (!opts.proxy) {
    next("Proxy was not set");
  }

  try {
    opts.proxy.web(req, res, {
      target: req.proxyTarget
    });
  } catch (error ){
    console.error('Uh oh, something broke', error.message)
    return next(error.message)
  }
  
};

module.exports = {
  id: "Proxy Middleware",
  route: "",
  handle: middleware
};
