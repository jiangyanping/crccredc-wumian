<template>
    <div class="comment" style="height: 100%;width: 100%;">
        <!-- <div class="comment-mask" v-show="popupCom"></div> -->
        <div class="popup popup-com">
            <div class="com-popup-con">
                <div class="com-popup-box">
                    <div class="com-list" v-if="commentsData.length != 0">
                        <!-- let listArr = [
                            {
                                'controlSort': 'constructural',

                                                                'controlPointSortArr':[
                                                                    {
                                                                        'controlPointSort':'02',
                                                                        'controlPoint':'02女儿墙',
                                                                        'comments':[
                                                                            {
                                                                                //具体评论条目
                                                                            }
                                                                        ],
                                                                        'commentNumTotal':1,  //总共的问题数量
                                                                        'commentNumUnconfirmed':1, //未整改确认的问题数量
                                                                    }
                                                                ]
                            }
                        ]; -->

                        <div class="com-li clearfix" v-for="(it, i) in commentsData" :key="i">
                            <div class="com-li-header">
                                <div class="com-li-header-name">{{ it.controlPoint }}</div>
                                <div class="com-li-header-num">共{{ it.commentNumTotal }}条</div>
                            </div>
                            <div v-for="(item, index) in commentsDataF(it.comments)" :key="index">
                                <div class="com-li-title">
                                    <div class="com-li-title-name">提出人：{{ item.createby }}</div>
                                    <div class="com-li-title-state">Q{{ index + 1 }} {{ item.comState }}整改</div>
                                </div>
                                <template>
                                    <div class="com-infor-wrap">
                                        <div class="com-a com-infor-con" @click.prevent="replyComment(item)">
                                            <div class="com-top">
                                                <!-- <span class="com-username">{{ item.createby }}</span> -->
                                                <!-- <v-btn class="com-infor-btn com-delete mr-0" outlined color="red"
                                                    @click.stop="handleDeleteCom(item)">删除</v-btn>
                                                <v-btn class="com-infor-btn com-change mr-2" outlined color="red"
                                                    v-if="item.comState == '待'"
                                                    @click.stop="handleChangeCom(item)">修改</v-btn> -->

                                                <span class="com-infor-btn com-delete" @click.stop="handleDeleteCom(item)">
                                                    <svg t="1704693220788" class="icon" viewBox="0 0 1024 1024"
                                                        version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1627"
                                                        width="64" height="64">
                                                        <path
                                                            d="M789.504 343.552c-12.8 0-21.504 8.704-21.504 21.504v490.496c0 23.552-19.456 42.496-42.496 42.496H298.496c-23.552 0-42.496-19.456-42.496-42.496V362.496c0-12.8-8.704-21.504-21.504-21.504s-21.504 8.704-21.504 21.504v490.496c0 47.104 38.4 85.504 85.504 85.504h426.496c47.104 0 85.504-38.4 85.504-85.504V362.496c0-10.24-10.752-18.944-20.992-18.944z m125.952-109.056h-168.448V170.496c0-47.104-38.4-85.504-85.504-85.504H362.496c-47.104 0-85.504 38.4-85.504 85.504v64H106.496c-12.8 0-21.504 8.704-21.504 21.504s8.704 21.504 21.504 21.504h808.448c12.8 0 21.504-8.704 21.504-21.504s-8.192-21.504-20.992-21.504zM320 170.496c0-23.552 19.456-42.496 42.496-42.496h298.496c23.552 0 42.496 19.456 42.496 42.496v64h-384V170.496z"
                                                            p-id="1628" fill="#666666"></path>
                                                        <path
                                                            d="M640 704V365.056c0-12.8-8.704-21.504-21.504-21.504s-21.504 8.704-21.504 21.504v339.456c0 12.8 8.704 21.504 21.504 21.504 12.8-0.512 21.504-11.264 21.504-22.016z m-213.504 0V362.496c0-12.8-8.704-21.504-21.504-21.504s-21.504 8.704-21.504 21.504v341.504c0 12.8 8.704 21.504 21.504 21.504 13.312 0 21.504-10.752 21.504-21.504z"
                                                            p-id="1629" fill="#666666"></path>
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
                                                </span>
                                            </div>
                                            <div class="com-text">{{ item.text }}</div>
                                            <div class="com-imgs" v-if="item.img"><img class="com-imgs-li" :src="(item.img)"
                                                    @click.stop="clickImg($event)" />
                                            </div>
                                            <div class="com-infor">
                                                <v-btn v-if="hasChild(it, item)" @click.stop="toggleChildComments(item)"
                                                    class="com-infor-btn pa-1" outlined color="teal">{{ item.active ?
                                                        "收起回复" : "展开回复" }}</v-btn>
                                                <v-btn v-if="item.comState == '待' && item.pid == '0'"
                                                    @click.stop="handlePassCom(item)" class="com-infor-btn pa-1" outlined
                                                    color="teal">通过确认</v-btn>
                                                <span class="com-infor-reply">0</span>
                                                <span v-if="item.viewAngle" class="comment-infor-viewpoint"
                                                    @click.stop="clickViewPointIcon(item)">6</span>
                                                <span class="com-infor-date">{{ item.createat }}</span>
                                            </div>
                                        </div>
                                        <div class="com-child" v-if="hasChild(it, item)" :class="{ 'show': item.active }">
                                            <div class="com-child-list">
                                                <div class="com-child-li clearfix"
                                                    v-for="o in commentsDataC(it.comments, item)" :key="o.id">
                                                    <div class="com-child-inforwrap">
                                                        <div class="com-a com-child-inforcon" @click.stop="replyComment(o)">
                                                            <div class="com-top">
                                                                <span class="com-username">{{ o.createby }}<span
                                                                        style="color:#999999">&nbsp;回复&nbsp;</span>{{
                                                                            o.comToName }}
                                                                </span>
                                                                <!-- <v-btn class="com-infor-btn com-delete mr-0" outlined
                                                                    color="red" @click.stop="handleDeleteCom(o)">删除</v-btn>
                                                                <v-btn class="com-infor-btn com-change mr-2" outlined
                                                                    v-if="item.comState == '待'" color="red"
                                                                    @click.stop="handleChangeCom(o)">修改</v-btn> -->
                                                                <span class="com-infor-btn com-delete"
                                                                    @click.stop="handleDeleteCom(o)">
                                                                    <svg t="1704693220788" class="icon"
                                                                        viewBox="0 0 1024 1024" version="1.1"
                                                                        xmlns="http://www.w3.org/2000/svg" p-id="1627"
                                                                        width="64" height="64">
                                                                        <path
                                                                            d="M789.504 343.552c-12.8 0-21.504 8.704-21.504 21.504v490.496c0 23.552-19.456 42.496-42.496 42.496H298.496c-23.552 0-42.496-19.456-42.496-42.496V362.496c0-12.8-8.704-21.504-21.504-21.504s-21.504 8.704-21.504 21.504v490.496c0 47.104 38.4 85.504 85.504 85.504h426.496c47.104 0 85.504-38.4 85.504-85.504V362.496c0-10.24-10.752-18.944-20.992-18.944z m125.952-109.056h-168.448V170.496c0-47.104-38.4-85.504-85.504-85.504H362.496c-47.104 0-85.504 38.4-85.504 85.504v64H106.496c-12.8 0-21.504 8.704-21.504 21.504s8.704 21.504 21.504 21.504h808.448c12.8 0 21.504-8.704 21.504-21.504s-8.192-21.504-20.992-21.504zM320 170.496c0-23.552 19.456-42.496 42.496-42.496h298.496c23.552 0 42.496 19.456 42.496 42.496v64h-384V170.496z"
                                                                            p-id="1628" fill="#666666"></path>
                                                                        <path
                                                                            d="M640 704V365.056c0-12.8-8.704-21.504-21.504-21.504s-21.504 8.704-21.504 21.504v339.456c0 12.8 8.704 21.504 21.504 21.504 12.8-0.512 21.504-11.264 21.504-22.016z m-213.504 0V362.496c0-12.8-8.704-21.504-21.504-21.504s-21.504 8.704-21.504 21.504v341.504c0 12.8 8.704 21.504 21.504 21.504 13.312 0 21.504-10.752 21.504-21.504z"
                                                                            p-id="1629" fill="#666666"></path>
                                                                    </svg>
                                                                </span>
                                                                <span class="com-infor-btn com-change"
                                                                    v-if="item.comState == '待'"
                                                                    @click.stop="handleChangeCom(o)">
                                                                    <svg t="1704693198564" class="icon"
                                                                        viewBox="0 0 1024 1024" version="1.1"
                                                                        xmlns="http://www.w3.org/2000/svg" p-id="1382"
                                                                        width="64" height="64">
                                                                        <path
                                                                            d="M684.202667 117.248c15.893333-15.872 42.154667-15.36 58.922666 1.408l90.517334 90.517333c16.661333 16.661333 17.344 42.986667 1.429333 58.922667l-445.653333 445.653333c-7.936 7.914667-23.104 16.746667-34.218667 19.776l-143.701333 39.253334c-21.909333 5.994667-35.114667-7.104-29.568-28.949334l37.248-146.773333c2.773333-10.944 11.562667-26.346667 19.392-34.176l445.653333-445.653333zM268.736 593.066667c-2.901333 2.901333-8.106667 12.074667-9.130667 16.021333l-29.12 114.773333 111.957334-30.570666c4.437333-1.216 13.632-6.549333 16.810666-9.728l445.653334-445.653334-90.517334-90.496-445.653333 445.653334zM682.794667 178.986667l90.517333 90.517333-30.186667 30.186667-90.496-90.517334 30.165334-30.165333z m-362.026667 362.048l90.496 90.517333-30.165333 30.165333-90.517334-90.496 30.165334-30.186666zM170.666667 874.666667c0-11.776 9.429333-21.333333 21.461333-21.333334h661.077333a21.333333 21.333333 0 1 1 0 42.666667H192.128A21.333333 21.333333 0 0 1 170.666667 874.666667z"
                                                                            fill="#666666" p-id="1383"></path>
                                                                    </svg>
                                                                </span>
                                                            </div>
                                                            <div class="com-text">{{ o.text }}</div>
                                                            <div class="com-imgs" v-if="o.img">
                                                                <img class="com-imgs-li" :src="(o.img)"
                                                                    @click.stop="clickImg($event)" />
                                                            </div>
                                                            <div class="com-infor">
                                                                <span class="com-infor-reply">0</span>
                                                                <span v-if="o.viewAngle" class="comment-infor-viewpoint"
                                                                    @click.stop="clickViewPointIcon(o)">6</span>
                                                                <span class="com-infor-date">{{ o.createat }}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </div>
                    <div class="noComments" v-else><span>待发布问题或记录！</span></div>
                </div>
                <div class="com-popup-post">
                    <div class="com-popup-inputWrap" @click.stop.prevent="clickInp">点击这里发布新的问题或现场记录
                        <!-- <input @click.stop.prevent="clickInp" type="text" class="com-popup-input" name=""
                            placeholder="点击这里发布新的问题或现场记录"> -->
                    </div>
                    <!-- <div class="com-popup-postbtn">发布</div> -->
                </div>
            </div>
        </div>
        <div class="mask-inpField" v-show="popupInpField" @click.stop="resetComParams"></div>
        <div class="popup popup-inpField" v-show="popupInpField">
            <div class="com-post-wrap">
                <template v-if="comParams.comToName == ''">
                    <div class="com-person">内容</div>
                </template>
                <template v-else>
                    <div class="com-person">回复给 <span class="com-person-name">{{ comParams.comToName }}</span></div>
                </template>
                <textarea class="com-post-textarea" ref="focusTextarea" v-model="comParams.text"></textarea>
                <div class="com-image-box" v-show="comImg.show">
                    <img class="preview" :src="(comImg.src)" alt="preview" />
                    <div class="delImg" @click="delImg"></div>
                </div>
                <div class="com-post-box" v-if="comParams.comToName == ''">
                    <div class="com-post-img"><img :src="require('./../assets/img/image.png')"><input id="img_input"
                            type="file" accept="image" @change="selectImg($event, 'add');" /></div>
                    <div class="com-post-btn" @click.prevent="postNewComment('problem');">发布问题</div>
                    <div class="com-post-btn" @click.prevent="postNewComment('record');">现场记录</div>
                </div>
                <div class="com-post-box" v-else>
                    <div class="com-post-img"><img :src="require('./../assets/img/image.png')"><input id="img_input"
                            type="file" accept="image" @change="selectImg($event, 'add');" /></div>
                    <div class="com-post-btn" @click.prevent="postNewComment('problem');">发布整改回复</div>

                </div>
            </div>
        </div>
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
import PhotoSwipe from 'photoswipe'
import PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default'
//import { v4 as uuidv4 } from 'uuid';
export default {

    name: 'Comment',
    data: function () {
        return {
            popupInpField: false,  //新增评论弹窗
            changePopUpInpField: false,   //修改评论弹窗

            commentsData: [],  //当前要显示的数据
            dealCommentsData: [],  //后台请求回的数据，经过处理的
            allCommentsData: [],  //后台请求回的数据，原始数据

            comImg: {
                show: false,
                src: '',
            },

            controlPointArr: [
                { controlPointSort: '00', controlPoint: '' }, { controlPointSort: '01', controlPoint: '01平屋面通用做法' },
                { controlPointSort: '02', controlPoint: '02女儿墙' }, { controlPointSort: '03', controlPoint: '03平屋面天沟檐沟' },
                { controlPointSort: '04', controlPoint: '04平屋面出屋面管道' }, { controlPointSort: '05', controlPoint: '05平屋面雨水口' },
                { controlPointSort: '06', controlPoint: '06平屋面出风口' }, { controlPointSort: '07', controlPoint: '07平屋面排气管' },
                { controlPointSort: '08', controlPoint: '08平屋面变形缝' }, { controlPointSort: '09', controlPoint: '09平屋面防护栏杆' },
                { controlPointSort: '10', controlPoint: '10平屋面出入口' }, { controlPointSort: '11', controlPoint: '11平屋面栈桥' },
                { controlPointSort: '12', controlPoint: '12水簸箕' }, { controlPointSort: '13', controlPoint: '13钢爬梯安装' },
                { controlPointSort: '14', controlPoint: '14设备基础' }, { controlPointSort: '15', controlPoint: '15其他' },
            ],

            comParams: {
                key: '',
                pid: 0,
                createby: '',
                img: '',
                text: '',
                comToName: '',  //给谁回复
                proid: '08fa9423-a2d5-48a9-aa44-1d97f10e8ae9',  //项目id，目前是写死的，uuid生成的
                qid: '139c1014-43b3-4f0c-81e5-6395acb3e127',  //二维码id，目前也是写死的，uuid生成的

                controlSort: "",  //当前分布管控分类
                controlPointSort: "",  //当前管控点分类
                controlPoint: "",
                comSort: "",
                comState: ""
            },
            comChangeParams: {  //只写必要的修改参数
                key: '',
                id: '',
                img: '',
                text: '',
                comState: '',
                controlPointSort: '',
            }
        };

    },
    mounted() {
        this.comParams.controlSort = this.$route.params.controlSort;
        this.comParams.controlPointSort = this.$route.params.controlPointSort;
        for (let i = 0; i < this.controlPointArr.length; i++) {
            if (this.controlPointArr[i].controlPointSort == this.comParams.controlPointSort) {
                this.comParams.controlPoint = this.controlPointArr[i].controlPoint;
            }
        }

        this.weixinislogin();
    },
    methods: {
        /**
         * 微信是否登录，获取用户信息
         */
        weixinislogin() {
            let vm = this;
            let key = sessionStorage.getItem('weixinkey');
            if (key) {
                API.weixinislogin({ key: key }).then(result => {
                    if (result.data.code == 0 && result.data.data.realName) {
                        vm.comParams.key = result.data.data.key;
                        vm.comParams.createby = result.data.data.realName;
                        vm.handleQueryComs();
                    }
                });
            } else {
                this.$router.push('/home');  //评论页分享出去，如果sessionStorage里有key，则请求用户登录信息，否则跳转至home页。
            }
        },

        /**
         * 发送新的评论
         */
        postNewComment(comSort) {
            let vm = this;
            //补充字段值
            vm.comParams.comSort = comSort;
            if (comSort == 'problem' && vm.comParams.pid == 0) {
                vm.comParams.comState = '待';
            } else if (comSort == 'record') {
                vm.comParams.comState = '已';
            }
            if (vm.comParams.text == '' && vm.comParams.img == '') {
                alert("请输入评论内容！")
                return;
            }
            API.addComment(vm.comParams).then(res => {
                if (Number(res.data.code) === 0) {
                    vm.allCommentsData.push(res.data.data);
                    vm.addDataDeal([res.data.data]);
                    vm.resetComParams();
                }
            });
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
            this.comParams.comSort = '';
            this.comParams.comState = '';
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
            let delIds = [obj.id];
            let controlPointComments = {};
            for (let item of vm.commentsData) {
                if (item.controlPointSort == obj.controlPointSort) {
                    controlPointComments = item;
                    for (let item of item.comments) {
                        if (obj.id == item.pid) delIds.push(item.id);
                    }
                }
            }

            let promiseAll = [];
            for (let id of delIds) {
                promiseAll.push(new Promise(resolve => {
                    API.deleteComment({ id: id, key: this.comParams.key }).then(res => {
                        if (Number(res.data.code) === 0 && res.data.data == 1) {
                            resolve(res);
                        }
                    });
                }))
            }
            Promise.all(promiseAll).then(res => {
                console.log(res);
                for (let id of delIds) {
                    for (let [index, val] of controlPointComments.comments.entries()) {
                        if (val.id == id) {
                            controlPointComments.comments.splice(index, 1);
                            if (val.pid == '0') {
                                controlPointComments.commentNumTotal--;
                            }
                        }
                    }
                }
                if (controlPointComments.comments.length == 0) {
                    for (let [index, item] of vm.commentsData.entries()) {
                        if (item.controlPointSort == controlPointComments.controlPointSort) {
                            vm.commentsData.splice(index, 1);
                        }
                    }
                }
                alert('删除成功');
                console.log(this.commentsData);
            })
        },

        /**
         * 通过确认
         */
        handlePassCom(item) {
            let vm = this;
            //if (!confirm("确定要通过吗？")) return;
            vm.comChangeParams = {
                key: vm.comParams.key,
                id: item.id,
                controlPointSort: item.controlPointSort,
                text: item.text,
                img: item.img,
                comState: '已',
            };
            vm.handleChangeComSure('通过确认');
        },

        /**
         * 修改发布的评论或者现场记录
         */
        handleChangeCom(item) {
            let vm = this;
            if (!item.img) item.img = '';
            vm.changePopUpInpField = true;
            vm.comChangeParams = {
                key: vm.comParams.key,
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
         * 查询评论
         */
        handleQueryComs() {
            let vm = this;
            vm.commentsData = [];
            //API.getComments({ proid: this.comParams.proid, key: this.comParams.key }).then(res => {
            API.getComments({ proid: this.comParams.proid }).then(res => {
                if (Number(res.data.code) === 0) {
                    vm.allCommentsData = res.data.data;
                    //console.log(res.data.data);
                    this.attrsDataDeal(res.data.data);
                }
            });

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

        clickInp() {
            let vm = this;
            vm.popupInpField = true;
            setTimeout(function () {
                vm.$nextTick(function () {
                    vm.$refs.focusTextarea.focus(); //点击发布输入框,自动获取焦点不起作用
                });
            }, 50);
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

        /**
         * 展开或者收起子评论
         */
        toggleChildComments: function (item) {
            item.active = !item.active;
            console.log(item);
        },


        replyComment(item) {
            if (item.pid != 0) this.comParams.pid = item.pid
            else if (item.pid == 0) this.comParams.pid = item.id;
            this.comParams.comToName = item.createby;
            this.popupInpField = true;
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
            }
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
            //                         //具体评论条目
            //                     }
            //                 ],
            //                'commentNumTotal':1,  //总共的问题数量
            //                'commentNumUnconfirmed':1, //未整改确认的问题数量
            //             }
            //         ],
            //         'controlComNumTotal':1,  //该管控节点下总共的问题数量
            //         'controlComNumUnconfirmed':1  //该管控节点下未整改确认的问题数量
            //     }
            // ];

            let listArr = [];
            d.forEach(function (el) {
                vm.$set(el, "active", false);

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
            //console.log(vm.dealCommentsData);
            for (let i = 0; i < vm.dealCommentsData.length; i++) {
                if (vm.dealCommentsData[i].controlSort == vm.comParams.controlSort && vm.comParams.controlPointSort == '00') {
                    let controlPointSortArr = vm.dealCommentsData[i].controlPointSortArr;
                    vm.commentsData = controlPointSortArr;
                } else if (vm.dealCommentsData[i].controlSort == vm.comParams.controlSort) {
                    let controlPointSortArr = vm.dealCommentsData[i].controlPointSortArr;
                    for (let j = 0; j < controlPointSortArr.length; j++) {
                        if (controlPointSortArr[j].controlPointSort == vm.comParams.controlPointSort) {
                            vm.commentsData = [controlPointSortArr[j]];
                        }
                    }
                }
            } 
        },
        //处理数据,将返回数据根据某个属性进行分组
        addDataDeal: function (d) {
            let vm = this;
            let listArr = vm.dealCommentsData;
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
                                    for (let item of controlPointSortArr[j].comments) {
                                        if (item.id == el.pid) {
                                            item.active = true;
                                        }
                                    }
                                    controlPointSortArr[j].comments.push(el);  //pid不为0，是一条子评论
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
                                    ],
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
                            ],
                        }
                    ]
                });
            });

            //处理数据，加评论总数和待整改的评论数量属性,总数取pid为0的
            for (let n = 0; n < listArr.length; n++) {
                let controlPointSortArr = listArr[n].controlPointSortArr;
                listArr[n].controlComNumTotal = 0;
                listArr[n].controlComNumUnconfirmed = 0;
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
            //console.log(vm.dealCommentsData);
            for (let i = 0; i < vm.dealCommentsData.length; i++) {
                if (vm.dealCommentsData[i].controlSort == vm.comParams.controlSort && vm.comParams.controlPointSort == '00') {
                    let controlPointSortArr = vm.dealCommentsData[i].controlPointSortArr;
                    vm.commentsData = controlPointSortArr;
                } else if (vm.dealCommentsData[i].controlSort == vm.comParams.controlSort) {
                    let controlPointSortArr = vm.dealCommentsData[i].controlPointSortArr;
                    for (let j = 0; j < controlPointSortArr.length; j++) {
                        if (controlPointSortArr[j].controlPointSort == vm.comParams.controlPointSort) {
                            vm.commentsData = [controlPointSortArr[j]];
                        }
                    }
                }
            }
            //console.log(vm.commentsData);

        },
        handleGoBack: function () {
            if (this.$route.params.controlPointSort == '00') this.$router.push('/Home');
            else this.$router.push('/Control/' + this.$route.params.controlSort);
        },

    },
};
</script>
<style scoped>
@import '../assets/css/comment.css';

.com-controlPoint {
    float: right;
    color: #000;
}
</style>
<style>
.goBack {
    position: fixed;
    top: 0.1rem;
    left: 0.2rem;
    z-index: 10002;
}

.goBack svg {
    background: rgba(0, 0, 0, 0.6);
    width: .54rem;
    height: .54rem;
    border-radius: 50%;
    padding: 5px;
}</style>