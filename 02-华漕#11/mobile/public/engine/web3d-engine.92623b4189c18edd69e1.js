/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "../src/core/Events.js":
/*!*****************************!*\
  !*** ../src/core/Events.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Events": () => (/* binding */ Events)
/* harmony export */ });
var Events = {
    LOAD_FINISH: url => Object({
        type: 'LOAD_FINISH',
        url: url
    }),
    LOAD_CHUNK_FINISH: (url, idxChunk, cntChunks, objs) => Object({
        type: 'LOAD_CHUNK_FINISH',
        url: url,
        index: idxChunk,
        count: cntChunks,
        new_objects: objs
    }),
    MODEL_ADD_OBJECT: obj => Object({
        type: 'MODEL_ADD_OBJECT',
        object: obj
    }),
    MODEL_BOUNDARY_CHANGE: boundary => Object({
        type: 'MODEL_BOUNDARY_CHANGE',
        boundary: boundary
    }),
    LOAD_INDEX_PROGRESS: (cur, total) => Object({
        type: 'LOAD_INDEX_PROGRESS',
        cur: cur,
        total: total
    }),
    RENDER_BEGIN_A_FRAME: timeStamp => Object({
        type: 'RENDER_BEGIN_A_FRAME',
        timestamp: timeStamp
    }),
    SCENE_INCREMENT: incre_segs => Object({
        type: "SCENE_INCREMENT",
        segments: incre_segs
    }),
    CLIP_PLANE_CHANGE: pln => Object({
        type: "CLIP_PLANE_CHANGE",
        plane: pln
    }),
    CLIP_GROUP_ADD_PLANE: (grp, pln) => Object({
        type: "CLIP_GROUP_ADD_PLANE",
        group: grp,
        plane: pln
    }),
    CLIP_GROUP_REMOVE_PLANE: (grp, pln) => Object({
        type: "CLIP_GROUP_REMOVE_PLANE",
        group: grp,
        plane: pln
    }),
    CLIP_GROUP_STATUS_CHANGE: grp => Object({
        type: "CLIP_GROUP_STATUS_CHANGE",
        group: grp
    }),
    CLIP_GROUP_LOCK: () => Object({
        type: "CLIP_GROUP_LOCK"
    }),
    CLIP_GROUP_UNLOCK: () => Object({
        type: "CLIP_GROUP_UNLOCK"
    }),
    CLIP_GROUP_CLIPPING: (vMove) => Object({
        type: "CLIP_GROUP_CLIPPING",
        clip_vector: vMove,
    }),
    CLIP_GROUP_CLIPPED: () => Object({
        type: "CLIP_GROUP_CLIPPED"
    }),
    SELECTION_CHANGED: (sel_obj, unsel_objs, pickPos, keys) => Object({
        type: 'SELECTION_CHANGED',
        object: sel_obj,
        unselect_objs: unsel_objs,
        pos: pickPos,
        shiftKey: keys.shiftKey,
        altKey: keys.altKey,
        ctrlKey: keys.ctrlKey,
    }),
    SUN_LIGHT_POS_CHANGED: (newPos) => Object({
        type: 'SUN_LIGHT_POS_CHANGED',
        pos: newPos
    }),
    OSET_ADDING: obj => Object({
        type: "OSET_ADDING",
        object: obj
    }),
    OSET_ADDED: obj => Object({
        type: "OSET_ADDED",
        object: obj
    }),
    OSET_DELETING: obj => Object({
        type: "OSET_DELETING",
        object: obj
    }),
    OSET_DELETED: obj => Object({
        type: "OSET_DELETED",
        object: obj
    }),

};




/***/ }),

/***/ "../src/core/Viewer.js":
/*!*****************************!*\
  !*** ../src/core/Viewer.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Viewer": () => (/* binding */ Viewer)
/* harmony export */ });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var _model_model_manager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./model/model_manager */ "../src/core/model/model_manager.js");
/* harmony import */ var _render_renderer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./render/renderer */ "../src/core/render/renderer.js");
/* harmony import */ var _render_scene_manager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./render/scene_manager */ "../src/core/render/scene_manager.js");
/* harmony import */ var _render_decoration_manager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./render/decoration_manager */ "../src/core/render/decoration_manager.js");
// Web3D接口类









const INIT_MAX_SCOPE = 1000;
const DEFAULT_MODEL_NAME = three__WEBPACK_IMPORTED_MODULE_4__.Math.generateUUID();

class Viewer extends three__WEBPACK_IMPORTED_MODULE_4__.EventDispatcher {
    /**
     * 参数说明：
     * opt - 包含一个对象，可指定如下参数
     *      sky、ground、axes - 天空、地面和坐标轴的显示开关
     *      width、height - 渲染时的视口宽、高
     *      setPixelRatio - 如需进行页面响应式开发（针对移动设备），需要在html中加入<meta>标记，
     *                      并需要在构造Viewer时，加入此参数
     */
    constructor(containerDOMElem, opt) {
        super();
        // DOM container
        this.container = containerDOMElem;
        var width = this.container.width;
        var height = this.container.height;

        // CAM
        this.camera = new three__WEBPACK_IMPORTED_MODULE_4__.PerspectiveCamera(30, width / height, 0.1, INIT_MAX_SCOPE * 2000);

        if (opt.camera) {
            this.camera.position.set(opt.camera.pos.x, opt.camera.pos.y, opt.camera.pos.z);
        } else {
            this.camera.position.set(1000, 1000, 300); // 默认的相机位置
        }

        // model manager
        this._modelManager = new _model_model_manager__WEBPACK_IMPORTED_MODULE_0__.ModelManager();
        this._modelManager.builtin.sky.visible = !!opt.sky;
        this._modelManager.builtin.ground.visible = !!opt.ground;
        this._modelManager.builtin.axes.visible = !!opt.axes;
        // scenes manager
        this._sceneManager = new _render_scene_manager__WEBPACK_IMPORTED_MODULE_2__.SceneManager(this._modelManager);
        this._decorationManager = new _render_decoration_manager__WEBPACK_IMPORTED_MODULE_3__.DecorationManager(this.container);

        // RENDERER
        opt = opt || {};
        opt.width = width;
        opt.height = height;
        opt.sceneManager = this._sceneManager;
        opt.modelManager = this._modelManager;
        opt.decorationManager = this._decorationManager;
        opt.camera = this.camera;
        opt.container = this.container;
        this._renderer = new _render_renderer__WEBPACK_IMPORTED_MODULE_1__.Renderer(opt);
        var lastDrawObjectsNum = 0;
        this._renderer.addEventListener("RENDER_ALL", e => {
            if (lastDrawObjectsNum != this._modelManager.all.length) {
                lastDrawObjectsNum = this._modelManager.all.length;
                e.info.objects = lastDrawObjectsNum;
                console.groupCollapsed(`绘制完毕：${e.info.triangles}/${e.info.objects}`);
                console.table([e.info], [
                    "objects",
                    "geometries",
                    "triangles",
                    "textures",
                    "frame"
                ]);
                console.groupEnd();
            }
        });
        this.rebuild_delay = 10000; // ms
        this._renderer.start();

        this._modelManager.addEventListener("LOAD_FINISH", e => {
            try {
                this.dispatchEvent(e);
            } catch (e) { }
            // 重置场景：重新排序，并在下一次重绘时按新次序重新生成帧（场景）
            this.rebuild(true, false);
            // this.redraw();
        });
        this._modelManager.addEventListener("MODEL_ADD_OBJECT", e => {
            try {
                this.dispatchEvent(e);
            } catch (e) { }
            // 重置场景：重新排序，并在下一次重绘时按新次序重新生成帧（场景）
            this.rebuild(false, false);
        });
        this._modelManager.addEventListener("LOAD_CHUNK_FINISH", e => {
            // 目前一个chunk就是一个对象
            if (e.index % Math.min(Math.round(e.count / 5), 2000) == 0) {
                let orgdelay = this.rebuild_delay;
                this.rebuild_delay = 5000;
                this.rebuild();
                this.rebuild_delay = orgdelay;
            }
            try {
                this.dispatchEvent(e);
            } catch (e) { }
        });
        this._modelManager.addEventListener("MODEL_BOUNDARY_CHANGE", e => {
            // 重置相机和交互控制器的范围
            // TODO: 需完善更多需要更新的状态
            var sz = new three__WEBPACK_IMPORTED_MODULE_4__.Vector3();
            this._modelManager.BoundingBox.getSize(sz);
            var maxDim = Math.max(sz.x, sz.y, sz.z);
            this.camera.far = 2000 * maxDim;
            if (!!this.Controller)
                this.Controller.maxDistance = 50 * maxDim;
        });

    }

    redraw(debugMsg = "") {
        this._renderer.redraw(debugMsg);
    }
    rebuild(immediately = false, redraw = true) {
        if (!!this._timeoutID) {
            clearTimeout(this._timeoutID);
        }
        var rebfn = () => {
            console.debug('重新排序，并重置帧（场景）信息')
            var b;
            if (!!this.ClipBox && this.ClipBox.active)
                b = this.ClipBox.CurrentBox;
            this._modelManager.resort(b);
            this._sceneManager.reset();
            delete this._timeoutID;
            if (redraw) this.redraw("rebuild");
        };
        if (immediately) rebfn();
        else this._timeoutID = setTimeout(rebfn, this.rebuild_delay);
    }

    look(opt/*{pos, target/dir, redraw [optional]}*/) {
        function fixV(v) {
            if (v.isVector3) return v;
            if (Array.isArray(v))
                return new three__WEBPACK_IMPORTED_MODULE_4__.Vector3(...v);
            return new three__WEBPACK_IMPORTED_MODULE_4__.Vector3(v.x, v.y, v.z);
        }
        if (!!opt.pos) opt.pos = fixV(opt.pos);
        if (!opt.target) {
            opt.target = new three__WEBPACK_IMPORTED_MODULE_4__.Vector3;
            var b = this.CurrentBoundingBox;
            if (!!b) {
                var c = new three__WEBPACK_IMPORTED_MODULE_4__.Vector3;
                b.getCenter(c);
                if (!!opt.dir && !!opt.pos) {
                    opt.dir = fixV(opt.dir);
                    opt.dir.normalize();
                    c.sub(opt.pos);
                    c.projectOnVector(opt.dir);
                    opt.target.addVectors(opt.pos, c);
                } else {
                    opt.target.copy(c);
                }
            }
        } else
            opt.target = fixV(opt.target);
        if (!!opt.pos) {
            this.camera.position.set(opt.pos.x, opt.pos.y, opt.pos.z);
        }
        if (!!this.Controller) {
            this.Controller.target.set(opt.target.x, opt.target.y, opt.target.z);
            this.Controller.update();
        } else {
            this.camera.lookAt(opt.target.x, opt.target.y, opt.target.z);
            this.camera.updateProjectionMatrix();
        }
        if (!!opt.redraw)
            this.redraw("calling \"look\"");
    }

    getViewInfo() {
        return {
            pos: this.camera.position.toArray(),
            target: this.Controller.target.toArray()
        };
    }

