import React from "react";
import { ApolloProvider } from "react-apollo";

import Dialog from "./Dialog";
import { Router, Route, Switch } from "react-router";
import history from "../history";
import Login from "./Login";
import Export from "./Export";

import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createUploadLink } from "apollo-upload-client";

import styled from "styled-components";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: createUploadLink({ uri: "http://localhost:8081/graphql" })
});

export default class App extends React.Component {
  componentDidCatch(error) {
    // in the future display an error to the user
    console.log(error);
  }

  render() {
    const {
      props: { dialog, selection }
    } = this;

    return (
      <ApolloProvider client={client}>
        <Router history={history}>
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={Dialog} />
            <Route
              render={() => <Export dialog={dialog} selection={selection} />}
            />
          </Switch>
        </Router>
      </ApolloProvider>
    );
  }
}
