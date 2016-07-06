const fs = require('fs');
const _JSON = require('./stringifier');
const _JSON2 = require('./parser');
const _ = require('lodash')

var input = '',
  stdin = process.stdin;
stdin.setEncoding('utf8');


stdin.on('data', (chunk) => {
  input += chunk;
});

stdin.on('end', () => {
  var inputJSON = JSON.parse(input);
  var inputJSON2 = _JSON2.parse(input);
  console.log(`equal? ${_.isEqual(inputJSON, inputJSON2)}`);

  var homeMadeJsonStart = new Date().getTime();
  var homeMadeJson = _JSON.stringify(inputJSON);
  var homeMadeJsonStop = new Date().getTime();

  var normalJsonStart = new Date().getTime();
  var normalJson = JSON.stringify(inputJSON);
  var normalJsonStop = new Date().getTime();

  fs.writeFileSync('normal.json', normalJson, 'utf8');
  fs.writeFileSync('homeMade.json', homeMadeJson, 'utf8'); // if `diff normal.json homeMade.json` is empty, it worked
  console.log(`HomeMade JSON: ${homeMadeJsonStop - homeMadeJsonStart}ms`);
  console.log(`Normal JSON: ${normalJsonStop - normalJsonStart}ms`);
});
