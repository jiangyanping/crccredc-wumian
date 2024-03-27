<template>
    <div class="comment" style="height: 100%;width: 100%;">
        <div v-show="isCanSeePageContent">
            <!-- 指引分享遮罩 -->
            <div class="mask-shareWord" v-show="shareWord" @click.stop="handleHideShareWord">
                <div>
                    <img :src="require('../assets/img/exportSign.png')" alt="">
                </div>
            </div>
            <v-row class="text-left" style="position:fixed;">
                <v-btn class="j-btn pa-1 j-lookInform" outlined @click.stop.prevent="lookInform()">资料查看</v-btn>
            </v-row>
            <div class="popup popup-com">
                <div class="com-popup-con">
                    <div class="com-popup-box">
                        <div class="com-list">
                            <div class="com-li clearfix" v-for="(it, i) in commentsData" :key="i">
                                <div class="com-li-header border-b">
                                    <div class="com-li-header-name"><span class="tip-redstar">*</span>{{ it.acceptancePoint
                                    }}
                                    </div>
                                </div>
                                <div v-for="(item, index) in it.comments" :key="index">
                                    <div class="com-infor-wrap">
                                        <div class="com-a com-infor-con border-b">
                                            <div class="com-text">{{ item.text }}</div>
                                            <div class="com-imgs" v-if="item.img"><img class="com-imgs-li" :src="(item.img)"
                                                    @click.stop="clickImg($event)" />
                                            </div>
                                            <div class="com-infor">
                                                <span class="com-infor-date">{{ item.createat }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="acceptance-title">审批过程意见：</div>
                    <div class="acceptance-wrap">

                        <div class="acceptance-con">
                            <div v-show="acceptanceText.length == 0">无</div>
                            <div v-show="acceptanceText.length > 0" v-for="(item, index) in acceptanceText" :key="index">{{
                                item.username }}: {{ item.text }}
                            </div>
                        </div>
                    </div>
                    <v-textarea :disabled="!btnAbled" label="* 请输入验收意见" outlined rows="1"
                        v-model="sendApproval.text"></v-textarea>
                </div>
                <v-row class="text-center j-export-comments" justify="center">
                    <v-col cols="6">
                        <v-btn block large class="primary text-no-wrap rounded-pill j-export-comments-btn"
                            :disabled="!btnAbled" @click="agreePass">同意</v-btn>
                    </v-col>
                    <v-col cols="6" style="padding-left:0;">
                        <v-btn block large class="primary text-no-wrap rounded-pill j-export-comments-btn"
                            :disabled="!btnAbled" @click="nopass">不同意</v-btn>
                    </v-col>
                </v-row>
            </div>

            <!-- 选择人员 -->
            <div class="mask-inpField" v-show="personPopupInpField" @click.stop="resetSelectPerson"></div>
            <div class="popup popup-inpField" v-show="personPopupInpField" style="height:50%">
                <p style="text-align: left;margin-left: 50px;margin-bottom: 0;line-height: 40px;"></p>
                <div class="j-selectConditions">
                    <v-row class="j-person">
                        <v-col cols="9">
                            <v-select v-model="selectedUser" :items="comUsers" item-text="realName" item-value="openId"
                                label="请选择人员" persistent-hint return-object single-line
                                prepend-icon="mdi-account"></v-select>
                        </v-col>
                    </v-row>
                </div>
                <v-row class="text-center j-export-comments" justify="center" style="bottom:30px;" v-show="passMark">
                    <v-col cols="6">
                        <v-btn block large class="primary text-no-wrap rounded-pill j-export-comments-btn"
                            @click="agreeEnd">结束</v-btn>
                    </v-col>
                    <v-col cols="6" style="padding-left:0;">
                        <v-btn block large class="primary text-no-wrap rounded-pill j-export-comments-btn"
                            @click="agreeRepost">转发</v-btn>
                    </v-col>
                </v-row>
                <v-row class="text-center j-export-comments" justify="center" style="bottom:30px;" v-show="!passMark">
                    <v-col cols="12">
                        <v-btn block large class="primary text-no-wrap rounded-pill j-export-comments-btn"
                            @click="noPassRepost">确定</v-btn>
                    </v-col>
                </v-row>
            </div>
        </div>
        <div v-show="!isCanSeePageContent" class="page-tip-wrap">
            <p v-show="contentLimit">暂无权限打开此页面</p>
            <p v-show="!contentLimit">此验收节点已结束</p>
        </div>
    </div>
</template>

<script>
import API from "../request/api.js";
import wx from 'weixin-js-sdk';
import PhotoSwipe from 'photoswipe'
import PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default'
import weixinLogin from "../assets/js/weixinLogin.js";
//import { v4 as uuidv4 } from 'uuid';
export default {

    name: 'Home',
    data: function () {
        return {
            popupInpField: false,  //新增评论弹窗
            changePopUpInpField: false,   //修改评论弹窗
            personPopupInpField: false,  //选择要分享的人员弹窗，单选

            //选择人员
            selectedUser: {},   //选择的要分享的人
            comUsers: [],   //人员列表信息,所有的信息

            comImg: {
                show: false,
                src: '',
            },

            //屋面验收要点
            commentsData: [
                {
                    acceptancePoint: '出屋面反坎高度',
                    comments: [],
                },
                {
                    acceptancePoint: '透气管高度',
                    comments: [],
                },
                {
                    acceptancePoint: '钢爬梯高度',
                    comments: [],
                },
                {
                    acceptancePoint: '六棱台',
                    comments: [],
                },
                {
                    acceptancePoint: '滴水线',
                    comments: [],
                },
                {
                    acceptancePoint: '水簸箕',
                    comments: [],
                },
                {
                    acceptancePoint: '落水口',
                    comments: [],
                },
                {
                    acceptancePoint: '过水孔',
                    comments: [],
                },
                {
                    acceptancePoint: '无动力风帽',
                    comments: [],
                },
                {
                    acceptancePoint: '分隔缝',
                    comments: [],
                },
                {
                    acceptancePoint: '找坡',
                    comments: [],
                },
                {
                    acceptancePoint: '透气孔',
                    comments: [],
                },
                {
                    acceptancePoint: '变形缝',
                    comments: [],
                },
                {
                    acceptancePoint: '设备固定方式',
                    comments: [],
                },
                {
                    acceptancePoint: '防雷',
                    comments: [],
                },
                {
                    acceptancePoint: '其他',
                    comments: [],
                },
                {
                    acceptancePoint: '验收人员照片',
                    comments: [],
                },
            ],

            //同意审批或者不通过
            sendApproval: {
                key: "",
                text: "",
                pid: "0",
                userOpenid: "",
                username: "",
                nextOpenid: "",
                nextName: "",
                url: "",
                proid: '21fe8312-a2d5-48a9-aa44-1d97f10e7be4',
            },

            currentUser: {
                key: '',
                openId: '',
                realName: '',
            },

            isCanSeePageContent: true,
            contentLimit: true,
            //审批通过结束或者转发出去，按钮得可点击
            btnAbled: true,

            //各层的审批意见的显示
            acceptanceText: [
            ],

            passMark: true,


            comParams: {
                key: '',
                pid: 0,
                createby: '',
                img: '',
                text: '',
                comToName: '',  //给谁回复
                proid: '21fe8312-a2d5-48a9-aa44-1d97f10e7be4',  //项目id，目前是写死的，uuid生成的
                qid: '342a1014-43b3-4f0c-81e5-6395acb3d153',  //二维码id，目前也是写死的，uuid生成的
                acceptancePoint: ""   //验收要点
            },
            comChangeParams: {  //只写必要的修改参数
                key: '',
                id: '',
                img: '',
                text: '',
                acceptancePoint: '',   //验收要点
            },

            shareDescTitle : '',

            //分享
            shareWord: false,
            url: '',
            appId: API.appId,  //'wx72cc3345b698d35e',//'wxc9760cd0f9ffcfbc',   //开发环境的    wx72cc3345b698d35e   //生产环境的  
            timestamp: '',
            nonceStr: 'Wm3WZYTPz0wzccnW',
            signature: '',

            shareTitle: '屋面交付样板验收通知',  //分享标题
            shareDesc: '描述',   //分享描述
            shareLink: API.shareLink,   //分享链接
            shareImgUrl: 'http://conmanage.rebim.cn/A-others/images/one.jpg',   //分享图标
        };

    },
    mounted() {
        this.weixinIsLogin();
        document.title = '屋面交付样板验收';
    },
    methods: {
        /**
         * 微信是否登录
         */
        async weixinIsLogin() {
            let user = await weixinLogin.getWeixinKey();
            if (user && user.realName) {
                //判断是否有权限打开当前链接,当前登录人的openid和分享链接中带的openid参数一致，则能打开
                if (!(user.openId == window.location.href.substring(window.location.href.indexOf("=") + 1))) {
                    //两个openid不相等，无权打开
                    this.isCanSeePageContent = false;
                    this.contentLimit = true;
                    return;
                }
                this.comParams.key = user.key;
                this.currentUser.key = user.key;
                this.currentUser.openId = user.openId;
                this.currentUser.realName = user.realName;
                console.log(this.currentUser.key);

                let approval0 = await this.getApprovals(); //获取审批信息
                if (!approval0 || !(user.openId == approval0.nextOpenid)) {
                    //审批流程最新的节点的openid和当前用户的openid不一致，无法打开,同意提示为暂无权限打开，随后考虑打开节点不是当前节点的文字提示
                    this.btnAbled = false;
                    // return;
                }

                let date = new Date();
                let year = date.getFullYear();
                let month = (date.getMonth() + 1).toString().padStart(2, '0');
                let day = date.getDate().toString().padStart(2, '0');
                this.shareDescTitle = API.buildingName + year + '/' + month + '/' + day + '-' + user.realName;
                this.shareDesc = this.shareDescTitle + '发出通知';
                this.handleQueryComs(); //查询评论，处理，获取评论数量信息
                this.getUsers();  //获取人员列表，供以选择要转发的审批人
            }
        },

        /**
        * 查询评论
        */
        handleQueryComs() {
            let vm = this;
            //API.getComments({ proid: this.comParams.proid, key: this.comParams.key }).then(res => {
            API.getComments({ proid: this.comParams.proid }).then(res => {
                if (Number(res.data.code) === 0) {
                    vm.attrsDataDeal(res.data.data);
                }
            });

        },

        /**
         * 发送新的评论
         */
        postNewComment() {
            let vm = this;
            if (vm.comParams.text == '' && vm.comParams.img == '') {
                alert("请输入内容！")
                return;
            }
            API.addComment(vm.comParams).then(res => {
                if (Number(res.data.code) === 0) {
                    vm.addDataDeal([res.data.data]);
                    vm.resetComParams();
                }
            });
        },

        /**
         * 获取问题发起人
         */
        getUsers() {
            let vm = this;
            API.getUsers({ key: vm.currentUser.key }).then(result => {
                if (result.data.code == 0) {
                    for (let i = 0; i < result.data.data.length; i++) {
                        for (let j = i + 1; j < result.data.data.length; j++) {
                            if (result.data.data[i].realName == result.data.data[j].realName) {
                                result.data.data.splice(j, 1);
                                j--;
                            }
                        }
                    }
                    //筛选后台录入并且已经绑定好的人员
                    vm.comUsers = result.data.data.filter(function (item) {
                        return typeof item.openId == 'string' && item.openId != '';
                    })
                }
            });
        },

        /**
        * 查询审批
        */
        async getApprovals() {
            let vm = this;
            let approval0 = await API.getApprovals({ key: vm.currentUser.key, proid: vm.comParams.proid }).then(res => {
                if (Number(res.data.code) === 0 && res.data.data.length > 0) {
                    let pid = '0';
                    for (let i = 0; i < res.data.data.length; i++) {
                        for (let j = 0; j < res.data.data.length; j++) {
                            if (res.data.data[j].pid == pid) {
                                if (res.data.data[j].pid != '0' && res.data.data[j].state != '发起') {
                                    vm.acceptanceText.push(
                                        {
                                            username: res.data.data[j].username,
                                            text: res.data.data[j].text,
                                        }
                                    )
                                }
                                pid = res.data.data[j].id;
                                break;
                            }
                        }
                    }
                    vm.sendApproval.pid = pid;  //指定当前意见的最后一个节点的id为下一次转发分享的pid
                    return res.data.data[0];
                }
            });
            return approval0;
        },

        /**
         * 验收通过，具体分为同意结束和同意转发
         */
        agreePass() {
            if (this.sendApproval.text == '') {
                alert('请输入验收意见！')
            } else {
                this.personPopupInpField = true;
                this.passMark = true;
            }
        },

        /**
         * 验收通过，同意结束,无需要指定人，无url(允许打开的链接)，不用分享
         */
        agreeEnd() {
            let vm = this;
            vm.sendApproval.key = vm.currentUser.key;
            vm.sendApproval.userOpenid = vm.currentUser.openId;
            vm.sendApproval.username = vm.currentUser.realName;
            vm.sendApproval.url = '';
            vm.sendApproval.state = '同意结束';
            //发送审批
            API.sendApproval(vm.sendApproval).then(res => {
                if (Number(res.data.code) === 0) {
                    console.log('发送审批成功！');
                    vm.personPopupInpField = false;
                    vm.btnAbled = false;
                }
            });
        },

        /**
         * 验收通过，同意转发，到下一个人，指定人，有url，用分享
         */
        agreeRepost() {
            let vm = this;
            if (!vm.selectedUser.openId) {
                alert('请先选择人员！')
                return;
            }
            vm.sendApproval.key = vm.currentUser.key;
            vm.sendApproval.userOpenid = vm.currentUser.openId;
            vm.sendApproval.username = vm.currentUser.realName;
            vm.shareLink = vm.shareLink + '?id=' + vm.selectedUser.openId; //转发地址中加入id，实际上是openid参数，用于控制用户能否打开链接，不能告知状态
            vm.sendApproval.url = vm.shareLink;
            vm.sendApproval.nextOpenid = vm.selectedUser.openId;
            vm.sendApproval.nextName = vm.selectedUser.realName;
            vm.sendApproval.state = '同意转发';
            //发送审批
            API.sendApproval(vm.sendApproval).then(res => {
                if (Number(res.data.code) === 0) {
                    console.log('发送审批成功！');
                    vm.btnAbled = false;
                }
            });

            //分享链接
            vm.shareWord = true;
            const indexOfHash = window.location.href.indexOf('#');
            // 如果找到了 #，则截取字符串；否则，返回原始字符串
            vm.url = indexOfHash !== -1 ? window.location.href.substring(0, indexOfHash) : window.location.href;
            console.log(vm.url);
            vm.timestamp = (Date.now()).toString().substring(0, 10);
            vm.getSignature();
        },

        /**
         * 验收不通过
         */
        nopass() {
            if (this.sendApproval.text == '') {
                alert('请输入验收意见！')
            } else {
                this.personPopupInpField = true;
                this.passMark = false;
            }
        },

        /**
         * 验收不通过，选择人员，打回，打回到第二个人，要有url，打回到发起人，第一个人，就不分享链接
         */
        noPassRepost() {
            let vm = this;
            if (!vm.selectedUser.openId) {
                alert('请先选择人员！')
                return;
            }
            vm.sendApproval.key = vm.currentUser.key;
            vm.sendApproval.userOpenid = vm.currentUser.openId;
            vm.sendApproval.username = vm.currentUser.realName;
            vm.shareLink = vm.shareLink + '?id=' + vm.selectedUser.openId; //转发地址中加入id，实际上是openid参数，用于控制用户能否打开链接，不能告知状态
            vm.sendApproval.url = '';
            vm.sendApproval.nextOpenid = vm.selectedUser.openId;
            vm.sendApproval.nextName = vm.selectedUser.realName;
            vm.sendApproval.state = '不同意';
            //发送审批
            API.sendApproval(vm.sendApproval).then(res => {
                if (Number(res.data.code) === 0) {
                    console.log('发送审批成功！');
                    vm.btnAbled = false;
                }
            });

            let bool = true;
            for (let item of vm.comUsers) {
                if (item.openId == vm.selectedUser.openId) {
                    bool = false;
                }
            }
            if (bool) {
                //分享链接
                vm.shareWord = true;
                const indexOfHash = window.location.href.indexOf('#');
                // 如果找到了 #，则截取字符串；否则，返回原始字符串
                vm.url = indexOfHash !== -1 ? window.location.href.substring(0, indexOfHash) : window.location.href;
                console.log(vm.url);
                vm.timestamp = (Date.now()).toString().substring(0, 10);
                vm.getSignature();
            } else {
                vm.personPopupInpField = false;
            }
        },

        //查看资料是调用虫洞的功能，需要调用接口，用于用户查看和使用功能的统计
        statistics(param) {
            API.statistics({ key: this.currentUser.key, function: param }).then(res => {
                if (Number(res.data.code) === 0) {
                    console.log('功能统计成功！');
                }
            });
        },

        /**
         * 查看样板点评屋面资料
         */
        async lookInform() {
            this.statistics('资料查看');
            this.$router.push('/otherRes');
        },

        /**
         * 重置评论参数
         */
        resetComParams() {
            this.popupInpField = false;
            this.comParams.pid = 0;
            this.comParams.img = '';
            this.comParams.text = '';
            this.comParams.comToName = '';
            this.comParams.acceptancePoint = '';
            this.comImg = {
                show: false,
                src: '',
            };
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
                console.log(this.shareDesc)
                wx.updateAppMessageShareData({
                    title: this.shareTitle,
                    desc: this.shareDesc,
                    link: this.shareLink,
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
         * 修改发布的评论或者现场记录
         */
        handleChangeCom(item) {
            let vm = this;
            if (!item.img) item.img = '';
            vm.changePopUpInpField = true;
            vm.comChangeParams = {
                key: vm.currentUser.key,
                id: item.id,
                controlPointSort: item.controlPointSort,
                text: item.text,
                img: item.img,
                comState: item.comState,
            };

            if (item.img) {
                vm.comImg = {
                    show: true,
                    src: item.img
                };
            }
        },

        /**
         * 修改发布的评论或者现场记录,确定修改
         */
        handleChangeComSure(action) {
            let vm = this;
            if (!vm.comChangeParams.text && !vm.comChangeParams.img) {
                alert("请输入评论内容！")
                return;
            }
            API.updateComment(vm.comChangeParams).then(res => {
                if (Number(res.data.code) === 0) {
                    console.log(res.data.data);
                    for (let i = 0; i < vm.commentsData.length; i++) {
                        if (vm.commentsData[i].controlPointSort == vm.comChangeParams.controlPointSort) {
                            let comments = vm.commentsData[i].comments;
                            for (let j = 0; j < comments.length; j++) {
                                if (comments[j].id == vm.comChangeParams.id) {
                                    comments[j].text = vm.comChangeParams.text;
                                    comments[j].img = vm.comChangeParams.img;
                                    comments[j].comState = vm.comChangeParams.comState;
                                }
                            }
                            vm.commentsData[i].commentNumUnconfirmed--;
                        }
                    }
                    console.log(vm.commentsData);
                    vm.resetComChangeParams();
                    alert(action + '成功');
                }
            });
        },

        /**
         * 重置修改评论参数
         */
        resetComChangeParams() {
            this.changePopUpInpField = false;
            this.comImg = {
                show: false,
                src: '',
            };
            Object.assign(this.$data.comChangeParams, this.$options.data().comChangeParams);
        },

        /**
         * 隐藏分享遮罩指引
         */
        handleHideShareWord() {
            this.shareWord = false;
            this.personPopupInpField = false;
        },

        /**
         * 点击评论的图片，放大查看
         */
        clickImg: function (e) {
            this.openPhotoSwipe(e.target);
        },

        /**
         * 重置选择的人员
         */
        resetSelectPerson() {
            this.selectedUser = {};
            this.personPopupInpField = false;
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

        //处理数据,将返回数据根据某个属性进行分组
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
            d.forEach(function (el) {
                vm.$set(el, "active", false);
                for (let i = 0; i < vm.commentsData.length; i++) {
                    if (vm.commentsData[i].acceptancePoint == el.acceptancePoint) {
                        vm.commentsData[i].comments.push(el);
                        return;
                    }
                }
            });
        },
    },
};
</script>

<style type="text/css" scoped>
@import '../assets/css/comment.css';

.row {
    margin: 0;
}

.home {
    height: 100%;
    color: #fff;
    overflow-y: scroll;
}

.comment {
    background-color: #eaeef4;
}

.com-controlPoint {
    float: right;
    color: #000;
}

/* 分享遮罩-shart */
.mask-shareWord {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    z-index: 10006;
}

.mask-shareWord img {
    width: 75%;
    height: 80%;
    padding: 10px 15px;
    float: right;
}

/* 分享遮罩-end */

.com-li {
    margin: 8px 16px;
    background-color: #fff;
    border-radius: 4px;
}

.com-li-header {
    background-color: transparent;
    color: #333;
}

.com-li-header .j-btn {
    font-size: .24rem;
    height: 0.55rem;
    line-height: 0.55rem;
    margin-right: 13px;
    margin-top: 6px;
    color: #0066CC !important;
}

.border-b {
    border-bottom: 1px solid #dadada;
}

.com-post-img-wrap {
    border: 1px solid #dadada;
    margin-bottom: 15px;
    width: 2.5rem;
    height: 2.5rem;

}

.com-post-textarea {
    width: 100%;
    min-height: 1rem;
}

.com-image-box {
    width: 2.5rem;
    padding-bottom: 0rem;
    margin: 0;

    display: flex;
    justify-content: center;
    align-items: center;
    height: 2.5rem;
    /* 可根据实际情况调整容器高度 */

}

.com-post-btn {
    padding: 10px;
}


.com-image-box .preview {
    max-width: 99.3%;
    /* 图片最大宽度为容器宽度 */
    max-height: 100%;
    /* 图片最大高度为容器高度 */
    height: auto;
    /*保持图片长宽比 */
    width: auto;
}

.com-image-box .delImg {
    width: .5rem;
    height: .5rem;
    background-size: 0.5rem 0.5rem
}

.com-post-img {
    position: relative;
    width: 0.6rem;
    height: 0.6rem;
    left: 50%;
    top: 50%;
    transform: translateY(-50%) translateX(-50%);
}

.comment .v-btn.v-size--large {
    width: 100%;
    height: 0.88rem;
    font-size: .3rem;
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

.com-popup-con .com-popup-box {
    height: calc(100% - 4.4rem);
}

::v-deep .v-text-field__details {
    min-height: 0 !important;
    margin-bottom: 0 !important;
    padding: 0 !important;
}

::v-deep .v-messages {
    min-height: 0;
}

.tip-redstar {
    color: red;
    display: inline-block;
    margin-right: 5px;
}

::v-deep .v-textarea {
    margin: 16px;
    background-color: #fff;
    font-size: .28rem;
}

::v-deep .v-textarea .v-label {
    font-size: .3rem;
}

::v-deep .v-textarea textarea {
    line-height: .44rem;
    height: .8rem;
}

::v-deep .v-input__slot {
    margin-bottom: 0;
}

.com-infor {
    margin-top: 0;
    margin-bottom: 0;
    height: .5rem;
    line-height: .5rem;
}

.com-infor span.com-infor-date {
    height: .5rem;
    line-height: .5rem;
}

.com-li .com-infor-con {
    padding: 0.16rem 0.3rem 0 0;
}

.comment .popup-com {
    top: .86rem;
    height: calc(100% - .86rem);
}

.j-lookInform {
    height: .55rem !important;
    line-height: .55rem;
    font-size: .26rem;
    left: 16px;
    top: 8px;
    padding: 0 6px !important;
    color: #0066CC !important;

}

.com-list .com-li:first-child {
    margin-top: 0;
}

.com-list .com-li div:last-child .com-infor-con {
    border-bottom: 0;
}

.acceptance-wrap {
    height: 1.4rem;
    text-align: left;
    overflow: scroll;
    margin: 0 16px;
    background-color: #fff;
    padding: 8px 12px;
    border-radius: 4px;
    color: #333;
}

.acceptance-con {
    height: 100%;
    overflow: scroll;
    font-size: .28rem;
    line-height: .44rem;
}

.acceptance-title {
    text-align: left;
    padding: 10px 16px 2px 20px;
    color: #0066cc;
    font-size: .28rem;
}

.page-tip-wrap {
    width: 100%;
    background-color: #333;
    height: 100%;
}

.page-tip-wrap p {
    color: #fff;
    font-size: 16px;
    position: relative;
    top: 45%;
}
</style>

