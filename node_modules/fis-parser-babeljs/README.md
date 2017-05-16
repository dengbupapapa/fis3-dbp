fis-parser-babeljs
=====================


A　Plugin to translate es6 to es5 based on babel in fis.



### INSTALL

```bash
npm install -g fis-parser-babeljs
```

### USE

- in fis3


    ```js
	fis3.match('js/**.js', {
        parser: fis.plugin('babeljs')
    })
	```

	```js
	fis3.match('js/**.js', {
        parser: fis.plugin('babeljs',{
          "presets": ["es2015", "react", "stage-0"]
      })
    })
	```

- in fis

	```js
	fis.config.set('modules.parser.js', 'babeljs');
	fis.config.set('settings.parser.babeljs', {
		// options
	});

	fis.config.set('roadmap.path', [
		{
			reg: '/es6/**.js',
			isES6: true
		},
		{
			reg: '**.js',
			isES6: false // 排除其他
		}
	].concat(fis.config.get('roadmap.path', []));
	```
