import * as auth0 from 'auth0-js';
import history from '../history'
import jwtDecode from 'jwt-decode';
import _ from 'lodash';



export default class Auth {
  tokenRenewalTimeout;

  auth0 = new auth0.WebAuth({
    domain: process.env.REACT_APP_AUTH0_DOMAIN,
    clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
    redirectUri: process.env.REACT_APP_AUTH0_REDIRECT_URI,
    responseType: 'code',
    audience: 'https://diff/dev',
    scope: 'openid profile email'
  });

  constructor() {
    this.scheduleRenewal();
  }

  scheduleRenewal() {
    let expiresAt = this.getExpiresAt();
    const timeout = expiresAt - Date.now();
    if (timeout > 0) {
      this.tokenRenewalTimeout = setTimeout(() => {
        this.renewSession();
      }, timeout);
    }
  }

  rememberPage = () => {
    localStorage.setItem('diff_redirectTo', document.referrer);
  }

  login = () => {
    this.rememberPage();
    this.auth0.authorize();
  }

  loginWithGoogle = (redirectUri) => {
    this.rememberPage();
    this.auth0.authorize({
      connection: 'google-oauth2',
      scope: 'openid profile email'
    })
  }

  loginWithEmail = (email, password) => {
    this.rememberPage();
    this.auth0.redirect.loginWithCredentials({
      connection: 'Username-Password-Authentication',
      username: email,
      password: password,
    });

  }

  passwordlessLogin = (email) => {
    this.rememberPage();

    return new Promise((resolve, reject) => {
      this.auth0.passwordlessStart({
        connection: 'email',
        send: 'link',
        email,
        responseType: 'code',
      }, (err, res) => {
        if (err) {
          return reject(err)
        }
        return resolve(res);
      })
    })

  }

  signup = (email, password) => {

    return new Promise((resolve, reject) => {
      this.auth0.signup({
        connection: 'Username-Password-Authentication',
        email,
        password,
      }, (err, data) => {
        if (err) {
          return reject(err);
        }
        this.loginWithEmail(email, password)
        return resolve(data);
      });
    });

  }

  handleAuthentication = (hash, state = "diff_app") => {
    this.auth0.parseHash({ hash, state }, (err, authResult) => {
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
    const val = localStorage.getItem('expiresAt');
    return !!val ? parseInt(val) : null;
  }

  getProfile = () => {
    const val = localStorage.getItem('userProfile');
    if (val) {
      try {
        return JSON.parse(val);
      } catch (e) {
        return null;
      }
    }
    const idToken = this.getIdToken();

    return !_.isNil(idToken) && jwtDecode(idToken);

  }

  getExp = () => {
    const idToken = this.getIdToken();
    return !_.isNil(idToken) && jwtDecode(idToken).exp;
  }

  setSession = (authResult) => {
    let expiresAt = (authResult.expiresIn * 1000) + new Date().getTime();

    localStorage.setItem('accessToken', authResult.accessToken);
    localStorage.setItem('idToken', authResult.idToken);

    const decodedIdToken = jwtDecode(authResult.idToken);

    localStorage.setItem('expiresAt', expiresAt);
    localStorage.setItem('userProfile', JSON.stringify(decodedIdToken));

    // schedule a token renewal
    this.scheduleRenewal();
    this.handleRedirect();

  }

  handleRedirect = () => {
    // navigate to the home route
    const lastPage = localStorage['diff_redirectTo'];
    if (lastPage) {
      delete localStorage['diff_redirectTo'];
      window.location.replace(lastPage);
    } else {
      history.replace('/account')
    }
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
    localStorage.removeItem('userProfile');
  }

  logout = () => {
    this.clear();

    // Clear token renewal
    clearTimeout(this.tokenRenewalTimeout);


    // navigate to the home route
    history.replace('/');
  }

  isAuthenticated = () => {

    const exp = this.getExp();
    if (_.isNil(exp)) {
      return false;
    }

    const dateNow = new Date().getTime() / 1000;
    const val = exp < dateNow;
    return !val;
  }



}