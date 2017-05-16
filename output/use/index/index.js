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

define('use/index/index', function(require, exports, module) {

  // var a = require('jsModule/module1/module1');
  'use strict';
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
  
  var _jsModuleModule1Module1 = require('public/static/js/module1/module1');
  
  var _jsModuleModule1Module12 = _interopRequireDefault(_jsModuleModule1Module1);
  
  // console.log(a)
  (0, _jsModuleModule1Module12['default'])('holle module1');
  // console.log('holle fis3');
  
  require('public/static/js/exxxo');
  
  // console.log(require('jquery'));
  // console.log($);
  $('div').after('<span>1231231231232</span>');
  
  $.post('/post', function (req) {
      console.log(req);
  });
  
  // function timeout1(timeout) {
  //     return new Promise(function(res, rej) {
  //         console.log(Date.now() + " start timeout1");
  //         setTimeout(function() {
  //             res('timeout1');
  //         }, 2000);
  //     });
  // }
  
  // function timeout2(timeout) {
  //     return new Promise(function(res, rej) {
  //         console.log(Date.now() + " start timeout2");
  //         setTimeout(function() {
  //             res('timeout2');
  //         }, 6000);
  //     });
  // }
  
  // console.log(1);
  // async function f() {
  //     var t1 = await timeout1('timeout1');
  //     console.log('t1 ok' + t1);
  //     var t2 = await timeout2('timeout2');
  //     console.log('t2 ok');
  //     return t2;
  // }
  // console.log(2);
  
  // f().then(function(x) {
  //     console.log(x);
  // });

});

