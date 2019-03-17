import React from 'react';
import {
    Route,
    Redirect,
} from "react-router-dom";


const PrivateRoute = ({ auth, component: Component, ...rest }) => {
    return (
        <Route
            {...rest}
            render={props =>
                auth.isAuthenticated() ? (
                    <Component {...props} />
                ) : (
                        <Redirect
                            to={{
                                pathname: "/login",
                                state: { from: props.location }
                            }}
                        />
                    )
            }
        />
    );
}


export default PrivateRoute;