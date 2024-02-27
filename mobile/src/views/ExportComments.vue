<template>
    <div class="exportComments">
        <div class="mask-shareWord" v-show="shareWord" @click.stop="shareWord = !shareWord">
            <div>
                <img :src="require('../assets/img/exportSign.png')" alt="">
            </div>
        </div>
        <!-- <p>{{ selectedComments }}</p> -->
        <p style="text-align: left;margin-left: 50px;margin-bottom: 0;line-height: 40px;">请选择要导出的评论 <span
                style="float:right;margin-right:.3rem;font-size: .28rem;">已选择数: {{ selectedComments.length }}</span></p>
        <div class="j-selectConditions">
            <v-row class="j-date">
                <v-col cols="9">
                    <v-menu ref="menu" v-model="menu" :close-on-content-click="false" :nudge-right="40"
                        transition="scale-transition" offset-y min-width="auto">
                        <template v-slot:activator="{ on, attrs }">
                            <v-text-field v-model="date" placeholder="请选择删选日期" prepend-icon="mdi-calendar" readonly
                                v-bind="attrs" v-on="on"></v-text-field>
                        </template>
                        <v-date-picker v-model="date" :allowed-dates="allowedDates" :events="functionEvents"
                            event-color="primary lighten-1" no-title :show-current="false" @input="menu = false"
                            locale="zh-cn"></v-date-picker>
                    </v-menu>
                </v-col>
                <v-col cols="3" style="margin-top: -4px;">
                    <v-btn small class="text-no-wrap rounded-pill j-clear-date" outlined color="primary"
                        @click="handleSelectClear()">清空</v-btn>
                </v-col>
            </v-row>
            <v-row class="j-state">

                <v-col cols="12">
                    <v-radio-group v-model="state" row>
                        <template v-slot:label>
                            <div class="j-state-text">请选择评论状态</div>
                        </template>
                        <v-radio label="待整改" value="待"></v-radio>
                        <v-radio label="已整改" value="已"></v-radio>
                    </v-radio-group>
                </v-col>
            </v-row>
            <v-row class="j-person">
                <v-col cols="9">
                    <v-select v-model="createby" :items="comCreateby" label="请选择提出人" single-line></v-select>
                </v-col>
            </v-row>
        </div>
        <div class="comments">
            <div class="com-list" v-if="allCommentsData.length != 0">
                <div v-if="curentCommentsData.length != 0">
                    <div class="com-li clearfix" v-for="(item, index) in curentCommentsData" :key="index">
                        <div class="com-li-title">
                            <div class="com-li-title-name">提出人：{{ item.createby }}</div>
                            <div class="com-li-title-state">Q{{ curentCommentsData.length - index }} {{ item.comState }}整改
                            </div>
                        </div>
                        <template>
                            <div class="com-infor-wrap">
                                <div class="com-a com-infor-con">
                                    <div class="com-top">
                                        <v-checkbox class="com-checkBox" v-model="selectedComments"
                                            :value="item.id"></v-checkbox>
                                    </div>
                                    <div class="com-text">{{ item.text }}</div>
                                    <div class="com-imgs" v-if="item.img"><img class="com-imgs-li" :src="(item.img)"
                                            @click.stop="clickImg($event)" />
                                    </div>
                                    <div class="com-infor">
                                        <span class="com-infor-from">{{ item.controlName }} > {{ item.controlPoint }}</span>
                                        <span class="com-infor-date">{{ item.createat }}</span>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
                <div class="noComments" v-else><span>暂无评论</span></div>
            </div>
            <div class="noComments" v-else><span>暂无评论</span></div>
        </div>
        <v-row class="text-center j-export-comments" justify="center">
            <v-col cols="6">
                <v-btn block large class="primary text-no-wrap rounded-pill j-export-comments-btn"
                    @click="handleExportComments">确认导出并分享</v-btn>
            </v-col>
            <v-col cols="6" style="padding-left:0;">
                <v-btn block large class="primary text-no-wrap rounded-pill j-export-comments-btn"
                    @click="handleExportCommentsReply">整改回复导出并分享</v-btn>
            </v-col>
        </v-row>
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
import wx from 'weixin-js-sdk';
import PhotoSwipe from 'photoswipe'
import PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default'
export default {
    name: 'ExportComments',
    data: function () {
        return {
            //日期控件
            date: '',
            menu: false,
            //评论状态state
            state: '',
            //问题提出人
            createby: '',
            comCreateby: [],

            proid: '08fa9423-a2d5-48a9-aa44-1d97f10e8ae9',
            allCommentsData: [],  //后台请求回的评论数据，经过处理的,所有pid为0的
            curentCommentsData: [],  //当前显示的评论

            popupRealName: false,
            realNameObj: {
                key: '',
                openId: '',
                realName: '',
            },
            selectedComments: [],


            //分享
            shareWord: false,
            url: '',
            appId: API.appId,  //'wx72cc3345b698d35e',//'wxc9760cd0f9ffcfbc',   //开发环境的    wx72cc3345b698d35e   //生产环境的 
            timestamp: '',
            nonceStr: 'Wm3WZYTPz0wzccnW',
            signature: '',

            shareTitle: '屋面工程整改单',  //分享标题
            shareDesc: '描述',   //分享描述
            shareLink: '',   //分享链接
            shareImgUrl: 'http://conmanage.rebim.cn/A-others/images/one.jpg',   //分享图标
        };
    },
    watch: {
        date: {
            handler(newVal) {
                if (newVal != '') {
                    this.state = '';
                    this.createby = '';
                    this.handleSelectSure('');
                    this.handleSelectSure(newVal, 'date');
                }
            },
            immediate: true, //首次绑定的时候，是否执行 handler
        },
        state: {
            handler(newVal) {
                if (newVal != '') {
                    this.date = '';
                    this.createby = '';
                    this.handleSelectSure('');
                    this.handleSelectSure(newVal, 'state');
                }
            },
            immediate: true, //首次绑定的时候，是否执行 handler
        },
        createby: {
            handler(newVal) {
                if (newVal != '') {
                    this.date = '';
                    this.state = '';
                    this.handleSelectSure('');
                    this.handleSelectSure(newVal, 'createby');
                }
            },
            immediate: true, //首次绑定的时候，是否执行 handler
        }
    },

    mounted() {
        this.weixinislogin();
        document.title = API.docTitle + '-导出评论';
    },
    methods: {
        //获取问题发起人
        getUsers(key) {
            let vm = this;
            API.getUsers({ key: key }).then(result => {
                if (result.data.code == 0) {
                    for (let i = 0; i < result.data.data.length; i++) {
                        for (let j = i + 1; j < result.data.data.length; j++) {
                            if (result.data.data[i].realName == result.data.data[j].realName) {
                                result.data.data.splice(j, 1);
                                j--;
                            }
                        }
                    }
                    let arr = [];
                    for (let i = 0; i < result.data.data.length; i++) {
                        arr.push(result.data.data[i].realName);
                    }
                    vm.comCreateby = arr;
                }
            });
        },

        allowedDates(date) {
            let vm = this;
            function allowed(vm) {
                for (let item of vm.allCommentsData) {
                    if (item.createat.slice(0, 10) == date) return true;
                }
            }
            return allowed(vm);
        },

        functionEvents(date) {
            this.allowedDates(date);
        },
        /**
         * 微信是否登录，获取用户信息
         */
        weixinislogin() {
            let vm = this;
            let key = localStorage.getItem('weixinkey');
            if (key) {
                API.weixinislogin({ key: key }).then(result => {
                    if (result.data.code == 0 && result.data.data.realName) {
                        let date = new Date();
                        let year = date.getFullYear();
                        let month = (date.getMonth() + 1).toString().padStart(2, '0');
                        let day = date.getDate().toString().padStart(2, '0');
                        vm.shareDesc = API.buildingName + '-' + year + '/' + month + '/' + day + '-' + result.data.data.realName + '导出';
                        vm.handleQueryComs(); //查询评论，处理，获取评论数量信息
                        vm.getUsers(key);  //获取问题发起人，供以发起人筛选条件
                    }
                });
            } else {
                this.$router.push('/home');  //评论页分享出去，如果localStorage里有key，则请求用户登录信息，否则跳转至home页。
            }
        },

        /**
         * 查询评论
         */
        handleQueryComs() {
            let vm = this;
            //API.getComments({ proid: this.comParams.proid, key: this.comParams.key }).then(res => {
            API.getComments({ proid: this.proid }).then(res => {
                if (Number(res.data.code) === 0) {
                    let d = res.data.data;
                    //选择pid为0,并且按时间顺序，正序排序的评论
                    d.forEach((item) => {
                        item.dueTime = Date.parse(item.createat);
                    });
                    d.sort(function (a, b) {
                        return b.dueTime - a.dueTime;
                    });
                    //截取评论时间，去掉秒
                    d.forEach((item) => {
                        item.createat = item.createat.slice(0, 16);
                        item.checked = false;
                    });

                    vm.allCommentsData = d.filter(item => item.pid == '0');
                    vm.curentCommentsData = [...vm.allCommentsData];
                }
            });
        },

        /**
         * 删选，选择日期或者状态或者问题发起人
         */
        handleSelectSure(data, sort) {
            let arr = [];
            if (data != '') {
                if (sort == 'date') arr = this.allCommentsData.filter(item => item.createat.slice(0, 10) == data);
                if (sort == 'state') arr = this.allCommentsData.filter(item => item.comState == data);
                if (sort == 'createby') arr = this.allCommentsData.filter(item => item.createby == data);
            } else {
                arr = this.allCommentsData;
            }
            this.selectedComments = [];
            this.curentCommentsData = [...arr];
        },

        /**
         * 清除选择条件
         */
        handleSelectClear() {
            this.state = '';
            this.date = '';
            this.createby = '';
            this.handleSelectSure('');
        },

        /**
         * 返回
         */
        handleGoBack: function () {
            this.$router.push('/Home');
        },

        /**
         * 确认导出评论
         */
        handleExportComments() {
            let vm = this;
            vm.shareWord = true;
            let key = localStorage.getItem('weixinkey');
            let str = vm.selectedComments.join(','); //'6dcd20f4f4904bc2b8baf2fbb7e197c5'
            if (key) {
                API.exportComments({ cIDs: str, key: key, louNum: '1' }).then(result => {
                    if (result.data.code == 0) {
                        vm.shareLink = result.data.data;
                        console.log(vm.shareLink);
                        const indexOfHash = window.location.href.indexOf('#');
                        // 如果找到了 #，则截取字符串；否则，返回原始字符串
                        vm.url = indexOfHash !== -1 ? window.location.href.substring(0, indexOfHash) : window.location.href;
                        console.log(vm.url);
                        vm.timestamp = (Date.now()).toString().substring(0, 10);
                        vm.getSignature();
                    }
                });
            } else {
                this.$router.push('/home');  //评论页分享出去，如果localStorage里有key，则请求用户登录信息，否则跳转至home页。
            }
        },

        /**
         * 整改回复导出评论
         */
        handleExportCommentsReply() {
            let vm = this;
            vm.shareWord = true;
            let key = localStorage.getItem('weixinkey');
            let str = vm.selectedComments.join(','); //'6dcd20f4f4904bc2b8baf2fbb7e197c5'
            if (key) {
                API.exportCommentsReply({ cIDs: str, key: key, louNum: '1' }).then(result => {
                    if (result.data.code == 0) {
                        vm.shareLink = result.data.data;
                        console.log(vm.shareLink);
                        const indexOfHash = window.location.href.indexOf('#');
                        // 如果找到了 #，则截取字符串；否则，返回原始字符串
                        vm.url = indexOfHash !== -1 ? window.location.href.substring(0, indexOfHash) : window.location.href;
                        console.log(vm.url);
                        vm.timestamp = (Date.now()).toString().substring(0, 10);
                        vm.getSignature();
                    }
                });
            } else {
                this.$router.push('/home');  //评论页分享出去，如果localStorage里有key，则请求用户登录信息，否则跳转至home页。
            }
        },

        /**
         * 获取签名
         */
        getSignature() {
            API.getSignature().then(result => {
                if (result.data.code == 0) {
                    this.signature = 'jsapi_ticket=' + result.data.data + '&noncestr=' + this.nonceStr + '&timestamp=' + this.timestamp + '&url=' + this.url;
                    console.log(this.signature);
                    this.signature = this.sha1(this.signature);
                    console.log(this.signature);
                    // 在组件加载完成后调用微信JS-SDK的初始化
                    this.initWeixinSDK();
                }
            });
        },

        initWeixinSDK() {
            // 初始化微信JS-SDK
            wx.config({
                debug: false, // 调试模式
                appId: this.appId,
                timestamp: this.timestamp, //生成签名的时间戳
                nonceStr: this.nonceStr, //生成签名的随机串
                signature: this.signature,
                jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData'] // 需要使用的JS接口列表
            });

            // 微信JS-SDK初始化成功后的回调
            wx.ready(() => {
                console.log('微信JS-SDK初始化成功');
                wx.updateAppMessageShareData({
                    title: this.shareTitle,
                    desc: this.shareDesc,
                    link: this.shareLink, //'http://172.16.1.6:8080'
                    imgUrl: this.shareImgUrl,
                    success: () => {
                        // 分享成功回调
                        console.log('分享给朋友成功');
                    },
                    cancel: () => {
                        // 用户取消分享
                        //console.log('用户取消分享给朋友');
                    }
                });
            });
        },

        /**
         * 加密
         * @param {*} s 
         */
        encodeUTF8(s) {
            var i, r = [], c, x;
            for (i = 0; i < s.length; i++)
                if ((c = s.charCodeAt(i)) < 0x80) r.push(c);
                else if (c < 0x800) r.push(0xC0 + (c >> 6 & 0x1F), 0x80 + (c & 0x3F));
                else {
                    if ((x = c ^ 0xD800) >> 10 == 0) //对四字节UTF-16转换为Unicode
                        c = (x << 10) + (s.charCodeAt(++i) ^ 0xDC00) + 0x10000,
                            r.push(0xF0 + (c >> 18 & 0x7), 0x80 + (c >> 12 & 0x3F));
                    else r.push(0xE0 + (c >> 12 & 0xF));
                    r.push(0x80 + (c >> 6 & 0x3F), 0x80 + (c & 0x3F));
                }
            return r;
        },

        /**
         *  字符串加密成 hex 字符串
         */
        sha1(s1) {
            var data = new Uint8Array(this.encodeUTF8(s1))
            var i, j, t;
            var l = ((data.length + 8) >>> 6 << 4) + 16, s = new Uint8Array(l << 2);
            s.set(new Uint8Array(data.buffer)), s = new Uint32Array(s.buffer);
            for (t = new DataView(s.buffer), i = 0; i < l; i++)s[i] = t.getUint32(i << 2)
            s[data.length >> 2] |= 0x80 << (24 - (data.length & 3) * 8);
            s[l - 1] = data.length << 3;
            var w = [], f = [
                function () { return m[1] & m[2] | ~m[1] & m[3]; },
                function () { return m[1] ^ m[2] ^ m[3]; },
                function () { return m[1] & m[2] | m[1] & m[3] | m[2] & m[3]; },
                function () { return m[1] ^ m[2] ^ m[3]; }
            ], rol = function (n, c) { return n << c | n >>> (32 - c); },
                k = [1518500249, 1859775393, -1894007588, -899497514],
                m = [1732584193, -271733879, null, null, -1009589776];
            m[2] = ~m[0], m[3] = ~m[1];
            for (i = 0; i < s.length; i += 16) {
                var o = m.slice(0);
                for (j = 0; j < 80; j++)
                    w[j] = j < 16 ? s[i + j] : rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1),
                        t = rol(m[0], 5) + f[j / 20 | 0]() + m[4] + w[j] + k[j / 20 | 0] | 0,
                        m[1] = rol(m[1], 30), m.pop(), m.unshift(t);
                for (j = 0; j < 5; j++)m[j] = m[j] + o[j] | 0;
            }
            t = new DataView(new Uint32Array(m).buffer);
            for (let i = 0; i < 5; i++)m[i] = t.getUint32(i << 2);

            var hex = Array.prototype.map.call(new Uint8Array(new Uint32Array(m).buffer), function (e) {
                return (e < 16 ? "0" : "") + e.toString(16);
            }).join("");
            return hex;
        },

        /**
         * 点击评论的图片，放大查看
         */
        clickImg: function (e) {
            this.openPhotoSwipe(e.target);
        },

        /**
         * 放大查看图片
         */
        openPhotoSwipe: function (_this) {
            let pswpElement = document.querySelectorAll('.pswp')[0];
            let items = [{
                src: _this.getAttribute('src'),
                w: _this.width * 20,
                h: _this.height * 20
            }];
            let options = {
                // 索引:当前点击
                //index: Index,
                // history & focus options are disabled on CodePen
                history: false,
                focus: false,
                // 图片间的间距
                //spacing: 0.05,
                //点击图片/黑边关闭
                //tapToClose: true,
                showAnimationDuration: 0,
                hideAnimationDuration: 0
            };
            let gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
            gallery.init();
        },

        /**
         * 筛选pid为0的评论
         */
        commentsDataF(data) {
            return data.filter(item => item.pid == 0);
        },

        /**
         * 筛选一个评论下的子评论
         */
        commentsDataC(data, it) {
            return data.filter(item => item.pid == it.id);
        },

        /**
         * 是否有子评论
         */
        hasChild: function (it, item) {
            for (let o of it.comments) {
                if (o.pid == item.id) {
                    return true;
                }
            }
        },

    }
}
</script>
<style scoped>
@import '../assets/css/comment.css';

