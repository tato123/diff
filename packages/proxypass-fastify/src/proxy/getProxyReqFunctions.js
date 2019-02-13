/**
 * @param reqFns
 * @returns {*}
 */
module.exports = function getProxyReqFunctions(reqFns, opt, bs) {
  var reqHeaders = opt.getIn(["reqHeaders"]);

  if (!reqHeaders) {
    return reqFns;
  }

  /**
   * Back-compat for old `reqHeaders` option here a
   * function was given that returned an object
   * where key:value was header-name:header-value
   * This didn't really work as it clobbered all other headers,
   * but it remains for the unlucky few who used it.
   */
  if (typeof reqHeaders === "function") {
    var output = reqHeaders.call(bs, opt.toJS());
    if (Object.keys(output).length) {
      return reqFns.concat(function(proxyReq) {
        Object.keys(output).forEach(function(key) {
          proxyReq.setHeader(key, output[key]);
        });
      });
    }
  }

  /**
   * Now, if {key:value} given, set the each header
   *
   * eg: reqHeaders: {
   *     'is-dev': 'true'
   * }
   */
  if (Map.isMap(reqHeaders)) {
    return reqFns.concat(function(proxyReq) {
      reqHeaders.forEach(function(value, key) {
        proxyReq.setHeader(key, value);
      });
    });
  }

  return reqFns;
};
