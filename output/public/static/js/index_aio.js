define('public/static/common/js/module1/module1', function(require, exports, module) {

  module.exports = function(a) {
      console.log(a);
  }

});

define('public/static/common/js/exxxo', function(require, exports, module) {

  console.log('qwertyuiop');

});

var a = require('public/static/common/js/module1/module1');
console.log(a)
a('holle module1');
console.log('holle fis3');

require('public/static/common/js/exxxo');

// console.log(require('jquery'));
console.log($);
$('div').after('<span>1231231231232</span>');

// require('express')