    fitToView(box = null) {
        if (!box) {
            if (!!this.Selection && this.Selection.Current.size > 0) {
                box = new three__WEBPACK_IMPORTED_MODULE_4__.Box3();
                for (var o of this.Selection.Current) {
                    box.expandByObject(o);
                }
            } else {
                box = this.CurrentBoundingBox;
            }
        }
        if (!box) return;
        var arg = { pos: this.camera.position.clone(), target: new three__WEBPACK_IMPORTED_MODULE_4__.Vector3() };
        box.getCenter(arg.target);
        var dir = new three__WEBPACK_IMPORTED_MODULE_4__.Vector3();
        this.camera.getWorldDirection(dir);
        // 平移相机，对准模型中心
        var vMove = new three__WEBPACK_IMPORTED_MODULE_4__.Vector3();
        vMove.subVectors(arg.target, arg.pos);
        var vDist = vMove.clone();
        vDist.projectOnVector(dir);
        vMove.sub(vDist);
        arg.pos.add(vMove);
        // 前后调整相机，以便投影整个模型
        // 计算视图坐标系的横纵轴方向
        var up = this.camera.up.clone();
        up.projectOnPlane(dir);
        up.normalize();
        if (up.length() < 0.01) {
            up.set(Math.cos(this.camera.rotation.z),
                Math.sin(this.camera.rotation.z));
        }
        var left = new three__WEBPACK_IMPORTED_MODULE_4__.Vector3();
        left.crossVectors(up, dir);
        // 计算双向视角
        var tanV = Math.tan(this.camera.fov / 2 / 180 * Math.PI);
        var tanH = this.camera.aspect * tanV;
        // 计算每个点位于边界时的中心点距离，并取最远的一个
        var lt = 0;
        for (var i = 0; i < 8; i++) {
            var p = new three__WEBPACK_IMPORTED_MODULE_4__.Vector3();
            if (i < 4) p.x = box.min.x; else p.x = box.max.x;
            if (Math.floor(i / 2) % 2 > 0) p.y = box.max.y; else p.y = box.min.y;
            if (i % 2 > 0) p.z = box.max.z; else p.z = box.min.z;
            p.sub(arg.target);
            var l = Math.max(
                Math.abs(p.dot(up) / tanV),
                Math.abs(p.dot(left) / tanH))
                - p.dot(dir);
            if (lt < l) {
                lt = l;
            }
        }
        dir.setLength(lt * 1.1);
        arg.pos.subVectors(arg.target, dir)
        this.look(arg);
    }

    resize(width, height) {
        if (width > 0 && height > 0) {
            this.container.width = width;
            this.container.height = height;
        }
        else {
            width = this.container.width;
            height = this.container.height;
        }

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        this._renderer.setSize(width, height, true);
        this.redraw();
    }

    get DefaultModelName() {
        return DEFAULT_MODEL_NAME;
    }

    load(model_url, ...args) {
        var fn_mesh_callback;
        var model_name = this.DefaultModelName;
        var edge_url = null;
        args.forEach(arg => {
            switch (typeof (arg)) {
                case 'function':
                    fn_mesh_callback = arg;
                    break;
                case 'string':
                    model_name = arg;
                    break;
                case 'object':
                    edge_url = arg.edge;
                    if ('model' in arg)
                        model_name = arg.model;
                    break;
            }
        });
        this._modelManager.loadGLTF(model_name,
            model_url, m => {
                if (!fn_mesh_callback)
                    return true;
                return fn_mesh_callback(m);
            }, edge_url);
    }

    add(o, modelName) {
        if (!modelName)
            modelName = this.DefaultModelName;
        this._modelManager.add(modelName, o);
    }

    pick(clientPos, onPick, objsToPick, ignoreHiden = true) {
        if (!objsToPick)
            objsToPick = this._modelManager.segments_group.children;
        else if (objsToPick.isObject3D)
            objsToPick = [objsToPick];
        var canvas = this._renderer.domElement;
        var rect = canvas.getBoundingClientRect();
        var pos = new three__WEBPACK_IMPORTED_MODULE_4__.Vector2(clientPos.x, clientPos.y);
        pos.x = (pos.x / (rect.right - rect.left)) * 2 - 1;
        pos.y = -(pos.y / (rect.bottom - rect.top)) * 2 + 1;

        var raycaster = new three__WEBPACK_IMPORTED_MODULE_4__.Raycaster();
        raycaster.setFromCamera(pos, this.camera);
        var objs = raycaster.intersectObjects(objsToPick, true);
        ////////////////////////
        // 内置过滤
        var clips = null, bIntersect = false;
        if (!!this.Selection) {
            clips = this.Selection.HighlightMaterial.clippingPlanes;
            bIntersect = this.Selection.HighlightMaterial.clipIntersection;
        }
        objs = objs.filter(o => {
            if (!o.object.Selectable) return false;
            if (!ignoreHiden) return true;
            if (!o.object.visible)
                return false;
            if (!!clips && clips.length > 0) {
                var bAll = true;
                for (var i = 0; i < clips.length; i++) {
                    var clip = clips[i];
                    if (o.point.dot(clip.normal) < -clip.constant) {
                        if (!bIntersect) return false;
                    } else if (bIntersect) {
                        bAll = false;
                        break;
                    }
                }
                if (bAll && bIntersect)
                    return false;
            }
            return true;
        });
        ////////////////////////
        var i = 0;
        if (!!onPick) {
            var cnt = objs.length;
            for (; i < cnt; i++) {
                var ret = onPick(objs[i]);
                if (ret === undefined || !!ret)
                    break;
            }
        }
        return objs[i];
    }
    get Renderer() {
        return this._renderer;
    }
    get ModelManager() {
        return this._modelManager;
    }
    get SceneManager() {
        return this._sceneManager;
    }
    get DecorationManager() {
        return this._decorationManager;
    }
    get LightManager() {
        return this._modelManager.lights;
    }
    get CurrentBoundingBox() {
        if (!!this.ClipBox && this.ClipBox.active)
            return this.ClipBox.CurrentBox;
        else
            return this._modelManager.BoundingBox.clone();
    }
}



/***/ }),

/***/ "../src/core/model/element_group.js":
/*!******************************************!*\
  !*** ../src/core/model/element_group.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ElementGroup": () => (/* binding */ ElementGroup)
/* harmony export */ });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var _utils_observed_set__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/observed_set */ "../src/core/utils/observed_set.js");


// import { Events } from "../Events";


const PRIVATE = {
    "HLMATERIAL": Symbol("EG_HLMATERIAL"),
    "OPACITY": Symbol("EG_OPACITY"),
    "DYEING": Symbol("EG_DYEING"),
    "TRANSPARENT": Symbol("EG_TRANSPARENT"),
    "VISIBLE": Symbol("EG_VISIBLE"),
    "FN_TRANS_MAT": Symbol("EG_FN_TRANSPARENT_MAT"),
    "FN_TRANS_OBJ": Symbol("EG_FN_TRANS_OBJ"),
    "FN_DYE_OBJ": Symbol("EG_FN_DYE_OBJ"),
    "EG_EXCLUSIVE": Symbol("EG_EXCLUSIVE"),
}

class ElementGroup extends _utils_observed_set__WEBPACK_IMPORTED_MODULE_0__.ObservedSet {
    constructor(...args) {
        let init_elems = args;
        if (args.length == 1 && Array.isArray(args[0]))
            init_elems = args[0];
        var init_exclude = true;
        if (typeof (init_elems[0]) == "boolean") {
            init_exclude = init_elems.shift();
        }
        super(init_elems);

        this[PRIVATE.HLMATERIAL] =
            new three__WEBPACK_IMPORTED_MODULE_1__.MeshLambertMaterial({ color: 0x880000 });
        this[PRIVATE.HLMATERIAL].transparent = true;
        this[PRIVATE.HLMATERIAL].opacity = 0.8;
        this[PRIVATE.HLMATERIAL].clipShadows = true;
        this[PRIVATE.OPACITY] = 1.0; // 完全不透明
        this[PRIVATE.EG_EXCLUSIVE] = init_exclude;
        this[PRIVATE.TRANSPARENT] = false;
        this[PRIVATE.DYEING] = false;
        this[PRIVATE.VISIBLE] = true;

        this.trans_mat_map = new Map();

        var onAdd = o => {
            if (!o.elgroups) o.elgroups = new Set();
            if (this[PRIVATE.EG_EXCLUSIVE]) {
                let gs = [...o.elgroups];
                gs.forEach(g => g.delete(o));
                console.assert(o.elgroups.size == 0,
                    "ElementGroup未能正常执行排他处理！");
            }
            o.elgroups.add(this);
            // 优先级：隐藏 > 染色 > 透明
            this[PRIVATE.FN_TRANS_OBJ](o);
            this[PRIVATE.FN_DYE_OBJ](o);
            o.visible = this.Visible;
        }
        init_elems.forEach(onAdd);

        this.addEventListener("OSET_ADDED", e => {
            onAdd(e.object);
        });
        this.addEventListener("OSET_DELETED", e => {
            let o = e.object;
            let dyeing = this[PRIVATE.DYEING];
            let transparent = this[PRIVATE.TRANSPARENT];
            this[PRIVATE.DYEING] = false;
            this[PRIVATE.TRANSPARENT] = false;
            this[PRIVATE.FN_DYE_OBJ](o);
            this[PRIVATE.FN_TRANS_OBJ](o);
            o.visible = true;
            this[PRIVATE.DYEING] = dyeing;
            this[PRIVATE.TRANSPARENT] = transparent;
            o.elgroups.delete(this);
        });
    }
    static [PRIVATE.FN_TRANS_MAT](mat, opacity) {
        mat.opacity = opacity;
        mat.transparent = (opacity < 1.0);
    }
    [PRIVATE.FN_TRANS_OBJ](o) {
        if (this.isTransparent) {
            if (!o.originMat) {
                o.originMat = o.material;
            }
            if (o.material != o.originMat && o.material != this[PRIVATE.HLMATERIAL]) {
                if (Array.isArray(o.material))
                    o.material.forEach(m => m.dispose());
                else
                    o.material.dispose();
            }
            var clone_mat = (m) => {
                var newMat = this.trans_mat_map.get(m.uuid);
                if (!newMat) {
                    newMat = m.clone();
                    ElementGroup[PRIVATE.FN_TRANS_MAT](newMat, this[PRIVATE.OPACITY]);
                    this.trans_mat_map.set(m.uuid, newMat);
                }
                return newMat;
            };
            var mat = o.originMat;
            if (Array.isArray(mat)) {
                mat = mat.map(clone_mat);
            } else {
                mat = clone_mat(mat);
            }
            o.material = mat;
        } else {
            if (!!o.originMat) {
                o.material = o.originMat;
                delete o.originMat;
            } else {
                console.debug("ElementGroup: Transparent status error. object was't set to be transparent!");
            }
        }
    }
    [PRIVATE.FN_DYE_OBJ](o) {
        if (this.isDyeing) {
            if (!o.originMat) {
                o.originMat = o.material;
            }
            o.material = this[PRIVATE.HLMATERIAL];
            // 此处将被染色物体的剖切状态用于染色的材质，但无法支持复杂剖切情况，如同时使用复杂剖切，结果不可预料
            var mat = Array.isArray(o.originMat) ? o.originMat[0] : o.originMat;
            this[PRIVATE.HLMATERIAL].set_clip_planes(mat.clippingPlanes, mat.clipIntersection);
        } else if (!this.isTransparent) {
            if (!!o.originMat) {
                o.material = o.originMat;
                delete o.originMat;
            } else {
                console.debug("ElementGroup: Dye status error. object was't dyed!");
            }
        }
    }
    get Exclusive() {
        return this[PRIVATE.EG_EXCLUSIVE];
    }
    set Exclusive(v) {
        this[PRIVATE.EG_EXCLUSIVE] = v;
    }
    // 染色
    Dye(bSet = true) {
        this[PRIVATE.DYEING] = bSet;
        this.forEach(o => this[PRIVATE.FN_DYE_OBJ](o));
        if (!bSet && this.isTransparent) {
            this.forEach(o => this[PRIVATE.FN_TRANS_OBJ](o));
        }
    }
    get DyeColor() {
        return this[PRIVATE.HLMATERIAL].color;
    }
    set DyeColor(v) {
        if (v.isColor) {
            this[PRIVATE.HLMATERIAL].color = v;
            return;
        }
        this[PRIVATE.HLMATERIAL].color.set(v);
    }
    get DyeOpacity() {
        return this[PRIVATE.HLMATERIAL].opacity;
    }
    set DyeOpacity(v) {
        ElementGroup[PRIVATE.FN_TRANS_MAT](this[PRIVATE.HLMATERIAL], v);
    }
    get isDyeing() {
        return this[PRIVATE.DYEING];
    }
    get HighlightMaterial() {
        return this[PRIVATE.HLMATERIAL];
    }
    // 透明
    ShowTransparent(bSet = true) {
        this[PRIVATE.TRANSPARENT] = bSet;
        if (this.isDyeing) return;
        this.forEach(o => this[PRIVATE.FN_TRANS_OBJ](o));
    }
    get Opacity() {
        return this[PRIVATE.OPACITY];
    }
    set Opacity(v) {
        this[PRIVATE.OPACITY] = v;
        this.trans_mat_map.forEach(m => {
            ElementGroup[PRIVATE.FN_TRANS_MAT](m, v);
        });
    }
    get isTransparent() {
        return this[PRIVATE.TRANSPARENT];
    }
    // 隐藏/显示
    get Visible() {
        return this[PRIVATE.VISIBLE];
    }
    set Visible(v) {
        this[PRIVATE.VISIBLE] = v;
        this.forEach(o => o.visible = v);
    }
    // 根据构件ID集合构造
    static fromIDs(model_manager, idsArray) {
        var idset = new Set(idsArray);
        var set = new ElementGroup();
        idset.forEach(id => {
            set.add(model_manager.getItem(id));
        });
        return set;
    }
}




