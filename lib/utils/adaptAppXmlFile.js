// Generated by CoffeeScript 1.6.2
var adaptAppXml, fs, path;

fs = require('fs');

path = require('path');

adaptAppXml = require('./adaptAppXml');

module.exports = function(input, output, mainFile, root, version, id, onComplete) {
  var inputFile, outputFile;

  inputFile = path.resolve(root, input);
  outputFile = path.resolve(root, output);
  return fs.readFile(inputFile, function(error, data) {
    if (error) {
      return onComplete(error);
    } else {
      return adaptAppXml(data.toString(), inputFile, outputFile, mainFile, version, id, onComplete);
    }
  });
};