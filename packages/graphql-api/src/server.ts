import { GraphQLServer } from 'graphql-yoga';
import path = require("path");
import resolvers = require("./resolvers");
import context from "./context";
import webhooks from './webhooks'
import getUser from './context/auth0';
import _ from 'lodash';


const port = process.env.PORT || 8081;

const options = {
  port,
  endpoint: "/graphql",
  subscriptions: {
    path: "/graphql",
    onConnect: async (connectionParams) => {
      const idToken = _.get(connectionParams, 'idToken', null);
      const user = await getUser(idToken);

      // update our context
      return {
        user
      }
    }
  },
  bodyParserOptions: {
    limit: "50mb",
    extended: true
  },
  debug: true
};

const server = new GraphQLServer({
  typeDefs: path.resolve(__dirname, "../schema.graphql"),
  resolvers,
  context
});

server.start(options, () =>
  console.log(`Server is running on localhost:${port}`)
);

const bodyParser = require('body-parser');
server.express.use(bodyParser.json())
// register our hooks
webhooks(server)