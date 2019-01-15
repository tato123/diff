const utils = require("./proxy-utils");

// environment values not supported in lambda@edge
const SCRIPT_URL =
  "https://s3.amazonaws.com/getdiff-static-client/clientBridge.js";

const compose = (...fns) => input => {
  return fns.reduce((acc, fn) => fn(acc), input);
};

const rewriteHtml = (userOrigin, versionId) => html => {
  const rewrite = utils.rewriteLinks({ hostname: userOrigin }, versionId);
  var bound = rewrite.fn.bind(null, { headers: { host: versionId } }, {});
  var actual = html.replace(rewrite.match, bound);

  console.log(actual);

  return actual;
};

const injectScript = (versionId, isStyled = false) => html => {
  // 1. Inject the script content
  const jsUrl = SCRIPT_URL;
  const params = [
    "script",
    `data-version="${versionId}"`,
    `data-style=${isStyled}`,
    `src=${jsUrl}`
  ];

  const script = `<${params.join(" ")}></script>`;
  const re = /<\/body>(?![\s\S]*<\/body>[\s\S]*$)/i;
  const subst = `${script}</body>`;

  return html.replace(re, subst);
};

// handles javascript injection to our bridge
module.exports = (data, userOrigin, versionId, isStyled = false) =>
  compose(
    injectScript(versionId, isStyled),
    rewriteHtml(userOrigin, versionId)
  )(data);