/***/ }),

/***/ "../src/core/model/light_manager.js":
/*!******************************************!*\
  !*** ../src/core/model/light_manager.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LightManager": () => (/* binding */ LightManager)
/* harmony export */ });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var _utils_named_array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/named_array */ "../src/core/utils/named_array.js");
/* harmony import */ var _Events__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Events */ "../src/core/Events.js");





// 模型管理类
class LightManager extends _utils_named_array__WEBPACK_IMPORTED_MODULE_0__.NamedArray {
    constructor() {
        super(null, []);
        this._builtInNames.push("Ambient");
        this._builtInNames.push("Hemisphere");
        this._builtInNames.push("Directional");
        this.add("Ambient", three__WEBPACK_IMPORTED_MODULE_2__.AmbientLight, 0xffffff, 0.8);
        this.add("Hemisphere", three__WEBPACK_IMPORTED_MODULE_2__.HemisphereLight, 0xffffff, 0xffffff, 0);
        this.add("Directional", three__WEBPACK_IMPORTED_MODULE_2__.DirectionalLight, 0xffffff, 0.8);
        this.Directional.castShadow = false;
        this.Directional.shadow.mapSize.width = 2048;
        this.Directional.shadow.mapSize.height = 2048;
        var d = 100000;
        this.Directional.shadow.camera.left = - d;
        this.Directional.shadow.camera.right = d;
        this.Directional.shadow.camera.top = d;
        this.Directional.shadow.camera.bottom = - d;
        this.Directional.shadow.camera.far = d;
        this.Directional.shadow.camera.near = 0.1;
        this.Directional.shadow.bias = - 0.0001;
        // 平行光源默认位置
        this.setSunLightDirection(5000, 5000, 7000);
    }
    setSunLightDirection(...sunPos) {
        if (!sunPos) return;
        var newpos = new three__WEBPACK_IMPORTED_MODULE_2__.Vector3();
        // TODO：研究Hemisphere光源的Position属性的作用
        if (!!sunPos[0].x) {
            function fix(v) {
                return typeof (v) != 'number' ? 0 : v;
            }
            sunPos[0].x = fix(sunPos[0].x);
            sunPos[0].y = fix(sunPos[0].y);
            sunPos[0].z = fix(sunPos[0].z);
            newpos.copy(sunPos[0]);
        } else {
            newpos.set(...sunPos);
        }
        this.Hemisphere.position.copy(newpos);
        this.Directional.position.copy(newpos);
        this.events.dispatchEvent(_Events__WEBPACK_IMPORTED_MODULE_1__.Events.SUN_LIGHT_POS_CHANGED(newpos));
    }
    _changeSunDir(dimName, value) {
        var newpos = new three__WEBPACK_IMPORTED_MODULE_2__.Vector3();
        this.getSunLightPosition(newpos);
        newpos[dimName] = value;
        this.setSunLightDirection(newpos);
    }
    set SunLightDirX(v) {
        this._changeSunDir('x', v);
    }
    set SunLightDirY(v) {
        this._changeSunDir('y', v);
    }
    set SunLightDirZ(v) {
        this._changeSunDir('z', v);
    }
    set SunLightAngle(a) {
        this.SunLightDirX = 10000 * Math.cos(a * Math.PI / 180);
        this.SunLightDirY = 10000 * Math.sin(a * Math.PI / 180);
    }
    get SunLightDirX() {
        return this.Directional.position.x;
    }
    get SunLightDirY() {
        return this.Directional.position.y;
    }
    get SunLightDirZ() {
        return this.Directional.position.z;
    }
    get SunLightAngle() {
        if (Math.abs(this.SunLightDirX) > 0) {
            let a = Math.atan(this.SunLightDirY
                / this.SunLightDirX) * 180 / Math.PI;
            if (a * this.SunLightDirY < 0) a += 180;
            if (a > 360) a -= 360;
            return a;
        }
        else
            return this.SunLightDirY > 0 ? 90 : -90;
    }
    getSunLightPosition(posBuf) {
        posBuf.x = this.Directional.position.x;
        posBuf.y = this.Directional.position.y;
        posBuf.z = this.Directional.position.z;
    }

    get events() {
        if (!this._events)
            this._events = new three__WEBPACK_IMPORTED_MODULE_2__.EventDispatcher();
        return this._events;
    }
    addEventListener(...params) {
        this.events.addEventListener(...params);
    }
    removeEventListener(...params) {
        this.events.removeEventListener(...params);
    }
}




/***/ }),

/***/ "../src/core/model/loader/edgeloader.js":
/*!**********************************************!*\
  !*** ../src/core/model/loader/edgeloader.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "EdgeLoader": () => (/* binding */ EdgeLoader)
/* harmony export */ });
/* harmony import */ var _worker_pool__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./worker_pool */ "../src/core/model/loader/worker_pool.js");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");



class EdgeLoader {
    constructor() {
        this.loader_worker_pool = new _worker_pool__WEBPACK_IMPORTED_MODULE_0__.WorkerPool(_worker_pool__WEBPACK_IMPORTED_MODULE_0__.WorkerFactories.LOADER, 1);
        this.loaded_cbs = new Map;
        this.chunk_colors = new Map;
        this.loader_worker_pool.onmessage = e => {
            var url = e.data.url;
            var fnCallbacks = this.loaded_cbs.get(url);
            if (!fnCallbacks) return;
            var color = this.chunk_colors.get(url);
            if (!color) color = 0x9999bb;
            switch (e.data.type) {
                case "loading":
                    if (!!fnCallbacks.loading) {
                        fnCallbacks.loading(url,
                            e.data.download_info.loaded,
                            e.data.download_info.total);
                    }
                    break;
                case "loaded":
                    var jsonEdges = null;
                    jsonEdges = JSON.parse(three__WEBPACK_IMPORTED_MODULE_1__.LoaderUtils.decodeText(e.data.data_buffer));
                    if (!('edges' in jsonEdges)) jsonEdges.edges = jsonEdges.borders;
                    var material = null;
                    if (color.isMaterial)
                        material = color;
                    else
                        material = new three__WEBPACK_IMPORTED_MODULE_1__.LineBasicMaterial({ color: color });
                    jsonEdges.edges.forEach(B => {
                        var geometry = new three__WEBPACK_IMPORTED_MODULE_1__.BufferGeometry();
                        geometry.setIndex(B.index);
                        geometry.setAttribute('position',
                            new three__WEBPACK_IMPORTED_MODULE_1__.Float32BufferAttribute(B.vertices, 3));
                        var linesEdge = new three__WEBPACK_IMPORTED_MODULE_1__.LineSegments(geometry, material);
                        linesEdge.uuid = B.uuid;
                        fnCallbacks.chunk(linesEdge);
                    });
                    break;
                case "load_error":
                    if (!!fnCallbacks.error) {
                        fnCallbacks.error(e.data.error);
                    } else {
                        console.error(e.data.error);
                    }
                    break;
            }
        };
    }
    load(url, onDownload, onLoadChunk, onError = null, mat = 0x9999bb) {
        this.loaded_cbs.set(url, {
            loading: onDownload,
            chunk: onLoadChunk,
            error: onError
        });
        this.chunk_colors.set(url, mat);
        this.loader_worker_pool.run_a_worker({
            url: url
        });
    }
}




/***/ }),

/***/ "../src/core/model/loader/gltfloader_ex.js":
/*!*************************************************!*\
  !*** ../src/core/model/loader/gltfloader_ex.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "GLTFLoaderEx": () => (/* binding */ GLTFLoaderEx)
/* harmony export */ });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var _worker_pool__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./worker_pool */ "../src/core/model/loader/worker_pool.js");



class GLTFLoaderEx {
    constructor() {
        // 场景文件加载线程
        // 只创建一个场景文件加载线程，多个索引文件将排队
        this.loader_worker_pool = new _worker_pool__WEBPACK_IMPORTED_MODULE_0__.WorkerPool(_worker_pool__WEBPACK_IMPORTED_MODULE_0__.WorkerFactories.LOADER, 2);
        this.parser_worker_pool = new _worker_pool__WEBPACK_IMPORTED_MODULE_0__.WorkerPool(_worker_pool__WEBPACK_IMPORTED_MODULE_0__.WorkerFactories.PARSER);
        this.loaded_cbs = new Map;
        this.chunk_count = new Map;

        this.loader_worker_pool.onmessage = e => {
            var url = e.data.url;
            var fnCallbacks = this.loaded_cbs.get(url);
            if (!fnCallbacks) return;
            switch (e.data.type) {
                case "loading":
                    fnCallbacks.loading(url,
                        e.data.download_info.loaded,
                        e.data.download_info.total);
                    break;
                case "loaded":
                    delete e.data.type;
                    var url_base = three__WEBPACK_IMPORTED_MODULE_1__.LoaderUtils.extractUrlBase(url);
                    var arrData = new Uint8Array(e.data.data_buffer);
                    switch (arrData[0]) {
                        case 91: // '['
                            var gltf_urls = JSON.parse((new TextDecoder()).decode(arrData));
                            for (var gltfurl of gltf_urls) {
                                this.load(url_base + gltfurl,
                                    fnCallbacks.loading,
                                    fnCallbacks.chunk,
                                    fnCallbacks.error);
                            }
                            break;
                        case 123: // '{'
                            e.data.gltf_data = e.data.data_buffer;
                            delete e.data.data_buffer;
                            this.parser_worker_pool.run_a_worker(
                                e.data, // {url, gltf_data}
                                [e.data.gltf_data]);
                            break;
                    }
                    break;
                case "load_error":
                    if (!!fnCallbacks.error) {
                        fnCallbacks.error(e.data.error);
                    } else {
                        console.error(e.data.error);
                    }
                    break;
            }
        };
        // 场景解析线程
        this.parser_worker_pool.onmessage = e => {
            var { type, url, chunk } = e.data;
            var fnCallbacks = this.loaded_cbs.get(url);
            if (!fnCallbacks) return;
            var count = this.chunk_count.get(url);
            switch (type) {
                case "count":
                    this.chunk_count.set(url, count + e.data.count);
                    break;
                case "chunk":
                    var loader = new three__WEBPACK_IMPORTED_MODULE_1__.ObjectLoader();
                    var threeScene = loader.parse(chunk);
                    fnCallbacks.chunk(threeScene, url, count);
                    break;
            }
        };
    }
    load(url, onDownload, onLoadChunk, onError) {
        this.loaded_cbs.set(url, {
            loading: onDownload,
            chunk: onLoadChunk,
            error: onError
        });
        this.chunk_count.set(url, 0);
        this.loader_worker_pool.run_a_worker({
            url: url
        });
    }
}



/***/ }),

/***/ "../src/core/model/loader/worker_pool.js":
/*!***********************************************!*\
  !*** ../src/core/model/loader/worker_pool.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "WorkerFactories": () => (/* binding */ WorkerFactories),
/* harmony export */   "WorkerPool": () => (/* binding */ WorkerPool)
/* harmony export */ });
let WorkerFactories = {
    LOADER() {
        return new Worker(new URL(
            /* webpackChunkName: 'worker.loader' */
            /* worker import */ __webpack_require__.p + __webpack_require__.u("worker.loader"), __webpack_require__.b
        ));
    },
    PARSER() {
        return new Worker(new URL(
            /* webpackChunkName: 'worker.parser' */
            /* worker import */ __webpack_require__.p + __webpack_require__.u("worker.parser"), __webpack_require__.b
        ));
    }
};

