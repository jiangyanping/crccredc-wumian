<template>
    <div class="comment" v-show="comment.show" style="height: 100%;width: 100%">
        <div class="mask" v-show="popupCom"></div>
        <div class="popup popup-com" v-show="popupCom">
            <div class="popup-title">
                全部<span>{{commentsNum}}</span>条评论
                <div class="popup-close" @click.prevent="closeCom">X</div>
            </div>
            <div class="com-popup-con">
                <h1>评论（<span>{{commentsNum}}</span>）</h1>
                <div class="com-popup-box">
                    <div class="com-list">
                        <div class="com-li clearfix" v-for="(item,index) in commentsDataF()" :key="index">
                            <template>
                                <div class="com-infor-wrap">
                                    <div class="com-a com-infor-con" @click="replyComment(item)">
                                        <div class="com-username">{{item.name}}</div>
                                        <div class="com-text">{{item.text}}</div>
                                        <div class="com-imgs" v-if="item.img != null && item.img.length !=0"><img class="com-imgs-li" :src="(item.img[0])" @click.stop="clickImg($event)" /></div>
                                        <!-- onload="jQuery(this).jqthumb({width: \'100%\',height: \'100%\',zoom: \'1\',method: \'auto\'});" -->
                                        <div class="com-infor">
                                            <span class="com-more" v-if="hasChild(item)" @click.stop="toggleChildComments(item)">{{item.active?"收起回复":"展开回复"}}</span>
                                            <span class="com-comToRes" v-if="item.comToRes != null && item.comToRes != ''">{{item.comToRes}}</span>
                                            <span class="com-infor-reply">0</span>
                                            <span v-if="item.viewAngle != ''" class="comment-infor-viewpoint" @click.stop="clickViewPointIcon(item)">6</span>
                                            <span class="com-infor-date">{{item.time}}</span>
                                        </div>
                                    </div>
                                    <div class="com-child" v-if="hasChild(item)" :class="{'show':item.active}">
                                        <div class="com-child-list">
                                            <div class="com-child-li clearfix" v-for="o in commentsDataC(item)" :key="o.id">
                                                <div class="com-child-inforwrap">
                                                    <div class="com-a com-child-inforcon" @click.stop="replyComment(o)">
                                                        <div class="com-username">{{o.name}}<span style="color:#999999">&nbsp;回复&nbsp;</span>{{o.comToName}}</div>
                                                        <div class="com-text">{{o.text}}</div>
                                                        <div class="com-imgs" v-if="o.img != null && o.img.length !=0"><img class="com-imgs-li" :src="(o.img[0])" @click.stop="clickImg($event)" /></div>
                                                        <div class="com-infor">
                                                            <span class="com-comToRes" v-if="o.comToRes != null && o.comToRes != ''">{{o.comToRes}}</span>
                                                            <span class="com-infor-reply">0</span>
                                                            <span v-if="o.viewAngle != ''" class="comment-infor-viewpoint" @click.stop="clickViewPointIcon(o)">6</span>
                                                            <span class="com-infor-date">{{o.time}}</span></div>
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
                <div class="com-popup-post">
                    <div class="com-popup-inputWrap">
                        <input @click.stop.prevent="clickInp" type="text" class="com-popup-input" name="" placeholder="点击这里发表评论">
                    </div>
                    <div class="com-popup-postbtn">发布</div>
                </div>
            </div>
        </div>
        <div class="mask-inpField" v-show="popupInpField" @click.prevent="hideInpField"></div>
        <div class="popup popup-inpField" v-show="popupInpField">
            <div class="com-post-wrap">
                <template v-if="comOthers.commentOthers == false">
                    <div class="com-person">评论</div>
                </template>
                <template v-else>
                    <div class="com-person">评论给 <span class="com-person-name">{{comOthers.someoneName}}</span></div>
                </template>
                <textarea class="com-post-textarea" ref="focusTextarea" v-model="textarea"></textarea>
                <div class="com-image-box" v-show="comImg.show">
                    <img class="preview" :src="(comImg.src)" alt="preview" />
                    <div class="delImg" @click="delImg"></div>
                </div>
                <div class="com-post-box">
                    <div class="com-post-img"><img :src="require('./../../assets/img/image.png')"><input id="img_input" type="file" accept="image" @change="selectImg($event);" /></div>
                    <div class="com-post-viewpoint" v-show="comment.viewPoint">
                        <label><input name="viewpoint" id="isViewPoint" type="checkbox" checked="checked" value="" v-model="viewPointChecked" />是否添加视点</label>
                    </div>
                    <div class="com-post-btn" @click.prevent="postNewComment(comment.item);">发布</div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
    @import './../../assets/css/comment.css';
