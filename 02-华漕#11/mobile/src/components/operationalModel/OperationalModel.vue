<template>
    <div id="OperationalModel">
        <div id="showLeftId" v-show="isShowLeft" @click="showDownTransverse">
            <svg fill-opacity="0.4" t="1648715765295" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2197" width="35" height="35">
                <path d="M513.462857 148.772571c202.020571 0 365.714286 163.693714 365.714286 365.714286s-163.693714 365.714286-365.714286 365.714286-365.714286-163.693714-365.714286-365.714286 163.693714-365.714286 365.714286-365.714286z m-37.888 198.802286a29.110857 29.110857 0 0 0-39.497143-1.609143l-1.901714 1.755429-1.755429 1.901714c-9.216 10.971429-9.216 26.770286 0 37.595429l1.755429 1.901714 124.928 124.928-124.928 124.928-1.755429 1.901714c-8.630857 10.24-9.069714 24.868571-1.462857 35.693715l1.462857 2.048 1.755429 1.901714 1.901714 1.755428c10.825143 9.216 26.770286 9.216 37.595429 0l1.901714-1.755428 144.969143-144.969143 1.901714-2.048c3.510857-4.388571 5.705143-9.508571 6.436572-14.774857l0.146285-2.925714V512c-0.292571-6.144-2.486857-12.288-6.582857-17.408l-1.901714-2.048-144.969143-144.969143z" p-id="2198"></path>
            </svg>
        </div>
        <div id="showRightId" v-show="isShowRight" @click="showUpTransverse">
            <svg fill-opacity="0.4" t="1648716402181" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3026" width="35" height="35">
                <path d="M512 146.285714c202.020571 0 365.714286 163.693714 365.714286 365.714286S714.020571 877.714286 512 877.714286 146.285714 714.020571 146.285714 512s163.693714-365.714286 365.714286-365.714286z m75.922286 197.046857c-10.825143-9.216-26.770286-9.216-37.595429 0l-1.901714 1.755429-144.969143 144.969143-1.901714 2.048c-3.510857 4.388571-5.705143 9.508571-6.436572 14.774857l-0.146285 2.486857v3.803429c0.292571 6.144 2.486857 12.288 6.582857 17.408l1.901714 2.048 144.969143 144.969143c10.825143 10.825143 27.940571 11.410286 39.497143 1.609142l1.901714-1.755428 1.755429-1.901714c9.216-10.971429 9.216-26.770286 0-37.595429l-1.755429-1.901714-124.928-124.928 124.928-124.928 1.755429-1.901715c8.630857-10.24 9.069714-24.868571 1.462857-35.693714l-1.462857-1.901714-1.755429-1.901714-1.901714-1.462858z" p-id="3027"></path>
            </svg>
        </div>
        <div id="notUsedTransverseId" v-show="notUsedTransverse" style="z-index: 9999">
            <div id="rightMeasureBtn" class="rightTransverseId" v-bind:class="{ bgActive: bgActive }" @click="clickMeasureGro">
                <!--  <div style="position: relative;top: 6px"> -->
                <img src="../../assets/img/pointToPoint.png" height="25" width="25" />
                <!-- </div> -->
            </div>
            <div class="rightTransverseId" @click="hideModel">
                <!-- <div style="position: relative;top: 6px"> -->
                <img src="../../assets/img/不可见.png" height="25" width="25" />
                <!-- </div> -->
            </div>
            <div class="rightTransverseId" @click="showModel">
                <!-- <div style="position: relative;top: 6px"> -->
                <img src="../../assets/img/眼睛.png" height="25" width="25" />
                <!-- </div> -->
            </div>
            <div class="rightTransverseId" @click="translucentModel">
                <!-- <div style="position: relative;top: 6px"> -->
                <img src="../../assets/img/锁定透明度.png" height="25" width="25" />
                <!-- </div> -->
            </div>
        </div>
        <div id="showDownId" class="downArrow" @click="showDown" v-show="isShowDown">
            <svg t="1648689640686" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14143" width="30" height="30">
                <path d="M512 32C246.4 32 32 246.4 32 512s214.4 480 480 480 480-214.4 480-480S777.6 32 512 32z m272 595.2c-12.8 12.8-32 12.8-44.8 0L512 400l-227.2 227.2c-12.8 12.8-32 12.8-44.8 0-12.8-12.8-12.8-32 0-44.8l249.6-249.6c12.8-12.8 32-12.8 44.8 0l249.6 249.6c12.8 12.8 12.8 32 0 44.8z" p-id="14144" fill-opacity="0.4"></path>
            </svg>
        </div>
        <div id="showUpId" class="upArrow" v-show="isShowUp">
            <div @click="showUp">
                <svg t="1648689581262" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13808" width="30" height="30">
                    <path d="M512 32C246.4 32 32 246.4 32 512s214.4 480 480 480 480-214.4 480-480S777.6 32 512 32z m272 371.2l-249.6 249.6c-12.8 12.8-32 12.8-44.8 0l-249.6-249.6c-12.8-12.8-12.8-32 0-44.8 12.8-12.8 32-12.8 44.8 0l227.2 227.2 227.2-227.2c12.8-12.8 32-12.8 44.8 0 12.8 12.8 12.8 32 0 44.8z" p-id="13809" fill-opacity="0.4"></path>
                </svg>
            </div>
        </div>
        <div id="notUsedId" class="notUsedStyle" v-show="notUsed">
            <div id="measureBtn" class="notUsedStyleOne" v-bind:class="{ bgActive: bgActive }" @click.stop="clickMeasureGro">
                <div><img src="../../assets/img/pointToPoint.png" height="25" width="25" /></div>
                <div class="span-wrap"><span>标注</span></div>
            </div>
            <div class="notUsedStyleOne" @click.stop="hideModel">
                <div><img src="../../assets/img/不可见.png" height="25" width="25" /></div>
                <div class="span-wrap"><span>隐藏</span></div>
            </div>
            <div class="notUsedStyleOne" @click.stop="showModel">
                <div><img src="../../assets/img/眼睛.png" height="25" width="25" /></div>
                <div class="span-wrap"><span>全显</span></div>
            </div>
            <div class="notUsedStyleOne" @click.stop="translucentModel">
                <div><img src="../../assets/img/锁定透明度.png" height="25" width="25" /></div>
                <div class="span-wrap"><span>半透明</span></div>
            </div>
        </div>
        <MeasureGro :measureGro="measureGro" />
    </div>
