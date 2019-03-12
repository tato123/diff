"use strict";

const httpProxy = require("http-proxy");

const proxyTarget = require("./middleware/proxyTarget");
const proxyMiddleware = require("./middleware/proxy");
const healthMiddleware = require("./middleware/health");
const errorHandler = require("./middleware/errorHandler");
const responseModifier = require("./middleware/response-modifier");

const proxyUtils = require("./proxy/utils");

const PORT = process.env.PORT || 9001;
const fs = require("fs");
const path = require("path");
const certPath = path.join(__dirname, "..", "certs");

const defaultHttpProxyOptions = {
  /**
   * This ensures targets are more likely to
   * accept each request
   */
  changeOrigin: true,
  /**
   * This handles redirects
   */
  autoRewrite: true,
  /**
   * This allows our self-signed certs to be used for development
   */
  secure: false,
  ws: true
};

function test(proxyRes, req, res) {
  console.log(
    "RAW Response from the target",
    JSON.stringify(proxyRes.headers, true, 2)
  );
}

const ProxyOption = {
  route: "",
  target: "",
  rewriteRules: true,
  proxyReq: [],
  proxyRes: [test],
  cookies: {
    stripDomain: true
  },

  proxyReqWs: [],
  errHandler: undefined,
  url: "",
  ws: false,
  middleware: [],
  reqHeaders: undefined
};

// provide a server implementation
const getBaseApp = (mw = [], opts) => {
  const express = require("express");
  const app = express();

  app.set("trust proxy", true);

  mw.forEach(mw => {
    console.log(`Loading middleware [${mw.id}]`);
    app.use(mw(opts));
  });

  app.listen(opts.port, () => {
    console.info(`server listening on ${opts.port}`);
  });

  app.use(errorHandler);

  return app;
};

/**
 * Apply functions to proxy events
 * @param {string} name - the name of the http-proxy event
 * @param {Array} fns - functions to call on each event
 */
const applyFns = proxy => (name, fns) => {
  if (!Array.isArray(fns)) fns = [fns];
  proxy.on(name, function() {
    var args = arguments;
    fns.forEach(function(fn) {
      if (typeof fn === "function") {
        fn.apply(null, args);
      }
    });
  });
};

const main = () => {
  // proxy implementation
  const proxy = httpProxy.createProxyServer(defaultHttpProxyOptions);
  // allows us to bind to the proxy
  const applyToProxy = applyFns(proxy);
  const opts = ProxyOption;

  const proxyRes = getProxyResFunctions(opts.proxyRes, opts);
  const proxyReq = getProxyReqFunctions(opts.proxyReq, opts);
  const proxyResWs = opts.proxyReqWs;

  /**
   * Add any user provided functions for proxyReq, proxyReqWs and proxyRes
   */
  applyToProxy("proxyReq", proxyReq);
  applyToProxy("proxyRes", proxyRes);
  applyToProxy("proxyReqWs", proxyResWs);
  applyToProxy("error", [errorHandler]);

  proxy.on("proxyRes", function(proxyRes, req, res) {
    proxyRes.headers["x-frame-options"] =
      "allow-from " +
      `${req.secure ? "https" : "http"}://${req.headers.host} ${
        req.proxyTarget
      }`;
    proxyRes.headers["access-control-allow-origin"] = "*";
  });

  // get our server implementation
  const app = getBaseApp(
    [healthMiddleware, proxyTarget, responseModifier, proxyMiddleware],
    {
      port: PORT,
      proxy
    }
  );
};

main();

function getProxyResFunctions(resFns = [], opts) {
  if (opts.cookies.stripDomain) {
    return resFns.push(proxyUtils.checkCookies);
  }
  return resFns;
}

/**
 * @param reqFns
 * @returns {*}
 */
function getProxyReqFunctions(reqFns, opt, bs) {
  var reqHeaders = opt.reqHeaders;

  if (!reqHeaders) {
    return reqFns;
  }

  if (Map.isMap(reqHeaders)) {
    return reqFns.concat(function(proxyReq) {
      reqHeaders.forEach(function(value, key) {
        proxyReq.setHeader(key, value);
      });
    });
  }

  return reqFns;
}
