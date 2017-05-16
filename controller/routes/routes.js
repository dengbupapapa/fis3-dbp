const glob = require('glob');
const path = require('path');

module.exports.init = function(app) {

    let dirname = __dirname.match(/.*\/(.*)/)[1];
    let reg = new RegExp(dirname + '\/(.*)');

    glob(path.join(__dirname, '@(**|!routes.js)/**'), {
        nodir: true
    }, function(err, files) {

        if (err) {
            console.errer('routes config glob errer!!!');
            return false
        }

        files.forEach((item, i) => {

            let routerMini = require('./' + item.match(reg)[1]);

            if (typeof routerMini.route === 'function') {
                app.use(routerMini);
            }

        });

    });

}