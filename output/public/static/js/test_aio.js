define('public/lib/mod/mod', function(require, exports, module) {

  var global = typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {};
  /**
   * @file: mod.js
   * @author fis
   * ver: 1.0.13
   * update: 2016/01/27
   * https://github.com/fex-team/mod
   */
  var require;
  
  /* eslint-disable no-unused-vars */
  var define;
  
  (function (global) {
  
      // 避免重复加载而导致已定义模块丢失
      if (require) {
          return;
      }
  
      var head = document.getElementsByTagName('head')[0];
      var loadingMap = {};
      var factoryMap = {};
      var modulesMap = {};
      var scriptsMap = {};
      var resMap = {};
      var pkgMap = {};
  
      var createScripts = function(queues, onerror){
  
          var docFrag = document.createDocumentFragment();
  
          for(var i = 0, len = queues.length; i < len; i++){
              var id = queues[i].id;
              var url = queues[i].url;
  
              if (url in scriptsMap) {
                  continue;
              }
  
              scriptsMap[url] = true;
  
              var script = document.createElement('script');
              if (onerror) {
                  (function(script, id){
                      var tid = setTimeout(function(){
                          onerror(id);
                      }, require.timeout);
  
                      script.onerror = function () {
                          clearTimeout(tid);
                          onerror(id);
                      };
  
                      var onload = function () {
                          clearTimeout(tid);
                      };
  
                      if ('onload' in script) {
                          script.onload = onload;
                      }
                      else {
                          script.onreadystatechange = function () {
                              if (this.readyState === 'loaded' || this.readyState === 'complete') {
                                  onload();
                              }
                          };
                      }
                  })(script, id);
              }
              script.type = 'text/javascript';
              script.src = url;
  
              docFrag.appendChild(script);
          }
  
          head.appendChild(docFrag);
      };
  
      var loadScripts = function(ids, callback, onerror){
          var queues = [];
          for(var i = 0, len = ids.length; i < len; i++){
              var id = ids[i];
              var queue = loadingMap[id] || (loadingMap[id] = []);
              queue.push(callback);
  
              //
              // resource map query
              //
              var res = resMap[id] || resMap[id + '.js'] || {};
              var pkg = res.pkg;
              var url;
  
              if (pkg) {
                  url = pkgMap[pkg].url || pkgMap[pkg].uri;
              }
              else {
                  url = res.url || res.uri || id;
              }
  
              queues.push({
                  id: id,
                  url: url
              });
          }
  
          createScripts(queues, onerror);
      };
  
      define = function (id, factory) {
          id = id.replace(/\.js$/i, '');
          factoryMap[id] = factory;
  
          var queue = loadingMap[id];
          if (queue) {
              for (var i = 0, n = queue.length; i < n; i++) {
                  queue[i]();
              }
              delete loadingMap[id];
          }
      };
  
      require = function (id) {
  
          // compatible with require([dep, dep2...]) syntax.
          if (id && id.splice) {
              return require.async.apply(this, arguments);
          }
  
          id = require.alias(id);
  
          var mod = modulesMap[id];
          if (mod) {
              return mod.exports;
          }
  
          //
          // init module
          //
          var factory = factoryMap[id];
          if (!factory) {
              throw '[ModJS] Cannot find module `' + id + '`';
          }
  
          mod = modulesMap[id] = {
              exports: {}
          };
  
          //
          // factory: function OR value
          //
          var ret = (typeof factory === 'function') ? factory.apply(mod, [require, mod.exports, mod]) : factory;
  
          if (ret) {
              mod.exports = ret;
          }
  
          return mod.exports;
      };
  
      require.async = function (names, onload, onerror) {
          if (typeof names === 'string') {
              names = [names];
          }
  
          var needMap = {};
          var needNum = 0;
          var needLoad = [];
  
          function findNeed(depArr) {
              var child;
  
              for (var i = 0, n = depArr.length; i < n; i++) {
                  //
                  // skip loading or loaded
                  //
                  var dep = require.alias(depArr[i]);
  
                  if (dep in needMap) {
                      continue;
                  }
  
                  needMap[dep] = true;
  
                  if (dep in factoryMap) {
                      // check whether loaded resource's deps is loaded or not
                      child = resMap[dep] || resMap[dep + '.js'];
                      if (child && 'deps' in child) {
                          findNeed(child.deps);
                      }
                      continue;
                  }
  
                  needLoad.push(dep);
                  needNum++;
  
                  child = resMap[dep] || resMap[dep + '.js'];
                  if (child && 'deps' in child) {
                      findNeed(child.deps);
                  }
              }
          }
  
          function updateNeed() {
              if (0 === needNum--) {
                  var args = [];
                  for (var i = 0, n = names.length; i < n; i++) {
                      args[i] = require(names[i]);
                  }
  
                  onload && onload.apply(global, args);
              }
          }
  
          findNeed(names);
          loadScripts(needLoad, updateNeed, onerror);
          updateNeed();
      };
      
      require.ensure = function(names, callback) {
        require.async(names, function() {
          callback && callback.call(this, require);
        });
      };
  
      require.resourceMap = function (obj) {
          var k;
          var col;
  
          // merge `res` & `pkg` fields
          col = obj.res;
          for (k in col) {
              if (col.hasOwnProperty(k)) {
                  resMap[k] = col[k];
              }
          }
  
          col = obj.pkg;
          for (k in col) {
              if (col.hasOwnProperty(k)) {
                  pkgMap[k] = col[k];
              }
          }
      };
  
      require.loadJs = function (url) {
          if (url in scriptsMap) {
              return;
          }
  
          scriptsMap[url] = true;
  
          var script = document.createElement('script');
          script.type = 'text/javascript';
          script.src = url;
          head.appendChild(script);
      };
  
      require.loadCss = function (cfg) {
          if (cfg.content) {
              var sty = document.createElement('style');
              sty.type = 'text/css';
  
              if (sty.styleSheet) { // IE
                  sty.styleSheet.cssText = cfg.content;
              }
              else {
                  sty.innerHTML = cfg.content;
              }
              head.appendChild(sty);
          }
          else if (cfg.url) {
              var link = document.createElement('link');
              link.href = cfg.url;
              link.rel = 'stylesheet';
              link.type = 'text/css';
              head.appendChild(link);
          }
      };
  
  
      require.alias = function (id) {
          return id.replace(/\.js$/i, '');
      };
  
      require.timeout = 5000;
  
  })(this);
  

});

require.resourceMap({
  "res": {
    "public/lib/mod/test/single/car": {
      "url": "/public/lib/mod/test/single/car.js",
      "type": "js"
    },
    "public/lib/mod/test/multi/root": {
      "url": "/public/lib/mod/test/multi/root.js",
      "type": "js"
    },
    "public/lib/mod/test/complex/root1": {
      "url": "/public/lib/mod/test/complex/root1.js",
      "type": "js"
    },
    "public/lib/mod/test/ring/1": {
      "url": "/public/lib/mod/test/ring/1.js",
      "type": "js"
    },
    "public/lib/mod/test/cross/1": {
      "url": "/public/lib/mod/test/cross/1.js",
      "type": "js"
    },
    "public/lib/mod/test/self/1": {
      "url": "/public/lib/mod/test/self/1.js",
      "type": "js"
    },
    "public/lib/mod/test/repeat/1": {
      "url": "/public/lib/mod/test/repeat/1.js",
      "type": "js"
    },
    "public/lib/mod/test/asyncmore/1": {
      "url": "/public/lib/mod/test/asyncmore/1.js",
      "type": "js"
    },
    "public/lib/mod/test/asyncmore/2": {
      "url": "/public/lib/mod/test/asyncmore/2.js",
      "type": "js"
    },
    "public/lib/mod/test/asyncmore/3": {
      "url": "/public/lib/mod/test/asyncmore/3.js",
      "type": "js"
    },
    "public/lib/mod/test/async_in_async/first": {
      "url": "/public/lib/mod/test/async_in_async/first.js",
      "type": "js"
    },
    "public/lib/mod/test/manyasync/1": {
      "url": "/public/lib/mod/test/manyasync/1.js",
      "type": "js"
    }
  },
  "pkg": {}
});
define('public/lib/mod/test/ringcross/1', function(require, exports, module) {

  define('ringcross/1.js', function(require, exports, module){
  //------------------------------------------------------------
  
  exports.test = function() {
  	return m1.val + m2.val + m3.val;
  };
  
  exports.val = 100;
  
  var m1 = require('ringcross/1.js');
  var m2 = require('ringcross/2.js');
  var m3 = require('ringcross/3.js');
  
  //------------------------------------------------------------
  });
  

});

define('node_modules/process/browser', function(require, exports, module) {

  // shim for using process in browser
  var process = module.exports = {};
  
  // cached from whatever global is present so that test runners that stub it
  // don't break things.  But we need to wrap it in a try catch in case it is
  // wrapped in strict mode code which doesn't define any globals.  It's inside a
  // function because try/catches deoptimize in certain engines.
  
  var cachedSetTimeout;
  var cachedClearTimeout;
  
  function defaultSetTimout() {
      throw new Error('setTimeout has not been defined');
  }
  function defaultClearTimeout () {
      throw new Error('clearTimeout has not been defined');
  }
  (function () {
      try {
          if (typeof setTimeout === 'function') {
              cachedSetTimeout = setTimeout;
          } else {
              cachedSetTimeout = defaultSetTimout;
          }
      } catch (e) {
          cachedSetTimeout = defaultSetTimout;
      }
      try {
          if (typeof clearTimeout === 'function') {
              cachedClearTimeout = clearTimeout;
          } else {
              cachedClearTimeout = defaultClearTimeout;
          }
      } catch (e) {
          cachedClearTimeout = defaultClearTimeout;
      }
  } ())
  function runTimeout(fun) {
      if (cachedSetTimeout === setTimeout) {
          //normal enviroments in sane situations
          return setTimeout(fun, 0);
      }
      // if setTimeout wasn't available but was latter defined
      if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
          cachedSetTimeout = setTimeout;
          return setTimeout(fun, 0);
      }
      try {
          // when when somebody has screwed with setTimeout but no I.E. maddness
          return cachedSetTimeout(fun, 0);
      } catch(e){
          try {
              // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
              return cachedSetTimeout.call(null, fun, 0);
          } catch(e){
              // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
              return cachedSetTimeout.call(this, fun, 0);
          }
      }
  
  
  }
  function runClearTimeout(marker) {
      if (cachedClearTimeout === clearTimeout) {
          //normal enviroments in sane situations
          return clearTimeout(marker);
      }
      // if clearTimeout wasn't available but was latter defined
      if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
          cachedClearTimeout = clearTimeout;
          return clearTimeout(marker);
      }
      try {
          // when when somebody has screwed with setTimeout but no I.E. maddness
          return cachedClearTimeout(marker);
      } catch (e){
          try {
              // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
              return cachedClearTimeout.call(null, marker);
          } catch (e){
              // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
              // Some versions of I.E. have different rules for clearTimeout vs setTimeout
              return cachedClearTimeout.call(this, marker);
          }
      }
  
  
  
  }
  var queue = [];
  var draining = false;
  var currentQueue;
  var queueIndex = -1;
  
  function cleanUpNextTick() {
      if (!draining || !currentQueue) {
          return;
      }
      draining = false;
      if (currentQueue.length) {
          queue = currentQueue.concat(queue);
      } else {
          queueIndex = -1;
      }
      if (queue.length) {
          drainQueue();
      }
  }
  
  function drainQueue() {
      if (draining) {
          return;
      }
      var timeout = runTimeout(cleanUpNextTick);
      draining = true;
  
      var len = queue.length;
      while(len) {
          currentQueue = queue;
          queue = [];
          while (++queueIndex < len) {
              if (currentQueue) {
                  currentQueue[queueIndex].run();
              }
          }
          queueIndex = -1;
          len = queue.length;
      }
      currentQueue = null;
      draining = false;
      runClearTimeout(timeout);
  }
  
  process.nextTick = function (fun) {
      var args = new Array(arguments.length - 1);
      if (arguments.length > 1) {
          for (var i = 1; i < arguments.length; i++) {
              args[i - 1] = arguments[i];
          }
      }
      queue.push(new Item(fun, args));
      if (queue.length === 1 && !draining) {
          runTimeout(drainQueue);
      }
  };
  
  // v8 likes predictible objects
  function Item(fun, array) {
      this.fun = fun;
      this.array = array;
  }
  Item.prototype.run = function () {
      this.fun.apply(null, this.array);
  };
  process.title = 'browser';
  process.browser = true;
  process.env = {};
  process.argv = [];
  process.version = ''; // empty string to avoid regexp issues
  process.versions = {};
  
  function noop() {}
  
  process.on = noop;
  process.addListener = noop;
  process.once = noop;
  process.off = noop;
  process.removeListener = noop;
  process.removeAllListeners = noop;
  process.emit = noop;
  process.prependListener = noop;
  process.prependOnceListener = noop;
  
  process.listeners = function (name) { return [] }
  
  process.binding = function (name) {
      throw new Error('process.binding is not supported');
  };
  
  process.cwd = function () { return '/' };
  process.chdir = function (dir) {
      throw new Error('process.chdir is not supported');
  };
  process.umask = function() { return 0; };
  

});

