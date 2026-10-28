/* Samsung TV Web Service: one launch on boot and on each observed standby -> on transition.
 * It runs only in an opt-in build signed with a device-bound Partner certificate. */
var http = require('http');
var timer = null;
var pending = false;
var power = null;

function launch() {
  try {
    if (typeof tizen !== 'undefined' && tizen.application && typeof tizen.application.launch === 'function') {
      tizen.application.launch('__APP_ID__', function () {}, function () {});
    }
  } catch (e) {} // A failed launch must not crash or repeatedly restart the service.
}

function observe(value) {
  var state = String(value).toLowerCase();
  if (state !== 'on' && state !== 'standby') return;
  var before = power;
  power = state;
  if (state === 'on' && before !== 'on') launch();
}

function poll() {
  if (pending) return;
  pending = true;
  var req;
  try {
    req = http.get({host: '127.0.0.1', port: 8001, path: '/api/v2/'}, function (res) {
      var body = '';
      res.on('data', function (chunk) { body += chunk; });
      res.on('end', function () {
        pending = false;
        try { observe(JSON.parse(body).device.PowerState); } catch (e) {}
      });
    });
    req.on('error', function () { pending = false; });
    req.setTimeout(2000, function () { req.destroy(); });
  } catch (e) { pending = false; }
}

exports.onStart = function () { poll(); timer = setInterval(poll, 1000); };
exports.onRequest = function () {};
exports.onExit = function () { if (timer) clearInterval(timer); };
