var url = require("url");

module.exports.rewriteLinks = function(userServer) {
  var host = userServer.hostname;
  var string = host;
  var port = userServer.port;

  if (host && port) {
    if (parseInt(port, 10) !== 80) {
      string = host + ":" + port;
    }
  }

  var reg = new RegExp(
    // a simple, but exact match
    "https?:\\\\/\\\\/" +
      string +
      "|" +
      // following ['"] + exact
      "('|\")\\/\\/" +
      string +
      "|" +
      // exact match with optional trailing slash
      "https?://" +
      string +
      "(?!:)(/)?" +
      "|" +
      // following ['"] + exact + possible multiple (imr srcset etc)
      "('|\")(https?://|/|\\.)?" +
      string +
      "(?!:)(/)?(.*?)(?=[ ,'\"\\s])",
    "g"
  );

  return {
    match: reg,
    //match: new RegExp("https?:\\\\/\\\\/" + string + "|https?://" + string + "(\/)?|('|\")(https?://|/|\\.)?" + string + "(\/)?(.*?)(?=[ ,'\"\\s])", "g"),
    //match: new RegExp("https?:\\\\?/\\\\?/" + string + "(\/)?|('|\")(https?://|\\\\?/|\\.)?" + string + "(\/)?(.*?)(?=[ ,'\"\\s])", "g"),
    //match: new RegExp('https?://' + string + '(\/)?|(\'|")(https?://|/|\\.)?' + string + '(\/)?(.*?)(?=[ ,\'"\\s])', 'g'),
    //match: new RegExp("https?:\\\\/\\\\/" + string, "g"),
    fn: function(req, res, match) {
      var proxyUrl = req.headers["host"];

      /**
       * Reject subdomains
       */
      if (match[0] === ".") {
        return match;
      }

      var captured = match[0] === "'" || match[0] === '"' ? match[0] : "";

      /**
       * allow http https
       * @type {string}
       */
      var pre = "//";

      if (match[0] === "'" || match[0] === '"') {
        match = match.slice(1);
      }

      /**
       * parse the url
       * @type {number|*}
       */
      var out = url.parse(match);

      /**
       * If host not set, just do a simple replace
       */
      if (!out.host) {
        string = string.replace(/^(\/)/, "");
        return captured + match.replace(string, proxyUrl);
      }

      /**
       * Only add trailing slash if one was
       * present in the original match
       */
      if (out.path === "/") {
        if (match.slice(-1) === "/") {
          out.path = "/";
        } else {
          out.path = "";
        }
      }

      /**
       * Finally append all of parsed url
       */
      return [captured, pre, proxyUrl, out.path || "", out.hash || ""].join("");
    }
  };
};
