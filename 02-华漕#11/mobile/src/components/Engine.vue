<template>
    <div v-show="engine.show" style="position: relative;top: -100%;">
        <div id="container">
        </div>
        <div @click.prevent="clickGoHome" class="leftArrow">
            <svg opacity="0.3" t="1653530517837" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7542" width="40" height="40">
                <path d="M512 146.285714c202.020571 0 365.714286 163.693714 365.714286 365.714286S714.020571 877.714286 512 877.714286 146.285714 714.020571 146.285714 512s163.693714-365.714286 365.714286-365.714286z m75.922286 197.046857c-10.825143-9.216-26.770286-9.216-37.595429 0l-1.901714 1.755429-144.969143 144.969143-1.901714 2.048c-3.510857 4.388571-5.705143 9.508571-6.436572 14.774857l-0.146285 2.486857v3.803429c0.292571 6.144 2.486857 12.288 6.582857 17.408l1.901714 2.048 144.969143 144.969143c10.825143 10.825143 27.940571 11.410286 39.497143 1.609142l1.901714-1.755428 1.755429-1.901714c9.216-10.971429 9.216-26.770286 0-37.595429l-1.755429-1.901714-124.928-124.928 124.928-124.928 1.755429-1.901715c8.630857-10.24 9.069714-24.868571 1.462857-35.693714l-1.462857-1.901714-1.755429-1.901714-1.901714-1.462858z" p-id="7543" fill="#8a8a8a"></path>
            </svg>
        </div>
        <div class="add-tool-btns">
            <div id="showAttrs-btn" class="tool-btn" :class="{ 'bf-checked': attrsApp.show }">
                <img :src="require('./../assets/img/showAtrrs.png')" title="显示属性" @click.prevent="clickAttrsBtn()">
                <span class="btnTip">属性</span></div>
            <!--      <div id="comment1-btn" class="tool-btn" :class="{ 'active': commentBtn.show}"><img :src="require('./../assets/img/comment.png')" title="评论" @click.prevent="clickCommentBtn()"><span class="btnTip">评论</span></div>-->
            <div id="comment1-btn" class="tool-btn hide" :class="{ 'active': commentBtn.show}">
                <img :src="require('./../assets/img/comment.png')" title="评论" @click.prevent="clickCommentBtn()">
                <span class="btnTip">评论</span>
            </div>
        </div>
        <!--    控制模型构件显隐组件-->
        <OperationalModel :engineItem="engine.item" :showMeasureGro="showMeasureGro" @hideAttrsApp="hideAttrsApp"></OperationalModel>
        <AttrsApp :attrsApp="attrsApp" />
    </div>
</template>
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

    .bottom-toolbar .tool-btn .popup{
        top: -1.85em!important;
    }

</style>
<script>
    import API from "../request/api.js";
    import $ from 'jquery'
    import loadModel from './../assets/js/loadModel.js'
    import AttrsApp from './../components/funModules/AttrsApp'
    import OperationalModel from "./operationalModel/OperationalModel";
    import Bus from "../assets/js/Bus";

    export default {
        name: 'Engine',
        props: ['engine', 'commentBtn'],
        components: {
            AttrsApp,
            OperationalModel
        },
        data: function() {
            return {
                qid: '',
                attrsApp: {
                    show: false,
                    uid: '',
                    fid: '',
                },
                timer: null,
                showMeasureGro: true
            };
        },
        watch: {
            search: function() {
                clearTimeout(this.timer); //清除延迟执行
            },
            engineNew: {
                immediate: true,
                handler(newValue, oldValue) {
                    if (newValue.show && newValue.item.name) {
                        document.title = newValue.item.name;
                    } else if (newValue.show) {
                        document.title = newValue.item.comToRes; //点击小眼睛跳转过来的没有name字段
                    }
                    if (newValue.show && newValue.item.fid != oldValue.item.fid || newValue.show && newValue.item.viewAngle) {
                        this.attrsApp.fid = newValue.item.fid;
                        this.attrsApp.uid = '';
                        this.loadModel(newValue.item);
                    }
                },
                deep: true
            },
        },
        computed: {
            engineNew() {
                return JSON.parse(JSON.stringify(this.engine));
            }
        },
        methods: {
            loadModel: function(item) {
                let vm = this;
                $("#goHomePage-btn").appendTo($(".add-tool-btns"));
                $("#showAttrs-btn").appendTo($(".add-tool-btns"));
                $("#comment1-btn").appendTo($(".add-tool-btns"));
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
                if (item.rebimUrl) { //点击小眼睛，直接能获取到url
                    url = item.rebimUrl;
                } else {
                    if (item.type == "3d" || item.type == "rebim") {
                        url = API.baseModelURL + item.url + "model.zip";
                    } else if (item.type == "criteria") {
                        url = API.baseModelURL + "uploads/" + item.url;
                    }
                }
                loadModel(vm, url, item, boundaryArr, max2, min2);
                setTimeout(function() {
                    $('.bottom-toolbar').css("background", "rgba(17, 17, 17, 0.4)")
                    $('.bottom-toolbar .tool-btn.bf-checked').css("border-bottom", "none")
                    let toolArr = $('.bottom-toolbar');
                    for (var i = 0; i < toolArr.length; i++) {
                        if ($(toolArr[i]).children('#clipMobile-btns').length > 0) {
                            $("#showAttrs-btn").prependTo($(toolArr[i]));
                            $("#comment1-btn").prependTo($(toolArr[i]));
                            $('.bottom-toolbar .tool-btn').css("border-bottom", "none")
                            $("#goHomePage-btn").prependTo($(toolArr[i]));
                            return;
                        }
                    }
                }, 300);
            },
            clickGoHome: function() {
                window.isIndex = true
                this.$emit('goHomePage');
                Bus.$emit("isShowU11", true)
                Bus.$emit("isCommentIcon", true)
                this.cancelAnimation()
            },
            clickAttrsBtn: function() {
                this.attrsApp.show = !this.attrsApp.show;
                if (this.attrsApp.show) {
                    this.showMeasureGro = false;
                }

            },
            clickCommentBtn: function() {
                this.$emit('showComments');
                window.commentButton = 2
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
            hideAttrsApp: function() {
                this.attrsApp.show = false;
                this.showMeasureGro = true;
            }
        },
    };
</script>
<style scoped>
</style>