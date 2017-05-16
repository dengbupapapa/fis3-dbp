define('public/widget/nunjucks/demo1/Rely_on', function(require, exports, module) {

  'use strict';
  
  exports.aaa = function () {
      console.log('aaaa');
  };

});

define('public/static/js/exxxo', function(require, exports, module) {

  'use strict';
  
  console.log('qwertyuiop');

});

define('public/widget/nunjucks/demo1/demo1', function(require, exports, module) {

  'use strict';
  
  var x = require('public/widget/nunjucks/demo1/Rely_on');
  require('public/static/js/exxxo');
  x.aaa();
  console.log('demo1');

});

