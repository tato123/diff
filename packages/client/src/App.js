import React from "react";
import "@atlaskit/css-reset/dist/bundle.css";

import Landing from "./features/landing";
import Designer from "./features/designer";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { injectGlobal, ThemeProvider } from "styled-components";
import "react-toastify/dist/ReactToastify.css";

import ReactGA from "react-ga";

if (process.env.NODE_ENV === "production") {
  ReactGA.initialize("UA-124426207-2");
  ReactGA.pageview(window.location.pathname + window.location.search);
}

injectGlobal`
  html, body, #root {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
  }

  body {
    margin-top: -16px;
  }

  #root {
    position: relative;
  }

`;

export default () => (
  <ThemeProvider theme={{}}>
    <React.Fragment>
      <Router>
        <Switch>
          <Route exact path="/edit" component={Designer} />
          <Route exact path="/" component={Landing} />
        </Switch>
      </Router>
    </React.Fragment>
  </ThemeProvider>
);
