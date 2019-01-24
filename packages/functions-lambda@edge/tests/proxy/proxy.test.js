/**
 * @jest-environment node
 */

const proxy = require("../../src/proxy");
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

describe("Test proxy functionality", () => {
  const editWithStyleBlockHTML = fs
    .readFileSync(path.resolve(__dirname, "./fixtures/eventRecordWOEdit.html"))
    .toString("utf-8")
    .trim();

  const editWithScriptBlockHTML = fs
    .readFileSync(
      path.resolve(__dirname, "./fixtures/eventRecordScriptBlock.html")
    )
    .toString("utf-8")
    .trim();

  const eventRecordNonDiffEdit = require("./fixtures/eventRecordWOEdit.json");

  const eventRecordScriptBlock = require("./fixtures/eventRecordScriptBlock.json");

  test("produces a style block", done => {
    proxy.edgeProxy(eventRecordNonDiffEdit, null, (_, response) => {
      let buff = new Buffer(response.body, "base64");
      const file = zlib
        .gunzipSync(buff)
        .toString("utf-8")
        .trim();
      expect(file).toEqual(editWithStyleBlockHTML);

      done();
    });
  });

  test("produces a script block", done => {
    proxy.edgeProxy(eventRecordScriptBlock, null, (_, response) => {
      let buff = new Buffer(response.body, "base64");
      const file = zlib
        .gunzipSync(buff)
        .toString("utf-8")
        .trim();
      expect(file).toEqual(editWithScriptBlockHTML);

      done();
    });
  });
});
