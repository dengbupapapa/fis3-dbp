const fs = require('fs');
const path = require("path");

/**
 * 判断有无文件
 * @param {String} dirname 页面文件路径
 * @param {String} resolve 文件相对路径
 * @param {String} filename 文件名称
 * @return {String} 目标文件绝对路径
 */
exports.fileExists = (dirname, resolve, filename) => {
    console.log(path.resolve(dirname, resolve, filename));
    return fs.existsSync(path.resolve(dirname, resolve, filename))
};