// TODO: 在WorkerFactory类中考虑worker的最终释放
class WorkerPool {
    // constructor(WorkerClass, max) {
    constructor(worker_factory, max) {
        this.maxWorkers = max ? max : 4;
        this.workers = [];
        this.onmessage = null;

        for (var i = 0; i < this.maxWorkers; i++) {
            this.workers.push(worker_factory());
        }
        var scopt = this;
        this.workers.forEach(w => {
            w.jobs = 0;
            w.onmessage = (msg => {
                if (msg.data.type == "done") {
                    w.jobs--;
                } else {
                    if (!!scopt.onmessage)
                        scopt.onmessage(msg);
                }
            })
        });
    }
    run_a_worker(param, blob_to_worker/* arraybuffer */) {
        var select, cnt = -1;;
        for (var i in this.workers) {
            var w = this.workers[i];
            if (cnt < 0 || cnt > w.jobs) {
                cnt = w.jobs;
                select = w;
            }
        }
        select.jobs++;
        select.postMessage(param, blob_to_worker);
    }
}



/***/ }),

/***/ "../src/core/model/model_manager.js":
/*!******************************************!*\
  !*** ../src/core/model/model_manager.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ModelManager": () => (/* binding */ ModelManager)
/* harmony export */ });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var _sky__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./sky */ "../src/core/model/sky.js");
/* harmony import */ var _utils_named_array__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/named_array */ "../src/core/utils/named_array.js");
/* harmony import */ var _loader_edgeloader__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./loader/edgeloader */ "../src/core/model/loader/edgeloader.js");
/* harmony import */ var _loader_gltfloader_ex__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./loader/gltfloader_ex */ "../src/core/model/loader/gltfloader_ex.js");
/* harmony import */ var _light_manager__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./light_manager */ "../src/core/model/light_manager.js");
/* harmony import */ var _Events__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../Events */ "../src/core/Events.js");
/* harmony import */ var _element_group__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./element_group */ "../src/core/model/element_group.js");

//import { Sky } from "three/examples/jsm/objects/Sky";










// 模型管理类
class ModelManager extends three__WEBPACK_IMPORTED_MODULE_7__.EventDispatcher {
    constructor() {
        super();
        this.builtin = new _utils_named_array__WEBPACK_IMPORTED_MODULE_1__.NamedArray(); // 包含场景所需的所有的内置元素
        this.builtin.add("axes", three__WEBPACK_IMPORTED_MODULE_7__.AxesHelper, 1);
        this.builtin.add("sky", _sky__WEBPACK_IMPORTED_MODULE_0__.Sky);
        var hexGroundAxisColor = 0xffdddd, hexGroundColor = 0xffffff;
        this.builtin.add("ground", three__WEBPACK_IMPORTED_MODULE_7__.GridHelper, 100000, 10000,
            hexGroundAxisColor, hexGroundColor);
        this.builtin.axes.scale.setScalar(1);
        this.builtin.sky.scale.setScalar(100000);
        this.builtin.sky.material.uniforms.luminance.value = 0.9;
        this.builtin.ground.rotation.x = Math.PI / 2;
        this.builtin.ground.material.transparent = true;
        this.builtin.ground.material.opacity = 0.4;

        // 模型元素管理
        this.segments_group = new three__WEBPACK_IMPORTED_MODULE_7__.Group(); // 包含除builtin以外，所有需要渲染的模型元素，用于拾取操作
        this.segments_not_transparent = []; // 渲染时先绘制不透明元素
        this.segments_transparent = []; // 后渲染透明元素
        // 多模型管理
        this.models = new _utils_named_array__WEBPACK_IMPORTED_MODULE_1__.NamedArray(Array);

        var scope = this;
        this.lights = new _light_manager__WEBPACK_IMPORTED_MODULE_4__.LightManager(); // 包含添加到所有场景中的灯光
        function set_sun_pos(...p) {
            if (typeof (p[0]) == "number") {
                p = { x: p[0], y: p[1], z: p[2] };
            } else if ('x' in p[0]) {
                p = { x: p[0].x, y: p[0].y, z: p[0].z };
            } else {
                throw "平行光源位置参数错误！";
            }
            scope.builtin.sky.material.uniforms.sunPosition.value.x = p.x;
            scope.builtin.sky.material.uniforms.sunPosition.value.y = p.y;
            scope.builtin.sky.material.uniforms.sunPosition.value.z = p.z;
        }
        this.lights.addEventListener("SUN_LIGHT_POS_CHANGED", e => {
            set_sun_pos(e.pos);
        });
        set_sun_pos(this.lights.SunLightDirX, this.lights.SunLightDirY,
            this.lights.SunLightDirZ);

        this._obj_id_map = new Map();
        this._edge_id_map = new Map();
        this._obj_mat_map = new Map();

        this.addEventListener("MODEL_BOUNDARY_CHANGE", e => {
            this._updateGroundSizeByBoundary();
        });
    }

    setGroundSize(size) {
        this.builtin.ground.geometry.dispose();
        var hexGroundAxisColor = 0xffdddd, hexGroundColor = 0xffffff;
        var cnt = Math.floor(size / 32.8); // 单位英尺
        if (cnt % 2 != 0) cnt += 1;
        if (cnt < 2) cnt = 2;
        this.builtin.ground.geometry = (new three__WEBPACK_IMPORTED_MODULE_7__.GridHelper(
            size, cnt, hexGroundAxisColor, hexGroundColor
        )).geometry;
    }

    _updateGroundSizeByBoundary() {
        var size = new three__WEBPACK_IMPORTED_MODULE_7__.Vector3(), center = new three__WEBPACK_IMPORTED_MODULE_7__.Vector3();
        this.segments_group.BoundingBox.getSize(size);
        size = Math.max(size.x, size.y) * 1.2;
        this.segments_group.BoundingBox.getCenter(center);
        this.builtin.ground.position.copy(center);
        this.builtin.ground.position.z = 0;
        this.setGroundSize(size);
    }

    loadGLTF(model_name, model_url, fn_mesh_callback, edges_url = null) {
        if (!!edges_url) {
            let edgeloader = new _loader_edgeloader__WEBPACK_IMPORTED_MODULE_2__.EdgeLoader();
            edgeloader.load(edges_url, null, edge => {
                edge.Selectable = false;
                this._edge_id_map.set(edge.uuid, edge);
                var obj = this._obj_id_map.get(edge.uuid);
                if (!!obj && !obj.edge) {
                    obj.add(edge);
                    obj.edge = edge;
                }
            }, null, new three__WEBPACK_IMPORTED_MODULE_7__.LineBasicMaterial({ color: 0x9999bb }));
        }
        // 单个glTF加载完毕后调用回调函数，以便调用方干预加载结果
        var cntLoadedChunk = 0;
        var chunk_finish_cb = (chunk, url, cntChunks) => {
            var cnt = chunk.children.length;
            this.loading = true;
            var chunk_objs = [];
            for (var i = 0; i < cnt; i++) {
                var mesh = chunk.children.pop(0);
                if (fn_mesh_callback) {
                    try {
                        if (!fn_mesh_callback(mesh)) continue;
                    } catch (e) {
                        console.error(e);
                    }
                }
                //////////////////
                // 归并材质 begin
                mesh.traverse(c => {
                    var m0 = c.material;
                    if (!m0) return;
                    if (!Array.isArray(m0) && !m0.isMaterial) {
                        throw "类型错误：glTF加载时Mesh对象的材质字段无效！";
                    }
                    var matSum;
                    var transMat2Str = (m) => {
                        var m1 = m.clone();
                        delete m1.uuid;
                        var s = JSON.stringify(m1);
                        m1.dispose();
                        return s;
                    };
                    if (m0.isMaterial) {
                        matSum = transMat2Str(m0);
                    } else { // isArray
                        matSum = m0.reduce((s, m) => {
                            s += transMat2Str(m);
                            return s;
                        }, "");
                    }
                    if (!this._obj_mat_map.has(matSum)) {
                        this._obj_mat_map.set(matSum, c.material);
                    }
                    m0 = this._obj_mat_map.get(matSum);
                    if (m0 != c.material) {
                        if (Array.isArray(c.material)) {
                            c.material.forEach(m => m.dispose());
                        } else {
                            c.material.dispose();
                        }
                        c.material = m0;
                    }
                });
                // 归并材质 end
                //////////////////
                this.add(model_name, mesh);
                chunk_objs.push(mesh);
            }
            delete this.loading;
            cntLoadedChunk++;
            this.dispatchEvent(_Events__WEBPACK_IMPORTED_MODULE_5__.Events.LOAD_CHUNK_FINISH(url, cntLoadedChunk, cntChunks, chunk_objs));
            if (cntLoadedChunk % Math.floor(cntChunks / 5) == 0)
                console.info(`模型加载: ${cntLoadedChunk}/${cntChunks}`);
            else
                console.debug(`模型加载: ${cntLoadedChunk}/${cntChunks}`);
            if (cntLoadedChunk === cntChunks) {
                console.info("模型加载完毕");
                this.dispatchEvent(_Events__WEBPACK_IMPORTED_MODULE_5__.Events.LOAD_FINISH(url));
                this.dispatchEvent(_Events__WEBPACK_IMPORTED_MODULE_5__.Events.MODEL_BOUNDARY_CHANGE(this.segments_group.BoundingBox));
            }
        }
        // 索引文件加载过程调试信息显示
        var load_index_progress_cb = (url, cur, total) => {
            console.info(`下载：${url} => ${Math.round(cur * 10000 / total) / 100}%`);
            this.dispatchEvent(_Events__WEBPACK_IMPORTED_MODULE_5__.Events.LOAD_INDEX_PROGRESS(cur, total));
        }

        var loader = new _loader_gltfloader_ex__WEBPACK_IMPORTED_MODULE_3__.GLTFLoaderEx();
        loader.load(model_url, load_index_progress_cb, chunk_finish_cb,
            // called when loading has errors
            error => {
                console.error(error);
            });
    }

    // 重新排序，决定分批绘制的次序
    resort(boundary) {
        if (!boundary) boundary = this.segments_group.BoundingBox;
        // 按尺寸优先、从外到内、从上到下顺序排序
        var c = new three__WEBPACK_IMPORTED_MODULE_7__.Vector3();
        var s = new three__WEBPACK_IMPORTED_MODULE_7__.Vector3();
        boundary.getCenter(c);
        boundary.getSize(s);
        // 重新计算每个物体的最大尺寸（X、Y、Z）和距模型中心的距离（归1后的距离）
        this.segments_group.traverse(o => {
            o.sortInfo = o.sortInfo || {};
            var b = o.BoundingBox;
            // 计算尺寸（体积）
            o.sortInfo.s = new three__WEBPACK_IMPORTED_MODULE_7__.Vector3();
            b.getSize(o.sortInfo.s);
            // o.sortInfo.s = Math.max(o.sortInfo.s.x, o.sortInfo.s.y, o.sortInfo.s.z);
            o.sortInfo.s = o.sortInfo.s.x * o.sortInfo.s.y * o.sortInfo.s.z;
            // 中心点归一化
            o.sortInfo.c = new three__WEBPACK_IMPORTED_MODULE_7__.Vector3();
            b.getCenter(o.sortInfo.c);
            o.sortInfo.c.sub(c);
            o.sortInfo.c.x /= s.x / 2;
            o.sortInfo.c.y /= s.y / 2;
            o.sortInfo.c.z /= s.z / 2;
            // 剖切计数
            o.sortInfo.cc = 0;
            var m = o.material;
            if (Array.isArray(m)) m = m[0];
            if (!!m) {
                var clips = m.clippingPlanes;
                if (!!clips) {
                    for (var p of clips) {
                        for (var pnt of b.vertices()) {
                            if (pnt.dot(p.normal) < -p.constant)
                                o.sortInfo.cc++;
                        }
                    }
                }
            }
        });
        // 排序依据
        function sort_policy(o1, o2) {
            // 剖切状态
            if (o1.sortInfo.cc != o2.sortInfo.cc) {
                return o1.sortInfo.cc - o2.sortInfo.cc;
            }
            var s1 = o1.sortInfo.s;
            var s2 = o2.sortInfo.s;
            var d1 = o1.sortInfo.c.length() * s1;
            var d2 = o2.sortInfo.c.length() * s2;
            // 距离差
            var dd = Math.abs(d1 - d2);
            // 尺寸比
            var ds = s2 / s1;
            // 综合比较
            if (dd > 0.2) {
                return d2 - d1;
            }
            if (ds > 2) return 1;
            else if (ds < 0.5) return -1;
            // 高度
            return o2.sortInfo.c.z - o1.sortInfo.c.z;
        }
        this.segments_not_transparent.sort(sort_policy);
        this.segments_transparent.sort(sort_policy);
    }

