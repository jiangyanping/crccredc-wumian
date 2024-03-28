<template>
    <div style="height: 100%;background: rgba(129, 211, 248, 0.196078431372549)">
        <div style="height:100%">
            <div class="u11" v-show="isShowU11">
                <img src="../assets/img/u11.png" height="116" width="116" />
            </div>
            <div id="qrdesc-area" class="qrdesc-area" ref="qrdescArea" v-show="qrdescShow">{{qrdesc}}</div>
            <div id="grayLine" class="grayLine" v-show="qrdescShow"></div>
            <div class="content-filelist" v-show="res.show" ref="contentArea">
                <v-container class="grey lighten-5 content-inner" fluid>
                    <v-row id="mutilRes">
                        <v-col cols="4" lg="2" md="3" sm="4" v-for="(item,index) in qRess" :key="index">
                            <v-card class="pa-2" outlined tile align-self-auto>
                                <div v-if="item.type == '3d' || item.type == 'rebim' || item.type == 'criteria'" class="model mutil-res-li" @click.prevent="clickModelRels(item)">
                                    <div class="resIcon">
                                        <div v-if="item.preview" class="resIconWrap">
                                            <img :src="(item.preview)"><span></span>
                                        </div>
                                        <svg v-else class="icon" aria-hidden="true">
                                            <use xlink:href="#icon-3d"></use>
                                        </svg>
                                    </div>
                                    <div class="resname">{{item.name}}</div>
                                </div>
                                <div v-else class="otherRels mutil-res-li" @click.prevent="clickOtherRels(item)">
                                    <div class="resIcon" v-if="typeList.indexOf(item.type) != -1">
                                        <svg class="icon" aria-hidden="true">
                                            <use :xlink:href="'#icon-'+item.type+''"></use>
                                        </svg>
                                    </div>
                                    <div class="resIcon" v-else>
                                        <img src="../assets/img/unknown.png" height="40" width="40" />
                                    </div>
                                    <div class="resname">{{item.name}}</div>
                                </div>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-container>
                <div v-show="isShowNoResources">
                    <span style="color: rgba(0,0,0,0.6);font-size: 20px;position: relative;top:50px">暂无资源</span>
                </div>
            </div>
            <!-- </scroller> -->
            <div class="bottom-toolbar hide" :class="{ 'active': commentBtn.show}">
                <div id="comment-btn" class="tool-btn" @click.prevent="clickCommentBtn()" v-show="comment_btn">
                    <svg v-show="commentNotSelect" t="1648712961160" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4682" width="30" height="30">
                        <path d="M512 0C229.696 0 0 196.672 0 438.421333c0 144.384 82.282667 278.336 220.778667 360.469333l0 203.733333c0 8.213333 4.714667 15.744 12.181333 19.285333C235.882667 1023.338667 239.04 1024 242.154667 1024c4.8 0 9.578667-1.621333 13.461333-4.8l181.589333-147.456c26.794667 3.413333 51.370667 5.077333 74.794667 5.077333 282.282667 0 512-196.693333 512-438.421333C1024 196.672 794.282667 0 512 0zM512.021333 834.090667c-24.106667 0-49.664-1.941333-78.144-5.952-5.845333-0.874667-11.84 0.832-16.448 4.586667l-153.92 125.034667 0-171.2c0-7.701333-4.16-14.848-10.901333-18.602667-131.413333-73.813333-209.877333-197.013333-209.877333-329.514667C42.730667 220.245333 253.269333 42.730667 512 42.730667s469.312 177.472 469.312 395.648S770.773333 834.090667 512.021333 834.090667z" p-id="4683"></path>
                        <path d="M512 438.4m-49.066667 0a2.3 2.3 0 1 0 98.133333 0 2.3 2.3 0 1 0-98.133333 0Z" p-id="4684"></path>
                        <path d="M266.709333 438.4m-49.066667 0a2.3 2.3 0 1 0 98.133333 0 2.3 2.3 0 1 0-98.133333 0Z" p-id="4685"></path>
                        <path d="M757.290667 389.333333c-27.114667 0-49.024 21.952-49.024 49.088 0 27.136 21.888 49.045333 49.024 49.045333 27.157333 0 49.088-21.909333 49.088-49.045333C806.378667 411.285333 784.448 389.333333 757.290667 389.333333z" p-id="4686"></path>
                    </svg>
                    <span class="btnTip">评论</span></div>
            </div>
        </div>
    </div>
