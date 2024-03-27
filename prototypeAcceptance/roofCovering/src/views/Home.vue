<template>
    <div class="comment" style="height: 100%;width: 100%;">
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
                                <div class="com-li-header-name"><span class="tip-redstar">*</span>{{ it.acceptancePoint }}
                                </div>
                                <v-btn v-if="it.acceptancePoint == '验收人员照片'" class="j-btn pa-1" outlined
                                    :disabled="!startBtnAbled" :class="{ 'j-btn-noActive': !startBtnAbled }"
                                    @click.stop.prevent="clickInp(it.acceptancePoint)">上传照片</v-btn>
                                <v-btn v-else class="j-btn pa-1" outlined :disabled="!startBtnAbled"
                                    :class="{ 'j-btn-noActive': !startBtnAbled }"
                                    @click.stop.prevent="clickInp(it.acceptancePoint)">现场记录</v-btn>
                            </div>
                            <div v-for="(item, index) in it.comments" :key="index">
                                <div class="com-infor-wrap">
                                    <div class="com-a com-infor-con border-b">
                                        <div class="com-top">
                                            <span class="com-infor-btn com-delete" v-show="startBtnAbled"
                                                @click.stop="handleDeleteCom(item)">
                                                <svg t="1704693220788" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                                    xmlns="http://www.w3.org/2000/svg" p-id="1627" width="64" height="64">
                                                    <path
                                                        d="M789.504 343.552c-12.8 0-21.504 8.704-21.504 21.504v490.496c0 23.552-19.456 42.496-42.496 42.496H298.496c-23.552 0-42.496-19.456-42.496-42.496V362.496c0-12.8-8.704-21.504-21.504-21.504s-21.504 8.704-21.504 21.504v490.496c0 47.104 38.4 85.504 85.504 85.504h426.496c47.104 0 85.504-38.4 85.504-85.504V362.496c0-10.24-10.752-18.944-20.992-18.944z m125.952-109.056h-168.448V170.496c0-47.104-38.4-85.504-85.504-85.504H362.496c-47.104 0-85.504 38.4-85.504 85.504v64H106.496c-12.8 0-21.504 8.704-21.504 21.504s8.704 21.504 21.504 21.504h808.448c12.8 0 21.504-8.704 21.504-21.504s-8.192-21.504-20.992-21.504zM320 170.496c0-23.552 19.456-42.496 42.496-42.496h298.496c23.552 0 42.496 19.456 42.496 42.496v64h-384V170.496z"
                                                        p-id="1628" fill="#666666"></path>
                                                    <path
                                                        d="M640 704V365.056c0-12.8-8.704-21.504-21.504-21.504s-21.504 8.704-21.504 21.504v339.456c0 12.8 8.704 21.504 21.504 21.504 12.8-0.512 21.504-11.264 21.504-22.016z m-213.504 0V362.496c0-12.8-8.704-21.504-21.504-21.504s-21.504 8.704-21.504 21.504v341.504c0 12.8 8.704 21.504 21.504 21.504 13.312 0 21.504-10.752 21.504-21.504z"
                                                        p-id="1629" fill="#666666"></path>
                                                </svg>
                                            </span>
                                            <!-- <span class="com-infor-btn com-export"
                                                    @click.stop="handleExportComments(item)">
                                                    <svg t="1706609498549" class="icon" viewBox="0 0 1024 1024"
                                                        version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1444"
                                                        width="64" height="64">
                                                        <path
                                                            d="M128 160C128 107.008 170.368 64 222.72 64h568.064c52.288 0 94.72 43.008 94.72 96v256c0 17.664-14.144 32-31.616 32a31.808 31.808 0 0 1-31.552-32v-256c0-17.664-14.08-32-31.552-32H222.72a31.808 31.808 0 0 0-31.552 32v640c0 17.664 14.144 32 31.552 32h255.168c17.408 0 31.552 14.336 31.552 32s-14.08 32-31.552 32H222.656A95.36 95.36 0 0 1 128 800v-640z"
                                                            fill="#666666" p-id="1445"></path>
                                                        <path
                                                            d="M506.752 681.984c0-17.664 14.08-32 31.552-32h248.448L705.28 566.592a32.32 32.32 0 0 1 0.192-45.248 31.232 31.232 0 0 1 44.608 0.192l136.768 139.968a32.256 32.256 0 0 1-0.32 45.44l-136.768 135.68a31.232 31.232 0 0 1-44.672-0.512 32.32 32.32 0 0 1 0.512-45.248l83.52-82.88H538.24a31.808 31.808 0 0 1-31.552-32zM285.824 320c0-17.664 14.08-32 31.552-32H464c17.472 0 31.552 14.336 31.552 32s-14.08 32-31.552 32H317.44a31.808 31.808 0 0 1-31.552-32zM317.376 446.272a31.808 31.808 0 0 0-31.552 32c0 17.664 14.08 32 31.552 32h181.632a31.808 31.808 0 0 0 31.552-32c0-17.664-14.144-32-31.552-32H317.312z"
                                                            fill="#666666" p-id="1446"></path>
                                                    </svg>
                                                </span>
                                                <span class="com-infor-btn com-change" v-if="item.comState == '待'"
                                                    @click.stop="handleChangeCom(item)">
                                                    <svg t="1704693198564" class="icon" viewBox="0 0 1024 1024"
                                                        version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1382"
                                                        width="64" height="64">
                                                        <path
                                                            d="M684.202667 117.248c15.893333-15.872 42.154667-15.36 58.922666 1.408l90.517334 90.517333c16.661333 16.661333 17.344 42.986667 1.429333 58.922667l-445.653333 445.653333c-7.936 7.914667-23.104 16.746667-34.218667 19.776l-143.701333 39.253334c-21.909333 5.994667-35.114667-7.104-29.568-28.949334l37.248-146.773333c2.773333-10.944 11.562667-26.346667 19.392-34.176l445.653333-445.653333zM268.736 593.066667c-2.901333 2.901333-8.106667 12.074667-9.130667 16.021333l-29.12 114.773333 111.957334-30.570666c4.437333-1.216 13.632-6.549333 16.810666-9.728l445.653334-445.653334-90.517334-90.496-445.653333 445.653334zM682.794667 178.986667l90.517333 90.517333-30.186667 30.186667-90.496-90.517334 30.165334-30.165333z m-362.026667 362.048l90.496 90.517333-30.165333 30.165333-90.517334-90.496 30.165334-30.186666zM170.666667 874.666667c0-11.776 9.429333-21.333333 21.461333-21.333334h661.077333a21.333333 21.333333 0 1 1 0 42.666667H192.128A21.333333 21.333333 0 0 1 170.666667 874.666667z"
                                                            fill="#666666" p-id="1383"></path>
                                                    </svg>
                                                </span> -->
                                        </div>
                                        <div class="com-text">{{ item.text }}</div>
                                        <div class="com-imgs" v-if="item.img"><img class="com-imgs-li" :src="(item.img)"
                                                @click.stop="clickImg($event)" />
                                        </div>
                                        <div class="com-infor">
                                            <span class="com-infor-date">{{ item.createat }}</span>
                                        </div>
                                    </div>
                                </div>
                                <!-- </template> -->
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
            </div>

            <v-row class="text-center j-export-comments" justify="center">
                <v-col cols="12" style="padding-left:12px;">
                    <v-btn block large v-show="!showExportBtn" :disabled="!startBtnAbled"
                        class="primary text-no-wrap rounded-pill j-export-comments-btn" @click.stop="startAcceptance">发起
                    </v-btn>
                    <v-btn block large v-show="showExportBtn"
                        class="primary text-no-wrap rounded-pill j-export-comments-btn" @click.stop="exportAcceptance">导出
                    </v-btn>
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
                            label="请选择人员" persistent-hint return-object single-line prepend-icon="mdi-account"></v-select>
                    </v-col>
                </v-row>
            </div>
            <v-row class="text-center j-export-comments" justify="center">
                <v-col cols="12" style="padding-left:12px;">
                    <v-btn block large class="primary text-no-wrap rounded-pill j-export-comments-btn"
                        @click="agreeRepost">确定</v-btn>
                </v-col>
            </v-row>
        </div>

        <!-- 发布记录 -->
        <div class="mask-inpField" v-show="popupInpField" @click.stop="resetComParams"></div>
        <div class="popup popup-inpField" v-show="popupInpField">
            <div class="com-post-wrap">
                <template v-if="comParams.comToName == '' && comParams.acceptancePoint != '验收人员照片'">
                    <div class="com-person">记录内容</div>
                </template>
                <template v-if="comParams.acceptancePoint == '验收人员照片'">
                    <div class="com-person">上传验收人员照片</div>
                </template>

                <div class="com-post-img-wrap">
                    <div class="com-post-img" v-show="!comImg.show"><img :src="require('./../assets/img/image.png')">
                        <input id="img_input" type="file" accept="image" @change.stop="selectImg($event, 'add');" />
                    </div>
                    <div class="com-image-box" v-show="comImg.show">
                        <img class="preview" :src="(comImg.src)" alt="preview" />
                        <div class="delImg" @click.stop="delImg"></div>
                    </div>
                </div>

                <textarea v-if="comParams.acceptancePoint != '验收人员照片'" class="com-post-textarea" ref="focusTextarea"
                    v-model="comParams.text" placeholder="描述"></textarea>
                <div class="com-post-box" v-if="comParams.comToName == ''">
                    <div class="com-post-btn" @click.prevent="postNewComment();">确定</div>

                </div>
            </div>
        </div>

        <!-- 修改记录 -->
        <div class="mask-inpField" v-show="changePopUpInpField" @click.stop="resetComChangeParams"></div>
        <div class="popup popup-inpField changePopUpInpField" v-show="changePopUpInpField">
            <div class="com-post-wrap">
                <template>
                    <div class="com-person">内容</div>
                </template>
                <textarea class="com-post-textarea" v-model="comChangeParams.text"></textarea>
                <div class="com-image-box" v-show="comImg.show">
                    <img class="preview" :src="(comImg.src)" alt="preview" />
                    <div class="delImg" @click="delImg"></div>
                </div>
                <div class="com-post-box">
                    <div class="com-post-img"><img :src="require('./../assets/img/image.png')"><input id="img_input"
                            type="file" accept="image" @change="selectImg($event, 'change');" /></div>
                    <div class="com-post-btn" @click.stop="handleChangeComSure('修改');">确认修改</div>
                </div>
            </div>
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
                    comments: [
                        // {
                        //     "key": null,
                        //     "id": "4d35a5dd8bd844a18e964df510943945",
                        //     "qid": "342a1014-43b3-4f0c-81e5-6395acb3d153",
                        //     "pid": "0",
                        //     "text": "test",
                        //     "img": "",
                        //     "isenable": "1",
                        //     "updateby": "oWJIr65QGgxX2q-ojzFGBeYDvZpg",
                        //     "updateat": "2024-03-15 08:31:40",
                        //     "createby": "姜艳萍",
                        //     "createat": "2024-03-15 08:31:40",
                        //     "viewAngle": null,
                        //     "comToRes": null,
                        //     "comToName": "",
                        //     "rebimUrl": null,
                        //     "modelrange": null,
                        //     "proid": "21fe8312-a2d5-48a9-aa44-1d97f10e7be4",
                        //     "fid": "21fe8312-a2d5-48a9-aa44-1d97f10e7be4",
                        //     "acceptancePoint": "出屋面反坎高度"
                        // },
                    ],
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

            //发送审批
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

            //各层的审批意见的显示
            acceptanceText: [
            ],


            //发起按钮和现场记录的可点击状态
            startBtnAbled:true,
            //审批通过结束，显示导出按钮
            showExportBtn: false,

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

            shareDescPre : '',
            shareTitlePre: '屋面交付样板验收',  //分享标题

            //分享
            shareWord: false,
            url: '',
            appId: API.appId,  //'wx72cc3345b698d35e',//'wxc9760cd0f9ffcfbc',   //开发环境的    wx72cc3345b698d35e   //生产环境的  
            timestamp: '',
            nonceStr: 'Wm3WZYTPz0wzccnW',
            signature: '',

            shareTitle: '',  //分享标题
            shareDesc: '描述',   //分享描述
            shareLink: API.shareLink,   //分享链接
            shareImgUrl: 'http://conmanage.rebim.cn/A-others/images/one.jpg',   //分享图标
        };

    },
    mounted() {
        this.weixinIsLogin();
        document.title = '屋面交付样板验收';
    },
    watch: {
        // commentsData: {
        //     immediate: true,
        //     handler(newValue) {
        //         console.log(newValue);
        //     },
        //     deep: true
        // },
    },
    methods: {
        /**
         * 微信是否登录
         */
        async weixinIsLogin() {
            let res = await weixinLogin.getWeixinKey();
            if (res && res.realName) {
                this.comParams.key = res.key;
                this.currentUser.key = res.key;
                this.currentUser.openId = res.openId;
                this.currentUser.realName = res.realName;
                console.log(this.currentUser.key);
                let date = new Date();
                let year = date.getFullYear();
                let month = (date.getMonth() + 1).toString().padStart(2, '0');
                let day = date.getDate().toString().padStart(2, '0');
                this.shareDescPre = API.buildingName + year + '/' + month + '/' + day + '-' + res.realName;
                this.handleQueryComs(); //查询评论，处理，获取评论数量信息
                this.getUsers();  //获取人员列表，供以选择要转发的审批人
                this.getApprovals(); //查询审批记录
            }
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
                    vm.addDataDeal(res.data.data);
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
        getApprovals() {
            let vm = this;
            API.getApprovals({ key: vm.currentUser.key, proid: vm.comParams.proid }).then(res => {
                if (Number(res.data.code) === 0 && res.data.data.length > 0) {
                    if (res.data.data[0].state == '同意结束') {
                        vm.startBtnAbled = false;
                        vm.showExportBtn = true;
                    }else if (res.data.data[0].state == '不同意') {
                        for (let i = 0; i < res.data.data.length; i++) {
                            if (res.data.data[i].pid == '0' && res.data.data[i].state == '发起') {
                                if (res.data.data[0].nextName == res.data.data[i].username) {
                                    vm.startBtnAbled = false;
                                    vm.showExportBtn = false;
                                }
                            }
                        }
                    }else{
                        //state是发起和同意转发的情况，指定了人，需要分享，有分享的url
                        vm.startBtnAbled = false;
                        vm.showExportBtn = false;
                    }

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

                    //设置最后一条验收回复的pid
                    vm.sendApproval.pid = pid;
                }
            });
        },

        //发起验收
        startAcceptance() {
            let mark = false;
            for (let i = 0; i < this.commentsData.length; i++) {
                if (this.commentsData[i].comments.length == 0) {
                    mark = true;
                }
            }
            if (!mark) {
                this.personPopupInpField = true;
            } else {
                alert("所有检查点必须要有信息记录，请填写!");
            }
        },

        /**
         * 发起验收，确定，转发到下一个人
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
            vm.sendApproval.state = '发起';
            //发送审批
            API.sendApproval(vm.sendApproval).then(res => {
                if (Number(res.data.code) === 0) {
                    console.log('发送审批成功！');
                    //点完发起按钮后，就不能再修改了，等待回执
                    vm.startBtnAbled = false;
                    vm.showExportBtn = false;
                }
            });

            //分享链接
            vm.shareDesc = this.shareDescPre + '发出通知';
            vm.shareTitle = this.shareTitlePre + '通知';
            vm.shareWord = true;
            const indexOfHash = window.location.href.indexOf('#');
            // 如果找到了#，则截取字符串；否则，返回原始字符串
            vm.url = indexOfHash !== -1 ? window.location.href.substring(0, indexOfHash) : window.location.href;
            console.log(vm.url);
            vm.timestamp = (Date.now()).toString().substring(0, 10);
            vm.getSignature();
        },

        /**
         * 导出验收点评
         */
        exportAcceptance(){
            let vm = this;
            alert('报告正在生成，请稍后！')
            API.exportAcceptance({ key: vm.currentUser.key, proid: vm.comParams.proid }).then(result => {
                if (result.data.code == 0) {
                    vm.shareWord = true;
                    vm.shareLink = result.data.data;
                    this.shareDesc = this.shareDescPre + '导出';
                    vm.shareTitle = this.shareTitlePre + '报告';
                    console.log(vm.shareLink);
                    const indexOfHash = window.location.href.indexOf('#');
                    // 如果找到了#，则截取字符串；否则，返回原始字符串
                    vm.url = indexOfHash !== -1 ? window.location.href.substring(0, indexOfHash) : window.location.href;
                    console.log(vm.url);
                    vm.timestamp = (Date.now()).toString().substring(0, 10);
                    vm.getSignature();
                }
            });
        },

        /**
         * 查询评论
         */
        handleQueryComs() {
            let vm = this;
            //API.getComments({ proid: this.comParams.proid, key: this.currentUser.key }).then(res => {
            API.getComments({ proid: vm.comParams.proid }).then(res => {
                if (Number(res.data.code) === 0) {
                    vm.attrsDataDeal(res.data.data);
                }
            });
        },

        //处理数据,将返回数据根据某个属性进行分组
        attrsDataDeal: function (d) {
            let vm = this;
            //截取评论时间，去掉秒
            d.forEach((item) => {
                item.createat = item.createat.slice(0, 16);
            });
            d.forEach(function (el) {
                vm.$set(el, "active", false);
                for (let i = 0; i < vm.commentsData.length; i++) {
                    if (vm.commentsData[i].acceptancePoint == el.acceptancePoint) {
                        vm.commentsData[i].comments.push(el);
                    }
                }
            });
        },

        //增加评论
        addDataDeal: function (el) {
            let vm = this;
            vm.$set(el, "active", false);
            el.createat = el.createat.slice(0, 16);
            for (let i = 0; i < vm.commentsData.length; i++) {
                // 对比相同的字段key，相同放入对应的数组
                if (vm.commentsData[i].acceptancePoint == el.acceptancePoint) {
                    vm.commentsData[i].comments.unshift(el);
                    return;
                }
            }
        },

        handleHideShareWord() {
            this.shareWord = false;
            this.personPopupInpField = false;
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
        lookInform() {
            this.statistics('资料查看');
            this.$router.push('/otherRes');
        },

        //现场检查记录
        clickInp(data) {
            let vm = this;
            vm.popupInpField = true;
            vm.comParams.acceptancePoint = data;
            if (vm.comParams.acceptancePoint == '验收人员照片') return;
            setTimeout(function () {
                vm.$nextTick(function () {
                    vm.$refs.focusTextarea.focus(); //点击发布输入框,自动获取焦点不起作用
                });
            }, 50);
        },

        /**
         * 选择一张图片上传
         */
        selectImg: function (e, mark) {
            let vm = this;

            let file = e.target.files[0]; //获取图片资源
            // 只选择图片文件
            if (!file.type.match('image.*')) {
                return false;
            }
            let reader = new FileReader();
            reader.readAsDataURL(file); // 读取文件
            // 渲染文件
            reader.onload = function (arg) {
                if (!vm.comImg.show) {
                    vm.comImg = {
                        show: true,
                        src: arg.target.result
                    }
                }
            }
            //已经选择图片，上传
            if (file) {
                let form_data = new FormData();
                form_data.append("file", file);
                let headers = { 'Content-Type': 'multipart/form-data' }
                API.commentsImgUpload(form_data, headers).then(res => {
                    if (mark == 'add') vm.comParams.img = res.data.data;
                    if (mark == 'change') vm.comChangeParams.img = res.data.data;
                });
            }
            e.target.value = "";
        },

        /**
         * 删除上传的图片
         */
        delImg() {
            let vm = this;
            vm.comImg = {
                show: false,
                src: '',
            };
        },


        /**
         * 点击评论的图片，放大查看
         */
        clickImg: function (e) {
            this.openPhotoSwipe(e.target);
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
         * 重置选择的人员
         */
        resetSelectPerson() {
            this.selectedUser = {};
            this.personPopupInpField = false;
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
         * 删除发布的评论或者现场记录
         */
        handleDeleteCom(obj) {
            if (!confirm("确定要删除该项目吗？")) return;
            let vm = this;
            API.deleteComment({ id: obj.id, key: this.currentUser.key }).then(res => {
                if (Number(res.data.code) === 0 && res.data.data == 1) {
                    for (let item of vm.commentsData) {
                        if (item.acceptancePoint == obj.acceptancePoint) {
                            for (let [index, it] of item.comments.entries()) {
                                if (it.id == obj.id) {
                                    item.comments.splice(index, 1);
                                }
                            }
                        }
                    }
                    alert('删除成功');
                }
            });
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
                console.log(this.shareLink);
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

.com-li-header .j-btn.j-btn-noActive {
    color: #c2c5ca !important;
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
    width: 1.8rem;
    height: 1.8rem;
    left: 50%;
    top: 50%;
    transform: translateY(-50%) translateX(-50%);
    padding: .6rem;
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
    height: calc(100% - 3.1rem);
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

.com-li .com-infor-con {
    padding: 0.16rem 0.3rem 0 0;
}

.com-delete {
    width: .68rem;
    height: .5rem !important;
    margin-top: 2px;
    margin-right: -4px;
    padding: 0;
    padding-left: 12px;

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
</style>
<style>
.v-list-item__title {
    font-size: .28rem;
}

.v-select__selection--comma {
    font-size: .28rem;
}</style>

