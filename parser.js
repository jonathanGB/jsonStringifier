function parse(str) {
  if (str === "null")
    return null;
  else if (str === "true" || str === "false")
    return Boolean(str);
  else if (!isNaN(str))
    return Number(str);
  else if (/^"(.*)"$/.test(str))
    return RegExp.$1;
  else if (/^\[(.*)\]$/.test(str)) {
    return (RegExp.$1).charAt(0) === '' ?
      []:
      parseArray(RegExp.$1, []);
  }
  else if (/^{(.*):(.*)}$/.test(str)) {
    var obj = {};
    obj[RegExp.$1] = parse(RegExp.$2);
    return obj;
  }
  else
    throw new Error(`SyntaxError: Unknown token ${str}`);
}

function parseArray(strArr, arr) {
  var char1 = strArr.charAt(0);

    // not a string, nor an object, nor an array
    if (!['"', '[', '{'].includes(char1)) {
      let commaInd = strArr.indexOf(','); // get first elem

      if (commaInd === strArr.length - 1)
        throw new Error("SyntaxError: Array can't finish with a \",\"");

      let elem = ~commaInd ? // depending on if there's a comma, e.g. another elem in the array
        strArr.slice(0, commaInd):
        strArr;

      arr.push(parse(elem));

      return ~commaInd ?
        parseArray(strArr.slice(commaInd + 1), arr):
        arr;
    } else if (/^"((?:\\"|.)*?)"(.)?(.)*/.test(strArr)) {
      arr.push(RegExp.$1);

      return RegExp.$3 !== '' ?
        parseArray(RegExp.$3, arr):
        arr;
    } // TODO: case for array and for object
}

// TODO: eventually merge parser and stringifier in one module, so the whole thing can be required in one line, e.g. `const _JSON = require('._JSON')`

var parseModule = {
  parse: parse
};
module.exports = parseModule;
