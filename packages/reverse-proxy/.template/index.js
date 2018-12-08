'use strict';
const express = require('express')
const httpProxy = require('http-proxy')
const httpProxyInterceptor = require('http-proxy-interceptor')
const trumpet = require('trumpet')


// handles rewriting our intercepted response
// this function is not actually reading the 
// the static content but instead a stream going back out
const interceptorFactory = function(req, res) {
    var out = '<script nonce="1234">alert("hello")</script>';

    const tr = trumpet()
    const elem = tr.select('head')
    const rs = elem.createReadStream()
    const ws = elem.createWriteStream()
    rs.pipe(ws, { end: false })
    rs.on('end', function() {
        ws.end(out)
    })

    return tr
}

// Configure the proxy and expressjs so
const proxy = httpProxy.createProxyServer({    
    changeOrigin: true,
    toProxy: true
})
const app = express()


// Create a response streaming interceptor
const filter = {
    headers: {
        'content-type': /text/ 
    }
}
app.use(httpProxyInterceptor(interceptorFactory, filter))

const callback = (req,res ) => {
    proxy.web(req, res, {
        target: "https://material-ui.com",
    })
}


app.use(callback)
app.get('*', callback)
app.post('*', callback)
app.put('*', callback)
app.delete('*', callback)

exports.proxy = app;

exports.hello = (req, res) => {
    res.send(`Hello World!`);
}