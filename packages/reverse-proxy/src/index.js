const browsersync = require("./bs-proxy");

// load all of our necessary scripts
const express = require("express");
const cors = require("cors");
const proxy = require("http-proxy-middleware");

// configure our outbound port
const port = process.env.PORT || 8080;
const app = express();

const removeRoute = require("express-remove-route");

let reserved = false;

app.use(cors({ origin: true }));

app.get("/", (req, res, next) => {
  if (!reserved) {
    return res.status(200).send("no reservation present");
  }
  next();
});

app.get("/_ah/start", (req, res) => {
  res.status(200).send("no reservation present");
});

app.get("/_ah/health", (req, res) => {
  res.status(200).send("ok");
});

/**
 * Reserves an instance against a particular target
 */
app.get("/reserve", (req, res) => {
  const proxyTarget = req.query.proxyTarget;
  if (!proxyTarget) {
    return res.status(400).send("proxyTarget query param required");
  }

  const script = req.query.script;
  if (!script) {
    return res.status(400).send("script query param required");
  }

  browsersync(decodeURIComponent(proxyTarget), decodeURIComponent(script))
    .then(bs => {
      const external = bs.options.get("urls").get("external");
      console.log("running external at", external);

      // proxy middleware options
      var options = {
        target: external,
        ws: true,
        secure: false
      };

      // create the proxy (without context)
      var exampleProxy = proxy(options);
      removeRoute(app, "/");
      app.use("/", exampleProxy);

      reserved = true;

      res.status(200).send(external);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send(err.message);
    });
});

var server = app.listen(port, () => {
  console.log("running");
});
