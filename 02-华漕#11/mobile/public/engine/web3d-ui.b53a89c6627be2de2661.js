(this["webpackChunkweb3d"] = this["webpackChunkweb3d"] || []).push([["engine/web3d-ui"],{

/***/ "../src/ui/business/DimensionBusiness.js":
/*!***********************************************!*\
  !*** ../src/ui/business/DimensionBusiness.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DimensionBusiness": () => (/* binding */ DimensionBusiness)
/* harmony export */ });
/* harmony import */ var _commands_dimension_DrawLine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../commands/dimension/DrawLine */ "../src/ui/commands/dimension/DrawLine.js");
/* harmony import */ var _commands_dimension_DrawLinePointToFace__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../commands/dimension/DrawLinePointToFace */ "../src/ui/commands/dimension/DrawLinePointToFace.js");
/* harmony import */ var _commands_dimension_DrawLinePointToLine__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../commands/dimension/DrawLinePointToLine */ "../src/ui/commands/dimension/DrawLinePointToLine.js");
/* harmony import */ var _pick_PointPick__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../pick/PointPick */ "../src/ui/pick/PointPick.js");
/* harmony import */ var _commands_dimension_CreatPoint__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../commands/dimension/CreatPoint */ "../src/ui/commands/dimension/CreatPoint.js");
/* harmony import */ var _lable_CreateLable__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../lable/CreateLable */ "../src/ui/lable/CreateLable.js");






let dataArray = [];
class DimensionBusiness {
    constructor(viewer) {
        this.viewer = viewer;
        this.drawLine = new _commands_dimension_DrawLine__WEBPACK_IMPORTED_MODULE_0__.DrawLine(viewer);
        this.drawLinePointToFace = new _commands_dimension_DrawLinePointToFace__WEBPACK_IMPORTED_MODULE_1__.DrawLinePointToFace(viewer);
        this.drawLinePointToLine = new _commands_dimension_DrawLinePointToLine__WEBPACK_IMPORTED_MODULE_2__.DrawLinePointToLine(viewer);
        this.pointPick = new _pick_PointPick__WEBPACK_IMPORTED_MODULE_3__.PointPick(viewer);
    }

    drawPointToPoint(obj) {
        this.pointPick.getPick(true);
        window.type = "point"
        // 点点测距
        this.drawLine.drawLine(obj, true);
        this.drawLinePointToFace.drawLinePointToFace();
        this.drawLinePointToLine.drawLinePointToLine();

    }

    drawPointToFace(obj) {
        this.hideEscTitle()
        this.pointPick.getPick(true)
        window.type = "face"
        // 点面测距
        this.drawLine.drawLine();
        this.drawLinePointToFace.drawLinePointToFace(obj, true);
        this.drawLinePointToLine.drawLinePointToLine();
    }

    drawPointToLine(obj) {
        this.hideEscTitle()
        this.pointPick.getPick(true)
        window.type = "line"
        // 点线测距
        this.drawLine.drawLine();
        this.drawLinePointToFace.drawLinePointToFace();
        this.drawLinePointToLine.drawLinePointToLine(obj, true);
    }

    //取消操作
    cancelOperation() {
        $(document).unbind('click');
        $(document).unbind('mousemove');
        this.pointPick.getPick();
        this.drawLine.drawLine();
        this.drawLinePointToFace.drawLinePointToFace();
        this.drawLinePointToLine.drawLinePointToLine();
        if (!!this.viewer.Selection) this.viewer.Selection.enable(true)
        this.viewer.DecorationManager._scene.children.forEach(item => {
            this.viewer.DecorationManager.removeDecoration(item)
        })
        this.viewer.redraw('start')
    }

    //确定绘线
    determineDrawLines() {
        this.viewer.DecorationManager._scene.children.forEach(item => {
            if (item.name == "point") {
                let position = new THREE.Vector3(item.position.x, item.position.y, item.position.z);
                dataArray.push(position);
            }
            this.viewer.DecorationManager.removeDecoration(item);
        })
        this.viewer.redraw("start");

        let obj = {
            type: window.type,
            everyLinePointsNew: window.everyLinePointsNew,
            verticalPoints: window.verticalPoints,
            verticalPointToLine: window.verticalPointToLine,
            dataArrayPoint: window.dataArray,
            dataArray: dataArray,
        };
        JSON.stringify(obj);
        return obj;
    }

    //根据所绘线名称显示
    drawLines(obj) {
        if (obj.type == "point") {
            if (obj.dataArrayPoint) {
                let points = []
                //去重标注
                obj.everyLinePointsNew = obj.everyLinePointsNew.reduce(function(tempArr, item) {
                    if (tempArr.findIndex((ele) => ele.id === item.id) === -1) {
                        tempArr.push(item)
                    }
                    return tempArr
                }, [])
                obj.everyLinePointsNew.forEach(item => {
                    points = []
                    item.oneLinePoints.oneLinePoints.forEach(itemPoint => {

                        //重新绘点
                        let point = new _commands_dimension_CreatPoint__WEBPACK_IMPORTED_MODULE_4__.CreatPoint(itemPoint)
                        let pointTable = point.createPoint(itemPoint, this.viewer, 'point')
                        this.viewer.DecorationManager.addDecoration(pointTable, 0)

                        //重新绘线
                        points.push(itemPoint.x)
                        points.push(itemPoint.y)
                        points.push(itemPoint.z)

                        const geometry = new THREE.BufferGeometry();
                        const vertices = new Float32Array(points);

                        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
                        const material = new THREE.MeshBasicMaterial({ color: 'white' });
                        material.depthFunc = THREE.AlwaysDepth
                        const line = new THREE.Line(geometry, material);
                        this.viewer.DecorationManager.addDecoration(line, 0)
                        this.viewer.redraw("start")
                    })
                    //重新绘制距离标注
                    item.taggingPoint.forEach(itemTaggingPoint => {
                        let table = new _lable_CreateLable__WEBPACK_IMPORTED_MODULE_5__.CreateLable(this.viewer)
                        let numText = table.create2DObject(itemTaggingPoint.num, itemTaggingPoint.pos, 'lineLabel')
                        this.viewer.DecorationManager.addDecoration(numText, 0)
                        this.viewer.redraw("start")
                        return
                    })
                })
            }
        } else if (obj.type == "face") {
            if (obj.verticalPoints) {
                obj.verticalPoints.forEach(item => {
                    //重新绘点
                    let point = new _commands_dimension_CreatPoint__WEBPACK_IMPORTED_MODULE_4__.CreatPoint(item.oneVertical[0])
                    let pointTable = point.createPoint(item.oneVertical[0], this.viewer, 'point')
                    this.viewer.DecorationManager.addDecoration(pointTable, 0)

                    let pointTable1 = point.createPoint(item.oneVertical[1], this.viewer, 'point')
                    this.viewer.DecorationManager.addDecoration(pointTable1, 0)

                    //重新绘制垂足
                    let pointSurface = new _lable_CreateLable__WEBPACK_IMPORTED_MODULE_5__.CreateLable(this.viewer)
                    let triangle = pointSurface.create2DObjectSvgPointSurface(item.oneVertical[2])
                    this.viewer.DecorationManager.addDecoration(triangle, 0)
                    this.viewer.redraw('start')

                    //重新绘制线
                    var geometry = new THREE.BufferGeometry();
                    var vertices = new Float32Array([
                        item.oneVertical[1].x, item.oneVertical[1].y, item.oneVertical[1].z,
                        item.oneVertical[2].x, item.oneVertical[2].y, item.oneVertical[2].z
                    ]);
                    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
                    var material = new THREE.LineDashedMaterial({ color: 0xff0000, dashSize: 0.05, gapSize: 0.05 });
                    material.depthFunc = THREE.AlwaysDepth
                    var mesh = new THREE.Line(geometry, material);
                    mesh.computeLineDistances(); //不可或缺的，若无，则线段不能显示为虚线
                    this.viewer.DecorationManager.addDecoration(mesh, 0)
                    this.viewer.redraw('start')


                    var geometry = new THREE.BufferGeometry();
                    var vertices = new Float32Array([
                        item.oneVertical[0].x, item.oneVertical[0].y, item.oneVertical[0].z,
                        item.oneVertical[2].x, item.oneVertical[2].y, item.oneVertical[2].z
                    ]);
                    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
                    var material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
                    material.depthFunc = THREE.AlwaysDepth
                    var mesh = new THREE.Line(geometry, material);
                    this.viewer.DecorationManager.addDecoration(mesh, 0)
                    this.viewer.redraw('start')

                    //重新绘制距离标注
                    item.taggingFace.forEach(item => {
                        let table = new _lable_CreateLable__WEBPACK_IMPORTED_MODULE_5__.CreateLable(this.viewer)
                        let numText = table.create2DObject(item.num, item.pos, 'lineLabel')
                        this.viewer.DecorationManager.addDecoration(numText, 0)
                        this.viewer.redraw("start")
                    })

                })
            }
        } else if (obj.type == "line") {
            if (obj.verticalPointToLine) {

                obj.verticalPointToLine.forEach(item => {
                    //重新绘点
                    let point = new _commands_dimension_CreatPoint__WEBPACK_IMPORTED_MODULE_4__.CreatPoint(item.oneVertical[0])
                    let pointTable = point.createPoint(item.oneVertical[0], this.viewer, 'point')
                    this.viewer.DecorationManager.addDecoration(pointTable, 0)


                    //重新绘制垂足
                    let pointSurface = new _lable_CreateLable__WEBPACK_IMPORTED_MODULE_5__.CreateLable(this.viewer)
                    let triangle = pointSurface.create2DObjectSvgDropFoot(item.oneVertical[1])
                    this.viewer.DecorationManager.addDecoration(triangle, 0)
                    this.viewer.redraw('start')

                    //重新绘线
                    var geometry = new THREE.BufferGeometry();
                    var vertices = new Float32Array([
                        item.oneVertical[0].x, item.oneVertical[0].y, item.oneVertical[0].z,
                        item.oneVertical[1].x, item.oneVertical[1].y, item.oneVertical[1].z
                    ]);
                    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
                    var material = new THREE.MeshBasicMaterial({ color: 0xffffff });
                    material.depthFunc = THREE.AlwaysDepth
                    var mesh = new THREE.Line(geometry, material);
                    this.viewer.DecorationManager.addDecoration(mesh, 0)
                    this.viewer.redraw('start')

                    //去重标注
                    item.taggingLine = item.taggingLine.reduce(function(tempArr, item) {
                        if (tempArr.findIndex((ele) => ele.pos.x === item.pos.x && ele.pos.y === item.pos.y && ele.pos.z === item.pos.z) === -1) {
                            tempArr.push(item)
                        }
                        return tempArr
                    }, [])
                    //重新绘制距离标注
                    item.taggingLine.forEach(item => {
                        let table = new _lable_CreateLable__WEBPACK_IMPORTED_MODULE_5__.CreateLable(this.viewer)
                        let numText = table.create2DObject(item.num, item.pos, 'lineLabel')
                        this.viewer.DecorationManager.addDecoration(numText, 0)
                        this.viewer.redraw("start")
                    })
                })
            }
        }
    }

    //清除
    clearBefore(obj) {
        this.drawLine.clearBefore();
        this.drawLinePointToFace.clearBefore();
        this.drawLinePointToLine.clearBefore();
        obj = {
            type: obj.type,
            everyLinePointsNew: [],
            verticalPoints: [],
            verticalPointToLine: [],
            dataArrayPoint: [],
            dataArray: [],
        };
        dataArray = [];
        window.dataArray = [];
        window.everyLinePointsNew = [];
        window.verticalPoints = [];
        window.verticalPointToLine = [];
        return obj;

    }

    hideEscTitle() {
        $("#measureEscTip").hide();
    }

    showEscTitle() {
        $("#measureEscTip").show();
    }
}



/***/ }),

/***/ "../src/ui/business/ElevationBusiness.js":
/*!***********************************************!*\
  !*** ../src/ui/business/ElevationBusiness.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ElevationBusiness": () => (/* binding */ ElevationBusiness)
/* harmony export */ });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var _capture_Capture__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../capture/Capture */ "../src/ui/capture/Capture.js");
/* harmony import */ var _commands_elevation_elevation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../commands/elevation/elevation */ "../src/ui/commands/elevation/elevation.js");



class ElevationBusiness{
    getElevation(viewer){
        let currentPoint = new three__WEBPACK_IMPORTED_MODULE_2__.Vector3()
        $(document).mousemove(function (event){
            let clientPos = {
                x:event.originalEvent.clientX,
                y:event.originalEvent.clientY,
            }

            if (typeof(viewer.pick(clientPos)) == "undefined"){
                return
            }else {
                currentPoint = viewer.pick(clientPos).point
            }
            //捕捉
            if (viewer.pick(clientPos).object.edge){
                let arr = viewer.pick(clientPos).object.edge.geometry.attributes.position.array
                let capture = new _capture_Capture__WEBPACK_IMPORTED_MODULE_0__.Capture(viewer)
                let point1 = capture.getCapture(viewer,arr,currentPoint)

                if (typeof(point1) == "undefined"){
                    return
                }else {
                    //point.set(point1.x,point1.y,point1.z)
                }
            }

        })

        //标高
        let elevation = new  _commands_elevation_elevation__WEBPACK_IMPORTED_MODULE_1__.Elevation(viewer)
        elevation.getHeight(viewer)
    }
}




/***/ }),

/***/ "../src/ui/capture/Capture.js":
/*!************************************!*\
  !*** ../src/ui/capture/Capture.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Capture": () => (/* binding */ Capture)
/* harmony export */ });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var _DrawFrame__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DrawFrame */ "../src/ui/capture/DrawFrame.js");


class Capture {
    constructor(viewer) {
        this.viewer = viewer
    }

    //捕获方法，jyp-捕获顶点
    getCapture(viewer, arr, currentPoint) {
        let that = this
        let pointAll = [] //jyp-相交物体顶点
        let pointIndex = []
        let newArr = Array.from(arr);

        let p1
        newArr.forEach((item, index) => {
            if (index % 3 == 0) {
                pointIndex.push(index)
            }

        })
        pointIndex.forEach(item => {
            let point = newArr.slice(item, item + 3)
            let pointV3 = new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(point[0], point[1], point[2])
            pointAll.push(pointV3)

        })
        let num = 0
        for (let i = 0; i < pointAll.length; i++) {
            num = that.calculateDistance(pointAll[i], currentPoint)

            /*jyp-计算物体顶点和鼠标点击点的距离
            小于0.05（为啥是0.05不知道？）则拾取到顶点，画一个小绿框，
            大于0.05，则检查现有场景是否有小绿框，有，则移除*/
            if (num <= 0.1) {
                p1 = pointAll[i]
                console.log('捕获成功')
                let frame = new _DrawFrame__WEBPACK_IMPORTED_MODULE_0__.DrawFrame()
                viewer.DecorationManager.addDecoration(frame.drawFrame(p1, viewer, 'drawFrame'), 0)
                viewer.redraw("start")
                return p1
            } else {
                viewer.DecorationManager._scene.children.forEach(item => {
                    if (item.name == 'frame' && !!item.deco_scene) {
                        viewer.DecorationManager.removeDecoration(item)
                        viewer.redraw("start")
                    }
                })
            }
        }
    }

    //计算距离
    calculateDistance(startPoint, endPoint) {
        let num = 0
        let line3 = new three__WEBPACK_IMPORTED_MODULE_1__.Line3()
        line3.start = startPoint
        line3.end = endPoint
        num = line3.distance()
        return num
    }
}



/***/ }),

/***/ "../src/ui/capture/CaptureLine.js":
/*!****************************************!*\
  !*** ../src/ui/capture/CaptureLine.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CaptureLine": () => (/* binding */ CaptureLine)
/* harmony export */ });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var _lable_CreateLable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../lable/CreateLable */ "../src/ui/lable/CreateLable.js");


class CaptureLine {
    constructor(viewer) {
        this.viewer = viewer
    }

    getCaptureLine(points, obj, v = false) {
        let scope = this;
        if (!this.eventHandlerCaptureLine) {
            this.eventHandlerCaptureLine = function(event) {
                event.preventDefault();
                let verticesArr;
                let verticesIndex; //顶点的index信息
                let verticesIndexEven = []; //顶点index为偶数的
                let pointIndex = [];
                let pointAll = [];
                let pos = {};
                let captureLineResult = {};
                switch (event.type) {
                    case 'touchmove':
                        pos.x = event.changedTouches[0].clientX - 16; //取小红点的位置
                        pos.y = event.changedTouches[0].clientY - 50;
                        break;
                    case 'mousemove':
                        pos.x = event.offsetX;
                        pos.y = event.offsetY;
                        break;
                    default:
                        return;
                }

                if (!scope.viewer.pick(pos)) return; //捕获失败

                verticesIndex = Array.from(scope.viewer.pick(pos).object._edge.geometry.index.array);
                verticesIndex.forEach((item, index) => {
                    if (index % 2 == 0) {
                        verticesIndexEven.push(index);
                    }
                })

                verticesArr = Array.from(scope.viewer.pick(pos).object.edge.geometry.attributes.position.array);
                verticesArr.forEach((item, index) => {
                    if (index % 3 == 0) {
                        pointIndex.push(index);
                    }
                })

                pointIndex.forEach(item => {
                    let pointVertices = verticesArr.slice(item, item + 3);
                    let point = new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(pointVertices[0], pointVertices[1], pointVertices[2]);
                    pointAll.push(point);
                })

                verticesIndexEven.forEach(item => {
                    let s = scope.viewer.pick(pos).point;

                    let d = new three__WEBPACK_IMPORTED_MODULE_1__.Vector3();
                    d.subVectors(s, pointAll[verticesIndex[item]]);

                    let dir = new three__WEBPACK_IMPORTED_MODULE_1__.Vector3();
                    dir.subVectors(pointAll[verticesIndex[item + 1]], pointAll[verticesIndex[item]]);

                    let add = new three__WEBPACK_IMPORTED_MODULE_1__.Vector3();
                    add.addVectors(pointAll[verticesIndex[item]], d.projectOnVector(dir));

                    let pOne = s;
                    let pTwo = add;
                    let line3 = new three__WEBPACK_IMPORTED_MODULE_1__.Line3(pTwo, pOne);
                    let num = line3.distance();
                    //鼠标移动的点和物体的边距离小于0.05，则拾取到边，画一条黄色线。
                    if (num < 0.1) {
                        $("#container").css("cursor", "default")
                        let d = new three__WEBPACK_IMPORTED_MODULE_1__.Vector3()
                        d.subVectors(points[0], pointAll[verticesIndex[item]])

                        let dir = new three__WEBPACK_IMPORTED_MODULE_1__.Vector3();
                        dir.subVectors(pointAll[verticesIndex[item + 1]], pointAll[verticesIndex[item]])

                        let add = new three__WEBPACK_IMPORTED_MODULE_1__.Vector3();
                        add.addVectors(pointAll[verticesIndex[item]], d.projectOnVector(dir));
                        captureLineResult = add;

                        let geometry = new three__WEBPACK_IMPORTED_MODULE_1__.BufferGeometry();
                        let vertices = new Float32Array([
                            pointAll[verticesIndex[item]].x, pointAll[verticesIndex[item]].y, pointAll[verticesIndex[item]].z,
                            pointAll[verticesIndex[item + 1]].x, pointAll[verticesIndex[item + 1]].y, pointAll[verticesIndex[item + 1]].z
                        ]);

                        geometry.setAttribute('position', new three__WEBPACK_IMPORTED_MODULE_1__.BufferAttribute(vertices, 3));
                        var material = new three__WEBPACK_IMPORTED_MODULE_1__.MeshBasicMaterial({ color: 0xffff00 });
                        material.depthFunc = three__WEBPACK_IMPORTED_MODULE_1__.AlwaysDepth;
                        var mesh = new three__WEBPACK_IMPORTED_MODULE_1__.Line(geometry, material);
                        mesh.name = "borderLine";

                        scope.viewer.DecorationManager.addDecoration(mesh, 0);
                        scope.viewer.redraw('start');
                    } else {
                        scope.viewer.DecorationManager._scene.children.forEach((item, index) => {
                            if (item.name == 'borderLine' && !!item.deco_scene) {
                                scope.viewer.DecorationManager.removeDecoration(item)
                                scope.viewer.redraw("start");
                            }
                        })
                    }
                })
                window.captureLineResult = captureLineResult;
            };
        }
        
        let canvas = scope.viewer.Renderer.domElement;
        let mobileMeaHandle = document.getElementById("mobileMeasureHandleArea"); //移动端操作手柄
        if (v) {
            if ('ontouchstart' in document.documentElement) {
                mobileMeaHandle.addEventListener('touchmove', scope.eventHandlerCaptureLine);
            } else {
                canvas.addEventListener('mousemove', scope.eventHandlerCaptureLine);
            }
        } else {
            canvas.removeEventListener('mousemove', scope.eventHandlerCaptureLine);
            mobileMeaHandle.removeEventListener('touchmove', scope.eventHandlerCaptureLine);
        }

    }
}



