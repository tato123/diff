"use strict";

const lrSnippet = require("resp-modifier");
const proxyUtils = require("../proxy/utils");
const { request } = require("graphql-request");




const getDeltas =  (host) => {
  const GET_DELTAS = `
  query getDeltas($host: String!) {
    deltas(Host: $host) {
      host
      changes
      css
    }
  }
`;

  const variables = {
    host
  };

  console.log("Querying with variables", variables);

  return request(process.env.GRAPHQL_ENDPOINT, GET_DELTAS, variables)
    .then(data => {
      if ( data && data.deltas && data.deltas.css) {
        return data.deltas.css;
      }
      return '';
    })
    .catch (err => {
      return '';
    })
}


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

const injectCSS = (changes) =>  (req, res, next) => {

  const snippet = changes.length > 0 ? `<style>${changes}</style>` : '';
  console.log('-----------------------------------\n')
  console.log(snippet)
  console.log('-----------------------------------\n\n\n')

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




const middleware = opts =>  async (req, res, next) => {
  console.log('[response-modifier] executing middleware');

  const rules = [];
  const blacklist = [];
  const whitelist = [];

  const hostname = req.proxyHostname;
  const changes = await getDeltas(req.headers.host);
  

  // inject snippet rules
  rules.push(injectSnippet(req, res, next));

  // inject CSS rules
  rules.push(injectCSS(changes)(req, res, next));
  
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