</style>
<script>
    import API from "../../request/api.js";
    import PhotoSwipe from 'photoswipe'
    import PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default'
    /*import $ from "jquery";*/
    import Bus from "../../assets/js/Bus";
    export default {

        name: 'Comment',
        props: ['comment', 'qid'],
        data: function() {
            return {
                popupCom: false,
                popupInpField: false,
                comOthers: {
                    commentOthers: false, //发表一条新的评论或者评论给某人
                    someoneName: ''
                },
                commentsData: [],
                commentsNum: '0',
                statusCommentsChildItem: {},
                pid: '0',
                imgid: '',
                comImg: {
                    show: false,
                    src: '',
                },
                textarea: '',
                viewPointChecked: true,
                currentLoadRebimurl: '',
                ttt: 1,
            };
        },
        watch: {
            qid: {
                immediate: true,
                handler(newValue, oldValue) {
                    if (newValue != '' && newValue != oldValue) {
                        this.isComment();
                    }
                },
                deep: true
            },
            comment: {
                immediate: true,
                handler(newValue) {
                    if (newValue.show) {
                        this.showComments();
                        let url = '';
                        if (newValue.item.rebimUrl) {
                            url = newValue.item.rebimUrl;
                        } else {
                            if (newValue.item.type == "3d" || newValue.item.type == "rebim") {
                                url = API.baseModelURL + newValue.item.url + "model.zip";
                            } else if (newValue.item.type == "criteria") {
                                url = API.baseModelURL + "uploads/" + newValue.item.url;
                            }
                        }
                        if (url != '') this.currentLoadRebimurl = url;
                    }
                },
                deep: true
            },
        },
        methods: {
            commentsDataF: function() {
                return this.commentsData.filter(item => item.pid == 0);
            },
            commentsDataC: function(d) {
                return this.commentsData.filter(item => item.pid == d.id);
            },
            isComment: function() {
                let vm = this;
                let ua = window.navigator.userAgent.toLowerCase();
                if (ua.indexOf("micromessenger") > -1 || ua.match(/MicroMessenger/i) === 'micromessenger') {
                    API.QRCodeIsComment({ id: vm.comment.item.qid }).then(res => {
                        if (res.data.data.iscomment && res.data.data.iscomment == '1') {
                            vm.$emit('showCommentBtn');
                            vm.winxinIsLogin();
                        }
                    });
                }
            },
            winxinIsLogin: function() {
                let vm = this;
                let url = location.href.indexOf('?') > -1 && location.href.length > 1 ? location.href.split("?")[1] : "null";
                /*if ((undefined == url || "" == url || "null" == url) && location.href.indexOf('?') == -1) {
                    alert("错了");
                }*/
                if (url.indexOf('error') > -1) {
                    alert(url);
                } else if (url.indexOf('openid') > -1) {
                    sessionStorage.openid = url.split("&")[1].substring(7, url.split("&")[1].lastIndexOf("#"));
                } else if (url.indexOf('username') > -1) {
                    sessionStorage.username = "";
                } else {
                    sessionStorage.qid = vm.comment.item.qid;
                }
                API.weixinislogin().then(res => {
                    if (res.data.code == 0 && res.data.data.indexOf('-') > -1) {
                        sessionStorage.username = res.data.data;
                    } else {
                        if (!sessionStorage.openid && !sessionStorage.username) {
                            window.location.href = API.baseURL + '/weixinlogin?qid=' + vm.comment.item.qid;
                        }
                    }
                });
            },
            showComments: function() {
                let vm = this;
                if (!sessionStorage.openid && !sessionStorage.username) {
                    alert("不能评论");
                }
                if (sessionStorage.username) {
                    vm.getCommentsData(); //有userName才能评论
                    vm.getCommentsNum();
                    this.popupCom = true;
                } else {
                    //通过openid看微信是否登陆，是否绑定rebim账号
                    API.weixinisloginbyopenid({ qid: vm.comment.item.qid, openid: sessionStorage.openid }).then(res => {
                        if (!res.data.data) {
                            let isBind = confirm("使用评论功能需先绑定rebim账号,确认绑定吗？");
                            if (isBind) {
                                window.location.href = res.data.msg;
                            }else{
                                this.$emit('hideComment');
                            }
                        } else {
                            vm.getCommentsData(); //有userName才能评论
                            vm.getCommentsNum();
                            this.popupCom = true;
                        }
                    });
                }
            },
            closeCom: function() {
                this.popupCom = false;
                Bus.$emit("operationalModelButton", true)
                this.$emit('hideComment');
            },
            clickInp: function() {
                let vm = this;
                vm.popupInpField = true;
                setTimeout(function() {
                    vm.$nextTick(function() {
                        vm.$refs.focusTextarea.focus(); //点击发布输入框,自动获取焦点不起作用
                    });
                }, 50);
            },
            hideInpField: function() {
                this.popupInpField = false;
            },
            getCommentsData: function() {
                let vm = this;
                API.getComments({ qid: this.comment.item.qid }).then(res => {
                    vm.commentsData = [];
                    vm.dealCommentsData(res.data.data, false);
                });
            },
            getCommentsNum: function() {
                let vm = this;
                API.getCommentsNum({ qid: this.comment.item.qid }).then(res => {
                    vm.commentsNum = res.data.data.num;
                });
            },
            dealCommentsData: function(comments, bool, addbool) {
                let vm = this;
                for (let item of comments) {
                    let year = new Date().getFullYear();
                    if (item.time.slice(0, 4) == year) { //截取时间
                        item.time = item.time.slice(5, 10)
                    } else {
                        item.time = item.time.slice(0, 10)
                    }
                    vm.$set(item, "active", bool);
                    if (addbool) {
                        vm.commentsData.unshift(item); //新增一条评论加在现有评论数据的最前面，最先显示
                    } else {
                        vm.commentsData.push(item);
                    }
                }
            },
            hasChild: function(item) {
                for (let o of this.commentsData) {
                    if (o.pid == item.id) {
                        return true;
                    }
                }
            },
            toggleChildComments: function(item) {
                item.active = !item.active;
            },
            replyComment: function(item) {
                if (item.pid != 0) this.pid = item.pid
                else if (item.pid == 0) this.pid = item.id;
                this.popupInpField = true;
                this.comOthers = {
                    commentOthers: true,
                    someoneName: item.name,
                };
            },
            delImg() {
                let vm = this;
                vm.comImg = {
                    show: false,
                    src: '',
                }
            },
            selectImg: function(e) {
                let vm = this;
                let file = e.target.files[0]; //获取图片资源
                // 只选择图片文件
                if (!file.type.match('image.*')) {
                    return false;
                }
                let reader = new FileReader();
                reader.readAsDataURL(file); // 读取文件
                // 渲染文件
                reader.onload = function(arg) {
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
                    /*let config = {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    }
                    this.axios.post('/comment/imgUpload', form_data, config).then((res) => {
                        vm.imgid = res.data.data.id;
                    }).catch(err => {
                        console.log(err);
                    });*/
                    let headers = { 'Content-Type': 'multipart/form-data' }
                    API.commentsImgUpload(form_data, headers).then(res => {
                        vm.imgid = res.data.data.id;
                    });
                }
                e.target.value = "";
            },
            clickImg: function(e) {
                this.openPhotoSwipe(e.target);
            },
            openPhotoSwipe: function(_this) {
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
            postNewComment: function(item) { //item可能是一条资源信息，也可能是一条评论信息
                let vm = this;
                if (vm.textarea == '' && vm.imgid == '') {
                    alert("请输入评论内容！")
                } else {
                    let viewPoint = '',
                        url = '',
                        comToRes = '',
                        modelrange = '',
                        proid = '',
                        fid = '';
                    if (!(JSON.stringify(item) === '{}')) {
                        if (vm.comment.viewPoint && vm.viewPointChecked && (window.viewer != "undefined" || window.viewer != "")) viewPoint = window.viewer.camera.position;
                        if (item.rebimUrl) {
                            url = item.rebimUrl;
                        } else {
                            if (item.type == "3d" || item.type == "rebim") {
                                url = API.baseModelURL + item.url + "model.zip";
                            } else if (item.type == "criteria") {
                                url = API.baseModelURL + "uploads/" + item.url;
                            }
                        }
                        if (item.comToRes) {
                            comToRes = item.comToRes
                        } else {
                            comToRes = item.name;
                        }
                        modelrange = item.modelrange;
                        proid = item.fid;
                        fid = item.fid;
                    }
                    let params = {
                        "text": vm.textarea,
                        "qid": vm.qid,
                        "pid": vm.pid,
                        "img": vm.imgid,
                        "viewAngle": viewPoint,
                        "comToRes": comToRes,
                        "comToName": vm.comOthers.someoneName,
                        "rebimUrl": url,
                        "modelrange": modelrange,
                        "proid": proid,
                        "fid": fid,
                    };
                    API.addComment(params).then(res => {
                        if (Number(res.data.code) === 0) {
                            vm.commentsNum++;
                            vm.popupInpField = false;
                            if (res.data.data.pid != 0) {
                                for (let o of vm.commentsData) {
                                    if (o.id == res.data.data.pid) {
                                        o.active = true;
                                    }
                                }
                                vm.dealCommentsData([res.data.data], true, false);
                            } else {
                                vm.dealCommentsData([res.data.data], true, true);
                            }
                            vm.textarea = ''; //清空数据
                            vm.pid = '0';
                            vm.imgid = '';
                            vm.comOthers = {
                                commentOthers: false,
                                someoneName: ''
                            };
                            vm.comImg = {
                                show: false,
                                src: '',
                            };
                        }
                    });
                }
            },
            clickViewPointIcon: function(item) {
                let vm = this;
                Bus.$emit("isShowU11", false)
                Bus.$emit("isCommentIcon", false)
                vm.popupCom = false;
                API.getDeteilByCommentId({ id: item.id }).then(res => {
                    if (res.data.data.viewAngle != "" && res.data.data.viewAngle != null) {
                        if (vm.comment.viewPoint && vm.currentLoadRebimurl == res.data.data.rebimUrl) {
                            let viewAngle = JSON.parse(res.data.data.viewAngle);
                            let arg = {};
                            arg.pos = new window.THREE.Vector3(viewAngle.x, viewAngle.y, viewAngle.z);
                            window.viewer.look(arg);
                            vm.popupCom = false; //popupCom和comment.show是否能使用一个
                            vm.comment.show = false;
                        } else {
                            vm.currentLoadRebimurl = res.data.data.rebimUrl;
                            vm.$emit('clickComViewPoint', res.data.data);
                        }
                    }
                });
            },
        },
    };
</script>