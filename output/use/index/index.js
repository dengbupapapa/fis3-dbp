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
  
  '';
  
  require('public/static/js/exxxo');
  
  $('div').after('<span>1231231231232</span>');
  
  $.post('/post', function (req) {
      console.log(req);
  });
  // let template = require('baiduTemplate/demo123/baidu');
  
  $('#dengshiwei').html('template').click(function () {
      console.log(123);
      var template23 = require.async(['public/widget/template/demo123/baidu']);
  });
  
  var x = function x(y) {
      console.log(y);
  };
  
  x(2222222222222225555555555);

});

