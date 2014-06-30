
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
    var PACKAGE_NAME = 'base.data';
    var REMOTE_PACKAGE_NAME = (Module['filePackagePrefixURL'] || '') + 'base.data';
    var REMOTE_PACKAGE_SIZE = 6963608;
    var PACKAGE_UUID = 'ff987540-94c7-4140-96c8-bfd20489a60e';
  
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
Module['FS_createPath']('/', 'data', true, true);
Module['FS_createPath']('/', 'packages', true, true);
Module['FS_createPath']('/packages', 'textures', true, true);
Module['FS_createPath']('/packages', 'fonts', true, true);
Module['FS_createPath']('/packages', 'icons', true, true);
Module['FS_createPath']('/packages', 'particles', true, true);
Module['FS_createPath']('/packages', 'sounds', true, true);
Module['FS_createPath']('/packages/sounds', 'aard', true, true);
Module['FS_createPath']('/packages/sounds', 'q009', true, true);
Module['FS_createPath']('/packages/sounds', 'yo_frankie', true, true);
Module['FS_createPath']('/packages', 'gk', true, true);
Module['FS_createPath']('/packages/gk', 'lava', true, true);
Module['FS_createPath']('/packages', 'caustics', true, true);
Module['FS_createPath']('/packages', 'models', true, true);
Module['FS_createPath']('/packages/models', 'debris', true, true);
Module['FS_createPath']('/packages/models', 'projectiles', true, true);
Module['FS_createPath']('/packages/models/projectiles', 'grenade', true, true);
Module['FS_createPath']('/packages/models/projectiles', 'rocket', true, true);
Module['FS_createPath']('/packages', 'brushes', true, true);
Module['FS_createPath']('/packages', 'hud', true, true);

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
      new DataRequest(0, 47850, 0, 0).open('GET', '/data/menus.cfg');
    new DataRequest(47850, 52734, 0, 0).open('GET', '/data/guioverlay.png');
    new DataRequest(52734, 66286, 0, 0).open('GET', '/data/background_decal.png');
    new DataRequest(66286, 69197, 0, 0).open('GET', '/data/sounds.cfg');
    new DataRequest(69197, 70419, 0, 0).open('GET', '/data/default_map_settings.cfg');
    new DataRequest(70419, 73702, 0, 0).open('GET', '/data/hit.png');
    new DataRequest(73702, 73838, 0, 0).open('GET', '/data/default_map_models.cfg');
    new DataRequest(73838, 77121, 0, 0).open('GET', '/data/crosshair.png');
    new DataRequest(77121, 80433, 0, 0).open('GET', '/data/teammate.png');
    new DataRequest(80433, 97995, 0, 0).open('GET', '/data/background.png');
    new DataRequest(97995, 187625, 0, 0).open('GET', '/data/stdshader.cfg');
    new DataRequest(187625, 191871, 0, 0).open('GET', '/data/guiskin.png');
    new DataRequest(191871, 322077, 0, 0).open('GET', '/data/logo.png');
    new DataRequest(322077, 324909, 0, 0).open('GET', '/data/guislider.png');
    new DataRequest(324909, 327316, 0, 0).open('GET', '/data/keymap.cfg');
    new DataRequest(327316, 332200, 0, 0).open('GET', '/data/mapshot_frame.png');
    new DataRequest(332200, 336131, 0, 0).open('GET', '/data/guicursor.png');
    new DataRequest(336131, 339114, 0, 0).open('GET', '/data/loading_bar.png');
    new DataRequest(339114, 423601, 0, 0).open('GET', '/data/glsl.cfg');
    new DataRequest(423601, 427282, 0, 0).open('GET', '/data/loading_frame.png');
    new DataRequest(427282, 428295, 0, 0).open('GET', '/data/stdlib.cfg');
    new DataRequest(428295, 432061, 0, 0).open('GET', '/data/game_fps.cfg');
    new DataRequest(432061, 432220, 0, 0).open('GET', '/data/background_detail.png');
    new DataRequest(432220, 440724, 0, 0).open('GET', '/data/stdedit.cfg');
    new DataRequest(440724, 440796, 0, 0).open('GET', '/data/font.cfg');
    new DataRequest(440796, 446313, 0, 0).open('GET', '/data/brush.cfg');
    new DataRequest(446313, 454478, 0, 0).open('GET', '/data/game_rpg.cfg');
    new DataRequest(454478, 461695, 0, 0).open('GET', '/data/defaults.cfg');
    new DataRequest(461695, 617698, 0, 0).open('GET', '/packages/textures/water.jpg');
    new DataRequest(617698, 872871, 0, 0).open('GET', '/packages/textures/waterdudv.jpg');
    new DataRequest(872871, 875907, 0, 0).open('GET', '/packages/textures/notexture.png');
    new DataRequest(875907, 1053469, 0, 0).open('GET', '/packages/textures/waterfalln.jpg');
    new DataRequest(1053469, 1090663, 0, 0).open('GET', '/packages/textures/waterfall.jpg');
    new DataRequest(1090663, 1091334, 0, 0).open('GET', '/packages/textures/readme.txt');
    new DataRequest(1091334, 1333504, 0, 0).open('GET', '/packages/textures/waterfalldudv.jpg');
    new DataRequest(1333504, 1683327, 0, 0).open('GET', '/packages/textures/watern.jpg');
    new DataRequest(1683327, 1769451, 0, 0).open('GET', '/packages/fonts/font.png');
    new DataRequest(1769451, 1771693, 0, 0).open('GET', '/packages/fonts/default.cfg');
    new DataRequest(1771693, 1776418, 0, 0).open('GET', '/packages/fonts/font_readme.txt');
    new DataRequest(1776418, 1789796, 0, 0).open('GET', '/packages/icons/info.jpg');
    new DataRequest(1789796, 1801906, 0, 0).open('GET', '/packages/icons/arrow_fw.jpg');
    new DataRequest(1801906, 1817040, 0, 0).open('GET', '/packages/icons/frankie.jpg');
    new DataRequest(1817040, 1835716, 0, 0).open('GET', '/packages/icons/server.jpg');
    new DataRequest(1835716, 1848996, 0, 0).open('GET', '/packages/icons/radio_on.jpg');
    new DataRequest(1848996, 1867199, 0, 0).open('GET', '/packages/icons/checkbox_on.jpg');
    new DataRequest(1867199, 1880094, 0, 0).open('GET', '/packages/icons/cube.jpg');
    new DataRequest(1880094, 1893151, 0, 0).open('GET', '/packages/icons/exit.jpg');
    new DataRequest(1893151, 1909591, 0, 0).open('GET', '/packages/icons/checkbox_off.jpg');
    new DataRequest(1909591, 1922659, 0, 0).open('GET', '/packages/icons/chat.jpg');
    new DataRequest(1922659, 1926748, 0, 0).open('GET', '/packages/icons/menu.png');
    new DataRequest(1926748, 1926845, 0, 0).open('GET', '/packages/icons/readme.txt');
    new DataRequest(1926845, 1940341, 0, 0).open('GET', '/packages/icons/snoutx10k.jpg');
    new DataRequest(1940341, 1959069, 0, 0).open('GET', '/packages/icons/radio_off.jpg');
    new DataRequest(1959069, 1970731, 0, 0).open('GET', '/packages/icons/arrow_bw.jpg');
    new DataRequest(1970731, 1989038, 0, 0).open('GET', '/packages/icons/action.jpg');
    new DataRequest(1989038, 2007030, 0, 0).open('GET', '/packages/icons/menu.jpg');
    new DataRequest(2007030, 2020534, 0, 0).open('GET', '/packages/icons/hand.jpg');
    new DataRequest(2020534, 2078396, 0, 0).open('GET', '/packages/particles/lightning.jpg');
    new DataRequest(2078396, 2082908, 0, 0).open('GET', '/packages/particles/smoke.png');
    new DataRequest(2082908, 2084713, 0, 0).open('GET', '/packages/particles/spark.png');
    new DataRequest(2084713, 2146865, 0, 0).open('GET', '/packages/particles/ball2.png');
    new DataRequest(2146865, 2166370, 0, 0).open('GET', '/packages/particles/circle.png');
    new DataRequest(2166370, 2177870, 0, 0).open('GET', '/packages/particles/muzzleflash2.jpg');
    new DataRequest(2177870, 2193496, 0, 0).open('GET', '/packages/particles/blood.png');
    new DataRequest(2193496, 2200911, 0, 0).open('GET', '/packages/particles/steam.png');
    new DataRequest(2200911, 2934390, 0, 0).open('GET', '/packages/particles/explosion.png');
    new DataRequest(2934390, 2934634, 0, 0).open('GET', '/packages/particles/readme.txt');
    new DataRequest(2934634, 2937532, 0, 0).open('GET', '/packages/particles/base.png');
    new DataRequest(2937532, 2939799, 0, 0).open('GET', '/packages/particles/blob.png');
    new DataRequest(2939799, 2996963, 0, 0).open('GET', '/packages/particles/bullet.png');
    new DataRequest(2996963, 3009066, 0, 0).open('GET', '/packages/particles/muzzleflash1.jpg');
    new DataRequest(3009066, 3079258, 0, 0).open('GET', '/packages/particles/flames.png');
    new DataRequest(3079258, 3079503, 0, 0).open('GET', '/packages/particles/readme.txt~');
    new DataRequest(3079503, 3080364, 0, 0).open('GET', '/packages/particles/flare.jpg');
    new DataRequest(3080364, 3092649, 0, 0).open('GET', '/packages/particles/muzzleflash3.jpg');
    new DataRequest(3092649, 3418549, 0, 0).open('GET', '/packages/particles/lensflares.png');
    new DataRequest(3418549, 3458385, 0, 0).open('GET', '/packages/particles/scorch.png');
    new DataRequest(3458385, 3512317, 0, 0).open('GET', '/packages/particles/ball1.png');
    new DataRequest(3512317, 3537787, 0, 1).open('GET', '/packages/sounds/aard/pain1.wav');
    new DataRequest(3537787, 3547501, 0, 1).open('GET', '/packages/sounds/aard/die1.wav');
    new DataRequest(3547501, 3558863, 0, 1).open('GET', '/packages/sounds/aard/land.wav');
    new DataRequest(3558863, 3562557, 0, 1).open('GET', '/packages/sounds/aard/grunt2.wav');
    new DataRequest(3562557, 3564261, 0, 1).open('GET', '/packages/sounds/aard/tak.wav');
    new DataRequest(3564261, 3570907, 0, 1).open('GET', '/packages/sounds/aard/weapload.wav');
    new DataRequest(3570907, 3582313, 0, 1).open('GET', '/packages/sounds/aard/grunt1.wav');
    new DataRequest(3582313, 3591663, 0, 1).open('GET', '/packages/sounds/aard/pain3.wav');
    new DataRequest(3591663, 3601073, 0, 1).open('GET', '/packages/sounds/aard/pain2.wav');
    new DataRequest(3601073, 3611725, 0, 1).open('GET', '/packages/sounds/aard/die2.wav');
    new DataRequest(3611725, 3619685, 0, 1).open('GET', '/packages/sounds/aard/pain5.wav');
    new DataRequest(3619685, 3627665, 0, 1).open('GET', '/packages/sounds/aard/pain4.wav');
    new DataRequest(3627665, 3639527, 0, 1).open('GET', '/packages/sounds/aard/bang.wav');
    new DataRequest(3639527, 3651841, 0, 1).open('GET', '/packages/sounds/aard/itempick.wav');
    new DataRequest(3651841, 3659507, 0, 1).open('GET', '/packages/sounds/aard/pain6.wav');
    new DataRequest(3659507, 3663565, 0, 1).open('GET', '/packages/sounds/aard/outofammo.wav');
    new DataRequest(3663565, 3667697, 0, 1).open('GET', '/packages/sounds/aard/jump.wav');
    new DataRequest(3667697, 3695584, 0, 1).open('GET', '/packages/sounds/q009/minigun.ogg');
    new DataRequest(3695584, 3819982, 0, 1).open('GET', '/packages/sounds/q009/shotgun3.ogg');
    new DataRequest(3819982, 3878681, 0, 1).open('GET', '/packages/sounds/q009/rlauncher2.ogg');
    new DataRequest(3878681, 4001364, 0, 1).open('GET', '/packages/sounds/q009/rifle3.ogg');
    new DataRequest(4001364, 4027537, 0, 1).open('GET', '/packages/sounds/q009/teleport.ogg');
    new DataRequest(4027537, 4161323, 0, 1).open('GET', '/packages/sounds/q009/ren.ogg');
    new DataRequest(4161323, 4184651, 0, 1).open('GET', '/packages/sounds/q009/minigun2.ogg');
    new DataRequest(4184651, 4203542, 0, 1).open('GET', '/packages/sounds/q009/jumppad.ogg');
    new DataRequest(4203542, 4237229, 0, 1).open('GET', '/packages/sounds/q009/glauncher.ogg');
    new DataRequest(4237229, 4257672, 0, 1).open('GET', '/packages/sounds/q009/weapswitch.ogg');
    new DataRequest(4257672, 4287654, 0, 1).open('GET', '/packages/sounds/q009/explosion.ogg');
    new DataRequest(4287654, 4411874, 0, 1).open('GET', '/packages/sounds/q009/rifle2.ogg');
    new DataRequest(4411874, 4536954, 0, 1).open('GET', '/packages/sounds/q009/shotgun.ogg');
    new DataRequest(4536954, 4563210, 0, 1).open('GET', '/packages/sounds/q009/minigun3.ogg');
    new DataRequest(4563210, 4666276, 0, 1).open('GET', '/packages/sounds/q009/ren2.ogg');
    new DataRequest(4666276, 4795313, 0, 1).open('GET', '/packages/sounds/q009/rifle.ogg');
    new DataRequest(4795313, 4911752, 0, 1).open('GET', '/packages/sounds/q009/ren3.ogg');
    new DataRequest(4911752, 4969689, 0, 1).open('GET', '/packages/sounds/q009/rlauncher.ogg');
    new DataRequest(4969689, 5002311, 0, 1).open('GET', '/packages/sounds/q009/quaddamage_out.ogg');
    new DataRequest(5002311, 5020186, 0, 1).open('GET', '/packages/sounds/q009/outofammo.ogg');
    new DataRequest(5020186, 5146288, 0, 1).open('GET', '/packages/sounds/q009/shotgun2.ogg');
    new DataRequest(5146288, 5173188, 0, 1).open('GET', '/packages/sounds/q009/pistol3.ogg');
    new DataRequest(5173188, 5192628, 0, 0).open('GET', '/packages/sounds/q009/license.txt');
    new DataRequest(5192628, 5193944, 0, 0).open('GET', '/packages/sounds/q009/readme.txt');
    new DataRequest(5193944, 5221652, 0, 1).open('GET', '/packages/sounds/q009/quaddamage_shoot.ogg');
    new DataRequest(5221652, 5279297, 0, 1).open('GET', '/packages/sounds/q009/rlauncher3.ogg');
    new DataRequest(5279297, 5307679, 0, 1).open('GET', '/packages/sounds/q009/pistol2.ogg');
    new DataRequest(5307679, 5343121, 0, 1).open('GET', '/packages/sounds/q009/glauncher2.ogg');
    new DataRequest(5343121, 5376349, 0, 1).open('GET', '/packages/sounds/q009/glauncher3.ogg');
    new DataRequest(5376349, 5404743, 0, 1).open('GET', '/packages/sounds/q009/pistol.ogg');
    new DataRequest(5404743, 5424352, 0, 1).open('GET', '/packages/sounds/yo_frankie/amb_waterdrip_2.ogg');
    new DataRequest(5424352, 5424982, 0, 0).open('GET', '/packages/sounds/yo_frankie/readme.txt');
    new DataRequest(5424982, 5432395, 0, 1).open('GET', '/packages/sounds/yo_frankie/sfx_interact.ogg');
    new DataRequest(5432395, 5456300, 0, 1).open('GET', '/packages/sounds/yo_frankie/watersplash2.ogg');
    new DataRequest(5456300, 5513132, 1, 0).open('GET', '/packages/gk/lava/lava_cc.dds');
    new DataRequest(5513132, 5629221, 1, 0).open('GET', '/packages/gk/lava/lava_nm.dds');
    new DataRequest(5629221, 5653383, 0, 0).open('GET', '/packages/caustics/caust08.png');
    new DataRequest(5653383, 5677862, 0, 0).open('GET', '/packages/caustics/caust17.png');
    new DataRequest(5677862, 5703048, 0, 0).open('GET', '/packages/caustics/caust13.png');
    new DataRequest(5703048, 5726372, 0, 0).open('GET', '/packages/caustics/caust06.png');
    new DataRequest(5726372, 5749947, 0, 0).open('GET', '/packages/caustics/caust03.png');
    new DataRequest(5749947, 5772817, 0, 0).open('GET', '/packages/caustics/caust05.png');
    new DataRequest(5772817, 5796996, 0, 0).open('GET', '/packages/caustics/caust19.png');
    new DataRequest(5796996, 5820271, 0, 0).open('GET', '/packages/caustics/caust23.png');
    new DataRequest(5820271, 5843440, 0, 0).open('GET', '/packages/caustics/caust24.png');
    new DataRequest(5843440, 5866646, 0, 0).open('GET', '/packages/caustics/caust25.png');
    new DataRequest(5866646, 5890147, 0, 0).open('GET', '/packages/caustics/caust28.png');
    new DataRequest(5890147, 5913701, 0, 0).open('GET', '/packages/caustics/caust26.png');
    new DataRequest(5913701, 5938442, 0, 0).open('GET', '/packages/caustics/caust12.png');
    new DataRequest(5938442, 5961640, 0, 0).open('GET', '/packages/caustics/caust04.png');
    new DataRequest(5961640, 5985507, 0, 0).open('GET', '/packages/caustics/caust07.png');
    new DataRequest(5985507, 6010050, 0, 0).open('GET', '/packages/caustics/caust31.png');
    new DataRequest(6010050, 6034499, 0, 0).open('GET', '/packages/caustics/caust15.png');
    new DataRequest(6034499, 6059551, 0, 0).open('GET', '/packages/caustics/caust14.png');
    new DataRequest(6059551, 6083301, 0, 0).open('GET', '/packages/caustics/caust29.png');
    new DataRequest(6083301, 6107465, 0, 0).open('GET', '/packages/caustics/caust11.png');
    new DataRequest(6107465, 6131719, 0, 0).open('GET', '/packages/caustics/caust30.png');
    new DataRequest(6131719, 6156260, 0, 0).open('GET', '/packages/caustics/caust18.png');
    new DataRequest(6156260, 6156318, 0, 0).open('GET', '/packages/caustics/readme.txt');
    new DataRequest(6156318, 6180201, 0, 0).open('GET', '/packages/caustics/caust09.png');
    new DataRequest(6180201, 6204026, 0, 0).open('GET', '/packages/caustics/caust10.png');
    new DataRequest(6204026, 6227470, 0, 0).open('GET', '/packages/caustics/caust22.png');
    new DataRequest(6227470, 6251962, 0, 0).open('GET', '/packages/caustics/caust01.png');
    new DataRequest(6251962, 6276481, 0, 0).open('GET', '/packages/caustics/caust00.png');
    new DataRequest(6276481, 6300587, 0, 0).open('GET', '/packages/caustics/caust20.png');
    new DataRequest(6300587, 6324944, 0, 0).open('GET', '/packages/caustics/caust16.png');
    new DataRequest(6324944, 6348588, 0, 0).open('GET', '/packages/caustics/caust27.png');
    new DataRequest(6348588, 6372704, 0, 0).open('GET', '/packages/caustics/caust02.png');
    new DataRequest(6372704, 6396342, 0, 0).open('GET', '/packages/caustics/caust21.png');
    new DataRequest(6396342, 6411118, 0, 0).open('GET', '/packages/models/debris/tris.md2');
    new DataRequest(6411118, 6411361, 0, 0).open('GET', '/packages/models/debris/md2.cfg');
    new DataRequest(6411361, 6603187, 0, 0).open('GET', '/packages/models/debris/skin.png');
    new DataRequest(6603187, 6603325, 0, 0).open('GET', '/packages/models/projectiles/grenade/iqm.cfg');
    new DataRequest(6603325, 6603481, 0, 0).open('GET', '/packages/models/projectiles/rocket/iqm.cfg');
    new DataRequest(6603481, 6616718, 0, 0).open('GET', '/packages/models/projectiles/rocket/skin.jpg');
    new DataRequest(6616718, 6619854, 0, 0).open('GET', '/packages/models/projectiles/rocket/rocket.iqm');
    new DataRequest(6619854, 6627573, 0, 0).open('GET', '/packages/models/projectiles/rocket/normal.jpg');
    new DataRequest(6627573, 6628233, 0, 0).open('GET', '/packages/models/projectiles/rocket/readme.txt');
    new DataRequest(6628233, 6649001, 0, 0).open('GET', '/packages/models/projectiles/rocket/mask.jpg');
    new DataRequest(6649001, 6649138, 0, 0).open('GET', '/packages/brushes/gradient_128.png');
    new DataRequest(6649138, 6650134, 0, 0).open('GET', '/packages/brushes/circle_8_hard.png');
    new DataRequest(6650134, 6651372, 0, 0).open('GET', '/packages/brushes/circle_32_solid.png');
    new DataRequest(6651372, 6655704, 0, 0).open('GET', '/packages/brushes/circle_64_hard.png');
    new DataRequest(6655704, 6656911, 0, 0).open('GET', '/packages/brushes/square_64_hard.png');
    new DataRequest(6656911, 6657993, 0, 0).open('GET', '/packages/brushes/square_16_hard.png');
    new DataRequest(6657993, 6658966, 0, 0).open('GET', '/packages/brushes/square_16_solid.png');
    new DataRequest(6658966, 6659947, 0, 0).open('GET', '/packages/brushes/square_32_solid.png');
    new DataRequest(6659947, 6661232, 0, 0).open('GET', '/packages/brushes/circle_32_soft.png');
    new DataRequest(6661232, 6662227, 0, 0).open('GET', '/packages/brushes/circle_8_solid.png');
    new DataRequest(6662227, 6664041, 0, 0).open('GET', '/packages/brushes/circle_64_soft.png');
    new DataRequest(6664041, 6665154, 0, 0).open('GET', '/packages/brushes/circle_16_solid.png');
    new DataRequest(6665154, 6667518, 0, 0).open('GET', '/packages/brushes/circle_128_solid.png');
    new DataRequest(6667518, 6677153, 0, 0).open('GET', '/packages/brushes/noise_128.png');
    new DataRequest(6677153, 6678145, 0, 0).open('GET', '/packages/brushes/circle_8_soft.png');
    new DataRequest(6678145, 6679328, 0, 0).open('GET', '/packages/brushes/square_32_hard.png');
    new DataRequest(6679328, 6680450, 0, 0).open('GET', '/packages/brushes/circle_16_hard.png');
    new DataRequest(6680450, 6684010, 0, 0).open('GET', '/packages/brushes/circle_32_hard.png');
    new DataRequest(6684010, 6687487, 0, 0).open('GET', '/packages/brushes/circle_128_soft.png');
    new DataRequest(6687487, 6687616, 0, 0).open('GET', '/packages/brushes/gradient_64.png');
    new DataRequest(6687616, 6687736, 0, 0).open('GET', '/packages/brushes/gradient_32.png');
    new DataRequest(6687736, 6688742, 0, 0).open('GET', '/packages/brushes/square_64_solid.png');
    new DataRequest(6688742, 6689833, 0, 0).open('GET', '/packages/brushes/circle_16_soft.png');
    new DataRequest(6689833, 6693921, 0, 0).open('GET', '/packages/brushes/circle_128_hard.png');
    new DataRequest(6693921, 6693980, 0, 0).open('GET', '/packages/brushes/readme.txt');
    new DataRequest(6693980, 6696270, 0, 0).open('GET', '/packages/brushes/noise_64.png');
    new DataRequest(6696270, 6697854, 0, 0).open('GET', '/packages/brushes/circle_64_solid.png');
    new DataRequest(6697854, 6697957, 0, 0).open('GET', '/packages/brushes/gradient_16.png');
    new DataRequest(6697957, 6714392, 0, 0).open('GET', '/packages/hud/ff.png');
    new DataRequest(6714392, 6858136, 0, 0).open('GET', '/packages/hud/damage.png');
    new DataRequest(6858136, 6858207, 0, 0).open('GET', '/packages/hud/readme.txt');
    new DataRequest(6858207, 6963608, 0, 0).open('GET', '/packages/hud/items.png');

    function processPackageData(arrayBuffer) {
      Module.finishedDataFileDownloads++;
      assert(arrayBuffer, 'Loading data file failed.');
      var byteArray = new Uint8Array(arrayBuffer);
      var curr;
      
      // copy the entire loaded file into a spot in the heap. Files will refer to slices in that. They cannot be freed though.
      var ptr = Module['_malloc'](byteArray.length);
      Module['HEAPU8'].set(byteArray, ptr);
      DataRequest.prototype.byteArray = Module['HEAPU8'].subarray(ptr, ptr+byteArray.length);
          DataRequest.prototype.requests["/data/menus.cfg"].onload();
          DataRequest.prototype.requests["/data/guioverlay.png"].onload();
          DataRequest.prototype.requests["/data/background_decal.png"].onload();
          DataRequest.prototype.requests["/data/sounds.cfg"].onload();
          DataRequest.prototype.requests["/data/default_map_settings.cfg"].onload();
          DataRequest.prototype.requests["/data/hit.png"].onload();
          DataRequest.prototype.requests["/data/default_map_models.cfg"].onload();
          DataRequest.prototype.requests["/data/crosshair.png"].onload();
          DataRequest.prototype.requests["/data/teammate.png"].onload();
          DataRequest.prototype.requests["/data/background.png"].onload();
          DataRequest.prototype.requests["/data/stdshader.cfg"].onload();
          DataRequest.prototype.requests["/data/guiskin.png"].onload();
          DataRequest.prototype.requests["/data/logo.png"].onload();
          DataRequest.prototype.requests["/data/guislider.png"].onload();
          DataRequest.prototype.requests["/data/keymap.cfg"].onload();
          DataRequest.prototype.requests["/data/mapshot_frame.png"].onload();
          DataRequest.prototype.requests["/data/guicursor.png"].onload();
          DataRequest.prototype.requests["/data/loading_bar.png"].onload();
          DataRequest.prototype.requests["/data/glsl.cfg"].onload();
          DataRequest.prototype.requests["/data/loading_frame.png"].onload();
          DataRequest.prototype.requests["/data/stdlib.cfg"].onload();
          DataRequest.prototype.requests["/data/game_fps.cfg"].onload();
          DataRequest.prototype.requests["/data/background_detail.png"].onload();
          DataRequest.prototype.requests["/data/stdedit.cfg"].onload();
          DataRequest.prototype.requests["/data/font.cfg"].onload();
          DataRequest.prototype.requests["/data/brush.cfg"].onload();
          DataRequest.prototype.requests["/data/game_rpg.cfg"].onload();
          DataRequest.prototype.requests["/data/defaults.cfg"].onload();
          DataRequest.prototype.requests["/packages/textures/water.jpg"].onload();
          DataRequest.prototype.requests["/packages/textures/waterdudv.jpg"].onload();
          DataRequest.prototype.requests["/packages/textures/notexture.png"].onload();
          DataRequest.prototype.requests["/packages/textures/waterfalln.jpg"].onload();
          DataRequest.prototype.requests["/packages/textures/waterfall.jpg"].onload();
          DataRequest.prototype.requests["/packages/textures/readme.txt"].onload();
          DataRequest.prototype.requests["/packages/textures/waterfalldudv.jpg"].onload();
          DataRequest.prototype.requests["/packages/textures/watern.jpg"].onload();
          DataRequest.prototype.requests["/packages/fonts/font.png"].onload();
          DataRequest.prototype.requests["/packages/fonts/default.cfg"].onload();
          DataRequest.prototype.requests["/packages/fonts/font_readme.txt"].onload();
          DataRequest.prototype.requests["/packages/icons/info.jpg"].onload();
          DataRequest.prototype.requests["/packages/icons/arrow_fw.jpg"].onload();
          DataRequest.prototype.requests["/packages/icons/frankie.jpg"].onload();
          DataRequest.prototype.requests["/packages/icons/server.jpg"].onload();
          DataRequest.prototype.requests["/packages/icons/radio_on.jpg"].onload();
          DataRequest.prototype.requests["/packages/icons/checkbox_on.jpg"].onload();
          DataRequest.prototype.requests["/packages/icons/cube.jpg"].onload();
          DataRequest.prototype.requests["/packages/icons/exit.jpg"].onload();
          DataRequest.prototype.requests["/packages/icons/checkbox_off.jpg"].onload();
          DataRequest.prototype.requests["/packages/icons/chat.jpg"].onload();
          DataRequest.prototype.requests["/packages/icons/menu.png"].onload();
          DataRequest.prototype.requests["/packages/icons/readme.txt"].onload();
          DataRequest.prototype.requests["/packages/icons/snoutx10k.jpg"].onload();
          DataRequest.prototype.requests["/packages/icons/radio_off.jpg"].onload();
          DataRequest.prototype.requests["/packages/icons/arrow_bw.jpg"].onload();
          DataRequest.prototype.requests["/packages/icons/action.jpg"].onload();
          DataRequest.prototype.requests["/packages/icons/menu.jpg"].onload();
          DataRequest.prototype.requests["/packages/icons/hand.jpg"].onload();
          DataRequest.prototype.requests["/packages/particles/lightning.jpg"].onload();
          DataRequest.prototype.requests["/packages/particles/smoke.png"].onload();
          DataRequest.prototype.requests["/packages/particles/spark.png"].onload();
          DataRequest.prototype.requests["/packages/particles/ball2.png"].onload();
          DataRequest.prototype.requests["/packages/particles/circle.png"].onload();
          DataRequest.prototype.requests["/packages/particles/muzzleflash2.jpg"].onload();
          DataRequest.prototype.requests["/packages/particles/blood.png"].onload();
          DataRequest.prototype.requests["/packages/particles/steam.png"].onload();
          DataRequest.prototype.requests["/packages/particles/explosion.png"].onload();
          DataRequest.prototype.requests["/packages/particles/readme.txt"].onload();
          DataRequest.prototype.requests["/packages/particles/base.png"].onload();
          DataRequest.prototype.requests["/packages/particles/blob.png"].onload();
          DataRequest.prototype.requests["/packages/particles/bullet.png"].onload();
          DataRequest.prototype.requests["/packages/particles/muzzleflash1.jpg"].onload();
          DataRequest.prototype.requests["/packages/particles/flames.png"].onload();
          DataRequest.prototype.requests["/packages/particles/readme.txt~"].onload();
          DataRequest.prototype.requests["/packages/particles/flare.jpg"].onload();
          DataRequest.prototype.requests["/packages/particles/muzzleflash3.jpg"].onload();
          DataRequest.prototype.requests["/packages/particles/lensflares.png"].onload();
          DataRequest.prototype.requests["/packages/particles/scorch.png"].onload();
          DataRequest.prototype.requests["/packages/particles/ball1.png"].onload();
          DataRequest.prototype.requests["/packages/sounds/aard/pain1.wav"].onload();
          DataRequest.prototype.requests["/packages/sounds/aard/die1.wav"].onload();
          DataRequest.prototype.requests["/packages/sounds/aard/land.wav"].onload();
          DataRequest.prototype.requests["/packages/sounds/aard/grunt2.wav"].onload();
          DataRequest.prototype.requests["/packages/sounds/aard/tak.wav"].onload();
          DataRequest.prototype.requests["/packages/sounds/aard/weapload.wav"].onload();
          DataRequest.prototype.requests["/packages/sounds/aard/grunt1.wav"].onload();
          DataRequest.prototype.requests["/packages/sounds/aard/pain3.wav"].onload();
          DataRequest.prototype.requests["/packages/sounds/aard/pain2.wav"].onload();
          DataRequest.prototype.requests["/packages/sounds/aard/die2.wav"].onload();
          DataRequest.prototype.requests["/packages/sounds/aard/pain5.wav"].onload();
          DataRequest.prototype.requests["/packages/sounds/aard/pain4.wav"].onload();
          DataRequest.prototype.requests["/packages/sounds/aard/bang.wav"].onload();
          DataRequest.prototype.requests["/packages/sounds/aard/itempick.wav"].onload();
          DataRequest.prototype.requests["/packages/sounds/aard/pain6.wav"].onload();
          DataRequest.prototype.requests["/packages/sounds/aard/outofammo.wav"].onload();
          DataRequest.prototype.requests["/packages/sounds/aard/jump.wav"].onload();
          DataRequest.prototype.requests["/packages/sounds/q009/minigun.ogg"].onload();
          DataRequest.prototype.requests["/packages/sounds/q009/shotgun3.ogg"].onload();
          DataRequest.prototype.requests["/packages/sounds/q009/rlauncher2.ogg"].onload();
          DataRequest.prototype.requests["/packages/sounds/q009/rifle3.ogg"].onload();
          DataRequest.prototype.requests["/packages/sounds/q009/teleport.ogg"].onload();
          DataRequest.prototype.requests["/packages/sounds/q009/ren.ogg"].onload();
          DataRequest.prototype.requests["/packages/sounds/q009/minigun2.ogg"].onload();
          DataRequest.prototype.requests["/packages/sounds/q009/jumppad.ogg"].onload();
          DataRequest.prototype.requests["/packages/sounds/q009/glauncher.ogg"].onload();
          DataRequest.prototype.requests["/packages/sounds/q009/weapswitch.ogg"].onload();
          DataRequest.prototype.requests["/packages/sounds/q009/explosion.ogg"].onload();
          DataRequest.prototype.requests["/packages/sounds/q009/rifle2.ogg"].onload();
          DataRequest.prototype.requests["/packages/sounds/q009/shotgun.ogg"].onload();
          DataRequest.prototype.requests["/packages/sounds/q009/minigun3.ogg"].onload();
          DataRequest.prototype.requests["/packages/sounds/q009/ren2.ogg"].onload();
          DataRequest.prototype.requests["/packages/sounds/q009/rifle.ogg"].onload();
          DataRequest.prototype.requests["/packages/sounds/q009/ren3.ogg"].onload();
          DataRequest.prototype.requests["/packages/sounds/q009/rlauncher.ogg"].onload();
          DataRequest.prototype.requests["/packages/sounds/q009/quaddamage_out.ogg"].onload();
          DataRequest.prototype.requests["/packages/sounds/q009/outofammo.ogg"].onload();
          DataRequest.prototype.requests["/packages/sounds/q009/shotgun2.ogg"].onload();
          DataRequest.prototype.requests["/packages/sounds/q009/pistol3.ogg"].onload();
          DataRequest.prototype.requests["/packages/sounds/q009/license.txt"].onload();
          DataRequest.prototype.requests["/packages/sounds/q009/readme.txt"].onload();
          DataRequest.prototype.requests["/packages/sounds/q009/quaddamage_shoot.ogg"].onload();
          DataRequest.prototype.requests["/packages/sounds/q009/rlauncher3.ogg"].onload();
          DataRequest.prototype.requests["/packages/sounds/q009/pistol2.ogg"].onload();
          DataRequest.prototype.requests["/packages/sounds/q009/glauncher2.ogg"].onload();
          DataRequest.prototype.requests["/packages/sounds/q009/glauncher3.ogg"].onload();
          DataRequest.prototype.requests["/packages/sounds/q009/pistol.ogg"].onload();
          DataRequest.prototype.requests["/packages/sounds/yo_frankie/amb_waterdrip_2.ogg"].onload();
          DataRequest.prototype.requests["/packages/sounds/yo_frankie/readme.txt"].onload();
          DataRequest.prototype.requests["/packages/sounds/yo_frankie/sfx_interact.ogg"].onload();
          DataRequest.prototype.requests["/packages/sounds/yo_frankie/watersplash2.ogg"].onload();
          DataRequest.prototype.requests["/packages/gk/lava/lava_cc.dds"].onload();
          DataRequest.prototype.requests["/packages/gk/lava/lava_nm.dds"].onload();
          DataRequest.prototype.requests["/packages/caustics/caust08.png"].onload();
          DataRequest.prototype.requests["/packages/caustics/caust17.png"].onload();
          DataRequest.prototype.requests["/packages/caustics/caust13.png"].onload();
          DataRequest.prototype.requests["/packages/caustics/caust06.png"].onload();
          DataRequest.prototype.requests["/packages/caustics/caust03.png"].onload();
          DataRequest.prototype.requests["/packages/caustics/caust05.png"].onload();
          DataRequest.prototype.requests["/packages/caustics/caust19.png"].onload();
          DataRequest.prototype.requests["/packages/caustics/caust23.png"].onload();
          DataRequest.prototype.requests["/packages/caustics/caust24.png"].onload();
          DataRequest.prototype.requests["/packages/caustics/caust25.png"].onload();
          DataRequest.prototype.requests["/packages/caustics/caust28.png"].onload();
          DataRequest.prototype.requests["/packages/caustics/caust26.png"].onload();
          DataRequest.prototype.requests["/packages/caustics/caust12.png"].onload();
          DataRequest.prototype.requests["/packages/caustics/caust04.png"].onload();
          DataRequest.prototype.requests["/packages/caustics/caust07.png"].onload();
          DataRequest.prototype.requests["/packages/caustics/caust31.png"].onload();
          DataRequest.prototype.requests["/packages/caustics/caust15.png"].onload();
          DataRequest.prototype.requests["/packages/caustics/caust14.png"].onload();
          DataRequest.prototype.requests["/packages/caustics/caust29.png"].onload();
          DataRequest.prototype.requests["/packages/caustics/caust11.png"].onload();
          DataRequest.prototype.requests["/packages/caustics/caust30.png"].onload();
          DataRequest.prototype.requests["/packages/caustics/caust18.png"].onload();
          DataRequest.prototype.requests["/packages/caustics/readme.txt"].onload();
          DataRequest.prototype.requests["/packages/caustics/caust09.png"].onload();
          DataRequest.prototype.requests["/packages/caustics/caust10.png"].onload();
          DataRequest.prototype.requests["/packages/caustics/caust22.png"].onload();
          DataRequest.prototype.requests["/packages/caustics/caust01.png"].onload();
          DataRequest.prototype.requests["/packages/caustics/caust00.png"].onload();
          DataRequest.prototype.requests["/packages/caustics/caust20.png"].onload();
          DataRequest.prototype.requests["/packages/caustics/caust16.png"].onload();
          DataRequest.prototype.requests["/packages/caustics/caust27.png"].onload();
          DataRequest.prototype.requests["/packages/caustics/caust02.png"].onload();
          DataRequest.prototype.requests["/packages/caustics/caust21.png"].onload();
          DataRequest.prototype.requests["/packages/models/debris/tris.md2"].onload();
          DataRequest.prototype.requests["/packages/models/debris/md2.cfg"].onload();
          DataRequest.prototype.requests["/packages/models/debris/skin.png"].onload();
          DataRequest.prototype.requests["/packages/models/projectiles/grenade/iqm.cfg"].onload();
          DataRequest.prototype.requests["/packages/models/projectiles/rocket/iqm.cfg"].onload();
          DataRequest.prototype.requests["/packages/models/projectiles/rocket/skin.jpg"].onload();
          DataRequest.prototype.requests["/packages/models/projectiles/rocket/rocket.iqm"].onload();
          DataRequest.prototype.requests["/packages/models/projectiles/rocket/normal.jpg"].onload();
          DataRequest.prototype.requests["/packages/models/projectiles/rocket/readme.txt"].onload();
          DataRequest.prototype.requests["/packages/models/projectiles/rocket/mask.jpg"].onload();
          DataRequest.prototype.requests["/packages/brushes/gradient_128.png"].onload();
          DataRequest.prototype.requests["/packages/brushes/circle_8_hard.png"].onload();
          DataRequest.prototype.requests["/packages/brushes/circle_32_solid.png"].onload();
          DataRequest.prototype.requests["/packages/brushes/circle_64_hard.png"].onload();
          DataRequest.prototype.requests["/packages/brushes/square_64_hard.png"].onload();
          DataRequest.prototype.requests["/packages/brushes/square_16_hard.png"].onload();
          DataRequest.prototype.requests["/packages/brushes/square_16_solid.png"].onload();
          DataRequest.prototype.requests["/packages/brushes/square_32_solid.png"].onload();
          DataRequest.prototype.requests["/packages/brushes/circle_32_soft.png"].onload();
          DataRequest.prototype.requests["/packages/brushes/circle_8_solid.png"].onload();
          DataRequest.prototype.requests["/packages/brushes/circle_64_soft.png"].onload();
          DataRequest.prototype.requests["/packages/brushes/circle_16_solid.png"].onload();
          DataRequest.prototype.requests["/packages/brushes/circle_128_solid.png"].onload();
          DataRequest.prototype.requests["/packages/brushes/noise_128.png"].onload();
          DataRequest.prototype.requests["/packages/brushes/circle_8_soft.png"].onload();
          DataRequest.prototype.requests["/packages/brushes/square_32_hard.png"].onload();
          DataRequest.prototype.requests["/packages/brushes/circle_16_hard.png"].onload();
          DataRequest.prototype.requests["/packages/brushes/circle_32_hard.png"].onload();
          DataRequest.prototype.requests["/packages/brushes/circle_128_soft.png"].onload();
          DataRequest.prototype.requests["/packages/brushes/gradient_64.png"].onload();
          DataRequest.prototype.requests["/packages/brushes/gradient_32.png"].onload();
          DataRequest.prototype.requests["/packages/brushes/square_64_solid.png"].onload();
          DataRequest.prototype.requests["/packages/brushes/circle_16_soft.png"].onload();
          DataRequest.prototype.requests["/packages/brushes/circle_128_hard.png"].onload();
          DataRequest.prototype.requests["/packages/brushes/readme.txt"].onload();
          DataRequest.prototype.requests["/packages/brushes/noise_64.png"].onload();
          DataRequest.prototype.requests["/packages/brushes/circle_64_solid.png"].onload();
          DataRequest.prototype.requests["/packages/brushes/gradient_16.png"].onload();
          DataRequest.prototype.requests["/packages/hud/ff.png"].onload();
          DataRequest.prototype.requests["/packages/hud/damage.png"].onload();
          DataRequest.prototype.requests["/packages/hud/readme.txt"].onload();
          DataRequest.prototype.requests["/packages/hud/items.png"].onload();
          Module['removeRunDependency']('datafile_base.data');

    };
    Module['addRunDependency']('datafile_base.data');
  
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

