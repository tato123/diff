/**
 * @param resFns
 * @returns {*}
 */
module.exports = function getProxyResFunctions(resFns, opt) {
  if (opt.getIn(["cookies", "stripDomain"])) {
    return resFns.push(proxyUtils.checkCookies);
  }
  return resFns;
};