/***/ }),

/***/ "../src/ui/capture/DrawFrame.js":
/*!**************************************!*\
  !*** ../src/ui/capture/DrawFrame.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DrawFrame": () => (/* binding */ DrawFrame)
/* harmony export */ });
/* harmony import */ var _lable_CreateLable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../lable/CreateLable */ "../src/ui/lable/CreateLable.js");


class DrawFrame {
    constructor() {}

    //框，jyp-拾取到顶点画的小绿框
    drawFrame(pos, viewer, className) {
        let table = new _lable_CreateLable__WEBPACK_IMPORTED_MODULE_0__.CreateLable(viewer)
        let num = ''
        let name = 'frame'
        let frame = table.create2DObject(num, pos, className, name)
        return frame
    }
}


/***/ }),

/***/ "../src/ui/clip/clip_box.js":
/*!**********************************!*\
  !*** ../src/ui/clip/clip_box.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ClipBox": () => (/* binding */ ClipBox)
/* harmony export */ });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var core_Events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core/Events */ "../src/core/Events.js");
/* harmony import */ var _clip_group__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./clip_group */ "../src/ui/clip/clip_group.js");
/* harmony import */ var _clip_plane__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./clip_plane */ "../src/ui/clip/clip_plane.js");






const STATUS_OPACITY = {
    get deactive() { return 0.0 },
    get active() { return 0.1 },
    get locked() { return 0.3 }
};
const PLANE_INDEX = {
    get Xn() { return 0 },
    get Xp() { return 1 },
    get Yn() { return 2 },
    get Yp() { return 3 },
    get Zn() { return 4 },
    get Zp() { return 5 },
};

class ClipBox extends _clip_group__WEBPACK_IMPORTED_MODULE_1__.ClipGroup {
    /**
     * 剖切盒构造函数
     * opt.boundary指定剖切盒最大范围，此为可选参数，
     * 如果指定，则剖切框最大范围由此参数决定，
     * 如未指定则必须指定opt.viewer参数，剖切框范围将由模型范围动态决定。
     * opt.viewer参数为当前剖切框作用的渲染对象接口，
     * 指定此参数意味着剖切框将具备交互功能（可交互调整）。 */
    constructor(opt = {}) {
        opt.name = "ClipBox"
        super(opt);
        this.viewer = opt.viewer;
        this.boundary = opt.boundary; // max range
        this.boxColor = (!!opt.boxColor ? opt.boxColor : 0xeead55); // line color

        // 如果未指定剖切盒范围，则使用模型外包围盒（会随之变化）
        if (!this.boundary) {
            // 剖切盒范围根据模型范围动态设定
            if (!this.viewer) {
                throw new Error("无法获得剖切盒的最大范围，既未通过参数指定，又无法获得模型范围！");
            }
            var modelMgr = this.viewer.ModelManager;
            var update_max_boundary_by_model = () => {
                this.boundary = modelMgr.BoundingBox.clone();
                var delta = new three__WEBPACK_IMPORTED_MODULE_3__.Vector3(0.001, 0.001, 0.001);
                this.boundary.min.sub(delta);
                this.boundary.max.add(delta);
                // 添加6个剖切面，初始时与boundary一致
                this._update_planes_by_boundary();
            };
            if (!!modelMgr.BoundingBox) {
                // 如果此时（构造时）模型已经加载，则以包围盒为剖切盒最大范围
                update_max_boundary_by_model();
            }
            this.viewer.ModelManager.addEventListener("MODEL_BOUNDARY_CHANGE", e => {
                // 剖切盒最大范围根据包围盒范围变化
                update_max_boundary_by_model();
            });
        } else {
            this._update_planes_by_boundary();
        }

        // 交互剖切时的“活动”剖切面显示状态切换
        this.addEventListener("ACTIVEPLANE_CHANGE", e => {
            if (!!e.oldface) {
                var mat = this.MarksBox.material[e.oldface.materialIndex];
                mat.opacity = STATUS_OPACITY.deactive;
            }
            if (!!e.newface) {
                var mat = this.MarksBox.material[e.newface.materialIndex];
                mat.opacity = STATUS_OPACITY.active;
            }
        });
        // 交互剖切时的“锁定”剖切面显示状态切换
        this.addEventListener("PLANE_STATUS_CHANGE", e => {
            var mat = this.MarksBox.material[e.planeInfo.PickedFace.materialIndex];
            if (e.planeInfo.locked)
                mat.opacity = STATUS_OPACITY.locked;
            else
                mat.opacity = STATUS_OPACITY.active;
        });
    }
    // 交互剖切时的剖切面位置改变（根据事件参数中的交互移动向量）
    _move_plane(planeInfo, move_vector) {
        let face = planeInfo.PickedFace;
        let index = face.materialIndex;
        let ps = [...this.planesToClip];
        let p = ps[index];
        let pos0 = p.getPosition();
        let pos = pos0.clone();
        pos.add(move_vector);
        // 修正超出范围的pos
        let pb = this.boundary[["min", "max"][index % 2]];
        let pc = ps[Math.floor(index / 2) * 2 + 1 - (index % 2)];
        var sz = new three__WEBPACK_IMPORTED_MODULE_3__.Vector3();
        this.boundary.getSize(sz);
        sz = Math.min(sz.x, sz.y, sz.z);
        pc = pc.getPosition().addScaledVector(face.normal, sz / 1000);
        let l = face.normal.dot(pc);
        let g = face.normal.dot(pb);
        let v = face.normal.dot(pos);
        if (v < l) pos.copy(pc);
        else if (v > g) pos.copy(pb);
        //
        if (pos0.distanceTo(pos) > 0.001) {
            p.setFromPosition(pos);
            return true;
        }
        return false;
    }
    _update_planes_by_boundary() {
        this.updateByBoundary(false);
    }
    _update_marks_by_planes() {
        // 当前剖切盒
        var cur_box = this.CurrentBox;

        // 根据box3刷新几何坐标
        var update_geom = (geom, box) => {
            const pnts = ["min", "max"];
            const vertices = [];
            for (var i = 0; i < 8; i++) {
                vertices.push(box[pnts[parseInt((i + 1) / 2) % 2]]["x"]);
                vertices.push(box[pnts[parseInt(i / 2) % 2]]["y"]);
                vertices.push(box[pnts[parseInt(i / 4)]]["z"]);
            }
            if (geom.hasAttribute("position")) {
                geom.attributes.position.copyArray(vertices);
            } else {
                geom.setAttribute("position",
                    new three__WEBPACK_IMPORTED_MODULE_3__.Float32BufferAttribute(vertices, 3));
                // 注意，此处必须与PLANE_INDEX匹配
                geom.setIndex([
                    0, 4, 7, 7, 3, 0, // 左
                    1, 2, 6, 6, 5, 1, // 右
                    0, 1, 5, 5, 4, 0, // 前
                    2, 3, 7, 7, 6, 2, // 后
                    2, 1, 0, 0, 3, 2, // 下
                    4, 5, 6, 6, 7, 4, // 上
                ]);
                for (var i = 0; i < 6; i++) {
                    geom.addGroup(i * 6, 6, i);
                }
            }
            geom.computeVertexNormals();
            geom.computeBoundingBox();
            geom.computeBoundingSphere();
            geom.attributes.position.needsUpdate = true;
        };

        if (!this.MarksFrame) {
            this.MarksFrame = new three__WEBPACK_IMPORTED_MODULE_3__.Box3Helper(cur_box, this.boxColor);
            this.marks.add(this.MarksFrame);
            const marksBoxMaterails = [...function* () {
                var colors = [
                    0xff0000, 0xff0000,
                    0x00ff00, 0x00ff00,
                    0x0000ff, 0x0000ff
                ];
                for (var color of colors) {
                    var mat = new three__WEBPACK_IMPORTED_MODULE_3__.MeshBasicMaterial({
                        color: color,
                        side: three__WEBPACK_IMPORTED_MODULE_3__.DoubleSide
                    });
                    mat.transparent = true;
                    mat.opacity = STATUS_OPACITY.deactive;
                    mat.depthTest = true;
                    mat.depthWrite = false;
                    yield mat;
                }
            }()];
            const marksBoxGeometry = new three__WEBPACK_IMPORTED_MODULE_3__.BufferGeometry();
            update_geom(marksBoxGeometry, cur_box);
            this.MarksBox = new three__WEBPACK_IMPORTED_MODULE_3__.Mesh(marksBoxGeometry, marksBoxMaterails);
            this.MarksBox.name = "ClipBox_Marks"
            this.marks.addPickable(this.MarksBox);
        } else {
            // 调整几何尺寸和位置
            this.MarksFrame.box.copy(cur_box);
            update_geom(this.MarksBox.geometry, cur_box);
            this.MarksBox.invalidBoundary();
        }
    }
    _show_filter(dir_filter) {
        var mats = this.MarksBox.material;
        for (var mat of mats) {
            mat.opacity = STATUS_OPACITY.deactive;
        }
        if (dir_filter.x) {
            mats[PLANE_INDEX.Xn].opacity = STATUS_OPACITY.locked;
            mats[PLANE_INDEX.Xp].opacity = STATUS_OPACITY.locked;
        }
        if (dir_filter.y) {
            mats[PLANE_INDEX.Yn].opacity = STATUS_OPACITY.locked;
            mats[PLANE_INDEX.Yp].opacity = STATUS_OPACITY.locked;
        }
        if (dir_filter.z) {
            mats[PLANE_INDEX.Zn].opacity = STATUS_OPACITY.locked;
            mats[PLANE_INDEX.Zp].opacity = STATUS_OPACITY.locked;
        }
    }

    get CurrentBox() {
        // 根据剖切面构造box3
        var cur_box = new three__WEBPACK_IMPORTED_MODULE_3__.Box3;
        let ps = [...this.planesToClip];
        if (ps.length != 6) return null;
        var ms = ["min", "max"];
        for (var i = 0; i < 6; i++) {
            var m = ms[i % 2];
            var pos = ps[i].getPosition();
            if (i < 2) {
                cur_box[m].copy(pos);
            } else {
                cur_box[m].add(pos);
            }
        }
        return cur_box;
    }
    set CurrentBox(box) {
        let ps = [...this.planesToClip];
        var ms = ["min", "max"];
        for (var i = 0; i < 6; i++) {
            var m = ms[i % 2];
            ps[i].setFromPosition(box[m]);
        }
    }
    // bForce为true剖切盒才会随着剖切边界放大（强制回到边界位置）
    // 否则剖切盒只会随边界变小
    updateByBoundary(bForce = false) {
        if (!this.boundary) return;
        let m = ["min", "max"];
        if (this.count > 0) {
            let p = [...this.planesToClip];
            for (var i = 0; i < 6; i++) {
                if (!bForce && this.boundary.intersectsPlane(p[i].plane)) {
                    continue;
                }
                p[i].setFromPosition(this.boundary[m[i % 2]]);
            }
        } else {
            for (var i = 0; i < 6; i++) {
                var dir = [0, 0, 0];
                // 注意，此处必须与PLANE_INDEX匹配
                dir[Math.floor(i / 2)] = (i % 2 > 0 ? 1 : -1);
                this.addPlane(this.boundary[m[i % 2]], dir);
            }
            // 响应每一个加入box的剖切面的变更，以更新剖切盒可视效果
            for (var plane of this.planesToClip) {
                plane.addEventListener("CLIP_PLANE_CHANGE", e => {
                    // 更新marks
                    this._update_marks_by_planes();
                });
            }
            this._update_marks_by_planes();
        }
    }
    boxToJson() {
        return this.CurrentBox.toJson();
    }
    boxFromJson(boxJson) {
        var box = new three__WEBPACK_IMPORTED_MODULE_3__.Box3;
        box.fromJson(boxJson);
        this.CurrentBox = box;
        this.dispatchEvent(core_Events__WEBPACK_IMPORTED_MODULE_0__.Events.CLIP_GROUP_CLIPPED());
    }
}




/***/ }),

/***/ "../src/ui/clip/clip_group.js":
/*!************************************!*\
  !*** ../src/ui/clip/clip_group.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ClipGroup": () => (/* binding */ ClipGroup)
/* harmony export */ });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var core_Events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core/Events */ "../src/core/Events.js");
/* harmony import */ var _clip_plane__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./clip_plane */ "../src/ui/clip/clip_plane.js");
/* harmony import */ var core_utils_observed_set__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core/utils/observed_set */ "../src/core/utils/observed_set.js");






const PRIVATE = {
    ACTIVE: Symbol("CG_ACTIVE"),
    INTERSECT: Symbol("CG_INTERSECT"),
};

const INTERACT_EVENT = {
    ACTIVEPLANE_CHANGE(oldf, newf) {
        return {
            type: "ACTIVEPLANE_CHANGE",
            oldface: oldf,
            newface: newf
        };
    },
    PLANE_STATUS_CHANGE(info) {
        return {
            type: "PLANE_STATUS_CHANGE",
            planeInfo: info
        };
    },
};

class ClipGroup extends three__WEBPACK_IMPORTED_MODULE_3__.EventDispatcher {
    constructor(opt) {
        super();

        this.planesToClip = new Set(); // 当前剖切面组中的剖切面（ClipPlane）

        this.marks = new three__WEBPACK_IMPORTED_MODULE_3__.Group(); // 用于对剖切面展示和交互控制的图形元素
        this.marks.visible = false;
        this.marks_pickable = new Set;
        this.marks.name = !!opt.name ? opt.name : "A_ClipGroup";
        var scope = this;
        this.marks.addPickable = function (...objs) {
            objs.forEach(o => scope.marks_pickable.add(o));
            this.add(...objs);
        };
        var origin_remove = this.marks.remove;
        this.marks.remove = function (...objs) {
            objs.forEach(o => scope.marks_pickable.delete(o));
            origin_remove.call(this, ...objs);
        };

        this[PRIVATE.ACTIVE] = false;
        this[PRIVATE.INTERSECT] = false;


        this.elements = new core_utils_observed_set__WEBPACK_IMPORTED_MODULE_2__.ObservedSet();
        this.elements.addEventListener("OSET_ADDED", e => {
            if (this.active) e.object.add_clip_planes(this, this.intersect);
        });
        this.elements.addEventListener("OSET_DELETED", e => {
            if (this.active) e.object.remove_clip_planes(this);
        });

        if (!!opt.viewer)
            this.viewer = opt.viewer;

        this.interactRequireCtrlKey = true;
        this.interactLockDelay = 50;
    }
    addPlane(...args) {
        var plane;
        if (args.length == 1) {
            if (!(args[0] instanceof _clip_plane__WEBPACK_IMPORTED_MODULE_1__.ClipPlane))
                throw new Error("参数类型必须为ClipPlane！");
            plane = args[0];
        } else if (args.length == 2) {
            plane = new _clip_plane__WEBPACK_IMPORTED_MODULE_1__.ClipPlane(args[0], args[1]);
        } else {
            throw new Error("参数数量错误！");
        }

        var n0 = this.planesToClip.size;
        this.planesToClip.add(plane);
        if (this.planesToClip.size > n0) {
            this.dispatchEvent(core_Events__WEBPACK_IMPORTED_MODULE_0__.Events.CLIP_GROUP_ADD_PLANE(this, plane));
            if (this.active)
                this.elements.forEach(e => e.add_clip_planes([plane.plane], this.intersect));
        }
        return plane;
    }
    removePlane(plane) {
        if (!this.planesToClip.has(plane))
            return false;
        var n0 = this.planesToClip.size;
        this.planesToClip.delete(plane);
        if (this.planesToClip.size < n0) {
            this.dispatchEvent(core_Events__WEBPACK_IMPORTED_MODULE_0__.Events.CLIP_GROUP_REMOVE_PLANE(this, plane));
            if (this.active)
                this.elements.forEach(e => e.remove_clip_planes([plane.plane]));
        }
        return true;
    }
    // 控制当前剖切面集合之间是否取交集
    get intersect() { return this[PRIVATE.INTERSECT]; }
    set intersect(v) {
        this[PRIVATE.INTERSECT] = v;
        this.elements.forEach(e => {
            try {
                e.set_clip_intersect(v)
            } catch (ex) {
                console.error(e, ex);
            }
        });
    }
    // 控制当前剖切面集合是否执行剖切（通过清空/填充剖切面数组）
    get active() { return this[PRIVATE.ACTIVE]; }
    set active(v) {
        if (this[PRIVATE.ACTIVE] == v) return;
        this[PRIVATE.ACTIVE] = v;
        this.dispatchEvent(core_Events__WEBPACK_IMPORTED_MODULE_0__.Events.CLIP_GROUP_STATUS_CHANGE(this));
        if (v) this.elements.forEach(e => e.add_clip_planes(this, this.intersect));
        else this.elements.forEach(e => e.remove_clip_planes(this));
    }
    // 交互操作
    _show_filter() { }
    show(filterData = null) {
        if (this.marks.visible && !filterData) return;
        this.marks.visible = true;
        if (!!filterData) {
            this._show_filter(filterData);
        }
        this._redraw("clip show");
    }
    hide() {
        if (!this.marks.visible) return;
        this.marks.visible = false;
        this._redraw("clip hide");
    }

