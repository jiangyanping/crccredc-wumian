<template>
    <div id="otherRes" class="other-res" style="position: relative;">
        <div class="iframe-wrap" v-show="!showVideo">
            <iframe id="showOtherResIframe" webkitallowfullscreen="" mozallowfullscreen="" allowfullscreen=""></iframe>
        </div>
        <video v-show="showVideo" ref='video' class="vjs-tech" controls width="100%" height="100%"
            style="position: relative;" id="videoM3u8">
            <source>
        </video>
        <div class="bottom-toolbar" id="otherResTool"></div>
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
<style scoped>
iframe,
.iframe-wrap {
    width: 100%;
    height: 100%;
}

.other-res {
    height: 100%;
}

iframe {
    border: none;
    height: 100% !important;
}
</style>
<script>
import API from "../request/api.js";
import Bus from "../assets/js/Bus";
import { Base64 } from 'js-base64';
import resourceData from "../data/resourcesData"
import weixinLogin from "../assets/js/weixinLogin.js";

export default {
    name: 'OtherRes',
    data: function () {
        return {
            showVideo: false,
            resourceData,
        };
    },
    mounted() {
        this.weixinIsLogin();
    },
    methods: {
        /**
         * 微信是否登录
         */
        async weixinIsLogin() {
            let res = await weixinLogin.getWeixinKey();
            if (res && res.realName) {
                //微信登录且绑定账户，则加载对应资源
                for (let i = 0; i < this.resourceData.length; i++) {
                    if (this.resourceData[i].mark == this.$route.params.mark) {
                        for (let item of this.resourceData[i].resource) {
                            if (item.fid == this.$route.params.resFid) {
                                this.loadOtherRes(item);
                            }
                        }
                    }
                }
            }
        },

        loadOtherRes: function (item) {
            // let fileUrl = "https://crccredc-sofa.oss-cn-beijing.aliyuncs.com/" + item.url;
            // let onlinePreviewFileUrl = "https://back.sofa.rebim.cn:8445/onlinePreview?url=" + Base64.encode(fileUrl);
            // let onlinePreviewFileUrl = "https://back.sofa.rebim.cn:8445/onlinePreview?url=" + fileUrl;

            let fileUrl = API.baseModelURL + item.url;
            let onlinePreviewFileUrl = API.onlinePreviewFileUrl + "onlinePreview?url=" + (Base64.encode(fileUrl)).replace(/[+]/g, '%2B');
            let fileName = fileUrl.split('.').pop().toLocaleLowerCase();
            if (fileName == "mp4") {
                this.showVideo = true
                this.$refs.video.src = fileUrl;
            } else {
                this.showVideo = false
                document.getElementById("showOtherResIframe").src = onlinePreviewFileUrl;
            }
        },
        clickGoHome2: function () {
            window.isIndex = true
            this.$emit('goHomePage2');
            Bus.$emit("isShowU11", true)
            document.getElementById("videoM3u8").pause();
        },
        clickCommentBtn: function () {
            this.$emit('showComments');
        },
        handleGoBack: function () {
            this.$router.push('/Resource/' + this.$route.params.view + '/' + this.$route.params.mark);
        },
    },
};
</script>
<style scoped>
.goBack {
    position: fixed;
    top: 0.1rem;
    left: 0.7rem;
    z-index: 10002;
}</style>
