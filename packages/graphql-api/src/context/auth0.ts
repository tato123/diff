import jwt = require("jsonwebtoken");
import jwksClient = require("jwks-rsa");
import _ from "lodash";

const client = jwksClient({
  jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
});

const getKey = (header, cb) => {
  client.getSigningKey(header.kid, function(err, key) {
    if (err) {
      console.error("There was an error retrieving the signing key", err);
      return cb(err);
    }

    var signingKey = key.publicKey || key.rsaPublicKey;
    cb(null, signingKey);
  });
};

const options = {
  audience: "https://diff/dev",
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ["RS256"]
};

export interface User {
  sub: string;
  picture?: string;
  email?: string;
}

const getUser = (jwtToken: string): Promise<User | null> => {
  if (!jwtToken) {
    console.log("No user sent");
    return Promise.resolve(null);
  }

  // simple auth check on every request
  return new Promise((resolve, reject) => {
    jwt.verify(jwtToken, getKey, options, (err, decoded) => {
      if (err) {
        console.error(err);
        return resolve(null);
      }
      resolve(decoded);
    });
  });
};

export default getUser;