.exportComments {
    /* color:#fff; */
    height: 100%;
    width: 100%;
    position: relative;
    background-color: #fff;
}

.commentsTree {
    height: calc(100% - 120px);
    overflow-y: scroll;
}

.commentsTreePanel {
    max-height: calc(100% - 10px);
}

::v-deep .v-messages {
    min-height: 0;
}

.v-expansion-panel-header>*:not(.v-expansion-panel-header__icon) {
    flex: none;
}

.v-input--selection-controls {
    margin-top: 8px;
    padding-top: 0;
}

.v-application--is-ltr .v-expansion-panel-header {
    font-size: .32rem;
}

::v-deep .v-expansion-panel-content__wrap {
    padding-bottom: 4px;
}

/* ::v-deep .v-expansion-panel--active:not(:first-child), .v-expansion-panel--active + .v-expansion-panel{
    margin-top:0px;
} */

::v-deep .v-expansion-panel--active>.v-expansion-panel-header {
    min-height: 44px;
}

/* .v-expansion-panel[data-v-5aede2fc]:last-child {
    margin-bottom: 0;
} */

.v-expansion-panel-header {
    padding: 4px .28rem;
}

.controlPointSort-wrap .v-expansion-panel-header {
    padding: 4px 6px;
}

.comments-wrap .v-expansion-panel-header {
    padding: 4px 0px;
}

