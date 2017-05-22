// var a = require('jsModule/module1/module1');
import a from 'jsModule/module1/module1';
// console.log(a)
a('holle module1');
// console.log('holle fis3');

require('./background.less');

require('jsModule/exxxo.js');

$('div').after('<span>1231231231232</span>');

$.post('/post', function(req) {
    console.log(req);
});
let template = require('baiduTemplate/demo123/baidu');

$('#dengshiwei').html(template);

let x = (y) => {
    console.log(y);
}

x(2222222222222225555555555);