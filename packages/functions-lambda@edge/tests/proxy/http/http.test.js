/**
 * @jest-environment node
 */

const httpFixture = require("./http.json");
const proxy = require("../../../src/proxy");
const path = require("path");
const zlib = require("zlib");


test("site supports http", done => {
    proxy
        .edgeProxy(httpFixture)
        .then(response => {
            let buff = new Buffer(response.body, 'base64');
            const data = zlib.gunzipSync(buff).toString('utf-8');
            console.log("complete", data);
            expect(data.length).toBeGreaterThan(0)


        })
        .catch(error => {
            console.error(error);
        })
        .finally(() => {
            done();
        });
}, 1000000);