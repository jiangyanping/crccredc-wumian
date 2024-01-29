/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "../src/core/model/loader/worker_parser.js":
/*!*************************************************!*\
  !*** ../src/core/model/loader/worker_parser.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var three_examples_jsm_loaders_GLTFLoader__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three/examples/jsm/loaders/GLTFLoader */ "./node_modules/three/examples/jsm/loaders/GLTFLoader.js");
/* harmony import */ var _utils_fileloader_override__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/fileloader_override */ "../src/core/utils/fileloader_override.js");
/* harmony import */ var three_examples_jsm_utils_BufferGeometryUtils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! three/examples/jsm/utils/BufferGeometryUtils */ "./node_modules/three/examples/jsm/utils/BufferGeometryUtils.js");


//import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"
// 以下导入语句必须保留，该文件重载了FileLoader的load函数，需要在解析数据过程中使用



//var draco = new DRACOLoader();
//draco.setDecoderPath('./thirdparts/draco/');

// 合并几何数据
// TODO: 此处的Geometry和Mesh可能造成内存泄露。
function merge_children_geom(root) {
    // glTF仅在物体根部（node）处有变换矩阵
    root.updateMatrix();
    if (!root.children || root.children.length == 0) return root;
    var geoms = [];
    var materials = [];
    if (!!root.geometry) {
        geoms.push(root.geometry);
        materials.push(root.material);
    }
    root.children.forEach(c => {
        if (!c.isMesh) return;
        c.updateMatrix();
        geoms.push(c.geometry);
        materials.push(c.material);
    });
    var merged = three_examples_jsm_utils_BufferGeometryUtils__WEBPACK_IMPORTED_MODULE_2__.mergeBufferGeometries(geoms, true);
    var ret = new three__WEBPACK_IMPORTED_MODULE_3__.Mesh(merged, materials);
    // root.updateMatrixWorld(true);
    ret.applyMatrix4(root.matrix);
    return ret;
}

/**
 * 参数说明：
 * 线程消息接受一个对象参数，包含如下字段：
 * {
 * url // 数据来源，仅用于返回给调用线程，作为数据的标识
 * index // 数据的索引，因为数据来源（url）可能包含多条数据
 * count // 数据源包含的数据总数
 * data // 待解析的数据，将使用GLTFLoader对传入的数据（ArrayBuffer）进行解析
 * }
 */
self.onmessage = function (msg) {
    var { url, gltf_data } = msg.data;
    var resourcePath = three__WEBPACK_IMPORTED_MODULE_3__.LoaderUtils.extractUrlBase(url); // glTF引用外部文件url路径
    var loader = new three_examples_jsm_loaders_GLTFLoader__WEBPACK_IMPORTED_MODULE_0__.GLTFLoader();
    //loader.setDRACOLoader(draco);
    loader.parse(gltf_data, resourcePath, function (gltf) {
        // 整理贴图url，并进行映射
        let jsonGLTF = gltf.parser.json;
        let mapUrl = new Map();
        for (let n of jsonGLTF.nodes) {
            if ("extensions" in n && "DBId" in n["extensions"]) {
                let uuid = n.extensions.DBId;
                let mesh = jsonGLTF.meshes[n.mesh];
                let meshTexImg = {
                    name: mesh.name,
                    imgs: []
                };
                for (let p of mesh.primitives) {
                    let url = null;
                    let mat = jsonGLTF.materials[p.material];
                    if (!!mat.pbrMetallicRoughness &&
                        !!mat.pbrMetallicRoughness.baseColorTexture) {
                        let texIndex = mat.pbrMetallicRoughness.baseColorTexture.index;
                        let imgIndex = jsonGLTF.textures[texIndex].source;
                        url = jsonGLTF.images[imgIndex].uri;
                    }
                    meshTexImg.imgs.push(resourcePath + url);
                }
                mapUrl.set(uuid, meshTexImg);
            }
        }
        // 归并几何，并修正ID
        var allobjs = gltf.scene.children;
        var cnt = allobjs.length;
        for (var i = 0; i < cnt; i++) {
            var mesh = allobjs[i];
            var merged = merge_children_geom(mesh);
            if (!!mesh.userData && !!mesh.userData.gltfExtensions) {
                var dbId = mesh.userData.gltfExtensions.DBId;
                if (!!dbId)
                    merged.uuid = dbId;
                //delete mesh.userData.gltfExtensions.DBId;
            }
            merged.userData = mesh.userData;
            if (!!mesh.name) merged.name = mesh.name;
            allobjs[i] = merged;
        }
        // 分块，以便不过多占用主线程
        const step = 1;
        // 先返回分块总数，以便主线程更新进度
        var count = Math.ceil(cnt / step);
        self.postMessage({
            type: "count",
            url: url,
            count: count
        });
        // 分片传回主线程
        var param = {
            type: "chunk",
            url: url,
        };
        for (let i = 0; i < cnt; i += step) {
            let only_one_chunk = allobjs.slice(i, i + step);
            gltf.scene.children = only_one_chunk;
            // 序列化以便传输
            let jsonScene = gltf.scene.toJSON();
            if (!!jsonScene.images) {
                let imgsOut = jsonScene.images;
                let { uuid } = jsonScene.object.children[0];
                let urls = mapUrl.get(uuid);
                if (!!urls) {
                    urls = urls.imgs;
                    console.assert(imgsOut.length == urls.length,
                        "Parser: 解析结果可能有误，贴图个数不匹配！",
                    );
                    for (let j in urls) {
                        imgsOut[j].url = urls[j];
                    }
                }
            }
            param.chunk = jsonScene;
            self.postMessage(param);
        }
        gltf.scene.children = allobjs;
        gltf.scene.traverse(o => {
            if (!!o.geometry) {
                o.geometry.dispose();
                if (Array.isArray(o.material)) {
                    o.material.forEach(m => m.dispose());
                } else {
                    o.material.dispose();
                }
            }
        });
        self.postMessage({ type: "done" });
    });
};


