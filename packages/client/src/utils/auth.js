import * as auth0 from 'auth0-js';
import history from '../history'
import jwtDecode from 'jwt-decode';

export default class Auth {
  tokenRenewalTimeout;

  auth0 = new auth0.WebAuth({
    domain: process.env.REACT_APP_AUTH0_DOMAIN,
    clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
    redirectUri: process.env.REACT_APP_AUTH0_REDIRECT_URI,
    responseType: 'token id_token',
    scope: 'openid profile'
  });

  constructor() {
    this.scheduleRenewal();
  }

  scheduleRenewal() {
    let expiresAt = this.expiresAt;
    const timeout = expiresAt - Date.now();
    if (timeout > 0) {
      this.tokenRenewalTimeout = setTimeout(() => {
        this.renewSession();
      }, timeout);
    }
  }

  getExpiryDate() {
    return JSON.stringify(new Date(this.expiresAt));
  }

  login = () => {
    this.auth0.authorize();
  }

  loginWithGoogle = (redirectUri) => {
    this.auth0.authorize({
      connection: 'google-oauth2',
      scope: 'openid profile email'
    })
  }

  passwordlessLogin = (email, cb) => {
    this.auth0.authorize({
      connection: 'email',
      send: 'link',
      email
    }, cb)
  }

  handleAuthentication = () => {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
      } else if (err) {
        history.replace('/');
        console.log(err);
        alert(`Error: ${err.error}. Check the console for further details.`);
      }
    });
  }

  get webAuth() {
    return this.auth0;
  }

  getAccessToken = () => {
    return localStorage.getItem('accessToken');
  }

  getIdToken = () => {
    return localStorage.getItem('idToken');
  }

  getExpiresAt = () => {
    return localStorage.getItem('expiresAt');
  }

  getProfile = () => {
    const idToken = this.getIdToken();
    if (!idToken) {
      return null;
    }

    const decoded = jwtDecode(idToken);
    return decoded;
  }

  setSession = (authResult) => {

    // Set the time that the access token will expire at
    let expiresAt = (authResult.expiresIn * 1000) + new Date().getTime();


    localStorage.setItem('accessToken', authResult.accessToken);
    localStorage.setItem('idToken', authResult.idToken);
    localStorage.setItem('expiresAt', expiresAt);

    // schedule a token renewal
    this.scheduleRenewal();

    // navigate to the home route
    history.replace('/');
  }

  renewSession = () => {
    this.auth0.checkSession({}, (err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
      } else if (err) {
        this.logout();
        console.log(err);
      }
    });
  }

  clear = () => {
    // Remove isLoggedIn flag from localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('idToken');
    localStorage.removeItem('expiresAt');
  }

  logout = () => {
    // Remove tokens and expiry time
    this.accessToken = null;
    this.idToken = null;
    this.expiresAt = 0;

    this.clear();

    // Clear token renewal
    clearTimeout(this.tokenRenewalTimeout);


    // navigate to the home route
    history.replace('/');
  }

  isAuthenticated = () => {

    // Check whether the current time is past the
    // access token's expiry time
    let expiresAt = this.getExpiresAt();
    return expiresAt == null ? false : new Date().getTime() < expiresAt;
  }



}