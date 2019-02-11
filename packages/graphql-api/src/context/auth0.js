
const jwt = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");

const client = jwksClient({
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
  });
  
  function getKey(header, cb) {
    client.getSigningKey(header.kid, function(err, key) {
      var signingKey = key.publicKey || key.rsaPublicKey;
      cb(null, signingKey);
    });
  }
  

  const options = {
    audience: process.env.AUTH0_CLIENT_ID,
    issuer: `https://${process.env.AUTH0_DOMAIN}/`,
    algorithms: ["RS256"]
  };
  
  const getUser = async ({ request: req }) => {
    //   if (!req.headers) {
    //     console.log("No user sent");
    //     return null;
    //   }
  
    //   // simple auth check on every request
    //   const token = req.headers.authorization;
    //   const user = new Promise((resolve, reject) => {
    //     jwt.verify(token, getKey, options, (err, decoded) => {
    //       if (err) {
    //         return reject(err);
    //       }
    //       resolve(decoded.email);
    //     });
    //   });
  
    //   return user;
    return null;
  };

  module.exports = async req => {
    const user = await getUser(req);
    console.log("Returned user", user);
  }