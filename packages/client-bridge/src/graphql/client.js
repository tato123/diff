import ApolloClient from "apollo-boost";

const client = new ApolloClient({
  uri: process.env.GRAPHQL_HTTP_SERVER
});

export default client;
