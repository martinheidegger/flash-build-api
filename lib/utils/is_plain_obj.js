// Generated by CoffeeScript 1.6.2
module.exports = function(obj) {
  var has_is_property_of_method, has_own, has_own_constructor, key, _i, _len;

  if (!obj || {}.toString.call(obj) !== '[object Object]' || obj.nodeType || obj.setInterval) {
    return false;
  }
  has_own = {}.hasOwnProperty;
  has_own_constructor = has_own.call(obj, 'constructor');
  has_is_property_of_method = has_own.call(obj.constructor.prototype, 'isPrototypeOf');
  if (obj.constructor && !has_own_constructor && !has_is_property_of_method) {
    return false;
  }
  key === void 0;
  for (_i = 0, _len = obj.length; _i < _len; _i++) {
    key = obj[_i];
    continue;
  }
  return key === void 0 || has_own.call(obj, key);
};