</template>
<style>
    #OperationalModel {
        -webkit-box-sizing: content-box !important;
        -moz-box-sizing: content-box !important;
        box-sizing: content-box !important;
    }
    .bgActive {
        background-color: rgba(255, 255, 255, 0.2);
        opacity: 1;
    }

    /* .leftArrow {
        position: absolute;
        top: 0.4rem;
        left: 0.2rem;
        z-index: 100;
    }
    .leftArrow1 {
        position: absolute;
        top: 0.1rem;
        left: 0.3rem;
        text-align: center;
    } */
    .downArrow {
        position: absolute;
        bottom: .1rem;
        text-align: center;
        width: .5rem;
        height: .5rem;
        left: .2rem;
    }
    .upArrow {
        position: absolute;
        bottom: 5.8rem;
        left: 0.2rem;
        text-align: center;
        width: 0.5rem;
        height: 0.5rem;
    }
    .notUsedStyle {
        width: .45rem;
        background: rgba(17, 17, 17, 0.4);
        position: relative;
        left: .2rem;
        bottom: 3rem;
    }
    .notUsedStyle .span-wrap {
        font-size: 0;
    }
    .notUsedStyle span {
        font-size: 14px;
        color: #000;
        transform: translate(-50%, 0%);
        font-weight: normal;
    }
    .notUsedStyleOne {
        position: relative;
        width: .45rem;
        padding: .05rem 0;
    }

    @keyframes notUsedAnimation {
        0% {
            bottom: 0;
        }
        100% {
            bottom: 3rem;
        }
    }

    @keyframes notUsedAnimationDown {
        0% {
            bottom: 3rem;
        }
        100% {
            bottom: 0;
        }
    }
    @keyframes showDownAnimation {
        0% {
            bottom: 4.7rem;
        }
        100% {
            bottom: 2.8rem;
        }
    }

    @keyframes showUpAnimation {
        0% {
            bottom: .1rem;
        }
        100% {
            bottom: 4.7rem;
        }
    }
    @media (orientation: portrait) {

        #showDownId {
            animation: none;
        }
        #showUpId {
            animation: none;
        }
        #showRightId {
            display: none;
        }
        #showLeftId {
            display: none;
        }
        #notUsedTransverseId {
            display: none;
        }

    }
    @media (max-width: 750px),
    (max-height: 750px) {
        .downArrow {
            position: absolute;
            bottom: .8rem;
            left: 0.45rem;
            text-align: center;
            width: 0.5rem;
            height: 0.5rem;
        }
        .upArrow {
            position: absolute;
            bottom: 9.2rem;
            left: 0.45rem;
            text-align: center;
            width: 0.5rem;
            height: 0.5rem;
        }

        .notUsedStyle {
            width: .9rem;
            background: rgba(17, 17, 17, 0.4);
            position: relative;
            left: .3rem;
            bottom: 4.7rem;
        }
        .notUsedStyle .span-wrap {
            font-size: 0;
        }
        .notUsedStyle span {
            font-size: .24rem;
            color: #000;
            transform: translate(-50%, 0%);
            font-weight: normal;
        }
        .notUsedStyleOne {
            position: relative;
            width: .9rem;
            padding: .05rem 0 0.1rem 0;
        }
        .notUsedStyleOne div:first-child {
            width: 0.5rem;
            height: 0.5rem;
            margin: 0 auto;
        }
        .notUsedStyleOne div:first-child img {
            width: 100%;
            height: 100%;
        }
        /*// 横屏 */
        @media (orientation: landscape) {
            .bottom-toolbar {
                background: rgba(17, 17, 17, 0.4);
                top: 50%;
            }
            #showLeftId {
                left: 0.2rem;
                bottom: 0.25rem;
                position: absolute;
            }

            #showRightId {
                position: absolute;
                left: 4.3rem;
                bottom: 0.25rem;
            }

            #notUsedTransverseId {
                background: rgba(17, 17, 17, 0.4);
                position: absolute;
                left: 0.2rem;
                bottom: 0.3rem
            }
        }
        @keyframes notUsedAnimation {
            0% {
                bottom: -5.1rem;
            }
            100% {
                bottom: 4.7rem;
            }
        }

        @keyframes notUsedAnimationDown {
            0% {
                bottom: 4.7rem;
            }
            100% {
                bottom: 0rem;
            }
        }

        @keyframes notUsedAnimationRight {
            0% {
                left: -4.6rem;
            }
            100% {
                left: 0.2rem;
            }
        }

        @keyframes notUsedAnimationLeft {
            0% {
                left: 0.2rem;
            }
            100% {
                left: -4.6rem;
            }
        }

        @keyframes showDownAnimation {
            0% {
                bottom: 9.2rem;
            }
            100% {
                bottom: .8rem;
            }
        }

        @keyframes showUpAnimation {
            0% {
                bottom: .8rem;
            }
            100% {
                bottom: 9.2rem;
            }
        }

        @keyframes showRightAnimation {
            0% {
                left: 0.2rem;
            }
            100% {
                left: 4.3rem;
            }
        }

        @keyframes showLeftAnimation {
            0% {
                left: 4.3rem;
            }
            100% {
                left: 0.2rem;
            }
        }
    }