    get interaction_enabled() {
        return !!this._interaction_enabled;
    }
    set interaction_enabled(enable) {
        if (!this.viewer) return;
        if (!!this._interaction_enabled == !!enable) return;
        this._interaction_enabled = !!enable;
        if (!this._interaction_funcs) {
            var scope = this;
            var timeoutID;
            this._interaction_funcs = {
                ondown: event => {
                    if (event.button != 0) return;
                    if (this.interactRequireCtrlKey && !event.ctrlKey)
                        return;
                    if (!scope.marks.visible)
                        return;
                    // scope.CurrentPlaneInfo.locked = true;
                    timeoutID = setTimeout(() =>
                        scope.CurrentPlaneInfo.locked = true, this.interactLockDelay);
                },
                onup: event => {
                    scope.CurrentPlaneInfo.locked = false;
                    clearTimeout(timeoutID);
                },
                onmove: event => {
                    if (!scope.marks.visible)
                        return;
                    if (!!scope.viewer.Controller && scope.viewer.Controller.inOperation)
                        return;
                    var pos = { x: event.offsetX, y: event.offsetY };
                    scope._pick_plane_to_clip(pos);
                    if (scope._do_interactive_clip(pos)) {
                        scope._redraw("clip drag"); // 必要时重绘
                    }
                }
            };
        }
        var canvas = this.viewer.Renderer.domElement;
        if (enable) {
            canvas.addEventListener('pointerdown', this._interaction_funcs.ondown);
            canvas.addEventListener('pointerup', this._interaction_funcs.onup);
            canvas.addEventListener('pointermove', this._interaction_funcs.onmove);
        } else {
            canvas.removeEventListener('pointerdown', this._interaction_funcs.ondown);
            canvas.removeEventListener('pointerup', this._interaction_funcs.onup);
            canvas.removeEventListener('pointermove', this._interaction_funcs.onmove);
        }
    }
    get CurrentPlaneInfo() {
        if (!this._curPlaneInfo) {
            var scope = this;
            var curFace = null;
            this._curPlaneInfo = {
                get PickedFace() { return curFace },
                set PickedFace(f) {
                    var oldFace = curFace;
                    var refresh = () => {
                        this.locked = false;
                        scope.dispatchEvent(INTERACT_EVENT.ACTIVEPLANE_CHANGE(oldFace, f));
                        scope._redraw("clip change");
                    };
                    if (!!f) {
                        if (!oldFace ||
                            oldFace.markObject != f.markObject ||
                            oldFace.materialIndex != f.materialIndex) {
                            curFace = f;
                            refresh();
                        }
                    } else if (!!oldFace) {
                        curFace = null;
                        refresh();
                    }
                },
                get locked() { return !!curFace && !!this._locked; },
                set locked(v) {
                    if (!!scope.viewer.Controller && scope.viewer.Controller.inOperation)
                        return;
                    if (!curFace || this._locked == v) return;
                    this._locked = v;
                    scope.dispatchEvent(INTERACT_EVENT.PLANE_STATUS_CHANGE(this));
                    if (v) scope.dispatchEvent(core_Events__WEBPACK_IMPORTED_MODULE_0__.Events.CLIP_GROUP_LOCK());
                    else scope.dispatchEvent(core_Events__WEBPACK_IMPORTED_MODULE_0__.Events.CLIP_GROUP_UNLOCK());
                    if (!!scope.viewer.Controller)
                        scope.viewer.Controller.enabled = !v;
                    scope._redraw("clip lock/unlock");
                    scope.clipping = !v;
                    setTimeout(() => scope.clipping = false, 100);
                    delete scope.lastDragPos;
                }
            };
        }
        return this._curPlaneInfo;
    }
    _redraw(debugMsg = "") {
        if (!this.viewer) return;
        this.viewer.redraw(debugMsg);
    }
    _pick_plane_to_clip(pos) { // 需要重绘时返回true
        if (this.CurrentPlaneInfo.locked)
            return;
        // 拾取剖切面
        var toPickInfo;
        this.viewer.pick(pos, info => {
            toPickInfo = info;
        }, [...this.marks_pickable], false);
        // 处理剖切面的可见性
        if (!toPickInfo) {
            this.CurrentPlaneInfo.PickedFace = null; // 删除
        } else {
            toPickInfo.face.faceIndex = toPickInfo.faceIndex;
            toPickInfo.face.markObject = toPickInfo.object;
            this.CurrentPlaneInfo.PickedFace = toPickInfo.face; // 初始化or变更
        }
    }
    _move_plane(planeInfo, move_vector) { return false; } // 虚函数
    _do_interactive_clip(drag_pos) {
        if (!this.CurrentPlaneInfo.locked)
            return false;
        // 执行剖切操作
        var size = new three__WEBPACK_IMPORTED_MODULE_3__.Vector2();
        this.viewer.Renderer.getSize(size);
        var plane = new three__WEBPACK_IMPORTED_MODULE_3__.PlaneBufferGeometry(size.x, size.y);
        if (!this.dragPlane) { // 用于拾取光标拖拽位置的面
            this.dragPlane = new three__WEBPACK_IMPORTED_MODULE_3__.Mesh(plane);
        } else {
            this.dragPlane.geometry.dispose();
            this.dragPlane.geometry = plane;
        }
        this.dragPlane.lookAt(this.viewer.camera.position);
        this.dragPlane.position.copy(this.viewer.Controller.target);
        this.dragPlane.updateMatrixWorld();

        var vMove;
        this.viewer.pick(drag_pos, info => {
            vMove = info.point.clone();
        }, this.dragPlane, false);
        if (!vMove) {
            console.error("未捕捉到剖切盒拖拽点");
            return false;
        }
        var curPos = vMove.clone();
        var ret = false;
        if (this.lastDragPos) { // 计算拖拽距离（模型坐标系）
            vMove.sub(this.lastDragPos);
            var fLen = vMove.length();
            if (fLen > 0.1) {
                vMove.projectOnVector(this.CurrentPlaneInfo.PickedFace.normal);
                vMove.setLength(fLen);
                this.clipping = true;
                this.dispatchEvent(core_Events__WEBPACK_IMPORTED_MODULE_0__.Events.CLIP_GROUP_CLIPPING(vMove));
                if (!!this._move_plane(this.CurrentPlaneInfo, vMove)) {
                    this.dispatchEvent(core_Events__WEBPACK_IMPORTED_MODULE_0__.Events.CLIP_GROUP_CLIPPED(vMove));
                    ret = true;
                    this.lastDragPos = curPos;
                }
            }
        } else {
            this.lastDragPos = curPos;
        }
        return ret;
    }

    // 剖切面集合操作
    *[Symbol.iterator]() {
        for (var p of this.planesToClip) yield p.plane;
    }
    get count() {
        return this.planesToClip.size;
    }

    toJson() {
        var jsonarr = [];
        for (var p of this) {
            jsonarr.push({
                normal: {
                    x: p.normal.x,
                    y: p.normal.y,
                    z: p.normal.z,
                },
                constant: p.constant
            });
        }
        return jsonarr;
    }
    fromJson(jsonArr, forceLength = false) {
        var cnt = jsonArr.length;
        if (!Array.isArray(jsonArr))
            throw new Error("参数错误：不是数组！");
        if (cnt != this.planesToClip.size) {
            if (!forceLength)
                throw new Error("参数错误：长度错误！");
            var cntToDel = this.planesToClip.size - cnt;
            var arrSet = [...this.planesToClip];
            for (var i = 0; i < cntToDel; i++)
                this.planesToClip.delete(arrSet[i]);
            var cntToAdd = cnt - this.planesToClip.size;
            for (var i = 0; i < cntToAdd; i++)
                this.addPlane([0, 0, 0], [0, 0, 1]);
        }
        var ps = [...this.planesToClip];
        for (var i = 0; i < cnt; i++) {
            ps[i].plane.normal.set(
                jsonArr[i].normal.x,
                jsonArr[i].normal.y,
                jsonArr[i].normal.z
            );
            ps[i].constant = jsonArr[i].constant;
        }
        this.dispatchEvent(core_Events__WEBPACK_IMPORTED_MODULE_0__.Events.CLIP_GROUP_CLIPPED());
    }
}



/***/ }),

/***/ "../src/ui/clip/clip_manager.js":
/*!**************************************!*\
  !*** ../src/ui/clip/clip_manager.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ClipManager": () => (/* binding */ ClipManager)
/* harmony export */ });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var core_Events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core/Events */ "../src/core/Events.js");
/* harmony import */ var _clip_box__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./clip_box */ "../src/ui/clip/clip_box.js");
/* harmony import */ var _clip_group__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./clip_group */ "../src/ui/clip/clip_group.js");







class ClipManager extends three__WEBPACK_IMPORTED_MODULE_3__.EventDispatcher {
    constructor(viewer, opt = {}) {
        super();
        this.opt = opt;
        this.opt.viewer = viewer;

        this._groups = new Map();
        this.marks = new three__WEBPACK_IMPORTED_MODULE_3__.Group(); // 用于对剖切面展示和交互控制的图形元素
        this.marks.name = "ClipManagerMarks"
        this.marks.visible = true;

        viewer.SceneManager.addDirectly(this.marks, 0);

        this._autoadd = true;
        viewer.addEventListener("MODEL_ADD_OBJECT",
            e => {
                if (this._autoadd)
                    for (var g of this.groups)
                        g.elements.add(e.object);
            });
        viewer.addEventListener("LOAD_CHUNK_FINISH",
            e => {
                if (this._autoadd)
                    for (var g of this.groups)
                        g.elements.add(...e.new_objects);
            });
    }
    get AutoAddAllElements() { return this._autoadd; }
    set AutoAddAllElements(v) {
        if (this._autoadd == v) return;
        this._autoadd = v;
        if (v) {
            this.opt.viewer.ModelManager.segments_group.traverse(o => {
                o.clear_clip_planes();
            })
            for (g of this.groups) {
                g.elements.clear();
                g.elements.add(...this.opt.viewer.ModelManager.all);
            }
        }
    }
    // 一个或两个参数，
    // 参数必须包含剖切面组的名字，
    // 可以指定要添加的剖切面组对象
    // 或剖切面组的类型对象
    addGroup(...args) {
        var name = "";
        var group = null;
        if (args.length == 1) {
            if (typeof (args[0]) != "string" || !args[0]) {
                throw new Error("addGroup参数类型错误！");
            }
            name = args[0];
            group = new _clip_group__WEBPACK_IMPORTED_MODULE_2__.ClipGroup(this.opt);
        }
        else if (args.length == 2) {
            args.forEach(a => {
                if (a instanceof _clip_group__WEBPACK_IMPORTED_MODULE_2__.ClipGroup) {
                    group = a;
                } else if (a instanceof Function &&
                    Object.getPrototypeOf(a) == _clip_group__WEBPACK_IMPORTED_MODULE_2__.ClipGroup) {
                    group = new a(this.opt);
                } else if (typeof (a) == "string") {
                    name = a;
                }
            });
            if (!name && !group) {
                throw new Error("addGroup参数类型错误！");
            }
        }
        else {
            throw new Error("addGroup参数数量错误！");
        }
        this._groups.set(name, group);
        this.marks.add(group.marks);
        if (!!this.opt.viewer.Selection) {
            var mat = this.opt.viewer.Selection.HighlightMaterial;
            if (!group.elements.has(mat))
                group.elements.add(mat);
        }
        if (this._autoadd) {
            group.elements.clear();
            group.elements.add(...this.opt.viewer.ModelManager.all);
        }
        return group;
    }
    getGroup(name) {
        return this._groups.get(name);
    }
    removeGroup(name) {
        var g = this._groups.get(name);
        if (!!g) g.active = false;
        this.marks.remove(g.marks);
        return this._groups.delete(name);
    }
    getAll() {
        return [...this._groups].map(e => Object({ name: e[0], group: e[1] }));
    }
    get names() { return this._groups.keys(); }
    get groups() { return this._groups.values(); }
}




/***/ }),

/***/ "../src/ui/clip/clip_plane.js":
/*!************************************!*\
  !*** ../src/ui/clip/clip_plane.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ClipPlane": () => (/* binding */ ClipPlane)
/* harmony export */ });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var core_Events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core/Events */ "../src/core/Events.js");




class ClipPlane extends three__WEBPACK_IMPORTED_MODULE_1__.EventDispatcher {
    constructor(pos, dir) {
        super();
        function fixVector3(v) {
            if (v.isVector3)
                return v;
            else if (Array.isArray(v))
                return new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(...v);
            else
                return new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(v.x, v.y, v.z);
        }
        pos = fixVector3(pos);
        dir = fixVector3(dir);
        var c = pos.dot(dir);
        this.plane = new three__WEBPACK_IMPORTED_MODULE_1__.Plane(dir.negate(), c);
    }
    get constant() { return this.plane.constant; }
    set constant(v) {
        if (this.plane.constant != v) {
            this.plane.constant = v;
            this.dispatchEvent(core_Events__WEBPACK_IMPORTED_MODULE_0__.Events.CLIP_PLANE_CHANGE(this));
        }
    }
    get normal() { return this.plane.normal.clone().negate(); }
    set normal(v) {
        this.plane.normal.set(-v.x, -v.y, -v.z);
        this.dispatchEvent(core_Events__WEBPACK_IMPORTED_MODULE_0__.Events.CLIP_PLANE_CHANGE(this));
    }
    getPosition() { return this.normal.multiplyScalar(this.constant); }
    setFromPosition(pos) {
        // 使剖切面移动到位置pos（pos在平面上），而方向不变
        var newC = -pos.dot(this.plane.normal);
        this.constant = newC;
    }
    rotate(theta, axis, axispos) {
        if (!theta) return;
        if (!axispos) axispos.set(0, 0, 0);
        if (!axis) axis.set(0, 0, 1);
        var m4 = new three__WEBPACK_IMPORTED_MODULE_1__.Matrix4();
        var m4r = new three__WEBPACK_IMPORTED_MODULE_1__.Matrix4();
        m4.identity();
        m4.makeTranslation(-axispos.x, -axispos.y, -axispos.z);
        m4r.identity();
        m4r.makeRotationAxis(axis.normalize(), theta);
        m4.multiply(m4r);
        m4r.identity();
        m4r.makeTranslation(axispos.x, axispos.y, axispos.z);
        m4.multiply(m4r);
        var newP = this.plane.clone();
        newP.normal.negate();
        newP.applyMatrix4(m4);
        newP.normal.negate();
        if (!this.plane.equals(newP)) {
            this.plane.copy(newP);
            this.dispatchEvent(core_Events__WEBPACK_IMPORTED_MODULE_0__.Events.CLIP_PLANE_CHANGE(this));
        }
    }
    reverse() {
        // 剖切反向
        this.plane.constant = -this.plane.constant;
        this.plane.normal.negate();
        this.dispatchEvent(core_Events__WEBPACK_IMPORTED_MODULE_0__.Events.CLIP_PLANE_CHANGE(this));
    }
}



/***/ }),

/***/ "../src/ui/commands/dimension/CreatPoint.js":
/*!**************************************************!*\
  !*** ../src/ui/commands/dimension/CreatPoint.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CreatPoint": () => (/* binding */ CreatPoint)
/* harmony export */ });
/* harmony import */ var _lable_CreateLable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lable/CreateLable */ "../src/ui/lable/CreateLable.js");


//点
class CreatPoint {
    constructor(pos){
        this.pos = pos
    }
    //绘点
    createPoint  (pos,viewer,className)  {
        let table = new _lable_CreateLable__WEBPACK_IMPORTED_MODULE_0__.CreateLable(viewer)
        let num = ''
        let name = 'point'
        let pointTable = table.create2DObject(num,pos,className,name)
        // viewer.DecorationManager.addDecoration(pointTable,0)
        return pointTable

    };

    createPoint1  (pos,viewer,className)  {
        let table = new _lable_CreateLable__WEBPACK_IMPORTED_MODULE_0__.CreateLable(viewer)
        let num = ''
        let name = 'point1'
        let pointTable = table.create2DObject(num,pos,className,name)
        // viewer.DecorationManager.addDecoration(pointTable,0)
        return pointTable

    };
}



/***/ }),

/***/ "../src/ui/commands/dimension/DrawLine.js":
/*!************************************************!*\
  !*** ../src/ui/commands/dimension/DrawLine.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DrawLine": () => (/* binding */ DrawLine)
/* harmony export */ });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var _CreatPoint__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CreatPoint */ "../src/ui/commands/dimension/CreatPoint.js");
/* harmony import */ var _lable_CreateLable__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../lable/CreateLable */ "../src/ui/lable/CreateLable.js");




let isFace = false
let taggingPoint = []
let everyLinePoints = []
let arrayData = []
let everyLinePointsNew = []
let oneLinePoints = []
let points = []
let pointAll = []
let pointsArr = [];
let flag = false
class DrawLine {
    constructor(viewer) {
        this.viewer = viewer;
    }
    _disableSelection(viewer) {
        if (!!viewer.Selection)
            viewer.Selection.enable(false)
    }
    drawLine(obj, v = false) {
        let scope = this;
        let pointOne = new three__WEBPACK_IMPORTED_MODULE_2__.Vector3();
        let pointTwo = new three__WEBPACK_IMPORTED_MODULE_2__.Vector3();
        let line, num1, index, p1;

        let pointFirst;
        let pointTable;
        let pointIndex = [];
        let pointAll1 = [];
        let taggingOne;
        scope._disableSelection(scope.viewer);

        let last;
        let lastPos = {};
        let isMobile = false;
        let isWeb = false;
        let canvas = scope.viewer.Renderer.domElement;
        let mobileMeaHandle = document.getElementById("mobileMeasureHandleArea");
        if (!this.eventHandlerPtoP) {
            this.eventHandlerPtoP = function(event) {
                event.preventDefault();
                let clientPos = {};
                switch (event.type) {
                    case 'touchend':
                        let now = Date.now();
                        let time = now - (last || now);
                        isMobile = time > 0 && time < 1000;
                        if (isMobile) {
                            clientPos.x = lastPos.x; //两秒之内点击，取上次touchend的位置，排除再次touchend画点时的位置变化
                            clientPos.y = lastPos.y;
                        } else {
                            lastPos.x = event.changedTouches[0].clientX - 16; //记录上一次小红点位置
                            lastPos.y = event.changedTouches[0].clientY - 50;
                        }
                        last = Date.now();
                        break;
                    case 'click':
                        clientPos.x = event.offsetX;
                        clientPos.y = event.offsetY;
                        isWeb = true;
                        break;
                    default:
                        return;
                }

                if (!isMobile && !isWeb) return;
                if (!scope.viewer.pick(clientPos)) {
                    scope.quitDrawLine(scope);
                    return;
                }

                points = [];
                pointOne = scope.viewer.pick(clientPos).point
                let arr = scope.viewer.pick(clientPos).object.edge.geometry.attributes.position.array
                let arrNew = Array.from(arr)

                oneLinePoints.push(pointOne)

                arrNew.forEach((item, index) => {
                    if (index % 3 == 0) {
                        pointIndex.push(index)
                    }
                })

                pointIndex.forEach(item => {
                    let point = arrNew.slice(item, item + 3)
                    let pointV3 = new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(point[0], point[1], point[2])
                    pointAll1.push(pointV3)
                })

                pointAll1.forEach(item => {
                    let p1 = item
                    let p2 = pointOne
                    let line3 = new three__WEBPACK_IMPORTED_MODULE_2__.Line3(p2, p1)
                    let num = line3.distance()
                    if (num < 0.05) {
                        pointOne = item
                    }
                })
                pointAll.push(pointOne)
                arrayData.push(pointOne)
                window.dataArray = arrayData

                //点击的两个点之间标注一段距离和一条直线
                if (pointAll.length >= 2) {
                    let p1 = pointAll[pointAll.length - 1]
                    let p2 = pointAll[pointAll.length - 2]
                    let line3 = new three__WEBPACK_IMPORTED_MODULE_2__.Line3(p2, p1)
                    let num = line3.distance()
                    num = num / 3.28084
                    num = num.toFixed(3)
                    if (num != 0.00) {
                        let pos1 = new three__WEBPACK_IMPORTED_MODULE_2__.Vector3()
                        let pos = line3.getCenter(pos1)

                        let table = new _lable_CreateLable__WEBPACK_IMPORTED_MODULE_1__.CreateLable(scope.viewer)

                        let numText = table.create2DObject(num, pos, 'lineLabel')
                        taggingOne = {
                            num: num,
                            pos: pos
                        }
                        taggingPoint.push(taggingOne)
                        scope.viewer.DecorationManager.addDecoration(numText, 0)
                        scope.viewer.redraw("start")
                    }
                }

                pointFirst = new _CreatPoint__WEBPACK_IMPORTED_MODULE_0__.CreatPoint(pointOne)
                pointTable = pointFirst.createPoint(pointOne, scope.viewer, 'point')
                scope.viewer.DecorationManager.addDecoration(pointTable, 0)

                //一条射线
                let material = new three__WEBPACK_IMPORTED_MODULE_2__.LineBasicMaterial({
                    color: 'white'
                });
                material.depthFunc = three__WEBPACK_IMPORTED_MODULE_2__.AlwaysDepth
                let geometry = new three__WEBPACK_IMPORTED_MODULE_2__.BufferGeometry();
                points.push(pointOne);
                points.push(pointOne);
                geometry.setFromPoints(points)
                line = new three__WEBPACK_IMPORTED_MODULE_2__.Line(geometry, material);

                scope.viewer.DecorationManager.addDecoration(line, 0)
                scope.viewer.redraw("start")
                flag = true;

                isMobile = false;
                isWeb = false;
                last = 0;

                //移动
                if (!flag) return;
                if (!scope.eventHandlerMovePtoP) {
                    scope.eventHandlerMovePtoP = function(event) {
                        event.preventDefault();
                        let clientPos = {};
                        switch (event.type) {
                            case 'touchmove':
                                clientPos.x = event.changedTouches[0].clientX - 16;
                                clientPos.y = event.changedTouches[0].clientY - 50;
                                $("#measureEscTip").hide();
                                break;
                            case 'mousemove':
                                clientPos.x = event.offsetX;
                                clientPos.y = event.offsetY;
                                var measureEscTip = document.getElementById("measureEscTip");
                                var x = event.pageX;
                                var y = event.pageY;
                                measureEscTip.style.left = x - 0.5 * measureEscTip.offsetWidth + 80 + "px";
                                measureEscTip.style.top = y - 0.5 * measureEscTip.offsetHeight + "px";
                                $("#measureEscTip").show();
                                break;
                            default:
                                return;
                        }
                        if (!scope.viewer.pick(clientPos)) {
                            $("#measureEscTip").hide();
                            return;
                        }

                        pointTwo = scope.viewer.pick(clientPos).point;
                        pointAll1.forEach(item => {
                            let p1 = item;
                            let p2 = pointTwo;
                            let line3 = new three__WEBPACK_IMPORTED_MODULE_2__.Line3(p2, p1);
                            let num = line3.distance();
                            if (num < 0.05) {
                                pointTwo = item;
                            }
                        })
                        points.splice(points.length - 1, 1)
                        points.push(new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(pointTwo.x, pointTwo.y, pointTwo.z));
                        line.geometry.setFromPoints(points)
                        line.frustumCulled = false;
                        scope.viewer.DecorationManager.addDecoration(line, 0)
                        scope.viewer.redraw("start");
                    };
                }
                if ('ontouchstart' in document.documentElement) mobileMeaHandle.addEventListener('touchmove', scope.eventHandlerMovePtoP);
                else canvas.addEventListener('mousemove', scope.eventHandlerMovePtoP);

                let data = {
                    oneLinePoints: oneLinePoints,
                }
                everyLinePoints.push(data)

                //为了去重,添加表示
                let ran = Math.round(Math.random() * 100);

                if (obj) {
                    everyLinePoints.forEach(item => {
                        if (item.oneLinePoints.length != 0) {
                            let data = {
                                id: ran,
                                oneLinePoints: item,
                                taggingPoint: taggingPoint,
                            }
                            obj.everyLinePointsNew.push(data)
                        }
                    })
                    window.everyLinePointsNew = obj.everyLinePointsNew
                } else {
                    everyLinePoints.forEach((item, index) => {
                        if (item.oneLinePoints.length != 0) {
                            let data = {
                                id: ran,
                                oneLinePoints: item,
                                taggingPoint: taggingPoint,
                            }
                            everyLinePointsNew.push(data)
                        }

                    })
                    window.everyLinePointsNew = everyLinePointsNew
                }
            };
        }
        if (v) {
            if ('ontouchstart' in document.documentElement) mobileMeaHandle.addEventListener('touchend', this.eventHandlerPtoP);
            else canvas.addEventListener('click', this.eventHandlerPtoP);
        } else {
            canvas.removeEventListener('click', this.eventHandlerPtoP);
            mobileMeaHandle.removeEventListener('touchend', this.eventHandlerPtoP);
            canvas.removeEventListener('mousemove', this.eventHandlerMovePtoP);
            mobileMeaHandle.removeEventListener('touchmove', this.eventHandlerMovePtoP);
        }
    }

