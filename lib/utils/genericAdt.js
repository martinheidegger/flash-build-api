// Generated by CoffeeScript 1.6.2
var addRegularArguments, deepExtend, exec, executeJar, executeWithPlatform, getFlexHome, getPlatformForTarget, _ref;

_ref = require('./index'), getFlexHome = _ref.getFlexHome, addRegularArguments = _ref.addRegularArguments, executeJar = _ref.executeJar, getPlatformForTarget = _ref.getPlatformForTarget, deepExtend = _ref.deepExtend;

exec = require('child_process').exec;

executeWithPlatform = function(command, commandArgs, args, root, platform, onComplete) {
  var addArgs, argList, flexHome;

  flexHome = getFlexHome(args);
  argList = [];
  addArgs = {};
  addArgs[command] = null;
  addArgs.platform = platform;
  if (args.device) {
    addArgs.device = args.device;
  }
  addRegularArguments(deepExtend(addArgs, commandArgs), argList, " ");
  return executeJar("" + flexHome + "/lib/adt.jar", argList.join(" "), root, onComplete);
};

module.exports = {
  executeWithPlatform: executeWithPlatform,
  execute: function(command, commandArgs, args, root, onComplete) {
    var platform;

    platform = getPlatformForTarget(args.target);
    if (platform != null) {
      return executeWithPlatform(command, commandArgs, args, root, platform, onComplete);
    } else {
      return onComplete(new Error("Don't now how to " + command + " -target='" + args.target + "'"));
    }
  }
};