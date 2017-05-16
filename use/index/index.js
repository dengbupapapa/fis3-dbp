var a = require('jsModule/module1/module1');
// console.log(a)
a('holle module1');
// console.log('holle fis3');

require('jsModule/exxxo.js');

// console.log(require('jquery'));
// console.log($);
$('div').after('<span>1231231231232</span>');

$.post('/post', function(req) {
    console.log(req);
})