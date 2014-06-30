
var Module = {};
var Browser = { resizeListeners: [] };
var calledMain = true;

function assert(x, y) {
  if (!x) {
    dump('assert failed at ' + new Error().stack + '\n');
    throw y || 'assertion failed';
  }
}

function setMain(func) {
  Module.main = func;
}

var runDependencies = 0;

function addRunDependency() {
  runDependencies++;
}

function removeRunDependency(id) {
  runDependencies--;
  if (runDependencies == 0) {
    Module.main();
  }
}

