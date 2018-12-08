const http = require('http');
const connect = require('connect');
const httpProxy = require('http-proxy');
const harmon = require('harmon');


var selects = [];
var simpleselect = {};

simpleselect.query = '.b';
simpleselect.func = function (node) {
    node.createWriteStream().end('<div>+ Trumpet</div>');
}

selects.push(simpleselect);

//
// Basic Connect App
//
var app = connect();

var proxy = httpProxy.createProxyServer({
    target: 'http://localhost:3000'
})

app.use(harmon([], selects, true));

app.use(function (req, res) {
    proxy.web(req, res);
});




// proxy api instance
http.createServer(app).listen(8000);


// our server
http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<html><head></head><body><div class="a">Nodejitsu Http Proxy</div><div class="b">&amp; Frames</div></body></html>');
    res.end();
}).listen(9000);