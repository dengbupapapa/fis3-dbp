define('public/lib/mod/test/pkg/all', function(require, exports, module) {

  define('pkg_part1', function(require, exports, module){
  //------------------------------------------------------------
  
  exports.sayHello = function() {
      return 'hello';
  };
  
  //------------------------------------------------------------
  });
  
  
  define('pkg_part2', function(require, exports, module){
  //------------------------------------------------------------
  
  exports.sayHello = function() {
      return 'hello2';
  };
  
  //------------------------------------------------------------
  });
  

});