    add(model_name, obj) {
        if (!(obj && obj.isObject3D)) {
            console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.", object);
            return;
        }
        var isTransparent = false;
        // 修正过于理想的金属效果
        function fixMat(m) {
            // m.isMeshStandardMaterial == true
            if (!!m.metalness && m.metalness > 0.999) {
                m.roughness = 0.7; // 粗糙度
                m.metalness = 0.6; // 类金属
            }
        }
        obj.traverse(c => {
            if (!c.material) return;
            if (Array.isArray(c.material)) {
                c.material.forEach(fixMat);
            } else {
                fixMat(c.material);
            }
        });
        // 区分是否透明
        obj.traverse_interruptible(c => {
            if (!c.isMesh) return true;
            if (Array.isArray(c.material)) {
                for (var i in c.material) {
                    if (c.material[i].transparent) {
                        isTransparent = true;
                        return false;
                    }
                }
            } else {
                isTransparent = c.material.transparent;
                if (isTransparent) return false;
            }
        });
        obj.isTransparent = isTransparent;
        obj.model = model_name;
        if (isTransparent) this.segments_transparent.push(obj);
        else this.segments_not_transparent.push(obj);
        // 保存拾取对象集合
        this.segments_group.add(obj);
        obj.invalidBoundary();
        obj.parent = null; // 避免加入场景时，从segments_group中移除
        // 尝试添加边框数据
        var edge = this._edge_id_map.get(obj.uuid);
        if (!!edge) {
            obj.add(edge);
            obj.edge = edge;
        }
        // 存入对应模型集合
        this.models.add(model_name).push(obj);
        this._obj_id_map.set(obj.uuid, obj);
        if (!this.loading) {
            this.dispatchEvent(_Events__WEBPACK_IMPORTED_MODULE_5__.Events.MODEL_ADD_OBJECT(obj));
            this.dispatchEvent(_Events__WEBPACK_IMPORTED_MODULE_5__.Events.MODEL_BOUNDARY_CHANGE(this.segments_group.BoundingBox));
        }
    }

    remove(model_or_obj) {
        if (typeof (model_or_obj) == "string") {
            var model = this.models[model_or_obj];
            if (!!model) {
                this.models.remove(model_or_obj);
                model.forEach(o => this.remove(o));;
            }
        } else {
            var obj = model_or_obj;
            var t, m;
            m = this.models[obj.model];
            if (obj.isTransparent) {
                t = this.segments_transparent;
            } else {
                t = this.segments_not_transparent;
            }
            var im, it;
            if (!!m) {
                im = m.indexOf(obj);
                if (im > -1) m.splice(im, 1);
            }
            it = t.indexOf(obj);
            if (it > -1) t.splice(it, 1);
            this.segments_group.remove(obj);
            // TODO: 触发删除事件
        }
        this.segments_group.invalidBoundary();
        this.dispatchEvent(_Events__WEBPACK_IMPORTED_MODULE_5__.Events.MODEL_BOUNDARY_CHANGE(this.segments_group.BoundingBox));
    }

    getModel(model_name) {
        if (!model_name || !(typeof (model_name) == "string"))
            return;
        var m = this.models[model_name];
        if (!!m) {
            return new _element_group__WEBPACK_IMPORTED_MODULE_6__.ElementGroup(m);
        }
        return;
    }

    getItem(uuid) {
        return this._obj_id_map.get(uuid)
    }

    get all() { return this.segments_group.children; }

    get BoundingBox() { return this.segments_group.BoundingBox; }

    invalidBoundary() {
        this.segments_group.invalidBoundary();
        this.dispatchEvent(_Events__WEBPACK_IMPORTED_MODULE_5__.Events.MODEL_BOUNDARY_CHANGE(this.segments_group.BoundingBox));
    }
}



/***/ }),

/***/ "../src/core/model/shaders/shader_sky_with_sun.js":
/*!********************************************************!*\
  !*** ../src/core/model/shaders/shader_sky_with_sun.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "fragmentShader": () => (/* binding */ fragmentShader),
/* harmony export */   "uniforms": () => (/* binding */ uniforms),
/* harmony export */   "vertexShader": () => (/* binding */ vertexShader)
/* harmony export */ });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");


var uniforms = {
    "sunPosition": { value: new three__WEBPACK_IMPORTED_MODULE_0__.Vector3() },
    "luminance": { value: 1 },

    "turbidity": { value: 2 },
    "rayleigh": { value: 1 },
    "mieCoefficient": { value: 0.005 },
    "mieDirectionalG": { value: 0.8 }
};

var vertexShader = [
    'uniform vec3 sunPosition;',
    'uniform float rayleigh;',
    'uniform float turbidity;',
    'uniform float mieCoefficient;',

    'varying vec3 vWorldPosition;',
    'varying vec3 vSunDirection;',
    'varying float vSunfade;',
    'varying vec3 vBetaR;',
    'varying vec3 vBetaM;',
    'varying float vSunE;',

    'const vec3 up = vec3( 0.0, 0.0, 1.0 );',

    // constants for atmospheric scattering
    'const float e = 2.71828182845904523536028747135266249775724709369995957;',
    'const float pi = 3.141592653589793238462643383279502884197169;',

    // wavelength of used primaries, according to preetham
    'const vec3 lambda = vec3( 680E-9, 550E-9, 450E-9 );',
    // this pre-calcuation replaces older TotalRayleigh(vec3 lambda) function:
    // (8.0 * pow(pi, 3.0) * pow(pow(n, 2.0) - 1.0, 2.0) * (6.0 + 3.0 * pn)) / (3.0 * N * pow(lambda, vec3(4.0)) * (6.0 - 7.0 * pn))
    'const vec3 totalRayleigh = vec3( 5.804542996261093E-6, 1.3562911419845635E-5, 3.0265902468824876E-5 );',

    // mie stuff
    // K coefficient for the primaries
    'const float v = 4.0;',
    'const vec3 K = vec3( 0.686, 0.678, 0.666 );',
    // MieConst = pi * pow( ( 2.0 * pi ) / lambda, vec3( v - 2.0 ) ) * K
    'const vec3 MieConst = vec3( 1.8399918514433978E14, 2.7798023919660528E14, 4.0790479543861094E14 );',

    // earth shadow hack
    // cutoffAngle = pi / 1.95;
    'const float cutoffAngle = 1.6110731556870734;',
    'const float steepness = 1.5;',
    'const float EE = 1000.0;',

    'float sunIntensity( float zenithAngleCos ) {',
    '	zenithAngleCos = clamp( zenithAngleCos, -1.0, 1.0 );',
    '	return EE * max( 0.0, 1.0 - pow( e, -( ( cutoffAngle - acos( zenithAngleCos ) ) / steepness ) ) );',
    '}',

    'vec3 totalMie( float T ) {',
    '	float c = ( 0.2 * T ) * 10E-18;',
    '	return 0.434 * c * MieConst;',
    '}',

    'void main() {',

    '	vec4 worldPosition = modelMatrix * vec4( position, 1.0 );',
    '	vWorldPosition = worldPosition.xyz;',

    '	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
    '	gl_Position.z = gl_Position.w;', // set z to camera.far

    '	vSunDirection = normalize( sunPosition );',

    '	vSunE = sunIntensity( dot( vSunDirection, up ) );',

    '	vSunfade = 1.0 - clamp( 1.0 - exp( ( sunPosition.z / 450000.0 ) ), 0.0, 1.0 );',

    '	float rayleighCoefficient = rayleigh - ( 1.0 * ( 1.0 - vSunfade ) );',

    // extinction (absorbtion + out scattering)
    // rayleigh coefficients
    '	vBetaR = totalRayleigh * rayleighCoefficient;',

    // mie coefficients
    '	vBetaM = totalMie( turbidity ) * mieCoefficient;',

    '}'
].join('\n');

var fragmentShader = [
    'varying vec3 vWorldPosition;',
    'varying vec3 vSunDirection;',
    'varying float vSunfade;',
    'varying vec3 vBetaR;',
    'varying vec3 vBetaM;',
    'varying float vSunE;',

    'uniform float luminance;',
    'uniform float mieDirectionalG;',

    'const vec3 cameraPos = vec3( 0.0, 0.0, 0.0 );',

    // constants for atmospheric scattering
    'const float pi = 3.141592653589793238462643383279502884197169;',

    'const float n = 1.0003;', // refractive index of air
    'const float N = 2.545E25;', // number of molecules per unit volume for air at 288.15K and 1013mb (sea level -45 celsius)

    // optical length at zenith for molecules
    'const float rayleighZenithLength = 8.4E3;',
    'const float mieZenithLength = 1.25E3;',
    'const vec3 up = vec3( 0.0, 0.0, 1.0 );',
    // 66 arc seconds -> degrees, and the cosine of that
    'const float sunAngularDiameterCos = 0.999956676946448443553574619906976478926848692873900859324;',

    // 3.0 / ( 16.0 * pi )
    'const float THREE_OVER_SIXTEENPI = 0.05968310365946075;',
    // 1.0 / ( 4.0 * pi )
    'const float ONE_OVER_FOURPI = 0.07957747154594767;',

    'float rayleighPhase( float cosTheta ) {',
    '	return THREE_OVER_SIXTEENPI * ( 1.0 + pow( cosTheta, 2.0 ) );',
    '}',

    'float hgPhase( float cosTheta, float g ) {',
    '	float g2 = pow( g, 2.0 );',
    '	float inverse = 1.0 / pow( 1.0 - 2.0 * g * cosTheta + g2, 1.5 );',
    '	return ONE_OVER_FOURPI * ( ( 1.0 - g2 ) * inverse );',
    '}',

    // Filmic ToneMapping http://filmicgames.com/archives/75
    'const float A = 0.15;',
    'const float B = 0.50;',
    'const float C = 0.10;',
    'const float D = 0.20;',
    'const float E = 0.02;',
    'const float F = 0.30;',

    'const float whiteScale = 1.0748724675633854;', // 1.0 / Uncharted2Tonemap(1000.0)

    'vec3 Uncharted2Tonemap( vec3 x ) {',
    '	return ( ( x * ( A * x + C * B ) + D * E ) / ( x * ( A * x + B ) + D * F ) ) - E / F;',
    '}',


    'void main() {',
    // optical length
    // cutoff angle at 90 to avoid singularity in next formula.
    '	float zenithAngle = acos( max( 0.0, dot( up, normalize( vWorldPosition - cameraPos ) ) ) );',
    '	float inverse = 1.0 / ( cos( zenithAngle ) + 0.15 * pow( 93.885 - ( ( zenithAngle * 180.0 ) / pi ), -1.253 ) );',
    '	float sR = rayleighZenithLength * inverse;',
    '	float sM = mieZenithLength * inverse;',

    // combined extinction factor
    '	vec3 Fex = exp( -( vBetaR * sR + vBetaM * sM ) );',

    // in scattering
    '	float cosTheta = dot( normalize( vWorldPosition - cameraPos ), vSunDirection );',

    '	float rPhase = rayleighPhase( cosTheta * 0.5 + 0.5 );',
    '	vec3 betaRTheta = vBetaR * rPhase;',

    '	float mPhase = hgPhase( cosTheta, mieDirectionalG );',
    '	vec3 betaMTheta = vBetaM * mPhase;',

    '	vec3 Lin = pow( vSunE * ( ( betaRTheta + betaMTheta ) / ( vBetaR + vBetaM ) ) * ( 1.0 - Fex ), vec3( 1.5 ) );',
    '	Lin *= mix( vec3( 1.0 ), pow( vSunE * ( ( betaRTheta + betaMTheta ) / ( vBetaR + vBetaM ) ) * Fex, vec3( 1.0 / 2.0 ) ), clamp( pow( 1.0 - dot( up, vSunDirection ), 5.0 ), 0.0, 1.0 ) );',

    // nightsky
    '	vec3 direction = normalize( vWorldPosition - cameraPos );',
    '	float theta = acos( direction.z ); // elevation --> y-axis, [-pi/2, pi/2]',
    '	float phi = atan( direction.z, direction.x ); // azimuth --> x-axis [-pi/2, pi/2]',
    '	vec2 uv = vec2( phi, theta ) / vec2( 2.0 * pi, pi ) + vec2( 0.5, 0.0 );',
    '	vec3 L0 = vec3( 0.1 ) * Fex;',

    // composition + solar disc
    '	float sundisk = smoothstep( sunAngularDiameterCos, sunAngularDiameterCos + 0.00002, cosTheta );',
    '	L0 += ( vSunE * 19000.0 * Fex ) * sundisk;',

    '	vec3 texColor = ( Lin + L0 ) * 0.04 + vec3( 0.0, 0.0003, 0.00075 );',

    '	vec3 curr = Uncharted2Tonemap( ( log2( 2.0 / pow( luminance, 4.0 ) ) ) * texColor );',
    '	vec3 color = curr * whiteScale;',

    '	vec3 retColor = pow( color, vec3( 1.0 / ( 1.2 + ( 1.2 * vSunfade ) ) ) );',

    '	gl_FragColor = vec4( retColor, 1.0 );',

    '}'
].join('\n');



