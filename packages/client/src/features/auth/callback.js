import React, { useContext } from 'react';
import AuthContext from '../../utils/context';
import { Redirect } from 'react-router';
import AuthenticationLayout from '../../components/Layouts/Authentication'


const AuthCallback = ({ location }) => {
  const auth = useContext(AuthContext);

  // check if we are already authenticated
  if (auth.isAuthenticated()) {
    auth.handleRedirect();
  }

  // check if we have the required values
  if (/access_token|id_token|error/.test(location.hash)) {
    auth.handleAuthentication(location.hash);

    return (<AuthenticationLayout>
      <label>Logging in...</label>
    </AuthenticationLayout>)
  }


  // if we don't boot them out of this page to login
  return <Redirect to="/login" />


}




export default AuthCallback;