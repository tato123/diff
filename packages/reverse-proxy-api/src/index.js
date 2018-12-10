// load all of our necessary scripts
const express = require('express');
const cors = require('cors')
const appengineHelper = require('./appengine');
const {google} = require('googleapis');
const reservation = require('./reservation');

// configure our outbound port
const port = process.env.PORT || 8080;
const app = express()
const bodyParser = require('body-parser')


// basic configuration
app.use(cors({ origin: true }))
app.set('trust proxy', true);
// parse application/json
app.use(bodyParser.json())

async function main() {

    console.log('Attempting to login')
    // This method looks for the GCLOUD_PROJECT and GOOGLE_APPLICATION_CREDENTIALS
    // environment variables.
    const auth = await google.auth.getClient({
        // Scopes can be specified either as an array or as a single, space-delimited string.
        scopes: ['https://www.googleapis.com/auth/cloud-platform']
    });

    console.log('Connecting to appengine ')
    const appengine = google.appengine({
        version: 'v1',
        auth
    });

    /**
     * Handles standing up new instances of our service
     */
    app.post('/create', async (req, res) => {
        try {
            // creating a new version of the application            
            const response = await appengineHelper.createVersionHandler(appengine);            
            res.status(201).send(response);
        } catch (error) {
            console.log('error', error)
            res.status(404).send(error.errors);
        }
    })


    app.get('/reserve', async (req,res) => {
        try {
            const reserables =  await reservation.getReservable();
            res.status(200).send(reserables)
        } catch(error) {
            console.error(error);
            res.status(404).send(error);
        }
    })

    /**
     * Handles reserving a free instance against a 
     * target testing proxy
     */
    app.post('/reserve', async (req, res) => {
    
        try {
            const proxyTarget = req.query.proxyTarget;
            if (!proxyTarget) {
                return res.status(400).send({
                    errors: [{
                        message: 'A proxy target is required'
                    }]
                })
            }

            console.log('Reserving an instance for a new test target', req.query.proxyTarget)

            // marks an instance as reserved,
            // we record it in case we need to bounce 
            // a server 
            const instanceUrl = await reservation.recordReservation(req.query.proxyTarget);
            
            // actually does the activation
            const response = await reservation.activateReservation(instanceUrl, proxyTarget);

            res.status(201).send(response);
        } catch (error) {
            console.log('error', error)
            res.status(404).send(error.errors);
        }
    })

    app.get('/list', async(req, res) => {
        try {
            const results = await appengineHelper.listVersions(appengine);
            console.log('received the results', results)
            res.status(200).send(results);
        } catch(error) {
            console.log(error);
            res.status(404).send(error.errors)
        }
    });

    app.listen(port, () => {
        console.log('[reverse-proxy-api] created on port', port);
    })

}

main();