import React, { Component } from "react";
import "@atlaskit/css-reset/dist/bundle.css";

import Designer from "./components/Designer";
// import Callback from "./components/Callback";
// import GuardedRoute from "./components/GuardedRoute";
// import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// // export default class App extends Component {
// //   render() {
// //     return (
// //       <Router>
// //         <Switch>
// //           <GuardedRoute exact path='/' component={Designer} />
// //           <Route exact path='/callback' component={Callback} />
// //         </Switch>
// //       </Router>
// //     );
// //   }
// }

export default () => <Designer />;
