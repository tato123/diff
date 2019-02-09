module.exports.withProxyTarget = middleware => (req, res, next) => {
  if (!req.proxyTarget) {
    return next("");
  }

  return middleware(req, res, next);
};
