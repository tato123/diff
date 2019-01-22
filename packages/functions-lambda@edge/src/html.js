const utils = require("./proxy-utils");

// environment values not supported in lambda@edge
const SCRIPT_URL =
  "https://s3.amazonaws.com/getdiff-static-client/clientBridge.js";

const compose = (...fns) => input => {
  return fns.reduce((acc, fn) => fn(acc), input);
};

const rewriteHtml = (userOrigin, versionId) => html => {
  console.log("Rewriting html links....", userOrigin);
  const respondFn = (d, p = "") => {
    const rewrite = utils.rewriteLinks({ hostname: p + userOrigin }, versionId);
    var bound = rewrite.fn.bind(null, { headers: { host: versionId } }, {});
    var actual = html.replace(rewrite.match, bound);

    return actual;
  };

  // urls can be normalized due to the way
  // chrome now handles urls, we want to make sure
  // each url type is. This was just quicker than rewriting the regex again
  return respondFn(html);
};

const injectScript = (versionId, isStyled = false) => html => {
  console.log("Injecting scripts....");
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
module.exports = (data, originHost, versionHost, isStyled = false) =>
  compose(
    injectScript(versionHost, isStyled),
    rewriteHtml(originHost, versionHost)
  )(data);
