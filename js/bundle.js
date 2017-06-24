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
/******/ ({

/***/ 2:
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

/***/ 7:
/***/ (function(module, exports, __webpack_require__) {

class instance {
  init() {
    __webpack_require__(2);
  }
}

let _instance = new instance();
_instance.init();



/***/ })

/******/ });