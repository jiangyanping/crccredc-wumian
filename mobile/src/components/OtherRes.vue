<template>
    <div v-show="otherRes.show" id="otherRes" class="other-res" style="position: relative;top: -100%">
        <div class="iframe-wrap" v-show="showIframe">
            <iframe id="showOtherResIframe" webkitallowfullscreen="" mozallowfullscreen="" allowfullscreen=""></iframe>
        </div>
        <video v-show="showVideo"  ref='video' class="vjs-tech" controls  width="100%" height="100%" style="position: relative;"  id="videoM3u8">
            <source>
        </video>
        <div class="bottom-toolbar" id="otherResTool"></div>
        <div @click.prevent="clickGoHome2" class="leftArrow">
            <svg t="1653530517837" opacity="0.7" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7542" width="40" height="40">
                <path d="M512 146.285714c202.020571 0 365.714286 163.693714 365.714286 365.714286S714.020571 877.714286 512 877.714286 146.285714 714.020571 146.285714 512s163.693714-365.714286 365.714286-365.714286z m75.922286 197.046857c-10.825143-9.216-26.770286-9.216-37.595429 0l-1.901714 1.755429-144.969143 144.969143-1.901714 2.048c-3.510857 4.388571-5.705143 9.508571-6.436572 14.774857l-0.146285 2.486857v3.803429c0.292571 6.144 2.486857 12.288 6.582857 17.408l1.901714 2.048 144.969143 144.969143c10.825143 10.825143 27.940571 11.410286 39.497143 1.609142l1.901714-1.755428 1.755429-1.901714c9.216-10.971429 9.216-26.770286 0-37.595429l-1.755429-1.901714-124.928-124.928 124.928-124.928 1.755429-1.901715c8.630857-10.24 9.069714-24.868571 1.462857-35.693714l-1.462857-1.901714-1.755429-1.901714-1.901714-1.462858z" p-id="7543" fill="#8a8a8a"></path>
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
        height: calc(100% - 80px);
    }
    @media (max-width: 750px),
    (max-height: 750px) {
        .other-res {
            height: calc(100% - 1.6rem);
        }
        /* 横屏 */
        @media (orientation:landscape) {
            .other-res {
                height: 100%;
            }
        }
    }
    iframe {
        border: none;
    }
</style>
<script>
    import API from "../request/api.js";
    import Bus from "../assets/js/Bus";
    import { Base64 } from 'js-base64';

    export default {
        name: 'OtherRes',
        props: ['otherRes', 'commentBtn'],
        data: function() {
            return {
                showIframe: true,
                showVideo: false,
            };
        },
        watch: {
            otherResNew: {
                immediate: true,
                handler(newValue, oldValue) {
                    if (newValue.show) {
                        document.title = newValue.item.name;
                    }
                    if (newValue.show && newValue.item.fid != oldValue.item.fid) {
                        this.loadOtherRes(this.otherRes.item);
                    }

                },
                deep: true
            },
        },
        computed: {
            otherResNew() { //使watch handler里的newValue和oldValue的值不一样，以便做出判断
                return JSON.parse(JSON.stringify(this.otherRes));
            }
        },
        methods: {
            loadOtherRes: function(item) {
                // let fileUrl = "https://crccredc-sofa.oss-cn-beijing.aliyuncs.com/" + item.url;
                // let onlinePreviewFileUrl = "https://back.sofa.rebim.cn:8445/onlinePreview?url=" + Base64.encode(fileUrl);
                // let onlinePreviewFileUrl = "https://back.sofa.rebim.cn:8445/onlinePreview?url=" + fileUrl;

                let fileUrl = API.baseModelURL + item.url;
                let onlinePreviewFileUrl = API.onlinePreviewFileUrl + "onlinePreview?url=" + (Base64.encode(fileUrl)).replace(/[+]/g, '%2B');
                let fileName = fileUrl.split('.').pop().toLocaleLowerCase();
                if (fileName == "mp4") {
                    this.showIframe = false
                    this.showVideo = true
                    this.$refs.video.src = fileUrl;
                } else {
                    this.showVideo = false
                    this.showIframe = true
                    document.getElementById("showOtherResIframe").src = onlinePreviewFileUrl;
                }
            },
            clickGoHome2: function() {
                window.isIndex = true
                this.$emit('goHomePage2');
                Bus.$emit("isShowU11", true)
                document.getElementById("videoM3u8").pause();
            },
            clickCommentBtn: function() {
                this.$emit('showComments');
            },
        },
    };
</script>
