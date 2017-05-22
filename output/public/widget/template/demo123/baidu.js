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
