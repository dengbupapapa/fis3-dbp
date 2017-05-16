const RenderShallot = require('./division/renderShallot.js');

module.exports.init = function(app) {

    app.use((req, res, next) => {

        const render = res.render;

        res.render = function(view, opts, callback) {

            let renderShallot = new RenderShallot();

            res.locals = {
                __renderShallot: renderShallot,
                __useDirname: view
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