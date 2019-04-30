import getUser from "./auth0";
import _ from "lodash";

const graphqlContext = async ({ req, connection }) => {
  console.log("checking for user");
  // if we already have a context, from an alternate connection
  // use that
  if (connection) {
    console.log("[context] received a connection");
    // check connection for metadata
    return connection.context;
  }

  const bearer = _.get(req, "headers.authorization", "");
  const [_header, jwtToken] = bearer.split(" ");
  const user = await getUser(jwtToken);
  return {
    user
  };
};

export default graphqlContext;
