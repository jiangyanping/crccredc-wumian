<template>
    <div class="resource" ref="contentArea">
        <!-- <v-container class="content-inner" fluid> -->
        <v-list v-if="resource.length != 0">
            <v-list-item
                v-for="(item, index) in resource.filter(res => res.type != '3d' && res.type != 'rebim' && res.type != 'criteria')"
                :key="index" @click="handleGoOtherRes(item.fid)" >
                <div class="line">"</div>
                <v-list-item-avatar>
                    <!-- <div v-if="item.type == '3d' || item.type == 'rebim' || item.type == 'criteria'"
                        class="model mutil-res-li" @click.prevent="clickModelRels(item)">
                        <div class="resIcon">
                            <div v-if="item.preview" class="resIconWrap">
                                <img :src="(item.preview)"><span></span>
                            </div>
                            <svg v-else class="icon" aria-hidden="true">
                                <use xlink:href="#icon-3d"></use>
                            </svg>
                        </div>
                    </div> -->
                    <div class="otherRels mutil-res-li" @click.prevent="clickOtherRels(item)">
                        <div class="resIcon" v-if="typeList.indexOf(item.type) != -1">
                            <svg class="icon" aria-hidden="true">
                                <use :xlink:href="'#icon-' + item.type + ''"></use>
                            </svg>
                        </div>
                        <div class="resIcon" v-else>
                            <img src="../assets/img/unknown.png" height="40" width="40" />
                        </div>
                    </div>
                </v-list-item-avatar>

                <v-list-item-content>
                    <v-list-item-title> {{ item.name }}</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list>
        <!-- <div v-show="resource.length == 0">
            <span style="color: rgba(0,0,0,0.6);font-size: 20px;position: relative;top:50px">暂无资源</span>
        </div> -->
        <div v-else class="noResources"><span>暂无资源</span></div>
        <div @click.stop="handleGoBack" class="goBack">
            <svg t="1704783045457" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                p-id="1291" width="64" height="64">
                <path
                    d="M708.42516 957.314205c-13.715373 0-27.426653-5.215792-37.895075-15.678074L277.717627 548.823674c-20.925588-20.893866-20.925588-54.821583 0-75.747171L670.530085 80.225159c20.931728-20.925588 54.821583-20.925588 75.752288 0 20.925588 20.893866 20.925588 54.821583 0 75.747171L391.359874 510.934738l354.922499 354.915335c20.925588 20.931728 20.925588 54.821583 0 75.753311C735.852836 952.098413 722.135416 957.314205 708.42516 957.314205L708.42516 957.314205zM708.42516 957.314205"
                    fill="#ffffff" p-id="1292"></path>
            </svg>
        </div>
    </div>
</template>

