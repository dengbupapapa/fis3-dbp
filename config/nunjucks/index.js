const nunjucks = require('nunjucks');
const glob = require('glob');
const path = require('path');

module.exports.init = (app, opts) => {

    const env = nunjucks.configure(opts.dir, { // 设置模板文件的目录，为views
        autoescape: true,
        express: app
    });

    app.set('view engine', 'html');

    let dirname = __dirname.match(/.*\/(.*)/)[1];
    let reg = new RegExp(dirname + '\/(.*)');

    glob(path.join(__dirname, '@(**|!index.js)/**'), { //添加extentsTag@(**|!index.js)
        nodir: true
    }, function(err, files) {

        if (err) {
            console.errer('routes config glob errer!!!');
            return false
        }

        files.forEach((item, i) => {

            let urlBase = item.match(reg)[1];
            let dirChildren = urlBase.match(/(.+?)\//)[1];
            let Module = require('./' + urlBase);

            if (dirChildren == 'lib') {

                new Module(env);

            } else if (dirChildren == 'extentsTag') {

                let nameBase = urlBase.match(/extentsTag\/(.*)\.js/)[1];;

                if (Module && nameBase) env.addExtension(nameBase + 'Extension', new Module(nunjucks));

            }
            //

        });

    });

}