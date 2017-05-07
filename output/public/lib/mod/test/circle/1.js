define('public/lib/mod/test/circle/1', function(require, exports, module) {

  define('circle/1.js', ['circle/2.js'], function(require, exports, module){
  //------------------------------------------------------------
  
  exports.test = function() {
      return c2.test();
  };
  
  var c2 = require('circle/2.js');
  
  
  //------------------------------------------------------------
  });
  

});
