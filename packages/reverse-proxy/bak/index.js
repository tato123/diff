'use strict';

const express = require('express')
const proxy = require('http-proxy-middleware');

const apikey = {
    foo: 'http://localhost:3000'
}

const app = express()


/**
 * Add the proxy to express
 */
app.use('/:apikey', (req, res, next) => {
    
    /**
     * Configure proxy middleware
     */
    const outputProxy = proxy({
        target: apikey.foo,
        changeOrigin: true, 
        selfHandleResponse: true,
        onProxyRes: (proxyRes, req, res) => {
            const body = Buffer.alloc();
            proxyRes.on('data', function (data) {
                body = Buffer.concat([body, data]);
            });
            proxyRes.on('end', function () {
                body = body.toString();
                console.log("res from proxied server:", body);
                res.end("my response to cli");
            });
        }
    })

   
    return outputProxy(req, res, next)
})

app.listen(8000)

console.log('[DEMO] Server: listening on port 3000')
