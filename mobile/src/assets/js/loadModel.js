import { operationModel } from "./operationModel";

export default function loadModel(vm, url, item, boundaryArr, max2, min2) {
    //var url = "http://172.16.2.97/uploads/2021-08-30/b626d27daf09401d868d8b0c9fee10a9/model.zip";
    var OPT = {
        sky: true,
        ground: false,
        axes: true,
        setPixelRatio: true,
    };
    //var cameraPosition;

    var viewInfo;
    var cameraPos;
    var cameraTarget;
    var defaultCameraPos;
    var defaultCameraTarget;
    if (!!item.defaultViewAngle && item.defaultViewAngle != 'null' && item.defaultViewAngle != 'undefined') {
        viewInfo = JSON.parse(item.defaultViewAngle);
        cameraPos = viewInfo.CameraPosition;
        cameraTarget = viewInfo.Target;
        OPT.camera = {};
        if (cameraPos.X || cameraPos.Y || cameraPos.Z) {
            OPT.camera.pos = new window.THREE.Vector3(cameraPos.X, cameraPos.Y, cameraPos.Z);
        } else if (cameraPos.x || cameraPos.y || cameraPos.z) {
            OPT.camera.pos = new window.THREE.Vector3(cameraPos.x, cameraPos.y, cameraPos.z);
        }
        defaultCameraPos = OPT.camera.pos;
        if (cameraTarget.X || cameraTarget.Y || cameraTarget.Z || cameraTarget.X == 0 && cameraTarget.Y == 0 && cameraTarget.Z == 0) {
            OPT.target = new window.THREE.Vector3(cameraTarget.X, cameraTarget.Y, cameraTarget.Z);
        } else if (cameraTarget.x || cameraTarget.y || cameraTarget.z || cameraTarget.x == 0 && cameraTarget.y == 0 && cameraTarget.z == 0) {
            OPT.target = new window.THREE.Vector3(cameraTarget.x, cameraTarget.y, cameraTarget.z);
        }
        defaultCameraTarget = OPT.target;
    }
    if (window.Web3D?.DefaultTools) delete window.Web3D.DefaultTools;
    var container = document.getElementById('container');
    container.width = document.documentElement.clientWidth;
    container.height = document.documentElement.clientHeight;
    var viewer = new window.Web3D.Viewer(container, OPT);

    window.viewer = viewer; //加的，评论时，添加视点，要获取到viewer相机位置用。

    // var visibilityController = new window.Web3D.VisibilityController(viewer,0.5);
    // window.VisibilityController = visibilityController
    viewer.InitProgress();
    viewer.InitClipping();
    viewer.UseController();
    viewer.InitSelection();
    viewer.InitToolbar({
        actions: ["clipMobile", "fitToView", "dim"]
    });
    operationModel.init(viewer)


    // MODEL
    viewer.load(url, function(mesh) {
        mesh.castShadow = false;
        mesh.receiveShadow = false;
        mesh.updateMatrixWorld();
        return true;
    }, { edge: url.substr(0, url.lastIndexOf('/') + 1) + 'edges.json' });
    window.addEventListener('resize', function() {
        viewer.resize(
            document.documentElement.clientWidth,
            document.documentElement.clientHeight
        );
    }, false);
    viewer.Selection.addEventListener('SELECTION_CHANGED', function(e) {
        if (e.object) {
            console.log('选择了：', e.object.uuid);
            //显示属性，调用显示属性方法
            vm.attrsApp.uid = e.object.uuid;
        } else {
            vm.attrsApp.uid = '';
        }
    });

    var view_status = { "all": { "clip": { "max": [650.2288818359375, 231.52099609375, 40.96271404297924], "min": [-366.41412353515625, -207.13818359375, -8.413752555847168] } }, "sofa": { "clip": { "max": [25.332338656483927, 54.560662733550494, 33.35666188956542], "min": [-0.037294470222238474, -26.5571514041882, 23.962306362019046] }, "view": { "pos": [-91.78805729066556, -37.250736456647424, 67.53247311694973], "target": [15.175422164605958, 4.966355623157432, 27.354786247103917] } }, "gate": { "clip": { "max": [51.53720013190717, 3.581719408956526, 25.27424878130754], "min": [20.153223001051494, -26.5571514041882, -3.728371294626852] }, "view": { "pos": [1807.8900886010747, -333.18912190729225, 586.0837912097643], "target": [141.90737915039062, 12.19140625, 16.274480743566038] } } };
    var defaultViewInput = "all";

    function saveView(name) {
        if (!name) return;
        view_status[name] = {
            clip: viewer.ClipBox.boxToJson(),
            view: viewer.getViewInfo()
        };
    }
    if (boundaryArr.length > 0) {
        // 有空间查询条件设定，重新设定刨切最大范围
        viewer.ClipManager.opt.boundary = { max: max2, min: min2 };
        viewer.ClipBoxQR = viewer.ClipManager.addGroup("ClipBoxQR_box", window.Web3D.ClipBox);
        viewer.ClipBoxQR.active = true;
        viewer.ClipBox = viewer.ClipManager.addGroup("interactive_box", window.Web3D.ClipBox);
    }
    viewer.addEventListener("LOAD_FINISH", function() {
        // 调整视角
        //var b = viewer.ModelManager.BoundingBox;
        var arg = { pos: defaultCameraPos, target: defaultCameraTarget };
        //在其他资源的评论中点击视角按钮，保存视角信息，跳转回model.model加载,有视角信息，不需要充满显示
        if (item.viewAngle) {
            var viewAngle = JSON.parse(item.viewAngle);
            arg.pos = new window.THREE.Vector3(viewAngle.x, viewAngle.y, viewAngle.z);
            //b.getCenter(arg.target);
            viewer.look(arg);
        } else {
            //b.getCenter(arg.target);
            viewer.look(arg);
            viewer.fitToView();
        }
        viewer.redraw();
        if (!("all" in view_status))
            saveView("all");
    }, defaultCameraPos, defaultCameraTarget);
    document.addEventListener('keydown', function(event) {
        var l = '';
        switch (event.keyCode) {
            case 72: // h
                l = viewer.LightManager.Hemisphere;
                l.visible = !l.visible;
                viewer.redraw();
                break;
            case 68: // d
                l = viewer.LightManager.Directional;
                l.visible = !l.visible;
                viewer.redraw();
                break;
            case 69: // e
                viewer.fitToView();
                break;
            case 67: // c
                var keys = Object.getOwnPropertyNames(view_status);
                var input = prompt(`输入要显示的区域(${keys})：`, defaultViewInput);
                if (!input) return;
                var status = view_status[input];
                if (!status) {
                    alert(`不存在"${input}"的配置!`);
                    return;
                }
                if (!viewer.ClipBox.active)
                    viewer.ClipBox.active = true;
                viewer.ClipBox.hide();
                viewer.ClipBox.boxFromJson(status.clip);
                if (status.view) {
                    viewer.look(status.view);
                }
                viewer.fitToView();
                viewer.redraw();
                defaultViewInput = input;
                break;
            case 83: // s
                var name = prompt("为当前视图命名：");
                saveView(name);
                break;
        }
    }, false);
}