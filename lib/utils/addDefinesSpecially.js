// Generated by CoffeeScript 1.6.2
var addDebugFlags, inQuotes;

inQuotes = require("./inQuotes");

addDebugFlags = function(flags, useDebugFlag) {
  flags['CONFIG::release'] = !useDebugFlag;
  return flags['CONFIG::debug'] = useDebugFlag;
};

module.exports = function(args, argList, useDebugFlag) {
  var name, value, _ref, _ref1;

  if (useDebugFlag == null) {
    useDebugFlag = false;
  }
  if ((_ref = args.define) == null) {
    args.define = {};
  }
  addDebugFlags(args.define, useDebugFlag);
  _ref1 = args.define;
  for (name in _ref1) {
    value = _ref1[name];
    if (typeof value === "string") {
      value = inQuotes("'" + value + "'");
    } else {
      value = value.toString();
    }
    argList.push("-define=" + name + "," + value);
  }
  return argList;
};