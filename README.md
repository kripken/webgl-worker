WebGLWorker
===========

WebGLWorker lets you write WebGL code in a web worker, as if WebGL were implemented there. It transparently proxies the commands to the main thread, where they are executed.

WebGLWorker is **asynchronous**. It does not support synchronous things like getError (assumed to always succeed) or readPixels (will error). However, the asynchronous subset of WebGL is still pretty comprehensive. In this repos are 2 examples: BananaBread (a first person shooter, a port of Cube 2/Sauerbraten using Emscripten) and a demo of PlayCanvas (an open source JavaScript game engine using WebGL). Both examples are unmodified - their usage of WebGL works fine asynchronously.

Work is underway in web browsers to implement WebGL in workers. When that happens, this project could be used as a polyfill, with the caveat of being asynchronous.


Usage
-----

See the PlayCanvas demo for a simple example. Basically you include a few JS files in your HTML, and make sure your JS (which should be in a file called worker.js) loads the worker-corresponding files (proxyClient/proxyWorker, etc.). That's basically it.

For Emscripten-compiled projects, like BananaBread, you just need to build with `--proxy-to-worker`.


Limitations
-----------

Enough of WebGL has been implemented here for those 2 demos, but much of the spec still isn't. Aside from synchronous features, nothing prevents the rest from being added.

