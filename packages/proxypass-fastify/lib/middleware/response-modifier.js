"use strict";

const lrSnippet = require("resp-modifier");
const validator = require("./validate");

const middleware = opts => (req, res, next) => {
  const rules = [];
  const blacklist = [];
  const whitelist = [];

  const hostname = req.proxyHostname;

  // inject our snipppet

  // inject any additional rules

  // inject the proxy rules

  const proxyRule = require("../proxy/utils").rewriteLinks({ hostname });
  rules.push(proxyRule);

  const lr = lrSnippet.create({
    rules: rules,
    blacklist: blacklist,
    whitelist: whitelist
  });

  return lr.middleware(req, res, next);
};

module.exports = {
  id: "Response Modifier",
  route: "",
  handle: middleware
};