    keyDownEsc(event) {
        if (event.keyCode == 27) {
            let scope = document._params;
            scope.quitDrawLine(scope);
        }
    }

    quitDrawLine(scope) {
        pointAll = []
        points = []

        let movePointNew = []
        let moveEnd = scope.viewer.DecorationManager._scene.children
        movePointNew = scope.getArrEqual(moveEnd, pointsArr)
        pointsArr = moveEnd
        if (moveEnd.length <= 3) {
            if (moveEnd[moveEnd.length - 1].children.length == 0) {
                let p = new three__WEBPACK_IMPORTED_MODULE_2__.Group()
                moveEnd[moveEnd.length - 1].children.push(p)
                let moveEndNew = Array.from(moveEnd)
                moveEndNew.forEach(item => {
                    scope.viewer.DecorationManager.removeDecoration(item)
                })
            }
        } else {
            if (moveEnd[moveEnd.length - 1].children.length == 0) {
                let p = new three__WEBPACK_IMPORTED_MODULE_2__.Group()
                moveEnd[moveEnd.length - 1].children.push(p)
                let moveCaptureLine = []
                let movePoint = []
                moveEnd.forEach((item, index) => {
                    if (item.type == "Line") {
                        moveCaptureLine.push(item)
                    }
                    if (item.name == 'point') {
                        movePoint.push(item)
                    }
                })
                let moveCaptureLineNew = Array.from(moveCaptureLine)
                if (moveCaptureLineNew.length >= 1) {
                    scope.viewer.DecorationManager.removeDecoration(moveCaptureLineNew[moveCaptureLineNew.length - 1])
                }

                if (movePointNew.length == 0) {
                    return
                } else
                if (movePointNew[movePointNew.length - 1].type == "Object3D" && movePointNew[movePointNew.length - 2].type == "Line") {
                    scope.viewer.DecorationManager.removeDecoration(movePointNew[movePointNew.length - 1])
                    if (movePointNew[movePointNew.length - 1].children.length == 0) {
                        return
                    }
                    scope.viewer.DecorationManager.removeDecoration(movePointNew[movePointNew.length - 2])
                }
            }
        }
        scope.viewer.redraw("start")
        flag = false
    }

    getArrEqual(arr1, arr2) {
        let newArr = [];
        for (let i = 0; i < arr2.length; i++) {
            for (let j = 0; j < arr1.length; j++) {
                if (arr1[j] != arr2[i]) {
                    newArr.push(arr1[j]);
                }
            }
        }
        return newArr;
    }
    clearBefore() {
        //清除点点数据
        everyLinePointsNew = []
        everyLinePoints = []
        taggingPoint = []
        arrayData = []
        oneLinePoints = []
        points = []
        pointAll = []
        flag = false
    }
}



/***/ }),

/***/ "../src/ui/commands/dimension/DrawLinePointToFace.js":
/*!***********************************************************!*\
  !*** ../src/ui/commands/dimension/DrawLinePointToFace.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DrawLinePointToFace": () => (/* binding */ DrawLinePointToFace)
/* harmony export */ });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var _CreatPoint__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CreatPoint */ "../src/ui/commands/dimension/CreatPoint.js");
/* harmony import */ var _lable_CreateLable__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../lable/CreateLable */ "../src/ui/lable/CreateLable.js");




let taggingFace = []
let verticalPoints = []
let points = []
let pointAll = []
class DrawLinePointToFace {
    constructor(viewer) {
        this.viewer = viewer;
    }
    _disableSelection(viewer) {
        if (!!viewer.Selection)
            viewer.Selection.enable(false)
    }

    drawLinePointToFace(obj, v = false) {
        let scope = this;
        let point;
        let normals = [];
        let pointIndex = [];
        let pointAll = [];
        this._disableSelection(scope.viewer);

        let last;
        let lastPos = {};
        let isMobile = false;
        let isWeb = false;
        if (!this.eventHandlerPtoF) {
            this.eventHandlerPtoF = function(event) {
                event.preventDefault();
                let clientPos = {};
                switch (event.type) {
                    case 'touchend':
                        let now = Date.now();
                        let time = now - (last || now);
                        isMobile = time > 0 && time < 1000;
                        if (isMobile) {
                            clientPos.x = lastPos.x; //两秒之内点击，取上次touchend的位置，排除再次touchend画点时的位置变化
                            clientPos.y = lastPos.y;
                        } else {
                            lastPos.x = event.changedTouches[0].clientX - 16; //记录上一次小红点位置
                            lastPos.y = event.changedTouches[0].clientY - 50;
                        }
                        last = Date.now();
                        break;
                    case 'click':
                        clientPos.x = event.offsetX;
                        clientPos.y = event.offsetY;
                        isWeb = true;
                        break;
                    default:
                        return;
                }

                if (!isMobile && !isWeb) return;
                if (!scope.viewer.pick(clientPos)) return;
                point = scope.viewer.pick(clientPos).point

                let arr = scope.viewer.pick(clientPos).object.edge.geometry.attributes.position.array
                let arrNew = Array.from(arr)

                arrNew.forEach((item, index) => {
                    if (index % 3 == 0) {
                        pointIndex.push(index)
                    }
                })

                pointIndex.forEach(item => {
                    let point = arrNew.slice(item, item + 3)
                    let pointV3 = new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(point[0], point[1], point[2])
                    pointAll.push(pointV3)
                })

                pointAll.forEach(item => {
                    let p1 = item
                    let p2 = point
                    let line3 = new three__WEBPACK_IMPORTED_MODULE_2__.Line3(p2, p1)
                    let num = line3.distance()
                    if (num < 0.05) {
                        point = item
                    }
                })

                points.push(point)
                let pointFirst = new _CreatPoint__WEBPACK_IMPORTED_MODULE_0__.CreatPoint(point)
                let pointTable = pointFirst.createPoint(point, scope.viewer, 'point')
                scope.viewer.DecorationManager.addDecoration(pointTable, 0)
                scope.viewer.redraw('start')
                isMobile = false;
                isWeb = false;
                last = 0;

                normals.push(scope.viewer.pick(clientPos).face.normal)
                if (!points[1]) return; //点击了两下
                let subVector = new three__WEBPACK_IMPORTED_MODULE_2__.Vector3()

                let subVectorNew = subVector.subVectors(points[1], points[0])

                let projectionVector = subVectorNew.projectOnVector(normals[1])

                let addVector = new three__WEBPACK_IMPORTED_MODULE_2__.Vector3()

                let dropFoot = addVector.addVectors(points[0], projectionVector)

                let pointSurface = new _lable_CreateLable__WEBPACK_IMPORTED_MODULE_1__.CreateLable(scope.viewer)
                let triangle = pointSurface.create2DObjectSvgPointSurface(dropFoot)
                scope.viewer.DecorationManager.addDecoration(triangle, 0)
                scope.viewer.redraw('start')

                //jyp-点和面图标之间的虚线
                var geometry = new three__WEBPACK_IMPORTED_MODULE_2__.BufferGeometry();
                var vertices = new Float32Array([
                    points[1].x, points[1].y, points[1].z,
                    dropFoot.x, dropFoot.y, dropFoot.z
                ]);
                geometry.setAttribute('position', new three__WEBPACK_IMPORTED_MODULE_2__.BufferAttribute(vertices, 3));
                var material = new three__WEBPACK_IMPORTED_MODULE_2__.LineDashedMaterial({ color: 0xff0000, dashSize: 0.05, gapSize: 0.05 });
                material.depthFunc = three__WEBPACK_IMPORTED_MODULE_2__.AlwaysDepth
                var mesh = new three__WEBPACK_IMPORTED_MODULE_2__.Line(geometry, material);
                mesh.computeLineDistances(); //不可或缺的，若无，则线段不能显示为虚线
                scope.viewer.DecorationManager.addDecoration(mesh, 0)
                scope.viewer.redraw('start')

                //jyp-距离线
                var geometry = new three__WEBPACK_IMPORTED_MODULE_2__.BufferGeometry();
                var vertices = new Float32Array([
                    points[0].x, points[0].y, points[0].z,
                    dropFoot.x, dropFoot.y, dropFoot.z
                ]);
                geometry.setAttribute('position', new three__WEBPACK_IMPORTED_MODULE_2__.BufferAttribute(vertices, 3));
                var material = new three__WEBPACK_IMPORTED_MODULE_2__.MeshBasicMaterial({ color: 0xffff00 });
                material.depthFunc = three__WEBPACK_IMPORTED_MODULE_2__.AlwaysDepth
                var mesh = new three__WEBPACK_IMPORTED_MODULE_2__.Line(geometry, material);
                scope.viewer.DecorationManager.addDecoration(mesh, 0)
                scope.viewer.redraw('start')

                //距离标注
                let pOne = points[0]
                let pTwo = dropFoot
                let line3 = new three__WEBPACK_IMPORTED_MODULE_2__.Line3(pTwo, pOne)
                let num = line3.distance()
                num = num / 3.28084
                num = num.toFixed(3)

                let pos1 = new three__WEBPACK_IMPORTED_MODULE_2__.Vector3()
                let pos = line3.getCenter(pos1)

                let table = new _lable_CreateLable__WEBPACK_IMPORTED_MODULE_1__.CreateLable(scope.viewer)
                let numText = table.create2DObject(num, pos, 'lineLabel')

                let taggingOne = {
                    num: num,
                    pos: pos
                }
                taggingFace.push(taggingOne)
                // window.taggingFace = taggingFace
                scope.viewer.DecorationManager.addDecoration(numText, 0)
                scope.viewer.redraw("start")

                if (obj) {
                    //一条垂线包含点
                    let oneVerticalPoints = {
                        oneVertical: [points[0], points[1], dropFoot],
                        taggingFace: taggingFace
                    }
                    obj.verticalPoints.push(oneVerticalPoints)

                    window.verticalPoints = obj.verticalPoints
                } else {
                    //一条垂线包含点
                    let oneVerticalPoints = {
                        oneVertical: [points[0], points[1], dropFoot],
                        taggingFace: taggingFace
                    }
                    verticalPoints.push(oneVerticalPoints)

                    window.verticalPoints = verticalPoints
                }

                points = []
                normals = []

            };
        }

        let canvas = scope.viewer.Renderer.domElement;
        let mobileMeaHandle = document.getElementById("mobileMeasureHandleArea");
        if (v) {
            if ('ontouchstart' in document.documentElement) mobileMeaHandle.addEventListener('touchend', this.eventHandlerPtoF);
            else canvas.addEventListener('click', this.eventHandlerPtoF);
        } else {
            canvas.removeEventListener('click', this.eventHandlerPtoF);
            mobileMeaHandle.removeEventListener('touchend', this.eventHandlerPtoF);
        }
    }

    clearBefore() {
        points = []
        pointAll = []
        verticalPoints = []
        taggingFace = []
    }
}



/***/ }),

/***/ "../src/ui/commands/dimension/DrawLinePointToLine.js":
/*!***********************************************************!*\
  !*** ../src/ui/commands/dimension/DrawLinePointToLine.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DrawLinePointToLine": () => (/* binding */ DrawLinePointToLine)
/* harmony export */ });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var _CreatPoint__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CreatPoint */ "../src/ui/commands/dimension/CreatPoint.js");
/* harmony import */ var _lable_CreateLable__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../lable/CreateLable */ "../src/ui/lable/CreateLable.js");
/* harmony import */ var _capture_CaptureLine__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../capture/CaptureLine */ "../src/ui/capture/CaptureLine.js");





let points = []
class DrawLinePointToLine {
    constructor(viewer) {
        this.viewer = viewer;
    }
    _disableSelection(viewer) {
        if (!!viewer.Selection)
            viewer.Selection.enable(false)
    }

    drawLinePointToLine(obj, v = false) {
        let scope = this;
        this._disableSelection(scope.viewer);
        let last;
        let lastPos = {};
        let isMobile = false;
        let isWeb = false;
        let taggingLine = [];
        let verticalPointToLine = [];
        
        if(!this.eventHandlerPtoL){
        this.eventHandlerPtoL = function(event) {
            event.preventDefault();

            //取当前位置
            let pos = {};
            switch (event.type) {
                case 'touchend':
                    let now = Date.now();
                    let time = now - (last || now);
                    isMobile = time > 0 && time < 1000;
                    if (isMobile) {
                        pos.x = lastPos.x; //两秒之内点击，取上次touchend的位置，排除再次touchend画点时的位置变化
                        pos.y = lastPos.y;
                    } else {
                        lastPos.x = event.changedTouches[0].clientX - 16; //记录上一次小红点位置
                        lastPos.y = event.changedTouches[0].clientY - 50;
                    }
                    last = Date.now();
                    break;
                case 'click':
                    pos.x = event.offsetX;
                    pos.y = event.offsetY;
                    isWeb = true;
                    break;
                default:
                    return;
            }

            if (!isMobile && !isWeb) return;
            if (!scope.viewer.pick(pos)) return;

            let point = scope.viewer.pick(pos).point;
            points.push(point);
            //画第一个点
            if (points.length == 1) {
                let pointFirst = new _CreatPoint__WEBPACK_IMPORTED_MODULE_0__.CreatPoint(point);
                let pointTable = pointFirst.createPoint(point, scope.viewer, 'point');
                scope.viewer.DecorationManager.addDecoration(pointTable, 0);
                scope.viewer.redraw('start');
                let captureLine = new _capture_CaptureLine__WEBPACK_IMPORTED_MODULE_2__.CaptureLine(scope.viewer);
                captureLine.getCaptureLine(points, obj, true);
            } else if (JSON.stringify(window.captureLineResult) != "{}") {
                $("#container").css("cursor", "crosshair");
                let geometry1 = new three__WEBPACK_IMPORTED_MODULE_3__.BufferGeometry();
                let vertices1 = new Float32Array([
                    points[0].x, points[0].y, points[0].z,
                    window.captureLineResult.x, window.captureLineResult.y, window.captureLineResult.z
                ]);
                geometry1.setAttribute('position', new three__WEBPACK_IMPORTED_MODULE_3__.BufferAttribute(vertices1, 3));
                var material1 = new three__WEBPACK_IMPORTED_MODULE_3__.MeshBasicMaterial({ color: 0xffffff });
                material1.depthFunc = three__WEBPACK_IMPORTED_MODULE_3__.AlwaysDepth;
                var mesh1 = new three__WEBPACK_IMPORTED_MODULE_3__.Line(geometry1, material1);
                mesh1.name = "vertical";
                scope.viewer.DecorationManager.addDecoration(mesh1, 0);
                scope.viewer.redraw('start');

                let pointSurface = new _lable_CreateLable__WEBPACK_IMPORTED_MODULE_1__.CreateLable(scope.viewer);
                let triangle = pointSurface.create2DObjectSvgDropFoot(window.captureLineResult);
                scope.viewer.DecorationManager.addDecoration(triangle, 0);

                let pOne = points[0];
                let pTwo = window.captureLineResult;
                let line3 = new three__WEBPACK_IMPORTED_MODULE_3__.Line3(pTwo, pOne);
                let num = line3.distance();
                num = (num / 3.28084).toFixed(3);

                let pos1 = new three__WEBPACK_IMPORTED_MODULE_3__.Vector3();
                let pos = line3.getCenter(pos1);

                let table = new _lable_CreateLable__WEBPACK_IMPORTED_MODULE_1__.CreateLable(scope.viewer);
                let numText = table.create2DObject(num, pos, 'lineLabel', "lineLabel1");

                let taggingOne = {
                    num: num,
                    pos: pos
                };
                taggingLine.push(taggingOne);
                // window.taggingLine = taggingLine

                scope.viewer.DecorationManager.addDecoration(numText, 0);
                scope.viewer.redraw('start');

                if (obj) {
                    //一条垂线包含点
                    let oneVerticalPoints = {
                        oneVertical: [points[0], window.captureLineResult],
                        taggingLine: taggingLine
                    };
                    obj.verticalPointToLine.push(oneVerticalPoints);
                    window.verticalPointToLine = obj.verticalPointToLine;
                } else {
                    //一条垂线包含点
                    let oneVerticalPoints = {
                        oneVertical: [points[0], window.captureLineResult],
                        taggingLine: taggingLine
                    };
                    verticalPointToLine.push(oneVerticalPoints);
                    window.verticalPointToLine = verticalPointToLine;
                }
                points = [];
            }

        };
        }
        let canvas = scope.viewer.Renderer.domElement;
        let mobileMeaHandle = document.getElementById("mobileMeasureHandleArea");
        if (v) {
            if('ontouchstart' in document.documentElement) mobileMeaHandle.addEventListener('touchend', this.eventHandlerPtoL);
            else canvas.addEventListener('click', this.eventHandlerPtoL);
        } else {
            canvas.removeEventListener('click', this.eventHandlerPtoL);
            mobileMeaHandle.removeEventListener('touchend', this.eventHandlerPtoL);
        }
    }

    clearBefore() {
        points = []

        /*        //清除点线数据
                let ca = new CaptureLine(viewer)
                ca.clearBefore()*/

    }
}



/***/ }),

/***/ "../src/ui/commands/dimension/dimension.js":
/*!*************************************************!*\
  !*** ../src/ui/commands/dimension/dimension.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "dim_cmd": () => (/* binding */ dim_cmd)
/* harmony export */ });
/* harmony import */ var _business_DimensionBusiness__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../business/DimensionBusiness */ "../src/ui/business/DimensionBusiness.js");
/* harmony import */ var _business_ElevationBusiness__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../business/ElevationBusiness */ "../src/ui/business/ElevationBusiness.js");



//绘线对象
let dimensionBusiness;
//标高对象
let elevation;

