const browsersync = require("./bs-proxy");
const proxy = require("http-proxy-middleware");
const removeRoute = require("express-remove-route");

// load all of our necessary scripts
const express = require("express");
const cors = require("cors");

// configure our outbound port
const port = process.env.PORT || 9000;
const app = express();

let reserved = false;

app.use(cors({ origin: true }));

const browserSyncMiddleware = (req, res) => {
  const proxyTarget = req.query.proxyTarget;
  if (!proxyTarget) {
    return res.status(400).send("proxyTarget query param required");
  }

  const script = req.query.script;
  if (!script) {
    return res.status(400).send("script query param required");
  }

  browsersync
    .create(decodeURIComponent(proxyTarget), decodeURIComponent(script))
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
};

app.get("/", (req, res, next) => {
  if (!reserved) {
    return res.status(200).send("no reservation present");
  }
  next();
});

app.get("/_ah/start", async (req, res) => {
  const version = process.env.GAE_VERSION;
  console.log("Proxy server received start request");
  if (version) {
    console.log("Proxy server checking for a reservation for version", version);

    // on start, check if this is a reserved instance
    const reservation = await browsersync.getReservation(version);

    if (reservation != null) {
      console.log("Found an existing reservation for version", version);
      console.log("Version info", reservation);
      req.query.proxyTarget = encodeURIComponent(reservation.proxyTarget);
      req.query.script = encodeURIComponent(reservation.script);
      return browserSyncMiddleware(req, res);
    } else {
      console.log("No reservation found");
    }
  }

  if (!version) {
    console.log("No version defined");
  }

  res.status(200).send("no reservation present");
});

app.get("/_ah/health", (req, res) => {
  res.status(200).send("ok");
});

/**
 * Reserves an instance against a particular target
 */
app.get("/reserve", browserSyncMiddleware);

var server = app.listen(port, () => {
  console.log(`Proxy server started on port ${port}`);
});
