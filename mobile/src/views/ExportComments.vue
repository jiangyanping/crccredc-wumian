<template>
    <div class="exportComments">
        <div class="mask-shareWord" v-show="shareWord" @click.stop="shareWord = !shareWord">
            <div>
                <img :src="require('../assets/img/exportSign.png')" alt="">
            </div>
        </div>
        <!-- <p>{{ selectedComments }}</p> -->
        <p style="text-align: left;margin-left: 50px;margin-bottom: 0;line-height: 48px;">请选择要导出的评论 <span
                style="float:right;margin-right:.28rem;">已选择数: {{ selectedComments.length }}</span></p>
        <div class="commentsTree">
            <div>
                <v-expansion-panels multiple class="commentsTreePanel">
                    <v-expansion-panel v-for="(item, index) in dealCommentsData" :key="index">
                        <v-expansion-panel-header>
                            <v-checkbox :indeterminate="item.indeterminate" @change="updateChecked(item)" @click.stop
                                v-model="item.controlChecked" :value="item.controlChecked"></v-checkbox>{{
                                    item.controlName }}
                        </v-expansion-panel-header>
                        <v-expansion-panel-content class="controlPointSort-wrap">
                            <v-expansion-panel v-for="(it, i) in item.controlPointSortArr" :key="i">
                                <v-expansion-panel-header>
                                    <v-checkbox :indeterminate="it.indeterminate" @change="updateChecked(it, item)"
                                        @click.stop v-model="it.controlPointChecked"
                                        :value="it.controlPointChecked"></v-checkbox>{{
                                            it.controlPoint }}
                                </v-expansion-panel-header>
                                <v-expansion-panel-content class="comments-wrap">
                                    <v-expansion-panel v-for="(obj, j) in commentsDataF(it.comments)" :key="j">
                                        <v-expansion-panel-header>
                                            <v-checkbox @change="updateChecked(obj, it, item)" @click.stop
                                                v-model="obj.commentChecked" :value="obj.commentChecked"></v-checkbox>
                                            <div class="comments-fatherContent">
                                                <div class="com-li-title">
                                                    <div class="com-li-title-name">提出人：{{ obj.createby }}</div>
                                                    <div class="com-li-title-state">Q{{ j + 1 }} {{ obj.comState }}整改
                                                    </div>
                                                </div>
                                                <div class="com-infor-wrap">
                                                    <div class="com-a com-infor-con">
                                                        <div class="com-text">{{ obj.text }}</div>
                                                        <div class="com-imgs" v-if="obj.img"><img class="com-imgs-li"
                                                                :src="(obj.img)" @click.stop="clickImg($event)" />
                                                        </div>
                                                        <div class="com-infor">
                                                            <span class="com-infor-date">{{ obj.createat }}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </v-expansion-panel-header>
                                        <v-expansion-panel-content>
                                            <div class="com-list" v-if="hasChild(it, obj)">
                                                <div class="com-li clearfix">
                                                    <div class="com-infor-wrap">
                                                        <div class="com-child">
                                                            <div class="com-child-list">
                                                                <div class="com-child-li clearfix"
                                                                    v-for="o in commentsDataC(it.comments, obj)"
                                                                    :key="o.id">
                                                                    <div class="com-child-inforwrap">
                                                                        <div class="com-a com-child-inforcon">
                                                                            <div class="com-top">
                                                                                <span class="com-username">{{
                                                                                    o.createby }}<span
                                                                                        style="color:#999999">&nbsp;回复&nbsp;</span>{{
                                                                                            o.comToName }}
                                                                                </span>
                                                                            </div>
                                                                            <div class="com-text">{{ o.text }}</div>
                                                                            <div class="com-imgs" v-if="o.img">
                                                                                <img class="com-imgs-li" :src="(o.img)"
                                                                                    @click.stop="clickImg($event)" />
                                                                            </div>
                                                                            <div class="com-infor">
                                                                                <span class="com-infor-date">{{
                                                                                    o.createat }}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div v-else>暂无回复</div>
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                </v-expansion-panel-content>
                            </v-expansion-panel>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            </div>
            <!-- <div v-for="(item, index) in dealCommentsData" :key="index">
                <v-checkbox v-model="selectedComments" :label="item.controlName" :value="item.controlName"></v-checkbox>
                <div v-for="(it, i) in item.controlPointSortArr" :key="i">
                    <v-checkbox v-model="selectedComments" :label="it.controlPoint" :value="it.controlPoint"></v-checkbox>
                    <div v-for="(obj, j) in it.comments" :key="j">
                        <v-checkbox v-model="selectedComments" :label="obj.text" :value="obj.text"></v-checkbox>
                    </div>
                </div>
            </div> -->

        </div>
        <v-row class="text-center j-export-comments" justify="center">
            <v-col cols="12">
                <v-btn block large class="primary text-no-wrap rounded-pill j-export-comments-btn"
                    @click="handleExportComments">确认导出并分享</v-btn>
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
            proid: '08fa9423-a2d5-48a9-aa44-1d97f10e8ae9',
            dealCommentsData: [],  //后台请求回的评论数据，经过处理的

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
            appId: 'wx72cc3345b698d35e',//'wxc9760cd0f9ffcfbc',   //开发环境的    wx72cc3345b698d35e   //生产环境的 
            timestamp: '',
            nonceStr: 'Wm3WZYTPz0wzccnW',
            signature: '',

            shareTitle: '标题',  //分享标题
            shareDesc: '描述',   //分享描述
            shareLink: '',   //分享链接
            shareImgUrl: 'http://conmanage.rebim.cn/A-others/images/one.png',   //分享图标
        };
    },
    watch: {
    },
    mounted() {
        this.weixinislogin();
        document.title = '导出评论';
    },
    methods: {
        /**
         * 点击复选框，数据更新了，但是监听不到，所以手动整体修改this.dealCommentsData = [...this.dealCommentsData];，触发v-model
         */
        updateChecked(self, parent, grandParent) {
            let vm = this;

            //点击管控步骤
            if (self.controlChecked !== undefined) {
                if (self.controlChecked) {
                    for (let it of self.controlPointSortArr) {
                        it.controlPointChecked = true;
                        for (let obj of it.comments) {
                            if (obj.pid == '0') {
                                obj.commentChecked = true;
                                vm.selectedComments.push(obj.id);
                            }
                        }
                    }
                } else {
                    self.controlChecked = false;
                    for (let it of self.controlPointSortArr) {
                        it.controlPointChecked = false;
                        for (let obj of it.comments) {
                            obj.commentChecked = false;
                            vm.selectedComments = vm.selectedComments.filter(id => id !== obj.id);
                        }
                    }
                }
            }

            //点击管控节点
            if (self.controlPointChecked !== undefined) {
                if (self.controlPointChecked) {
                    for (let obj of self.comments) {
                        if (obj.pid == '0') {
                            obj.commentChecked = true;
                            vm.selectedComments.push(obj.id);
                        }
                    }

                    //父级可能是半选中，可能是未选中分情况
                    const someChecked = parent.controlPointSortArr.some((it) => it.controlPointChecked);
                    const allChecked = parent.controlPointSortArr.every((it) => it.controlPointChecked);

                    if (someChecked && !allChecked) {
                        parent.indeterminate = true;
                    } else {
                        parent.indeterminate = false;
                        parent.controlChecked = true;
                    }
                } else {
                    self.controlPointChecked = false;
                    for (let obj of self.comments) {
                        obj.commentChecked = false;
                        vm.selectedComments = vm.selectedComments.filter(id => id !== obj.id);
                    }

                    //父级可能是半选中，可能是未选中分情况
                    const someChecked = parent.controlPointSortArr.some((it) => it.controlPointChecked);
                    const allChecked = parent.controlPointSortArr.every((it) => it.controlPointChecked);

                    if (someChecked && !allChecked) {
                        parent.indeterminate = true;
                    } else {
                        parent.indeterminate = false;
                        parent.controlChecked = false;
                    }
                }
            }

            //点击评论
            if (self.commentChecked !== undefined) {
                if (self.commentChecked) {
                    let obj = self;
                    if (obj.pid == '0') {
                        obj.commentChecked = true;
                        vm.selectedComments.push(obj.id);
                    }

                    //父级可能是半选中，可能是未选中分情况
                    let someParentChecked = parent.comments.some((obj) => obj.commentChecked);
                    let allParentChecked = parent.comments.every((obj) => obj.commentChecked);

                    if (someParentChecked && !allParentChecked) {
                        parent.indeterminate = true;
                        grandParent.indeterminate = true;
                    } else if (allParentChecked) {
                        parent.indeterminate = false;
                        parent.controlPointChecked = true;
                        let someGrandChecked = grandParent.controlPointSortArr.some((it) => it.controlPointChecked);
                        let allGrandChecked = grandParent.controlPointSortArr.every((it) => it.controlPointChecked);
                        if (someGrandChecked && !allGrandChecked) {
                            grandParent.indeterminate = true;
                        } else {
                            grandParent.indeterminate = false;
                            grandParent.controlChecked = true
                        }
                    }

                } else {
                    let obj = self;
                    obj.commentChecked = false;
                    vm.selectedComments = vm.selectedComments.filter(id => id !== obj.id);

                    //父级可能是半选中，可能是未选中分情况
                    let someParentChecked1 = parent.comments.some((obj) => obj.commentChecked);
                    let allParentChecked1 = parent.comments.every((obj) => obj.commentChecked);

                    if (someParentChecked1 && !allParentChecked1) {
                        parent.indeterminate = true;
                        grandParent.indeterminate = true;
                    } else if (!someParentChecked1) {
                        parent.indeterminate = false;
                        parent.controlPointChecked = false;
                        let someGrandChecked1 = grandParent.controlPointSortArr.some((it) => it.controlPointChecked);
                        let allGrandChecked1 = grandParent.controlPointSortArr.every((it) => it.controlPointChecked);
                        if (someGrandChecked1 && !allGrandChecked1) {
                            grandParent.indeterminate = true;
                        } else {
                            grandParent.indeterminate = false;
                            grandParent.controlChecked = false;
                        }
                    }
                }
            }

            this.dealCommentsData = [...this.dealCommentsData];
            console.log(this.dealCommentsData);
            console.log(vm.selectedComments);
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
                        vm.handleQueryComs(); //查询评论，处理，获取评论数量信息
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
                    this.attrsDataDeal(res.data.data);
                    for (let item of vm.dealCommentsData) {
                        if (item.controlSort == 'constructural') item.controlName = '结构层';
                        if (item.controlSort == 'conwaterproofbase') item.controlName = '防水基层';
                        if (item.controlSort == 'conwaterproof') item.controlName = '防水层';
                        if (item.controlSort == 'consurface') item.controlName = '面层';
                        item.controlChecked = false;
                        item.indeterminate = false;
                        for (let it of item.controlPointSortArr) {
                            it.controlPointChecked = false;
                            it.indeterminate = false;
                            for (let obj of it.comments) {
                                obj.commentChecked = false;
                            }
                        }
                    }
                }
            });

        },

        //处理评论数据,将返回数据根据某个属性进行分组
        attrsDataDeal: function (d) {
            let vm = this;
            //依据时间对评论排序
            d.forEach((item) => {
                item.dueTime = Date.parse(item.createat);
            });
            d.sort(function (a, b) {
                return a.dueTime - b.dueTime;
            });
            //截取评论时间，去掉秒
            d.forEach((item) => {
                item.createat = item.createat.slice(0, 16);
            });
            this.commentsData = [];
            // let listArr = [
            //     {
            //         'controlSort': 'constructural',
            //         'controlPointSortArr':[
            //             {
            //                 'controlPointSort':'02',
            //                 'controlPoint':'02女儿墙',
            //                 'comments':[
            //                     {    
            //                          commentChecked:false,
            //                         //具体评论条目
            //                     }
            //                 ],
            //                'commentNumTotal':1,  //总共的问题数量
            //                'commentNumUnconfirmed':1, //未整改确认的问题数量
            //                'controlChecked':false
            //             }
            //         ],
            //         'controlComNumTotal':1,  //该管控节点下总共的问题数量
            //         'controlComNumUnconfirmed':1,  //该管控节点下未整改确认的问题数量
            //         'controlChecked':false
            //     }
            // ];

            let listArr = [];
            d.forEach(function (el) {
                vm.$set(el, "active", false);
                el.createat = el.createat.slice(0, 16);
                for (let i = 0; i < listArr.length; i++) {
                    // 对比相同的字段key，相同放入对应的数组
                    if (listArr[i].controlSort == el.controlSort) {
                        let controlPointSortArr = listArr[i].controlPointSortArr;
                        const res = controlPointSortArr.find(item => item.controlPointSort === el.controlPointSort);
                        if (res) {
                            for (let j = 0; j < controlPointSortArr.length; j++) {
                                if (controlPointSortArr[j].controlPointSort == el.controlPointSort) {
                                    controlPointSortArr[j].comments.push(el);
                                    return;
                                }
                            }
                        } else {
                            controlPointSortArr.push(
                                {
                                    controlPointSort: el.controlPointSort,
                                    controlPoint: el.controlPoint,
                                    comments: [
                                        el
                                    ]
                                }
                            )
                            return;
                        }
                    }
                }
                // 第一次对比没有参照，放入参照
                listArr.push({
                    controlSort: el.controlSort,
                    controlPointSortArr: [
                        {
                            controlPointSort: el.controlPointSort,
                            controlPoint: el.controlPoint,
                            comments: [
                                el
                            ]
                        }
                    ]
                });
            });

            //处理数据，加评论总数和待整改的评论数量属性,总数取pid为0的
            for (let n = 0; n < listArr.length; n++) {
                let controlPointSortArr = listArr[n].controlPointSortArr;
                listArr[n].controlComNumTotal = 0;
                listArr[n].controlComNumUnconfirmed = 0;
                //按照管控节点的01,02,03正序排序
                controlPointSortArr.sort(function (a, b) {
                    return a.controlPointSort - b.controlPointSort;
                });
                for (let m = 0; m < controlPointSortArr.length; m++) {
                    //统计该管控步骤节点下的的总共的问题数量和未整改确认的问题数量
                    controlPointSortArr[m].controlPoint = controlPointSortArr[m].comments[0].controlPoint;
                    controlPointSortArr[m].commentNumTotal = controlPointSortArr[m].comments.filter(item => item.pid == 0).length;
                    controlPointSortArr[m].commentNumUnconfirmed = controlPointSortArr[m].comments.filter(item => item.comState == '待' && item.pid == 0).length;
                    //统计该管控步骤下的总共的问题数量和未整改确认的问题数量
                    listArr[n].controlComNumTotal += controlPointSortArr[m].commentNumTotal;
                    listArr[n].controlComNumUnconfirmed += controlPointSortArr[m].commentNumUnconfirmed;
                }
            }
            //处理好的数据给dealCommentsData赋值
            vm.dealCommentsData = listArr;
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
                API.exportComments({ cIDs: str, key: key }).then(result => {
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

.com-text {
    font-size: .28rem;
    line-height: .44rem;
}

.com-child {
    display: block;
}

.com-child-li .com-child-inforwrap {
    width: 100%;
    padding-left: .35rem;
}

.com-username {
    font-size: .28rem;
    color: #333;
}

.com-child-li .com-child-inforcon {
    padding-top: 0.08rem;
}

.com-li-title {
    background-color: transparent;
    height: .48rem;
    line-height: .48rem;
    color: #333;
    font-size: .28rem;
}

.com-li-title-state {
    padding-right: 5px;
    width: 40%;
}

.com-li-title-name {
    padding-left: 0;
}

.com-infor {
    margin: 0;
    line-height: .48rem;
    height: .48rem;
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
</style>