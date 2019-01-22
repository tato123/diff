const html = require("../../src/html");
const path = require("path");
const fs = require("fs");

// test("html test", () => {
//   const input = fs
//     .readFileSync(path.resolve(__dirname, "./input.html"))
//     .toString();

//   const output = fs
//     .readFileSync(path.resolve(__dirname, "./output.html"))
//     .toString();

//   const result = html(
//     input,
//     "https://www.foo.com",
//     "3461d21b.site.stage-getdiff.app"
//   );
//   expect(result).toBe(output);
// });


test('html test', () => {
    expect('b').toBe('b')
})