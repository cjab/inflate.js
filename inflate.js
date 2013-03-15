/** @license
 * RequireJS plugin for loading deflated JSON files
 * - Inspired by Miller Medeiros's JSON plugin (https://github.com/millermedeiros/requirejs-plugins)
 * Author: Chad Jablonski
 * Version: 0.0.1 (2013/03/14)
 * Released under the MIT license
 */
define(['text'], function(text) {

  var buildMap  = {},
      keyMaps   = {};

  var jsonParse = (typeof JSON !== 'undefined' && typeof JSON.parse === 'function')? JSON.parse : function(val){
    return eval('('+ val +')'); //quick and dirty
  };

  if(!Array.isArray) {
    Array.isArray = function (vArg) {
      return Object.prototype.toString.call(vArg) === "[object Array]";
    };
  }



  var inflate = {


    load : function(name, req, onLoad, config) {
      text.get(req.toUrl(name + ".deflated"), function(data){
        text.get(req.toUrl(name + ".map"), function(keyMapData) {

          if (config.isBuild) {

            buildMap[name] = data;
            keyMaps[name]  = keyMapData;
            onLoad(data);

          } else {

            var json   = jsonParse(data),
                keyMap = jsonParse(keyMapData);

            onLoad(inflate.inflate(json, keyMap));
          }
        });
      },

      onLoad.error, {
        accept: 'application/json'
      });
    },



    //write method based on RequireJS official text plugin by James Burke
    //https://github.com/jrburke/requirejs/blob/master/text.js
    write : function(pluginName, moduleName, write){
      if(moduleName in buildMap){

        var data       = buildMap[moduleName],
            keyMapData = keyMaps[moduleName];

        write('define("'+ pluginName + '!' + moduleName + '", ["inflate"],' +
              'function(inflate){ ' +
                'return inflate.inflate(' + data + ', ' + keyMapData + ');' +
              '});\n');
      }
    },



    inflate: function(data, keyMap) {
      if (Array.isArray(data)) {
        return inflate.inflateArray(data, keyMap);
      } else {
        return inflate.inflateObject(data, keyMap);
      }
    },



    inflateArray: function(data, keyMap) {
      var inflated = [];

      for (var i = 0; i < data.length; i++) {
        inflated.push(inflate.inflate(data[i], keyMap));
      }

      return inflated;
    },



    inflateObject: function(data, keyMap) {
      var inflated = {};

      for (var key in data) {
        if (data.hasOwnProperty(key)) {
          var value = data[key];

          if (typeof value === "object") {
            value = inflate.inflate(value, keyMap);
          }

          inflated[keyMap[key]] = value;
        }
      }

      return inflated;
    }
  };

  return inflate;
});
