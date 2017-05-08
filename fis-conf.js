fis.set('project.ignore', [
    'node_modules/**',
    'output/**',
    '.git/**',
    'fis-conf.js',
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

fis.match('::package', {
    packager: fis.plugin('deps-pack', {
        useSourceMap: true,
        '/public/static/js/common_aio.js': [
            '/public/lib/base/mod/mod.js',
            '/public/lib/base/jquery/jquery.js',
        ],
        '/public/static/css/common_aio.css': [
            '/public/static/common/less/*.{css,less}'
        ]
    })
});

fis.match('::package', {
    postpackager: fis.plugin('loader', {
        allInOne: {
            js: function(file) {
                return '/public/static/js/' + file.filename.split('.')[0] + "_aio.js";
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
        location: '/public/static/common/js',
    }, {
        name: 'cssModule',
        location: '/public/static/common/css',
    }]
});

fis.unhook('components');
fis.hook('node_modules', {
    shimProcess: true,
    mergeLevel: 3
});

fis.match('/{node_modules,public}/**.js', {
    isMod: true,
});

fis.match('/public/lib/base/**/*.js', {
    isMod: false,
});

fis.match('/use/**/*.{js,html}', {
    // isMod: true,
    useSameNameRequire: true
});