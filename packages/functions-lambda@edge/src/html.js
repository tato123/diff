const utils = require("./proxy-utils");
const dynamoDb = require('./dynamo');

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

const injectScript = (versionId, isEditMode) => html => {
  
  // do not inject if we are not in edit mode
  if (!isEditMode) {
    return html;
  }
  
  console.log("Injecting scripts....");
  // 1. Inject the script content
  const jsUrl = SCRIPT_URL;
  const params = [
    "script",
    `data-version="${versionId}"`,
    `data-edit=${isEditMode}`,
    `src=${jsUrl}`
  ];

  const script = `<${params.join(" ")}></script>`;
  const re = /<\/body>(?![\s\S]*<\/body>[\s\S]*$)/i;
  const subst = `${script}</body>`;

  return html.replace(re, subst);
};

const injectStyles = (versionId, isEditMode) => html => {

  if (isEditMode) {
    console.log('Editing, skipping style injection');
    return html;
  }
 
  const params = {
    TableName: 'Deltas',
    Key: {
      Host: {
        VersionUrl: versionId
      }
    }
  };

  return new Promise((resolve, reject) => {
    dynamoDb.getItem(params, function (err, data) {
      if (err) {
        console.log(err, err.stack); // an error occurred
        return resolve(null);
      } else if (!data.Item) {
        console.log("No mapping origin found");
        return resolve(null);
      }
      const css = data.Item.CSS.S;
      const style = `<style>${css}</style>`;
      const re = /<\/head>(?![\s\S]*<\/head>[\s\S]*$)/i;
      const subst = `${style}</head>`;
      const replacedHtml =  html.replace(re, subst);
      return resolve(replacedHtml);
    });
  })
  


  
}

// handles javascript injection to our bridge
module.exports = (data, originHost, versionHost, isEditMode) =>
  compose(
    injectScript(versionHost, isEditMode),
    injectStyles(versionHost, isEditMode),
    rewriteHtml(originHost, versionHost)
  )(data);
