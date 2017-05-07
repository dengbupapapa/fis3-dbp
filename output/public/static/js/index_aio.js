define('public/static/common/js/module1/module1', function(require, exports, module) {

  module.exports = function(a) {
      console.log(a);
  }

});

define('public/static/index/index', function(require, exports, module) {

  var a = require('public/static/common/js/module1/module1');
  console.log(a)
  a('holle module1');
  console.log('holle fis3');
  
  // console.log(require('jquery'));
  console.log($);
  $('div').after('<span>1231231231232</span>');
  
  // require('express')

});

