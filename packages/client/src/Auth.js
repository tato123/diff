import auth0 from 'auth0-js';

class Auth {
  constructor() {
    this.auth0 = new auth0.WebAuth({
      domain: process.env.REACT_APP_AUTH0_DOMAIN,
      clientID: process.env.REACT_APP_AUTH0_CLIENTID,
      redirectUri: process.env.REACT_APP_AUTH0_CALLBACK,
      audience: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/userinfo`,
      responseType: 'token id_token',
      scope: 'openid email'
    });

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
  }

  login() {
    this.auth0.authorize();
  }

  getIdToken() {
    return localStorage.getItem('idToken');
  }

  handleAuthentication() {
    return new Promise((resolve, reject) => {
      this.auth0.parseHash((err, authResult) => {
        if (err) return reject(err);
        if (!authResult || !authResult.idToken) {
          return reject(err);
        }
        this.setSession(authResult);
        resolve();
      });
    })
  }

  setSession(authResult) {
    localStorage.setItem('idToken', authResult.idToken)
    localStorage.setItem('accessToken', authResult.accessToken)
    localStorage.setItem('expiresIn', authResult.expiresIn)
    
    // set the time that the id token will expire at
    const expiresAt = authResult.expiresIn * 1000 + new Date().getTime();
    localStorage.setItem('expiresAt', expiresAt)
  }

  logout() {
    this.auth0.logout({
      returnTo: process.env.REACT_APP_AUTH0_RETURN_TO,
      clientID: process.env.REACT_APP_AUTH0_CLIENTID,
    });
  }

  silentAuth() {
    return new Promise((resolve, reject) => {
      this.auth0.checkSession({}, (err, authResult) => {
        if (err) return reject(err);
        this.setSession(authResult);
        resolve();
      });
    });
  }

  isAuthenticated() {
    const expiresAt = JSON.parse(localStorage.getItem('expiresAt'));
    // Check whether the current time is past the token's expiry time
    return new Date().getTime() < expiresAt;
  }
}

const auth = new Auth();

export default auth;