const fs = require('fs');
const RenderShallot = require('./division/renderShallot.js');
const libCommon = require('./lib/common.js');
const versions = require('../../arguments.config.js').versions;

module.exports.init = function(app) {
    // console.log(app.locals);
    app.use((req, res, next) => {

        const render = res.render;

        res.render = function(view, opts, callback) {

            let renderShallot = new RenderShallot(versions);

            res.locals = {
                __renderShallot: renderShallot,
                __useDirname: view,
                __libCommon: libCommon,
                __versions: versions
            };

            render.call(this, view, opts, (err, html) => {

                if (!err) {
                    html = res.locals.__renderShallot.renderChef(html);
                }

                if (callback) {
                    callback(err, html);
                } else {
                    res.send(html);
                }

            })

        }

        next();

    });

}