.comments-wrap {
    max-height: 4.4rem;
    overflow-y: scroll;
}

.theme--light.v-expansion-panels .controlPointSort-wrap .v-expansion-panel {
    background-color: transparent;
}

.controlPointSort-wrap .v-expansion-panel::before {
    box-shadow: none;
}

::v-deep .commentsTree .v-input--selection-controls__input .v-icon {
    color: #0066cc !important;
    caret-color: #0066cc !important;
}

.row {
    margin: 0;
}

.j-export-comments {
    width: 100%;
    height: 0.88rem !important;
    position: absolute;
    bottom: 30px;
    z-index: 10000;
}

.j-export-comments-btn {
    font-size: .28rem;
}

::v-deep .v-expansion-panel:last-child {
    margin-bottom: 10px;
}

.comments-wrap ::v-deep .v-expansion-panel-header__icon {
    margin-top: 8px;
}

.comments-wrap .v-expansion-panel-header {
    align-items: flex-start;
}

.comments-wrap .comments-fatherContent {
    flex: 1;
    margin-top: 8px;
}

.comments {
    height: calc(100% - 260px);
    border-top: 1px solid #dfdfdf;
    border-bottom: 1px solid #dfdfdf;
    margin: 0 .28rem;
}

.com-list {
    height: 100%;
    overflow-y: scroll;
}

