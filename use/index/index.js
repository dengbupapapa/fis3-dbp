// var a = require('jsModule/module1/module1');
import a from 'jsModule/module1/module1';
// console.log(a)
a('holle module1');
// console.log('holle fis3');

require('jsModule/exxxo.js');

// console.log(require('jquery'));
// console.log($);
$('div').after('<span>1231231231232</span>');

$.post('/post', function(req) {
    console.log(req);
});

// function timeout1(timeout) {
//     return new Promise(function(res, rej) {
//         console.log(Date.now() + " start timeout1");
//         setTimeout(function() {
//             res('timeout1');
//         }, 2000);
//     });
// }

// function timeout2(timeout) {
//     return new Promise(function(res, rej) {
//         console.log(Date.now() + " start timeout2");
//         setTimeout(function() {
//             res('timeout2');
//         }, 6000);
//     });
// }

// console.log(1);
// async function f() {
//     var t1 = await timeout1('timeout1');
//     console.log('t1 ok' + t1);
//     var t2 = await timeout2('timeout2');
//     console.log('t2 ok');
//     return t2;
// }
// console.log(2);

// f().then(function(x) {
//     console.log(x);
// });