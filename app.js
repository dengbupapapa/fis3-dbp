const express = require('express');
const app = express();
const ejs = require('ejs');

app.use(express.static('./output')); //静态文件

app.set('views', './output/use'); // 指定视图所在的位置
app.engine('html', ejs.__express); //映射到html文件上
app.set('view engine', 'html'); //设置视图引擎

const index = require('./controller/routes/use/index.js');

app.use(index);

module.exports = app;