
var Module = {};
var Browser = { resizeListeners: [] };
var calledMain = true;

function assert(x, y) {
  if (!x) {
    dump('assert failed at ' + new Error().stack + '\n');
    throw y || 'assertion failed';
  }
}

