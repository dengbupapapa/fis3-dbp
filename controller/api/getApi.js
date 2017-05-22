const fs = require('fs');
const request = require('request');
const CodeGen = require('swagger-js-codegen').CodeGen;
const config = require('./config');
const APIS = config.apis;

function writeFilePromise(file, data, options) { //写入文件fun

    return new Promise(function(resolve, reject) {

        fs.writeFile(file, data, options, function(err) {

            if (err) {
                reject(err);
            } else {
                resolve('saved.');
            }

        });

    });

}

function requestPromise(options) { //请求接口json源码

    return new Promise(function(resolve, reject) {

        request(options, function(error, response, body) {

            if (!error && response.statusCode == 200) {
                resolve(body);
            } else {
                reject(error);
            }

        });

    });

}

function normalizeName(title) { //解析成node接口调用名字

    return title.replace(/(\.|\-|\{|\}|\s+)(.)/g, (a, b, c) => c.toUpperCase());

}

function returnPromiseAllDataArray(APIS) { //生成Promise集合

    return APIS.map((item, i) => requestPromise(item));

}

function writeApisPromise(datas) { //生成api文件

    return datas.map((item, i) => {

        let data = JSON.parse(item);
        let className = normalizeName(data.info.title);

        return writeFilePromise(config.dir + className + '.js', CodeGen.getNodeCode({
            className: className,
            swagger: data
        }), 'utf8');

    })

}

Promise.all(returnPromiseAllDataArray(APIS)) //入口
    .then(writeApisPromise)
    .then((datas) => {
        console.log("api生成成功！");
    })
    .catch(function(err) {
        console.log(err);
    });