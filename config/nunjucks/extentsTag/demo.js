module.exports = function(nunjucks) {

    this.tags = ['remote'];
    this.end = false;
    this.noRun = true;

    this.parse = function(parser, nodes, lexer) {
        // get the tag token
        let token = parser.nextToken();

        let args;
        if (this.useCustomParser) {
            args = parseAttributes(parser, nodes, lexer);
        } else {
            // parse the args and move after the block end. passing true as the second arg is required if there are no parentheses
            args = parser.parseSignature(null, true);
        }
        parser.advanceAfterBlockEnd(token.value);

        let body;
        if (this.end) {
            // parse the body
            body = parser.parseUntilBlocks('end' + token.value);
            parser.advanceAfterBlockEnd();
        }

        //不采用callExtension形式
        if (this.noRun && this.afterParse) {
            return this.afterParse(parser, nodes, lexer, args, body);
        }
        // See above for notes about CallExtension
        return new nodes.CallExtension(this, 'run', args, [body]);
    };

    this.afterParse = function(parser, nodes, lexer, args, body) {
        var oo = this.parseArgsNodeList(args);
        // console.log(args);
        var node = new nodes.Include(0, 0);
        node.template = new nodes.Literal(0, 0, oo.name);

        var body = new nodes.NodeList();
        body.addChild(node);
        return new nodes.CallExtension(this, 'run', args, [body]);
    }

    this.parseArgsNodeList = function(args) {
        if (!args || !args.children) {
            return {};
        }
        var res = {};

        args.children.forEach((arg) => {
            arg && arg.children && arg.children.forEach((pair) => {
                res[pair.key.value] = pair.value.value;
            })
        });

        return res;
    };

    this.run = function() {
        // nunjucks sends our "body" as the last argument
        const args = Array.prototype.slice.call(arguments);
        const context = args.shift();
        const body = args.pop();

        // provide fn
        this.safe = context.env.filters.safe;
        this.escape = context.env.filters.escape;
        // don't escape safe string
        // this.escapeAttr = function(val) {
        //     if (typeof val === 'string') {
        //         return this.escape(val);
        //     } else if (Array.isArray(val)) {
        //         return '[object Array]';
        //     } else {
        //         return val;
        //     }
        // };

        // render
        const html = this.render(context, args, body);
        return this.safe(html);
    }
    this.render = function(context, attrs, body) {
        var obj = attrs[0];
        var name = '';
        if (typeof obj === 'string') {
            name = obj;
        } else if (obj && obj['name']) {
            name = obj['name'];
        }

        // try {
        //     const resource = context.ctx[symbol.RESOURCE];
        //     var n = name.replace('.html', '')
        //     var manifest = context.ctx.__resource.manifest;
        //     var res = manifest.res;
        //     var less = n + '.less';
        //     var js = n + '.js';
        //     if (res[js]) {
        //         resource.addScript(`seajs.use("${js}")`);
        //     }
        //     if (res[less]) {
        //         resource.require(`${n}.less`);
        //     }
        // } catch (e) {

        // }
        /*
         * todo
         * https://github.com/mozilla/nunjucks/issues/497
         * 如果外层定义了相同变量，会使用外层变量，所以开发时尽量避免在标签中定义变量
         * */
        var oldVar = {};
        for (var k in obj) {
            oldVar[k] = context.ctx[k];
            context.setVariable(k, obj[k]);
        }
        var html = body();

        //还原变量
        for (var k in obj) {
            context.setVariable(k, oldVar[k]);
        }
        return html;
    }
}