/***/ }),

/***/ "../src/core/model/sky.js":
/*!********************************!*\
  !*** ../src/core/model/sky.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Sky": () => (/* binding */ Sky)
/* harmony export */ });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var _shaders_shader_sky_with_sun__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./shaders/shader_sky_with_sun */ "../src/core/model/shaders/shader_sky_with_sun.js");
/**
 * @author zz85 / https://github.com/zz85
 *
 * Based on "A Practical Analytic Model for Daylight"
 * aka The Preetham Model, the de facto standard analytic skydome model
 * http://www.cs.utah.edu/~shirley/papers/sunsky/sunsky.pdf
 *
 * First implemented by Simon Wallner
 * http://www.simonwallner.at/projects/atmospheric-scattering
 *
 * Improved by Martin Upitis
 * http://blenderartists.org/forum/showthread.php?245954-preethams-sky-impementation-HDR
 *
 * Three.js integration by zz85 http://twitter.com/blurspline
*/




class Sky extends three__WEBPACK_IMPORTED_MODULE_1__.Mesh {
	constructor() {
		var material = new three__WEBPACK_IMPORTED_MODULE_1__.ShaderMaterial({
			fragmentShader: _shaders_shader_sky_with_sun__WEBPACK_IMPORTED_MODULE_0__.fragmentShader,
			vertexShader: _shaders_shader_sky_with_sun__WEBPACK_IMPORTED_MODULE_0__.vertexShader,
			uniforms: three__WEBPACK_IMPORTED_MODULE_1__.UniformsUtils.clone(_shaders_shader_sky_with_sun__WEBPACK_IMPORTED_MODULE_0__.uniforms),
			side: three__WEBPACK_IMPORTED_MODULE_1__.BackSide
		});
		super(new three__WEBPACK_IMPORTED_MODULE_1__.BoxBufferGeometry(1, 1, 1), material);
	}
}



/***/ }),

/***/ "../src/core/render/MockScene.js":
/*!***************************************!*\
  !*** ../src/core/render/MockScene.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MockScene": () => (/* binding */ MockScene)
/* harmony export */ });
/* harmony import */ var _utils_observed_set__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/observed_set */ "../src/core/utils/observed_set.js");


class MockScene {
    constructor() {
        this.hasCSS2D = false;
    }
    get type() { return "Scene"; }
    get children() {
        if (!this._children)
            this._children = new _utils_observed_set__WEBPACK_IMPORTED_MODULE_0__.ObservedSet();
        return this._children;
    }
    add(...oset) {
        this.children.add(...oset);
        oset.forEach(o => this.hasCSS2D = this.hasCSS2D || o.isCSS2DObject);
    }
    traverse_interruptible(callback) {
        if (!callback(this))
            return false;
        var ret = true;
        for (var o of this.children) {
            ret = o.traverse_interruptible(callback);
            if (!ret)
                break;
        }
        return ret;
    }
}




/***/ }),

/***/ "../src/core/render/decoration_manager.js":
/*!************************************************!*\
  !*** ../src/core/render/decoration_manager.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DecorationManager": () => (/* binding */ DecorationManager)
/* harmony export */ });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var _utils_named_array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/named_array */ "../src/core/utils/named_array.js");
/* harmony import */ var _MockScene__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./MockScene */ "../src/core/render/MockScene.js");
/* harmony import */ var three_examples_jsm_renderers_CSS2DRenderer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! three/examples/jsm/renderers/CSS2DRenderer */ "./node_modules/three/examples/jsm/renderers/CSS2DRenderer.js");






class DecorationManager extends _utils_named_array__WEBPACK_IMPORTED_MODULE_0__.NamedArray {
    constructor(domParent) {
        super(_MockScene__WEBPACK_IMPORTED_MODULE_1__.MockScene);
        this._renders = {
            CSS2D: new three_examples_jsm_renderers_CSS2DRenderer__WEBPACK_IMPORTED_MODULE_2__.CSS2DRenderer()
        };
        let cssHtmlElem = this._renders.CSS2D.domElement;
        cssHtmlElem.style.position = 'absolute';
        cssHtmlElem.style.top = '0px';
        cssHtmlElem.style.pointerEvents = 'none';
        domParent.appendChild(cssHtmlElem);

        this._scene = new three__WEBPACK_IMPORTED_MODULE_3__.Scene();
    }
    setSize(w, h) {
        this._renders.CSS2D.setSize(w, h);
    }
    addDecoScene(sceneIndex) {
        let item = super.add(sceneIndex);
        // 目前接口尽可能仅使用index进行调用，场景名称暂未完善
        if (typeof (sceneIndex) == "string") {
            item.name = sceneIndex;
        }
        return item;
    }
    addDecoration(obj, sceneIndex) {
        let scene = this.addDecoScene(sceneIndex);
        if (!scene) throw "无法找到或创建附加场景！";
        obj.deco_scene = scene;
        scene.add(obj);
    }
    removeDecoration(obj) {
        obj.deco_scene.children.delete(obj);
        delete obj.deco_scene;
    }
    render(is_first_frame, cam, ...indices) {
        if (is_first_frame)
            this._scene.clear();
        for (let i of indices) {
            let c = this[i];
            if (!c || !c.hasCSS2D || c.children.size < 1) continue;
            this._scene.add(...c.children);
        }
        this._renders.CSS2D.render(this._scene, cam);
    }
}




/***/ }),

/***/ "../src/core/render/renderer.js":
/*!**************************************!*\
  !*** ../src/core/render/renderer.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Renderer": () => (/* binding */ Renderer)
/* harmony export */ });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var three_examples_jsm_postprocessing_EffectComposer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three/examples/jsm/postprocessing/EffectComposer.js */ "./node_modules/three/examples/jsm/postprocessing/EffectComposer.js");
/* harmony import */ var three_examples_jsm_postprocessing_TexturePass_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three/examples/jsm/postprocessing/TexturePass.js */ "./node_modules/three/examples/jsm/postprocessing/TexturePass.js");
/* harmony import */ var three_examples_jsm_postprocessing_SavePass_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! three/examples/jsm/postprocessing/SavePass.js */ "./node_modules/three/examples/jsm/postprocessing/SavePass.js");
/* harmony import */ var three_examples_jsm_postprocessing_RenderPass_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! three/examples/jsm/postprocessing/RenderPass.js */ "./node_modules/three/examples/jsm/postprocessing/RenderPass.js");
/* harmony import */ var three_examples_jsm_postprocessing_ShaderPass_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! three/examples/jsm/postprocessing/ShaderPass.js */ "./node_modules/three/examples/jsm/postprocessing/ShaderPass.js");
/* harmony import */ var three_examples_jsm_postprocessing_ClearPass_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! three/examples/jsm/postprocessing/ClearPass.js */ "./node_modules/three/examples/jsm/postprocessing/ClearPass.js");
/* harmony import */ var three_examples_jsm_shaders_CopyShader_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! three/examples/jsm/shaders/CopyShader.js */ "./node_modules/three/examples/jsm/shaders/CopyShader.js");
/* harmony import */ var three_examples_jsm_shaders_FXAAShader_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! three/examples/jsm/shaders/FXAAShader.js */ "./node_modules/three/examples/jsm/shaders/FXAAShader.js");
/* harmony import */ var three_examples_jsm_postprocessing_OutlinePass_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! three/examples/jsm/postprocessing/OutlinePass.js */ "./node_modules/three/examples/jsm/postprocessing/OutlinePass.js");
/* harmony import */ var _Events__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../Events */ "../src/core/Events.js");













const FRAME_INFO = {
    SINGLE_FRAME_TIME: null, // 在第一次执行动画桢函数时记录当前浏览器单帧时间
    calc: function (timeStamp) {
        if (!!this.SINGLE_FRAME_TIME) return;
        // 计算最小单帧时间
        this.tmp = this.tmp || { cnt: 0 };
        if (!this.tmp.timeStamp) {
            this.tmp.timeStamp = timeStamp;
        } else {
            this.tmp.timespan = Math.round((timeStamp - this.tmp.timeStamp) * 1000) / 1000;
            if (this.tmp.cnt < 60) { // 计算60次的最小
                if (this.tmp.timespan < 100) { // 认为大于100无效
                    if (!this.tmp.min_time || this.tmp.timespan < this.tmp.min_time)
                        this.tmp.min_time = this.tmp.timespan;
                    this.tmp.cnt++;
                }
                this.tmp.timeStamp = timeStamp;
            } else {
                this.SINGLE_FRAME_TIME = this.tmp.min_time / 1000;
                delete this.tmp;
                delete this.calc;
                console.debug(`单帧绘制时间（平均）：${this.SINGLE_FRAME_TIME}s`);
            }
        }
    }
};

class Renderer extends three__WEBPACK_IMPORTED_MODULE_10__.EventDispatcher {
    constructor(opt) {
        super();
        // RENDERER
        opt = opt || {};
        this._sceneManager = opt.sceneManager;
        this._modelManager = opt.modelManager;
        this._camera = opt.camera;
        var width = opt.width, height = opt.height;
        if (typeof (opt.setPixelRatio) == 'undefined')
            opt.setPixelRatio = false;
        this._renderer = new three__WEBPACK_IMPORTED_MODULE_10__.WebGLRenderer({
            antialias: true,
            alpha: true,
            preserveDrawingBuffer: true
        });
        if (!!opt.setPixelRatio)
            this._renderer.setPixelRatio(window.devicePixelRatio);
        this._renderer.shadowMap.enabled = true;
        this._renderer.shadowMap.type = three__WEBPACK_IMPORTED_MODULE_10__.PCFSoftShadowMap;
        this._renderer.autoClear = false;
        this._renderer.info.autoReset = false;
        this._renderer.localClippingEnabled = true;
        this._renderer.debug.checkShaderErrors = false;
        opt.container.appendChild(this.domElement);

        this._decorations = opt.decorationManager;
        // 此处仅为兼容原有的addDirectly接口
        this._sceneManager._decos = this._decorations;

        // COMPOSERs
        this._effects = {};
        this._effects.clear = new three_examples_jsm_postprocessing_ClearPass_js__WEBPACK_IMPORTED_MODULE_5__.ClearPass(0xffffff, 1.0);

        //this._effects.outline = new OutlinePass({ x: width, y: height }, this.scenes.scene, this.camera);
        //this._effects.outline.clear = false;

        this._effects.fxaa = new three_examples_jsm_postprocessing_ShaderPass_js__WEBPACK_IMPORTED_MODULE_4__.ShaderPass(three_examples_jsm_shaders_FXAAShader_js__WEBPACK_IMPORTED_MODULE_7__.FXAAShader);
        this._effects.fxaa.clear = false;

        this.setSize(width, height);

        this.frame_time_ratio = opt.frameTimeRatio ?
            opt.frameTimeRatio : 0.5;
    }

