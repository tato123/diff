"use strict";

const Fastify = require("fastify");
const httpProxy = require("http-proxy");

const proxyTarget = require("./middleware/proxyTarget");
const proxyMiddleware = require("./middleware/proxy");
const healthMiddleware = require("./middleware/health");
const responseModifier = require("./middleware/response-modifier");

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
  ws: true,

};

// provide a server implementation
const getBaseApp = (mw = [], opts) => {
  const fastify = Fastify({
    logger: true,
    trustProxy: true,
    https: {
      key: fs.readFileSync(path.join(certPath, "server.key")),
      cert: fs.readFileSync(path.join(certPath, "server.crt")),
      ca: fs.readFileSync(path.join(certPath, "server.csr")),
      passphrase: ""
    }
  });


  mw.forEach(mw => {
    fastify.use(mw.handle(opts));
  });

  // fastify.setErrorHandler((error, request, reply) => {
  //   // Send error response
  //   console.log("an error occured");
  //   reply.send("error occured" + error);
  // });

  fastify.listen(opts.port,  (err, address) => {
    if (err) {
      fastify.log.error(err);
    }
    fastify.log.info(`server listening on ${address}`);
  });

  return fastify;
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

const proxyError = (err, req, res) => {
  console.error("An error occured proxying", err);
};

const main = () => {
  // proxy implementation
  const proxy = httpProxy.createProxyServer(defaultHttpProxyOptions);
  // allows us to bind to the proxy
  const applyToProxy = applyFns(proxy);


  /**
   * Add any user provided functions for proxyReq, proxyReqWs and proxyRes
   */
  // applyFns("proxyReq", proxyReq);
  // applyFns("proxyRes", proxyRes);
  // applyFns("proxyReqWs", proxyResWs);
  applyToProxy("error", [proxyError]);

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
