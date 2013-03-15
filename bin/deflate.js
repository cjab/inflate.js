#!/usr/bin/env node

var fs = require('fs');

process.argv.slice(2).forEach(function(filename) {
  fs.readFile(filename, 'utf8', function(err, data) {

    if (err) { console.log("Error: " + err); return; }

    var jsonData = JSON.parse(data),
        keyMap   = {},
        deflated = deflate(jsonData, keyMap);

    fs.writeFile(filename + ".deflated", JSON.stringify(deflated));
    fs.writeFile(filename + ".map", JSON.stringify(invert(keyMap)));
  });
});



function deflate(data, keyMap) {
  if (Array.isArray(data)) {
    return deflateArray(data, keyMap);
  } else {
    return deflateObject(data, keyMap);
  }
}



function deflateArray(data, keyMap) {
  var deflated = [];

  for (var i = 0; i < data.length; i++) {
    deflated.push(deflate(data[i], keyMap));
  }

  return deflated;
}



function deflateObject(data, keyMap) {
  var deflated = {};

  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      var deflatedKey = keyMap[key];

      if (deflatedKey === undefined) {
        deflatedKey = Object.keys(keyMap).length;
        keyMap[key] = deflatedKey;
      }

      deflated[deflatedKey] = data[key];
    }
  }

  return deflated;
}



function invert(object) {
  var inverted = {};

  for (var key in object) {
    if (object.hasOwnProperty(key)) {
      var newKey   = object[key],
          newValue = key;

      inverted[newKey] = newValue;
    }
  }

  return inverted;
}
