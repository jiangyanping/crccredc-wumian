<template>
    <div style="position: relative;">
        <div id="container">
        </div>
        <div @click.stop="handleGoBack" class="goBack">
            <svg t="1704783045457" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                p-id="1291" width="64" height="64">
                <path
                    d="M708.42516 957.314205c-13.715373 0-27.426653-5.215792-37.895075-15.678074L277.717627 548.823674c-20.925588-20.893866-20.925588-54.821583 0-75.747171L670.530085 80.225159c20.931728-20.925588 54.821583-20.925588 75.752288 0 20.925588 20.893866 20.925588 54.821583 0 75.747171L391.359874 510.934738l354.922499 354.915335c20.925588 20.931728 20.925588 54.821583 0 75.753311C735.852836 952.098413 722.135416 957.314205 708.42516 957.314205L708.42516 957.314205zM708.42516 957.314205"
                    fill="#ffffff" p-id="1292"></path>
            </svg>
        </div>
        <div class="add-tool-btns">
            <div id="showAttrs-btn" class="tool-btn" :class="{ 'bf-checked': attrsApp.show }">
                <img :src="require('./../assets/img/showAtrrs.png')" title="显示属性" @click.prevent="clickAttrsBtn()">
                <span class="btnTip">属性</span>
            </div>
        </div>
        <!--    控制模型构件显隐组件-->
        <OperationalModel :engineItem="showModelFile" :showMeasureGro="showMeasureGro" @hideAttrsApp="hideAttrsApp">
        </OperationalModel>
        <AttrsApp :attrsApp="attrsApp" />
    </div>
</template>

<script>
import API from "../request/api.js";
import $ from 'jquery'
import loadModel from './../assets/js/loadModel.js'
import AttrsApp from './../components/funModules/AttrsApp'
import OperationalModel from "./../components/operationalModel/OperationalModel";

