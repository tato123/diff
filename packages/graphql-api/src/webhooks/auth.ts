import * as Users from '../aws/tables/Users';
const passport = require('passport');
const querystring = require('querystring');



const Auth0Strategy = require('passport-auth0');
const strategy = new Auth0Strategy({
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL: `${process.env.API_URL}/auth/callback`,
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
        passport.authenticate('auth0', { failureRedirect: `${process.env.WEB_APP}/login` }),
        function (req, res) {
            const token = {
                ...req.user,
                state: "diff_app"
            }

            // Successful authentication, redirect home.
            res.redirect(301, `${process.env.WEB_APP}/callback#${querystring.stringify(token)}`);
        });


}



