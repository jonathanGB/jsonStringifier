function parse(str) {
  if (str === "null")
    return null;
  else if (str === "true" || str === "false")
    return str === "true";
  else if (!isNaN(str))
    return Number(str);
  else if (/^"(.*)"$/.test(str))
    return RegExp.$1;
  else if (/^\[(.*)\]$/.test(str)) {
    return (RegExp.$1).charAt(0) === '' ?
      []:
      parseArray(RegExp.$1, []);
  } else if (str === '{}')
    return {};
  else if (/^{"(.*?)":(.*)}$/.test(str)) { // TODO: object parser buggy, needs to be fixed
    var obj = {};
    var propsRegex = /"(.*?)":(.+?)(?:,"|})/g;

    while ((res = propsRegex.exec(str)) !== null) {
      //console.log(`1: ${arr[1]} / 2: ${arr[2]}`);
      obj[res[1]] = parse(res[2]);
    }
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
    } else if (/^"((?:\\"|.)*?[^\\])"(.)?(.*)$/.test(strArr)) {
      if (RegExp.$2 === ',' && RegExp.$3 === '')
        throw new Error("SyntaxError: Array can't finish with a \",\"");
      if (RegExp.$2 !== '' && RegExp.$2 !== ',')
        throw new Error("SyntaxError: Must be a \",\" to separate array items");

      arr.push(RegExp.$1);

      return RegExp.$3 !== '' ?
        parseArray(RegExp.$3, arr):
        arr;
    } else if (char1 === '[') {
      let closingBracketInd = findClosingBracket(strArr, '[', ']');

      if (closingBracketInd === -1)
        throw new Error("SyntaxError: Array doesn't have a closing bracket");

      closingBracketInd === 1 ? // empty Array
        arr.push([]):
        arr.push(parseArray(strArr.slice(1, closingBracketInd), []));

        if (strArr[closingBracketInd + 1] === ',' && !strArr[closingBracketInd + 2])
          throw new Error("SyntaxError: Array can't finish with a \",\"");
        if (strArr[closingBracketInd + 1] !== ',' && strArr[closingBracketInd + 1] !== undefined)
          throw new Error("SyntaxError: Must be a \",\" to separate array items");

        return strArr[closingBracketInd + 1] === ',' ?
          parseArray(strArr.slice(closingBracketInd + 2), arr):
          arr;
    } else if (char1 === '{') {
      let closingBracketInd = findClosingBracket(strArr, '{', '}');

      if (closingBracketInd === -1)
        throw new Error("SyntaxError: Object doesn't have a closing bracket");

      closingBracketInd === 1 ?
        arr.push({}):
        arr.push(parse(strArr.slice(0, closingBracketInd + 1)));

        if (strArr[closingBracketInd + 1] === ',' && !strArr[closingBracketInd + 2])
          throw new Error("SyntaxError: Array can't finish with a \",\"");
        if (strArr[closingBracketInd + 1] !== ',' && strArr[closingBracketInd + 1] !== undefined)
          throw new Error("SyntaxError: Must be a \",\" to separate array items");

        return strArr[closingBracketInd + 1] === ',' ?
          parseArray(strArr.slice(closingBracketInd + 2), arr):
          arr;
    } else {
      throw new Error("SyntaxError: Your array has a problem");
    }
}

function findClosingBracket(strArr, opening, closing) {
  var len = strArr.length;
  var count = 0;

  var quotesRegex = /^"((?:\\"|.)*?[^\\]")/;

  for (let i = 0; i < len; i++) {
    if (strArr[i] === opening)
      count++;
    else if (strArr[i] === closing)
      count--;
    else if (strArr[i] === '"') {
      quotesRegex.exec(strArr.slice(i));
      i += (RegExp.$1).length;
    }

    if (count === 0)
      return i;
  }

  return -1;
}

// TODO: eventually merge parser and stringifier in one module, so the whole thing can be required in one line, e.g. `const _JSON = require('._JSON')`

var parseModule = {
  parse: parse
};
module.exports = parseModule;
