# 开发文档（Asiainfo mall--dbp) 
#### up--2017.5.22

* ## 一、技术栈
#### fis3 [http://fis.baidu.com/fis3/docs/beginning/intro.html](http://fis.baidu.com/fis3/docs/beginning/intro.html)
#### nunjucks [https://mozilla.github.io/nunjucks/templating.html](https://mozilla.github.io/nunjucks/templating.html)
#### jquery 
#### express [http://www.expressjs.com.cn/](http://www.expressjs.com.cn/)
#### es6 [http://es6.ruanyifeng.com/#docs/destructuring](http://es6.ruanyifeng.com/#docs/destructuring)
#### less [http://less.bootcss.com](http://less.bootcss.com)
* ## 二、实现功能	
	* 1.利用fis3实现开发环境与生产环境的资源整合、watch资源
	* 2.利用nunjucks实现服务器端渲染
	* 3.利用express搭建前端服务、结合swagger生成后端代理接口
	* 4.利用less对css开发的友好化
	* 5.利用es6语法和新属性提高开发效率、页面性能

* ## 三、开发目录

		├── config -- 各种配置
		│   ├── express -- express的各种配置和拓展
		│   └── nunjucks -- nunjucks的各种配置和拓展
		├── api -- 通过swagger生成代理后端api
		├── middleware -- express中间件集中营
		├── routes -- 接收各种来自客户端的请求
		│        ├── use -- 渲染页面
		│        └── async -- 接收异步请求
		├── node_modules
		├── output -- 发布时生成的文件（不用理它）
		├── public -- 公用资源
		│   ├── lib -- 网络插件
		│   ├── widget -- 组件仓库
		│   │    ├── nunjucks nunjucks组件 
		│   │    ├── template 百度template组件 
		│   └── static -- 公共静态资源
		│        ├── img 
		│        ├── js
		│        └── less
		├── use -- html入口
		│   ├── base nunjucks extents组件
		│   └── ...各个页面html入口
		├── server.js
		└── app.js

* ## 四、开发前准备
	* #### 1.svn、github
	* #### 2.npm install、npm install fis3 -g、npm install gulp -g、npm install supervisor -g、npm run getApi
	* #### 3.sublime安装jija2、less
* ## 五、使用
	* #### package scrpits
		* 1.npm star 启动开发环境
		* 2.npm run publish 打包并发布
		* 3.npm run getApi 生成代理接口

	* #### contrller
		* 1.代理后端的api通过npm run getapi生成
		* 2.express中间件规整在middleware中
	* #### public
		* 1.widget里nunjucks所有的模块html、less、js均使用同名策略，不需要手动依赖。
				
				{% widget
        			dirname='public/widget/nunjucks/nundemo/nundemo.html',
        			a='廖睿睿睿睿',
        			b=8888
    			%}
    			
		* 2.widget里template所有的模块js和less均使用同名策略，不需要手动依赖
		
				import tmpl from './baidu.tmpl';

				let skuStatus = tmpl.template({
    				skuStatus: '百度tmpl_skuStatus'
				});
				
				$('').click();
				
				module.exports = skuStatus;//（baiduTemplate/demo123/baidu 导出html）
				
				
				----------------------我是分割线-----------------------------------
				
				
				let template = require('baiduTemplate/demo123/baidu');//该模版具有同名js、less所有属性

		* 3.lib为网络资源，若需要添加到所有页面依赖的基础资源内需要去fis-config配置
	* #### use
		* 1.base为nunjucks extents模版
		* 2.所有页面入口模块使用extendsSameName后才能支持同名策略、引入其他子模块时使用widget才能支持同名策略
	* #### config
		* 1.extentsFilter内添加nunjucks过滤fun
		
				class addFilter {

    				constructor(env) {
        				this.init(env);
    				}

    				init(env) {

        				env.addFilter('fontSize', function(data, length) {
            				if (!!!data) return data;
            				return data.length > length ? data.slice(0, length) + '...' : data;
        				});

        				env.addFilter('dateTimeFormat', function(timestamp) {
            				if (!!!timestamp) {
                				return ''
            				}
            				var date = new Date(timestamp * 1000),
                			year = date.getFullYear(),
                			month = timeFix(date.getMonth() + 1),
                			day = timeFix(date.getDate()),
                			hours = timeFix(date.getHours()),
                			minutes = timeFix(date.getMinutes()),
                			seconds = timeFix(date.getSeconds());

            				return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
        				});

        				env.addFilter('dateFormat', function(timestamp) {
            				if (!!!timestamp) {
                				return ''
            				}
            				var date = new Date(timestamp),
                			year = date.getFullYear(),
                			month = timeFix(date.getMonth() + 1),
                			day = timeFix(date.getDate());
            				return year + '-' + month + '-' + day
        				});

    				}

				}
				
		* 2.extestag内扩展nunjucks tag方法	 		
	
* ## 六、存在问题
	* #### 1.require.async 报错404








































