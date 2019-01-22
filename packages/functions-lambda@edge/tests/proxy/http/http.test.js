/**
 * @jest-environment node
 */

const httpFixture = require("./http.json");
const proxy = require("../../../src/proxy");
const path = require("path");
const zlib = require("zlib");




// test("site supports http", done => {
//     proxy
//         .edgeProxy(httpFixture, null, (_, response) => {
//             const buff = new Buffer(response.body, 'base64'); 
//             const data = zlib.gunzipSync(buff).toString('utf-8');


//             done();
//         })

// });