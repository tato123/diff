"use strict";

const middleware = opts => (req, res, next) => {
  if (req.url.indexOf("/_ah/health") !== -1) {
    res.end("early execution ok");
  }

  next();
};

module.exports = {
  id: "Health middleware",
  route: "",
  handle: middleware
};
