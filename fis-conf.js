fis.set('project.ignore', [
    'node_modules/**',
    'output/**',
    '.git/**',
    'config/**',
    'fis-conf.js',
    'gulpfile.js',
    'package.json',
    '.jshintrc',
    'controller/**',
    'app.js',
    'server.js'
]);

fis.match('*', {
    deploy: [
        fis.plugin('skip-packed', {
            // ignore: ['/public/lib/**']
        }), fis.plugin('local-deliver', {
            to: 'output'
        })
    ]
});

fis.hook('relative');

fis.match('*.less', {
    parser: fis.plugin('less'), //启用fis-parser-less插件
    rExt: '.css'
});

fis.match('*.{jsx,js}', {
    parser: fis.plugin('babel-5.x')
})

fis.match('::package', {
    packager: fis.plugin('deps-pack', {
        useSourceMap: true,
        '/public/static/js/common_aio.js': [
            '/public/lib/base/mod/mod.js',
            '/public/lib/base/jquery/jquery.js',
        ],
        '/public/static/css/common_aio.css': [
            '/public/static/less/*.{css,less}'
        ]
    })
});

fis.match('::package', {
    postpackager: fis.plugin('loader', {
        allInOne: {
            js: function(file, a, b, c) {
                // console.log(file);
                return file.subpathNoExt + ".js";
            },
            // css: function(file) {
            //     console.log(file);
            //     return '/public/static/css/' + file.filename.split('.')[0] + "_aio.css";
            // },
            // sourceMap: false,
            // useTrack: false
        },
        resourceType: 'mod',
        // useSourceMap: false,
        // obtainScript: false,
        // obtainStyle: false,
        // useInlineMap: false,
        // resoucemap: false
    })
});

fis.hook('commonjs', {
    extList: ['.js'],
    baseUrl: '/',
    packages: [{
        name: 'jsModule',
        location: '/public/static/js',
    }, {
        name: 'cssModule',
        location: '/public/static/css',
    }]
});

fis.unhook('components');
fis.hook('node_modules', {
    shimProcess: true,
    mergeLevel: 3
});

fis.match('/{node_modules,public,use}/**.js', {
    isMod: true,
});

fis.match('/public/lib/base/**/*.js', {
    isMod: false,
});

fis.match('/use/**/*.{js,html}', {
    // umd2commonjs: true,
    useSameNameRequire: true
});

fis.match('/public/widget/**/*.{js,html}', {
    // umd2commonjs: true,
    useSameNameRequire: true
});

fis.media('prod')
    .match('*.js', {
        optimizer: fis.plugin('uglify-js', {
            mangle: {
                expect: ['require', 'define'] //不想被压的
            }
        })
    })
    .match('*.{css,less}', {
        optimizer: fis.plugin('clean-css')
    })
    .match('*.{css,less}', {
        preprocessor: fis.plugin('autoprefixer', {
            "browsers": ["Android >= 2.1", "iOS >= 4", "ie >= 8", "firefox >= 15"],
            "cascade": true
        })
    })
    // .match('::package', {
    //     spriter: fis.plugin('csssprites')
    // })
    // .match('*.css', {
    //     useSprite: true
    // })
    .match('*.{png,jpg}', {
        useHash: true
    })
    // .match('*.{tpl,html}', {
    //     optimizer: fis.plugin('html-compress')
    // })