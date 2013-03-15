/** @license
 * RequireJS plugin for loading deflated JSON files
 * - Inspired by Miller Medeiros's JSON plugin (https://github.com/millermedeiros/requirejs-plugins)
 * Author: Chad Jablonski
 * Version: 0.0.1 (2013/03/14)
 * Released under the MIT license
 */
define(['text'], function(text) {

  var buildMap  = {},
      keyMaps   = {},
      jsonParse = (typeof JSON !== 'undefined' && typeof JSON.parse === 'function')? JSON.parse : function(val){
                    return eval('('+ val +')'); //quick and dirty
  };



  function buildWrapper(data, keyMapData) {
    var out =  "(function() {"
        out += "  var keyMap = " + keyMapData + ", data = " + data + ", out = {};";
        out += "  for (var key in data) {";
        out += "    if (data.hasOwnProperty(key)) {";
        out += "      out[keyMap[key]] = data[key];";
        out += "    }";
        out += "  }";
        out += "  return out;"
        out += "})()";

    return out;
  }


  return {


    load : function(name, req, onLoad, config) {
      text.get(req.toUrl(name + ".deflated"), function(data){
        text.get(req.toUrl(name + ".map"), function(keyMapData) {

          if (config.isBuild) {

            buildMap[name] = data;
            keyMaps[name]  = keyMapData;
            onLoad(data);

          } else {

            var json   = jsonParse(data),
                keyMap = jsonParse(keyMapData),
                out    = {};

            for (var key in json) {
              if (json.hasOwnProperty(key)) {
                out[keyMap[key]] = json[key];
              }
            }

            onLoad(out);
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

        write('define("'+ pluginName +'!'+ moduleName +
              '", function(){ return '+
              buildWrapper(data, keyMapData) +
              ';});\n');
      }
    }
  };
});
