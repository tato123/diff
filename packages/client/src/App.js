import React from "react";
import ReactGA from "react-ga";
import { Router, Route, Switch } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import AuthCallback from './features/auth/callback';
import Login from './features/auth/login';
import Designer from "./features/designer";
import Dashboard from './features/dashboard';
import Home from "./features/home";
import Search from "./features/search";
import Account from './features/account'
import history from './history';
import PrivateRoute from './components/PrivateRoute';
import AuthContext, { auth } from './utils/context'
import PrivacyPolicy from './features/privacy/policy';
import TOSPolicy from './features/privacy/tos';

import 'antd/dist/antd.css';


if (process.env.NODE_ENV === "production") {
  ReactGA.initialize("UA-124426207-2");
  ReactGA.pageview(window.location.pathname + window.location.search);
}

const App = () => (
  <ThemeProvider theme={{}}>
    <AuthContext.Provider value={auth}>
      <React.Fragment>
        <Router history={history}>
          <Switch>
            <Route exact path="/edit" render={props => <Designer auth={auth} {...props} />} />
            <Route exact path="/login" component={Login} />
            <Route path="/callback" component={AuthCallback} />
            <Route exact path="/search" component={Search} />
            <Route exact path="/" component={Home} />
            <Route exact path="/privacy" component={PrivacyPolicy} />
            <Route exact path="/tos" component={TOSPolicy} />
            <PrivateRoute auth={auth} path="/account" component={Account} />
            <PrivateRoute auth={auth} path="/dashboard" component={Dashboard} />
          </Switch>
        </Router>
      </React.Fragment>
    </AuthContext.Provider>
  </ThemeProvider>
);


export default App;