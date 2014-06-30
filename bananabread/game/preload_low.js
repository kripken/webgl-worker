
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
    var PACKAGE_NAME = 'low.data';
    var REMOTE_PACKAGE_NAME = (Module['filePackagePrefixURL'] || '') + 'low.data';
    var REMOTE_PACKAGE_SIZE = 2819318;
    var PACKAGE_UUID = 'cf4cf3ec-d1f2-4ea9-affb-0fb210017deb';
  
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
Module['FS_createPath']('/packages', 'base', true, true);
Module['FS_createPath']('/packages', 'models', true, true);
Module['FS_createPath']('/packages/models', 'ffflag', true, true);
Module['FS_createPath']('/packages/models', 'ffpit', true, true);
Module['FS_createPath']('/packages', 'gk', true, true);
Module['FS_createPath']('/packages/gk', 'fantasy', true, true);
Module['FS_createPath']('/packages/gk/fantasy', 'skyfantasyJPG', true, true);
Module['FS_createPath']('/packages/gk/fantasy', 'stone_ground_tiles_gk_v01', true, true);
Module['FS_createPath']('/packages/gk/fantasy', 'rock_formation_gk_v01', true, true);
Module['FS_createPath']('/packages/gk/fantasy', 'castell_wall_gk_v01', true, true);
Module['FS_createPath']('/packages/gk/fantasy', 'castell_wall_trim_gk_v01', true, true);
Module['FS_createPath']('/packages/gk/fantasy', 'wooden_roof_tiles_gk_v01', true, true);
Module['FS_createPath']('/packages/gk/fantasy', 'castell_wall_gk_v03', true, true);
Module['FS_createPath']('/packages/gk/fantasy', 'castell_plaster_gk_v01', true, true);
Module['FS_createPath']('/packages/gk/fantasy', 'castell_wall_gk_v02', true, true);
Module['FS_createPath']('/packages/gk/fantasy', 'stone_ground_gk_v01', true, true);
Module['FS_createPath']('/packages/gk/fantasy', 'iron_trim_gk_v01', true, true);
Module['FS_createPath']('/packages/gk/fantasy', 'iron_plates_gk_v01', true, true);
Module['FS_createPath']('/packages/gk/fantasy', 'wooden_planks_gk_v01', true, true);
Module['FS_createPath']('/packages/gk/fantasy', 'rock_formation_gk_v02', true, true);
Module['FS_createPath']('/packages/gk/fantasy', 'iron_intersection_gk_v01', true, true);

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
      new DataRequest(0, 554042, 0, 0).open('GET', '/packages/base/colos.ogz');
    new DataRequest(554042, 555197, 0, 0).open('GET', '/packages/base/colos.cfg');
    new DataRequest(555197, 566661, 0, 0).open('GET', '/packages/base/colos.wpt');
    new DataRequest(566661, 566913, 0, 0).open('GET', '/packages/models/ffflag/md5.cfg');
    new DataRequest(566913, 738665, 1, 0).open('GET', '/packages/models/ffflag/ffflag_cc.dds');
    new DataRequest(738665, 893498, 1, 0).open('GET', '/packages/models/ffflag/ffflag_nm.dds');
    new DataRequest(893498, 1050111, 1, 0).open('GET', '/packages/models/ffflag/ffflag_sc.dds');
    new DataRequest(1050111, 1073532, 0, 0).open('GET', '/packages/models/ffflag/ffflag.md5mesh');
    new DataRequest(1073532, 1165287, 0, 0).open('GET', '/packages/models/ffflag/ffflag.md5anim');
    new DataRequest(1165287, 1165567, 0, 0).open('GET', '/packages/models/ffpit/md5.cfg');
    new DataRequest(1165567, 1230877, 1, 0).open('GET', '/packages/models/ffpit/ffpit_01_gk_sc.dds');
    new DataRequest(1230877, 1298164, 1, 0).open('GET', '/packages/models/ffpit/ffpit_01_gk_nm.dds');
    new DataRequest(1298164, 1366160, 1, 0).open('GET', '/packages/models/ffpit/ffpit_01_gk_cc.dds');
    new DataRequest(1366160, 1411357, 0, 0).open('GET', '/packages/models/ffpit/ffpit.md5mesh');
    new DataRequest(1411357, 1467958, 0, 0).open('GET', '/packages/gk/fantasy/skyfantasyJPG/skyfantasy_up.jpg');
    new DataRequest(1467958, 1580183, 0, 0).open('GET', '/packages/gk/fantasy/skyfantasyJPG/skyfantasy_rt.jpg');
    new DataRequest(1580183, 1698829, 0, 0).open('GET', '/packages/gk/fantasy/skyfantasyJPG/skyfantasy_bk.jpg');
    new DataRequest(1698829, 1839857, 0, 0).open('GET', '/packages/gk/fantasy/skyfantasyJPG/skyfantasy_dn.jpg');
    new DataRequest(1839857, 1956448, 0, 0).open('GET', '/packages/gk/fantasy/skyfantasyJPG/skyfantasy_ft.jpg');
    new DataRequest(1956448, 2068659, 0, 0).open('GET', '/packages/gk/fantasy/skyfantasyJPG/skyfantasy_lf.jpg');
    new DataRequest(2068659, 2069130, 0, 0).open('GET', '/packages/gk/fantasy/stone_ground_tiles_gk_v01/package.cfg');
    new DataRequest(2069130, 2069569, 0, 0).open('GET', '/packages/gk/fantasy/rock_formation_gk_v01/package.cfg');
    new DataRequest(2069569, 2070288, 0, 0).open('GET', '/packages/gk/fantasy/castell_wall_gk_v01/package.cfg');
    new DataRequest(2070288, 2071087, 0, 0).open('GET', '/packages/gk/fantasy/castell_wall_trim_gk_v01/package.cfg');
    new DataRequest(2071087, 2071885, 0, 0).open('GET', '/packages/gk/fantasy/wooden_roof_tiles_gk_v01/package.cfg');
    new DataRequest(2071885, 2072604, 0, 0).open('GET', '/packages/gk/fantasy/castell_wall_gk_v03/package.cfg');
    new DataRequest(2072604, 2073051, 0, 0).open('GET', '/packages/gk/fantasy/castell_plaster_gk_v01/package.cfg');
    new DataRequest(2073051, 2073475, 0, 0).open('GET', '/packages/gk/fantasy/package.cfg');
    new DataRequest(2073475, 2074194, 0, 0).open('GET', '/packages/gk/fantasy/castell_wall_gk_v02/package.cfg');
    new DataRequest(2074194, 2074617, 0, 0).open('GET', '/packages/gk/fantasy/stone_ground_gk_v01/package.cfg');
    new DataRequest(2074617, 2075289, 0, 0).open('GET', '/packages/gk/fantasy/iron_trim_gk_v01/package.cfg');
    new DataRequest(2075289, 2075991, 0, 0).open('GET', '/packages/gk/fantasy/iron_plates_gk_v01/package.cfg');
    new DataRequest(2075991, 2076725, 0, 0).open('GET', '/packages/gk/fantasy/wooden_planks_gk_v01/package.cfg');
    new DataRequest(2076725, 2077164, 0, 0).open('GET', '/packages/gk/fantasy/rock_formation_gk_v02/package.cfg');
    new DataRequest(2077164, 2077623, 0, 0).open('GET', '/packages/gk/fantasy/iron_intersection_gk_v01/package.cfg');
    new DataRequest(2077623, 2196237, 1, 0).open('GET', '/packages/gk/fantasy/rock_formation_gk_v01/rock_formation_gk_v01_cc.dds');
    new DataRequest(2196237, 2215095, 1, 0).open('GET', '/packages/gk/fantasy/rock_formation_gk_v01/rock_formation_gk_v01_nm.dds');
    new DataRequest(2215095, 2245979, 1, 0).open('GET', '/packages/gk/fantasy/castell_wall_gk_v01/castell_wall_gk_v01_cc.dds');
    new DataRequest(2245979, 2276406, 1, 0).open('GET', '/packages/gk/fantasy/castell_wall_gk_v01/castell_wall_gk_v01_nm.dds');
    new DataRequest(2276406, 2306780, 1, 0).open('GET', '/packages/gk/fantasy/castell_wall_gk_v02/castell_wall_gk_v02_cc.dds');
    new DataRequest(2306780, 2325401, 1, 0).open('GET', '/packages/gk/fantasy/castell_wall_gk_v02/castell_wall_gk_v02_nm.dds');
    new DataRequest(2325401, 2340263, 1, 0).open('GET', '/packages/gk/fantasy/castell_wall_trim_gk_v01/castell_wall_trim_gk_v01_cc.dds');
    new DataRequest(2340263, 2354342, 1, 0).open('GET', '/packages/gk/fantasy/castell_wall_trim_gk_v01/castell_wall_trim_gk_v01_nm.dds');
    new DataRequest(2354342, 2473389, 1, 0).open('GET', '/packages/gk/fantasy/stone_ground_tiles_gk_v01/stone_ground_tiles_gk_v01_cc.dds');
    new DataRequest(2473389, 2504454, 1, 0).open('GET', '/packages/gk/fantasy/stone_ground_tiles_gk_v01/stone_ground_tiles_gk_v01_nm.dds');
    new DataRequest(2504454, 2533363, 1, 0).open('GET', '/packages/gk/fantasy/wooden_planks_gk_v01/wooden_planks_gk_v01_cc.dds');
    new DataRequest(2533363, 2561716, 1, 0).open('GET', '/packages/gk/fantasy/wooden_planks_gk_v01/wooden_planks_gk_v01_nm.dds');
    new DataRequest(2561716, 2592576, 1, 0).open('GET', '/packages/gk/fantasy/castell_plaster_gk_v01/castell_plaster_gk_v01_cc.dds');
    new DataRequest(2592576, 2623014, 1, 0).open('GET', '/packages/gk/fantasy/castell_plaster_gk_v01/castell_plaster_gk_v01_nm.dds');
    new DataRequest(2623014, 2688028, 1, 0).open('GET', '/packages/gk/fantasy/iron_plates_gk_v01/iron_plates_gk_v01_cc.dds');
    new DataRequest(2688028, 2753153, 1, 0).open('GET', '/packages/gk/fantasy/iron_plates_gk_v01/iron_plates_gk_v01_nm.dds');
    new DataRequest(2753153, 2768031, 1, 0).open('GET', '/packages/gk/fantasy/iron_trim_gk_v01/iron_trim_gk_v01_cc.dds');
    new DataRequest(2768031, 2782741, 1, 0).open('GET', '/packages/gk/fantasy/iron_trim_gk_v01/iron_trim_gk_v01_nm.dds');
    new DataRequest(2782741, 2790202, 1, 0).open('GET', '/packages/gk/fantasy/iron_intersection_gk_v01/iron_intersection_gk_v01_cc.dds');
    new DataRequest(2790202, 2819318, 1, 0).open('GET', '/packages/gk/fantasy/iron_intersection_gk_v01/iron_intersection_gk_v01_nm.dds');

    function processPackageData(arrayBuffer) {
      Module.finishedDataFileDownloads++;
      assert(arrayBuffer, 'Loading data file failed.');
      var byteArray = new Uint8Array(arrayBuffer);
      var curr;
      
      // copy the entire loaded file into a spot in the heap. Files will refer to slices in that. They cannot be freed though.
      var ptr = Module['_malloc'](byteArray.length);
      Module['HEAPU8'].set(byteArray, ptr);
      DataRequest.prototype.byteArray = Module['HEAPU8'].subarray(ptr, ptr+byteArray.length);
          DataRequest.prototype.requests["/packages/base/colos.ogz"].onload();
          DataRequest.prototype.requests["/packages/base/colos.cfg"].onload();
          DataRequest.prototype.requests["/packages/base/colos.wpt"].onload();
          DataRequest.prototype.requests["/packages/models/ffflag/md5.cfg"].onload();
          DataRequest.prototype.requests["/packages/models/ffflag/ffflag_cc.dds"].onload();
          DataRequest.prototype.requests["/packages/models/ffflag/ffflag_nm.dds"].onload();
          DataRequest.prototype.requests["/packages/models/ffflag/ffflag_sc.dds"].onload();
          DataRequest.prototype.requests["/packages/models/ffflag/ffflag.md5mesh"].onload();
          DataRequest.prototype.requests["/packages/models/ffflag/ffflag.md5anim"].onload();
          DataRequest.prototype.requests["/packages/models/ffpit/md5.cfg"].onload();
          DataRequest.prototype.requests["/packages/models/ffpit/ffpit_01_gk_sc.dds"].onload();
          DataRequest.prototype.requests["/packages/models/ffpit/ffpit_01_gk_nm.dds"].onload();
          DataRequest.prototype.requests["/packages/models/ffpit/ffpit_01_gk_cc.dds"].onload();
          DataRequest.prototype.requests["/packages/models/ffpit/ffpit.md5mesh"].onload();
          DataRequest.prototype.requests["/packages/gk/fantasy/skyfantasyJPG/skyfantasy_up.jpg"].onload();
          DataRequest.prototype.requests["/packages/gk/fantasy/skyfantasyJPG/skyfantasy_rt.jpg"].onload();
          DataRequest.prototype.requests["/packages/gk/fantasy/skyfantasyJPG/skyfantasy_bk.jpg"].onload();
          DataRequest.prototype.requests["/packages/gk/fantasy/skyfantasyJPG/skyfantasy_dn.jpg"].onload();
          DataRequest.prototype.requests["/packages/gk/fantasy/skyfantasyJPG/skyfantasy_ft.jpg"].onload();
          DataRequest.prototype.requests["/packages/gk/fantasy/skyfantasyJPG/skyfantasy_lf.jpg"].onload();
          DataRequest.prototype.requests["/packages/gk/fantasy/stone_ground_tiles_gk_v01/package.cfg"].onload();
          DataRequest.prototype.requests["/packages/gk/fantasy/rock_formation_gk_v01/package.cfg"].onload();
          DataRequest.prototype.requests["/packages/gk/fantasy/castell_wall_gk_v01/package.cfg"].onload();
          DataRequest.prototype.requests["/packages/gk/fantasy/castell_wall_trim_gk_v01/package.cfg"].onload();
          DataRequest.prototype.requests["/packages/gk/fantasy/wooden_roof_tiles_gk_v01/package.cfg"].onload();
          DataRequest.prototype.requests["/packages/gk/fantasy/castell_wall_gk_v03/package.cfg"].onload();
          DataRequest.prototype.requests["/packages/gk/fantasy/castell_plaster_gk_v01/package.cfg"].onload();
          DataRequest.prototype.requests["/packages/gk/fantasy/package.cfg"].onload();
          DataRequest.prototype.requests["/packages/gk/fantasy/castell_wall_gk_v02/package.cfg"].onload();
          DataRequest.prototype.requests["/packages/gk/fantasy/stone_ground_gk_v01/package.cfg"].onload();
          DataRequest.prototype.requests["/packages/gk/fantasy/iron_trim_gk_v01/package.cfg"].onload();
          DataRequest.prototype.requests["/packages/gk/fantasy/iron_plates_gk_v01/package.cfg"].onload();
          DataRequest.prototype.requests["/packages/gk/fantasy/wooden_planks_gk_v01/package.cfg"].onload();
          DataRequest.prototype.requests["/packages/gk/fantasy/rock_formation_gk_v02/package.cfg"].onload();
          DataRequest.prototype.requests["/packages/gk/fantasy/iron_intersection_gk_v01/package.cfg"].onload();
          DataRequest.prototype.requests["/packages/gk/fantasy/rock_formation_gk_v01/rock_formation_gk_v01_cc.dds"].onload();
          DataRequest.prototype.requests["/packages/gk/fantasy/rock_formation_gk_v01/rock_formation_gk_v01_nm.dds"].onload();
          DataRequest.prototype.requests["/packages/gk/fantasy/castell_wall_gk_v01/castell_wall_gk_v01_cc.dds"].onload();
          DataRequest.prototype.requests["/packages/gk/fantasy/castell_wall_gk_v01/castell_wall_gk_v01_nm.dds"].onload();
          DataRequest.prototype.requests["/packages/gk/fantasy/castell_wall_gk_v02/castell_wall_gk_v02_cc.dds"].onload();
          DataRequest.prototype.requests["/packages/gk/fantasy/castell_wall_gk_v02/castell_wall_gk_v02_nm.dds"].onload();
          DataRequest.prototype.requests["/packages/gk/fantasy/castell_wall_trim_gk_v01/castell_wall_trim_gk_v01_cc.dds"].onload();
          DataRequest.prototype.requests["/packages/gk/fantasy/castell_wall_trim_gk_v01/castell_wall_trim_gk_v01_nm.dds"].onload();
          DataRequest.prototype.requests["/packages/gk/fantasy/stone_ground_tiles_gk_v01/stone_ground_tiles_gk_v01_cc.dds"].onload();
          DataRequest.prototype.requests["/packages/gk/fantasy/stone_ground_tiles_gk_v01/stone_ground_tiles_gk_v01_nm.dds"].onload();
          DataRequest.prototype.requests["/packages/gk/fantasy/wooden_planks_gk_v01/wooden_planks_gk_v01_cc.dds"].onload();
          DataRequest.prototype.requests["/packages/gk/fantasy/wooden_planks_gk_v01/wooden_planks_gk_v01_nm.dds"].onload();
          DataRequest.prototype.requests["/packages/gk/fantasy/castell_plaster_gk_v01/castell_plaster_gk_v01_cc.dds"].onload();
          DataRequest.prototype.requests["/packages/gk/fantasy/castell_plaster_gk_v01/castell_plaster_gk_v01_nm.dds"].onload();
          DataRequest.prototype.requests["/packages/gk/fantasy/iron_plates_gk_v01/iron_plates_gk_v01_cc.dds"].onload();
          DataRequest.prototype.requests["/packages/gk/fantasy/iron_plates_gk_v01/iron_plates_gk_v01_nm.dds"].onload();
          DataRequest.prototype.requests["/packages/gk/fantasy/iron_trim_gk_v01/iron_trim_gk_v01_cc.dds"].onload();
          DataRequest.prototype.requests["/packages/gk/fantasy/iron_trim_gk_v01/iron_trim_gk_v01_nm.dds"].onload();
          DataRequest.prototype.requests["/packages/gk/fantasy/iron_intersection_gk_v01/iron_intersection_gk_v01_cc.dds"].onload();
          DataRequest.prototype.requests["/packages/gk/fantasy/iron_intersection_gk_v01/iron_intersection_gk_v01_nm.dds"].onload();
          Module['removeRunDependency']('datafile_low.data');

    };
    Module['addRunDependency']('datafile_low.data');
  
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

