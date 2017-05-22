const path = require('path');
const express = require('express');
const app = express();
const logger = require('morgan');
const nunjucksConfig = require('./config/nunjucks/index.js');
const expressConfig = require('./config/express/index.js');
const routes = require('./controller/routes/routes.js');

app.use(logger('dev'));

nunjucksConfig.init(app, {
    dir: path.join(__dirname, './output')
});

expressConfig.init(app);

routes.init(app); //设置routes

app.use(express.static('./output')); //静态文件

module.exports = app;