export default {
    name: 'Engine',
    props: ['engine', 'commentBtn'],
    components: {
        AttrsApp,
        OperationalModel
    },
    data: function () {
        return {
            qid: '',
            attrsApp: {
                show: false,
                uid: '',
                fid: '',
            },
            timer: null,
            showMeasureGro: true,
            modelFiles: [
                {
                    "bin": "https://sofa.rebim.cn/uploads/2024-01-09/0e80bc5234884375acb0449afa054164/08aae32ba4dc42ef87055349367c1f7c.bin,https://sofa.rebim.cn/uploads/2024-01-09/0e80bc5234884375acb0449afa054164/17f63244d2b7414e82fe98dec0500f54.bin,https://sofa.rebim.cn/uploads/2024-01-09/0e80bc5234884375acb0449afa054164/4f5dc129a70a4ffb81310336c466ea62.bin",
                    "defaultViewAngle": "{\"IsPerspective\":false,\"ViewDirection\":{\"X\":0.283416748,\"Y\":0.6629171,\"Z\":-0.6929761},\"CameraPosition\":{\"X\":-20.9145336,\"Y\":41.0085754,\"Z\":513.9055},\"Up\":{\"X\":0.272415817,\"Y\":0.637185633,\"Z\":0.7209605},\"TargetDistance\":882.712036,\"Target\":{\"X\":104.173157,\"Y\":333.591,\"Z\":208.056335}}",
                    "fid": "ef668aa3509544d08cebbcf950061d57",
                    "filename": "01结构层New.rebim",
                    "id": "25e4fb4d030f42f59cb7a53a945da62a",
                    "measureGroInfo": "[{\"name\":\"测量标注分组名称：无\",\"measureInfo\":\"\"}]",
                    "modelrange": null,
                    "name": "01结构层New",
                    "number": "0",
                    "preview": "https://sofa.rebim.cn/uploads/2024-01-09/0e80bc5234884375acb0449afa054164/preview.jpg",
                    "proj": "ef668aa3509544d08cebbcf950061d57",
                    "qid": "25e4fb4d030f42f59cb7a53a945da62a",
                    "qname": "01结构层New",
                    "type": "rebim",
                    "url": "uploads/2024-01-09/0e80bc5234884375acb0449afa054164/",
                    "controlSort": 'constructural'
                },
                {
                    "bin": "https://sofa.rebim.cn/uploads/2024-01-09/83270d569b6c4736a677b94d84f1bcdf/851e56dd1e99402f89330ec0663d76cf.bin,https://sofa.rebim.cn/uploads/2024-01-09/83270d569b6c4736a677b94d84f1bcdf/8b3d45e1c24f48378070f3d38c434205.bin,https://sofa.rebim.cn/uploads/2024-01-09/83270d569b6c4736a677b94d84f1bcdf/ceac00f06b9a437d857023c22959c2b7.bin",
                    "defaultViewAngle": "{\"IsPerspective\":false,\"ViewDirection\":{\"X\":0.3145387,\"Y\":0.479356945,\"Z\":-0.819318235},\"CameraPosition\":{\"X\":-4.34708166,\"Y\":125.571526,\"Z\":632.5975},\"Up\":{\"X\":0.449484974,\"Y\":0.685015,\"Z\":0.573339045},\"TargetDistance\":1005.20471,\"Target\":{\"X\":153.740814,\"Y\":366.497467,\"Z\":220.806213}}",
                    "fid": "b60c749420cc4241b183355d1a13e15a",
                    "filename": "02防水基层new.rebim",
                    "id": "14c43a37ed774b14ad475facae37d9a7",
                    "measureGroInfo": "[{\"name\":\"测量标注分组名称：无\",\"measureInfo\":\"\"}]",
                    "modelrange": null,
                    "name": "02防水基层new",
                    "number": "0",
                    "preview": "https://sofa.rebim.cn/uploads/2024-01-09/83270d569b6c4736a677b94d84f1bcdf/preview.jpg",
                    "proj": "b60c749420cc4241b183355d1a13e15a",
                    "qid": "14c43a37ed774b14ad475facae37d9a7",
                    "qname": "02防水基层new",
                    "type": "rebim",
                    "url": "uploads/2024-01-09/83270d569b6c4736a677b94d84f1bcdf/",
                    "controlSort": "conwaterproofbase",
                },
                {
                    "bin": "https://sofa.rebim.cn/uploads/2024-01-09/ce8e5164b35d4a9fbea274213b05d7f0/5d94960fa47f4b6da1da4c693647aed3.bin,https://sofa.rebim.cn/uploads/2024-01-09/ce8e5164b35d4a9fbea274213b05d7f0/6fce8e73567746549bec452e9f612180.bin,https://sofa.rebim.cn/uploads/2024-01-09/ce8e5164b35d4a9fbea274213b05d7f0/a1b52bd73f1d433a819baf0ae787d6c8.bin",
                    "defaultViewAngle": "{\"IsPerspective\":false,\"ViewDirection\":{\"X\":0.186517477,\"Y\":0.5753069,\"Z\":-0.7963876},\"CameraPosition\":{\"X\":56.6016922,\"Y\":85.33372,\"Z\":671.117737},\"Up\":{\"X\":0.245607644,\"Y\":0.757568538,\"Z\":0.6047866},\"TargetDistance\":1003.61932,\"Target\":{\"X\":150.197968,\"Y\":374.0283,\"Z\":271.482758}}",
                    "fid": "98123e80fe5844c795c14215fb1fe15b",
                    "filename": "03防水层new.rebim",
                    "id": "a891e03c649f422ab9128df81a5996a9",
                    "measureGroInfo": "[{\"name\":\"测量标注分组名称：无\",\"measureInfo\":\"\"}]",
                    "modelrange": null,
                    "name": "03防水层new",
                    "number": "0",
                    "preview": "https://sofa.rebim.cn/uploads/2024-01-09/ce8e5164b35d4a9fbea274213b05d7f0/preview.jpg",
                    "proj": "98123e80fe5844c795c14215fb1fe15b",
                    "qid": "a891e03c649f422ab9128df81a5996a9",
                    "qname": "03防水层new",
                    "type": "rebim",
                    "url": "uploads/2024-01-09/ce8e5164b35d4a9fbea274213b05d7f0/",
                    "controlSort": "conwaterproof"
                },
                {
                    "bin": "https://sofa.rebim.cn/uploads/2024-01-16/b96d0eb0007d4fd79ec685e439755da1/36be0f40c16841b4bfcb5a691d31f7ba.bin,https://sofa.rebim.cn/uploads/2024-01-16/b96d0eb0007d4fd79ec685e439755da1/4475b1a6af444ed7b6f4fd9c3396a3b9.bin,https://sofa.rebim.cn/uploads/2024-01-16/b96d0eb0007d4fd79ec685e439755da1/a34d22b3ea5946019eb5a979e276000a.bin,https://sofa.rebim.cn/uploads/2024-01-16/b96d0eb0007d4fd79ec685e439755da1/a77e766a0f3346f39a3bd10a2ed5344f.bin,https://sofa.rebim.cn/uploads/2024-01-16/b96d0eb0007d4fd79ec685e439755da1/b6b1ea70b8374cf1a04dd27b8de58441.bin,https://sofa.rebim.cn/uploads/2024-01-16/b96d0eb0007d4fd79ec685e439755da1/d4bc4c2358ae4b62bf887aa01addbf28.bin,https://sofa.rebim.cn/uploads/2024-01-16/b96d0eb0007d4fd79ec685e439755da1/e4a128d84c8c4053a7062d3913f4c4c0.bin",
                    "defaultViewAngle": "{\"IsPerspective\":false,\"ViewDirection\":{\"X\":0,\"Y\":2.74130937e-16,\"Z\":-1},\"CameraPosition\":{\"X\":129.595947,\"Y\":325.6519,\"Z\":666.522461},\"Up\":{\"X\":0,\"Y\":1,\"Z\":2.74130937e-16},\"TargetDistance\":1233.91028,\"Target\":{\"X\":129.595947,\"Y\":325.6519,\"Z\":49.56735}}",
                    "fid": "e62e294a92d74bd1af05a6ab539140b7",
                    "filename": "04面层new.rebim",
                    "id": "976e05705ac34984aa788f859b2c4288",
                    "measureGroInfo": "[{\"name\":\"测量标注分组名称：无\",\"measureInfo\":\"\"}]",
                    "modelrange": null,
                    "name": "04面层new",
                    "number": "0",
                    "preview": "https://sofa.rebim.cn/uploads/2024-01-16/b96d0eb0007d4fd79ec685e439755da1/preview.jpg",
                    "proj": "e62e294a92d74bd1af05a6ab539140b7",
                    "qid": "976e05705ac34984aa788f859b2c4288",
                    "qname": "04面层new",
                    "type": "rebim",
                    "url": "uploads/2024-01-16/b96d0eb0007d4fd79ec685e439755da1/",
                    "controlSort": "consurface"
                },
                {
                    "bin": "https://sofa.rebim.cn/uploads/2024-01-16/b96d0eb0007d4fd79ec685e439755da1/36be0f40c16841b4bfcb5a691d31f7ba.bin,https://sofa.rebim.cn/uploads/2024-01-16/b96d0eb0007d4fd79ec685e439755da1/4475b1a6af444ed7b6f4fd9c3396a3b9.bin,https://sofa.rebim.cn/uploads/2024-01-16/b96d0eb0007d4fd79ec685e439755da1/a34d22b3ea5946019eb5a979e276000a.bin,https://sofa.rebim.cn/uploads/2024-01-16/b96d0eb0007d4fd79ec685e439755da1/a77e766a0f3346f39a3bd10a2ed5344f.bin,https://sofa.rebim.cn/uploads/2024-01-16/b96d0eb0007d4fd79ec685e439755da1/b6b1ea70b8374cf1a04dd27b8de58441.bin,https://sofa.rebim.cn/uploads/2024-01-16/b96d0eb0007d4fd79ec685e439755da1/d4bc4c2358ae4b62bf887aa01addbf28.bin,https://sofa.rebim.cn/uploads/2024-01-16/b96d0eb0007d4fd79ec685e439755da1/e4a128d84c8c4053a7062d3913f4c4c0.bin",
                    "defaultViewAngle": "{\"IsPerspective\":false,\"ViewDirection\":{\"X\":0,\"Y\":2.74130937e-16,\"Z\":-1},\"CameraPosition\":{\"X\":129.595947,\"Y\":325.6519,\"Z\":666.522461},\"Up\":{\"X\":0,\"Y\":1,\"Z\":2.74130937e-16},\"TargetDistance\":1233.91028,\"Target\":{\"X\":129.595947,\"Y\":325.6519,\"Z\":49.56735}}",
                    "fid": "e62e294a92d74bd1af05a6ab539140b7",
                    "filename": "04面层new.rebim",
                    "id": "976e05705ac34984aa788f859b2c4288",
                    "measureGroInfo": "[{\"name\":\"测量标注分组名称：无\",\"measureInfo\":\"\"}]",
                    "modelrange": null,
                    "name": "04面层new",
                    "number": "0",
                    "preview": "https://sofa.rebim.cn/uploads/2024-01-16/b96d0eb0007d4fd79ec685e439755da1/preview.jpg",
                    "proj": "e62e294a92d74bd1af05a6ab539140b7",
                    "qid": "976e05705ac34984aa788f859b2c4288",
                    "qname": "04面层new",
                    "type": "rebim",
                    "url": "uploads/2024-01-16/b96d0eb0007d4fd79ec685e439755da1/",
                    "controlSort": "00"
                }

            ],
            showModelFile: {},
        };
    },
    watch: {
        search: function () {
            clearTimeout(this.timer); //清除延迟执行
        },
    },
    mounted() {
        let vm = this;
        for (let i = 0; i < vm.modelFiles.length; i++) {
            if (vm.modelFiles[i].controlSort == this.$route.params.controlSort) {
                vm.showModelFile = vm.modelFiles[i];
                this.loadModel(vm.showModelFile);
            }
        }
        document.title = document.title + '-查看模型';
    },
    methods: {
        loadModel: function (item) {
            let vm = this;
            $("#showAttrs-btn").appendTo($(".add-tool-btns"));
            $("#container").empty();
            let boundaryArr = [];
            if (item.modelrange != '' && item.modelrange != "null" && item.modelrange != undefined && item.modelrange != 'undefined') {
                var urlObject = {}; //处理带条件的模型的条件范围
                var urlArray = item.modelrange.split("&");
                for (var i = 0, len = urlArray.length; i < len; i++) {
                    var urlItem = urlArray[i];
                    var obj = urlItem.split("=");
                    urlObject[obj[0]] = obj[1];
                }
                for (var key in urlObject) {
                    boundaryArr.push(urlObject[key]);
                }
                var max2 = new window.THREE.Vector3(Number(boundaryArr[0]) + 0.01, Number(boundaryArr[1]) + 0.01, Number(boundaryArr[2]) + 0.01);
                var min2 = new window.THREE.Vector3(Number(boundaryArr[3]) - 0.01, Number(boundaryArr[4]) - 0.01, Number(boundaryArr[5]) - 0.01);
            }
            let url = '';
            if (item.type == "3d" || item.type == "rebim") {
                url = API.baseModelURL + item.url + "model.zip";
            } else if (item.type == "criteria") {
                url = API.baseModelURL + "uploads/" + item.url;
            }
            loadModel(vm, url, item, boundaryArr, max2, min2);
            setTimeout(function () {
                $('.bottom-toolbar').css("background", "rgba(17, 17, 17, 0.4)")
                $('.bottom-toolbar .tool-btn.bf-checked').css("border-bottom", "none")
                let toolArr = $('.bottom-toolbar');
                for (var i = 0; i < toolArr.length; i++) {
                    if ($(toolArr[i]).children('#clipMobile-btns').length > 0) {
                        $("#showAttrs-btn").prependTo($(toolArr[i]));
                        $('.bottom-toolbar .tool-btn').css("border-bottom", "none")
                        return;
                    }
                }
            }, 300);
        },
        clickAttrsBtn: function () {
            this.attrsApp.show = !this.attrsApp.show;
            if (this.attrsApp.show) {
                this.showMeasureGro = false;
            }

        },
        cancelAnimation() {
            $("#showDownId").css("animation", "none")
            $("#notUsedId").css("animation", "none")
            $("#showUpId").css("animation", "none")
            $("#notUsedTransverseId").css("animation", "none")
            $("#showRightId").css("animation", "none")
            $("#showLeftId").css("animation", "none")
            $('.bottom-toolbar').css("background", "rgba(0,0,0,0)")
        },
        hideAttrsApp: function () {
            this.attrsApp.show = false;
            this.showMeasureGro = true;
        },
        handleGoBack: function () {
            if (this.$route.params.view == 'ho') this.$router.push('/Home');
            else this.$router.push('/Control/' + this.$route.params.controlSort);
        },
    },
};
</script>
<style>
.add-tool-btns {
    display: none;
}

.leftArrow {
    position: absolute;
    top: 0.4rem;
    left: 0.2rem;
    z-index: 100;
}

.bottom-toolbar {
    background: rgba(17, 17, 17, 0.4);
}

.bottom-toolbar .tool-btn {
    border-bottom: none;
    height: 1.8em;
}

.bottom-toolbar .tool-btn.bf-checked {
    border-bottom: none;
    height: 1.8em;
}

@media (orientation: portrait) {
    .add-tool-btns {
        display: none;
    }
}

.bottom-toolbar .tool-btn .popup {
    top: -1.85em !important;
}
</style>