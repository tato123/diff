import { GraphQLServer } from 'graphql-yoga';
import path = require("path");
import resolvers = require("./resolvers");
import context from "./context";

const port = process.env.PORT || 8081;

const options = {
  port,
  endpoint: "/graphql",
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