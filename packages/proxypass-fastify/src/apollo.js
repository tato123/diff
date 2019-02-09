const graphql = require("graphql-request");

const endpoint =
  process.env.GRAPHQL_ENDPOINT || "http://localhost:8081/graphql";

// ... or create a GraphQL client instance to send requests
const client = new graphql.GraphQLClient(endpoint, { headers: {} });

module.exports = client;
