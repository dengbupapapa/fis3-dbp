class ExtendsSameName {

    constructor(nunjucks) {
        this.tags = ['extendsSameName'];
        this.nunjucks = nunjucks;
    }

    parse(parser, nodes, lexer) {

        let token = parser.nextToken();
        let args = parser.parseSignature(null, true);

        parser.advanceAfterBlockEnd(token.value);

        return this.afterParse(parser, nodes, lexer, args);

    }

    afterParse(parser, nodes, lexer, args) {

        let argsMap = this.parseArgsNodeList(args);
        let node = new nodes.Extends(0, 0);
        let body = new nodes.NodeList();

        node.template = new nodes.Literal(0, 0, argsMap.dirname);
        body.addChild(node);

        return new nodes.CallExtension(this, 'run', args, [body]);

    }

    parseArgsNodeList(args) {

        if (!args || !args.children) {
            return new Object();
        }

        let res = new Object();

        res.dirname = args.children[0].value;

        return res;

    };

    run() {

        let args = Array.prototype.slice.call(arguments);
        let context = args.shift();
        let body = args.pop();
        let html = this.render(context, args, body);

        this.safe = context.env.filters.safe;

        return this.safe(html);

    }

    render(context, attrs, body) {
        // console.log(attrs);

        let useDirname = context.ctx['__useDirname'];

        try {

            let renderShallo = context.ctx['__renderShallot'];

            if (!renderShallo._script.includes(useDirname)) {
                renderShallo.addScript(useDirname);
            }

            if (!renderShallo._css.includes(useDirname)) {
                renderShallo.addCss(useDirname);
            }

        } catch (e) {
            console.errer('add shallot array here errer');
        }

        /*
         * todo
         * https://github.com/mozilla/nunjucks/issues/497
         * 如果外层定义了相同变量，会使用外层变量，所以开发时尽量避免在标签中定义变量
         * */
        let obj = attrs[0];
        let dirname;

        if (typeof obj === 'string') {
            dirname = obj;
        } else if (obj && obj['dirname']) {
            dirname = obj['dirname'];
        }
        // console.log(context.ctx);
        dirname = dirname.replace(/\.html$/, '');

        let oldVar = new Object();

        for (var k in obj) {
            oldVar[k] = context.ctx[k];
            context.setVariable(k, obj[k]);
        }

        let html = body();

        //还原变量
        for (var k in obj) {
            context.setVariable(k, oldVar[k]);
        }

        return html;

    }
}

module.exports = ExtendsSameName