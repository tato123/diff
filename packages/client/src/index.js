import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { split } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";
import { ApolloProvider } from "react-apollo";
// import { setContext } from "apollo-link-context";

import "normalize.css";


// const authLink = setContext((_, { headers }) => {
//   // return the headers to the context so httpLink can read them
//   return {
//     headers: {
//       ...headers,
//       authorization: auth.getIdToken()
//     }
//   };
// });

// Create an http link:
const httpLink = new HttpLink({
  uri: process.env.REACT_APP_GRAPHQL_HTTP_SERVER
});

// Create a WebSocket link:
const wsLink = new WebSocketLink({
  uri: process.env.REACT_APP_GRAPHQL_WS_SERVER,
  options: {
    reconnect: true
  }
  // connectionParams: () => ({
  //   authorization: `Bearer ${localStorage.getItem('mytoken')}`,
  // }),
});

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === "OperationDefinition" && operation === "subscription";
  },
  wsLink,
  httpLink
);

const cache = new InMemoryCache();

const client = new ApolloClient({
  link,
  cache
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
