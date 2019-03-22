import * as Users from '../aws/tables/Users';
import { client } from '../context/pubsub'
const passport = require('passport');
const querystring = require('querystring');



const Auth0Strategy = require('passport-auth0');
const strategy = new Auth0Strategy({
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL: '/auth/callback',
    state: false
},
    async (accessToken, refreshToken, extraParams, profile, done) => {

        try {
            await Users.createUidIfNotExists(profile.id)
            return done(null, extraParams);
        } catch (err) {

            return done(err.message)
        }

    }
);

passport.use(strategy)

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

/**
 * We need to rely on our testing suite to handle these
 */
export default ({ express: app }) => {
    app.use(passport.initialize());

    // we can 
    app.get('/auth/callback',
        passport.authenticate('auth0', { failureRedirect: 'http://localhost:9010/login' }),
        function (req, res) {
            const token = {
                ...req.user,
                state: "diff_app"
            }

            // Successful authentication, redirect home.
            res.redirect(301, `http://localhost:9010/callback#${querystring.stringify(token)}`);
        });


}



