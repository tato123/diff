"use strict";

const template = `
<html>
<head>
 <script>
    let retries = 0;
    const MAX_RETRIES = 10;
    const sendError = () => {
      window.parent.postMessage(
        {
          source: "getDiff-client",
          type: 'ERROR_LOADING'
        },
        "*"
      );
    }
 

    const interval = setInterval(() => {
      if (retries > MAX_RETRIES) {
        clearInterval(interval)
      }

      sendError();

     
      retries++;
    }, 100)

    sendError();
 </script>
</head>
</html>
`;

const middleware = (err, req, res, next) => {
  console.error(err.stack);

  res.setHeader(
    "x-frame-options",
    "allow-from " +
      `${req.secure ? "https" : "http"}://${req.headers.host} ${
        req.proxyTarget
      }`
  );

  res.status(200).send(template);
};

module.exports = middleware;
