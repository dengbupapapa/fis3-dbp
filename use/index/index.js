// var a = require('jsModule/module1/module1');
import a from 'jsModule/module1/module1';
// console.log(a)
a('holle module1');
// console.log('holle fis3');

require('jsModule/exxxo.js');

$('div').after('<span>1231231231232</span>');

$.post('/post', function(req) {
    console.log(req);
});
let template = require('widgetModule/template/demo123/baidu');

$('#dengshiwei').html(template);