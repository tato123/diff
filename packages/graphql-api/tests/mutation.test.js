const toCss = require('to-css');
const fixture = require('./fixture');


test('transforms correctly', () => {
    const result = toCss(fixture);
    console.log('result', result)
})