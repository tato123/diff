
import pubsub from "./pubsub";
import getUser from './auth0';

const graphqlContext = (req) => {
  return {
    pubsub,
    getUser: getUser(req)
  }
}

export default graphqlContext;