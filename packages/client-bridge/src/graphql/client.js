import ApolloClient from "apollo-boost";

const client = new ApolloClient({
  uri: "http://localhost:8081/graphql"
});

export default client;
