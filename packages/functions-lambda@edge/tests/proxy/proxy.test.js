/**
 * @jest-environment node
 */

const eventRecord = require("./fixtures/eventRecord.json");
const cssRecord = require("./fixtures/cssRecord.json");
const fontRecord = require("./fixtures/fontRecord.json");
const proxy = require("../../src/proxy");
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

// test("produces correct output", done => {
//   proxy
//     .edgeProxy(eventRecord)
//     .then(response => {
//       // console.log("complete", response.body);
//     })
//     .catch(error => {
//       console.error(error);
//     })
//     .finally(() => {
//       done();
//     });
// });

// test("produces css output", done => {
//   proxy
//     .edgeProxy(cssRecord)
//     .then(response => {
//       console.log("complete", response);
//     })
//     .catch(error => {
//       console.error(error);
//     })
//     .finally(() => {
//       done();
//     });
// });

test("produces valid font", done => {
  proxy
    .edgeProxy(fontRecord, null, (_, response) => {
      let buff = new Buffer(response.body, 'base64'); 
      const file = zlib.gunzipSync(buff);
      fs.writeFileSync(
        path.resolve(__dirname, "./html/icomoon.ttf"),
        file
      );
   
      done();
    });
});