<script>
import API from "../request/api.js";
import './../assets/js/iconfont.js'
import $ from "jquery";
import Bus from "../assets/js/Bus";
import resourceData from "../data/resourcesData"
export default {

    name: 'Resource',
    props: ['res', 'commentBtn'],
    components: {},
    data: function () {
        return {
            // resource: [
            //     {
            //         mark:'jian',
            //         res:[{

            //         }]
            //     },
            // ],
            resourceData,
            resource: [],
            qid: '',
            documentTitle: '',
            num: [],
            left: 0,
            top: 0,
            noResources: false,  //沒有资源
            timer: null,
            supportedFormats: ['docx', 'doc', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf', 'jpg', 'jpeg', 'png', 'gif',
                'mp3', 'mp4', 'MP4', 'txt'
            ], //支持可阅读格式
            typeList: [
                '3d', 'icon', 'rebim', 'docx', 'doc', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf', 'zip', 'jpg', 'jpeg', 'png', 'gif',
                'dwg', 'mp3', 'mp4', 'MP4', 'txt', 'html', 'xml', 'json', 'svg', 'dir', 'rvt', 'avi', 'AVI', 'rar'
            ],

            mark: '',

            control: [
                {
                    controlName: '结构层',
                    controlSort: 'constructural',
                    controlComNumTotal: 0,
                    controlComNumUnconfirmed: 0,
                    color: 'primary',
                },
                {
                    controlName: '防水基层',
                    controlSort: 'conwaterproofbase',
                    controlComNumTotal: 0,
                    controlComNumUnconfirmed: 0,
                    color: 'secondary',
                },
                {
                    controlName: '防水层',
                    controlSort: 'conwaterproof',
                    controlComNumTotal: 0,
                    controlComNumUnconfirmed: 0,
                    color: 'accent',
                },
                {
                    controlName: '面层',
                    controlSort: 'consurface',
                    controlComNumTotal: 0,
                    controlComNumUnconfirmed: 0,
                    color: 'error',
                }
            ]
        };
    },
    watch: {
        search: function () {
            clearTimeout(this.timer); //清除延迟执行
        },
        // res: {
        //     immediate: true,
        //     handler(newValue) {
        //         if (newValue.show) {
        //             document.title = this.documentTitle;
        //         }
        //     },
        //     deep: true
        // },
    },
    created: function () {
        // this.getQid();
        // this.getQrRess();

    },
    mounted() {
        this.mark = this.$route.params.mark;
        for (let item of resourceData) {
            if (this.mark == item.mark) {
                this.resource = item.resource;
                document.title = item.name;
                //改变title
                for (let it of this.control) {
                    if (this.$route.params.view == it.controlSort) {
                        document.title = it.controlName + '检查-' + item.name;
                    }
                }
            }
        }


    },
    methods: {
        getQid: function () {
            //TODO 为了本地演示所以调整开始
            var qid1 = '';
            var hrefStr = location.href.indexOf('?') > -1 && location.href.length > 1 ? location.href.split("?")[1] : 1;
            if (hrefStr.indexOf('openid') > -1 || hrefStr.indexOf('username') > -1) { //需要微信登录时，登陆完回调地址会变化,可能是openid="333243245",也可能是username=??，这时用localStorage.qid
                qid1 = hrefStr.substring(4, hrefStr.lastIndexOf("&"));
            } else {
                //qid1 = hrefStr.substr(4, hrefStr.length);
                qid1 = hrefStr.substring(4, hrefStr.lastIndexOf("#"));
            }
            //结束调整

            //let qid1 = '011e83b7023a48f6a4cba6c3fe2723f9';
            this.qid = qid1;
            //根据qid做一些事

        },
        getQrRess: function () {
            //let vm = this;
            this.timer = setTimeout(function () {
                // API.getRQRels({ id: vm.qid }).then(res => {
                //     vm.resource = res.data.data;
                //     if (vm.resource == null) {
                //         vm.noResources = true
                //     } else {
                //         vm.noResources = false
                //         if (res.data.data.length == 1) {
                //             let type = res.data.data[0].type;
                //             if (type == '3d' || type == 'rebim' || type == 'criteria') {
                //                 vm.$emit('resourceFun', res.data.data[0]);
                //                 $("#comment-btn").hide()
                //             } else {
                //                 if (vm.typeList.indexOf(res.data.data[0].type) == -1) {
                //                     vm.$message.error("无法打开未知格式文件")
                //                     return
                //                 }
                //                 if (vm.supportedFormats.indexOf(res.data.data[0].type) == -1) {
                //                     vm.$message.warning("微信端不支持打开此格式")
                //                     return
                //                 } else {
                //                     vm.$emit('otherResFun', res.data.data[0]);
                //                 }

                //             }
                //         }
                //     }
                // });
                // API.getQRName({ qid: vm.qid }).then(res => {
                //     document.title = res.data.data.name;
                //     let qrdesc = res.data.data.description;
                //     if (qrdesc != '') {
                //         vm.qrdesc = qrdesc;
                //         vm.qrdescShow = true;
                //     }
                //     vm.documentTitle = res.data.data.name;
                // });
            }, 1000)

        },

        clickModelRels: function (item) {
            let vm = this;
            window.isIndex = false
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
        clickOtherRels: function (item) {
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
        handleGoOtherRes(fid) {
            this.$router.push('/OtherRes/' + this.$route.params.view + '/' + this.$route.params.mark + '/' + fid);
        },
        handleGoBack: function () {
            if (this.$route.params.view == 'ho') this.$router.push('/Home');
            else this.$router.push('/control/' + this.$route.params.view);
        },
    },
};
</script>
<style scoped>
.resource {
    height: 100%;
    overflow-y: scroll;
}

.resource .v-list-item__title {
    font-size: .3rem;
    text-align: left;
}


.resource .resIcon {
    display: flex;
    justify-content: center;
}


.resource .resIcon svg {
    width: .5rem;
    height: .5rem;
}

.resource .resIcon img {
    max-width: 100%;
    max-height: 100%;
    vertical-align: middle;
}

.resource .v-avatar {
    border-radius: 0;
    margin-right: 8px;
}

.resource .v-avatar.v-list-item__avatar {
    height: auto !important;
    min-width: auto !important;
    width: auto !important;
}

.resource .v-list-item {
    margin: 12px 0;
    background-color: #fff;
    border-radius: 8px;
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
    padding-left: 0;
    min-height: 0;
    flex-shrink: 0;
    font-size: .3rem;
}

.resource .v-list-item .line {
    display: inline-block;
    width: .15rem;
    height: 100%;
    margin-right: 8px;
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
    background-color: #0099FF;
    padding: 12px 0;
    color: #0099FF;

}

.resource .theme--light.v-list-item:hover::before {
    opacity: 1;
}

.v-list-item--link:before{
    background-color: transparent;
}

.resource .theme--light.v-list {
    background-color: #333;
    margin: 0 16px;
}

.noResources {
    width: 100%;
    height: 100%;
    font-size: 0.34rem;
    display: table;
}

.noResources span {
    display: table-cell;
    vertical-align: middle;
    color: #fff;
}
</style>