function init(viewer) {
    $("#container").append(`
        <div id="mobileMeasureHandle" class="mobile-measure-handle">
            <div class="mobile-mea-pos">
                <svg t="1670247324866" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2807" width="32" height="32">
    <path d="M294.8 22.8L23.2 294.3c-12.5 12.5-12.5 32.8 0 45.3l656.2 656.2c12.5 12.5 32.8 12.5 45.3 0l271.5-271.5c12.5-12.5 12.5-32.8 0-45.3L340 
    22.8c-12.5-12.5-32.8-12.5-45.2 0z m-198 288.5l215-215c3.1-3.1 8.2-3.1 11.3 0l33.9 33.9c3.1 3.1 3.1 8.2 0 11.3l-96.2 96.2 45.3 45.3 96.2-96.2c3.1-3.1 
    8.2-3.1 11.3 0l22.4 22.4c3.1 3.1 3.1 8.2 0 11.3l-62.2 62.2L419 328l62.2-62.2c3.1-3.1 8.2-3.1 11.3 0l22.4 22.4c3.1 3.1 3.1 8.2 0 11.3l-62.2 62.2L498 
    407l62.2-62.2c3.1-3.1 8.2-3.1 11.3 0l23.1 23.1c3.1 3.1 3.1 8.2 0 11.3l-96.2 96.2 45.3 45.3 96.2-96.2c3.1-3.1 8.2-3.1 11.3 0l22.4 22.4c3.1 3.1 3.1 
    8.2 0 11.3l-62.2 62.2 45.3 45.3 62.2-62.2c3.1-3.1 8.2-3.1 11.3 0l22.4 22.4c3.1 3.1 3.1 8.2 0 11.3l-62.2 62.2 45.3 45.3 62.2-62.2c3.1-3.1 8.2-3.1 
    11.3 0l23.1 23.1c3.1 3.1 3.1 8.2 0 11.3l-96.3 96 45.3 45.3 96.2-96.2c3.1-3.1 8.2-3.1 11.3 0l33.9 33.9c3.1 3.1 3.1 8.2 0 11.3l-215 215c-3.1 3.1-8.2 
    3.1-11.3 0L96.8 322.6a7.85 7.85 0 0 1 0-11.3z" p-id="2808" fill="#333333"></path></svg>
            </div>
            <div id="mobileMeasureHandleArea" class="mobile-mea-handle-area">
                <span></span>
            </div>
        </div>
        <div id="measureEscTip" class="measure-esc-tip">
            <span>单击空白处退出绘线</span>
        </div>
        `);

    $("#container").append(`
    <div id="measureSetting" class="docking-panel measure-setting">
        <div class="docking-panel-title">测量</div>
        <div id="measureClose" class="docking-panel-close-measure">x</div>
        <div id="measureUnfold" class="docking-panel-enlarge-measure"><img src="img/unfold.png"></div>
        <div id="measureSettingArea" class="measure-setting-area">
            <div class="measure-child-btn" id="measurePoint">
                <div><img src="img/点到点.png"></div>
                <div class="measure-child-btn-text"><span>点点</span></div>
            </div>
            <div class="measure-child-btn" id="measurePointToPlane">
                <div><img src="img/点到面.png"></div>
                <div class="measure-child-btn-text"><span>点面</span></div>
            </div>
             <div class="measure-child-btn" id="measurePointToLine">
                <div><img src="img/点到线.png"></div>
                <div class="measure-child-btn-text"><span>点线</span></div>
            </div>
            <div class="measure-child-btn" id="measureElevation">
                <div><img src="img/标高.png"></div>
                <div class="measure-child-btn-text"><span>标高</span></div>
            </div>
            <div class="measure-child-btn" id="cancelMeasure">
                <div><img src="img/delect.png"></div>
                <div class="measure-child-btn-text"><span>删除</span></div>
            </div>
        </div>
        </div>
    `);

    $("#measureSetting img").each(function() {
        $(this).attr('src', Web3D.BasePath + $(this).attr('src').slice($(this).attr('src').indexOf('img/')));
    });

    dimensionBusiness = new _business_DimensionBusiness__WEBPACK_IMPORTED_MODULE_0__.DimensionBusiness(viewer);
    //标高对象
    elevation = new _business_ElevationBusiness__WEBPACK_IMPORTED_MODULE_1__.ElevationBusiness()
    //展开测量面板
    $("#measureUnfold").click(function(e) {
        e.stopPropagation();
        $("#measureSettingArea").show();
        $("#measureUnfold").hide();
        $("#measureClose").show();
        $("#mobileMeasureHandle").hide();
    });

    //关掉测量面板
    $("#measureClose").click(function(e) {
        e.stopPropagation();
        $("#mobileMeasureHandle").hide();
        $("#measure-btn").removeClass("bf-checked");
        $("#measureSetting").hide();

        $(".measure-child-btn").css('background', 'none');
        dimensionBusiness.cancelOperation();
    });

    //删除按钮
    $("#cancelMeasure").click(function(e) {
        e.stopPropagation();
        $("#mobileMeasureHandle").hide();
        $(".measure-child-btn").css('background', 'none');

        dimensionBusiness.hideEscTitle();
        dimensionBusiness.cancelOperation();

    })

    //点到点测量
    $("#measurePoint").click(function(e) {
        e.stopPropagation();
        if ('ontouchstart' in document.documentElement) {
            $("#mobileMeasureHandle").show();
            $("#mobileMeasureHandle").css({ "left": "0.5rem", "top": "1.2rem" });
            $("#measureUnfold").show();
            $("#measureClose").hide();
            $("#measureSettingArea").hide();
        }
        $("#container").css("cursor", "crosshair");
        $(".measure-child-btn").css('background', 'none');
        $("#measurePoint").css('background', 'rgba(34, 34, 34, 1)');

        let obj = {
            type: ""
        };
        dimensionBusiness.cancelOperation();
        dimensionBusiness.clearBefore(obj);
        dimensionBusiness.drawPointToPoint();

    });

    //点面距离
    $("#measurePointToPlane").click(function(e) {
        e.stopPropagation();
        if ('ontouchstart' in document.documentElement) {
            $("#mobileMeasureHandle").show();
            $("#mobileMeasureHandle").css({ "left": "0.5rem", "top": "1.2rem" });
            $("#measureUnfold").show();
            $("#measureClose").hide();
            $("#measureSettingArea").hide();
        }
        $("#container").css("cursor", "crosshair");
        $(".measure-child-btn").css('background', 'none');
        $("#measurePointToPlane").css('background', 'rgba(34, 34, 34, 1)');

        let obj = {
            type: ""
        };
        dimensionBusiness.cancelOperation();
        dimensionBusiness.clearBefore(obj)
        dimensionBusiness.drawPointToFace()
    })

    //点线距离
    $("#measurePointToLine").click(function(e) {
        e.stopPropagation();
        if ('ontouchstart' in document.documentElement) {
            $("#mobileMeasureHandle").show();
            $("#mobileMeasureHandle").css({ "left": "0.5rem", "top": "1.2rem" });
            $("#measureUnfold").show();
            $("#measureClose").hide();
            $("#measureSettingArea").hide();
        }
        $("#container").css("cursor", "crosshair");
        $(".measure-child-btn").css('background', 'none');
        $("#measurePointToLine").css('background', 'rgba(34, 34, 34, 1)');

        // 点线测距
        let obj = {
            type: ""
        };
        dimensionBusiness.cancelOperation();
        dimensionBusiness.clearBefore(obj);
        dimensionBusiness.drawPointToLine();
    })

    //标高
    $("#measureElevation").click(function(e) {
        e.stopPropagation();
        $("#mobileMeasureHandle").hide();
        $(".measure-child-btn").css('background', 'none');
        $("#measureElevation").css('background', 'rgba(34, 34, 34, 1)');
        if ('ontouchstart' in document.documentElement) {
            $("#measureUnfold").show();
            $("#measureClose").hide();
            $("#measureSettingArea").hide();
        }

        dimensionBusiness.hideEscTitle()
        dimensionBusiness.cancelOperation();
        //标高
        elevation.getElevation(viewer)
    })
}

var dim_cmd = {
    init: init,
    id: "measure-btn",
    title: "测量",
    ico: "img/测量.png",
    class: "tool-btn",
    checkable: true,
    act: function(e, checked) {
        if (checked) {
            $("#measureSetting").show();
            $("#measureUnfold").hide();
            $("#measureClose").show();
            $("#measureSettingArea").show();
        } else {
            $("#measureSetting").hide();
            $("#mobileMeasureHandle").hide();
            $("#measureUnfold").hide();
            $("#measureClose").show();
            $(".measure-child-btn").css('background', 'none');
            dimensionBusiness.cancelOperation();
        }
    },
};



/***/ }),

/***/ "../src/ui/commands/display_control.js":
/*!*********************************************!*\
  !*** ../src/ui/commands/display_control.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "display_control_cmds": () => (/* binding */ cmds)
/* harmony export */ });
/* harmony import */ var _common_VisibilityController__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/VisibilityController */ "../src/ui/common/VisibilityController.js");


var cmds = {
    init(viewer) {
        if (!viewer.Selection) return false;
        this._vc = new _common_VisibilityController__WEBPACK_IMPORTED_MODULE_0__.VisibilityController(viewer, 0.5);
        this._viewer = viewer;
        this._selectSet = viewer.Selection.Current;
        return true;
    },
    _hide(reverse) {
        if (reverse) this._vc.HidenSet.clear();
        this._vc.HidenSet.add(...this._selectSet);
        if (reverse) this._vc.reverse_hiden();
        this._viewer.redraw();
    },
    _transp(reverse) {
        if (reverse) this._vc.TransparentSet.clear();
        this._vc.TransparentSet.add(...this._selectSet);
        if (reverse) this._vc.reverse_transparent();
        this._viewer.redraw();
    },
    _reset(reverse) {
        this._vc.reset();
        this._viewer.redraw();
    },
    _sel_sth() {
        return this._selectSet.size > 0;
    },
    commands: [
        {
            id: "dc_hide_sel_cmd",
            title: "隐藏",
            ico: "",
            class: "tool-btn",
            act: () => {
                cmds._hide();
            },
            get available() {
                return cmds._sel_sth();
            }
        },
        {
            id: "dc_hide_others_cmd",
            title: "其他隐藏",
            ico: "",
            class: "tool-btn",
            act: () => {
                cmds._hide(true);
            },
            get available() {
                return cmds._sel_sth();
            }
        },
        {
            id: "dc_transp_cmd",
            title: "透明",
            ico: "",
            class: "tool-btn",
            act: () => {
                cmds._transp();
            },
            get available() {
                return cmds._sel_sth();
            }
        },
        {
            id: "dc_transp_others_cmd",
            title: "其他透明",
            ico: "",
            class: "tool-btn",
            act: () => {
                cmds._transp(true);
            },
            get available() {
                return cmds._sel_sth();
            }
        },
        {
            id: "dc_reset_cmd",
            title: "恢复显示",
            ico: "",
            class: "tool-btn",
            act: () => {
                cmds._reset();
            },
            get available() {
                return cmds._vc.HidenSet.size > 0 || cmds._vc.TransparentSet.size > 0;
            }
        },
    ]
};




/***/ }),

/***/ "../src/ui/commands/elevation/elevation.js":
/*!*************************************************!*\
  !*** ../src/ui/commands/elevation/elevation.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Elevation": () => (/* binding */ Elevation)
/* harmony export */ });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var _lable_CreateLable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lable/CreateLable */ "../src/ui/lable/CreateLable.js");


class Elevation {
    constructor(viewer) {
        this.viewer = viewer
    }

    getHeight(viewer) {
        let points = []
        let point = new three__WEBPACK_IMPORTED_MODULE_1__.Vector3()
        if (!!viewer.Selection)
            viewer.Selection.enable(false)

        $(document).click(function (event) {
            let clientPos = {
                x: event.originalEvent.clientX,
                y: event.originalEvent.clientY,
            }

            if (typeof (viewer.pick(clientPos)) == "undefined") {
                return
            } else {
                point = viewer.pick(clientPos).point
            }
            points.push(point)
            points.forEach(item => {
                let pos = item
                let table = new _lable_CreateLable__WEBPACK_IMPORTED_MODULE_0__.CreateLable(viewer)
                let num = pos.z
                num = num / 3.28084
                num = num.toFixed(3)

                let triangle = table.create2DObjectSvg(pos, num)
                viewer.DecorationManager.addDecoration(triangle, 0)

                viewer.redraw('start')
            })
            points = []
        })
    }
}



/***/ }),

/***/ "../src/ui/commands/index.js":
/*!***********************************!*\
  !*** ../src/ui/commands/index.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "init_commands": () => (/* binding */ init_commands)
/* harmony export */ });
/* harmony import */ var _elements_clipSlider__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../elements/clipSlider */ "../src/ui/elements/clipSlider.js");
/* harmony import */ var _light_adjust__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./light_adjust */ "../src/ui/commands/light_adjust.js");
/* harmony import */ var _dimension_dimension__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./dimension/dimension */ "../src/ui/commands/dimension/dimension.js");





//初始化下方标签
function init_commands(viewer) {
    //if (!!Web3D.DefaultTools) return;
    _light_adjust__WEBPACK_IMPORTED_MODULE_1__.light_adjust_cmd.init(viewer);
    _dimension_dimension__WEBPACK_IMPORTED_MODULE_2__.dim_cmd.init(viewer)
    let dt = {
        home: {
            id: "home-btn",
            title: "home",
            ico: "img/home.png",
            class: "tool-btn",
            act: function () {
                viewer.Controller.reset();
                viewer.fitToView();
            }
        },
        dim: _dimension_dimension__WEBPACK_IMPORTED_MODULE_2__.dim_cmd,
        clip: {
            id: "sliced-btn",
            title: "剖切",
            ico: "img/sliced.png",
            class: "tool-btn",
            checkable: true,
            act: function (e, checked) {
                viewer.ClipBox.interaction_enabled = true;
                viewer.ClipBox.active = checked;
                if (checked) {
                    viewer.ClipBox.show();
                } else {
                    viewer.ClipBox.hide();
                }
            }
        },
        clipMobile: {
            id: "clipMobile-btns",
            title: "剖切",
            ico: "img/sliced.png",
            class: "tool-btn",
            _ui: new _elements_clipSlider__WEBPACK_IMPORTED_MODULE_0__.ClipSlider(viewer),
            on_popup(shown) {
                this._ui.show(shown);
            },
            keep_checked: true,
            children_check_group: true,
            children: [{
                id: "clip-btn-x",
                title: "X向剖切",
                text: "X",
                class: "tool-btn bf-checked",
                act: function (e, checked) {
                    dt.clipMobile._ui.changeClipDir(this.id, checked);
                }
            },
            {
                id: "clip-btn-y",
                title: "Y向剖切",
                text: "Y",
                class: "tool-btn",
                act: function (e, checked) {
                    dt.clipMobile._ui.changeClipDir(this.id, checked);
                }
            },
            {
                id: "clip-btn-z",
                title: "Z向剖切",
                text: "Z",
                class: "tool-btn",
                act: function (e, checked) {
                    dt.clipMobile._ui.changeClipDir(this.id, checked);
                }
            }
            ],
        },
        fitToView: {
            id: "fitToView-btn",
            title: "充满",
            ico: "img/fitToView.png",
            class: "tool-btn",
            act: function () {
                viewer.fitToView();
            }
        },
        cam: {
            id: "cam-btns",
            title: "视角",
            ico: "img/front.png",
            class: "tool-btn",
            children: [{
                id: "front-btn",
                title: "前",
                ico: "img/front.png",
                class: "tool-btn front-btn",
                act() { viewer.Controller.applyBasicView(this.title); }
            },
            {
                id: "back-btn",
                title: "后",
                ico: "img/back.png",
                class: "tool-btn back-btn",
                act() { viewer.Controller.applyBasicView(this.title); }
            },
            {
                id: "left-btn",
                title: "左",
                ico: "img/left.png",
                class: "tool-btn left-btn",
                act() { viewer.Controller.applyBasicView(this.title); }
            },
            {
                id: "right-btn",
                title: "右",
                ico: "img/right.png",
                class: "tool-btn right-btn",
                act() { viewer.Controller.applyBasicView(this.title); }
            },
            {
                id: "top-btn",
                title: "上",
                ico: "img/top.png",
                class: "tool-btn top-btn",
                act() { viewer.Controller.applyBasicView(this.title); }
            },
            {
                id: "bottom-btn",
                title: "下",
                ico: "img/bottom.png",
                class: "tool-btn bottom-btn",
                act() { viewer.Controller.applyBasicView(this.title); }
            }
            ]
        },
        ground: {
            id: "ground-btns",
            title: "天地",
            ico: "img/ground.png",
            class: "tool-btn",
            children: [{
                id: "ground-btn",
                title: "地面",
                ico: "img/ground.png",
                class: "tool-btn",
                checkable: true,
                act: function (e, checked) {
                    viewer._modelManager.builtin.ground.visible = checked;
                    viewer.redraw("ground");
                }
            },
            {
                id: "sky-btn",
                title: "天空",
                ico: "img/sky.png",
                class: "tool-btn bf-checked",
                checkable: true,
                act: function (e, checked) {
                    viewer._modelManager.builtin.sky.visible = checked;
                    viewer.redraw("sky");
                }
            }

            ]
        },
        lights: _light_adjust__WEBPACK_IMPORTED_MODULE_1__.light_adjust_cmd,
    };
    Web3D.DefaultTools = dt;
}




/***/ }),

/***/ "../src/ui/commands/light_adjust.js":
/*!******************************************!*\
  !*** ../src/ui/commands/light_adjust.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "light_adjust_cmd": () => (/* binding */ light_adjust_cmd)
/* harmony export */ });
/* harmony import */ var _eastdesire_jscolor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @eastdesire/jscolor */ "./node_modules/@eastdesire/jscolor/jscolor.js");
/* harmony import */ var _eastdesire_jscolor__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_eastdesire_jscolor__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _elements_rangeSlide__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../elements/rangeSlide */ "../src/ui/elements/rangeSlide.js");
/* harmony import */ var _elements_rangeSlide__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_elements_rangeSlide__WEBPACK_IMPORTED_MODULE_1__);



_eastdesire_jscolor__WEBPACK_IMPORTED_MODULE_0___default().trigger('change');

