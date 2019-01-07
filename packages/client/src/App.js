import React, { Component } from "react";
import "@atlaskit/css-reset/dist/bundle.css";

import AddSite from "./features/addSite";
import Designer from "./features/designer";
// import Callback from "./components/Callback";
// import GuardedRoute from "./components/GuardedRoute";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { createGlobalStyle, ThemeProvider } from "styled-components";

const GlobalStyle = createGlobalStyle`
  html, body, #root {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
  }


`;

export default () => (
  <ThemeProvider theme={{}}>
    <React.Fragment>
      <Router>
        <Switch>
          <Route exact path="/edit" component={Designer} />
          <Route exact path="/" component={AddSite} />
        </Switch>
      </Router>
      <GlobalStyle whiteColor />
    </React.Fragment>
  </ThemeProvider>
);
