// Generated by CoffeeScript 1.6.2
var DOMAIN_POLICY, DOMParser, END_OF_TEST_ACK, END_OF_TEST_RUN, POLICY_PROFILE, START_OF_TEST_RUN_ACK, XMLSerializer, net, parser, serializer, startServer, sys, _ref;

net = require('net');

sys = require('sys');

_ref = require('xmldom'), DOMParser = _ref.DOMParser, XMLSerializer = _ref.XMLSerializer;

parser = new DOMParser();

serializer = new XMLSerializer();

DOMAIN_POLICY = "<?xml version=\"1.0\"?>" + "<cross-domain-policy xmlns=\"http://localhost\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:schemaLocation=\"http://www.adobe.com/xml/schemas PolicyFileSocket.xsd\">" + "<allow-access-from domain=\"*\" to-ports=\"{0}\" />" + "</cross-domain-policy>";

END_OF_TEST_ACK = "<endOfTestRunAck/>";

END_OF_TEST_RUN = "<endOfTestRun/>";

POLICY_PROFILE = "<policy-file-request/>";

START_OF_TEST_RUN_ACK = "<startOfTestRunAck/>";

startServer = function(host, port, waitForPolicyFile, timeout, onComplete) {
  var allData, e, end, listening, server, waitTimeout, _stream;

  allData = [];
  _stream = null;
  server = net.createServer(function(stream) {
    var classes, hasError, send;

    _stream = stream;
    stream.setEncoding("utf8");
    send = function(msg) {
      return stream.write("" + msg + "\u0000");
    };
    classes = {};
    hasError = false;
    stream.on("connect", function() {
      if (!waitForPolicyFile) {
        return send(START_OF_TEST_RUN_ACK);
      }
    });
    stream.on("data", function(data) {
      var className, clazz, error, method, packet, status;

      clearTimeout(waitTimeout);
      data = data.substr(0, data.length - 1);
      if (data === END_OF_TEST_RUN) {
        return end(hasError ? "Error during execution" : null);
      } else if (data === POLICY_PROFILE) {
        send(DOMAIN_POLICY);
        return send(START_OF_TEST_RUN_ACK);
      } else {
        packet = parser.parseFromString(data).documentElement;
        className = packet.getAttribute("classname");
        method = packet.getAttribute("name");
        status = packet.getAttribute("status");
        if (status === "error") {
          error = serializer.serializeToString(packet.getElementsByTagName("error")[0]);
        } else if (status === "failure") {
          error = serializer.serializeToString(packet.getElementsByTagName("failure")[0]);
        } else {
          error = null;
        }
        clazz = classes[className];
        if (!clazz) {
          allData.push(clazz = []);
          classes[className] = clazz;
        }
        clazz.push({
          method: method,
          status: status,
          error: error
        });
        console.info("" + className + "." + method + " ... " + status);
        if (error) {
          return hasError = true;
        }
      }
    });
    return stream.on("end", function() {
      return end("Server prematurely closed");
    });
  });
  listening = true;
  end = function(error) {
    var e;

    if (listening) {
      listening = false;
      try {
        server.close(function() {
          return onComplete(error, allData);
        });
        return _stream.close();
      } catch (_error) {
        e = _error;
        return onComplete(error, allData);
      }
    }
  };
  try {
    server.listen(port, host);
    waitTimeout = setTimeout(function() {
      return end("Unit tests havn't started after " + timeout + "ms");
    }, timeout);
  } catch (_error) {
    e = _error;
    listening = false;
    process.nextTick(function() {
      return onComplete(e);
    });
  }
  return {
    isListening: function() {
      return listening;
    },
    endWithError: function(error) {
      var hasError;

      if (listening) {
        hasError = true;
        return end(error);
      }
    }
  };
};

module.exports = function(startCommand, onComplete, timeout, waitForPolicyFile, host, port) {
  var server, swf, swfRunning;

  if (timeout == null) {
    timeout = 4000;
  }
  if (waitForPolicyFile == null) {
    waitForPolicyFile = false;
  }
  if (host == null) {
    host = '127.0.0.1';
  }
  if (port == null) {
    port = 1024;
  }
  server = startServer(host, port, waitForPolicyFile, timeout, function(error, result) {
    var e;

    try {
      if (swfRunning) {
        swf.kill();
      }
    } catch (_error) {
      e = _error;
    }
    return onComplete(error, result);
  });
  swfRunning = true;
  swf = startCommand(function(error, result) {
    swfRunning = false;
    return server.endWithError(result || "No unit test was run...");
  });
  return swf.on("exit", function() {
    return swfRunning = false;
  });
};