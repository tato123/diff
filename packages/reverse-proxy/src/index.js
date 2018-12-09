const browsersync = require('./bs-proxy');

// read our external values
require('dotenv').config()

// load all of our necessary scripts
const express = require('express');
const cors = require('cors')
const proxy = require('http-proxy-middleware')

// configure our outbound port
const port = process.env.PORT || 8080;
const app = express()

app.use(cors({origin:true}))

app.get('/_ah/start', (req, res) => {
    browsersync()
        .then(bs=> {
            const external = bs.options.get('urls').get('external');
            console.log('running external at', external);
            

            // proxy middleware options
            var options = {
                target: external,                 
                ws: true,           
                secure:false     
            }
            
            // create the proxy (without context)
            var exampleProxy = proxy(options)
            
        
            app.use('/', exampleProxy)

            res.status(200).send(external);
        })
        .catch(err => {
            console.error(err);
            res.status(500).send(err.message);
        })
})


var server = app.listen(port, () => {
    console.log('running')
})