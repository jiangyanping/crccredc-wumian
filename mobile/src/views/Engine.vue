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
import modelData from "../data/modelData"
import weixinLogin from "../assets/js/weixinLogin.js";

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
            modelData,
            showModelFile: {},
        };
    },
    watch: {
        search: function () {
            clearTimeout(this.timer); //清除延迟执行
        },
    },
    mounted() {
        document.title = API.docTitle + '-查看模型';
        this.weixinIsLogin();
    },
    methods: {
        /**
         * 微信是否登录
         */
        async weixinIsLogin() {
            let res = await weixinLogin.getWeixinKey();
            if (res && res.realName) {
                //微信登录且绑定账户，则加载对应模型
                for (let i = 0; i < this.modelData.length; i++) {
                    if (this.modelData[i].controlSort == this.$route.params.controlSort) {
                        this.showModelFile = this.modelData[i];
                        this.loadModel(this.showModelFile);
                    }
                }
            }
        },

        /**
         * 加载模型
         */
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