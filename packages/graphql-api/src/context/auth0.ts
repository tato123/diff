
import jwt = require("jsonwebtoken");
import jwksClient = require("jwks-rsa");
import _ from 'lodash';

const client = jwksClient({
  jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
});

const getKey = (header, cb) => {
  client.getSigningKey(header.kid, function (err, key) {
    var signingKey = key.publicKey || key.rsaPublicKey;
    cb(null, signingKey);
  });
}


const options = {
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ["RS256"]
};

const getUser = ({ request: req }) => async () => {
  const bearer = _.get(req, 'headers.authorization');

  if (!bearer) {
    console.log("No user sent");
    return null;
  }


  const [_header, jwtToken] = bearer.split(' ');
  console.log(jwtToken)
  // simple auth check on every request
  const user = new Promise((resolve, reject) => {
    jwt.verify(jwtToken, getKey, options, (err, decoded) => {
      if (err) {
        console.error(err)
        return resolve(null);
      }
      resolve(decoded);
    });
  });

  return user;
};



export default getUser;