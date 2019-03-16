import React from "react";
import ReactGA from "react-ga";
import {  Router, Route, Switch } from "react-router-dom";
import { injectGlobal, ThemeProvider } from "styled-components";
import AuthCallback from './features/auth/callback';
import Login from './features/auth/login';
import Designer from "./features/designer";
import Home from "./features/home";
import Search from "./features/search";
import history from './history';
import Auth from './utils/auth';


import "@atlaskit/css-reset/dist/bundle.css";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import "./normalize.css";


const auth = new Auth();

const handleAuthentication = (nextState, replace) => {
  if (/access_token|id_token|error/.test(nextState.location.hash)) {
    auth.handleAuthentication();
  }
}


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

  #root {
    position: relative;
  }

`;

export default () => (
  <ThemeProvider theme={{}}>
    <React.Fragment>
      <Router history={history}>
        <Switch>
          <Route exact path="/edit" render={props => <Designer auth={auth} {...props} /> } />
          <Route exact path="/login" render={props => <Login auth={auth} {...props} /> } />
          <Route path="/callback" render={(props) => {
          handleAuthentication(props);
          return <AuthCallback {...props} /> 
        }}/>
          <Route exact path="/search" component={Search} />
          <Route exact path="/" component={Home} />
        </Switch>
      </Router>
    </React.Fragment>
  </ThemeProvider>
);
