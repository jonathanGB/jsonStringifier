const _ = require('lodash');

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

function stringifyObject(obj) {
  var jsonStr = '';

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


var stringifyModule = {
  stringify: stringify
};
module.exports = stringifyModule;
