const express = require('express')
const http = require('http')
const proxy = require('http-proxy-middleware')
const httpProxyInterceptor = require('http-proxy-interceptor')
const trumpet = require('trumpet')


const interceptorFactory = function(req, res) {
	var out = '<script nonce="1234">alert("hello")</script>';

	const tr = trumpet()


	// rewrite all 
	const elem = tr.select('head')
	const rs = elem.createReadStream()
	const ws = elem.createWriteStream()
	rs.pipe(ws, { end: false })
	rs.on('end', function() {
		ws.end(out)
	})

	// rewrite sources
	tr.selectAll('[href]', (elem) => {
		const link = elem.getAttribute('href')
		if ( link.startsWith('/') ) {
			elem.setAttribute('href', `/proxy${link}`)
		}
	})


	// rewrite hrefs
	tr.selectAll('[src]', (elem) => {
		const link = elem.getAttribute('src')
		if ( link.startsWith('/') ) {
			elem.setAttribute('src', `/proxy${link}`)
		}
		
	})


	return tr
}

const filter = {
    headers: {
        'content-type': /text\/html/ //Only match requests that specify text-based content types
    }
}

const port = 8000

var app = express()

// intercept and inject content
app.use(httpProxyInterceptor(interceptorFactory, filter))

// Proxy all of our content
app.use(function(req, res, next) {

	// proxy middleware options
	var options = {	
		changeOrigin: true,
		target: "https://material-ui.com"
	}

	var exampleProxy = proxy(options)

	return exampleProxy(req,res, next)
})


var server = http.createServer(app).listen(port)