</template>
<style scoped>
    .textarea {
        position: relative;
        top: 0.5rem;
        z-index: 9;
    }
    .textareaText {
        width: 94%;
        font-size: .32rem;
    }
    .u11 {
        position: absolute;
        z-index: 1;
        bottom: 0;
        right: 0;
        opacity: 0.18
    }
    .bottom-toolbar .tool-btn {
        border-bottom: none;
    }
    .grayLine {
        width: 90%;
        height: 50px;
        border-bottom: 1px solid #BBBBBB;
        position: relative;
        margin: 0 auto;
    }
    .qrdesc-area {
        font-size: .32rem;
        line-height: 45px;
        border: 2px solid #adb4b8;
        border-radius: 5px;
        background-color: #fff;
        width: calc(100% - 1.1rem);
        max-height: 120px;
        padding: .15rem;
        text-align: justify;
        overflow-y: scroll;
        position: relative;
        top: 30px;
        margin: 0 auto;
    }
    .content-filelist {
        height: calc(100% - 240px);
    }
    .content-inner {
        height: 100%;
        overflow-y: scroll;
    }
    @media (max-width: 750px),
    (max-height: 750px) {
        .content-filelist {
            height: calc(100% - 3.2rem);
        }
        .qrdesc-area {
            font-size: .32rem;
            line-height: 0.45rem;
            border: 2px solid #adb4b8;
            border-radius: 5px;
            background-color: #fff;
            width: calc(100% - 1.1rem);
            max-height: 1.2rem;
            padding: .15rem;
            text-align: justify;
            overflow-y: scroll;
            position: relative;
            top: 0.3rem;
            margin: 0 auto;
        }
        #grayLine {
           height: 0.5rem;
        }
        /* 横屏 */
        @media (orientation:landscape) {
            .content-filelist {
                height: 100%;
            }
            #qrdesc-area {
                width: 90%;
                margin: 0 auto;
            }
            #grayLine {
                width: 90%;
                margin: 0 auto;
            }
        }
    }
    #mutilRes .mutil-res-li {
        color: #568491;
    }
    #mutilRes .resIcon {
        display: flex;
        justify-content: center;
        margin-top: 0.2rem;
    }
    #mutilRes .resIcon .resIconWrap {
        width: 1rem;
        height: 1rem;
    }
    #mutilRes .resIcon svg {
        width: 1rem;
        height: 1rem;
    }
    #mutilRes .resIcon img {
        max-width: 100%;
        max-height: 100%;
        vertical-align: middle;
    }
    #mutilRes .resIcon span {
        display: inline-block;
        height: 100%;
        vertical-align: middle;
    }
    #mutilRes .resname {
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        font-size: .32rem;
        height: .92rem;
        margin-top: .1rem;
        padding: 0 1px;
    }
    .bottom-toolbar {
        background: rgba(0, 0, 0, 0);
    }