function init(viewer) {
    $("body").append(`
    <div id="light-setting" class="docking-panel light-setting">
        <div class="docking-panel-title">光源</div>
        <div class="docking-panel-close">x</div>
        <div class="docking-panel-scroll">
            <div class="light-box light-ambient">
                <div class="light-title">环境光</div>
                <div class="light-attrs light-ambient-color">
                    <div class="light-attrs-name" >颜色:</div>
                    <div class="light-attrs-vlaue">
                        <input aria-label="ambientColor" class="light-attrs-color" data-index=0 value="#ffffff" data-jscolor="{closeButton:true, closeText:'确定'}">
                    </div>
                </div>
                <div class="light-attrs light-intensity">
                    <div class="light-attrs-name">强度:</div>
                    <div class="light-attrs-vlaue">
                        <range-slider id="ambient-intensity" min="0" max="3" step="0.1" value="0" aria-label="rangeSlider1"></range-slider>
                    </div>
                </div></div>
            <div class="light-box light-direction">
                <div class="light-title">平行光</div>
                <div class="light-attrs light-direction-color">
                    <div class="light-attrs-name">颜色:</div>
                    <div class="light-attrs-vlaue">
                        <input aria-label="directionColor" class="light-attrs-color" data-index=2 value="#ffffff" data-jscolor="{closeButton:true, closeText:'确定'}">
                    </div>
                </div>
                <div class="light-attrs light-intensity">
                    <div class="light-attrs-name">强度:</div>
                    <div class="light-attrs-vlaue">
                        <range-slider id="direction-intensity" min="0" max="3" step="0.1" value="0" aria-label="rangeSlider2"></range-slider>
                    </div>
                </div>
                <div class="light-attrs light-direction-position">
                    <div class="light-attrs-name">角度:</div>
                    <div class="light-attrs-vlaue">
                        <range-slider id="light-direction-angle" min="-180" max="180" step="1" value="0" aria-label="rangeSlider3"></range-slider>
                    </div>
                </div>
                <div class="light-attrs light-direction-position">
                    <div class="light-attrs-name">高度:</div>
                    <div class="light-attrs-vlaue">
                        <range-slider id="light-direction-high" min="0" max="10000" step="10" value="0" aria-label="rangeSlider5"></range-slider>
                    </div>
                </div>
            </div>
            <div class="light-box light-hemisphere">
                <div class="light-title">半球光</div>
                <div class="light-attrs light-hemisphere-sky">
                    <div class="light-attrs-name">天空发出光线颜色:</div>
                    <div class="light-attrs-vlaue">
                        <input aria-label="skyColor" class="light-attrs-color" data-index=1 value="#ffffff" data-jscolor="{closeButton:true, closeText:'确定'}">
                    </div>
                </div>
                <div class="light-attrs light-hemisphere-ground">
                    <div class="light-attrs-name">地面发出光线颜色:</div>
                    <div class="light-attrs-vlaue">
                        <input aria-label="groundColor" class="light-attrs-color" data-index=1 data-ground=true value="#ffffff" data-jscolor="{closeButton:true, closeText:'确定'}">
                    </div>
                </div>
                <div class="light-attrs light-intensity">
                    <div class="light-attrs-name">强度:</div>
                    <div class="light-attrs-vlaue">
                        <range-slider id="hemisphere-intensity" min="0" max="3" step="0.1" value="0" aria-label="rangeSlider6"></range-slider>
                    </div>
                </div>
            </div>
            </div>
        </div>
    `);
    $(".docking-panel-close").click(function () {
        $("#settingLights-btns").removeClass("bf-checked");
        $(".light-setting").hide();
    });
    $(".light-attrs-color").change(e => {
        var index = $(e.target).data("index");
        var colorname = $(e.target).data("ground");
        colorname = colorname ? "groundColor" : "color";
        viewer.LightManager[index][colorname] = new THREE.Color(e.target.dataset.currentColor);
        viewer.redraw("ground/sky color");
    });

    let cbs = {
        "ambient-intensity": v => viewer.LightManager.Ambient.intensity = v,
        "direction-intensity": v => viewer.LightManager.Directional.intensity = v,
        "hemisphere-intensity": v => viewer.LightManager.Hemisphere.intensity = v,
        "light-direction-angle": v => viewer.LightManager.SunLightAngle = v,
        "light-direction-high": v => viewer.LightManager.SunLightDirZ = v
    };
    const defaultValues = {
        "ambient-intensity": viewer.LightManager.Ambient.intensity,
        "direction-intensity": viewer.LightManager.Directional.intensity,
        "hemisphere-intensity": viewer.LightManager.Hemisphere.intensity,
        "light-direction-angle": viewer.LightManager.SunLightAngle,
        "light-direction-high": viewer.LightManager.SunLightDirZ
    };
    const elements = document.querySelectorAll(['range-slider']);
    elements.forEach(element => {
        element.insertAdjacentHTML('afterend', `<output>${element.value}</output>`);
        element.addEventListener('change', e => {
            const input = e.target;
            const output = input.nextElementSibling;
            if (output) {
                output.textContent = input.value;
                cbs[input.id](parseFloat(input.value));
                viewer.redraw("light");
            }
        });
        element.value = defaultValues[element.id];
    });
}

var light_adjust_cmd = {
    init: init,
    id: "settingLights-btns",
    title: "光源",
    ico: "img/light.png",
    class: "tool-btn",
    checkable: true,
    act: function (e, checked) {
        if (checked) {
            $("#light-setting").show();
        } else {
            $("#light-setting").hide();
        }
    },
};




/***/ }),

/***/ "../src/ui/common/VisibilityController.js":
/*!************************************************!*\
  !*** ../src/ui/common/VisibilityController.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "VisibilityController": () => (/* binding */ VisibilityController)
/* harmony export */ });
/* harmony import */ var core_model_element_group__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core/model/element_group */ "../src/core/model/element_group.js");



class VisibilityController {
    constructor(viewer, opacity = 0.5) {
        this._viewer = viewer;
        // 相应选择集事件，以便进行自动状态转换
        if (viewer.Selection) {
            viewer.Selection.addEventListener('SELECTION_CHANGED', e => {
                if (!!e.unselect_objs) {
                    e.unselect_objs.forEach(o => {
                        switch (o.VC_status) {
                            case "hiden":
                                this._hiden_set.add(o);
                                break;
                            case "transparent":
                                this._trans_set.add(o);
                                break;
                        }
                    });
                }
            });
        }
        // 三个状态优先级：可见性 > 透明 > 普通
        this._hiden_set = new core_model_element_group__WEBPACK_IMPORTED_MODULE_0__.ElementGroup();
        this._hiden_set.Visible = false;
        this._trans_set = new core_model_element_group__WEBPACK_IMPORTED_MODULE_0__.ElementGroup();
        this._trans_set.Opacity = opacity;
        this._trans_set.ShowTransparent(true);

        // this._hiden_set.addEventListener("OSET_ADDED", e => {
        //     e.object.VC_status = "hiden";
        // });
        this._trans_set.addEventListener("OSET_ADDED", e => {
            e.object.VC_status = "transparent";
        });

    }
    get HidenSet() { return this._hiden_set; }
    get TransparentSet() { return this._trans_set; }
    get Transparency() { return this._trans_set.Transparency; }
    set Transparency(v) { this._trans_set.Transparency = v; }
    reverse_hiden() {
        var all = new core_model_element_group__WEBPACK_IMPORTED_MODULE_0__.ElementGroup(false, ...this._viewer.ModelManager.segments_group.children);
        all.delete(...this._hiden_set);
        this.reset_hiden();
        this._hiden_set.add(...all);
        all.clear();
    }
    reverse_transparent() {
        var all = new core_model_element_group__WEBPACK_IMPORTED_MODULE_0__.ElementGroup(false, ...this._viewer.ModelManager.segments_group.children);
        all.delete(...this._hiden_set);
        all.delete(...this._trans_set);
        this.reset_transparent();
        this._trans_set.add(...all);
        all.clear();
    }
    reset() {
        this.reset_hiden();
        this.reset_transparent();
    }
    reset_hiden() {
        for (var o of this._hiden_set) {
            delete o.VC_status;
        }
        this._hiden_set.clear();
    }
    reset_transparent() {
        for (var o of this._trans_set) {
            delete o.VC_status;
        }
        this._trans_set.clear();
    }
}




/***/ }),

/***/ "../src/ui/common/building_controller.js":
/*!***********************************************!*\
  !*** ../src/ui/common/building_controller.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BuildingController": () => (/* binding */ BuildingController)
/* harmony export */ });
/* harmony import */ var three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three/examples/jsm/controls/OrbitControls */ "./node_modules/three/examples/jsm/controls/OrbitControls.js");


var BASIC_VIEW = {
    cam_rel_pos: [
        { x: 0, y: 1, z: 0 },
        { x: 0, y: -1, z: 0 },
        { x: -1, y: 0, z: 0 },
        { x: 1, y: 0, z: 0 },
        { x: 0, y: 0, z: 1 },
        { x: 0, y: 0, z: -1 },
        { x: 1, y: -1, z: 1 }
    ],
    name_indices: {
        NORTH: 0,
        SOUTH: 1,
        WEST: 2,
        EAST: 3,
        TOP: 4,
        BOTTOM: 5,
        HOME: 6,
        前: 1,
        后: 0,
        左: 2,
        右: 3,
        上: 4,
        下: 5,
    }
};

// 采用Threejs官方提供的浏览（相机）控制
class BuildingController extends three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_0__.OrbitControls {
    constructor(viewer) {
        super(viewer.camera, viewer.Renderer.domElement);
        this.viewer = viewer;
        this.start = false;
        this.inOperation = false;

        var timeoutID;
        this._onstart = () => {
            this.start = true;
            this.inOperation = false;
            clearTimeout(timeoutID);
        };
        this._onchange = () => {
            if (this.start)
                this.inOperation = true;
            this.viewer.redraw("Controller");
        };
        this._onend = () => {
            this.start = false;
            timeoutID = setTimeout(() => this.inOperation = false, 100);
        };

        this.addEventListener('start', this._onstart);
        this.addEventListener('change', this._onchange);
        this.addEventListener('end', this._onend);

        this.screenSpacePanning = true;
        //
        this.maxDistance = 10000;
        //this.enableDamping = true;
    }
    detach() {
        this.removeEventListener('start', this._onstart);
        this.removeEventListener('change', this._onchange);
        this.removeEventListener('end', this._onend);
        this.viewer = null;
        this.dispose();
    }
    applyBasicView(bv) {
        if(!this.viewer) {
            throw "Controller::applyBasicView: Controller is discarded!";
        }
        var position;
        if (typeof (bv) == 'number' && bv >= 0 && bv < 6) {
            position = BASIC_VIEW.cam_rel_pos[bv];
        } else if (typeof (bv) == 'string' && bv in BASIC_VIEW.name_indices) {
            position = BASIC_VIEW.cam_rel_pos[BASIC_VIEW.name_indices[bv]];
        } else {
            throw "Controller::applyBasicView: Wrong parameter!";
        }
        position = new THREE.Vector3(position.x, position.y, position.z);

        var b = this.viewer.ModelManager.BoundingBox;
        // 调整视角
        var arg = {};
        arg.target = new THREE.Vector3();
        b.getCenter(arg.target);
        arg.pos = arg.target.clone();
        arg.pos.add(position);
        this.viewer.look(arg);
        this.viewer.fitToView();
        return true;
    }
}




/***/ }),

/***/ "../src/ui/common/selectionset.js":
/*!****************************************!*\
  !*** ../src/ui/common/selectionset.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SelectionSet": () => (/* binding */ SelectionSet)
/* harmony export */ });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var core_Events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core/Events */ "../src/core/Events.js");
/* harmony import */ var core_model_element_group__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core/model/element_group */ "../src/core/model/element_group.js");





var FiltersProperty = Symbol("filter_property");
var FiltersData = Symbol("filter_funcs");
var FiltersObjects = Symbol("filter_objs");

class SelectionSet extends three__WEBPACK_IMPORTED_MODULE_2__.EventDispatcher {
    constructor(viewer, HighlightColor = 0x880000, opacity = 0.8) {
        super();
        this.viewer = viewer;
        // 选择集逻辑
        // 处理选择集数据
        this._selectionSet = new core_model_element_group__WEBPACK_IMPORTED_MODULE_1__.ElementGroup();
        this._selectionSet.DyeColor = HighlightColor;
        this._selectionSet.DyeOpacity = opacity;
        this._selectionSet.Dye(true);
    }

    enable(v = true) {
        if (!this.eventHandler) {
            var scope = this;
            this.eventHandler = {
                onPickOperation: (event) => {
                    // 确定拾取位置
                    var pos = {};
                    switch (event.type) {
                        case 'touchend':
                            if (event.changedTouches.length > 1)
                                return;
                            pos.x = event.changedTouches[0].clientX;
                            pos.y = event.changedTouches[0].clientY;
                            break;
                        case 'click':
                            pos.x = event.offsetX;
                            pos.y = event.offsetY;
                            break;
                        default:
                            return;
                    }
                    event.preventDefault();
                    if (scope.viewer.Controller && scope.viewer.Controller.inOperation ||
                        scope.viewer.ClipBox && scope.viewer.ClipBox.clipping)
                        return;
                    // 在交互点击位置拾取要处理的对象
                    var toSelectObj = null, pickPos;
                    scope.viewer.pick(pos, (pickinfo) => {
                        for (var f of scope.Filters) {
                            if (!f(pickinfo.object))
                                return false;
                        }
                        toSelectObj = pickinfo.object;
                        pickPos = pickinfo.point;
                    }, this.Filters.ObjectsToSelect);
                    var refresh = false;
                    var unsel_objs = [];
                    if (!event.shiftKey && scope._selectionSet.size > 0) {
                        unsel_objs.push(...([...scope._selectionSet].filter(o => o != toSelectObj)));
                        refresh = scope.unselect_except(toSelectObj, true);
                    }
                    if (!!toSelectObj) {
                        if (!scope._selectionSet.has(toSelectObj)) {
                            if (!event.shiftKey) {
                                unsel_objs.push(...scope._selectionSet);
                            }
                            // 选中
                            refresh = scope.select(toSelectObj, !!event.shiftKey);
                        } else if (!!event.shiftKey) {
                            // 反选
                            unsel_objs.push(toSelectObj);
                            refresh = scope.unselect_one(toSelectObj);
                            toSelectObj = null;
                        }
                    }
                    if (refresh) {
                        // event
                        if (unsel_objs.length < 1) unsel_objs = null;
                        scope.dispatchEvent(core_Events__WEBPACK_IMPORTED_MODULE_0__.Events.SELECTION_CHANGED(toSelectObj, unsel_objs, pickPos, event));
                        //scope.viewer._effects.outline.selectedObjects = scope._selectionSet;
                        scope.viewer.redraw("SELECTION_CHANGED");
                    }
                },
                onEscOperation: (event) => {
                    if (event.keyCode == 27) {
                        scope.unselect_except(null, true);
                    }
                }
            };
        }

        var canvas = this.viewer.Renderer.domElement;
        if (v) {
            canvas.addEventListener('touchend', this.eventHandler.onPickOperation, false);
            canvas.addEventListener('click', this.eventHandler.onPickOperation, false);
            // TODO: canvas不响应键盘事件？
            document.addEventListener('keydown', this.eventHandler.onEscOperation, false);
        } else {
            canvas.removeEventListener('touchend', this.eventHandler.onPickOperation);
            canvas.removeEventListener('click', this.eventHandler.onPickOperation);
            // TODO: canvas不响应键盘事件？
            document.removeEventListener('keydown', this.eventHandler.onEscOperation);
            this.unselect_except(null, true);
        }
    }

    select(...objs) {
        if (objs.length < 1) return false;
        var append = false;
        if (objs.length > 1) {
            append = objs[objs.length - 1];
            if (typeof (append) != "boolean")
                append = false;
            else
                objs.pop();
        }
        if (!append) {
            this._selectionSet.clear();
        }
        if (typeof (objs[0]) == "string") {
            // 将所有参数作为uuid对待
            objs = objs.map(uuid =>
                this.viewer._modelManager.
                    segments_group.children.find(o => o.uuid == uuid));
        }
        var ret = false;
        for (var i = 0; i < objs.length; i++) {
            var obj = objs[i];
            if (!obj) continue;
            if (this._selectionSet.has(obj)) continue;
            this._selectionSet.add(obj);
            ret = true;
        }
        return ret;
    }

    unselect_except(objsToKeep, force_redraw) {
        if (!objsToKeep) objsToKeep = [];
        if (!Array.isArray(objsToKeep))
            objsToKeep = [objsToKeep];
        var refresh = false;
        objsToKeep = objsToKeep.filter(o => this._selectionSet.has(o));
        refresh = (objsToKeep.length != this._selectionSet.size);
        if (refresh) {
            this._selectionSet.clear();
            objsToKeep.forEach(o => this._selectionSet.add(o));
            if (!!force_redraw)
                this.viewer.redraw("unselect_except");
        }
        return refresh;
    }

    unselect_one(obj, force_redraw) {
        if (!obj || !this._selectionSet.has(obj)) {
            return false;
        }
        this._selectionSet.delete(obj);
        if (!!force_redraw) {
            this.viewer.redraw("unselect_one");
        }
        return true;
    }

    get Current() { return this._selectionSet; }
    get HighlightMaterial() { return this._selectionSet.HighlightMaterial; }

    get Filters() {
        if (!this[FiltersProperty]) {
            function getParameterNames(fn) {
                if (typeof fn !== 'function') return [];
                var COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
                var code = fn.toString().replace(COMMENTS, '');
                var result = code.slice(code.indexOf('(') + 1, code.indexOf(')'))
                    .match(/([^\s,]+)/g);
                return result === null
                    ? []
                    : result;
            }
            this[FiltersProperty] = {
                [FiltersData]: new Set(),
                [FiltersObjects]: null,
                add(f) {
                    if (!(f instanceof Function)) return false;
                    if (getParameterNames(f).length != 1) return false;
                    this[FiltersData].add(f);
                    return true;
                },
                remove(f) {
                    return this[FiltersData].delete(f);
                },
                *[Symbol.iterator]() { for (var f of this[FiltersData]) yield f; },
                get ObjectsToSelect() {
                    return this[FiltersObjects];
                },
                set ObjectsToSelect(v) {
                    if (!v) {
                        this[FiltersObjects] = null;
                        return;
                    }
                    if (!Array.isArray(v) || v.length == 0) return;
                    this[FiltersObjects] = v;
                }
            };
        }
        return this[FiltersProperty];
    }
}




/***/ }),

/***/ "../src/ui/elements/ViewCube.js":
/*!**************************************!*\
  !*** ../src/ui/elements/ViewCube.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ViewCube": () => (/* binding */ ViewCube)
/* harmony export */ });

class ViewCube extends HTMLElement {
    // class ViewCube extends EventTarget {
    constructor() {
        super();
        var WrapDiv = document.createElement("div");
        WrapDiv.style.width = "2em";
        WrapDiv.style.height = "2em";
        WrapDiv.style.transformStyle = "preserve-3d";
        // let shadow = this.attachShadow({ mode: 'open' });
        // shadow.appendChild(this.WrapDiv);
        this.appendChild(WrapDiv);
        if (this.classList.length == 0) this.classList.add("cube");
        for (var name in this.FACES_TRANSFORM) {
            WrapDiv.appendChild(this._createFace(name, this.classList));
        }
        this.appendChild(this._createHomeButton(this.classList));
        this.classList.remove(this.classList);
    }
    rotateByCam(cam) {
        if (!cam.isCamera) return false;
        var dir = new THREE.Vector3();
        cam.getWorldDirection(dir);
        var up;
        if (dir.x * dir.x < 0.0001 && dir.y * dir.y < 0.0001) {
            var a = Math.PI / 2 + cam.rotation.toArray()[2];
            if (dir.z > 0)
                up = { x: Math.cos(a), y: Math.sin(a), z: 0 };
            else
                up = { x: Math.cos(-a), y: Math.sin(-a), z: 0 };
        }
        this.rotateByCamDir(dir, up);
    }
    rotateByCamDir(dir, up) {
        if (!up) up = { x: 0, y: 0, z: 1 };
        var ax = 0, az = 0;
        var dr2 = dir.x * dir.x + dir.y * dir.y;
        var ur2 = up.x * up.x + up.y * up.y;
        if (dr2 > 0.0001) {
            az = Math.acos(dir.x / Math.sqrt(dr2));
            if (dir.y * dir.y > 0.0001) {
                az *= dir.y / Math.abs(dir.y);
            }
            az += Math.PI / 2;
            dr2 = dir.x * dir.x + dir.y * dir.y + dir.z * dir.z;
            ax = Math.acos(-dir.z / Math.sqrt(dr2));
        } else if (ur2 > 0.0001) {
            az = -Math.acos(up.x / Math.sqrt(ur2));
            if (up.y * up.y > 0.0001) {
                az = az * up.y / Math.abs(up.y);
            }
            az += Math.PI / 2;
            if (dir.z > 0) {
                ax = Math.PI;
                az -= Math.PI;
            }
        } else {
            throw "Error camera parameters!";
        }
        var wrap = this.getElementsByTagName("div")[0];
        wrap.style.transform = `rotateX(${ax}rad) rotateZ(${az}rad)`;
    }
    _createFace(name, classes) {
        var elDiv = document.createElement("div");
        var size = 2;
        elDiv.style.position = "absolute";
        elDiv.style.width = `${size}em`;
        elDiv.style.height = `${size}em`;
        elDiv.style.textAlign = "center";
        elDiv.style.lineHeight = `${size}em`;
        elDiv.innerText = name;
        elDiv.style.transform = this.FACES_TRANSFORM[name];
        for (var cls of classes)
            elDiv.classList.add(cls);
        elDiv.style.cursor = "pointer";
        elDiv.addEventListener("click", e => {
            var evt = new CustomEvent("clickface");
            evt.face = name;
            evt.button = e.button;
            evt.ctrlKey = e.ctrlKey;
            evt.shiftKey = e.shiftKey;
            evt.altKey = e.altKey;
            this.dispatchEvent(evt);
        });
        return elDiv;
    }
    _createHomeButton(classes) {
        var elDiv = document.createElement("div");
        var size = 0.7;
        elDiv.style.position = "absolute";
        elDiv.style.top = `-${2 * size}em`;
        elDiv.style.left = `-${1.4 * size}em`;
        elDiv.style.width = `${size}em`;
        elDiv.style.height = `${size}em`;
        elDiv.style.textAlign = "center";
        elDiv.style.lineHeight = `${size}em`;
        elDiv.style.borderRadius = "5px";
        var img = document.createElement("img");
        img.src = Web3D.BasePath + "img/home.png";
        img.style.width = img.style.height = `${0.9 * size}em`;
        img.style.display = "inline-block"
        img.style.verticalAlign = "top";
        img.style.filter = "brightness(50%)";
        elDiv.appendChild(img);
        for (var cls of classes)
            elDiv.classList.add(cls);
        elDiv.style.cursor = "pointer";
        elDiv.addEventListener("click", e => {
            var evt = new CustomEvent("clickhome");
            evt.button = e.button;
            evt.ctrlKey = e.ctrlKey;
            evt.shiftKey = e.shiftKey;
            evt.altKey = e.altKey;
            this.dispatchEvent(evt);
        });
        return elDiv;
    }
}

