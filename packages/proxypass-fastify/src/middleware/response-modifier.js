"use strict";

const lrSnippet = require("resp-modifier");

const middleware = opts => (req, res, next) => {
  console.log('[response-modifier] executing middleware');

  const rules = [];
  const blacklist = [];
  const whitelist = [];

  const hostname = req.proxyHostname;

  const url =
    "https://s3.amazonaws.com/clientbridge-www.stage-getdiff.app/clientBridge.js";
  const snippet = `<script async src="${url}"></script>`;

  const snippetOptions = {
    async: true,
    whitelist: [],
    blacklist: [],
    rule: {
      match: /<body[^>]*>/i,
      fn: function(snippet, match) {
        return match + snippet;
      }
    }
  };

  // inject our snipppet
  rules.push({
    once: true,
    id: "diff-snippet",
    match: snippetOptions.rule.match,
    fn: function(req, res, match) {
      return snippetOptions.rule.fn.apply(null, [snippet, match]);
    }
  });

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
