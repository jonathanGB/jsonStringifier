const _ = require('lodash');

var input = '',
  stdin = process.stdin;
stdin.setEncoding('utf8');


stdin.on('data', (chunk) => {
  input += chunk;
});

stdin.on('end', () => {
  var inputObj = JSON.parse(input);

  var inputStr = stringifyObject(inputObj); // TODO: not necessarly an object
  console.log(inputStr);
});

// TODO: put in its own file. This current one shall be for test usage
function stringifyObject(obj) {
  var baseStr = '';

  removeUndefinedProps(obj); // TODO: verify usefulness, maybe unnecessary...

  var keys = Object.keys(obj),
    keysLen = keys.length;
  keys.forEach((key, ind) => {
    var val,
      type = typeof obj[key];

    if (obj[key] === null)
      val = 'null';
    else if (type === "number" || type === "boolean")
      val = obj[key].toString();
    else if (type === "string")
      val = '\"'.concat(escapeString(obj[key]), '\"');
    else if (_.isArray(obj[key]))
      val = stringifyArray(obj[key]);
    else if (type === "object")
      val = stringifyObject(obj[key]);

    if (ind !== keysLen - 1) // no "," after the last prop
      val = val.concat(',');

    val = '\"'.concat(escapeString(key), '\":', val);
    baseStr = baseStr.concat(val);
  });

  baseStr = '{'.concat(baseStr, '}');
  return baseStr;
}

function removeUndefinedProps(obj) {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === undefined) delete obj[key];
  });
}

// TODO: change to "stringifyStruct" to be used for arrays/objects ?
function stringifyArray(arr) {

}

function escapeString(str) {
  return str.replace(/(["\\])/g, "\\$1");
}
