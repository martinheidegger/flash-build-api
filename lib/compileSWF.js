// Generated by CoffeeScript 1.6.2
var addDefinesSpecially, addRegularArguments, clearPath, deepExtend, executeClassInJar, executeJar, folderOf, fs, getFlexHome, path, prepareFlashArgs, pushToMember, relativeTo, removeNonExistingPaths, _ref;

fs = require('fs');

path = require('path');

_ref = require('./utils'), pushToMember = _ref.pushToMember, getFlexHome = _ref.getFlexHome, addRegularArguments = _ref.addRegularArguments, addDefinesSpecially = _ref.addDefinesSpecially, executeJar = _ref.executeJar, executeClassInJar = _ref.executeClassInJar, deepExtend = _ref.deepExtend;

folderOf = function(path) {
  var paths;

  paths = path.split("/");
  paths.pop();
  if (paths.length > 0) {
    return paths.join("/");
  } else {
    return ".";
  }
};

clearPath = function(path) {
  var part, parts, result, _i, _len;

  parts = path.split("/");
  if (parts[0] === ".") {
    parts.shift();
  }
  result = [];
  for (_i = 0, _len = parts.length; _i < _len; _i++) {
    part = parts[_i];
    if (part === "..") {
      result.pop();
    } else {
      result.push(part);
    }
  }
  return result.join("/");
};

relativeTo = function(parent, path) {
  var i, parentParts, pathParts, result, _i, _ref1;

  path = clearPath(path);
  pathParts = path.split("/");
  parent = clearPath(parent);
  parentParts = parent.split("/");
  result = [];
  for (i = _i = 0, _ref1 = parentParts.length; 0 <= _ref1 ? _i < _ref1 : _i > _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
    if (parentParts[i] !== pathParts[i]) {
      i++;
      while (i < parentParts.length) {
        pathParts.unshift("..");
        i++;
      }
    }
  }
  return pathParts.join("/");
};

removeNonExistingPaths = function(target, parentPath, member) {
  var input, pth, result, _i, _len;

  input = target[member];
  if (input) {
    result = [];
    for (_i = 0, _len = input.length; _i < _len; _i++) {
      pth = input[_i];
      pth = path.resolve(parentPath, pth);
      if (fs.existsSync(pth)) {
        result.push(pth);
      }
    }
    return target[member] = result;
  }
};

prepareFlashArgs = function(args, root, flexHome) {
  var file, files, output, playerglobal, pos, version, versions, _i, _j, _len, _len1;

  files = args.files;
  if (files) {
    for (_i = 0, _len = files.length; _i < _len; _i++) {
      file = files[_i];
      pushToMember(args, "file-specs", file);
    }
  }
  delete args.files;
  delete args["compiler.debug"];
  delete args["debug"];
  delete args["benchmark"];
  args["use-network"] = "true";
  removeNonExistingPaths(args, root, "compiler.library-path");
  removeNonExistingPaths(args, root, "compiler.include-libraries");
  removeNonExistingPaths(args, root, "compiler.external-library-path");
  removeNonExistingPaths(args, root, "runtime-shared-library-path");
  output = null;
  if (args.output) {
    output = args.output;
    delete args["output"];
  }
  if (args.o) {
    output = args.o;
    delete args["o"];
  }
  args.output = path.resolve(root, output);
  if (!args.define) {
    args.define = {};
  }
  delete args['omit-trace-statements'];
  args['compiler.omit-trace-statements'] = "true";
  versions = [args['target-player'], "11.4", "11.1", "10.2", "10.1", "10"];
  for (pos = _j = 0, _len1 = versions.length; _j < _len1; pos = ++_j) {
    version = versions[pos];
    playerglobal = "" + flexHome + "/frameworks/libs/player/" + version + "/playerglobal.swc";
    if (fs.existsSync(playerglobal)) {
      pushToMember(args, "compiler.external-library-path", playerglobal);
      args['target-player'] = version;
      break;
    }
  }
  pushToMember(args, "compiler.library-path", "" + flexHome + "/frameworks/libs/framework.swc");
  pushToMember(args, "compiler.library-path", "" + flexHome + "/frameworks/libs/core.swc");
  pushToMember(args, "compiler.library-path", "" + flexHome + "/frameworks/libs/osmf.swc");
  pushToMember(args, "compiler.library-path", "" + flexHome + "/frameworks/libs/textLayout.swc");
  pushToMember(args, "compiler.library-path", "" + flexHome + "/frameworks/libs/air/aircore.swc");
  pushToMember(args, "compiler.external-library-path", "" + flexHome + "/frameworks/libs/air/airglobal.swc");
  return args;
};

module.exports = function(args, root, onComplete) {
  var argList, e, flexHome;

  try {
    flexHome = getFlexHome(args);
    args = prepareFlashArgs(deepExtend(args, args.additionalArguments), root, flexHome);
    argList = ["+flexlib=\"" + flexHome + "/frameworks\""];
    if (args.inheritedOptions) {
      argList.push(args.inheritedOptions);
    }
    argList = addDefinesSpecially(args, argList);
    argList = addRegularArguments(args, argList, "=", "additionalArguments", "inheritedOptions", "additionalOptions", "flexHome", "asc2", "define");
    if (args.additionalOptions) {
      argList.push(args.additionalOptions);
    }
    if (args.additionalArguments) {
      argList = addDefinesSpecially(args.additionalArguments, argList);
    }
    if (args.asc2 === true) {
      return executeClassInJar("" + flexHome + "/lib/compiler.jar", "com.adobe.flash.compiler.clients.MXMLC", argList.join(" "), root, onComplete);
    } else {
      return executeJar("" + flexHome + "/lib/mxmlc.jar", argList.join(" "), root, onComplete);
    }
  } catch (_error) {
    e = _error;
    onComplete(e);
  }
};
