"use strict";

const lrSnippet = require("resp-modifier");
const proxyUtils = require("../proxy/utils");


const injectSnippet = (req, res, next) => {
  const url = process.env.SNIPPET_URL;
  const snippet = `<script async src="${url}"></script>`;

  const snippetOptions = {
    async: true,
    whitelist: [],
    blacklist: [],
    rule: {
      match: /<body[^>]*>/i,
      fn: (snippet, match) => {

        if (req.query.edit) {
          console.log('[response-modifier] is edit mode?', req.query)
          console.log('[response-modifier] path is ?', req.path)
          return match + snippet;
        }

        return match;
      }
    }
  };

  // inject our snipppet
  return {
    once: true,
    id: "diff-snippet",
    match: snippetOptions.rule.match,
    fn: function (req, res, match) {
      return snippetOptions.rule.fn.apply(null, [snippet, match]);
    }
  }
}

const injectCSS = (req, res, next) => {

  const snippet = `
    <style>
      * {
        color: green !important;
        font-size: 32px;
      }      
    </style>
  `

  const snippetOptions = {
    async: true,
    whitelist: [],
    blacklist: [],
    rule: {
      match: /<\/head[^>]*>/i,
      fn: (snippet, match) => {
        return match + snippet;
      }
    }
  };

  // inject our snipppet
  return {
    once: true,
    id: "diff-css",
    match: snippetOptions.rule.match,
    fn: function (req, res, match) {
      return snippetOptions.rule.fn.apply(null, [snippet, match]);
    }
  }
}




const middleware = opts => (req, res, next) => {
  console.log('[response-modifier] executing middleware');

  const rules = [];
  const blacklist = [];
  const whitelist = [];

  const hostname = req.proxyHostname;
  

  // inject snippet rules
  rules.push(injectSnippet(req, res, next));

  // inject CSS rules
  rules.push(injectCSS(req, res, next));
  
  // inject the proxy rules
  rules.push(proxyUtils.rewriteLinks({ hostname }));

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