    _render_loop(timeStamp) {
        if (FRAME_INFO.SINGLE_FRAME_TIME) {
            // 临时的规则：根据相机与模型的距离决定一次绘制多少三角面
            var box = this._modelManager.BoundingBox;
            var maxScenes = 6;
            if (!!box) {
                var size = new three__WEBPACK_IMPORTED_MODULE_10__.Vector3();
                box.getSize(size);
                var dist = box.distanceToPoint(this._camera.position);
                dist /= Math.max(size.x, size.y, size.z);
                if (dist < 0.2) {
                    maxScenes = 10;
                } else if (dist < 1) {
                    maxScenes = 8;
                } else if (dist < 2) {
                    maxScenes = 6;
                } else if (dist < 3) {
                    maxScenes = 4;
                } else {
                    maxScenes = 2;
                }
            }
            var sceneToRender;
            for (var i = 0; i < maxScenes; i++) {
                var scene = this.iterScene.next();
                if (scene.done) {
                    break;
                } else {
                    scene = scene.value;
                    if (!sceneToRender) {
                        sceneToRender = new three__WEBPACK_IMPORTED_MODULE_10__.Scene();
                        sceneToRender.decos = [];
                    }
                    let decos = this._decorations[scene.index];
                    sceneToRender.add(...scene.children);
                    if (!!decos && decos.children.size > 0)
                        sceneToRender.add(...decos.children);
                    sceneToRender.name += scene.name + " ";
                    sceneToRender.decos.push(scene.index);
                    // if (!!this.Controller)
                    //     this.Controller.update();
                }
            }
            if (!!sceneToRender) {
                // var clock = new THREE.Clock(true);
                this._render(this._camera, sceneToRender, this._isFirstScene);
                this._isFirstScene = false;
            }
            if (i < maxScenes && !this._isFirstScene) {
                var info = this.get_cur_info();
                this.dispatchEvent(Renderer.Events.RENDER_ALL(info));
                this._isFirstScene = true;
            }
        } else {
            FRAME_INFO.calc(timeStamp);
        }
        requestAnimationFrame(this._render_loop.bind(this));
    }
    _render(camera, scene, is_first_frame) {
        if (is_first_frame) {
            this._renderer.info.reset();
        }

        this._renderer.autoClear = is_first_frame;
        console.debug(`绘制场景：${scene.name}`);
        this._renderer.render(scene, camera);
        this._decorations.render(is_first_frame, camera, ...scene.decos);
    }

    start() {
        // 绘制流程
        this.redraw("start");
        requestAnimationFrame(this._render_loop.bind(this));
    }

    redraw(debugMsg = "") {
        console.debug(`重绘 ${!!debugMsg ? "(" + debugMsg + ")" : ""} ... `);
        this.iterScene = this._sceneManager.iterator();
        this._isFirstScene = true;
    }

    get_cur_info() {
        var output = {}, info = this._renderer.info;
        Object.assign(output, info.memory);
        Object.assign(output, info.render);
        return output;
    }

    setSize(width, height, updateStyle) {
        // this._renderBuffer.setSize(width, height);
        this._renderer.setSize(width, height, updateStyle);
        //this._effects.fxaa.uniforms['resolution'].value.set(1 / width, 1 / height);
        //this._effects.outline.resolution.set(width, height);

        this._decorations.setSize(width, height);
    }

    getSize(size) {
        this._renderer.getSize(size);
    }

    get domElement() {
        return this._renderer.domElement;
    }
}

Renderer.Events = {
    RENDER_ALL: info => Object({
        type: 'RENDER_ALL',
        info: info
    }),
};




/***/ }),

/***/ "../src/core/render/scene_manager.js":
/*!*******************************************!*\
  !*** ../src/core/render/scene_manager.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SceneManager": () => (/* binding */ SceneManager)
/* harmony export */ });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var _utils_named_array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/named_array */ "../src/core/utils/named_array.js");
/* harmony import */ var _Events__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Events */ "../src/core/Events.js");
/* harmony import */ var _MockScene__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./MockScene */ "../src/core/render/MockScene.js");





class SceneManager extends three__WEBPACK_IMPORTED_MODULE_3__.EventDispatcher {
    constructor(modelMgr, decoMgr) {
        super();
        this.scenes = new _utils_named_array__WEBPACK_IMPORTED_MODULE_0__.NamedArray(_MockScene__WEBPACK_IMPORTED_MODULE_2__.MockScene/*THREE.Scene*/);
        this.scenes._add_with_index = function () {
            var newIndex = this.length;
            var scene = this.add(`scene_${newIndex}`);
            if (scene.index === undefined) scene.index = newIndex;
            return scene;
        };
        this._modelMgr = modelMgr;
        this.dataEngine = {
            buildInfos: [0, 0, 0],
            segments: [
                modelMgr.segments_not_transparent,
                modelMgr.segments_transparent
            ],
            _curIndex: 0,
            next() {
                if (this._curIndex < this.buildInfos.length)
                    this._curIndex++;
                return this.current;
            },
            get current() {
                if (this._curIndex >= this.buildInfos.length)
                    return null;
                if (!this.segments[this._curIndex])
                    return null;
                var scope = this;
                return {
                    index: scope._curIndex,
                    get objIndex() {
                        return scope.buildInfos[scope._curIndex];
                    },
                    set objIndex(v) {
                        scope.buildInfos[scope._curIndex] = v;
                    },
                    segments: scope.segments[scope._curIndex]
                };
            },
            reset() {
                this.buildInfos = [0, 0, 0];
                this._curIndex = 0;
            }
        };
        this.reset();

        this._decos = decoMgr;
    }

    * iterator() {
        this._build_a_scene();
        for (let s of this.scenes) {
            this._build_a_scene();
            var empty = true;
            s.traverse_interruptible(c => {
                if (c.isGroup || c.isLight || c.isCamera || c.type == "Scene")
                    return true;
                if (c.visible) {
                    empty = false;
                    return false;
                }
                return true;
            });
            if (empty) {
                continue;
            } else {
                this._modelMgr.lights.forEach(l => s.add(l));
                yield s;
            }
        }
    }

    get Count() {
        return this.scenes.length;
    }

    // 需要重置所有场景时调用此函数
    reset() {
        this.scenes.remove();
        this.dataEngine.reset();

        var scene_0 = this.scenes._add_with_index();
        this._modelMgr.builtin.forEach(o => {
            scene_0.add(o);
        });
    }

    _build_a_scene(timeStamp) {
        const MAX_TRIANGLES = 10000;// 单场景的面片数控制参考值
        // 整理待处理的数据
        var cur = this.dataEngine.current;
        while (!!cur && cur.objIndex >= cur.segments.length)
            cur = this.dataEngine.next();
        if (!cur) return false; // 所有数据均已转换
        var curScene = this.scenes._add_with_index();
        var cntFaces = 0;

        // 将segments中buildInfo指向的对象加入场景curScene
        while (!!cur && cntFaces < MAX_TRIANGLES) {
            var cnt = cur.segments.length;
            for (var i = cur.objIndex; i < cnt && cntFaces < MAX_TRIANGLES; i++) {
                var obj3d = cur.segments[i];
                curScene.add(obj3d);
                cntFaces += obj3d.FacesCount;
            }
            cur.objIndex = i;
            if (cntFaces < MAX_TRIANGLES)
                cur = this.dataEngine.next();
        }
        // 增量绘制事件通知
        // this.dispatchEvent(Events.SCENE_INCREMENT(tmpScene));

        return true;
    }

    addDirectly(obj, sceneIndex = 0) {
        if (!this._decos) {
            throw "附加场景未初始化！";
        }
        this._decos.addDecoration(obj, sceneIndex);
        // this._modelMgr.dispatchEvent(Events.MODEL_ADD_OBJECT(obj));
    }
}




/***/ }),

/***/ "../src/core/utils/THREE_Ex.js":
/*!*************************************!*\
  !*** ../src/core/utils/THREE_Ex.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "enhance_threejs": () => (/* binding */ enhance_threejs)
/* harmony export */ });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var _shared_set__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./shared_set */ "../src/core/utils/shared_set.js");