</style>
<script>
    import API from "../request/api.js";
    import './../assets/js/iconfont.js'
    import $ from "jquery";
    import Bus from "../assets/js/Bus";
    export default {

        name: 'Resource',
        props: ['res', 'commentBtn'],
        components: {},
        data: function() {
            return {
                qRess: [],
                qid: '',
                documentTitle: '',
                qrdesc: '',
                qrdescShow: false,
                commentNotSelect: true,
                isShowU11: true,
                num: [],
                snapping: true,
                isDownFresh: true,
                isUpLoad: true,
                smooth: true,
                horizonalMode: true,
                left: 0,
                top: 0,
                isShowNoResources: false,
                timer: null,
                comment_btn: true, //从这个变量开始修改逻辑
                supportedFormats: ['docx', 'doc', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf', 'jpg', 'jpeg', 'png', 'gif',
                    'mp3', 'mp4', 'MP4', 'txt'
                ], //支持可阅读格式
                typeList: [
                    '3d', 'icon', 'rebim', 'docx', 'doc', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf', 'zip', 'jpg', 'jpeg', 'png', 'gif',
                    'dwg', 'mp3', 'mp4', 'MP4', 'txt', 'html', 'xml', 'json', 'svg', 'dir', 'rvt', 'avi', 'AVI', 'rar'
                ]
            };
        },
        watch: {
            search: function() {
                clearTimeout(this.timer); //清除延迟执行
            },
            res: {
                immediate: true,
                handler(newValue) {
                    if (newValue.show) {
                        document.title = this.documentTitle;
                    }
                },
                deep: true
            },
        },
        created: function() {
            this.getQid();
            this.getQrRess();

        },
        mounted() {
            let vm = this
            //二维码描述信息多行滚动的时候防止滚动穿透
            /*this.$refs.contentArea.addEventListener('touchmove', (e) => {
                e.stopPropagation();
            }, false);*/
            this.$refs.qrdescArea.addEventListener('touchmove', (e) => {
                e.stopPropagation();
            }, false);

            Bus.$on("isShowU11", function(flag) {
                vm.isShowU11 = flag
            })
            Bus.$on("isCommentIcon", function(flag) {
                vm.comment_btn = flag
            })
        },
        beforeDestroy() {},
        methods: {
            init() {
                this.comment_btn = true
            },
            downfresh(done) {
                let b = this.num[0];
                for (let i = b; i >= b - 5; i--) {
                    this.num.unshift(i);
                }
                done()
            },
            upload(done) {
                if (this.num[this.num.length - 1] < this.qRess.length) {
                    let b = this.num[this.num.length - 1];
                    for (let i = b + 1; i <= b + 5; i++) {
                        this.num.push(i);
                    }
                    done()
                } else {
                    this.$refs.scroll.closeLoad();
                }
            },
            showPosition() {
                let { x: left, y: top } = this.$refs.scroll.getPosition();
                this.left = left;
                this.top = top;
            },
            goTop() {
                this.$refs.scroll.scrollTo(0, true);
                this.showPosition();
            },
            getQid: function() {
                //TODO 为了本地演示所以调整开始
                var qid1 = '';
                var hrefStr = location.href.indexOf('?') > -1 && location.href.length > 1 ? location.href.split("?")[1] : 1;
                if (hrefStr.indexOf('openid') > -1 || hrefStr.indexOf('username') > -1) { //需要微信登录时，登陆完回调地址会变化,可能是openid="333243245",也可能是username=??，这时用sessionStorage.qid
                    qid1 = hrefStr.substring(4, hrefStr.lastIndexOf("&"));
                } else {
                    //qid1 = hrefStr.substr(4, hrefStr.length);
                    qid1 = hrefStr.substring(4, hrefStr.lastIndexOf("#"));
                }
                //结束调整

                //let qid1 = '011e83b7023a48f6a4cba6c3fe2723f9';
                this.qid = qid1;
                this.$emit('transferQid', qid1);
            },
            getQrRess: function() {
                let vm = this;
                this.timer = setTimeout(function() {
                    API.getRQRels({ id: vm.qid }).then(res => {
                        vm.qRess = res.data.data;
                        if (vm.qRess == null) {
                            vm.isShowNoResources = true
                        } else {
                            vm.isShowNoResources = false
                            if (res.data.data.length == 1) {
                                let type = res.data.data[0].type;
                                if (type == '3d' || type == 'rebim' || type == 'criteria') {
                                    vm.isShowU11 = false
                                    vm.comment_btn = false
                                    vm.$emit('resourceFun', res.data.data[0]);
                                    $("#comment-btn").hide()
                                } else {
                                    if (vm.typeList.indexOf(res.data.data[0].type) == -1) {
                                        vm.$message.error("无法打开未知格式文件")
                                        return
                                    }
                                    if (vm.supportedFormats.indexOf(res.data.data[0].type) == -1) {
                                        vm.$message.warning("微信端不支持打开此格式")
                                        return
                                    } else {
                                        vm.$emit('otherResFun', res.data.data[0]);
                                    }

                                }
                            }
                        }
                    });
                    API.getQRName({ qid: vm.qid }).then(res => {
                        document.title = res.data.data.name;
                        let qrdesc = res.data.data.description;
                        if (qrdesc != '') {
                            vm.qrdesc = qrdesc;
                            vm.qrdescShow = true;
                        }
                        vm.documentTitle = res.data.data.name;
                    });
                }, 1000)

            },

            clickModelRels: function(item) {
                let vm = this;
                window.isIndex = false
                vm.comment_btn = false
                vm.isShowU11 = false
                let width = document.documentElement.clientWidth;
                let height = document.documentElement.clientHeight;
                if (width > 750 && height > 750) {
                    //竖屏
                    Bus.$emit("restToober", { isShowDown: true, isShowUp: false, notUsed: false, isShowLeft: false, isShowRight: false, notUsedTransverse: false })
                } else if (width > height) {
                    Bus.$emit("restToober", { isShowDown: false, isShowUp: false, notUsed: false, isShowLeft: true, isShowRight: false, notUsedTransverse: false })
                } else {
                    Bus.$emit("restToober", { isShowDown: true, isShowUp: false, notUsed: false, isShowLeft: false, isShowRight: false, notUsedTransverse: false })
                }
                $('.bottom-toolbar').css("background", "rgba(17, 17, 17, 0.4)");
                let params = {
                    qid: this.qid,
                    proj: item.proj,
                    type: item.type,
                };
                API.QRCodeIsBuild(params).then(res => {
                    if (res.data.data.result == '1') {
                        vm.$emit('resourceFun', item);
                    } else {
                        alert("加载内容正在准备中，请稍后点击!");
                    }
                });
            },
            clickOtherRels: function(item) {
                let vm = this;

                if (vm.typeList.indexOf(item.type) == -1) {
                    this.$message.error("无法打开未知格式文件")
                    return
                }
                if (vm.supportedFormats.indexOf(item.type) == -1) {
                    this.$message.warning("微信端不支持打开此格式")
                    return
                } else {
                    window.isIndex = false;
                    $("#comment2-btn").hide();
                    vm.isShowU11 = false;
                    let params = {
                        qid: this.qid,
                        proj: item.proj,
                        type: item.type,
                    };
                    API.QRCodeIsBuild(params).then(res => {
                        if (res.data.data.result == '1') {
                            vm.$emit('otherResFun', item);
                        } else {
                            alert("加载内容正在准备中，请稍后点击!");
                        }
                    });
                }

            },
            clickCommentBtn: function() {
                this.$emit('showComments');
                window.commentButton = 1
            },
        },
    };
</script>