ViewCube.prototype.FACES_TRANSFORM = {
    "上": "translateZ(1em) rotateZ(180deg)",
    "下": "translateZ(-1em) rotateY(180deg)",
    "左": "translateX(1em) rotateY(90deg) rotateZ(-90deg)",
    "右": "translateX(-1em) rotateY(-90deg) rotateZ(90deg)",
    "前": "translateY(-1em) rotateX(90deg) rotateZ(180deg)",
    "后": "translateY(1em) rotateX(-90deg)"
};

if (!customElements.get("web3d-view-cube"))
    customElements.define("web3d-view-cube", ViewCube);




/***/ }),

/***/ "../src/ui/elements/clipSlider.js":
/*!****************************************!*\
  !*** ../src/ui/elements/clipSlider.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ClipSlider": () => (/* binding */ ClipSlider)
/* harmony export */ });
/* harmony import */ var nouislider__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! nouislider */ "./node_modules/nouislider/dist/nouislider.js");
/* harmony import */ var nouislider__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(nouislider__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var nouislider_dist_nouislider_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! nouislider/dist/nouislider.css */ "./node_modules/nouislider/dist/nouislider.css");



class ClipSlider {
    constructor(viewer) {
        this._viewer = viewer;
        this._x = true;
        this._y = false;
        this._z = false;
        var sliderContainer = $("<div>");
        sliderContainer.attr("id", "clipSlide");
        sliderContainer
            .append($("<div>").attr("id", this.idX).addClass("xhandles"))
            .append($("<div>").attr("id", this.idY).addClass("yhandles"))
            .append($("<div>").attr("id", this.idZ).addClass("zhandles"));
        $(viewer.container).append(sliderContainer);
    }

    clear() { this._x = this._y = this._z = false; }
    _getVisibility(dir) {
        return $("#" + this.id(dir)).is(":visible");
    }
    _setVisibility(dir, value) {
        if (value) $("#" + this.id(dir)).show().siblings().hide();
        else $("#" + this.id(dir)).hide();
    }
    get x() { return this._x; }
    set x(v) {
        this.clear();
        this._x = v;
        this._setVisibility("x", v);
    }
    get y() { return this._y; }
    set y(v) {
        this.clear();
        this._y = v;
        this._setVisibility("y", v);
    }
    get z() { return this._z; }
    set z(v) {
        this.clear();
        this._z = v;
        this._setVisibility("z", v);
    }
    get any() {
        return this.x || this.y || this.z;
    }
    id(dir) { return `clipSlide-${dir.toLowerCase()}handles`; }
    get idX() { return this.id('x'); }
    get idY() { return this.id('y'); }
    get idZ() { return this.id('z'); }
    get all_elems() {
        return $(`#${this.idX},#${this.idY},#${this.idZ}`);
    }
    get all_active_elems() {
        return $(`\
            ${this.x ? '#' + this.id('x') : ''}\
            ${this.y ? (this.x ? ',' : '') + '#' + this.id('y') : ''}\
            ${this.z ? (this.x || this.y ? ',' : '') + '#' + this.id('z') : ''}\
        `);
    }

    _createClipSlider(box, cur_box, _this) {
        function create_comp(comp, rangemin, rangemax, startmin, startmax) {
            var slider = document.getElementById(_this.id(comp));
            nouislider__WEBPACK_IMPORTED_MODULE_0___default().create(slider, {
                start: [startmin / 3.28084, startmax / 3.28084],
                connect: true,
                direction: 'rtl',
                orientation: 'vertical',
                tooltips: [true, true],
                range: {
                    'min': [rangemin / 3.28084],
                    'max': [rangemax / 3.28084]
                }
            });
            slider.noUiSlider.on('update', function (values, handle) {
                if (!!_this._viewer.ClipBox) {
                    var clipGroup = [..._this._viewer.ClipBox.planesToClip];
                    var idx = comp.charCodeAt(0) - 'x'.charCodeAt(0);
                    var pos = new THREE.Vector3();
                    pos.setComponent(idx, values[handle] * 3.28084);
                    clipGroup[idx * 2 + handle].setFromPosition(pos);
                    _this._viewer.ClipBox.planesToClip = new Set(clipGroup);
                    _this._viewer.redraw("clip");
                }
            });
        }
        create_comp('x', box.min.x, box.max.x, cur_box.min.x, cur_box.max.x);
        create_comp('y', box.min.y, box.max.y, cur_box.min.y, cur_box.max.y);
        create_comp('z', box.min.z, box.max.z, cur_box.min.z, cur_box.max.z);
    }
    show(shown) {
        //
        this.all_elems.hide();
        this._viewer.ClipBox.active = false;
        this._viewer.ClipBox.hide();
        if (shown) {
            this.all_active_elems.show();
            this._viewer.ClipBox.active = true;
            if (this.any) {
                this._viewer.ClipBox.show(this);
            }

            // 创建滑动条
            if (!this.inited) {
                var box = this._viewer.ClipBox.boundary;
                var cur_box = this._viewer.ClipBox.CurrentBox;
                this._createClipSlider(box, cur_box, this);
                this.inited = true;
            }
        }
        this._viewer.redraw("clip");
    }
    changeClipDir(btnId, enabled) {
        function setClipSlide(boolean, _this) {
            switch (btnId.slice(-1)) {
                case "x":
                    _this.x = boolean;
                    break;
                case "y":
                    _this.y = boolean;
                    break;
                case "z":
                    _this.z = boolean;
                    break;
            }
        }

        setClipSlide(enabled, this);
        if (enabled) {
            this._viewer.ClipBox.show(this);
        } else {
            this.all_elems.hide();
            this._viewer.ClipBox.hide();
        }
        this._viewer.redraw("clip");
    }

    closeClipBox() {
        //关掉剖切滑动条
        this.all_elems.hide();
        this._viewer.ClipBox.active = false;
        this._viewer.ClipBox.hide();
        this._viewer.redraw("clip");
    }
}



/***/ }),

/***/ "../src/ui/elements/command_ui/ContextMenu.js":
/*!****************************************************!*\
  !*** ../src/ui/elements/command_ui/ContextMenu.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ContextMenu": () => (/* binding */ ContextMenu)
/* harmony export */ });
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);


class ContextMenu {
    constructor(viewer, menuId = "context-menu") {
        this.menuBox = jquery__WEBPACK_IMPORTED_MODULE_0___default()("<div>");
        this.menuBox[0].id = menuId;
        this.menuBox.hide();
        jquery__WEBPACK_IMPORTED_MODULE_0___default()("body").append(this.menuBox);
        this.container = jquery__WEBPACK_IMPORTED_MODULE_0___default()(viewer.container);

        this.items = {};

        this._onContextMenu = e => {
            e.preventDefault();
            if (viewer.Controller.inOperation) return;
            for (var menuItem of this.menuBox.children()) {
                var item = this.items[menuItem.id];
                jquery__WEBPACK_IMPORTED_MODULE_0___default()(menuItem).show();
                if ("available" in item && !item.available) {
                    jquery__WEBPACK_IMPORTED_MODULE_0___default()(menuItem).hide();
                }
            }
            var rightedge = this.container[0].clientWidth - e.clientX;
            if (rightedge < this.menuBox[0].offsetHeight) {
                this.menuBox[0].style.left = e.clientX - this.menuBox[0].offsetWidth + "px";
            } else {
                this.menuBox[0].style.left = e.clientX + "px";
            }
            var bottomedge = this.container[0].clientHeight - e.clientY;
            if (bottomedge < this.menuBox[0].offsetHeight) {
                this.menuBox[0].style.top = e.clientY - this.menuBox[0].offsetHeight + "px";
            } else {
                this.menuBox[0].style.top = e.clientY + "px";
            }
            this.menuBox.show();
        };
        this._onHideMenu = e => {
            e.preventDefault();
            this.menuBox.hide();
        };

        this.enabled = true;
    }
    get enabled() { return this._enabled; }
    set enabled(v) {
        if (this._enabled == v) return;
        this._enabled = v;
        if (v) {
            this.container.on("contextmenu", this._onContextMenu);
            this.container.on("click", this._onHideMenu);
            this.menuBox.on("click", this._onHideMenu);
        } else {
            this.container.off("contextmenu", this._onContextMenu);
            this.container.off("click", this._onHideMenu);
            this.menuBox.off("click", this._onHideMenu);
        }
    }
    build(menuData) {
        if (!menuData) return;
        this.menuBox.empty();
        this.items = {};
        for (var item of menuData) {
            if (!item.id || !item.title || !item.act && !item.children)
                continue;
            var menuItem = jquery__WEBPACK_IMPORTED_MODULE_0___default()("<div>");
            menuItem[0].id = item.id;
            menuItem.addClass("context-menu");
            if (!!item.class) menuItem.addClass(item.class);
            menuItem.text(item.title);
            if (!!item.act) {
                menuItem.on("click", item.act);
            } else if (!!item.children) {
            }
            this.menuBox.append(menuItem);
            this.items[item.id] = item;
        }
    }
}



/***/ }),

/***/ "../src/ui/elements/command_ui/command_ui.js":
/*!***************************************************!*\
  !*** ../src/ui/elements/command_ui/command_ui.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CommandUI": () => (/* binding */ CommandUI)
/* harmony export */ });
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);


let _$ = (...args) => jquery__WEBPACK_IMPORTED_MODULE_0___default()(args.map(v => "." + v).join(" "));

class CommandUI extends HTMLElement {
    constructor(ELEMENT_NAME, ELEMENT_CLASS, itemsData = [], builder = null) {
        if (!!ELEMENT_NAME && !window.customElements.get(ELEMENT_NAME)) {
            window.customElements.define(ELEMENT_NAME, ELEMENT_CLASS);
        }
        super();
        this.uibuilder = builder;
        this.build(itemsData);
        _$(this.cssclass.node).on("pointerdown", e => {
            if (!node.hasClass(this.cssclass.clicked_node)) {
                node.addClass(this.cssclass.clicked_node);
            }
            //e.stopPropagation();
        });
        document.addEventListener("pointerup", e => {
            _$(this.cssclass.node).removeClass(this.cssclass.clicked_node);
        });
    }
    get cssclass() {
        throw "子类必须重载这个属性！";
        {
            root_block,
                node,
                clicked_node,
                checked_node,
                popup_block
        }
    }
    build(itemsData) {
        var build_a_node = (action, checkable, unchecksiblings) => {
            // 创建命令项
            let node = document.createElement("div");
            node.id = action.id;
            node.className = action.class;
            if (action.keep_checked)
                node.keep_checked = true;
            node.addClass(this.cssclass.node);

            this.uibuilder.addNodeContent(node, action);

            // 命令执行事件
            let createPopupEvent = (shown) => {
                var evt = new CustomEvent("popup");
                evt.shown = shown;
                return evt;
            }
            let closeAllPopupBar = () => {
                var blocks_to_hide =
                    _$(this.cssclass.root_block, this.cssclass.popup_block)
                        .filter((i, elem) => !elem.parentNode.keep_checked);
                blocks_to_hide.hide();
                var parents = blocks_to_hide.map((i, e) => e.parentNode);
                for (var p of parents) {
                    p.dispatchEvent(createPopupEvent(false));
                    p.removeClass(this.cssclass.checked_node);
                }
            }
            if (!!action.children && !action.act) {
                node.addEventListener("pointerup", e => {
                    e.stopPropagation();
                    // node.removeClass(this.cssclass.clicked_node);
                    var checked = node.hasClass(this.cssclass.checked_node);
                    closeAllPopupBar();
                    if (!checked) {
                        node.addClass(this.cssclass.checked_node);
                        node.dispatchEvent(createPopupEvent(true));
                        jquery__WEBPACK_IMPORTED_MODULE_0___default()(node.querySelector(`.${this.cssclass.popup_block}`)).show();
                    } else {
                        node.removeClass(this.cssclass.checked_node);
                        node.dispatchEvent(createPopupEvent(false));
                        jquery__WEBPACK_IMPORTED_MODULE_0___default()(node.querySelector(`.${this.cssclass.popup_block}`)).hide();
                    }
                });
            } else {
                node.addEventListener("pointerup", e => {
                    e.stopPropagation();
                    // node.removeClass(this.cssclass.clicked_node);
                    closeAllPopupBar();
                    let checked = false;
                    if (checkable) {
                        checked = !node.hasClass(this.cssclass.checked_node);
                        if (checked) {
                            node.addClass(this.cssclass.checked_node);
                        } else {
                            node.removeClass(this.cssclass.checked_node);
                        }
                        if (unchecksiblings) {
                            jquery__WEBPACK_IMPORTED_MODULE_0___default()(node).siblings().removeClass(this.cssclass.checked_node);
                        }
                    }
                    action.act(e, checked);
                });
            }

            return node;
        }
        var build_a_cmds_list_UI = (actions, parent, checkgroup) => {
            actions.forEach(action => {
                let node = build_a_node(action,
                    !!action.checkable || checkgroup, checkgroup);
                parent.append(node);
                if (!!action.children && action.children.length > 0) {
                    var subBar = jquery__WEBPACK_IMPORTED_MODULE_0___default()("<div>");
                    subBar.attr("class", this.cssclass.popup_block);
                    subBar.hide();
                    node.addEventListener("popup", e => {
                        if (!!action.on_popup)
                            action.on_popup(e.shown);
                    });
                    build_a_cmds_list_UI(action.children, subBar,
                        !!action.children_check_group);
                    node.append(subBar[0]);
                }
            });
        }
        this.remove();
        let root = jquery__WEBPACK_IMPORTED_MODULE_0___default()("<div>");
        root.addClass(this.cssclass.root_block);
        this.append(root[0]);
        build_a_cmds_list_UI(itemsData, root);
    }
}

if (!("addClass" in HTMLDivElement.prototype))
    HTMLDivElement.prototype.addClass = function (className) {
        if (!!className)
            this.classList.add(className);
    }

if (!("removeClass" in HTMLDivElement.prototype))
    HTMLDivElement.prototype.removeClass = function (className) {
        if (!!className)
            this.classList.remove(className);
    }

if (!("hasClass" in HTMLDivElement.prototype))
    HTMLDivElement.prototype.hasClass = function (className) {
        return !!className && (new Set(this.classList)).has(className);
    }



/***/ }),

/***/ "../src/ui/elements/command_ui/toolbar.js":
/*!************************************************!*\
  !*** ../src/ui/elements/command_ui/toolbar.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Toolbar": () => (/* binding */ Toolbar)
/* harmony export */ });
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _command_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./command_ui */ "../src/ui/elements/command_ui/command_ui.js");



class Toolbar extends _command_ui__WEBPACK_IMPORTED_MODULE_1__.CommandUI {
    constructor(settings) {
        var viewer = settings.viewer;

        var toolBtnData = Web3D.DefaultTools;
        var actions;
        if (!settings || !settings.actions) {
            actions = Object.keys(toolBtnData).map(function (action) {
                return toolBtnData[action];
            });
        } else {
            actions = settings.actions
                .filter(a => typeof (a) != 'string' || a in toolBtnData)
                .map(function (action) {
                    if (typeof action === 'string') {
                        return toolBtnData[action];
                    }
                    return action;
                });
        }

        super("web3dui-toolbar", Toolbar, actions, {
            addNodeContent(node, action) {
                if (action.ico) {
                    var img = jquery__WEBPACK_IMPORTED_MODULE_0___default()("<img>");
                    img.attr("src", Web3D.BasePath + action.ico)
                        .attr("title", action.title);
                    node.append(img[0]);
                } else {
                    node.textContent = action.text;
                }
                var btnTip = jquery__WEBPACK_IMPORTED_MODULE_0___default()("<span></span>")
                btnTip.attr("class", "btnTip")
                    .text(action.title);
                node.append(btnTip[0]);
            }
        });
    }
    get cssclass() {
        return {
            root_block: "bottom-toolbar",
            node: "btn",
            checked_node: "bf-checked",
            popup_block: "popup",
            clicked_node: "btn-activated"
        };
    }
}




/***/ }),

/***/ "../src/ui/elements/rangeSlide.js":
/*!****************************************!*\
  !*** ../src/ui/elements/rangeSlide.js ***!
  \****************************************/
