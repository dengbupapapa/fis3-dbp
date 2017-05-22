class RenderShallot {

    constructor(versions) {
        this._script = new Array();
        this._css = new Array();
        this.versions = versions
    }

    /**
     * 收集 script 代码
     * @param {String} code 散落的 JS 代码
     * @return {void}
     */
    addScript(code) {
        this._script.push(code);
    }

    /**
     * 收集 css 代码
     * @param {String} code 散落的 Css 代码
     * @return {void}
     */
    addCss(code) {
        this._css.push(code);
    }

    /**
     * 插入所有资源
     * @param {String} html use
     * @return {String} use 加入资源
     */

    renderChef(html) {

        let allCss = '<link rel="stylesheet" type="text/css" href="' + this._css.join('.css' + this.versions + '"><link rel="stylesheet" type="text/css" href="') + '.css' + this.versions + '">';
        let allScript = this._script.reduce((prev, next) => prev + '<script type="text/javascript" src="' + next + '.js' + this.versions + '"></script><script type="text/javascript">require("' + next + '.js")</script>', '');

        return html.replace(/\<\/body\>/, ($1) => allScript + $1)
            .replace(/\<\/head\>/, ($1) => allCss + $1);

    }

}

module.exports = RenderShallot