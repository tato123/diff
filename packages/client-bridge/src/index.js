import React from "react";
import ReactDOM from "react-dom";

import App from "./components/App";

import { ApolloProvider } from "react-apollo";
import ApolloClient from "apollo-boost";

const client = new ApolloClient({
  uri: process.env.GRAPHQL_HTTP_SERVER
});

function render(element) {
  ReactDOM.render(
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>,
    element
  );
}

// create our application
function bootstrap() {
  const element = document.createElement("div");
  element.id = "df_root_00001";
  document.body.appendChild(element);
  return Promise.resolve(element);
}

bootstrap().then(render);