/***/ (() => {

// import * as style from './styles.css';

const UPDATE_EVENTS = ['input', 'change'];
const REFLECTED_ATTRIBUTES = ['min', 'max', 'step', 'value', 'disabled', 'value-precision'];

const ARIA_ATTRIBUTES = {
    value: 'valuenow',
    min: 'valuemin',
    max: 'valuemax',
};

const TEMPLATE = `
  <div class="thumb-wrapper">
    <div class="thumb"></div>
  </div>
`;

class RangeSliderElement extends HTMLElement {
    constructor() {
        super();
        this._ignoreChange = false;
        this._isRTL = this.getAttribute('dir') === 'rtl';
    }

    static get observedAttributes() {
        return REFLECTED_ATTRIBUTES;
    }

    get _defaultValue() {
        const min = Number(this.min);
        const max = Number(this.max);
        return String(max < min ? min : min + (max - min) / 2);
    }

    get min() { return this.getAttribute('min') || '0'; }
    get max() { return this.getAttribute('max') || '100'; }
    get step() { return this.getAttribute('step') || '1'; }
    get value() { return this.getAttribute('value') || this._defaultValue; }
    get disabled() { return this.getAttribute('disabled') || false }
    get valuePrecision() { return this.getAttribute('value-precision') || ''; }

    set min(min) { this.setAttribute('min', min); }
    set max(max) { this.setAttribute('max', max); }
    set step(step) { this.setAttribute('step', step); }
    set value(value) {
        this.setAttribute('value', value);
        this.dispatchEvent(new Event('change', { bubbles: true }));
    }
    set disabled(disabled) { this.setAttribute('disabled', disabled); }
    set valuePrecision(precision) { this.setAttribute('value-precision', precision); }

    connectedCallback() {
        if (!this.firstChild) {
            this.innerHTML = TEMPLATE;
        }

        this.addEventListener('pointerdown', this._startHandler, false);
        this.addEventListener('pointerup', this._endHandler, false);
        this.addEventListener('keydown', this._keyCodeHandler, false);
        this._update();

        // Aria attributes
        this.setAttribute('tabindex', '0');
        this.setAttribute('role', 'slider');
        setAriaAttribute(this, 'value', this.value);
        setAriaAttribute(this, 'min', this.min);
        setAriaAttribute(this, 'max', this.max);
    }

    disconnectedCallback() {
        this.removeEventListener('pointerdown', this._startHandler, false);
        this.removeEventListener('pointerup', this._endHandler, false);
        this.removeEventListener('keydown', this._keyCodeHandler, false);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue || this._ignoreChange) return;
        this._update();
        setAriaAttribute(this, name, newValue);
    }

    _startHandler(e) {
        this.focus();
        this.classList.add('touch-active');

        // Click and drag
        this.setPointerCapture(e.pointerId);
        this.addEventListener('pointermove', this._moveHandler, false);

        // Click jump
        this._reflectValue(e);
    }

    _moveHandler(e) {
        this._reflectValue(e);
    }

    _endHandler(e) {
        this.classList.remove('touch-active');
        this.releasePointerCapture(e.pointerId);
        this.removeEventListener('pointermove', this._moveHandler, false);

        // TODO: check if value changed
        this.dispatchEvent(new Event('change', { bubbles: true }));
    }

    _keyCodeHandler(e) {
        const code = e.code;
        const up = ['ArrowUp', 'ArrowRight'].includes(code);
        const down = ['ArrowDown', 'ArrowLeft'].includes(code);

        if (up) {
            e.preventDefault();
            this.stepUp();
        } else if (down) {
            e.preventDefault();
            this.stepDown();
        }
    }

    _reflectValue(e) {
        const isRTL = Boolean(this._isRTL);
        const min = Number(this.min);
        const max = Number(this.max);
        const oldValue = this.value;
        const fullWidth = e.target.offsetWidth;
        const offsetX = Math.min(Math.max(e.offsetX, 0), fullWidth);
        const percent = offsetX / fullWidth;
        const percentComplete = isRTL ? 1 - percent : percent;

        // Fit the percentage complete between the range [min,max]
        // by remapping from [0, 1] to [min, min+(max-min)].
        const computedValue = min + percentComplete * (max - min);

        // Constrain value
        const newValue = this._constrainValue(computedValue);

        if (oldValue !== newValue) {
            this.value = newValue;
        }
    }

    _constrainValue(value) {
        const min = Number(this.min);
        const max = Number(this.max);
        const step = Number(this.step);
        const valuePrecision = Number(this.valuePrecision) || getPrescision(this.step) || 0;

        // min, max constrain
        const saveValue = Math.min(Math.max(value, min), max);

        // Rounding in steps
        const nearestValue = Math.round(saveValue / step) * step;

        // Value precision
        const newValue = valuePrecision ? nearestValue.toFixed(valuePrecision) : Math.round(nearestValue).toString();

        return newValue;
    }

    _update() {
        const isRTL = Boolean(this._isRTL);
        const min = Number(this.min);
        const max = Number(this.max);
        const value = Number(this.value);
        const percent = (100 * (value - min)) / (max - min);
        const percentComplete = isRTL ? 100 - percent : percent;
        this.style.setProperty('--value-percent', percentComplete + '%');
    }

    stepUp(amount = this.step) {
        const oldValue = Number(this.value);
        const newValue = this._constrainValue(oldValue + Number(amount));
        if (oldValue !== newValue) {
            this.value = newValue;
        }
    }

    stepDown(amount = this.step) {
        const oldValue = Number(this.value);
        const newValue = this._constrainValue(oldValue - Number(amount));
        if (oldValue !== newValue) {
            this.value = newValue;
        }
    }
}

function getPrescision(value = '') {
    const afterDecimal = value.split('.')[1];
    return afterDecimal ? afterDecimal.length : 0;
}

function setAriaAttribute(element, name, value) {
    const attributeName = ARIA_ATTRIBUTES[name];
    if (!attributeName) return;
    element.setAttribute(`aria-${attributeName}`, value);
}

const ELEMENT_NAME = 'range-slider';

if (!window.customElements.get(ELEMENT_NAME)) {
    // window.RangeSliderElement = RangeSliderElement;
    window.customElements.define(ELEMENT_NAME, RangeSliderElement);
}


/***/ }),

/***/ "../src/ui/lable/CreateLable.js":
/*!**************************************!*\
  !*** ../src/ui/lable/CreateLable.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CreateLable": () => (/* binding */ CreateLable)
/* harmony export */ });
/* harmony import */ var three_examples_jsm_renderers_CSS2DRenderer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three/examples/jsm/renderers/CSS2DRenderer.js */ "./node_modules/three/examples/jsm/renderers/CSS2DRenderer.js");


class CreateLable {

    constructor(viewer) {
        this.viewer = viewer
    }
    create2DObject(message,point,className,name) {
        var div = document.createElement('div');
        /*给标签设置你想要的的样式*/
        div.textContent = message
        div.className = className

        const label = new three_examples_jsm_renderers_CSS2DRenderer_js__WEBPACK_IMPORTED_MODULE_0__.CSS2DObject(div);
        label.name = name
        label.position.set(point.x,point.y,point.z)
        return label;
    }

    create2DObjectSvg(point,message) {
        var div = document.createElement('div');
        div.className = 'elevationStyle'
        let html = '<div class="triangleText"><span>'+message+'</span></div><svg xmlns="http://www.w3.org/2000/svg" version="1.1" style="position: absolute;left: 10px;top: 10px">' +
            '<polyline points="20,20 40,40 60,20 20,20 120,20" style="fill:none;stroke:#ff6600;stroke-width:3"></polyline>' +
            '</svg>'
        div.insertAdjacentHTML('beforeend',html)

        const svg = new three_examples_jsm_renderers_CSS2DRenderer_js__WEBPACK_IMPORTED_MODULE_0__.CSS2DObject(div);
        svg.position.set(point.x,point.y,point.z)
        return svg;
    }

    create2DObjectSvgPointSurface(point) {  
        var div = document.createElement('div');
        div.className = 'elevationStyle'
        let html = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" style="position: absolute;left: 10px;top: 10px">' +
            '<polyline points="20,20 60,20 60,60 20,60 20,20 20,20 60,60 60,20 20,60" style="fill:none;stroke:#ff6600;stroke-width:1"></polyline>' +
            '</svg>'
        div.insertAdjacentHTML('beforeend',html)

        const svg = new three_examples_jsm_renderers_CSS2DRenderer_js__WEBPACK_IMPORTED_MODULE_0__.CSS2DObject(div);
        svg.position.set(point.x,point.y,point.z)
        return svg;
    }

    create2DObjectSvgDropFoot(point) {  //jyp-点线的线的垂直标
        var div = document.createElement('div');
        div.className = 'elevationStyle'
        div.style.width = "40px"
        div.style.height = "120px"
        let html = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" style="position: absolute;left: 10px;top: 10px">' +
            '<polyline points="10,20 10,50 10,50 40,50" style="fill:none;stroke:#ff6600;stroke-width:1.5" />' +
            '<polyline points="10,40 20,40 20,40 20,50" style="fill:none;stroke:#ff6600;stroke-width:1" />' +
            '</svg>'
        div.insertAdjacentHTML('beforeend',html)

        const svg = new three_examples_jsm_renderers_CSS2DRenderer_js__WEBPACK_IMPORTED_MODULE_0__.CSS2DObject(div);
        svg.position.set(point.x,point.y,point.z)
        return svg;
    }
}



/***/ }),

/***/ "../src/ui/pick/PointPick.js":
/*!***********************************!*\
  !*** ../src/ui/pick/PointPick.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PointPick": () => (/* binding */ PointPick)
/* harmony export */ });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var _capture_Capture__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../capture/Capture */ "../src/ui/capture/Capture.js");


class PointPick {
    constructor(viewer) {
        this.viewer = viewer;
    }
    getPick(v = false) {
        let scope = this;
        let mobileMeaHandle = document.getElementById("mobileMeasureHandleArea");
        let mobileMea = document.getElementById("mobileMeasureHandle");
        if (!this.eventHandler) {
            this.eventHandler = function(event) {
                event.preventDefault();
                let currentPoint = new three__WEBPACK_IMPORTED_MODULE_1__.Vector3();
                let point = new three__WEBPACK_IMPORTED_MODULE_1__.Vector3();
                let clientPos = {};
                switch (event.type) {
                    case 'touchmove':
                        let x = event.changedTouches[0].clientX - 22;
                        let y = event.changedTouches[0].clientY - 50;
                        mobileMea.style.left = x + 'px'; //设置图标位置
                        mobileMea.style.top = y + 'px';
                        clientPos.x = x + 6; //取小红点的位置
                        clientPos.y = y;
                        break;
                    case 'mousemove':
                        clientPos.x = event.offsetX;
                        clientPos.y = event.offsetY;
                        break;
                    default:
                        return;
                }

                if (typeof(scope.viewer.pick(clientPos)) == "undefined") {
                    $("#container").css("cursor", "default");
                    return
                } else {
                    $("#container").css("cursor", "crosshair");
                    currentPoint = scope.viewer.pick(clientPos).point;
                }
                //捕捉
                if (scope.viewer.pick(clientPos).object.edge) {
                    //jyp-获取鼠标点击获取物体的所有顶点数据
                    let arr = scope.viewer.pick(clientPos).object.edge.geometry.attributes.position.array;
                    let capture = new _capture_Capture__WEBPACK_IMPORTED_MODULE_0__.Capture(scope.viewer);
                    let point1 = capture.getCapture(scope.viewer, arr, currentPoint);

                    if (typeof(point1) == "undefined") {
                        return
                    } else {
                        point.set(point1.x, point1.y, point1.z)
                    }
                }
            };
        }
        let canvas = scope.viewer.Renderer.domElement;
        if (v) {
            if ('ontouchstart' in document.documentElement) mobileMeaHandle.addEventListener('touchmove', this.eventHandler);
            else canvas.addEventListener('mousemove', this.eventHandler);

        } else {
            canvas.removeEventListener('mousemove', this.eventHandler);
            mobileMeaHandle.removeEventListener('touchmove', this.eventHandler);
        }
    }

}



/***/ }),

/***/ "../src/ui/screenAdaptation.js":
/*!*************************************!*\
  !*** ../src/ui/screenAdaptation.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ScreenAdaptation": () => (/* binding */ ScreenAdaptation)
/* harmony export */ });
//屏幕适配，采用1：100的比例
class ScreenAdaptation {
    constructor() {}
    screenAdapt() {
        var docEl = document.documentElement,
            resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
            _this = this,
            detect = function() {
                _this.detectOrient()
            };

        if (!document.addEventListener)
            return;
        window.addEventListener(resizeEvt, detect, false);
        document.addEventListener('DOMContentLoaded', detect, false);
    }

    detectOrient() {
        var cw = document.documentElement.clientWidth;
        var _Width = 0,
            _Height = 0,
            sw, sh;

        sw = window.screen.width;
        sh = window.screen.height;
        _Width = sw < sh ? sw : sh;
        _Height = sw >= sh ? sw : sh;

        if (cw == _Width) {
            // 竖屏
            this.setFontSize(true);
            return;
        }
        if (cw == _Height) {
            // 横屏
            this.setFontSize(false);
            return;
        }
        if (cw != _Width && cw != _Height) {
            //web端调出开发工具，占据页面位置，使cw变化，而sw和sh不变化，主要为了使调试时候方便
            if (sw < sh) {
                // 竖屏
                this.setFontSize(true);
                return;
            } else {
                // 横屏
                this.setFontSize(false);
                return;
            }
        }
    }

    // @ori boolean 屏幕方向，默认竖屏 true
    setFontSize(ori) {
        var docEl = document.documentElement;
        var clientWidth = docEl.clientWidth;
        var clientHeight = docEl.clientHeight;
        if (!clientWidth) return;
        if (!clientHeight) return;
        if (ori) {
            //竖屏
            if (clientWidth < 750) {
                docEl.style.fontSize = 100 * (clientWidth / 750) + 'px';
            } else {
                docEl.style.fontSize = '100px';
            }
        } else {
            //横屏
            if (clientHeight < 750) {
                docEl.style.fontSize = 100 * (clientHeight / 750) + 'px';
            } else {
                docEl.style.fontSize = '100px';
            }
        }
    }
}



/***/ }),

/***/ "../src/web3d-ui.js":
/*!**************************!*\
  !*** ../src/web3d-ui.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _web3d__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./web3d */ "../src/web3d.js");
/* harmony import */ var ui_common_building_controller__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ui/common/building_controller */ "../src/ui/common/building_controller.js");
/* harmony import */ var ui_common_selectionset__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ui/common/selectionset */ "../src/ui/common/selectionset.js");
/* harmony import */ var ui_clip_clip_manager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ui/clip/clip_manager */ "../src/ui/clip/clip_manager.js");
/* harmony import */ var ui_commands__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ui/commands */ "../src/ui/commands/index.js");
/* harmony import */ var ui_commands_display_control__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ui/commands/display_control */ "../src/ui/commands/display_control.js");
/* harmony import */ var ui_elements_command_ui_toolbar__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ui/elements/command_ui/toolbar */ "../src/ui/elements/command_ui/toolbar.js");
/* harmony import */ var ui_elements_command_ui_ContextMenu__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ui/elements/command_ui/ContextMenu */ "../src/ui/elements/command_ui/ContextMenu.js");
/* harmony import */ var ui_clip_clip_box__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ui/clip/clip_box */ "../src/ui/clip/clip_box.js");
/* harmony import */ var ui_common_VisibilityController__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ui/common/VisibilityController */ "../src/ui/common/VisibilityController.js");
/* harmony import */ var ui_business_DimensionBusiness__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ui/business/DimensionBusiness */ "../src/ui/business/DimensionBusiness.js");
/* harmony import */ var ui_business_ElevationBusiness__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ui/business/ElevationBusiness */ "../src/ui/business/ElevationBusiness.js");
/* harmony import */ var ui_elements_ViewCube__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ui/elements/ViewCube */ "../src/ui/elements/ViewCube.js");
/* harmony import */ var ui_screenAdaptation__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ui/screenAdaptation */ "../src/ui/screenAdaptation.js");













// import { Tag, Tags } from 'ui/Tags'



var Viewer = _web3d__WEBPACK_IMPORTED_MODULE_0__.Web3D.Viewer;
if (!Viewer)
    throw 'Web3D.Viewer is required!';

var screenAdaptation = new ui_screenAdaptation__WEBPACK_IMPORTED_MODULE_13__.ScreenAdaptation();
screenAdaptation.screenAdapt();

var basePath = document.scripts;
for (var u of basePath) {
    try {
        let url = new URL(u.src);
        if (url.pathname.search(/web3d-ui\.[0-9a-z]{20}\.js$/) > -1) {
            _web3d__WEBPACK_IMPORTED_MODULE_0__.Web3D.BasePath = url.href.split("/").slice(0, -1).join('/');
            _web3d__WEBPACK_IMPORTED_MODULE_0__.Web3D.BasePath += '/';
            break;
        }
    } catch { }
}
console.debug("引擎UI静态资源加载路径：", _web3d__WEBPACK_IMPORTED_MODULE_0__.Web3D.BasePath)

_web3d__WEBPACK_IMPORTED_MODULE_0__.Web3D.ClipBox = ui_clip_clip_box__WEBPACK_IMPORTED_MODULE_8__.ClipBox;
_web3d__WEBPACK_IMPORTED_MODULE_0__.Web3D.VisibilityController = ui_common_VisibilityController__WEBPACK_IMPORTED_MODULE_9__.VisibilityController;
_web3d__WEBPACK_IMPORTED_MODULE_0__.Web3D.DimensionBusiness = ui_business_DimensionBusiness__WEBPACK_IMPORTED_MODULE_10__.DimensionBusiness;
_web3d__WEBPACK_IMPORTED_MODULE_0__.Web3D.ElevationBusiness = ui_business_ElevationBusiness__WEBPACK_IMPORTED_MODULE_11__.ElevationBusiness;
// Web3D.Tags = Tags;
// Web3D.Tag = Tag;

Viewer.prototype.UseController = function (mode/*目前只实现建筑类操作模式*/) {
    if (!mode)
        mode = 'building';
    var controller;
    switch (mode) {
        case 'building':
            controller = new ui_common_building_controller__WEBPACK_IMPORTED_MODULE_1__.BuildingController(this);
            controller.saveState();
            break;
    }
    if (!controller) return;

    if (!!this.Controller) {
        this.Controller.detach();
    }
    this.Controller = controller;

    var vcWrap = $("#vc-wrap");
    if (controller) {
        if (vcWrap.length < 1) {
            var viewCube = new ui_elements_ViewCube__WEBPACK_IMPORTED_MODULE_12__.ViewCube();
            viewCube.rotateByCam(this.camera)
            controller.addEventListener('change', e => {
                viewCube.rotateByCam(this.camera)
            });
            viewCube.addEventListener("clickface", e => {
                controller.applyBasicView(e.face);
            });
            viewCube.addEventListener("clickhome", e => {
                controller.applyBasicView("HOME");
            });
            vcWrap = $("<div>").attr("id", "vc-wrap");
            vcWrap.append(viewCube);
            var container = $(this.container);
            container.prepend(vcWrap);
        }
    }
};

Viewer.prototype.InitToolbar = function (toolSetting) {
    toolSetting.viewer = this;
    (0,ui_commands__WEBPACK_IMPORTED_MODULE_4__.init_commands)(this);
    this.Toolbar = new ui_elements_command_ui_toolbar__WEBPACK_IMPORTED_MODULE_6__.Toolbar(toolSetting);
    this.container.append(this.Toolbar);
    // Context Menu
    this.ContextMenu = new ui_elements_command_ui_ContextMenu__WEBPACK_IMPORTED_MODULE_7__.ContextMenu(this);
    var menu_items = [
        _web3d__WEBPACK_IMPORTED_MODULE_0__.Web3D.DefaultTools.home,
        _web3d__WEBPACK_IMPORTED_MODULE_0__.Web3D.DefaultTools.fitToView,
    ];
    if (ui_commands_display_control__WEBPACK_IMPORTED_MODULE_5__.display_control_cmds.init(this)) {
        menu_items.push(...ui_commands_display_control__WEBPACK_IMPORTED_MODULE_5__.display_control_cmds.commands);
    }
    this.ContextMenu.build(menu_items);
};

Viewer.prototype.InitProgress = function (opt) {
    var container = $(this.container);
    var progBar = $(".load-bar");
    var progBarCur = $(".load-bar-inner");
    if (progBar.length < 1) {
        progBar = $("<div>");
        progBar.addClass("load-bar");
        progBarCur = $("<div>");
        progBarCur.addClass("load-bar-inner");
        progBar.append(progBarCur);
        progBar.insertBefore(container.children().first());
    }
    //加载前的等待
    var loadingIcon = $(".loading-icon");
    if (loadingIcon.length < 1) {
        loadingIcon = $("<img>");
        loadingIcon.attr("src", _web3d__WEBPACK_IMPORTED_MODULE_0__.Web3D.BasePath + "img/loading.gif").attr("class", "loading-icon");
        container.prepend(loadingIcon);
    }
    //进度条
    this.addEventListener("LOAD_CHUNK_FINISH", e => {
        $('.loading-icon').hide();
        progBar.show();
        // e.url
        var per = Math.floor(100 * e.index / e.count);
        progBarCur.css("width", per + "%");
    });
    this.addEventListener("LOAD_FINISH", e => {
        // $(".load-bar").hide(1000);
        setTimeout(function () {
            progBar.hide();
        }, 1000);
    });
};

function set_selection_clip(viewer) {
    if (!viewer.ClipManager || !viewer.Selection) return;
    var mat = viewer.Selection.HighlightMaterial;
    for (var group of viewer.ClipManager.groups) {
        if (group.elements.has(mat)) continue;
        group.elements.add(mat);
    }
}

Viewer.prototype.InitSelection = function (highlightColor) {
    if (!!this.Selection) return;
    this.Selection = new ui_common_selectionset__WEBPACK_IMPORTED_MODULE_2__.SelectionSet(this, highlightColor);
    this.Selection.enable(true);
    set_selection_clip(this);
};

Viewer.prototype.InitClipping = function () {
    try {
        this.ClipManager = new ui_clip_clip_manager__WEBPACK_IMPORTED_MODULE_3__.ClipManager(this);
        this.ClipBox = this.ClipManager.addGroup("interactive_box", _web3d__WEBPACK_IMPORTED_MODULE_0__.Web3D.ClipBox);
        var timeoutID = 0;
        // 重新排序并生成场景
        var rebuild = () => {
            this.rebuild(false, false);
        }
        this.ClipBox.addEventListener("CLIP_GROUP_STATUS_CHANGE", rebuild);
        this.ClipBox.addEventListener("CLIP_GROUP_CLIPPED", rebuild);
        set_selection_clip(this);
    }
    catch (e) {
        console.error(e);
    }

};


/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["engine/three","engine/vendors"], () => (__webpack_exec__("../src/web3d-ui.js")));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=web3d-ui.b53a89c6627be2de2661.js.map