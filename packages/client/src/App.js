import React from "react";
import ReactGA from "react-ga";
import { Router, Route, Switch } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import AuthCallback from './features/auth/callback';
import Login from './features/auth/login';
import Designer from "./features/designer";
import Home from "./features/home";
import Search from "./features/search";
import Account from './features/account'
import history from './history';
import PrivateRoute from './components/PrivateRoute';
import AuthContext, { auth } from './utils/context'

import "@atlaskit/css-reset/dist/bundle.css";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import "./normalize.css";



const handleAuthentication = (nextState, replace) => {
  if (/access_token|id_token|error/.test(nextState.location.hash)) {
    auth.handleAuthentication();
  }
}


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
            <Route path="/callback" render={(props) => {
              handleAuthentication(props);
              return <AuthCallback {...props} />
            }} />
            <Route exact path="/search" component={Search} />
            <Route exact path="/" component={Home} />
            <PrivateRoute auth={auth} path="/account" component={Account} />
          </Switch>
        </Router>
      </React.Fragment>
    </AuthContext.Provider>
  </ThemeProvider>
);


export default App;