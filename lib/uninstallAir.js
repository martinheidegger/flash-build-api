// Generated by CoffeeScript 1.6.2
var genericAdt;

genericAdt = require('./utils/genericAdt');

module.exports = function(args, root, onComplete) {
  return genericAdt.execute("uninstallApp", {
    appid: args["app-id"]
  }, args, root, onComplete);
};