define('public/lib/mod/lib/qunit-1.11.0', function(require, exports, module) {

  var process = require('node_modules/process/browser');
  var global = typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {};
  /**
   * QUnit v1.11.0 - A JavaScript Unit Testing Framework
   *
   * http://qunitjs.com
   *
   * Copyright 2012 jQuery Foundation and other contributors
   * Released under the MIT license.
   * http://jquery.org/license
   */
  
  (function( window ) {
  
  var QUnit,
  	assert,
  	config,
  	onErrorFnPrev,
  	testId = 0,
  	fileName = (sourceFromStacktrace( 0 ) || "" ).replace(/(:\d+)+\)?/, "").replace(/.+\//, ""),
  	toString = Object.prototype.toString,
  	hasOwn = Object.prototype.hasOwnProperty,
  	// Keep a local reference to Date (GH-283)
  	Date = window.Date,
  	defined = {
  		setTimeout: typeof window.setTimeout !== "undefined",
  		sessionStorage: (function() {
  			var x = "qunit-test-string";
  			try {
  				sessionStorage.setItem( x, x );
  				sessionStorage.removeItem( x );
  				return true;
  			} catch( e ) {
  				return false;
  			}
  		}())
  	},
  	/**
  	 * Provides a normalized error string, correcting an issue
  	 * with IE 7 (and prior) where Error.prototype.toString is
  	 * not properly implemented
  	 *
  	 * Based on http://es5.github.com/#x15.11.4.4
  	 *
  	 * @param {String|Error} error
  	 * @return {String} error message
  	 */
  	errorString = function( error ) {
  		var name, message,
  			errorString = error.toString();
  		if ( errorString.substring( 0, 7 ) === "[object" ) {
  			name = error.name ? error.name.toString() : "Error";
  			message = error.message ? error.message.toString() : "";
  			if ( name && message ) {
  				return name + ": " + message;
  			} else if ( name ) {
  				return name;
  			} else if ( message ) {
  				return message;
  			} else {
  				return "Error";
  			}
  		} else {
  			return errorString;
  		}
  	},
  	/**
  	 * Makes a clone of an object using only Array or Object as base,
  	 * and copies over the own enumerable properties.
  	 *
  	 * @param {Object} obj
  	 * @return {Object} New object with only the own properties (recursively).
  	 */
  	objectValues = function( obj ) {
  		// Grunt 0.3.x uses an older version of jshint that still has jshint/jshint#392.
  		/*jshint newcap: false */
  		var key, val,
  			vals = QUnit.is( "array", obj ) ? [] : {};
  		for ( key in obj ) {
  			if ( hasOwn.call( obj, key ) ) {
  				val = obj[key];
  				vals[key] = val === Object(val) ? objectValues(val) : val;
  			}
  		}
  		return vals;
  	};
  
  function Test( settings ) {
  	extend( this, settings );
  	this.assertions = [];
  	this.testNumber = ++Test.count;
  }
  
  Test.count = 0;
  
  Test.prototype = {
  	init: function() {
  		var a, b, li,
  			tests = id( "qunit-tests" );
  
  		if ( tests ) {
  			b = document.createElement( "strong" );
  			b.innerHTML = this.nameHtml;
  
  			// `a` initialized at top of scope
  			a = document.createElement( "a" );
  			a.innerHTML = "Rerun";
  			a.href = QUnit.url({ testNumber: this.testNumber });
  
  			li = document.createElement( "li" );
  			li.appendChild( b );
  			li.appendChild( a );
  			li.className = "running";
  			li.id = this.id = "qunit-test-output" + testId++;
  
  			tests.appendChild( li );
  		}
  	},
  	setup: function() {
  		if ( this.module !== config.previousModule ) {
  			if ( config.previousModule ) {
  				runLoggingCallbacks( "moduleDone", QUnit, {
  					name: config.previousModule,
  					failed: config.moduleStats.bad,
  					passed: config.moduleStats.all - config.moduleStats.bad,
  					total: config.moduleStats.all
  				});
  			}
  			config.previousModule = this.module;
  			config.moduleStats = { all: 0, bad: 0 };
  			runLoggingCallbacks( "moduleStart", QUnit, {
  				name: this.module
  			});
  		} else if ( config.autorun ) {
  			runLoggingCallbacks( "moduleStart", QUnit, {
  				name: this.module
  			});
  		}
  
  		config.current = this;
  
  		this.testEnvironment = extend({
  			setup: function() {},
  			teardown: function() {}
  		}, this.moduleTestEnvironment );
  
  		this.started = +new Date();
  		runLoggingCallbacks( "testStart", QUnit, {
  			name: this.testName,
  			module: this.module
  		});
  
  		// allow utility functions to access the current test environment
  		// TODO why??
  		QUnit.current_testEnvironment = this.testEnvironment;
  
  		if ( !config.pollution ) {
  			saveGlobal();
  		}
  		if ( config.notrycatch ) {
  			this.testEnvironment.setup.call( this.testEnvironment );
  			return;
  		}
  		try {
  			this.testEnvironment.setup.call( this.testEnvironment );
  		} catch( e ) {
  			QUnit.pushFailure( "Setup failed on " + this.testName + ": " + ( e.message || e ), extractStacktrace( e, 1 ) );
  		}
  	},
  	run: function() {
  		config.current = this;
  
  		var running = id( "qunit-testresult" );
  
  		if ( running ) {
  			running.innerHTML = "Running: <br/>" + this.nameHtml;
  		}
  
  		if ( this.async ) {
  			QUnit.stop();
  		}
  
  		this.callbackStarted = +new Date();
  
  		if ( config.notrycatch ) {
  			this.callback.call( this.testEnvironment, QUnit.assert );
  			this.callbackRuntime = +new Date() - this.callbackStarted;
  			return;
  		}
  
  		try {
  			this.callback.call( this.testEnvironment, QUnit.assert );
  			this.callbackRuntime = +new Date() - this.callbackStarted;
  		} catch( e ) {
  			this.callbackRuntime = +new Date() - this.callbackStarted;
  
  			QUnit.pushFailure( "Died on test #" + (this.assertions.length + 1) + " " + this.stack + ": " + ( e.message || e ), extractStacktrace( e, 0 ) );
  			// else next test will carry the responsibility
  			saveGlobal();
  
  			// Restart the tests if they're blocking
  			if ( config.blocking ) {
  				QUnit.start();
  			}
  		}
  	},
  	teardown: function() {
  		config.current = this;
  		if ( config.notrycatch ) {
  			if ( typeof this.callbackRuntime === "undefined" ) {
  				this.callbackRuntime = +new Date() - this.callbackStarted;
  			}
  			this.testEnvironment.teardown.call( this.testEnvironment );
  			return;
  		} else {
  			try {
  				this.testEnvironment.teardown.call( this.testEnvironment );
  			} catch( e ) {
  				QUnit.pushFailure( "Teardown failed on " + this.testName + ": " + ( e.message || e ), extractStacktrace( e, 1 ) );
  			}
  		}
  		checkPollution();
  	},
  	finish: function() {
  		config.current = this;
  		if ( config.requireExpects && this.expected === null ) {
  			QUnit.pushFailure( "Expected number of assertions to be defined, but expect() was not called.", this.stack );
  		} else if ( this.expected !== null && this.expected !== this.assertions.length ) {
  			QUnit.pushFailure( "Expected " + this.expected + " assertions, but " + this.assertions.length + " were run", this.stack );
  		} else if ( this.expected === null && !this.assertions.length ) {
  			QUnit.pushFailure( "Expected at least one assertion, but none were run - call expect(0) to accept zero assertions.", this.stack );
  		}
  
  		var i, assertion, a, b, time, li, ol,
  			test = this,
  			good = 0,
  			bad = 0,
  			tests = id( "qunit-tests" );
  
  		this.runtime = +new Date() - this.started;
  		config.stats.all += this.assertions.length;
  		config.moduleStats.all += this.assertions.length;
  
  		if ( tests ) {
  			ol = document.createElement( "ol" );
  			ol.className = "qunit-assert-list";
  
  			for ( i = 0; i < this.assertions.length; i++ ) {
  				assertion = this.assertions[i];
  
  				li = document.createElement( "li" );
  				li.className = assertion.result ? "pass" : "fail";
  				li.innerHTML = assertion.message || ( assertion.result ? "okay" : "failed" );
  				ol.appendChild( li );
  
  				if ( assertion.result ) {
  					good++;
  				} else {
  					bad++;
  					config.stats.bad++;
  					config.moduleStats.bad++;
  				}
  			}
  
  			// store result when possible
  			if ( QUnit.config.reorder && defined.sessionStorage ) {
  				if ( bad ) {
  					sessionStorage.setItem( "qunit-test-" + this.module + "-" + this.testName, bad );
  				} else {
  					sessionStorage.removeItem( "qunit-test-" + this.module + "-" + this.testName );
  				}
  			}
  
  			if ( bad === 0 ) {
  				addClass( ol, "qunit-collapsed" );
  			}
  
  			// `b` initialized at top of scope
  			b = document.createElement( "strong" );
  			b.innerHTML = this.nameHtml + " <b class='counts'>(<b class='failed'>" + bad + "</b>, <b class='passed'>" + good + "</b>, " + this.assertions.length + ")</b>";
  
  			addEvent(b, "click", function() {
  				var next = b.parentNode.lastChild,
  					collapsed = hasClass( next, "qunit-collapsed" );
  				( collapsed ? removeClass : addClass )( next, "qunit-collapsed" );
  			});
  
  			addEvent(b, "dblclick", function( e ) {
  				var target = e && e.target ? e.target : window.event.srcElement;
  				if ( target.nodeName.toLowerCase() === "span" || target.nodeName.toLowerCase() === "b" ) {
  					target = target.parentNode;
  				}
  				if ( window.location && target.nodeName.toLowerCase() === "strong" ) {
  					window.location = QUnit.url({ testNumber: test.testNumber });
  				}
  			});
  
  			// `time` initialized at top of scope
  			time = document.createElement( "span" );
  			time.className = "runtime";
  			time.innerHTML = this.runtime + " ms";
  
  			// `li` initialized at top of scope
  			li = id( this.id );
  			li.className = bad ? "fail" : "pass";
  			li.removeChild( li.firstChild );
  			a = li.firstChild;
  			li.appendChild( b );
  			li.appendChild( a );
  			li.appendChild( time );
  			li.appendChild( ol );
  
  		} else {
  			for ( i = 0; i < this.assertions.length; i++ ) {
  				if ( !this.assertions[i].result ) {
  					bad++;
  					config.stats.bad++;
  					config.moduleStats.bad++;
  				}
  			}
  		}
  
  		runLoggingCallbacks( "testDone", QUnit, {
  			name: this.testName,
  			module: this.module,
  			failed: bad,
  			passed: this.assertions.length - bad,
  			total: this.assertions.length,
  			duration: this.runtime
  		});
  
  		QUnit.reset();
  
  		config.current = undefined;
  	},
  
  	queue: function() {
  		var bad,
  			test = this;
  
  		synchronize(function() {
  			test.init();
  		});
  		function run() {
  			// each of these can by async
  			synchronize(function() {
  				test.setup();
  			});
  			synchronize(function() {
  				test.run();
  			});
  			synchronize(function() {
  				test.teardown();
  			});
  			synchronize(function() {
  				test.finish();
  			});
  		}
  
  		// `bad` initialized at top of scope
  		// defer when previous test run passed, if storage is available
  		bad = QUnit.config.reorder && defined.sessionStorage &&
  						+sessionStorage.getItem( "qunit-test-" + this.module + "-" + this.testName );
  
  		if ( bad ) {
  			run();
  		} else {
  			synchronize( run, true );
  		}
  	}
  };
  
  // Root QUnit object.
  // `QUnit` initialized at top of scope
  QUnit = {
  
  	// call on start of module test to prepend name to all tests
  	module: function( name, testEnvironment ) {
  		config.currentModule = name;
  		config.currentModuleTestEnvironment = testEnvironment;
  		config.modules[name] = true;
  	},
  
  	asyncTest: function( testName, expected, callback ) {
  		if ( arguments.length === 2 ) {
  			callback = expected;
  			expected = null;
  		}
  
  		QUnit.test( testName, expected, callback, true );
  	},
  
  	test: function( testName, expected, callback, async ) {
  		var test,
  			nameHtml = "<span class='test-name'>" + escapeText( testName ) + "</span>";
  
  		if ( arguments.length === 2 ) {
  			callback = expected;
  			expected = null;
  		}
  
  		if ( config.currentModule ) {
  			nameHtml = "<span class='module-name'>" + escapeText( config.currentModule ) + "</span>: " + nameHtml;
  		}
  
  		test = new Test({
  			nameHtml: nameHtml,
  			testName: testName,
  			expected: expected,
  			async: async,
  			callback: callback,
  			module: config.currentModule,
  			moduleTestEnvironment: config.currentModuleTestEnvironment,
  			stack: sourceFromStacktrace( 2 )
  		});
  
  		if ( !validTest( test ) ) {
  			return;
  		}
  
  		test.queue();
  	},
  
  	// Specify the number of expected assertions to gurantee that failed test (no assertions are run at all) don't slip through.
  	expect: function( asserts ) {
  		if (arguments.length === 1) {
  			config.current.expected = asserts;
  		} else {
  			return config.current.expected;
  		}
  	},
  
  	start: function( count ) {
  		// QUnit hasn't been initialized yet.
  		// Note: RequireJS (et al) may delay onLoad
  		if ( config.semaphore === undefined ) {
  			QUnit.begin(function() {
  				// This is triggered at the top of QUnit.load, push start() to the event loop, to allow QUnit.load to finish first
  				setTimeout(function() {
  					QUnit.start( count );
  				});
  			});
  			return;
  		}
  
  		config.semaphore -= count || 1;
  		// don't start until equal number of stop-calls
  		if ( config.semaphore > 0 ) {
  			return;
  		}
  		// ignore if start is called more often then stop
  		if ( config.semaphore < 0 ) {
  			config.semaphore = 0;
  			QUnit.pushFailure( "Called start() while already started (QUnit.config.semaphore was 0 already)", null, sourceFromStacktrace(2) );
  			return;
  		}
  		// A slight delay, to avoid any current callbacks
  		if ( defined.setTimeout ) {
  			window.setTimeout(function() {
  				if ( config.semaphore > 0 ) {
  					return;
  				}
  				if ( config.timeout ) {
  					clearTimeout( config.timeout );
  				}
  
  				config.blocking = false;
  				process( true );
  			}, 13);
  		} else {
  			config.blocking = false;
  			process( true );
  		}
  	},
  
  	stop: function( count ) {
  		config.semaphore += count || 1;
  		config.blocking = true;
  
  		if ( config.testTimeout && defined.setTimeout ) {
  			clearTimeout( config.timeout );
  			config.timeout = window.setTimeout(function() {
  				QUnit.ok( false, "Test timed out" );
  				config.semaphore = 1;
  				QUnit.start();
  			}, config.testTimeout );
  		}
  	}
  };
  
  // `assert` initialized at top of scope
  // Asssert helpers
  // All of these must either call QUnit.push() or manually do:
  // - runLoggingCallbacks( "log", .. );
  // - config.current.assertions.push({ .. });
  // We attach it to the QUnit object *after* we expose the public API,
  // otherwise `assert` will become a global variable in browsers (#341).
  assert = {
  	/**
  	 * Asserts rough true-ish result.
  	 * @name ok
  	 * @function
  	 * @example ok( "asdfasdf".length > 5, "There must be at least 5 chars" );
  	 */
  	ok: function( result, msg ) {
  		if ( !config.current ) {
  			throw new Error( "ok() assertion outside test context, was " + sourceFromStacktrace(2) );
  		}
  		result = !!result;
  
  		var source,
  			details = {
  				module: config.current.module,
  				name: config.current.testName,
  				result: result,
  				message: msg
  			};
  
  		msg = escapeText( msg || (result ? "okay" : "failed" ) );
  		msg = "<span class='test-message'>" + msg + "</span>";
  
  		if ( !result ) {
  			source = sourceFromStacktrace( 2 );
  			if ( source ) {
  				details.source = source;
  				msg += "<table><tr class='test-source'><th>Source: </th><td><pre>" + escapeText( source ) + "</pre></td></tr></table>";
  			}
  		}
  		runLoggingCallbacks( "log", QUnit, details );
  		config.current.assertions.push({
  			result: result,
  			message: msg
  		});
  	},
  
  	/**
  	 * Assert that the first two arguments are equal, with an optional message.
  	 * Prints out both actual and expected values.
  	 * @name equal
  	 * @function
  	 * @example equal( format( "Received {0} bytes.", 2), "Received 2 bytes.", "format() replaces {0} with next argument" );
  	 */
  	equal: function( actual, expected, message ) {
  		/*jshint eqeqeq:false */
  		QUnit.push( expected == actual, actual, expected, message );
  	},
  
  	/**
  	 * @name notEqual
  	 * @function
  	 */
  	notEqual: function( actual, expected, message ) {
  		/*jshint eqeqeq:false */
  		QUnit.push( expected != actual, actual, expected, message );
  	},
  
  	/**
  	 * @name propEqual
  	 * @function
  	 */
  	propEqual: function( actual, expected, message ) {
  		actual = objectValues(actual);
  		expected = objectValues(expected);
  		QUnit.push( QUnit.equiv(actual, expected), actual, expected, message );
  	},
  
  	/**
  	 * @name notPropEqual
  	 * @function
  	 */
  	notPropEqual: function( actual, expected, message ) {
  		actual = objectValues(actual);
  		expected = objectValues(expected);
  		QUnit.push( !QUnit.equiv(actual, expected), actual, expected, message );
  	},
  
  	/**
  	 * @name deepEqual
  	 * @function
  	 */
  	deepEqual: function( actual, expected, message ) {
  		QUnit.push( QUnit.equiv(actual, expected), actual, expected, message );
  	},
  
  	/**
  	 * @name notDeepEqual
  	 * @function
  	 */
  	notDeepEqual: function( actual, expected, message ) {
  		QUnit.push( !QUnit.equiv(actual, expected), actual, expected, message );
  	},
  
  	/**
  	 * @name strictEqual
  	 * @function
  	 */
  	strictEqual: function( actual, expected, message ) {
  		QUnit.push( expected === actual, actual, expected, message );
  	},
  
  	/**
  	 * @name notStrictEqual
  	 * @function
  	 */
  	notStrictEqual: function( actual, expected, message ) {
  		QUnit.push( expected !== actual, actual, expected, message );
  	},
  
  	"throws": function( block, expected, message ) {
  		var actual,
  			expectedOutput = expected,
  			ok = false;
  
  		// 'expected' is optional
  		if ( typeof expected === "string" ) {
  			message = expected;
  			expected = null;
  		}
  
  		config.current.ignoreGlobalErrors = true;
  		try {
  			block.call( config.current.testEnvironment );
  		} catch (e) {
  			actual = e;
  		}
  		config.current.ignoreGlobalErrors = false;
  
  		if ( actual ) {
  			// we don't want to validate thrown error
  			if ( !expected ) {
  				ok = true;
  				expectedOutput = null;
  			// expected is a regexp
  			} else if ( QUnit.objectType( expected ) === "regexp" ) {
  				ok = expected.test( errorString( actual ) );
  			// expected is a constructor
  			} else if ( actual instanceof expected ) {
  				ok = true;
  			// expected is a validation function which returns true is validation passed
  			} else if ( expected.call( {}, actual ) === true ) {
  				expectedOutput = null;
  				ok = true;
  			}
  
  			QUnit.push( ok, actual, expectedOutput, message );
  		} else {
  			QUnit.pushFailure( message, null, 'No exception was thrown.' );
  		}
  	}
  };
  
  /**
   * @deprecate since 1.8.0
   * Kept assertion helpers in root for backwards compatibility.
   */
  extend( QUnit, assert );
  
  /**
   * @deprecated since 1.9.0
   * Kept root "raises()" for backwards compatibility.
   * (Note that we don't introduce assert.raises).
   */
  QUnit.raises = assert[ "throws" ];
  
  /**
   * @deprecated since 1.0.0, replaced with error pushes since 1.3.0
   * Kept to avoid TypeErrors for undefined methods.
   */
  QUnit.equals = function() {
  	QUnit.push( false, false, false, "QUnit.equals has been deprecated since 2009 (e88049a0), use QUnit.equal instead" );
  };
  QUnit.same = function() {
  	QUnit.push( false, false, false, "QUnit.same has been deprecated since 2009 (e88049a0), use QUnit.deepEqual instead" );
  };
  
  // We want access to the constructor's prototype
  (function() {
  	function F() {}
  	F.prototype = QUnit;
  	QUnit = new F();
  	// Make F QUnit's constructor so that we can add to the prototype later
  	QUnit.constructor = F;
  }());
  
  /**
   * Config object: Maintain internal state
   * Later exposed as QUnit.config
   * `config` initialized at top of scope
   */
  config = {
  	// The queue of tests to run
  	queue: [],
  
  	// block until document ready
  	blocking: true,
  
  	// when enabled, show only failing tests
  	// gets persisted through sessionStorage and can be changed in UI via checkbox
  	hidepassed: false,
  
  	// by default, run previously failed tests first
  	// very useful in combination with "Hide passed tests" checked
  	reorder: true,
  
  	// by default, modify document.title when suite is done
  	altertitle: true,
  
  	// when enabled, all tests must call expect()
  	requireExpects: false,
  
  	// add checkboxes that are persisted in the query-string
  	// when enabled, the id is set to `true` as a `QUnit.config` property
  	urlConfig: [
  		{
  			id: "noglobals",
  			label: "Check for Globals",
  			tooltip: "Enabling this will test if any test introduces new properties on the `window` object. Stored as query-strings."
  		},
  		{
  			id: "notrycatch",
  			label: "No try-catch",
  			tooltip: "Enabling this will run tests outside of a try-catch block. Makes debugging exceptions in IE reasonable. Stored as query-strings."
  		}
  	],
  
  	// Set of all modules.
  	modules: {},
  
  	// logging callback queues
  	begin: [],
  	done: [],
  	log: [],
  	testStart: [],
  	testDone: [],
  	moduleStart: [],
  	moduleDone: []
  };
  
  // Export global variables, unless an 'exports' object exists,
  // in that case we assume we're in CommonJS (dealt with on the bottom of the script)
  if ( typeof exports === "undefined" ) {
  	extend( window, QUnit );
  
  	// Expose QUnit object
  	window.QUnit = QUnit;
  }
  
  // Initialize more QUnit.config and QUnit.urlParams
  (function() {
  	var i,
  		location = window.location || { search: "", protocol: "file:" },
  		params = location.search.slice( 1 ).split( "&" ),
  		length = params.length,
  		urlParams = {},
  		current;
  
  	if ( params[ 0 ] ) {
  		for ( i = 0; i < length; i++ ) {
  			current = params[ i ].split( "=" );
  			current[ 0 ] = decodeURIComponent( current[ 0 ] );
  			// allow just a key to turn on a flag, e.g., test.html?noglobals
  			current[ 1 ] = current[ 1 ] ? decodeURIComponent( current[ 1 ] ) : true;
  			urlParams[ current[ 0 ] ] = current[ 1 ];
  		}
  	}
  
  	QUnit.urlParams = urlParams;
  
  	// String search anywhere in moduleName+testName
  	config.filter = urlParams.filter;
  
  	// Exact match of the module name
  	config.module = urlParams.module;
  
  	config.testNumber = parseInt( urlParams.testNumber, 10 ) || null;
  
  	// Figure out if we're running the tests from a server or not
  	QUnit.isLocal = location.protocol === "file:";
  }());
  
  // Extend QUnit object,
  // these after set here because they should not be exposed as global functions
  extend( QUnit, {
  	assert: assert,
  
  	config: config,
  
  	// Initialize the configuration options
  	init: function() {
  		extend( config, {
  			stats: { all: 0, bad: 0 },
  			moduleStats: { all: 0, bad: 0 },
  			started: +new Date(),
  			updateRate: 1000,
  			blocking: false,
  			autostart: true,
  			autorun: false,
  			filter: "",
  			queue: [],
  			semaphore: 1
  		});
  
  		var tests, banner, result,
  			qunit = id( "qunit" );
  
  		if ( qunit ) {
  			qunit.innerHTML =
  				"<h1 id='qunit-header'>" + escapeText( document.title ) + "</h1>" +
  				"<h2 id='qunit-banner'></h2>" +
  				"<div id='qunit-testrunner-toolbar'></div>" +
  				"<h2 id='qunit-userAgent'></h2>" +
  				"<ol id='qunit-tests'></ol>";
  		}
  
  		tests = id( "qunit-tests" );
  		banner = id( "qunit-banner" );
  		result = id( "qunit-testresult" );
  
  		if ( tests ) {
  			tests.innerHTML = "";
  		}
  
  		if ( banner ) {
  			banner.className = "";
  		}
  
  		if ( result ) {
  			result.parentNode.removeChild( result );
  		}
  
  		if ( tests ) {
  			result = document.createElement( "p" );
  			result.id = "qunit-testresult";
  			result.className = "result";
  			tests.parentNode.insertBefore( result, tests );
  			result.innerHTML = "Running...<br/>&nbsp;";
  		}
  	},
  
  	// Resets the test setup. Useful for tests that modify the DOM.
  	reset: function() {
  		var fixture = id( "qunit-fixture" );
  		if ( fixture ) {
  			fixture.innerHTML = config.fixture;
  		}
  	},
  
  	// Trigger an event on an element.
  	// @example triggerEvent( document.body, "click" );
  	triggerEvent: function( elem, type, event ) {
  		if ( document.createEvent ) {
  			event = document.createEvent( "MouseEvents" );
  			event.initMouseEvent(type, true, true, elem.ownerDocument.defaultView,
  				0, 0, 0, 0, 0, false, false, false, false, 0, null);
  
  			elem.dispatchEvent( event );
  		} else if ( elem.fireEvent ) {
  			elem.fireEvent( "on" + type );
  		}
  	},
  
  	// Safe object type checking
  	is: function( type, obj ) {
  		return QUnit.objectType( obj ) === type;
  	},
  
  	objectType: function( obj ) {
  		if ( typeof obj === "undefined" ) {
  				return "undefined";
  		// consider: typeof null === object
  		}
  		if ( obj === null ) {
  				return "null";
  		}
  
  		var match = toString.call( obj ).match(/^\[object\s(.*)\]$/),
  			type = match && match[1] || "";
  
  		switch ( type ) {
  			case "Number":
  				if ( isNaN(obj) ) {
  					return "nan";
  				}
  				return "number";
  			case "String":
  			case "Boolean":
  			case "Array":
  			case "Date":
  			case "RegExp":
  			case "Function":
  				return type.toLowerCase();
  		}
  		if ( typeof obj === "object" ) {
  			return "object";
  		}
  		return undefined;
  	},
  
  	push: function( result, actual, expected, message ) {
  		if ( !config.current ) {
  			throw new Error( "assertion outside test context, was " + sourceFromStacktrace() );
  		}
  
  		var output, source,
  			details = {
  				module: config.current.module,
  				name: config.current.testName,
  				result: result,
  				message: message,
  				actual: actual,
  				expected: expected
  			};
  
  		message = escapeText( message ) || ( result ? "okay" : "failed" );
  		message = "<span class='test-message'>" + message + "</span>";
  		output = message;
  
  		if ( !result ) {
  			expected = escapeText( QUnit.jsDump.parse(expected) );
  			actual = escapeText( QUnit.jsDump.parse(actual) );
  			output += "<table><tr class='test-expected'><th>Expected: </th><td><pre>" + expected + "</pre></td></tr>";
  
  			if ( actual !== expected ) {
  				output += "<tr class='test-actual'><th>Result: </th><td><pre>" + actual + "</pre></td></tr>";
  				output += "<tr class='test-diff'><th>Diff: </th><td><pre>" + QUnit.diff( expected, actual ) + "</pre></td></tr>";
  			}
  
  			source = sourceFromStacktrace();
  
  			if ( source ) {
  				details.source = source;
  				output += "<tr class='test-source'><th>Source: </th><td><pre>" + escapeText( source ) + "</pre></td></tr>";
  			}
  
  			output += "</table>";
  		}
  
  		runLoggingCallbacks( "log", QUnit, details );
  
  		config.current.assertions.push({
  			result: !!result,
  			message: output
  		});
  	},
  
  	pushFailure: function( message, source, actual ) {
  		if ( !config.current ) {
  			throw new Error( "pushFailure() assertion outside test context, was " + sourceFromStacktrace(2) );
  		}
  
  		var output,
  			details = {
  				module: config.current.module,
  				name: config.current.testName,
  				result: false,
  				message: message
  			};
  
  		message = escapeText( message ) || "error";
  		message = "<span class='test-message'>" + message + "</span>";
  		output = message;
  
  		output += "<table>";
  
  		if ( actual ) {
  			output += "<tr class='test-actual'><th>Result: </th><td><pre>" + escapeText( actual ) + "</pre></td></tr>";
  		}
  
  		if ( source ) {
  			details.source = source;
  			output += "<tr class='test-source'><th>Source: </th><td><pre>" + escapeText( source ) + "</pre></td></tr>";
  		}
  
  		output += "</table>";
  
  		runLoggingCallbacks( "log", QUnit, details );
  
  		config.current.assertions.push({
  			result: false,
  			message: output
  		});
  	},
  
  	url: function( params ) {
  		params = extend( extend( {}, QUnit.urlParams ), params );
  		var key,
  			querystring = "?";
  
  		for ( key in params ) {
  			if ( !hasOwn.call( params, key ) ) {
  				continue;
  			}
  			querystring += encodeURIComponent( key ) + "=" +
  				encodeURIComponent( params[ key ] ) + "&";
  		}
  		return window.location.protocol + "//" + window.location.host +
  			window.location.pathname + querystring.slice( 0, -1 );
  	},
  
  	extend: extend,
  	id: id,
  	addEvent: addEvent
  	// load, equiv, jsDump, diff: Attached later
  });
  
  /**
   * @deprecated: Created for backwards compatibility with test runner that set the hook function
   * into QUnit.{hook}, instead of invoking it and passing the hook function.
   * QUnit.constructor is set to the empty F() above so that we can add to it's prototype here.
   * Doing this allows us to tell if the following methods have been overwritten on the actual
   * QUnit object.
   */
  extend( QUnit.constructor.prototype, {
  
  	// Logging callbacks; all receive a single argument with the listed properties
  	// run test/logs.html for any related changes
  	begin: registerLoggingCallback( "begin" ),
  
  	// done: { failed, passed, total, runtime }
  	done: registerLoggingCallback( "done" ),
  
  	// log: { result, actual, expected, message }
  	log: registerLoggingCallback( "log" ),
  
  	// testStart: { name }
  	testStart: registerLoggingCallback( "testStart" ),
  
  	// testDone: { name, failed, passed, total, duration }
  	testDone: registerLoggingCallback( "testDone" ),
  
  	// moduleStart: { name }
  	moduleStart: registerLoggingCallback( "moduleStart" ),
  
  	// moduleDone: { name, failed, passed, total }
  	moduleDone: registerLoggingCallback( "moduleDone" )
  });
  
  if ( typeof document === "undefined" || document.readyState === "complete" ) {
  	config.autorun = true;
  }
  
  QUnit.load = function() {
  	runLoggingCallbacks( "begin", QUnit, {} );
  
  	// Initialize the config, saving the execution queue
  	var banner, filter, i, label, len, main, ol, toolbar, userAgent, val,
  		urlConfigCheckboxesContainer, urlConfigCheckboxes, moduleFilter,
  		numModules = 0,
  		moduleFilterHtml = "",
  		urlConfigHtml = "",
  		oldconfig = extend( {}, config );
  
  	QUnit.init();
  	extend(config, oldconfig);
  
  	config.blocking = false;
  
  	len = config.urlConfig.length;
  
  	for ( i = 0; i < len; i++ ) {
  		val = config.urlConfig[i];
  		if ( typeof val === "string" ) {
  			val = {
  				id: val,
  				label: val,
  				tooltip: "[no tooltip available]"
  			};
  		}
  		config[ val.id ] = QUnit.urlParams[ val.id ];
  		urlConfigHtml += "<input id='qunit-urlconfig-" + escapeText( val.id ) +
  			"' name='" + escapeText( val.id ) +
  			"' type='checkbox'" + ( config[ val.id ] ? " checked='checked'" : "" ) +
  			" title='" + escapeText( val.tooltip ) +
  			"'><label for='qunit-urlconfig-" + escapeText( val.id ) +
  			"' title='" + escapeText( val.tooltip ) + "'>" + val.label + "</label>";
  	}
  
  	moduleFilterHtml += "<label for='qunit-modulefilter'>Module: </label><select id='qunit-modulefilter' name='modulefilter'><option value='' " +
  		( config.module === undefined  ? "selected='selected'" : "" ) +
  		">< All Modules ></option>";
  
  	for ( i in config.modules ) {
  		if ( config.modules.hasOwnProperty( i ) ) {
  			numModules += 1;
  			moduleFilterHtml += "<option value='" + escapeText( encodeURIComponent(i) ) + "' " +
  				( config.module === i ? "selected='selected'" : "" ) +
  				">" + escapeText(i) + "</option>";
  		}
  	}
  	moduleFilterHtml += "</select>";
  
  	// `userAgent` initialized at top of scope
  	userAgent = id( "qunit-userAgent" );
  	if ( userAgent ) {
  		userAgent.innerHTML = navigator.userAgent;
  	}
  
  	// `banner` initialized at top of scope
  	banner = id( "qunit-header" );
  	if ( banner ) {
  		banner.innerHTML = "<a href='" + QUnit.url({ filter: undefined, module: undefined, testNumber: undefined }) + "'>" + banner.innerHTML + "</a> ";
  	}
  
  	// `toolbar` initialized at top of scope
  	toolbar = id( "qunit-testrunner-toolbar" );
  	if ( toolbar ) {
  		// `filter` initialized at top of scope
  		filter = document.createElement( "input" );
  		filter.type = "checkbox";
  		filter.id = "qunit-filter-pass";
  
  		addEvent( filter, "click", function() {
  			var tmp,
  				ol = document.getElementById( "qunit-tests" );
  
  			if ( filter.checked ) {
  				ol.className = ol.className + " hidepass";
  			} else {
  				tmp = " " + ol.className.replace( /[\n\t\r]/g, " " ) + " ";
  				ol.className = tmp.replace( / hidepass /, " " );
  			}
  			if ( defined.sessionStorage ) {
  				if (filter.checked) {
  					sessionStorage.setItem( "qunit-filter-passed-tests", "true" );
  				} else {
  					sessionStorage.removeItem( "qunit-filter-passed-tests" );
  				}
  			}
  		});
  
  		if ( config.hidepassed || defined.sessionStorage && sessionStorage.getItem( "qunit-filter-passed-tests" ) ) {
  			filter.checked = true;
  			// `ol` initialized at top of scope
  			ol = document.getElementById( "qunit-tests" );
  			ol.className = ol.className + " hidepass";
  		}
  		toolbar.appendChild( filter );
  
  		// `label` initialized at top of scope
  		label = document.createElement( "label" );
  		label.setAttribute( "for", "qunit-filter-pass" );
  		label.setAttribute( "title", "Only show tests and assertons that fail. Stored in sessionStorage." );
  		label.innerHTML = "Hide passed tests";
  		toolbar.appendChild( label );
  
  		urlConfigCheckboxesContainer = document.createElement("span");
  		urlConfigCheckboxesContainer.innerHTML = urlConfigHtml;
  		urlConfigCheckboxes = urlConfigCheckboxesContainer.getElementsByTagName("input");
  		// For oldIE support:
  		// * Add handlers to the individual elements instead of the container
  		// * Use "click" instead of "change"
  		// * Fallback from event.target to event.srcElement
  		addEvents( urlConfigCheckboxes, "click", function( event ) {
  			var params = {},
  				target = event.target || event.srcElement;
  			params[ target.name ] = target.checked ? true : undefined;
  			window.location = QUnit.url( params );
  		});
  		toolbar.appendChild( urlConfigCheckboxesContainer );
  
  		if (numModules > 1) {
  			moduleFilter = document.createElement( 'span' );
  			moduleFilter.setAttribute( 'id', 'qunit-modulefilter-container' );
  			moduleFilter.innerHTML = moduleFilterHtml;
  			addEvent( moduleFilter.lastChild, "change", function() {
  				var selectBox = moduleFilter.getElementsByTagName("select")[0],
  					selectedModule = decodeURIComponent(selectBox.options[selectBox.selectedIndex].value);
  
  				window.location = QUnit.url( { module: ( selectedModule === "" ) ? undefined : selectedModule } );
  			});
  			toolbar.appendChild(moduleFilter);
  		}
  	}
  
  	// `main` initialized at top of scope
  	main = id( "qunit-fixture" );
  	if ( main ) {
  		config.fixture = main.innerHTML;
  	}
  
  	if ( config.autostart ) {
  		QUnit.start();
  	}
  };
  
  addEvent( window, "load", QUnit.load );
  
  // `onErrorFnPrev` initialized at top of scope
  // Preserve other handlers
  onErrorFnPrev = window.onerror;
  
  // Cover uncaught exceptions
  // Returning true will surpress the default browser handler,
  // returning false will let it run.
  window.onerror = function ( error, filePath, linerNr ) {
  	var ret = false;
  	if ( onErrorFnPrev ) {
  		ret = onErrorFnPrev( error, filePath, linerNr );
  	}
  
  	// Treat return value as window.onerror itself does,
  	// Only do our handling if not surpressed.
  	if ( ret !== true ) {
  		if ( QUnit.config.current ) {
  			if ( QUnit.config.current.ignoreGlobalErrors ) {
  				return true;
  			}
  			QUnit.pushFailure( error, filePath + ":" + linerNr );
  		} else {
  			QUnit.test( "global failure", extend( function() {
  				QUnit.pushFailure( error, filePath + ":" + linerNr );
  			}, { validTest: validTest } ) );
  		}
  		return false;
  	}
  
  	return ret;
  };
  
  function done() {
  	config.autorun = true;
  
  	// Log the last module results
  	if ( config.currentModule ) {
  		runLoggingCallbacks( "moduleDone", QUnit, {
  			name: config.currentModule,
  			failed: config.moduleStats.bad,
  			passed: config.moduleStats.all - config.moduleStats.bad,
  			total: config.moduleStats.all
  		});
  	}
  
  	var i, key,
  		banner = id( "qunit-banner" ),
  		tests = id( "qunit-tests" ),
  		runtime = +new Date() - config.started,
  		passed = config.stats.all - config.stats.bad,
  		html = [
  			"Tests completed in ",
  			runtime,
  			" milliseconds.<br/>",
  			"<span class='passed'>",
  			passed,
  			"</span> assertions of <span class='total'>",
  			config.stats.all,
  			"</span> passed, <span class='failed'>",
  			config.stats.bad,
  			"</span> failed."
  		].join( "" );
  
  	if ( banner ) {
  		banner.className = ( config.stats.bad ? "qunit-fail" : "qunit-pass" );
  	}
  
  	if ( tests ) {
  		id( "qunit-testresult" ).innerHTML = html;
  	}
  
  	if ( config.altertitle && typeof document !== "undefined" && document.title ) {
  		// show ✖ for good, ✔ for bad suite result in title
  		// use escape sequences in case file gets loaded with non-utf-8-charset
  		document.title = [
  			( config.stats.bad ? "\u2716" : "\u2714" ),
  			document.title.replace( /^[\u2714\u2716] /i, "" )
  		].join( " " );
  	}
  
  	// clear own sessionStorage items if all tests passed
  	if ( config.reorder && defined.sessionStorage && config.stats.bad === 0 ) {
  		// `key` & `i` initialized at top of scope
  		for ( i = 0; i < sessionStorage.length; i++ ) {
  			key = sessionStorage.key( i++ );
  			if ( key.indexOf( "qunit-test-" ) === 0 ) {
  				sessionStorage.removeItem( key );
  			}
  		}
  	}
  
  	// scroll back to top to show results
  	if ( window.scrollTo ) {
  		window.scrollTo(0, 0);
  	}
  
  	runLoggingCallbacks( "done", QUnit, {
  		failed: config.stats.bad,
  		passed: passed,
  		total: config.stats.all,
  		runtime: runtime
  	});
  }
  
  /** @return Boolean: true if this test should be ran */
  function validTest( test ) {
  	var include,
  		filter = config.filter && config.filter.toLowerCase(),
  		module = config.module && config.module.toLowerCase(),
  		fullName = (test.module + ": " + test.testName).toLowerCase();
  
  	// Internally-generated tests are always valid
  	if ( test.callback && test.callback.validTest === validTest ) {
  		delete test.callback.validTest;
  		return true;
  	}
  
  	if ( config.testNumber ) {
  		return test.testNumber === config.testNumber;
  	}
  
  	if ( module && ( !test.module || test.module.toLowerCase() !== module ) ) {
  		return false;
  	}
  
  	if ( !filter ) {
  		return true;
  	}
  
  	include = filter.charAt( 0 ) !== "!";
  	if ( !include ) {
  		filter = filter.slice( 1 );
  	}
  
  	// If the filter matches, we need to honour include
  	if ( fullName.indexOf( filter ) !== -1 ) {
  		return include;
  	}
  
  	// Otherwise, do the opposite
  	return !include;
  }
  
  // so far supports only Firefox, Chrome and Opera (buggy), Safari (for real exceptions)
  // Later Safari and IE10 are supposed to support error.stack as well
  // See also https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Error/Stack
  function extractStacktrace( e, offset ) {
  	offset = offset === undefined ? 3 : offset;
  
  	var stack, include, i;
  
  	if ( e.stacktrace ) {
  		// Opera
  		return e.stacktrace.split( "\n" )[ offset + 3 ];
  	} else if ( e.stack ) {
  		// Firefox, Chrome
  		stack = e.stack.split( "\n" );
  		if (/^error$/i.test( stack[0] ) ) {
  			stack.shift();
  		}
  		if ( fileName ) {
  			include = [];
  			for ( i = offset; i < stack.length; i++ ) {
  				if ( stack[ i ].indexOf( fileName ) !== -1 ) {
  					break;
  				}
  				include.push( stack[ i ] );
  			}
  			if ( include.length ) {
  				return include.join( "\n" );
  			}
  		}
  		return stack[ offset ];
  	} else if ( e.sourceURL ) {
  		// Safari, PhantomJS
  		// hopefully one day Safari provides actual stacktraces
  		// exclude useless self-reference for generated Error objects
  		if ( /qunit.js$/.test( e.sourceURL ) ) {
  			return;
  		}
  		// for actual exceptions, this is useful
  		return e.sourceURL + ":" + e.line;
  	}
  }
  function sourceFromStacktrace( offset ) {
  	try {
  		throw new Error();
  	} catch ( e ) {
  		return extractStacktrace( e, offset );
  	}
  }
  
  /**
   * Escape text for attribute or text content.
   */
  function escapeText( s ) {
  	if ( !s ) {
  		return "";
  	}
  	s = s + "";
  	// Both single quotes and double quotes (for attributes)
  	return s.replace( /['"<>&]/g, function( s ) {
  		switch( s ) {
  			case '\'':
  				return '&#039;';
  			case '"':
  				return '&quot;';
  			case '<':
  				return '&lt;';
  			case '>':
  				return '&gt;';
  			case '&':
  				return '&amp;';
  		}
  	});
  }
  
  function synchronize( callback, last ) {
  	config.queue.push( callback );
  
  	if ( config.autorun && !config.blocking ) {
  		process( last );
  	}
  }
  
  function process( last ) {
  	function next() {
  		process( last );
  	}
  	var start = new Date().getTime();
  	config.depth = config.depth ? config.depth + 1 : 1;
  
  	while ( config.queue.length && !config.blocking ) {
  		if ( !defined.setTimeout || config.updateRate <= 0 || ( ( new Date().getTime() - start ) < config.updateRate ) ) {
  			config.queue.shift()();
  		} else {
  			window.setTimeout( next, 13 );
  			break;
  		}
  	}
  	config.depth--;
  	if ( last && !config.blocking && !config.queue.length && config.depth === 0 ) {
  		done();
  	}
  }
  
  function saveGlobal() {
  	config.pollution = [];
  
  	if ( config.noglobals ) {
  		for ( var key in window ) {
  			// in Opera sometimes DOM element ids show up here, ignore them
  			if ( !hasOwn.call( window, key ) || /^qunit-test-output/.test( key ) ) {
  				continue;
  			}
  			config.pollution.push( key );
  		}
  	}
  }
  
  function checkPollution() {
  	var newGlobals,
  		deletedGlobals,
  		old = config.pollution;
  
  	saveGlobal();
  
  	newGlobals = diff( config.pollution, old );
  	if ( newGlobals.length > 0 ) {
  		QUnit.pushFailure( "Introduced global variable(s): " + newGlobals.join(", ") );
  	}
  
  	deletedGlobals = diff( old, config.pollution );
  	if ( deletedGlobals.length > 0 ) {
  		QUnit.pushFailure( "Deleted global variable(s): " + deletedGlobals.join(", ") );
  	}
  }
  
  // returns a new Array with the elements that are in a but not in b
  function diff( a, b ) {
  	var i, j,
  		result = a.slice();
  
  	for ( i = 0; i < result.length; i++ ) {
  		for ( j = 0; j < b.length; j++ ) {
  			if ( result[i] === b[j] ) {
  				result.splice( i, 1 );
  				i--;
  				break;
  			}
  		}
  	}
  	return result;
  }
  
  function extend( a, b ) {
  	for ( var prop in b ) {
  		if ( b[ prop ] === undefined ) {
  			delete a[ prop ];
  
  		// Avoid "Member not found" error in IE8 caused by setting window.constructor
  		} else if ( prop !== "constructor" || a !== window ) {
  			a[ prop ] = b[ prop ];
  		}
  	}
  
  	return a;
  }
  
  /**
   * @param {HTMLElement} elem
   * @param {string} type
   * @param {Function} fn
   */
  function addEvent( elem, type, fn ) {
  	// Standards-based browsers
  	if ( elem.addEventListener ) {
  		elem.addEventListener( type, fn, false );
  	// IE
  	} else {
  		elem.attachEvent( "on" + type, fn );
  	}
  }
  
  /**
   * @param {Array|NodeList} elems
   * @param {string} type
   * @param {Function} fn
   */
  function addEvents( elems, type, fn ) {
  	var i = elems.length;
  	while ( i-- ) {
  		addEvent( elems[i], type, fn );
  	}
  }
  
  function hasClass( elem, name ) {
  	return (" " + elem.className + " ").indexOf(" " + name + " ") > -1;
  }
  
  function addClass( elem, name ) {
  	if ( !hasClass( elem, name ) ) {
  		elem.className += (elem.className ? " " : "") + name;
  	}
  }
  
  function removeClass( elem, name ) {
  	var set = " " + elem.className + " ";
  	// Class name may appear multiple times
  	while ( set.indexOf(" " + name + " ") > -1 ) {
  		set = set.replace(" " + name + " " , " ");
  	}
  	// If possible, trim it for prettiness, but not neccecarily
  	elem.className = window.jQuery ? jQuery.trim( set ) : ( set.trim ? set.trim() : set );
  }
  
  function id( name ) {
  	return !!( typeof document !== "undefined" && document && document.getElementById ) &&
  		document.getElementById( name );
  }
  
  function registerLoggingCallback( key ) {
  	return function( callback ) {
  		config[key].push( callback );
  	};
  }
  
  // Supports deprecated method of completely overwriting logging callbacks
  function runLoggingCallbacks( key, scope, args ) {
  	var i, callbacks;
  	if ( QUnit.hasOwnProperty( key ) ) {
  		QUnit[ key ].call(scope, args );
  	} else {
  		callbacks = config[ key ];
  		for ( i = 0; i < callbacks.length; i++ ) {
  			callbacks[ i ].call( scope, args );
  		}
  	}
  }
  
  // Test for equality any JavaScript type.
  // Author: Philippe Rathé <prathe@gmail.com>
  QUnit.equiv = (function() {
  
  	// Call the o related callback with the given arguments.
  	function bindCallbacks( o, callbacks, args ) {
  		var prop = QUnit.objectType( o );
  		if ( prop ) {
  			if ( QUnit.objectType( callbacks[ prop ] ) === "function" ) {
  				return callbacks[ prop ].apply( callbacks, args );
  			} else {
  				return callbacks[ prop ]; // or undefined
  			}
  		}
  	}
  
  	// the real equiv function
  	var innerEquiv,
  		// stack to decide between skip/abort functions
  		callers = [],
  		// stack to avoiding loops from circular referencing
  		parents = [],
  
  		getProto = Object.getPrototypeOf || function ( obj ) {
  			return obj.__proto__;
  		},
  		callbacks = (function () {
  
  			// for string, boolean, number and null
  			function useStrictEquality( b, a ) {
  				/*jshint eqeqeq:false */
  				if ( b instanceof a.constructor || a instanceof b.constructor ) {
  					// to catch short annotaion VS 'new' annotation of a
  					// declaration
  					// e.g. var i = 1;
  					// var j = new Number(1);
  					return a == b;
  				} else {
  					return a === b;
  				}
  			}
  
  			return {
  				"string": useStrictEquality,
  				"boolean": useStrictEquality,
  				"number": useStrictEquality,
  				"null": useStrictEquality,
  				"undefined": useStrictEquality,
  
  				"nan": function( b ) {
  					return isNaN( b );
  				},
  
  				"date": function( b, a ) {
  					return QUnit.objectType( b ) === "date" && a.valueOf() === b.valueOf();
  				},
  
  				"regexp": function( b, a ) {
  					return QUnit.objectType( b ) === "regexp" &&
  						// the regex itself
  						a.source === b.source &&
  						// and its modifers
  						a.global === b.global &&
  						// (gmi) ...
  						a.ignoreCase === b.ignoreCase &&
  						a.multiline === b.multiline &&
  						a.sticky === b.sticky;
  				},
  
  				// - skip when the property is a method of an instance (OOP)
  				// - abort otherwise,
  				// initial === would have catch identical references anyway
  				"function": function() {
  					var caller = callers[callers.length - 1];
  					return caller !== Object && typeof caller !== "undefined";
  				},
  
  				"array": function( b, a ) {
  					var i, j, len, loop;
  
  					// b could be an object literal here
  					if ( QUnit.objectType( b ) !== "array" ) {
  						return false;
  					}
  
  					len = a.length;
  					if ( len !== b.length ) {
  						// safe and faster
  						return false;
  					}
  
  					// track reference to avoid circular references
  					parents.push( a );
  					for ( i = 0; i < len; i++ ) {
  						loop = false;
  						for ( j = 0; j < parents.length; j++ ) {
  							if ( parents[j] === a[i] ) {
  								loop = true;// dont rewalk array
  							}
  						}
  						if ( !loop && !innerEquiv(a[i], b[i]) ) {
  							parents.pop();
  							return false;
  						}
  					}
  					parents.pop();
  					return true;
  				},
  
  				"object": function( b, a ) {
  					var i, j, loop,
  						// Default to true
  						eq = true,
  						aProperties = [],
  						bProperties = [];
  
  					// comparing constructors is more strict than using
  					// instanceof
  					if ( a.constructor !== b.constructor ) {
  						// Allow objects with no prototype to be equivalent to
  						// objects with Object as their constructor.
  						if ( !(( getProto(a) === null && getProto(b) === Object.prototype ) ||
  							( getProto(b) === null && getProto(a) === Object.prototype ) ) ) {
  								return false;
  						}
  					}
  
  					// stack constructor before traversing properties
  					callers.push( a.constructor );
  					// track reference to avoid circular references
  					parents.push( a );
  
  					for ( i in a ) { // be strict: don't ensures hasOwnProperty
  									// and go deep
  						loop = false;
  						for ( j = 0; j < parents.length; j++ ) {
  							if ( parents[j] === a[i] ) {
  								// don't go down the same path twice
  								loop = true;
  							}
  						}
  						aProperties.push(i); // collect a's properties
  
  						if (!loop && !innerEquiv( a[i], b[i] ) ) {
  							eq = false;
  							break;
  						}
  					}
  
  					callers.pop(); // unstack, we are done
  					parents.pop();
  
  					for ( i in b ) {
  						bProperties.push( i ); // collect b's properties
  					}
  
  					// Ensures identical properties name
  					return eq && innerEquiv( aProperties.sort(), bProperties.sort() );
  				}
  			};
  		}());
  
  	innerEquiv = function() { // can take multiple arguments
  		var args = [].slice.apply( arguments );
  		if ( args.length < 2 ) {
  			return true; // end transition
  		}
  
  		return (function( a, b ) {
  			if ( a === b ) {
  				return true; // catch the most you can
  			} else if ( a === null || b === null || typeof a === "undefined" ||
  					typeof b === "undefined" ||
  					QUnit.objectType(a) !== QUnit.objectType(b) ) {
  				return false; // don't lose time with error prone cases
  			} else {
  				return bindCallbacks(a, callbacks, [ b, a ]);
  			}
  
  			// apply transition with (1..n) arguments
  		}( args[0], args[1] ) && arguments.callee.apply( this, args.splice(1, args.length - 1 )) );
  	};
  
  	return innerEquiv;
  }());
  
  /**
   * jsDump Copyright (c) 2008 Ariel Flesler - aflesler(at)gmail(dot)com |
   * http://flesler.blogspot.com Licensed under BSD
   * (http://www.opensource.org/licenses/bsd-license.php) Date: 5/15/2008
   *
   * @projectDescription Advanced and extensible data dumping for Javascript.
   * @version 1.0.0
   * @author Ariel Flesler
   * @link {http://flesler.blogspot.com/2008/05/jsdump-pretty-dump-of-any-javascript.html}
   */
  QUnit.jsDump = (function() {
  	function quote( str ) {
  		return '"' + str.toString().replace( /"/g, '\\"' ) + '"';
  	}
  	function literal( o ) {
  		return o + "";
  	}
  	function join( pre, arr, post ) {
  		var s = jsDump.separator(),
  			base = jsDump.indent(),
  			inner = jsDump.indent(1);
  		if ( arr.join ) {
  			arr = arr.join( "," + s + inner );
  		}
  		if ( !arr ) {
  			return pre + post;
  		}
  		return [ pre, inner + arr, base + post ].join(s);
  	}
  	function array( arr, stack ) {
  		var i = arr.length, ret = new Array(i);
  		this.up();
  		while ( i-- ) {
  			ret[i] = this.parse( arr[i] , undefined , stack);
  		}
  		this.down();
  		return join( "[", ret, "]" );
  	}
  
  	var reName = /^function (\w+)/,
  		jsDump = {
  			// type is used mostly internally, you can fix a (custom)type in advance
  			parse: function( obj, type, stack ) {
  				stack = stack || [ ];
  				var inStack, res,
  					parser = this.parsers[ type || this.typeOf(obj) ];
  
  				type = typeof parser;
  				inStack = inArray( obj, stack );
  
  				if ( inStack !== -1 ) {
  					return "recursion(" + (inStack - stack.length) + ")";
  				}
  				if ( type === "function" )  {
  					stack.push( obj );
  					res = parser.call( this, obj, stack );
  					stack.pop();
  					return res;
  				}
  				return ( type === "string" ) ? parser : this.parsers.error;
  			},
  			typeOf: function( obj ) {
  				var type;
  				if ( obj === null ) {
  					type = "null";
  				} else if ( typeof obj === "undefined" ) {
  					type = "undefined";
  				} else if ( QUnit.is( "regexp", obj) ) {
  					type = "regexp";
  				} else if ( QUnit.is( "date", obj) ) {
  					type = "date";
  				} else if ( QUnit.is( "function", obj) ) {
  					type = "function";
  				} else if ( typeof obj.setInterval !== undefined && typeof obj.document !== "undefined" && typeof obj.nodeType === "undefined" ) {
  					type = "window";
  				} else if ( obj.nodeType === 9 ) {
  					type = "document";
  				} else if ( obj.nodeType ) {
  					type = "node";
  				} else if (
  					// native arrays
  					toString.call( obj ) === "[object Array]" ||
  					// NodeList objects
  					( typeof obj.length === "number" && typeof obj.item !== "undefined" && ( obj.length ? obj.item(0) === obj[0] : ( obj.item( 0 ) === null && typeof obj[0] === "undefined" ) ) )
  				) {
  					type = "array";
  				} else if ( obj.constructor === Error.prototype.constructor ) {
  					type = "error";
  				} else {
  					type = typeof obj;
  				}
  				return type;
  			},
  			separator: function() {
  				return this.multiline ?	this.HTML ? "<br />" : "\n" : this.HTML ? "&nbsp;" : " ";
  			},
  			// extra can be a number, shortcut for increasing-calling-decreasing
  			indent: function( extra ) {
  				if ( !this.multiline ) {
  					return "";
  				}
  				var chr = this.indentChar;
  				if ( this.HTML ) {
  					chr = chr.replace( /\t/g, "   " ).replace( / /g, "&nbsp;" );
  				}
  				return new Array( this._depth_ + (extra||0) ).join(chr);
  			},
  			up: function( a ) {
  				this._depth_ += a || 1;
  			},
  			down: function( a ) {
  				this._depth_ -= a || 1;
  			},
  			setParser: function( name, parser ) {
  				this.parsers[name] = parser;
  			},
  			// The next 3 are exposed so you can use them
  			quote: quote,
  			literal: literal,
  			join: join,
  			//
  			_depth_: 1,
  			// This is the list of parsers, to modify them, use jsDump.setParser
  			parsers: {
  				window: "[Window]",
  				document: "[Document]",
  				error: function(error) {
  					return "Error(\"" + error.message + "\")";
  				},
  				unknown: "[Unknown]",
  				"null": "null",
  				"undefined": "undefined",
  				"function": function( fn ) {
  					var ret = "function",
  						// functions never have name in IE
  						name = "name" in fn ? fn.name : (reName.exec(fn) || [])[1];
  
  					if ( name ) {
  						ret += " " + name;
  					}
  					ret += "( ";
  
  					ret = [ ret, QUnit.jsDump.parse( fn, "functionArgs" ), "){" ].join( "" );
  					return join( ret, QUnit.jsDump.parse(fn,"functionCode" ), "}" );
  				},
  				array: array,
  				nodelist: array,
  				"arguments": array,
  				object: function( map, stack ) {
  					var ret = [ ], keys, key, val, i;
  					QUnit.jsDump.up();
  					keys = [];
  					for ( key in map ) {
  						keys.push( key );
  					}
  					keys.sort();
  					for ( i = 0; i < keys.length; i++ ) {
  						key = keys[ i ];
  						val = map[ key ];
  						ret.push( QUnit.jsDump.parse( key, "key" ) + ": " + QUnit.jsDump.parse( val, undefined, stack ) );
  					}
  					QUnit.jsDump.down();
  					return join( "{", ret, "}" );
  				},
  				node: function( node ) {
  					var len, i, val,
  						open = QUnit.jsDump.HTML ? "&lt;" : "<",
  						close = QUnit.jsDump.HTML ? "&gt;" : ">",
  						tag = node.nodeName.toLowerCase(),
  						ret = open + tag,
  						attrs = node.attributes;
  
  					if ( attrs ) {
  						for ( i = 0, len = attrs.length; i < len; i++ ) {
  							val = attrs[i].nodeValue;
  							// IE6 includes all attributes in .attributes, even ones not explicitly set.
  							// Those have values like undefined, null, 0, false, "" or "inherit".
  							if ( val && val !== "inherit" ) {
  								ret += " " + attrs[i].nodeName + "=" + QUnit.jsDump.parse( val, "attribute" );
  							}
  						}
  					}
  					ret += close;
  
  					// Show content of TextNode or CDATASection
  					if ( node.nodeType === 3 || node.nodeType === 4 ) {
  						ret += node.nodeValue;
  					}
  
  					return ret + open + "/" + tag + close;
  				},
  				// function calls it internally, it's the arguments part of the function
  				functionArgs: function( fn ) {
  					var args,
  						l = fn.length;
  
  					if ( !l ) {
  						return "";
  					}
  
  					args = new Array(l);
  					while ( l-- ) {
  						// 97 is 'a'
  						args[l] = String.fromCharCode(97+l);
  					}
  					return " " + args.join( ", " ) + " ";
  				},
  				// object calls it internally, the key part of an item in a map
  				key: quote,
  				// function calls it internally, it's the content of the function
  				functionCode: "[code]",
  				// node calls it internally, it's an html attribute value
  				attribute: quote,
  				string: quote,
  				date: quote,
  				regexp: literal,
  				number: literal,
  				"boolean": literal
  			},
  			// if true, entities are escaped ( <, >, \t, space and \n )
  			HTML: false,
  			// indentation unit
  			indentChar: "  ",
  			// if true, items in a collection, are separated by a \n, else just a space.
  			multiline: true
  		};
  
  	return jsDump;
  }());
  
  // from jquery.js
  function inArray( elem, array ) {
  	if ( array.indexOf ) {
  		return array.indexOf( elem );
  	}
  
  	for ( var i = 0, length = array.length; i < length; i++ ) {
  		if ( array[ i ] === elem ) {
  			return i;
  		}
  	}
  
  	return -1;
  }
  
  /*
   * Javascript Diff Algorithm
   *  By John Resig (http://ejohn.org/)
   *  Modified by Chu Alan "sprite"
   *
   * Released under the MIT license.
   *
   * More Info:
   *  http://ejohn.org/projects/javascript-diff-algorithm/
   *
   * Usage: QUnit.diff(expected, actual)
   *
   * QUnit.diff( "the quick brown fox jumped over", "the quick fox jumps over" ) == "the  quick <del>brown </del> fox <del>jumped </del><ins>jumps </ins> over"
   */
  QUnit.diff = (function() {
  	/*jshint eqeqeq:false, eqnull:true */
  	function diff( o, n ) {
  		var i,
  			ns = {},
  			os = {};
  
  		for ( i = 0; i < n.length; i++ ) {
  			if ( !hasOwn.call( ns, n[i] ) ) {
  				ns[ n[i] ] = {
  					rows: [],
  					o: null
  				};
  			}
  			ns[ n[i] ].rows.push( i );
  		}
  
  		for ( i = 0; i < o.length; i++ ) {
  			if ( !hasOwn.call( os, o[i] ) ) {
  				os[ o[i] ] = {
  					rows: [],
  					n: null
  				};
  			}
  			os[ o[i] ].rows.push( i );
  		}
  
  		for ( i in ns ) {
  			if ( !hasOwn.call( ns, i ) ) {
  				continue;
  			}
  			if ( ns[i].rows.length === 1 && hasOwn.call( os, i ) && os[i].rows.length === 1 ) {
  				n[ ns[i].rows[0] ] = {
  					text: n[ ns[i].rows[0] ],
  					row: os[i].rows[0]
  				};
  				o[ os[i].rows[0] ] = {
  					text: o[ os[i].rows[0] ],
  					row: ns[i].rows[0]
  				};
  			}
  		}
  
  		for ( i = 0; i < n.length - 1; i++ ) {
  			if ( n[i].text != null && n[ i + 1 ].text == null && n[i].row + 1 < o.length && o[ n[i].row + 1 ].text == null &&
  						n[ i + 1 ] == o[ n[i].row + 1 ] ) {
  
  				n[ i + 1 ] = {
  					text: n[ i + 1 ],
  					row: n[i].row + 1
  				};
  				o[ n[i].row + 1 ] = {
  					text: o[ n[i].row + 1 ],
  					row: i + 1
  				};
  			}
  		}
  
  		for ( i = n.length - 1; i > 0; i-- ) {
  			if ( n[i].text != null && n[ i - 1 ].text == null && n[i].row > 0 && o[ n[i].row - 1 ].text == null &&
  						n[ i - 1 ] == o[ n[i].row - 1 ]) {
  
  				n[ i - 1 ] = {
  					text: n[ i - 1 ],
  					row: n[i].row - 1
  				};
  				o[ n[i].row - 1 ] = {
  					text: o[ n[i].row - 1 ],
  					row: i - 1
  				};
  			}
  		}
  
  		return {
  			o: o,
  			n: n
  		};
  	}
  
  	return function( o, n ) {
  		o = o.replace( /\s+$/, "" );
  		n = n.replace( /\s+$/, "" );
  
  		var i, pre,
  			str = "",
  			out = diff( o === "" ? [] : o.split(/\s+/), n === "" ? [] : n.split(/\s+/) ),
  			oSpace = o.match(/\s+/g),
  			nSpace = n.match(/\s+/g);
  
  		if ( oSpace == null ) {
  			oSpace = [ " " ];
  		}
  		else {
  			oSpace.push( " " );
  		}
  
  		if ( nSpace == null ) {
  			nSpace = [ " " ];
  		}
  		else {
  			nSpace.push( " " );
  		}
  
  		if ( out.n.length === 0 ) {
  			for ( i = 0; i < out.o.length; i++ ) {
  				str += "<del>" + out.o[i] + oSpace[i] + "</del>";
  			}
  		}
  		else {
  			if ( out.n[0].text == null ) {
  				for ( n = 0; n < out.o.length && out.o[n].text == null; n++ ) {
  					str += "<del>" + out.o[n] + oSpace[n] + "</del>";
  				}
  			}
  
  			for ( i = 0; i < out.n.length; i++ ) {
  				if (out.n[i].text == null) {
  					str += "<ins>" + out.n[i] + nSpace[i] + "</ins>";
  				}
  				else {
  					// `pre` initialized at top of scope
  					pre = "";
  
  					for ( n = out.n[i].row + 1; n < out.o.length && out.o[n].text == null; n++ ) {
  						pre += "<del>" + out.o[n] + oSpace[n] + "</del>";
  					}
  					str += " " + out.n[i].text + nSpace[i] + pre;
  				}
  			}
  		}
  
  		return str;
  	};
  }());
  
  // for CommonJS enviroments, export everything
  if ( typeof exports !== "undefined" ) {
  	extend( exports, QUnit );
  }
  
  // get at whatever the global object is, like window in browsers
  }( (function() {return this;}.call()) ));
  

});

define('public/lib/mod/lib/UserAction', function(require, exports, module) {

  var UserAction = 
  /**
   * 用例中常用方法的集合
   * 
   * @author bellcliff
   * @type UserAction
   */
  {
      beforedispatch : null,
      isf /* is function ? */: function(value) {
          return value && (typeof value == 'function');
      },
      isb /* is boolean? */: function(value) {
          return value && (typeof value == 'boolean');
      },
      iso /* is object? */: function(value) {
          return value && (typeof value == 'object');
      },
      iss /* is string? */: function(value) {
          return value && (typeof value == 'string');
      },
      isn /* is number? */: function(value) {
          return value && (typeof value == 'number');
      },
      // --------------------------------------------------------------------------
      // Generic event methods
      // --------------------------------------------------------------------------
  
      /**
       * Simulates a key event using the given event information to populate the
       * generated event object. This method does browser-equalizing calculations
       * to account for differences in the DOM and IE event models as well as
       * different browser quirks. Note: keydown causes Safari 2.x to crash.
       * 
       * @method simulateKeyEvent
       * @private
       * @static
       * @param {HTMLElement}
       *            target The target of the given event.
       * @param {String}
       *            type The type of event to fire. This can be any one of the
       *            following: keyup, keydown, and keypress.
       * @param {Boolean}
       *            bubbles (Optional) Indicates if the event can be bubbled up.
       *            DOM Level 3 specifies that all key events bubble by default.
       *            The default is true.
       * @param {Boolean}
       *            cancelable (Optional) Indicates if the event can be canceled
       *            using preventDefault(). DOM Level 3 specifies that all key
       *            events can be cancelled. The default is true.
       * @param {Window}
       *            view (Optional) The view containing the target. This is
       *            typically the window object. The default is window.
       * @param {Boolean}
       *            ctrlKey (Optional) Indicates if one of the CTRL keys is
       *            pressed while the event is firing. The default is false.
       * @param {Boolean}
       *            altKey (Optional) Indicates if one of the ALT keys is pressed
       *            while the event is firing. The default is false.
       * @param {Boolean}
       *            shiftKey (Optional) Indicates if one of the SHIFT keys is
       *            pressed while the event is firing. The default is false.
       * @param {Boolean}
       *            metaKey (Optional) Indicates if one of the META keys is
       *            pressed while the event is firing. The default is false.
       * @param {int}
       *            keyCode (Optional) The code for the key that is in use. The
       *            default is 0.
       * @param {int}
       *            charCode (Optional) The Unicode code for the character
       *            associated with the key being used. The default is 0.
       */
      simulateKeyEvent : function(target /* :HTMLElement */,
              type /* :String */, bubbles /* :Boolean */,
              cancelable /* :Boolean */, view /* :Window */,
              ctrlKey /* :Boolean */, altKey /* :Boolean */,
              shiftKey /* :Boolean */, metaKey /* :Boolean */,
              keyCode /* :int */, charCode /* :int */) /* :Void */
      {
          // check target
          target = typeof target == 'string' ? document.getElementById(target)
                  : target;
          if (!target) {
              throw new Error("simulateKeyEvent(): Invalid target.");
          }
  
          // check event type
          if (typeof type == 'string') {
              type = type.toLowerCase();
              switch (type) {
              case "keyup":
              case "keydown":
              case "keypress":
                  break;
              case "textevent": // DOM Level 3
                  type = "keypress";
                  break;
              // @TODO was the fallthrough intentional, if so throw error
              default:
                  throw new Error("simulateKeyEvent(): Event type '" + type
                          + "' not supported.");
              }
          } else {
              throw new Error("simulateKeyEvent(): Event type must be a string.");
          }
  
          // setup default values
          if (!this.isb(bubbles)) {
              bubbles = true; // all key events bubble
          }
          if (!this.isb(cancelable)) {
              cancelable = true; // all key events can be cancelled
          }
          if (!this.iso(view)) {
              view = window; // view is typically window
          }
          if (!this.isb(ctrlKey)) {
              ctrlKey = false;
          }
          if (!this.isb(typeof altKey == 'boolean')) {
              altKey = false;
          }
          if (!this.isb(shiftKey)) {
              shiftKey = false;
          }
          if (!this.isb(metaKey)) {
              metaKey = false;
          }
          if (!(typeof keyCode == 'number')) {
              keyCode = 0;
          }
          if (!(typeof charCode == 'number')) {
              charCode = 0;
          }
  
          // try to create a mouse event
          var customEvent /* :MouseEvent */= null;
  
          // check for DOM-compliant browsers first
          if (this.isf(document.createEvent)) {
  
              try {
  
                  // try to create key event
                  customEvent = document.createEvent("KeyEvents");
  
                  /*
                   * Interesting problem: Firefox implemented a non-standard
                   * version of initKeyEvent() based on DOM Level 2 specs. Key
                   * event was removed from DOM Level 2 and re-introduced in DOM
                   * Level 3 with a different interface. Firefox is the only
                   * browser with any implementation of Key Events, so for now,
                   * assume it's Firefox if the above line doesn't error.
                   */
                  // TODO: Decipher between Firefox's implementation and a correct
                  // one.
                  customEvent.initKeyEvent(type, bubbles, cancelable, view,
                          ctrlKey, altKey, shiftKey, metaKey, keyCode, charCode);
  
              } catch (ex /* :Error */) {
  
                  /*
                   * If it got here, that means key events aren't officially
                   * supported. Safari/WebKit is a real problem now. WebKit 522
                   * won't let you set keyCode, charCode, or other properties if
                   * you use a UIEvent, so we first must try to create a generic
                   * event. The fun part is that this will throw an error on
                   * Safari 2.x. The end result is that we need another
                   * try...catch statement just to deal with this mess.
                   */
                  try {
  
                      // try to create generic event - will fail in Safari 2.x
                      customEvent = document.createEvent("Events");
  
                  } catch (uierror /* :Error */) {
  
                      // the above failed, so create a UIEvent for Safari 2.x
                      customEvent = document.createEvent("UIEvents");
  
                  } finally {
  
                      customEvent.initEvent(type, bubbles, cancelable);
  
                      // initialize
                      customEvent.view = view;
                      customEvent.altKey = altKey;
                      customEvent.ctrlKey = ctrlKey;
                      customEvent.shiftKey = shiftKey;
                      customEvent.metaKey = metaKey;
                      customEvent.keyCode = keyCode;
                      customEvent.charCode = charCode;
  
                  }
  
              }
              
              // before dispatch
              if (this.beforedispatch && typeof this.beforedispatch == 'function')
                  this.beforedispatch(customEvent);
              this.beforedispatch = null;
  
              // fire the event
              target.dispatchEvent(customEvent);
  
          } else if (this.iso(document.createEventObject)) { // IE
  
              // create an IE event object
              customEvent = document.createEventObject();
  
              // assign available properties
              customEvent.bubbles = bubbles;
              customEvent.cancelable = cancelable;
              customEvent.view = view;
              customEvent.ctrlKey = ctrlKey;
              customEvent.altKey = altKey;
              customEvent.shiftKey = shiftKey;
              customEvent.metaKey = metaKey;
  
              /*
               * IE doesn't support charCode explicitly. CharCode should take
               * precedence over any keyCode value for accurate representation.
               */
              customEvent.keyCode = (charCode > 0) ? charCode : keyCode;
  
              // before dispatch
              if (this.beforedispatch && typeof this.beforedispatch == 'function')
                  this.beforedispatch(customEvent);
              this.beforedispatch = null;
              
              // fire the event
              target.fireEvent("on" + type, customEvent);
  
          } else {
              throw new Error(
                      "simulateKeyEvent(): No event simulation framework present.");
          }
          
          this.beforedispatch = null;
      },
  
      /**
       * Simulates a mouse event using the given event information to populate the
       * generated event object. This method does browser-equalizing calculations
       * to account for differences in the DOM and IE event models as well as
       * different browser quirks.
       * 
       * @method simulateMouseEvent
       * @private
       * @static
       * @param {HTMLElement}
       *            target The target of the given event.
       * @param {String}
       *            type The type of event to fire. This can be any one of the
       *            following: click, dblclick, mousedown, mouseup, mouseout,
       *            mouseover, and mousemove.
       * @param {Boolean}
       *            bubbles (Optional) Indicates if the event can be bubbled up.
       *            DOM Level 2 specifies that all mouse events bubble by default.
       *            The default is true.
       * @param {Boolean}
       *            cancelable (Optional) Indicates if the event can be canceled
       *            using preventDefault(). DOM Level 2 specifies that all mouse
       *            events except mousemove can be cancelled. The default is true
       *            for all events except mousemove, for which the default is
       *            false.
       * @param {Window}
       *            view (Optional) The view containing the target. This is
       *            typically the window object. The default is window.
       * @param {int}
       *            detail (Optional) The number of times the mouse button has
       *            been used. The default value is 1.
       * @param {int}
       *            screenX (Optional) The x-coordinate on the screen at which
       *            point the event occured. The default is 0.
       * @param {int}
       *            screenY (Optional) The y-coordinate on the screen at which
       *            point the event occured. The default is 0.
       * @param {int}
       *            clientX (Optional) The x-coordinate on the client at which
       *            point the event occured. The default is 0.
       * @param {int}
       *            clientY (Optional) The y-coordinate on the client at which
       *            point the event occured. The default is 0.
       * @param {Boolean}
       *            ctrlKey (Optional) Indicates if one of the CTRL keys is
       *            pressed while the event is firing. The default is false.
       * @param {Boolean}
       *            altKey (Optional) Indicates if one of the ALT keys is pressed
       *            while the event is firing. The default is false.
       * @param {Boolean}
       *            shiftKey (Optional) Indicates if one of the SHIFT keys is
       *            pressed while the event is firing. The default is false.
       * @param {Boolean}
       *            metaKey (Optional) Indicates if one of the META keys is
       *            pressed while the event is firing. The default is false.
       * @param {int}
       *            button (Optional) The button being pressed while the event is
       *            executing. The value should be 0 for the primary mouse button
       *            (typically the left button), 1 for the terciary mouse button
       *            (typically the middle button), and 2 for the secondary mouse
       *            button (typically the right button). The default is 0.
       * @param {HTMLElement}
       *            relatedTarget (Optional) For mouseout events, this is the
       *            element that the mouse has moved to. For mouseover events,
       *            this is the element that the mouse has moved from. This
       *            argument is ignored for all other events. The default is null.
       */
      simulateMouseEvent : function(target /* :HTMLElement */,
              type /* :String */, bubbles /* :Boolean */,
              cancelable /* :Boolean */, view /* :Window */,
              detail /* :int */, wheelDelta /* :int */, screenX /* :int */, screenY /* :int */,
              clientX /* :int */, clientY /* :int */, ctrlKey /* :Boolean */,
              altKey /* :Boolean */, shiftKey /* :Boolean */,
              metaKey /* :Boolean */, button /* :int */, relatedTarget /* :HTMLElement */) /* :Void */
      {
  
          // check target
          target = typeof target == 'string' ? document.getElementById(target)
                  : target;
          if (!target) {
              throw new Error("simulateMouseEvent(): Invalid target.");
          }
  
          // check event type
          if (this.iss(type)) {
              type = type.toLowerCase();
              switch (type) {
              case "mouseover":
              case "mouseout":
              case "mousedown":
              case "mouseup":
              case "click":
              case "dblclick":
              case "mousemove":
              case "mouseenter":// 非标准支持，仅为测试提供，该项仅IE下work
              case "mouseleave":
              case "mousewheel":
              case "dommousescroll":
                  break;
              default:
                  throw new Error("simulateMouseEvent(): Event type '" + type
                          + "' not supported.");
              }
          } else {
              throw new Error(
                      "simulateMouseEvent(): Event type must be a string.");
          }
  
          // setup default values
          if (!this.isb(bubbles)) {
              bubbles = true; // all mouse events bubble
          }
          if (!this.isb(cancelable)) {
              cancelable = (type != "mousemove"); // mousemove is the only one
              // that can't be cancelled
          }
          if (!this.iso(view)) {
              view = window; // view is typically window
          }
          if (!this.isn(detail)) {
              detail = 1; // number of mouse clicks must be at least one
          }
          if (!this.isn(screenX)) {
              screenX = 0;
          }
          if (!this.isn(screenY)) {
              screenY = 0;
          }
          if (!this.isn(clientX)) {
              clientX = 0;
          }
          if (!this.isn(clientY)) {
              clientY = 0;
          }
          if (!this.isb(ctrlKey)) {
              ctrlKey = false;
          }
          if (!this.isb(altKey)) {
              altKey = false;
          }
          if (!this.isb(shiftKey)) {
              shiftKey = false;
          }
          if (!this.isb(metaKey)) {
              metaKey = false;
          }
          if (!this.isn(button)) {
              button = 0;
          }
          if (!this.isn(wheelDelta)) {
              wheelDelta = 0;
          }
          
          if(this.browser.firefox){
              detail = wheelDelta / -40;
          }
          if(type == "dommousescroll")
              type = "DOMMouseScroll";
          
          // try to create a mouse event
          var customEvent /* :MouseEvent */= null;
  
          // check for DOM-compliant browsers first
          if (this.isf(document.createEvent)) {
  
              customEvent = document.createEvent("MouseEvents");
  
              // Safari 2.x (WebKit 418) still doesn't implement initMouseEvent()
              if (this.browser.ie !== 9 && customEvent.initMouseEvent) {
                  customEvent.initMouseEvent(type, bubbles, cancelable, view,
                          detail, screenX, screenY, clientX, clientY, ctrlKey,
                          altKey, shiftKey, metaKey, button, relatedTarget);
              } else { // Safari
  
                  // the closest thing available in Safari 2.x is UIEvents
                  customEvent = document.createEvent("UIEvents");
                  customEvent.initEvent(type, bubbles, cancelable);
                  customEvent.view = view;
                  customEvent.detail = detail;
                  customEvent.screenX = screenX;
                  customEvent.screenY = screenY;
                  customEvent.clientX = clientX;
                  customEvent.clientY = clientY;
                  customEvent.ctrlKey = ctrlKey;
                  customEvent.altKey = altKey;
                  customEvent.metaKey = metaKey;
                  customEvent.shiftKey = shiftKey;
                  customEvent.button = button;
                  customEvent.relatedTarget = relatedTarget;
              }
  
              /*
               * Check to see if relatedTarget has been assigned. Firefox versions
               * less than 2.0 don't allow it to be assigned via initMouseEvent()
               * and the property is readonly after event creation, so in order to
               * keep YAHOO.util.getRelatedTarget() working, assign to the IE
               * proprietary toElement property for mouseout event and fromElement
               * property for mouseover event.
               */
              if (relatedTarget && !customEvent.relatedTarget) {
                  if (type == "mouseout") {
                      customEvent.toElement = relatedTarget;
                  } else if (type == "mouseover") {
                      customEvent.fromElement = relatedTarget;
                  }
              }
              
              if(type == "mousewheel"){
                  customEvent.wheelDelta = wheelDelta;
              }
              
              // before dispatch
              if (this.beforedispatch && typeof this.beforedispatch == 'function')
                  this.beforedispatch(customEvent);
              this.beforedispatch = null;
  
              // fire the event
              target.dispatchEvent(customEvent);
  
          } else if (this.iso(document.createEventObject)) { // IE
  
              // create an IE event object
              customEvent = document.createEventObject();
  
              // assign available properties
              customEvent.bubbles = bubbles;
              customEvent.cancelable = cancelable;
              customEvent.view = view;
              customEvent.detail = detail;
              customEvent.screenX = screenX;
              customEvent.screenY = screenY;
              customEvent.clientX = clientX;
              customEvent.clientY = clientY;
              customEvent.ctrlKey = ctrlKey;
              customEvent.altKey = altKey;
              customEvent.metaKey = metaKey;
              customEvent.shiftKey = shiftKey;
  
              // fix button property for IE's wacky implementation
              switch (button) {
              case 0:
                  customEvent.button = 1;
                  break;
              case 1:
                  customEvent.button = 4;
                  break;
              case 2:
                  // leave as is
                  customEvent.button = 2;
                  break;
              default:
                  customEvent.button = 0;
              }
  
              /*
               * Have to use relatedTarget because IE won't allow assignment to
               * toElement or fromElement on generic events. This keeps
               * YAHOO.util.customEvent.getRelatedTarget() functional.
               */
              customEvent.relatedTarget = relatedTarget;
              
              // before dispatch
              if (this.beforedispatch && typeof this.beforedispatch == 'function')
                  this.beforedispatch(customEvent);
              this.beforedispatch = null;
              // fire the event
              target.fireEvent("on" + type, customEvent);
  
          } else {
              throw new Error(
                      "simulateMouseEvent(): No event simulation framework present.");
          }
      },
  
      // --------------------------------------------------------------------------
      // Mouse events
      // --------------------------------------------------------------------------
  
      /**
       * Simulates a mouse event on a particular element.
       * 
       * @param {HTMLElement}
       *            target The element to click on.
       * @param {String}
       *            type The type of event to fire. This can be any one of the
       *            following: click, dblclick, mousedown, mouseup, mouseout,
       *            mouseover, and mousemove.
       * @param {Object}
       *            options Additional event options (use DOM standard names).
       * @method mouseEvent
       * @static
       */
      fireMouseEvent : function(target /* :HTMLElement */, type /* :String */,
              options /* :Object */) /* :Void */
      {
          options = options || {};
          this.simulateMouseEvent(target, type, options.bubbles,
                  options.cancelable, options.view, options.detail, options.wheelDelta,
                  options.screenX, options.screenY, options.clientX,
                  options.clientY, options.ctrlKey, options.altKey,
                  options.shiftKey, options.metaKey, options.button,
                  options.relatedTarget);
      },
  
      /**
       * Simulates a click on a particular element.
       * 
       * @param {HTMLElement}
       *            target The element to click on.
       * @param {Object}
       *            options Additional event options (use DOM standard names).
       * @method click
       * @static
       */
      click : function(target /* :HTMLElement */, options /* :Object */) /* :Void */{
          this.mouseover(target, options);
          this.mousedown(target, options);
          this.mouseup(target, options);
          this.fireMouseEvent(target, "click", options);
      },
  
      /**
       * Simulates a double click on a particular element.
       * 
       * @param {HTMLElement}
       *            target The element to double click on.
       * @param {Object}
       *            options Additional event options (use DOM standard names).
       * @method dblclick
       * @static
       */
      dblclick : function(target /* :HTMLElement */, options /* :Object */) /* :Void */{
          this.fireMouseEvent(target, "dblclick", options);
      },
  
      /**
       * Simulates a mousedown on a particular element.
       * 
       * @param {HTMLElement}
       *            target The element to act on.
       * @param {Object}
       *            options Additional event options (use DOM standard names).
       * @method mousedown
       * @static
       */
      mousedown : function(target /* :HTMLElement */, options /* Object */) /* :Void */{
          this.fireMouseEvent(target, "mousedown", options);
      },
  
      /**
       * Simulates a mousemove on a particular element.
       * 
       * @param {HTMLElement}
       *            target The element to act on.
       * @param {Object}
       *            options Additional event options (use DOM standard names).
       * @method mousemove
       * @static
       */
      mousemove : function(target /* :HTMLElement */, options /* Object */) /* :Void */{
          this.fireMouseEvent(target, "mousemove", options);
      },
  
      /**
       * Simulates a mouseout event on a particular element. Use "relatedTarget"
       * on the options object to specify where the mouse moved to. Quirks:
       * Firefox less than 2.0 doesn't set relatedTarget properly, so toElement is
       * assigned in its place. IE doesn't allow toElement to be be assigned, so
       * relatedTarget is assigned in its place. Both of these concessions allow
       * YAHOO.util.Event.getRelatedTarget() to work correctly in both browsers.
       * 
       * @param {HTMLElement}
       *            target The element to act on.
       * @param {Object}
       *            options Additional event options (use DOM standard names).
       * @method mouseout
       * @static
       */
      mouseout : function(target /* :HTMLElement */, options /* Object */) /* :Void */{
          this.fireMouseEvent(target, "mouseout", options);
      },
  
      /**
       * Simulates a mouseover event on a particular element. Use "relatedTarget"
       * on the options object to specify where the mouse moved from. Quirks:
       * Firefox less than 2.0 doesn't set relatedTarget properly, so fromElement
       * is assigned in its place. IE doesn't allow fromElement to be be assigned,
       * so relatedTarget is assigned in its place. Both of these concessions
       * allow YAHOO.util.Event.getRelatedTarget() to work correctly in both
       * browsers.
       * 
       * @param {HTMLElement}
       *            target The element to act on.
       * @param {Object}
       *            options Additional event options (use DOM standard names).
       * @method mouseover
       * @static
       */
      mouseover : function(target /* :HTMLElement */, options /* Object */) /* :Void */{
          this.fireMouseEvent(target, "mouseover", options);
      },
  
      /**
       * Simulates a mouseup on a particular element.
       * 
       * @param {HTMLElement}
       *            target The element to act on.
       * @param {Object}
       *            options Additional event options (use DOM standard names).
       * @method mouseup
       * @static
       */
      mouseup : function(target /* :HTMLElement */, options /* Object */) /* :Void */{
          this.fireMouseEvent(target, "mouseup", options);
      },
      
      /**
       * Simulates a mousewheel on a particular element.
       * 
       * @param {HTMLElement}
       *            target The element to act on.
       * @param {Object}
       *            options Additional event options (use DOM standard names).
       * @method mouseup
       * @static
       */
      mousewheel : function(target /* :HTMLElement */, options /* Object */) /* :Void */{
          if(this.browser.firefox)
              this.fireMouseEvent(target, "DOMMouseScroll", options);
          else
              this.fireMouseEvent(target, "mousewheel", options);
      },
  
      dragto : function(target, options) {
          var me = this;
          me.mousemove(target, {
              clientX : options.startX,
              clientY : options.startY
          });
          setTimeout(function() {
              me.mousedown(target, {
                  clientX : options.startX,
                  clientY : options.startY
              });
              setTimeout(function() {
                  me.mousemove(target, {
                      clientX : options.endX,
                      clientY : options.endY
                  });
                  setTimeout(function() {
                      me.mouseup(target, {
                          clientX : options.endX,
                          clientY : options.endY
                      });
                      if (options.callback)
                          options.callback();
                  }, options.aftermove || 20);
              }, options.beforemove || 20);
          }, options.beforestart || 50);
      },
  
      // --------------------------------------------------------------------------
      // Key events
      // --------------------------------------------------------------------------
  
      /**
       * Fires an event that normally would be fired by the keyboard (keyup,
       * keydown, keypress). Make sure to specify either keyCode or charCode as an
       * option.
       * 
       * @private
       * @param {String}
       *            type The type of event ("keyup", "keydown" or "keypress").
       * @param {HTMLElement}
       *            target The target of the event.
       * @param {Object}
       *            options Options for the event. Either keyCode or charCode are
       *            required.
       * @method fireKeyEvent
       * @static
       */
      fireKeyEvent : function(type /* :String */, target /* :HTMLElement */,
              options /* :Object */) /* :Void */
      {
          options = options || {};
          this.simulateKeyEvent(target, type, options.bubbles,
                  options.cancelable, options.view, options.ctrlKey,
                  options.altKey, options.shiftKey, options.metaKey,
                  options.keyCode, options.charCode);
      },
  
      /**
       * Simulates a keydown event on a particular element.
       * 
       * @param {HTMLElement}
       *            target The element to act on.
       * @param {Object}
       *            options Additional event options (use DOM standard names).
       * @method keydown
       * @static
       */
      keydown : function(target /* :HTMLElement */, options /* :Object */) /* :Void */{
          this.fireKeyEvent("keydown", target, options);
      },
  
      /**
       * Simulates a keypress on a particular element.
       * 
       * @param {HTMLElement}
       *            target The element to act on.
       * @param {Object}
       *            options Additional event options (use DOM standard names).
       * @method keypress
       * @static
       */
      keypress : function(target /* :HTMLElement */, options /* :Object */) /* :Void */{
          this.fireKeyEvent("keypress", target, options);
      },
  
      /**
       * Simulates a keyup event on a particular element.
       * 
       * @param {HTMLElement}
       *            target The element to act on.
       * @param {Object}
       *            options Additional event options (use DOM standard names).
       * @method keyup
       * @static
       */
      keyup : function(target /* :HTMLElement */, options /* Object */) /* :Void */{
          this.fireKeyEvent("keyup", target, options);
      },
  
      /**
       * 提供iframe扩展支持，用例测试需要独立场景的用例，由于异步支持，通过finish方法触发start
       * <li>事件绑定在frame上，包括afterfinish和jsloaded
       * 
       * @param op.win
       * @param op.nojs
       *            不加载额外js
       * @param op.ontest
       *            测试步骤
       * @param op.onbeforestart
       *            测试启动前处理步骤，默认为QUnit.stop();
       * @param op.onafterfinish
       *            测试完毕执行步骤，默认为QUnit.start()
       * 
       */
      frameExt : function(op) {
          stop();
          op = typeof op == 'function' ? {
              ontest : op
          } : op;
          var pw = op.win || window, w, f, url = '', id = typeof op.id == 'undefined' ? 'f'
                  : op.id, fid = 'iframe#' + id;
  
          op.finish = function() {
              pw.$(fid).unbind();
              setTimeout(function() {
                  pw.$('div#divf').remove();
                  start();
              }, 20);
          };
  
          if (pw.$(fid).length == 0) {
              /* 添加frame，部分情况下，iframe没有边框，为了可以看到效果，添加一个带边框的div */
              pw.$(pw.document.body).append('<div id="div' + id + '"></div>');
              pw.$('div#div' + id).append('<iframe id="' + id + '" frameborder="no"></iframe>');
          }
          op.onafterstart && op.onafterstart($('iframe#f')[0]);
          var f = '';
          var e = '';
          pw.$('script').each(function() {
              if (this.src && this.src.indexOf('import.php') >= 0 && this.src.indexOf('/src/') < 0) {
                  //import.php?f=xxx&e=xxx&cov=xxx
                  //url = this.src.split('import.php')[1];
                  /[?&]f=([^&]+)/.test(this.src);
                  f+=','+RegExp.$1;
                  /[?&]e=([^&]+)/.test(this.src);
                  e+=RegExp.$1;
              }
          });
          url='?f='+f.substr(1)+'&e='+e;
          if(pw.location.href.indexOf("release=true") > -1)
              url += '&release=true';
          if(pw.location.href.indexOf("cov=true") > -1)
              url += '&cov=true';
          var dep = pw.location.href.match("[?&,]dep=[A-Za-z]*[^(?&,)]");
          if(dep && dep[0])
              url += dep[0];
          var srcpath = '';
          if(location.href.indexOf("/run.do") > 0) {
              srcpath = location.href.replace("run.do","frame.do");
          } else {
              srcpath = cpath + 'frame.php' + url;
          }
          pw.$(fid).one('load', function(e) {
              var w = e.target.contentWindow;
              var h = setInterval(function() {
                  if (w.baidu) {// 等待加载完成，IE6下这地方总出问题
                      clearInterval(h);
                      op.ontest(w, w.frameElement);
                  }
              }, 20);
              // 找到当前操作的iframe，然后call ontest
          }).attr('src', srcpath);
      },
      
      /**
       * 
       * 判断2个数组是否相等
       * 
       * @static
       */
      isEqualArray : function(array1, array2) {
          if ('[object Array]' != Object.prototype.toString.call(array1)
                  || '[object Array]' != Object.prototype.toString.call(array2))
              return (array1 === array2);
          else if (array1.length != array2.length)
              return false;
          else {
              for ( var i in array1) {
                  if (array1[i] != array2[i])
                      return false;
              }
              return true;
          }
      },
  
      /***************************************************************************
       * 
       * 通用数据模块
       * 
       * @static
       * 
       **************************************************************************/
      commonData : {// 针对测试文件的路径而不是UserAction的路径
          "testdir" : '../../',
          datadir : (function() {
              var href = '';
              if(location.href.indexOf("/run.do") > 0) {
                  href = location.href.split("/run.do")[0] + "/test/tools/data/";
              } else {
                  href = location.href.split("/test/")[0] + "/test/tools/data/";
              }
              return href;
          })(),
          currentPath : function() {
              var params = location.search.substring(1).split('&');
              for ( var i = 0; i < params.length; i++) {
                  var p = params[i];
                  if (p.split('=')[0] == 'case') {
                      var casepath = p.split('=')[1].split('.').join('/');
                      var href = '';
                      if(location.href.indexOf("/run.do") > 0) {
                          href = location.href.split('/run.do')[0] + '/test/'
                          + casepath.substring(0, casepath.lastIndexOf('/'))
                          + '/';
                      } else {
                          href = location.href.split('/test/')[0] + '/test/'
                          + casepath.substring(0, casepath.lastIndexOf('/'))
                          + '/';
                      }
                      return href;
                  }
              }
              return "";
          }
      },
  
      importsrc : function(src, callback, matcher, exclude, win) {
          /**
           * 支持release分之，此处应该直接返回
           */
          if (location.search.indexOf("release=true") >= 0 && src.indexOf("baidu") == -1) {
              if (callback && typeof callback == "function")
                  callback();
              return;
          }
  
          win = win || window;
          var doc = win.document;
  
          var srcpath = '';
          if(location.href.indexOf("/run.do") > 0) {
              srcpath = location.href.split("/run.do")[0]
              + "/test/tools/br/import.php";
          } else {
              srcpath =location.href.split("/test/")[0]
              + "/test/tools/br/import.php";
          }
          var param0 = src;
          var ps = {
              f : src
          };
          if (exclude)
              ps.e = exclude;
          if(location.search.indexOf("cov=true") > -1)
              ps.cov = true;
          if(ua.adapterMode)
          	ps.dep = "jquery";
          var param1 = exclude || "";
          /**
           * IE下重复载入会出现无法执行情况
           */
          if (win.execScript) {
              $.get(srcpath, ps, function(data) {
                  win.execScript(data);
              });
          } else {
              var head = doc.getElementsByTagName('head')[0];
              var sc = doc.createElement('script');
              sc.type = 'text/javascript';
              sc.src = srcpath + "?f=" + param0 + "&e=" + param1 + (ua.adapterMode ? '&dep=jquery' : '');
              if(location.search.indexOf("cov=true") > -1)
                  sc.src += "&cov=true";
              head.appendChild(sc);
          }
  
          matcher = matcher || src;
          var mm = matcher.split(",")[0].split(".");
          var h = setInterval(function() {
              var p = win;
              for ( var i = 0; i < mm.length; i++) {
                  if(i == mm.length - 1 && mm[i].indexOf("$") > -1){ //如果要加载的是插件
                      if (p._addons && p._addons.length == 1) { //ui的插件
                          // console.log(mm[i]);
                          return;
                      }   
                      if (!p._addons && typeof (p.prototype.un) == 'undefined') { //base的插件，如baidu.lang.Class.$removeEventListener
                          return;
                      }
      
                  }
                  else{
                      if (typeof (p[mm[i]]) == 'undefined') {
                          // console.log(mm[i]);
                          return;
                      }
                  }
                  p = p[mm[i]];
              }
              clearInterval(h);
              if (callback && 'function' == typeof callback)
                  callback();
          }, 20);
      },
  
      /* 用于加载css文件，如果没有加载完毕则不执行回调函数 */
      loadcss : function(urls, callback, w, classname, style, value) {
          var w = w || window;
          var document = w.document;
          var links = document.getElementsByTagName('link');
          if(typeof urls == "string")
              var urls = [urls];
          for(var i=0; i< urls.length; i++){
              for ( var link in links) {
                  if (link.href == urls[i]) {
                      callback();
                      return;
                  }
              }
              var head = document.getElementsByTagName('head')[0];
              var link = head.appendChild(document.createElement('link'));
              link.setAttribute("rel", "stylesheet");
              link.setAttribute("type", "text/css");
              link.setAttribute("href", urls[i]);
          }
          var div = document.body.appendChild(document.createElement("div"));
          $(document).ready(
                  function() {
                      div.className = classname || 'cssloaded';
                      var h = setInterval(function() {
                          if ($(div).css(style || 'width') == value
                                  || $(div).css(style || 'width') == '20px') {
                              clearInterval(h);
                              document.body.removeChild(div);
                              setTimeout(callback, 20);
                          }
                      }, 20);
                  });
      },
  
      /**
       * options supported
       */
      delayhelper : function(oncheck, onsuccess, onfail, timeout) {
          onsuccess = onsuccess || oncheck.onsuccess;
          onfail = onfail || oncheck.onfail || function() {
              fail('timeout wait for timeout : ' + timeout + 'ms');
              start();
          };
          timeout = timeout || oncheck.timeout || 10000;
  
          oncheck = (typeof oncheck == 'function') ? oncheck : oncheck.oncheck;
          var h1 = setInterval(function() {
              if (!oncheck())
                  return;
              else {
                  clearInterval(h1);
                  clearTimeout(h2);
                  typeof onsuccess == "function" && onsuccess();
              }
          }, 20);
          var h2 = setTimeout(function() {
              clearInterval(h1);
              clearTimeout(h2);
              onfail();
          }, timeout);
      },
  
      browser : (function() {
          var win = window;
  
          var numberify = function(s) {
              var c = 0;
              return parseFloat(s.replace(/\./g, function() {
                  return (c++ == 1) ? '' : '.';
              }));
          },
  
          nav = win && win.navigator,
  
          o = {
  
              /**
               * Internet Explorer version number or 0. Example: 6
               * 
               * @property ie
               * @type float
               * @static
               */
              ie : 0,
  
              /**
               * Opera version number or 0. Example: 9.2
               * 
               * @property opera
               * @type float
               * @static
               */
              opera : 0,
  
              /**
               * Gecko engine revision number. Will evaluate to 1 if Gecko is
               * detected but the revision could not be found. Other browsers will
               * be 0. Example: 1.8
               * 
               * <pre>
               * Firefox 1.0.0.4: 1.7.8   &lt;-- Reports 1.7
               * Firefox 1.5.0.9: 1.8.0.9 &lt;-- 1.8
               * Firefox 2.0.0.3: 1.8.1.3 &lt;-- 1.81
               * Firefox 3.0   &lt;-- 1.9
               * Firefox 3.5   &lt;-- 1.91
               * </pre>
               * 
               * @property gecko
               * @type float
               * @static
               */
              gecko : 0,
  
              /**
               * AppleWebKit version. KHTML browsers that are not WebKit browsers
               * will evaluate to 1, other browsers 0. Example: 418.9
               * 
               * <pre>
               * Safari 1.3.2 (312.6): 312.8.1 &lt;-- Reports 312.8 -- currently the 
               *                                   latest available for Mac OSX 10.3.
               * Safari 2.0.2:         416     &lt;-- hasOwnProperty introduced
               * Safari 2.0.4:         418     &lt;-- preventDefault fixed
               * Safari 2.0.4 (419.3): 418.9.1 &lt;-- One version of Safari may run
               *                                   different versions of webkit
               * Safari 2.0.4 (419.3): 419     &lt;-- Tiger installations that have been
               *                                   updated, but not updated
               *                                   to the latest patch.
               * Webkit 212 nightly:   522+    &lt;-- Safari 3.0 precursor (with native SVG
               *                                   and many major issues fixed).
               * Safari 3.0.4 (523.12) 523.12  &lt;-- First Tiger release - automatic update
               *                                   from 2.x via the 10.4.11 OS patch
               * Webkit nightly 1/2008:525+    &lt;-- Supports DOMContentLoaded event.
               *                                   yahoo.com user agent hack removed.
               * </pre>
               * 
               * http://en.wikipedia.org/wiki/Safari_version_history
               * 
               * @property webkit
               * @type float
               * @static
               */
              webkit : 0,
  
              /**
               * Chrome will be detected as webkit, but this property will also be
               * populated with the Chrome version number
               * 
               * @property chrome
               * @type float
               * @static
               */
              chrome : 0,
  
              safari : 0,
  
              firefox : 0,
  
              /**
               * The mobile property will be set to a string containing any
               * relevant user agent information when a modern mobile browser is
               * detected. Currently limited to Safari on the iPhone/iPod Touch,
               * Nokia N-series devices with the WebKit-based browser, and Opera
               * Mini.
               * 
               * @property mobile
               * @type string
               * @static
               */
              mobile : null,
  
              /**
               * Adobe AIR version number or 0. Only populated if webkit is
               * detected. Example: 1.0
               * 
               * @property air
               * @type float
               */
              air : 0,
  
              /**
               * Google Caja version number or 0.
               * 
               * @property caja
               * @type float
               */
              caja : nav && nav.cajaVersion,
  
              /**
               * Set to true if the page appears to be in SSL
               * 
               * @property secure
               * @type boolean
               * @static
               */
              secure : false,
  
              /**
               * The operating system. Currently only detecting windows or
               * macintosh
               * 
               * @property os
               * @type string
               * @static
               */
              os : null
  
          },
  
          _ua = nav && nav.userAgent,
  
          loc = win && win.location,
  
          href = loc && loc.href,
  
          m;
  
          o.secure = href && (href.toLowerCase().indexOf("https") === 0);
  
          if (_ua) {
  
              if ((/windows|win32/i).test(_ua)) {
                  o.os = 'windows';
              } else if ((/macintosh/i).test(_ua)) {
                  o.os = 'macintosh';
              } else if ((/rhino/i).test(_ua)) {
                  o.os = 'rhino';
              }
  
              // Modern KHTML browsers should qualify as Safari X-Grade
              if ((/KHTML/).test(_ua)) {
                  o.webkit = 1;
              }
              // Modern WebKit browsers are at least X-Grade
              m = _ua.match(/AppleWebKit\/([^\s]*)/);
              if (m && m[1]) {
                  o.webkit = numberify(m[1]);
  
                  // Mobile browser check
                  if (/ Mobile\//.test(_ua)) {
                      o.mobile = "Apple"; // iPhone or iPod Touch
                  } else {
                      m = _ua.match(/NokiaN[^\/]*|Android \d\.\d|webOS\/\d\.\d/);
                      if (m) {
                          o.mobile = m[0]; // Nokia N-series, Android, webOS,
                          // ex:
                          // NokiaN95
                      }
                  }
  
                  var m1 = _ua.match(/Safari\/([^\s]*)/);
                  if (m1 && m1[1]) // Safari
                      o.safari = numberify(m1[1]);
                  m = _ua.match(/Chrome\/([^\s]*)/);
                  if (o.safari && m && m[1]) {
                      o.chrome = numberify(m[1]); // Chrome
                  } else {
                      m = _ua.match(/AdobeAIR\/([^\s]*)/);
                      if (m) {
                          o.air = m[0]; // Adobe AIR 1.0 or better
                      }
                  }
              }
  
              if (!o.webkit) { // not webkit
                  // @todo check Opera/8.01 (J2ME/MIDP; Opera Mini/2.0.4509/1316;
                  // fi; U;
                  // try get firefox and it's ver
                  // ssr)
                  m = _ua.match(/Opera[\s\/]([^\s]*)/);
                  if (m && m[1]) {
                      m[1]= _ua.match(/Version[\s\/]([^\s]*)/)[1] || m[1]; //tianlili修改，为了得到opera10之后的真实版本信息而非固定标识9.80
                      o.opera = numberify(m[1]);
                      m = _ua.match(/Opera Mini[^;]*/);
                      if (m) {
                          o.mobile = m[0]; // ex: Opera Mini/2.0.4509/1316
                      }
                  } else { // not opera or webkit
                      m = _ua.match(/MSIE\s([^;]*)/);
                      if (m && m[1]) {
                          o.ie = numberify(m[1]);
                      } else { // not opera, webkit, or ie
                          m = _ua.match(/Gecko\/([^\s]*)/);
                          if (m) {
                              o.gecko = 1; // Gecko detected, look for revision
                              m = _ua.match(/rv:([^\s\)]*)/);
                              if (m && m[1]) {
                                  o.gecko = numberify(m[1]);
                              }
                          }
                          m = _ua.match("Firefox/([^\s]*)");
                          o.firefox = numberify(m[1]);
                      }
                  }
              }
          }
  
          return o;
      })(),
  
      /**
       * 提供队列方式执行用例的方案，接口包括start、add、next，方法全部执行完毕时会启动用例继续执行
       */
      functionListHelper : function() {
          var check = {
              list : [],
              start : function() {
                  var self = this;
                  $(this).bind('next', function() {
                      setTimeout(function() {// 避免太深的堆栈
                          if (self.list.length == 0)
                              start();
                          else
                              self.list.shift()();
                      }, 0);
                  });
                  self.next();
              },
              add : function(func) {
                  this.list.push(func);
              },
              next : function(delay) {
                  var self = this;
                  if (delay) {
                      setTimeout(function() {
                          $(self).trigger('next');
                      }, delay);
                  } else
                      $(this).trigger('next');
              }
          };
          return check;
      },
      
      getEventsLength: function(evtQueue, target){
          var ret = 0,
              has = target === undefined,
              handlers = has ? evtQueue.get(target) : evtQueue.attachCache,
              item;
          for(var i in handlers){
              item = handlers[i];
              if(has){
                  ret += item.length;
              }else{
                  for(var j in item){
                      ret += item[j].length;
                  }
              }
          }
          return ret;
  //        return baidu._util_.eventBase._getEventsLength(target);
      },
      
      fnQueue : function() {
          var check = {
              fnlist : [],
              /**
               * 该方法会在fn上注册一个delay属性
               * 
               * @param fn
               * @param delay
               */
              add : function(fn, delay) {
                  delay && (fn.delay = delay);
                  check.fnlist.push(fn);
                  return check;
              },
              /**
               * 自动下一个
               */
              next : function() {
                  if(check.fnlist.length == 0)
                      return;
                  var fn = check.fnlist[0];
                  if (fn.delay) {
                      setTimeout(check.next, fn.delay);
                      delete fn.delay;
                  } else {
                      check.fnlist.shift()();
                      // 切断堆栈
                      // setTimeout(fnQueue.next, 0);
                      check.next();
                  }
              }
          };
          return check;
      }
  };
  var ua = UserAction;
  var upath = ua.commonData.currentPath();
  ua.adapterMode = /dep=\S+/.test(location.search);
  var cpath = ua.commonData.datadir;

});