function enhance_threejs() {
    three__WEBPACK_IMPORTED_MODULE_1__.Object3D.DefaultUp.set(0, 0, 1);

    Object.defineProperty(three__WEBPACK_IMPORTED_MODULE_1__.Object3D.prototype, 'BoundingBox', {
        enumerable: false,
        configurable: false,
        get: function () {
            if (!this._boundary) {
                if (!!this.geometry) {
                    this.geometry.computeBoundingBox();
                    this._boundary = this.geometry.boundingBox.clone().
                        applyMatrix4(this.matrixWorld);
                }
                var cnt = this.children.length;
                for (var i = 0; i < cnt; i++) {
                    var c = this.children[i];
                    if (!c.visible) continue;
                    var b = c.BoundingBox;
                    if (!!b) {
                        if (!!this._boundary) {
                            this._boundary = this._boundary.union(b);
                        } else {
                            this._boundary = b.clone();
                        }
                    }
                }
                if (!this.geometry && !!this._boundary) {
                    this._boundary = this._boundary.applyMatrix4(this.matrixWorld);
                }
            }
            return this._boundary;
        }
    });
    three__WEBPACK_IMPORTED_MODULE_1__.Object3D.prototype.invalidBoundary = function () {
        delete this._boundary;
        if (!!this.parent)
            this.parent.invalidBoundary();
    };

    Object.defineProperty(three__WEBPACK_IMPORTED_MODULE_1__.Object3D.prototype, 'FacesCount', {
        enumerable: false,
        configurable: false,
        get: function () {
            if (!this.geometry) return 0;
            if (!this.geometry.index) {
                var pos = this.geometry.attributes.position;
                if (!pos || (pos.count % 3) != 0) {
                    return 0;
                }
                return pos.count / 3;
            } else {
                // ASSERT(this.geometry.index.itemSize == 1)
                return this.geometry.index.count / 3;
            }
        }
    });

    Object.defineProperty(three__WEBPACK_IMPORTED_MODULE_1__.Object3D.prototype, 'Selectable', {
        enumerable: false,
        configurable: false,
        set: function (v) {
            this._selable = v;
        },
        get: function () {
            if (!("_selable" in this))
                this._selable = true;
            return this._selable;
        }
    });

    Object.defineProperty(three__WEBPACK_IMPORTED_MODULE_1__.Object3D.prototype, 'edge', {
        enumerable: false,
        configurable: false,
        set: function (v) {
            this._edge = v;
            let mat = null;
            if (Array.isArray(this.material)) {
                mat = this.material[0];
            } else {
                mat = this.material;
            }
            if (!!mat.clippingPlanes)
                this._edge.add_clip_planes(mat.clippingPlanes, mat.clipIntersection);
        },
        get: function () {
            if (!("_edge" in this))
                return null;
            return this._edge;
        }
    });

    three__WEBPACK_IMPORTED_MODULE_1__.Object3D.prototype.traverse_interruptible = function (callback) {
        if (!callback(this))
            return false;
        var children = this.children;
        var ret = true;
        for (var i = 0, l = children.length; i < l; i++) {
            ret = children[i].traverse_interruptible(callback);
            if (!ret)
                break;
        }
        return ret;
    };

    three__WEBPACK_IMPORTED_MODULE_1__.Box3.prototype.vertices = function* () {
        var m = ["min", "max"];
        var c = ["x", "y", "z"];
        for (var i = 0; i < 8; i++) {
            var z = m[Math.floor(i / 4)],
                y = m[Math.floor(i / 2) % 2],
                x = m[i % 2];
            yield new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(
                this[x].x,
                this[y].y,
                this[z].z
            );
        }
    }

    three__WEBPACK_IMPORTED_MODULE_1__.Box3.prototype.toJson = function () {
        return {
            max: this.max.toArray(),
            min: this.min.toArray()
        };
    }

    three__WEBPACK_IMPORTED_MODULE_1__.Box3.prototype.fromJson = function (boxJson) {
        this.max.fromArray(boxJson.max);
        this.min.fromArray(boxJson.min);
    }

    //////////////////////////////////
    // 对象剖切相关的功能封装
    // begin
    function traverse_mats(mats, fn) {
        if (Array.isArray(mats)) {
            for (var m of mats) {
                fn(m);
            }
        } else {
            fn(mats);
        }
    }
    function set_mats_clipping(materials, clippingPlanes, isIntersect) {
        if (!materials) return;
        if (!clippingPlanes) return;
        traverse_mats(materials, mat => {
            mat.clippingPlanes = [...clippingPlanes];
            mat.clipShadows = true;
            if (undefined !== isIntersect)
                mat.clipIntersection = !!isIntersect;
        });
    };

    function set_mats_clip_intersect(materials, isIntersect = false) {
        if (!materials) return;
        traverse_mats(materials, mat => {
            mat.clipIntersection = isIntersect;
        });
    }

    function clear_mats_clipping(materials) {
        if (!materials) return;
        traverse_mats(materials, mat => mat.clippingPlanes = []);
    };

    Object.defineProperty(three__WEBPACK_IMPORTED_MODULE_1__.Object3D.prototype, 'ClippingPlanesSet', {
        enumerable: false, configurable: false,
        get: function () {
            if (!this.clippingPlanesSet) {
                this.clippingPlanesSet = new _shared_set__WEBPACK_IMPORTED_MODULE_0__.SharedSet;
            }
            return this.clippingPlanesSet;
        }
    });

    three__WEBPACK_IMPORTED_MODULE_1__.Object3D.prototype.add_clip_planes = function (clippingPlanes, isIntersect) {
        var materials = this.material;
        if (!materials) return;
        for (var p of clippingPlanes) {
            this.ClippingPlanesSet.add(p);
        }
        set_mats_clipping(materials, this.ClippingPlanesSet, isIntersect);
        if (!!this._edge)
            this._edge.add_clip_planes(clippingPlanes, isIntersect);
    };

    three__WEBPACK_IMPORTED_MODULE_1__.Object3D.prototype.remove_clip_planes = function (clippingPlanes) {
        var materials = this.material;
        if (!materials) return;
        for (var p of clippingPlanes) {
            this.ClippingPlanesSet.delete(p);
        }
        set_mats_clipping(materials, this.ClippingPlanesSet);
        if (!!this._edge)
            this._edge.remove_clip_planes(clippingPlanes);
    };

    three__WEBPACK_IMPORTED_MODULE_1__.Object3D.prototype.clear_clip_planes = function () {
        var materials = this.material;
        if (!materials) return;
        clear_mats_clipping(materials);
        this.ClippingPlanesSet.clear();
        if (!!this._edge)
            this._edge.clear_clip_planes();
    };

    three__WEBPACK_IMPORTED_MODULE_1__.Object3D.prototype.set_clip_intersect = function (isIntersect = false) {
        var materials = this.material;
        if (!materials) return;
        set_mats_clip_intersect(materials, isIntersect);
        if (!!this._edge)
            this._edge.set_clip_intersect(isIntersect);
    };

    Object.defineProperty(three__WEBPACK_IMPORTED_MODULE_1__.Material.prototype, 'ClippingPlanesSet', {
        enumerable: false, configurable: false,
        get: function () {
            if (!this.clippingPlanesSet) {
                this.clippingPlanesSet = new _shared_set__WEBPACK_IMPORTED_MODULE_0__.SharedSet;
            }
            return this.clippingPlanesSet;
        }
    });

    three__WEBPACK_IMPORTED_MODULE_1__.Material.prototype.set_clip_intersect = function (isIntersect = false) {
        set_mats_clip_intersect(this, isIntersect);
    };

    three__WEBPACK_IMPORTED_MODULE_1__.Material.prototype.set_clip_planes = function (clippingPlanes, isIntersect) {
        set_mats_clipping(this, clippingPlanes, isIntersect);
    }

    three__WEBPACK_IMPORTED_MODULE_1__.Material.prototype.add_clip_planes = function (clippingPlanes, isIntersect) {
        for (var p of clippingPlanes) {
            this.ClippingPlanesSet.add(p);
        }
        set_mats_clipping(this, this.ClippingPlanesSet, isIntersect);
    }

    three__WEBPACK_IMPORTED_MODULE_1__.Material.prototype.remove_clip_planes = function (clippingPlanes) {
        for (var p of clippingPlanes) {
            this.ClippingPlanesSet.delete(p);
        }
        set_mats_clipping(this, this.ClippingPlanesSet);
    }

    three__WEBPACK_IMPORTED_MODULE_1__.Material.prototype.clear_clip_planes = function () {
        clear_mats_clipping(this);
    }
    // 对象剖切相关的功能封装
    // end
    //////////////////////////////////

}



/***/ }),

/***/ "../src/core/utils/named_array.js":
/*!****************************************!*\
  !*** ../src/core/utils/named_array.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "NamedArray": () => (/* binding */ NamedArray)
/* harmony export */ });


const PRI_ADD = Symbol("NARR_ADD");
class NamedArray extends Array {
    constructor(type, builtInNames) {
        super();
        this.elemType = type;
        if (!!builtInNames && builtInNames instanceof Array) {
            this._builtInNames = builtInNames.slice(0); // clone
            this._builtInNames.forEach(nm => {
                this.add(nm);
            });
        }
    }

    get BuiltInNames() {
        return this._builtInNames.slice(0);
    }

    [PRI_ADD](real_op, name, type, ...contructor_args) {
        if (name in this)
            return this[name];
        if (!type) type = this.elemType;
        if (!type) return null;
        var s = new type(...contructor_args);
        s.name = name;
        real_op(s);
        Object.defineProperty(this, name, {
            enumerable: false,
            configurable: true,
            get: function () {
                return s;
            }
        });
        return s;
    }

    add(name, type, ...contructor_args) {
        var This = this;
        return this[PRI_ADD](s => This.push(s),
            name, type, ...contructor_args);
    }

    insert(index, name, type, ...contructor_args) {
        var This = this;
        return this[PRI_ADD](s => This.splice(index, 0, s),
            name, type, ...contructor_args);
    }

    remove(...args) {
        if (args.length > 2) return;
        if (args.length == 0) {
            this.remove(0, this.length);
        } else if (args.length == 1) {
            var name = args[0];
            //if (!(name in this))
            if (!(name in this) || this._builtInNames.indexOf(name) > -1)
                return null;
            this.splice(this.indexOf(this[name]), 1);
            delete this[name];
        } else {
            var drop = this.splice(args[0], args[1]);
            for (var i in drop) {
                delete this[drop[i].name];
            }
        }
    }
}



/***/ }),

/***/ "../src/core/utils/observed_set.js":
/*!*****************************************!*\
  !*** ../src/core/utils/observed_set.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ObservedSet": () => (/* binding */ ObservedSet)
/* harmony export */ });
/* harmony import */ var core_Events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core/Events */ "../src/core/Events.js");



const PRIVATE = {
    "EVENT_MANAGER": Symbol("EVENT_MANAGER"),
}

class ObservedSet extends Set {
    constructor(arg) {
        super(arg);
    }
    get EventManager() {
        if (!this[PRIVATE.EVENT_MANAGER])
            this[PRIVATE.EVENT_MANAGER] = new THREE.EventDispatcher;
        return this[PRIVATE.EVENT_MANAGER];
    }
    addEventListener(...args) {
        this.EventManager.addEventListener(...args);
    }
    removeEventListener(...args) {
        this.EventManager.removeEventListener(...args);
    }
    // 集合操作重载
    add(...os) {
        var ret;
        for (var o of os) {
            this.EventManager.dispatchEvent(core_Events__WEBPACK_IMPORTED_MODULE_0__.Events.OSET_ADDING(o));
            if (!super.has(o)) {
                ret = super.add(o);
                if (super.has(o))
                    this.EventManager.dispatchEvent(core_Events__WEBPACK_IMPORTED_MODULE_0__.Events.OSET_ADDED(o));
            }
        }
        return ret;
    }
    delete(...os) {
        var ret = false;
        for (var o of os) {
            this.EventManager.dispatchEvent(core_Events__WEBPACK_IMPORTED_MODULE_0__.Events.OSET_DELETING(o));
            if (super.delete(o)) {
                ret = true;
                this.EventManager.dispatchEvent(core_Events__WEBPACK_IMPORTED_MODULE_0__.Events.OSET_DELETED(o));
            }
        }
        return ret;
    }
    clear() {
        var elarray = [...this];
        for (var o of elarray)
            this.EventManager.dispatchEvent(core_Events__WEBPACK_IMPORTED_MODULE_0__.Events.OSET_DELETING(o));
        super.clear();
        for (var o of elarray)
            this.EventManager.dispatchEvent(core_Events__WEBPACK_IMPORTED_MODULE_0__.Events.OSET_DELETED(o));
    }
}



/***/ }),

/***/ "../src/core/utils/shared_set.js":
/*!***************************************!*\
  !*** ../src/core/utils/shared_set.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SharedSet": () => (/* binding */ SharedSet)
/* harmony export */ });
/* harmony import */ var _observed_set__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./observed_set */ "../src/core/utils/observed_set.js");

// 定义一个集合类，其中存储的对象均对应一个引用计数，
// 即如果一个对象被add多次，也需要被delete多次才会从集合中去除
const REF_CNT = Symbol("REF_CNT");

class SharedSet extends _observed_set__WEBPACK_IMPORTED_MODULE_0__.ObservedSet {
    constructor(arg) {
        super(arg);
        this[REF_CNT] = new Map();
    }
    add(v) {
        if (this[REF_CNT].has(v)) {
            this[REF_CNT].set(v, this[REF_CNT].get(v) + 1);
            return this;
        }
        super.add(v);
        this[REF_CNT].set(v, 1);
        return this;
    }
    delete(v) {
        if (!this[REF_CNT].has(v)) return false;
        var cnt = this[REF_CNT].get(v);
        if (cnt < 2) {
            this[REF_CNT].delete(v);
            return super.delete(v);
        } else {
            this[REF_CNT].set(v, this[REF_CNT].get(v) - 1);
            return true;
        }
    }
    clear() {
        super.clear();
        this[REF_CNT].clear();
    }
}



/***/ }),

/***/ "../src/web3d.js":
/*!***********************!*\
  !*** ../src/web3d.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Web3D": () => (/* binding */ Web3D)
/* harmony export */ });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var core_Viewer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core/Viewer */ "../src/core/Viewer.js");
/* harmony import */ var core_model_element_group__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core/model/element_group */ "../src/core/model/element_group.js");
/* harmony import */ var core_utils_THREE_Ex__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core/utils/THREE_Ex */ "../src/core/utils/THREE_Ex.js");





(0,core_utils_THREE_Ex__WEBPACK_IMPORTED_MODULE_2__.enhance_threejs)();

var Web3D = {
    Viewer: core_Viewer__WEBPACK_IMPORTED_MODULE_0__.Viewer,
    ElementGroup: core_model_element_group__WEBPACK_IMPORTED_MODULE_1__.ElementGroup,
    Version: "v1.3.1",
    toString() {
        return `Web3D Engine ${this.Version}`
    }
}

if (!window.Web3D) {
    window.Web3D = Web3D;
    window.THREE = three__WEBPACK_IMPORTED_MODULE_3__;

}

console.info(`Engine version: ${Web3D.Version}`)




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
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "engine/" + chunkId + "." + {"worker.loader":"ef1f9a76622c609ac9c3","worker.parser":"b138cc66c1a703085851"}[chunkId] + ".js";
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
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		__webpack_require__.b = document.baseURI || self.location.href;
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"engine/web3d-engine": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = this["webpackChunkweb3d"] = this["webpackChunkweb3d"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["engine/three"], () => (__webpack_require__("../src/web3d.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=web3d-engine.92623b4189c18edd69e1.js.map