.com-checkBox {
    display: inline-block;
    float: right;
    margin-right: -10px;
    margin-top: 0;
}

.com-infor {
    margin: 0;
    height: .6rem;
    line-height: .6rem;
}

::v-deep .v-input--selection-controls__input .v-icon {
    color: #0066CC
}

/* 分享遮罩-shart */
.mask-shareWord {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    z-index: 10003;
}

.mask-shareWord img {
    width: 75%;
    height: 80%;
    padding: 10px 15px;
    float: right;
}

/* 分享遮罩-end */

/* 删选条件-start */
.v-picker {
    font-size: 14px;
}

::v-deep .mdi-calendar {
    color: #0066CC !important;
}

.j-sure-date {
    font-size: .24rem;
    float: right;
    width: 30px;
    padding-top: 6px;
}

.j-clear-date {
    font-size: .24rem;
    float: right;
    width: 30px;
    height: 40px;
    padding: 10px 10px 10px 0;
}


.j-clear-date span {
    font-size: .24rem;
    float: left;
    width: 30px;
    height: 40px;
    padding: 10px 10px 10px 0;
}

.j-clear-date svg {
    width: 100%;
    height: 100%;
}

.j-clear-date.col-2 {
    padding-left: 0;
    padding-top: 0;
}

::v-deep .v-text-field__details {
    display: none;
}