</style>
<script>
    import $ from "jquery";
    import { operationModel } from "../../assets/js/operationModel";
    import Bus from "../../assets/js/Bus";
    import MeasureGro from '../../components/funModules/MeasureGro'
    //测量标注数据，正常是创建二维码，设定标注，扫二维码，后台请求回的数据，但是目前在屋面上，标注数据是手动写的，在这里加载，做一个显示
    import measureGroInfoData from "../../data/measureGroInfoData"   

    export default {
        name: "OperationalModel",
        props: ['engineItem', 'showMeasureGro'],
        components: {
            MeasureGro
        },
        data() {
            return {
                isShowDown: true,
                isShowUp: false,
                notUsed: false,
                isShowRight: false,
                notUsedTransverse: false,
                isShowLeft: true,
                timer: null,
                measureGro: {
                    show: false,
                    measureGroInfoList: '',
                    isactive: null,
                },
                bgActive: false,
            }
        },
        mounted() {
            let vm = this
            // vm.init()
            Bus.$on("restToober", function(data) {
                vm.isShowDown = data.isShowDown
                vm.isShowLeft = data.isShowLeft
                vm.isShowUp = data.isShowUp
                vm.notUsed = data.notUsed
                vm.isShowRight = data.isShowRight
                vm.notUsedTransverse = data.notUsedTransverse
            })
        },
        watch: {
            search: function() {
                clearTimeout(this.timer); //清除延迟执行
            },
            engineItem: {
                immediate: true,
                handler(newValue, oldValue) {
                    if (newValue.fid && newValue.fid != oldValue.fid) {
                        // 这是原本的逻辑，打开的模型项变了，从打开项里获取measureGroInfo赋值给标注列表，供显示标注使用
                        // this.measureGro.measureGroInfoList = newValue.measureGroInfo;
                        // 目前是标注手写在一个数据文件中，手动赋值，应对打开不同管控点的模型
                        let arr = [];
                        for(let i = 0; i < measureGroInfoData.length; i++){
                            if(measureGroInfoData[i].controlSort.indexOf(newValue.controlSort) > -1){
                                arr.push(measureGroInfoData[i]);
                            }
                        }
                        if(arr.length != 0){
                            this.measureGro.measureGroInfoList = JSON.stringify(arr);
                        }
                    }
                },
                deep: true
            },
            showMeasureGro: { //点击属性按钮，收起测量标注名称展示，按钮设置为未选状态
                immediate: true,
                handler(newValue) {
                    if (newValue === false) {
                        this.bgActive = false;
                        this.measureGro.show = false;
                        let dimensionBusiness = new window.Web3D.DimensionBusiness(window.viewer);
                        dimensionBusiness.cancelOperation();
                    }
                },
                deep: true
            },
        },
        methods: {
            init() {
                let vm = this
                let width = document.documentElement.clientWidth
                let height = document.documentElement.clientHeight
                if (width > height) {
                    vm.isShowDown = false
                    vm.isShowLeft = true
                } else if (width < height) {
                    vm.isShowDown = true
                    vm.isShowLeft = false
                }

            },
            showDown: function() {
                this.notUsed = !this.notUsed
                this.isShowUp = !this.isShowUp
                $("#notUsedId").css("animation", "notUsedAnimation 1s")
                $("#showUpId").css("animation", "showUpAnimation 1s")

                this.isShowDown = !this.isShowDown


            },
            showUp: function() {
                this.isShowDown = !this.isShowDown
                $("#showDownId").css("animation", "showDownAnimation  1s")
                this.isShowUp = !this.isShowUp
                $("#notUsedId").css("animation", "notUsedAnimationDown 1s")
                this.timer = setTimeout(() => { //设置延迟执行
                    this.notUsed = !this.notUsed
                    $("#showDownId").css("animation", "none")
                    $("#notUsedId").css("animation", "none")
                }, 1000);
            },
            showUpTransverse: function() {
                this.isShowLeft = !this.isShowLeft
                this.isShowRight = !this.isShowRight
                $("#showLeftId").css("animation", "showLeftAnimation  1s")
                $("#notUsedTransverseId").css("animation", "notUsedAnimationLeft 1s")
                this.timer = setTimeout(() => { //设置延迟执行
                    this.notUsedTransverse = !this.notUsedTransverse
                    $("#showLeftId").css("animation", "none")
                }, 1000);
            },
            showDownTransverse: function() {
                this.notUsedTransverse = !this.notUsedTransverse
                this.isShowLeft = !this.isShowLeft
                this.isShowRight = !this.isShowRight
                $("#notUsedTransverseId").css("animation", "notUsedAnimationRight 1s")
                $("#showRightId").css("animation", "showRightAnimation 1s")
            },
            hideModel: function() {
                operationModel._hide()

            },
            showModel: function() {
                operationModel._reset()
            },
            translucentModel: function() {
                operationModel._transp()

            },
            clickMeasureGro: function() {
                this.measureGro.show = !this.measureGro.show;
                this.measureGro.isactive = null;
                this.bgActive = !this.bgActive;
                let dimensionBusiness = new window.Web3D.DimensionBusiness(window.viewer);
                dimensionBusiness.cancelOperation();
                this.$emit('hideAttrsApp');
            }
        }
    }
</script>
<style scoped>
    .rightTransverseId {
        float: left;
        position: relative;
        padding: .15rem;
    }
</style>