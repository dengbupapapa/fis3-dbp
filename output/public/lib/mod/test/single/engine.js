define('public/lib/mod/test/single/engine', function(require, exports, module) {

  define('single/engine.js',function(require, exports, module){
  //------------------------------------------------------------
  
  var car = require('single/car.js');
  
  exports.start = function(speed) {
      return speed;
  };
  
  
  //------------------------------------------------------------
  });
  

});
