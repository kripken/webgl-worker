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

WebGL objects can be destroyed in 2 ways: explicitly, using deleteX (deleteBuffer, deleteShader, etc.), or implicitly, when the corresponding JavaScript object is garbage collected. In WebGLWorker, the corresponding JavaScript object is created on the main thread, and we have a map of them by a numeric ID, so we can identify them when a message arrives from the worker. That means that we will hold on to them unti we are explicitly told otherwise. In other words, you must use the deleteX methods to explicitly free WebGL objects, or else they will leak. (Note that this is not a problem for Emscripten-compiled projects, as in the C or C++ source code there would have to be calls to glDeleteX, which Emscripten maps to deleteX).