/***/ }),

/***/ "../src/core/utils/fileloader_override.js":
/*!************************************************!*\
  !*** ../src/core/utils/fileloader_override.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FileLoader": () => (/* reexport safe */ three__WEBPACK_IMPORTED_MODULE_1__.FileLoader)
/* harmony export */ });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var jszip_dist_jszip__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jszip/dist/jszip */ "./node_modules/jszip/dist/jszip.js");
/* harmony import */ var jszip_dist_jszip__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jszip_dist_jszip__WEBPACK_IMPORTED_MODULE_0__);



/**
 * 为Threejs提供的FileLoader扩展功能，
 * 重载load函数，以支持在文件导入时将Zip数据解压缩，
 * 对load函数的第二个参数onLoad回调，增加了三个参数，用于标识解压后数据
 */

three__WEBPACK_IMPORTED_MODULE_1__.FileLoader.prototype.load = (function () {
    var origin_load = three__WEBPACK_IMPORTED_MODULE_1__.FileLoader.prototype.load;

    function UnZip(data, pre_item_cb, post_item_cb) {
        var arrData = new Uint8Array(data);
        if (arrData[0] == 80 && arrData[1] == 75) { // zip格式的标志：PK
            var zip = new (jszip_dist_jszip__WEBPACK_IMPORTED_MODULE_0___default())();
            zip.loadAsync(arrData).then(zipdata => {
                var cnt = 0;
                for (var fn in zipdata.files) {
                    if (zipdata.files[fn].dir) continue;
                    cnt++;
                }
                for (var fn in zipdata.files) {
                    if (zipdata.files[fn].dir) continue;
                    pre_item_cb(":" + fn);
                    zipdata.file(fn).async('arraybuffer')
                        .then(d => post_item_cb(d, cnt));
                }
            });
        } else {
            // 如果不是zip，直接传递给回调函数
            pre_item_cb("");
            post_item_cb(data, 1);
        }
    }

    return function (url, onLoad, onProgress, onError) {
        origin_load.bind(this)(url, data => {
            UnZip(data,
                fn => this.manager.itemStart(url/*+fn*/),
                (data, cnt) => {
                    onLoad(data, cnt);
                    this.manager.itemEnd(url);
                });
        }, onProgress, onError);
    };
})();



/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/******/ 	// the startup function
/******/ 	__webpack_require__.x = () => {
/******/ 		// Load entry module and return exports
/******/ 		// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 		var __webpack_exports__ = __webpack_require__.O(undefined, ["engine/three","engine/vendors"], () => (__webpack_require__("../src/core/model/loader/worker_parser.js")))
/******/ 		__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 		return __webpack_exports__;
/******/ 	};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks and sibling chunks for the entrypoint
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + "." + {"engine/three":"73ddf5705e795ccbfa63","engine/vendors":"5f412ba96ce45fda237e"}[chunkId] + ".js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) scriptUrl = scripts[scripts.length - 1].src
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl + "../";
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/importScripts chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded chunks
/******/ 		// "1" means "already loaded"
/******/ 		var installedChunks = {
/******/ 			"worker.parser": 1
/******/ 		};
/******/ 		
/******/ 		// importScripts chunk loading
/******/ 		var installChunk = (data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			for(var moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 				}
/******/ 			}
/******/ 			if(runtime) runtime(__webpack_require__);
/******/ 			while(chunkIds.length)
/******/ 				installedChunks[chunkIds.pop()] = 1;
/******/ 			parentChunkLoadingFunction(data);
/******/ 		};
/******/ 		__webpack_require__.f.i = (chunkId, promises) => {
/******/ 			// "1" is the signal for "already loaded"
/******/ 			if(!installedChunks[chunkId]) {
/******/ 				if(true) { // all chunks have JS
/******/ 					importScripts(__webpack_require__.p + __webpack_require__.u(chunkId));
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		var chunkLoadingGlobal = this["webpackChunkweb3d"] = this["webpackChunkweb3d"] || [];
/******/ 		var parentChunkLoadingFunction = chunkLoadingGlobal.push.bind(chunkLoadingGlobal);
/******/ 		chunkLoadingGlobal.push = installChunk;
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/startup chunk dependencies */
/******/ 	(() => {
/******/ 		var next = __webpack_require__.x;
/******/ 		__webpack_require__.x = () => {
/******/ 			return Promise.all([
/******/ 				__webpack_require__.e("engine/three"),
/******/ 				__webpack_require__.e("engine/vendors")
/******/ 			]).then(next);
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// run startup
/******/ 	var __webpack_exports__ = __webpack_require__.x();
/******/ 	
/******/ })()
;
//# sourceMappingURL=worker.parser.b138cc66c1a703085851.js.map