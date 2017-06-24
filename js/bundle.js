/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			memo[selector] = fn.call(this, selector);
		}

		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(8);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/**
 * 调整页面大小自适应屏幕。必须在body加载之前调整
 */

//调整页面大小自适应屏幕
!function (x) {
  function w() {
    var a = r.getBoundingClientRect().width;
    a / v > 840 && (a = 840 * v), x.rem = (a / 16 ) < 20 ? 20 : (a / 16), r.style.fontSize = x.rem + 'px';
  }

  var v, u, t, s = x.document, r = s.documentElement, q = s.querySelector('meta[name="viewport"]'), p = s.querySelector('meta[name="flexible"]');
  if (q) {
    //console.warn("将根据已有的meta标签来设置缩放比例");
    var o = q.getAttribute('content').match(/initial\-scale=(["']?)([\d\.]+)\1?/);
    o && (u = parseFloat(o[2]), v = parseInt(1 / u));
  } else {
    if (p) {
      var o = p.getAttribute('content').match(/initial\-dpr=(["']?)([\d\.]+)\1?/);
      o && (v = parseFloat(o[2]), u = parseFloat((1 / v).toFixed(2)));
    }
  }
  if (!v && !u) {
    var n = (x.navigator.appVersion.match(/android/gi), x.navigator.appVersion.match(/iphone/gi)), v = x.devicePixelRatio;
    v = n ? v >= 3 ? 3 : v >= 2 ? 2 : 1 : 1, u = 1 / v;
  }
  if (r.setAttribute('data-dpr', v), !q) {
    if (q = s.createElement('meta'), q.setAttribute('name', 'viewport'), q.setAttribute('content', 'initial-scale=' + u + ', maximum-scale=' + u + ', minimum-scale=' + u + ', user-scalable=no'), r.firstElementChild) {
      r.firstElementChild.appendChild(q);
    } else {
      var m = s.createElement('div');
      m.appendChild(q), s.write(m.innerHTML);
    }
  }
  x.dpr = v, x.addEventListener('resize', function () {
    clearTimeout(t), t = setTimeout(w, 300);
  }, !1), x.addEventListener('pageshow', function (b) {
    b.persisted && (clearTimeout(t), t = setTimeout(w, 300));
  }, !1), 'complete' === s.readyState ? s.body.style.fontSize = 12 * v + 'px' : s.addEventListener('DOMContentLoaded', function () {
    s.body.style.fontSize = 12 * v + 'px';
  }, !1), w();
}(window);
//兼容cmd
"function" !== 'undefined' && !(__WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, module) {
}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(5);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js??ref--1-1!../node_modules/postcss-loader/index.js!./m-style.css", function() {
			var newContent = require("!!../node_modules/css-loader/index.js??ref--1-1!../node_modules/postcss-loader/index.js!./m-style.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(6);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js??ref--1-1!../node_modules/postcss-loader/index.js!./style.css", function() {
			var newContent = require("!!../node_modules/css-loader/index.js??ref--1-1!../node_modules/postcss-loader/index.js!./style.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "body {\n  margin: 0;\n  padding: 0;\n}\n.header {\n  width: 100%;\n  height: 24rem;\n  position: relative;\n}\n.header .bg {\n  width: 100%;\n  height: 24rem;\n  position: absolute;\n}\n.header .cover-1 {\n  position: absolute;\n  top: 0;\n  background: rgba(24, 114, 217, 0.1);\n  width: 100%;\n  height: 24rem;\n}\n.header .cover-2 {\n  position: absolute;\n  top: 0;\n  background: #000000;\n  width: 100%;\n  height: 24rem;\n}\n.header .title {\n  position: relative;\n  margin-top: 0.85rem;\n  margin-left: 0.85rem;\n  width: 2.2rem;\n  height: auto;\n}\n.header .slogan {\n  width: 100%;\n  text-align: center;\n  color: white;\n  position: relative;\n  margin-top: 0.8rem;\n}\n.header .slogan .title-1 {\n  display: block;\n  margin: 0 auto;\n  font-size: 36px;\n}\n.header .slogan .title-2 {\n  display: block;\n  margin: 0 auto;\n  font-size: 12px;\n  line-height: 0.86;\n  letter-spacing: 5px;\n}\n.header .slogan-2 {\n  width: 9.21rem;\n  margin: 0.685rem auto 0;\n  font-size: 12px;\n  color: white;\n  position: relative;\n  text-align: center;\n}\n.header .slogan-2 .slogan-2-1,\n.header .slogan-2 .slogan-2-2 {\n  width: 3.6rem;\n  display: -webkit-inline-box;\n  display: -ms-inline-flexbox;\n  display: inline-flex;\n  text-align: left;\n}\n.header .slogan-2 .slogan-2-1 {\n  margin-right: 0.5rem;\n}\n.header .slogan-2 .slogan-2-1 .direct {\n  position: relative;\n  top: 2px;\n  margin-right: 6px;\n  float: left;\n  background: url('../image/compare.png');\n  background-size: 13px;\n  width: 13px;\n  height: 13px;\n}\n.header .slogan-2 .slogan-2-2 .pointer {\n  position: relative;\n  top: 2px;\n  margin-right: 6px;\n  float: left;\n  background: url('../image/pointer.png');\n  background-size: 13px;\n  width: 13px;\n  height: 13px;\n}\n.header .desc-2 {\n  position: relative;\n  display: block;\n  margin: 0.85rem auto 0;\n  width: 9.75rem;\n  height: auto;\n}\n.header .mobile-phone {\n  width: 9.3rem;\n  height: 12rem;\n  background-size: 100%;\n  background-repeat: no-repeat;\n  display: block;\n  margin: 0 auto;\n  bottom: 0;\n  position: absolute;\n  left: 0;\n  right: 0;\n}\n.header .mobile-phone .draw-iphone {\n  width: 7.6rem;\n  height: 11.8rem;\n  border: 1px solid #979797;\n  margin: 0 auto;\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  border-top-left-radius: 0.9rem;\n  border-top-right-radius: 0.9rem;\n  border-bottom: none;\n}\n.header .mobile-phone .draw-iphone .draw-iphone-line {\n  width: 1.7rem;\n  height: 1px;\n  background: #979797;\n  display: block;\n  margin: 0 auto;\n  position: relative;\n  top: 0.7rem;\n}\n.header .mobile-phone .draw-iphone .draw-iphone-inner {\n  width: 6.7rem;\n  height: 10.2rem;\n  border: 1px solid #979797;\n  border-bottom: none;\n  margin: 0 auto;\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  right: 0;\n}\n.header .mobile-phone .draw-iphone .draw-iphone-inner .txt {\n  bottom: 0.5rem;\n  position: absolute;\n  left: 0;\n  right: 0;\n}\n.header .mobile-phone .draw-iphone .draw-iphone-inner .txt .app {\n  display: block;\n  width: 4rem;\n  height: auto;\n  position: relative;\n  bottom: 2rem;\n  margin: 0 auto;\n}\n.header .mobile-phone .draw-iphone .draw-iphone-inner .txt .title-1,\n.header .mobile-phone .draw-iphone .draw-iphone-inner .txt .title-2 {\n  color: white;\n  font-size: 12px;\n  display: block;\n  text-align: center;\n}\n.body-content .desc-part {\n  margin-top: 2.15rem;\n  width: 100%;\n  height: 14.95rem;\n  background: url('../image/bitmap.png');\n  background-size: 100%;\n  background-repeat: no-repeat;\n}\n.body-content .desc-part .coin {\n  width: 6.5rem;\n  height: auto;\n  display: block;\n  margin: 0 auto;\n}\n.body-content .desc-part .title {\n  font-size: 2.05rem;\n  display: block;\n  text-align: center;\n  color: #333333;\n  margin-top: 1.0rem;\n}\n.body-content .desc-part .title-2 {\n  color: #666666;\n  font-size: 12px;\n  display: block;\n  text-align: center;\n  line-height: 1rem;\n}\n.body-content .desc-part .title-sub {\n  display: block;\n  text-align: center;\n}\n.body-content .desc-part .title-sub-2 {\n  display: block;\n  margin: 0 auto;\n}\n.body-content .desc-part .title-sub-2-fast {\n  display: block;\n  margin: 0 auto;\n}\n.body-content .desc-part .line {\n  display: block;\n  margin: 0.3rem auto 0;\n  width: 4rem;\n  height: 1px;\n  background: #ce222e;\n}\n.body-content .p5 {\n  height: 21rem;\n  margin: 2.15rem auto 0;\n  font-size: 12px;\n  color: #666666;\n  background-position: 0 100%;\n}\n.body-content .p5 .text {\n  margin-top: 2rem;\n  padding-left: 1rem;\n  padding-right: 1rem;\n}\n.body-content .p5 .text p {\n  text-indent: 1rem;\n}\n.desc-part-1 .desc-part-img,\n.desc-part-2 .desc-part-img,\n.desc-part-3 .desc-part-img,\n.desc-part-4 .desc-part-img,\n.desc-part-5 .desc-part-img {\n  display: block;\n  width: 100%;\n  height: auto;\n  margin: 0 auto;\n}\n.desc-part-5 {\n  margin-top: 2rem;\n  position: relative;\n}\n.desc-part-5 .desc-part-img {\n  width: 11rem;\n}\n.desc-part-5 .text {\n  width: 13.2rem;\n  margin: 0 auto;\n  font-size: 12px;\n  color: #666666;\n}\n.desc-part-5 .text p {\n  text-indent: 1rem;\n}\n.desc-part-5 .txt-bg {\n  width: 100%;\n  height: 110%;\n  position: absolute;\n  top: 0.1rem;\n  z-index: -1;\n}\n.contact-info {\n  margin: 0 auto;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  font-size: 0.6rem;\n  -ms-flex-pack: distribute;\n      justify-content: space-around;\n}\n.contact-info .contact-phone {\n  margin-top: 1rem;\n  display: -webkit-inline-box;\n  display: -ms-inline-flexbox;\n  display: inline-flex;\n  height: 1.7rem;\n}\n.contact-info .contact-phone .icon {\n  float: left;\n  width: 1rem;\n  position: relative;\n  top: 50%;\n  transform: translateY(-50%);\n  -webkit-transform: translateY(-50%);\n}\n.contact-info .contact-phone .detail {\n  display: inline-block;\n  text-align: left;\n  border-left: 1px solid #E1E1E1;\n  margin-left: 0.5rem;\n  padding-left: 0.7rem;\n  height: 1.7rem;\n}\n.contact-info .contact-phone .detail .title,\n.contact-info .contact-phone .detail .info {\n  display: block;\n  color: #333333;\n}\n.contact-info .contact-phone .detail .info {\n  color: #999999;\n}\n.contact-info .contact-phone .phone {\n  height: 1rem;\n}\n.contact-info .contact-phone .email {\n  height: 0.8rem;\n}\n.bottom {\n  position: relative;\n  margin-top: 1rem;\n  font-size: 0;\n}\n.bottom .map {\n  position: relative;\n  width: 100%;\n  height: 10.67rem;\n  background: url('../image/map.png');\n  background-size: 100%;\n}\n.bottom .map .explain {\n  background: rgba(0, 0, 0, 0.5);\n  color: #E1E1E1;\n  font-size: 12px;\n  display: block;\n  width: 9rem;\n  height: 2rem;\n  line-height: 1.5rem;\n  position: relative;\n  top: 3.2rem;\n  left: 0;\n  right: 0;\n  margin: 0 auto;\n  text-align: center;\n}\n.bottom .map .location {\n  display: block;\n  width: 1rem;\n  height: 1.07rem;\n  background: url(../image/location.png);\n  background-size: 100%;\n  left: 0;\n  right: 0;\n  position: absolute;\n  margin: auto;\n  top: 0;\n  bottom: 0;\n}\n.bottom .app {\n  width: 3.4135rem;\n  height: auto;\n  position: absolute;\n  top: -30%;\n  left: 0;\n  right: 0;\n  margin: 0 auto;\n}\n.bottom .bottom-txt {\n  position: relative;\n  width: 100%;\n  height: 155px;\n  background: #cc2533;\n  font-size: 12px;\n  color: white;\n}\n.bottom .bottom-txt .title-1 {\n  padding-top: 2.5rem;\n}\n.bottom .bottom-txt .title-1,\n.bottom .bottom-txt .title-2 {\n  display: block;\n  text-align: center;\n}\n", ""]);

// exports


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "body {\n  margin: 0;\n  padding: 0;\n}\n.container {\n  font-size: 0;\n  /*.header {\n    position: relative;\n    width: 100vw;\n    height: 100vh;\n    background-image: url('../image/pc-bg.png');\n    background-repeat: no-repeat;\n    -webkit-background-size: 100%;\n    background-size: 100%;\n    .logo {\n      width: 86px;\n      height: auto;\n      position: absolute;\n      top: 25px;\n      left: 60px;\n    }\n    .contact-info {\n      width: 163px;\n      height: auto;\n      position: absolute;\n      top: 30px;\n      right: 60px;\n      float: right;\n    }\n    .header-content {\n      position: relative;\n      width: 1170px;\n      height: 100vh;\n      margin: 0 auto;\n      .slogan {\n        position: absolute;\n        top: 30.6%;\n        left: 0;\n        width: 23%;\n        height: auto;\n      }\n      .pc-head-phone {\n        position: absolute;\n        top: 13.2%;\n        right: 17.1%;\n        float: right;\n        width: 30.512%;\n        height: auto;\n      }\n      .advantage {\n        position: absolute;\n        top: 55.4%;\n        left: 0%;\n        width: 32.14%;\n        height: auto;\n      }\n    }\n  }*/\n}\n.container .header .all-in-one {\n  width: 100%;\n  height: auto;\n}\n.container .detail {\n  width: 1920px;\n  height: 600px;\n  margin: 0 auto;\n}\n.container .detail .detail-bg {\n  position: absolute;\n  width: 100%;\n  height: 600px;\n}\n.container .detail .detail-content {\n  width: 1170px;\n  height: inherit;\n  margin: 0 auto;\n}\n.container .detail .detail-1-img,\n.container .detail .detail-1-txt,\n.container .detail .detail-2-img,\n.container .detail .detail-2-txt,\n.container .detail .detail-3-img,\n.container .detail .detail-3-txt,\n.container .detail .detail-4-img,\n.container .detail .detail-4-txt {\n  height: auto;\n  position: relative;\n  top: 50%;\n  transform: translateY(-50%);\n  -webkit-transform: translateY(-50%);\n}\n.container .detail .detail-1-img {\n  height: 56.1%;\n  width: auto;\n}\n.container .detail .detail-2-img {\n  width: 408px;\n}\n.container .detail .detail-3-img {\n  width: 380px;\n}\n.container .detail .detail-4-img {\n  width: 426px;\n}\n.container .detail .detail-1-txt {\n  height: 28.8%;\n  width: auto;\n}\n.container .detail .detail-2-txt {\n  width: 360px;\n}\n.container .detail .detail-3-txt {\n  width: 360px;\n}\n.container .detail .detail-4-txt {\n  width: 360px;\n}\n.container .detail .detail-1-img,\n.container .detail .detail-3-img {\n  float: left;\n  margin-left: 5%;\n}\n.container .detail .detail-1-txt,\n.container .detail .detail-3-txt {\n  float: right;\n  right: 5%;\n}\n.container .detail .detail-2-img,\n.container .detail .detail-4-img {\n  float: right;\n  right: 5%;\n}\n.container .detail .detail-2-txt,\n.container .detail .detail-4-txt {\n  float: left;\n  left: 15%;\n}\n.container .detail-description {\n  width: 100%;\n  height: 600px;\n}\n.container .detail-description .detail-bg {\n  position: absolute;\n  width: 100%;\n  height: 600px;\n  z-index: -1;\n}\n.container .detail-description .detail-content {\n  height: inherit;\n}\n.container .detail-description .detail-content .description-img {\n  width: 486px;\n  height: auto;\n  position: relative;\n  top: 50%;\n  left: 10%;\n  transform: translateY(-50%);\n  -webkit-transform: translateY(-50%);\n}\n.container .detail-description .detail-content .description-txt {\n  float: right;\n  width: 360px;\n  font-size: 18px;\n  color: #666666;\n  position: relative;\n  top: 50%;\n  right: 13%;\n  transform: translateY(-50%);\n  -webkit-transform: translateY(-50%);\n}\n.container .detail-description .detail-content .description-txt p {\n  text-indent: 35px;\n}\n.container .contact-method {\n  width: 100%;\n  height: 120px;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -ms-flex-pack: distribute;\n      justify-content: space-around;\n  font-size: 18px;\n}\n.container .contact-method .phone,\n.container .contact-method .email,\n.container .contact-method .location {\n  display: inline-block;\n  height: 60px;\n}\n.container .contact-method .phone img,\n.container .contact-method .email img,\n.container .contact-method .location img {\n  float: left;\n  position: relative;\n  top: 50%;\n  transform: translateY(-50%);\n  -webkit-transform: translateY(-50%);\n}\n.container .contact-method .phone .info,\n.container .contact-method .email .info,\n.container .contact-method .location .info {\n  text-align: left;\n  display: inline-block;\n  position: relative;\n  top: 50%;\n  transform: translateY(-50%);\n  -webkit-transform: translateY(-50%);\n  border-left: 1px solid #E1E1E1;\n  margin-left: 25px;\n  padding-left: 25px;\n}\n.container .contact-method .phone .info .txt,\n.container .contact-method .email .info .txt,\n.container .contact-method .location .info .txt {\n  display: block;\n}\n.container .contact-method .phone img {\n  width: 30px;\n  height: auto;\n}\n.container .contact-method .email img {\n  width: 26px;\n  height: auto;\n}\n.container .contact-method .location img {\n  width: 22px;\n  height: auto;\n}\n.container .footer {\n  position: relative;\n}\n.container .footer .map {\n  width: 100%;\n  height: auto;\n}\n.container .footer .pc-app {\n  width: 150px;\n  height: 150px;\n  position: absolute;\n  top: 45%;\n  left: 0;\n  right: 0;\n  margin: 0 auto;\n}\n.container .footer .pc-bottom {\n  width: 100%;\n  height: auto;\n}\n@media screen and (min-width: 1280px) {\n  .container .detail {\n    width: 100%;\n  }\n  .container .detail .detail-content {\n    width: 1170px;\n  }\n  .container .detail .detail-content .detail-bg {\n    width: 1170px;\n  }\n}\n@media screen and (min-width: 768px) and (max-width: 1024px) {\n  .container .header {\n    height: 576px;\n  }\n  .container .header .header-content {\n    height: 576px;\n    width: 750px;\n  }\n  .container .header .header-content .pc-head-phone {\n    top: 20.2%;\n  }\n  .container .header .header-content .advantage {\n    top: 65.3%;\n  }\n  .container .detail,\n  .container .detail .detail-bg {\n    height: 18.8rem;\n  }\n  .container .detail .detail-1-img,\n  .container .detail .detail-1-txt,\n  .container .detail .detail-2-img,\n  .container .detail .detail-2-txt,\n  .container .detail .detail-3-img,\n  .container .detail .detail-3-txt,\n  .container .detail .detail-4-img,\n  .container .detail .detail-4-txt {\n    width: 14rem;\n  }\n  .container .detail-description .description-img {\n    width: 28%;\n  }\n  .container .detail-description {\n    height: 18.8rem;\n  }\n  .container .detail-description .description-txt {\n    font-size: 0.8rem;\n  }\n  .container .contact-method {\n    font-size: 0.8rem;\n  }\n  .container .contact-method .phone {\n    width: 11rem;\n  }\n  .container .footer .pc-app {\n    width: 6.25rem;\n    height: auto;\n  }\n}\n", ""]);

// exports


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

class instance {
  init() {
    __webpack_require__(2);
    if(navigator.userAgent.indexOf('iPhone')!= -1 || navigator.userAgent.indexOf('Android')!= -1 ) {
      __webpack_require__(3);
    } else {
      __webpack_require__(4);
    }
  }
}

let _instance = new instance();
_instance.init();



/***/ }),
/* 8 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ })
/******/ ]);