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

define('public/widget/template/demo123/baidu.tmpl', function(require, exports, module) {

  exports.template = [function(_template_object
  /**/) {
  var _template_fun_array=[];
  var fn=(function(__data__){
  var _template_varName='';
  for(var name in __data__){
  _template_varName+=('var '+name+'=__data__["'+name+'"];');
  };
  eval(_template_varName);
  _template_fun_array.push('<div class="baidu">    ',typeof(skuStatus) === 'undefined'?'':baidu.template._encodeHTML(skuStatus),'    <span>',typeof(skuStatus) === 'undefined'?'':baidu.template._encodeHTML(skuStatus),'</span></div>');
  _template_varName=null;
  })(_template_object);
  fn = null;
  return _template_fun_array.join('');
  
  }][0]

});

define('public/widget/template/demo123/baidu', function(require, exports, module) {

  'use strict';
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
  
  var _baiduTmpl = require('public/widget/template/demo123/baidu.tmpl');
  
  var _baiduTmpl2 = _interopRequireDefault(_baiduTmpl);
  
  var skuStatus = _baiduTmpl2['default'].template({
      skuStatus: '百度tmpl_skuStatus'
  });
  
  module.exports = skuStatus;

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
  
  $('div').after('<span>1231231231232</span>');
  
  $.post('/post', function (req) {
      console.log(req);
  });
  var template = require('public/widget/template/demo123/baidu');
  
  $('#dengshiwei').html(template);

});

