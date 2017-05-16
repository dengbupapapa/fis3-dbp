define('public/static/js/module1/module1', function(require, exports, module) {

  "use strict";
  
  Object.defineProperty(exports, "__esModule", {
      value: true
  });
  
  exports["default"] = function (a) {
      console.log(a);
  };
  
  module.exports = exports["default"];

});

define('public/static/js/exxxo', function(require, exports, module) {

  'use strict';
  
  console.log('qwertyuiop');

});

define('use/demo2/demo2', function(require, exports, module) {

  'use strict';
  
  console.log('demo2');
  var a = require('public/static/js/module1/module1');
  // console.log(a)
  a('holle module1');
  // console.log('holle fis3');
  
  require('public/static/js/exxxo');

});

