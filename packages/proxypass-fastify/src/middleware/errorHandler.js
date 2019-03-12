"use strict";
const ua = require("universal-analytics");

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
  const visitor = ua("UA-124426207-2");
  try {
    visitor.exception('Proxy Error', req.headers.host).send()
  } catch() {

  }
  

  console.error(err.stack);

  res.status(200).send(template);
};

module.exports = middleware;
