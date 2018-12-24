const { GraphQLServer } = require("graphql-yoga");
const path = require("path");
const resolvers = require('./resolvers');
const pubsub = require('./pubsub');

const port = process.env.PORT || 8080;

const options = {
  port,
  endpoint: "/graphql",
  bodyParserOptions: {
    limit: "50mb",
    extended: true
  }
};

const server = new GraphQLServer({
  typeDefs: path.resolve(__dirname, "./schema.graphql"),
  resolvers,
  context: { pubsub } 
});

server.start(options, () =>
  console.log(`Server is running on localhost:${port}`)
);