::v-deep .v-input__slot {
    margin-bottom: 0;
}

.j-selectConditions {
    margin: 0 .28rem;
}

.j-date .col,

.j-person .col {
    padding: 0;
}

.j-date .col-3 {
    padding-top: 12px;
}

.j-state .col {
    padding: 12px 0 8px 0;
}

.j-person .col {
    padding-bottom: 12px;
}

.j-person .v-text-field {
    padding-top: 0;
    margin-top: 0;
}

::v-deep .j-clear-date .v-btn:not(.v-btn--round).v-size--small {
    height: 22px;
    min-width: 50px;
    padding: 0 8px;
}

::v-deep .j-date .v-text-field {
    padding-top: 0;
}

::v-deep .j-date .v-text-field input {
    font-size: .28rem;
}

.v-input--selection-controls[data-v-5aede2fc] {
    margin-top: 0;
}

::v-deep .j-selectConditions .v-input--selection-controls .v-radio>.v-label {
    font-size: .28rem;
}

.j-state .j-state-text {
    font-size: .28rem;
}

::v-deep .j-person .v-select.v-text-field input {
    font-size: .28rem;
}

::v-deep .j-person .v-input .v-label {
    font-size: .28rem;
}

.j-person {}

/* 删选条件-end */
</style>
<style>
.v-list-item__title {
    font-size: .28rem;
}

.v-select__selection--comma{
    font-size: .28rem;
}
</style>
