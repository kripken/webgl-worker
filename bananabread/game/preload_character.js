
var Module;
if (typeof Module === 'undefined') Module = eval('(function() { try { return Module || {} } catch(e) { return {} } })()');
if (!Module.expectedDataFileDownloads) {
  Module.expectedDataFileDownloads = 0;
  Module.finishedDataFileDownloads = 0;
}
Module.expectedDataFileDownloads++;
(function() {

    var decrunchWorker = new Worker('crunch-worker.js');
    var decrunchCallbacks = [];
    decrunchWorker.onmessage = function(msg) {
      decrunchCallbacks[msg.data.callbackID](msg.data.data);
      console.log('decrunched ' + msg.data.filename + ' in ' + msg.data.time + ' ms, ' + msg.data.data.length + ' bytes');
      decrunchCallbacks[msg.data.callbackID] = null;
    };
    function requestDecrunch(filename, data, callback) {
      decrunchWorker.postMessage({
        filename: filename,
        data: new Uint8Array(data),
        callbackID: decrunchCallbacks.length
      });
      decrunchCallbacks.push(callback);
    }

    var PACKAGE_PATH;
    if (typeof window === 'object') {
      PACKAGE_PATH = window['encodeURIComponent'](window.location.pathname.toString().substring(0, window.location.pathname.toString().lastIndexOf('/')) + '/');
    } else {
      // worker
      PACKAGE_PATH = encodeURIComponent(location.pathname.toString().substring(0, location.pathname.toString().lastIndexOf('/')) + '/');
    }
    var PACKAGE_NAME = 'character.data';
    var REMOTE_PACKAGE_NAME = (Module['filePackagePrefixURL'] || '') + 'character.data';
    var REMOTE_PACKAGE_SIZE = 3629792;
    var PACKAGE_UUID = 'c2c9d4e6-13be-4636-b3b4-89bb5d476e9d';
  
    function fetchRemotePackage(packageName, packageSize, callback, errback) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', packageName, true);
      xhr.responseType = 'arraybuffer';
      xhr.onprogress = function(event) {
        var url = packageName;
        var size = packageSize;
        if (event.total) size = event.total;
        if (event.loaded) {
          if (!xhr.addedTotal) {
            xhr.addedTotal = true;
            if (!Module.dataFileDownloads) Module.dataFileDownloads = {};
            Module.dataFileDownloads[url] = {
              loaded: event.loaded,
              total: size
            };
          } else {
            Module.dataFileDownloads[url].loaded = event.loaded;
          }
          var total = 0;
          var loaded = 0;
          var num = 0;
          for (var download in Module.dataFileDownloads) {
          var data = Module.dataFileDownloads[download];
            total += data.total;
            loaded += data.loaded;
            num++;
          }
          total = Math.ceil(total * Module.expectedDataFileDownloads/num);
          if (Module['setStatus']) Module['setStatus']('Downloading data... (' + loaded + '/' + total + ')');
        } else if (!Module.dataFileDownloads) {
          if (Module['setStatus']) Module['setStatus']('Downloading data...');
        }
      };
      xhr.onload = function(event) {
        var packageData = xhr.response;
        callback(packageData);
      };
      xhr.send(null);
    };

    function handleError(error) {
      console.error('package error:', error);
    };
  
      var fetched = null, fetchedCallback = null;
      fetchRemotePackage(REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE, function(data) {
        if (fetchedCallback) {
          fetchedCallback(data);
          fetchedCallback = null;
        } else {
          fetched = data;
        }
      }, handleError);
    
  function runWithFS() {

function assert(check, msg) {
  if (!check) throw msg + new Error().stack;
}
Module['FS_createPath']('/', 'packages', true, true);
Module['FS_createPath']('/packages', 'models', true, true);
Module['FS_createPath']('/packages/models', 'vwep', true, true);
Module['FS_createPath']('/packages/models/vwep', 'chaing', true, true);
Module['FS_createPath']('/packages/models/vwep', 'gl', true, true);
Module['FS_createPath']('/packages/models/vwep', 'rocket', true, true);
Module['FS_createPath']('/packages/models/vwep', 'shotg', true, true);
Module['FS_createPath']('/packages/models/vwep', 'rifle', true, true);
Module['FS_createPath']('/packages/models', 'snoutx10k', true, true);
Module['FS_createPath']('/packages/models/snoutx10k', 'hudguns', true, true);
Module['FS_createPath']('/packages/models/snoutx10k/hudguns', 'chaing', true, true);
Module['FS_createPath']('/packages/models/snoutx10k/hudguns', 'gl', true, true);
Module['FS_createPath']('/packages/models/snoutx10k/hudguns', 'rocket', true, true);
Module['FS_createPath']('/packages/models/snoutx10k/hudguns', 'shotg', true, true);
Module['FS_createPath']('/packages/models/snoutx10k/hudguns', 'rifle', true, true);
Module['FS_createPath']('/packages/models', 'hudguns', true, true);
Module['FS_createPath']('/packages/models/hudguns', 'chaing', true, true);
Module['FS_createPath']('/packages/models/hudguns', 'gl', true, true);
Module['FS_createPath']('/packages/models/hudguns', 'rocket', true, true);
Module['FS_createPath']('/packages/models/hudguns', 'shotg', true, true);
Module['FS_createPath']('/packages/models/hudguns', 'rifle', true, true);

    function DataRequest(start, end, crunched, audio) {
      this.start = start;
      this.end = end;
      this.crunched = crunched;
      this.audio = audio;
    }
    DataRequest.prototype = {
      requests: {},
      open: function(mode, name) {
        this.name = name;
        this.requests[name] = this;
        Module['addRunDependency']('fp ' + this.name);
      },
      send: function() {},
      onload: function() {
        var byteArray = this.byteArray.subarray(this.start, this.end);

        if (this.crunched) {
          var ddsHeader = byteArray.subarray(0, 128);
          var that = this;
          requestDecrunch(this.name, byteArray.subarray(128), function(ddsData) {
            byteArray = new Uint8Array(ddsHeader.length + ddsData.length);
            byteArray.set(ddsHeader, 0);
            byteArray.set(ddsData, 128);
            that.finish(byteArray);
          });
        } else {

          this.finish(byteArray);

        }

      },
      finish: function(byteArray) {
        var that = this;
        Module['FS_createPreloadedFile'](this.name, null, byteArray, true, true, function() {
          Module['removeRunDependency']('fp ' + that.name);
        }, function() {
          if (that.audio) {
            Module['removeRunDependency']('fp ' + that.name); // workaround for chromium bug 124926 (still no audio with this, but at least we don't hang)
          } else {
            Module.printErr('Preloading file ' + that.name + ' failed');
          }
        }, false, true); // canOwn this data in the filesystem, it is a slide into the heap that will never change
        this.requests[this.name] = null;
      },
    };
      new DataRequest(0, 94, 0, 0).open('GET', '/packages/models/vwep/readme.txt');
    new DataRequest(94, 276, 0, 0).open('GET', '/packages/models/vwep/chaing/iqm.cfg');
    new DataRequest(276, 111196, 0, 0).open('GET', '/packages/models/vwep/chaing/minigun_vwep.iqm');
    new DataRequest(111196, 194796, 0, 0).open('GET', '/packages/models/vwep/gl/gl_vwep.iqm');
    new DataRequest(194796, 194968, 0, 0).open('GET', '/packages/models/vwep/gl/iqm.cfg');
    new DataRequest(194968, 195122, 0, 0).open('GET', '/packages/models/vwep/rocket/iqm.cfg');
    new DataRequest(195122, 276010, 0, 0).open('GET', '/packages/models/vwep/rocket/rl_vwep.iqm');
    new DataRequest(276010, 371794, 0, 0).open('GET', '/packages/models/vwep/shotg/shotgun_vwep.iqm');
    new DataRequest(371794, 371997, 0, 0).open('GET', '/packages/models/vwep/shotg/iqm.cfg');
    new DataRequest(371997, 372197, 0, 0).open('GET', '/packages/models/vwep/rifle/iqm.cfg');
    new DataRequest(372197, 474277, 0, 0).open('GET', '/packages/models/vwep/rifle/sniper_vwep.iqm');
    new DataRequest(474277, 512699, 0, 0).open('GET', '/packages/models/snoutx10k/lower_mask.jpg');
    new DataRequest(512699, 572807, 0, 0).open('GET', '/packages/models/snoutx10k/right.md5anim.iqm');
    new DataRequest(572807, 579563, 0, 0).open('GET', '/packages/models/snoutx10k/gl_idle.md5anim.iqm');
    new DataRequest(579563, 586319, 0, 0).open('GET', '/packages/models/snoutx10k/edit.md5anim.iqm');
    new DataRequest(586319, 644721, 0, 0).open('GET', '/packages/models/snoutx10k/lower.jpg');
    new DataRequest(644721, 700998, 0, 0).open('GET', '/packages/models/snoutx10k/upper_normals.jpg');
    new DataRequest(700998, 719154, 0, 0).open('GET', '/packages/models/snoutx10k/swim.md5anim.iqm');
    new DataRequest(719154, 730210, 0, 0).open('GET', '/packages/models/snoutx10k/sniper_shoot.md5anim.iqm');
    new DataRequest(730210, 741082, 0, 0).open('GET', '/packages/models/snoutx10k/rl_shoot.md5anim.iqm');
    new DataRequest(741082, 741464, 0, 0).open('GET', '/packages/models/snoutx10k/iqm.cfg');
    new DataRequest(741464, 757700, 0, 0).open('GET', '/packages/models/snoutx10k/lose.md5anim.iqm');
    new DataRequest(757700, 775616, 0, 0).open('GET', '/packages/models/snoutx10k/pain.md5anim.iqm');
    new DataRequest(775616, 792692, 0, 0).open('GET', '/packages/models/snoutx10k/pain2.md5anim.iqm');
    new DataRequest(792692, 854984, 0, 0).open('GET', '/packages/models/snoutx10k/left.md5anim.iqm');
    new DataRequest(854984, 913688, 0, 0).open('GET', '/packages/models/snoutx10k/backward.md5anim.iqm');
    new DataRequest(913688, 982145, 0, 0).open('GET', '/packages/models/snoutx10k/lower_normals.jpg');
    new DataRequest(982145, 993541, 0, 0).open('GET', '/packages/models/snoutx10k/shoot.md5anim.iqm');
    new DataRequest(993541, 1004597, 0, 0).open('GET', '/packages/models/snoutx10k/minigun_shoot.md5anim.iqm');
    new DataRequest(1004597, 1007626, 0, 0).open('GET', '/packages/models/snoutx10k/anims.cfg');
    new DataRequest(1007626, 1014382, 0, 0).open('GET', '/packages/models/snoutx10k/dead2.md5anim.iqm');
    new DataRequest(1014382, 1037030, 0, 0).open('GET', '/packages/models/snoutx10k/dying2.md5anim.iqm');
    new DataRequest(1037030, 1043794, 0, 0).open('GET', '/packages/models/snoutx10k/minigun_idle.md5anim.iqm');
    new DataRequest(1043794, 1058990, 0, 0).open('GET', '/packages/models/snoutx10k/sink.md5anim.iqm');
    new DataRequest(1058990, 1062634, 0, 0).open('GET', '/packages/models/snoutx10k/ragdoll.cfg');
    new DataRequest(1062634, 1073550, 0, 0).open('GET', '/packages/models/snoutx10k/gl_shoot.md5anim.iqm');
    new DataRequest(1073550, 1080306, 0, 0).open('GET', '/packages/models/snoutx10k/rl_idle.md5anim.iqm');
    new DataRequest(1080306, 1142598, 0, 0).open('GET', '/packages/models/snoutx10k/forward.md5anim.iqm');
    new DataRequest(1142598, 1153542, 0, 0).open('GET', '/packages/models/snoutx10k/shotgun_shoot.md5anim.iqm');
    new DataRequest(1153542, 1160298, 0, 0).open('GET', '/packages/models/snoutx10k/dead.md5anim.iqm');
    new DataRequest(1160298, 1160392, 0, 0).open('GET', '/packages/models/snoutx10k/readme.txt');
    new DataRequest(1160392, 1177788, 0, 0).open('GET', '/packages/models/snoutx10k/win.md5anim.iqm');
    new DataRequest(1177788, 1184544, 0, 0).open('GET', '/packages/models/snoutx10k/lag.md5anim.iqm');
    new DataRequest(1184544, 1207992, 0, 0).open('GET', '/packages/models/snoutx10k/punch.md5anim.iqm');
    new DataRequest(1207992, 1232064, 0, 0).open('GET', '/packages/models/snoutx10k/dying.md5anim.iqm');
    new DataRequest(1232064, 1238828, 0, 0).open('GET', '/packages/models/snoutx10k/sniper_idle.md5anim.iqm');
    new DataRequest(1238828, 1299493, 0, 0).open('GET', '/packages/models/snoutx10k/upper.jpg');
    new DataRequest(1299493, 1306249, 0, 0).open('GET', '/packages/models/snoutx10k/jump.md5anim.iqm');
    new DataRequest(1306249, 1313013, 0, 0).open('GET', '/packages/models/snoutx10k/shotgun_idle.md5anim.iqm');
    new DataRequest(1313013, 1352005, 0, 0).open('GET', '/packages/models/snoutx10k/upper_mask.jpg');
    new DataRequest(1352005, 1426029, 0, 0).open('GET', '/packages/models/snoutx10k/idle.md5anim.iqm');
    new DataRequest(1426029, 1436997, 0, 0).open('GET', '/packages/models/snoutx10k/chainsaw_attack.md5anim.iqm');
    new DataRequest(1436997, 1465353, 0, 0).open('GET', '/packages/models/snoutx10k/taunt.md5anim.iqm');
    new DataRequest(1465353, 1691913, 0, 0).open('GET', '/packages/models/snoutx10k/snoutx10k.iqm');
    new DataRequest(1691913, 1698677, 0, 0).open('GET', '/packages/models/snoutx10k/chainsaw_idle.md5anim.iqm');
    new DataRequest(1698677, 1718934, 0, 0).open('GET', '/packages/models/snoutx10k/hudguns/snout_hands_mask.jpg');
    new DataRequest(1718934, 1719416, 0, 0).open('GET', '/packages/models/snoutx10k/hudguns/iqm.cfg');
    new DataRequest(1719416, 1780499, 0, 0).open('GET', '/packages/models/snoutx10k/hudguns/snout_hands_normals.jpg');
    new DataRequest(1780499, 1886296, 0, 0).open('GET', '/packages/models/snoutx10k/hudguns/snout_hands.jpg');
    new DataRequest(1886296, 2023800, 0, 0).open('GET', '/packages/models/snoutx10k/hudguns/snout_hands.iqm');
    new DataRequest(2023800, 2023929, 0, 0).open('GET', '/packages/models/snoutx10k/hudguns/chaing/iqm.cfg');
    new DataRequest(2023929, 2024054, 0, 0).open('GET', '/packages/models/snoutx10k/hudguns/gl/iqm.cfg');
    new DataRequest(2024054, 2024183, 0, 0).open('GET', '/packages/models/snoutx10k/hudguns/rocket/iqm.cfg');
    new DataRequest(2024183, 2024311, 0, 0).open('GET', '/packages/models/snoutx10k/hudguns/shotg/iqm.cfg');
    new DataRequest(2024311, 2024439, 0, 0).open('GET', '/packages/models/snoutx10k/hudguns/rifle/iqm.cfg');
    new DataRequest(2024439, 2024533, 0, 0).open('GET', '/packages/models/hudguns/readme.txt');
    new DataRequest(2024533, 2060600, 0, 0).open('GET', '/packages/models/hudguns/chaing/m134_normals.jpg');
    new DataRequest(2060600, 2061072, 0, 0).open('GET', '/packages/models/hudguns/chaing/chaing_shoot.iqm');
    new DataRequest(2061072, 2061639, 0, 0).open('GET', '/packages/models/hudguns/chaing/iqm.cfg');
    new DataRequest(2061639, 2093228, 0, 0).open('GET', '/packages/models/hudguns/chaing/m134_mask.jpg');
    new DataRequest(2093228, 2241291, 0, 0).open('GET', '/packages/models/hudguns/chaing/m134.jpg');
    new DataRequest(2241291, 2241719, 0, 0).open('GET', '/packages/models/hudguns/chaing/chaing_idle.iqm');
    new DataRequest(2241719, 2244787, 0, 0).open('GET', '/packages/models/hudguns/chaing/hands_mg_idle.iqm');
    new DataRequest(2244787, 2335411, 0, 0).open('GET', '/packages/models/hudguns/chaing/chaing.iqm');
    new DataRequest(2335411, 2338811, 0, 0).open('GET', '/packages/models/hudguns/chaing/hands_mg_shoot.iqm');
    new DataRequest(2338811, 2339319, 0, 0).open('GET', '/packages/models/hudguns/gl/gl_idle.md5anim.iqm');
    new DataRequest(2339319, 2494191, 0, 0).open('GET', '/packages/models/hudguns/gl/gl.iqm');
    new DataRequest(2494191, 2498939, 0, 0).open('GET', '/packages/models/hudguns/gl/hands_gl_shoot.md5anim.iqm');
    new DataRequest(2498939, 2562877, 0, 0).open('GET', '/packages/models/hudguns/gl/gl.jpg');
    new DataRequest(2562877, 2565945, 0, 0).open('GET', '/packages/models/hudguns/gl/hands_gl_idle.md5anim.iqm');
    new DataRequest(2565945, 2566428, 0, 0).open('GET', '/packages/models/hudguns/gl/iqm.cfg');
    new DataRequest(2566428, 2567020, 0, 0).open('GET', '/packages/models/hudguns/gl/gl_shoot.md5anim.iqm');
    new DataRequest(2567020, 2602723, 0, 0).open('GET', '/packages/models/hudguns/gl/gl_normals.jpg');
    new DataRequest(2602723, 2620533, 0, 0).open('GET', '/packages/models/hudguns/gl/gl_mask.jpg');
    new DataRequest(2620533, 2624273, 0, 0).open('GET', '/packages/models/hudguns/rocket/hands_rl_shoot.md5anim.iqm');
    new DataRequest(2624273, 2649973, 0, 0).open('GET', '/packages/models/hudguns/rocket/rl_mask.jpg');
    new DataRequest(2649973, 2650609, 0, 0).open('GET', '/packages/models/hudguns/rocket/rl_shoot.md5anim.iqm');
    new DataRequest(2650609, 2651268, 0, 0).open('GET', '/packages/models/hudguns/rocket/iqm.cfg');
    new DataRequest(2651268, 2651776, 0, 0).open('GET', '/packages/models/hudguns/rocket/rl_idle.md5anim.iqm');
    new DataRequest(2651776, 2694844, 0, 0).open('GET', '/packages/models/hudguns/rocket/rl_normals.jpg');
    new DataRequest(2694844, 2801556, 0, 0).open('GET', '/packages/models/hudguns/rocket/rl.iqm');
    new DataRequest(2801556, 2804624, 0, 0).open('GET', '/packages/models/hudguns/rocket/hands_rl_idle.md5anim.iqm');
    new DataRequest(2804624, 2909938, 0, 0).open('GET', '/packages/models/hudguns/rocket/rl.jpg');
    new DataRequest(2909938, 2913006, 0, 0).open('GET', '/packages/models/hudguns/shotg/hands_shotgun_idle.md5anim.iqm');
    new DataRequest(2913006, 2913748, 0, 0).open('GET', '/packages/models/hudguns/shotg/iqm.cfg');
    new DataRequest(2913748, 3016477, 0, 0).open('GET', '/packages/models/hudguns/shotg/shotgun.jpg');
    new DataRequest(3016477, 3018387, 0, 0).open('GET', '/packages/models/hudguns/shotg/shotgun_shell_mask.jpg');
    new DataRequest(3018387, 3024085, 0, 0).open('GET', '/packages/models/hudguns/shotg/shotgun_shell.jpg');
    new DataRequest(3024085, 3055861, 0, 0).open('GET', '/packages/models/hudguns/shotg/shotgun_mask.jpg');
    new DataRequest(3055861, 3059581, 0, 0).open('GET', '/packages/models/hudguns/shotg/shotgun_attack.md5anim.iqm');
    new DataRequest(3059581, 3184173, 0, 0).open('GET', '/packages/models/hudguns/shotg/shotgun.iqm');
    new DataRequest(3184173, 3184953, 0, 0).open('GET', '/packages/models/hudguns/shotg/shotgun_idle.md5anim.iqm');
    new DataRequest(3184953, 3232056, 0, 0).open('GET', '/packages/models/hudguns/shotg/shotgun_normals.jpg');
    new DataRequest(3232056, 3233880, 0, 0).open('GET', '/packages/models/hudguns/shotg/shotgun_shell_normals.jpg');
    new DataRequest(3233880, 3245356, 0, 0).open('GET', '/packages/models/hudguns/shotg/hands_shotgun_shoot.md5anim.iqm');
    new DataRequest(3245356, 3290837, 0, 0).open('GET', '/packages/models/hudguns/rifle/sniper_normals.jpg');
    new DataRequest(3290837, 3388395, 0, 0).open('GET', '/packages/models/hudguns/rifle/sniper.jpg');
    new DataRequest(3388395, 3388990, 0, 0).open('GET', '/packages/models/hudguns/rifle/iqm.cfg');
    new DataRequest(3388990, 3406818, 0, 0).open('GET', '/packages/models/hudguns/rifle/hands_rifle_shoot.md5anim.iqm');
    new DataRequest(3406818, 3596522, 0, 0).open('GET', '/packages/models/hudguns/rifle/rifle.iqm');
    new DataRequest(3596522, 3597118, 0, 0).open('GET', '/packages/models/hudguns/rifle/rifle_idle.md5anim.iqm');
    new DataRequest(3597118, 3625580, 0, 0).open('GET', '/packages/models/hudguns/rifle/sniper_mask.jpg');
    new DataRequest(3625580, 3626724, 0, 0).open('GET', '/packages/models/hudguns/rifle/rifle_shoot.md5anim.iqm');
    new DataRequest(3626724, 3629792, 0, 0).open('GET', '/packages/models/hudguns/rifle/hands_rifle_idle.md5anim.iqm');

    function processPackageData(arrayBuffer) {
      Module.finishedDataFileDownloads++;
      assert(arrayBuffer, 'Loading data file failed.');
      var byteArray = new Uint8Array(arrayBuffer);
      var curr;
      
      // copy the entire loaded file into a spot in the heap. Files will refer to slices in that. They cannot be freed though.
      var ptr = Module['_malloc'](byteArray.length);
      Module['HEAPU8'].set(byteArray, ptr);
      DataRequest.prototype.byteArray = Module['HEAPU8'].subarray(ptr, ptr+byteArray.length);
          DataRequest.prototype.requests["/packages/models/vwep/readme.txt"].onload();
          DataRequest.prototype.requests["/packages/models/vwep/chaing/iqm.cfg"].onload();
          DataRequest.prototype.requests["/packages/models/vwep/chaing/minigun_vwep.iqm"].onload();
          DataRequest.prototype.requests["/packages/models/vwep/gl/gl_vwep.iqm"].onload();
          DataRequest.prototype.requests["/packages/models/vwep/gl/iqm.cfg"].onload();
          DataRequest.prototype.requests["/packages/models/vwep/rocket/iqm.cfg"].onload();
          DataRequest.prototype.requests["/packages/models/vwep/rocket/rl_vwep.iqm"].onload();
          DataRequest.prototype.requests["/packages/models/vwep/shotg/shotgun_vwep.iqm"].onload();
          DataRequest.prototype.requests["/packages/models/vwep/shotg/iqm.cfg"].onload();
          DataRequest.prototype.requests["/packages/models/vwep/rifle/iqm.cfg"].onload();
          DataRequest.prototype.requests["/packages/models/vwep/rifle/sniper_vwep.iqm"].onload();
          DataRequest.prototype.requests["/packages/models/snoutx10k/lower_mask.jpg"].onload();
          DataRequest.prototype.requests["/packages/models/snoutx10k/right.md5anim.iqm"].onload();
          DataRequest.prototype.requests["/packages/models/snoutx10k/gl_idle.md5anim.iqm"].onload();
          DataRequest.prototype.requests["/packages/models/snoutx10k/edit.md5anim.iqm"].onload();
          DataRequest.prototype.requests["/packages/models/snoutx10k/lower.jpg"].onload();
          DataRequest.prototype.requests["/packages/models/snoutx10k/upper_normals.jpg"].onload();
          DataRequest.prototype.requests["/packages/models/snoutx10k/swim.md5anim.iqm"].onload();
          DataRequest.prototype.requests["/packages/models/snoutx10k/sniper_shoot.md5anim.iqm"].onload();
          DataRequest.prototype.requests["/packages/models/snoutx10k/rl_shoot.md5anim.iqm"].onload();
          DataRequest.prototype.requests["/packages/models/snoutx10k/iqm.cfg"].onload();
          DataRequest.prototype.requests["/packages/models/snoutx10k/lose.md5anim.iqm"].onload();
          DataRequest.prototype.requests["/packages/models/snoutx10k/pain.md5anim.iqm"].onload();
          DataRequest.prototype.requests["/packages/models/snoutx10k/pain2.md5anim.iqm"].onload();
          DataRequest.prototype.requests["/packages/models/snoutx10k/left.md5anim.iqm"].onload();
          DataRequest.prototype.requests["/packages/models/snoutx10k/backward.md5anim.iqm"].onload();
          DataRequest.prototype.requests["/packages/models/snoutx10k/lower_normals.jpg"].onload();
          DataRequest.prototype.requests["/packages/models/snoutx10k/shoot.md5anim.iqm"].onload();
          DataRequest.prototype.requests["/packages/models/snoutx10k/minigun_shoot.md5anim.iqm"].onload();
          DataRequest.prototype.requests["/packages/models/snoutx10k/anims.cfg"].onload();
          DataRequest.prototype.requests["/packages/models/snoutx10k/dead2.md5anim.iqm"].onload();
          DataRequest.prototype.requests["/packages/models/snoutx10k/dying2.md5anim.iqm"].onload();
          DataRequest.prototype.requests["/packages/models/snoutx10k/minigun_idle.md5anim.iqm"].onload();
          DataRequest.prototype.requests["/packages/models/snoutx10k/sink.md5anim.iqm"].onload();
          DataRequest.prototype.requests["/packages/models/snoutx10k/ragdoll.cfg"].onload();
          DataRequest.prototype.requests["/packages/models/snoutx10k/gl_shoot.md5anim.iqm"].onload();
          DataRequest.prototype.requests["/packages/models/snoutx10k/rl_idle.md5anim.iqm"].onload();
          DataRequest.prototype.requests["/packages/models/snoutx10k/forward.md5anim.iqm"].onload();
          DataRequest.prototype.requests["/packages/models/snoutx10k/shotgun_shoot.md5anim.iqm"].onload();
          DataRequest.prototype.requests["/packages/models/snoutx10k/dead.md5anim.iqm"].onload();
          DataRequest.prototype.requests["/packages/models/snoutx10k/readme.txt"].onload();
          DataRequest.prototype.requests["/packages/models/snoutx10k/win.md5anim.iqm"].onload();
          DataRequest.prototype.requests["/packages/models/snoutx10k/lag.md5anim.iqm"].onload();
          DataRequest.prototype.requests["/packages/models/snoutx10k/punch.md5anim.iqm"].onload();
          DataRequest.prototype.requests["/packages/models/snoutx10k/dying.md5anim.iqm"].onload();
          DataRequest.prototype.requests["/packages/models/snoutx10k/sniper_idle.md5anim.iqm"].onload();
          DataRequest.prototype.requests["/packages/models/snoutx10k/upper.jpg"].onload();
          DataRequest.prototype.requests["/packages/models/snoutx10k/jump.md5anim.iqm"].onload();
          DataRequest.prototype.requests["/packages/models/snoutx10k/shotgun_idle.md5anim.iqm"].onload();
          DataRequest.prototype.requests["/packages/models/snoutx10k/upper_mask.jpg"].onload();
          DataRequest.prototype.requests["/packages/models/snoutx10k/idle.md5anim.iqm"].onload();
          DataRequest.prototype.requests["/packages/models/snoutx10k/chainsaw_attack.md5anim.iqm"].onload();
          DataRequest.prototype.requests["/packages/models/snoutx10k/taunt.md5anim.iqm"].onload();
          DataRequest.prototype.requests["/packages/models/snoutx10k/snoutx10k.iqm"].onload();
          DataRequest.prototype.requests["/packages/models/snoutx10k/chainsaw_idle.md5anim.iqm"].onload();
          DataRequest.prototype.requests["/packages/models/snoutx10k/hudguns/snout_hands_mask.jpg"].onload();
          DataRequest.prototype.requests["/packages/models/snoutx10k/hudguns/iqm.cfg"].onload();
          DataRequest.prototype.requests["/packages/models/snoutx10k/hudguns/snout_hands_normals.jpg"].onload();
          DataRequest.prototype.requests["/packages/models/snoutx10k/hudguns/snout_hands.jpg"].onload();
          DataRequest.prototype.requests["/packages/models/snoutx10k/hudguns/snout_hands.iqm"].onload();
          DataRequest.prototype.requests["/packages/models/snoutx10k/hudguns/chaing/iqm.cfg"].onload();
          DataRequest.prototype.requests["/packages/models/snoutx10k/hudguns/gl/iqm.cfg"].onload();
          DataRequest.prototype.requests["/packages/models/snoutx10k/hudguns/rocket/iqm.cfg"].onload();
          DataRequest.prototype.requests["/packages/models/snoutx10k/hudguns/shotg/iqm.cfg"].onload();
          DataRequest.prototype.requests["/packages/models/snoutx10k/hudguns/rifle/iqm.cfg"].onload();
          DataRequest.prototype.requests["/packages/models/hudguns/readme.txt"].onload();
          DataRequest.prototype.requests["/packages/models/hudguns/chaing/m134_normals.jpg"].onload();
          DataRequest.prototype.requests["/packages/models/hudguns/chaing/chaing_shoot.iqm"].onload();
          DataRequest.prototype.requests["/packages/models/hudguns/chaing/iqm.cfg"].onload();
          DataRequest.prototype.requests["/packages/models/hudguns/chaing/m134_mask.jpg"].onload();
          DataRequest.prototype.requests["/packages/models/hudguns/chaing/m134.jpg"].onload();
          DataRequest.prototype.requests["/packages/models/hudguns/chaing/chaing_idle.iqm"].onload();
          DataRequest.prototype.requests["/packages/models/hudguns/chaing/hands_mg_idle.iqm"].onload();
          DataRequest.prototype.requests["/packages/models/hudguns/chaing/chaing.iqm"].onload();
          DataRequest.prototype.requests["/packages/models/hudguns/chaing/hands_mg_shoot.iqm"].onload();
          DataRequest.prototype.requests["/packages/models/hudguns/gl/gl_idle.md5anim.iqm"].onload();
          DataRequest.prototype.requests["/packages/models/hudguns/gl/gl.iqm"].onload();
          DataRequest.prototype.requests["/packages/models/hudguns/gl/hands_gl_shoot.md5anim.iqm"].onload();
          DataRequest.prototype.requests["/packages/models/hudguns/gl/gl.jpg"].onload();
          DataRequest.prototype.requests["/packages/models/hudguns/gl/hands_gl_idle.md5anim.iqm"].onload();
          DataRequest.prototype.requests["/packages/models/hudguns/gl/iqm.cfg"].onload();
          DataRequest.prototype.requests["/packages/models/hudguns/gl/gl_shoot.md5anim.iqm"].onload();
          DataRequest.prototype.requests["/packages/models/hudguns/gl/gl_normals.jpg"].onload();
          DataRequest.prototype.requests["/packages/models/hudguns/gl/gl_mask.jpg"].onload();
          DataRequest.prototype.requests["/packages/models/hudguns/rocket/hands_rl_shoot.md5anim.iqm"].onload();
          DataRequest.prototype.requests["/packages/models/hudguns/rocket/rl_mask.jpg"].onload();
          DataRequest.prototype.requests["/packages/models/hudguns/rocket/rl_shoot.md5anim.iqm"].onload();
          DataRequest.prototype.requests["/packages/models/hudguns/rocket/iqm.cfg"].onload();
          DataRequest.prototype.requests["/packages/models/hudguns/rocket/rl_idle.md5anim.iqm"].onload();
          DataRequest.prototype.requests["/packages/models/hudguns/rocket/rl_normals.jpg"].onload();
          DataRequest.prototype.requests["/packages/models/hudguns/rocket/rl.iqm"].onload();
          DataRequest.prototype.requests["/packages/models/hudguns/rocket/hands_rl_idle.md5anim.iqm"].onload();
          DataRequest.prototype.requests["/packages/models/hudguns/rocket/rl.jpg"].onload();
          DataRequest.prototype.requests["/packages/models/hudguns/shotg/hands_shotgun_idle.md5anim.iqm"].onload();
          DataRequest.prototype.requests["/packages/models/hudguns/shotg/iqm.cfg"].onload();
          DataRequest.prototype.requests["/packages/models/hudguns/shotg/shotgun.jpg"].onload();
          DataRequest.prototype.requests["/packages/models/hudguns/shotg/shotgun_shell_mask.jpg"].onload();
          DataRequest.prototype.requests["/packages/models/hudguns/shotg/shotgun_shell.jpg"].onload();
          DataRequest.prototype.requests["/packages/models/hudguns/shotg/shotgun_mask.jpg"].onload();
          DataRequest.prototype.requests["/packages/models/hudguns/shotg/shotgun_attack.md5anim.iqm"].onload();
          DataRequest.prototype.requests["/packages/models/hudguns/shotg/shotgun.iqm"].onload();
          DataRequest.prototype.requests["/packages/models/hudguns/shotg/shotgun_idle.md5anim.iqm"].onload();
          DataRequest.prototype.requests["/packages/models/hudguns/shotg/shotgun_normals.jpg"].onload();
          DataRequest.prototype.requests["/packages/models/hudguns/shotg/shotgun_shell_normals.jpg"].onload();
          DataRequest.prototype.requests["/packages/models/hudguns/shotg/hands_shotgun_shoot.md5anim.iqm"].onload();
          DataRequest.prototype.requests["/packages/models/hudguns/rifle/sniper_normals.jpg"].onload();
          DataRequest.prototype.requests["/packages/models/hudguns/rifle/sniper.jpg"].onload();
          DataRequest.prototype.requests["/packages/models/hudguns/rifle/iqm.cfg"].onload();
          DataRequest.prototype.requests["/packages/models/hudguns/rifle/hands_rifle_shoot.md5anim.iqm"].onload();
          DataRequest.prototype.requests["/packages/models/hudguns/rifle/rifle.iqm"].onload();
          DataRequest.prototype.requests["/packages/models/hudguns/rifle/rifle_idle.md5anim.iqm"].onload();
          DataRequest.prototype.requests["/packages/models/hudguns/rifle/sniper_mask.jpg"].onload();
          DataRequest.prototype.requests["/packages/models/hudguns/rifle/rifle_shoot.md5anim.iqm"].onload();
          DataRequest.prototype.requests["/packages/models/hudguns/rifle/hands_rifle_idle.md5anim.iqm"].onload();
          Module['removeRunDependency']('datafile_character.data');

    };
    Module['addRunDependency']('datafile_character.data');
  
    if (!Module.preloadResults) Module.preloadResults = {};
  
      Module.preloadResults[PACKAGE_NAME] = {fromCache: false};
      if (fetched) {
        processPackageData(fetched);
        fetched = null;
      } else {
        fetchedCallback = processPackageData;
      }
    
  }
  if (Module['calledRun']) {
    runWithFS();
  } else {
    if (!Module['preRun']) Module['preRun'] = [];
    Module["preRun"].push(runWithFS); // FS is not initialized yet, wait for it
  }

  if (!Module['postRun']) Module['postRun'] = [];
  Module["postRun"].push(function() {
    decrunchWorker.terminate();
  });

})();

