const _ = require('lodash');
const fs = require('fs');

var input = '',
  stdin = process.stdin;
stdin.setEncoding('utf8');


stdin.on('data', (chunk) => {
  input += chunk;
});

stdin.on('end', () => {
  var inputJSON = JSON.parse(input);

  var homeMadeJsonStart = new Date().getTime();
  var homeMadeJson = stringify(inputJSON);
  var homeMadeJsonStop = new Date().getTime();

  var normalJsonStart = new Date().getTime();
  var normalJson = JSON.stringify(inputJSON);
  var normalJsonStop = new Date().getTime();

  fs.writeFileSync('normal.json', normalJson, 'utf8');
  fs.writeFileSync('homeMade.json', homeMadeJson, 'utf8'); // if `diff normal.json homeMade.json` is empty, it worked
  console.log(`HomeMade JSON: ${homeMadeJsonStop - homeMadeJsonStart}ms`);
  console.log(`Normal JSON: ${normalJsonStop - normalJsonStart}ms`);
});

function stringify(json) {
  let type = typeof json;

  if (json === null)
    return 'null';
  else if (type === "number" || type === "boolean")
    return json.toString();
  else if (type === "string")
    return '\"'.concat(escapeString(json), '\"');
  else if (_.isArray(json))
    return stringifyArray(json);
  else if (type === "object")
    return stringifyObject(json);
}

// TODO: put in its own file. This current one shall be for test usage
function stringifyObject(obj) {
  var jsonStr = '';

  removeUndefinedProps(obj); // TODO: verify usefulness, maybe unnecessary...

  var keys = Object.keys(obj),
    keysLen = keys.length;
  keys.forEach((key, ind) => {
    let val = stringify(obj[key]);

    if (ind !== keysLen - 1) // no "," after the last prop
      val = val.concat(',');

    let keyVal = '\"'.concat(escapeString(key), '\":', val);
    jsonStr = jsonStr.concat(keyVal);
  });

  return '{'.concat(jsonStr, '}'); // wrap object
}

function stringifyArray(arr) {
  var jsonStr = '';

  changeUndefinedToNull(arr);

  var arrLen = arr.length;
  arr.forEach((elem, ind) => {
    let val = stringify(elem);

    if (ind !== arrLen - 1) // no "," after the last prop
      val = val.concat(',');

    jsonStr = jsonStr.concat(val);
  });

  return '['.concat(jsonStr, ']'); // wrap object
}

function removeUndefinedProps(obj) {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === undefined) delete obj[key];
  });
}

function changeUndefinedToNull(arr) {
  arr.map((elem) => {
    return elem === undefined ?
      null:
      elem;
  });
}

function escapeString(str) {
  return str.replace(/(["\\])/g, "\\$1");
}
