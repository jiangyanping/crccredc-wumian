<template>
    <div id="shareWord" class="shareWord">
        <div class="mask-shareWord" v-show="shareWord">
            <div>
                <img :src="require('../assets/img/exportSign.png')" alt="">
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
import wx from 'weixin-js-sdk';
export default {
    name: 'ShareWordLink',
    data: function () {
        return {
            shareWord: true,
            url: '',
            appId: 'wxc9760cd0f9ffcfbc',//开发环境的    wx72cc3345b698d35e   //生产环境的
            timestamp: '',
            nonceStr: 'Wm3WZYTPz0wzccnW',
            signature: '',

            shareTitle: '标题',  //分享标题
            shareDesc: '描述',   //分享描述
            shareLink: '',   //分享链接
            shareImgUrl: 'http://conmanage.rebim.cn/A-others/images/one.png',   //分享图标

        };
    },
    mounted() {

        this.shareLink = this.$route.params.wordLink;
        console.log(this.shareLink);
        const indexOfHash = window.location.href.indexOf('#');
        // 如果找到了 #，则截取字符串；否则，返回原始字符串
        this.url = indexOfHash !== -1 ? window.location.href.substring(0, indexOfHash) : window.location.href;

        console.log(window.location.href);
        console.log(this.url);

        this.timestamp = (Date.now()).toString().substring(0, 10);
        console.log(this.timestamp);
        // this.timestamp.substring(0, 9);
        this.getSignature();

    },
    methods: {
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
                    link: 'http://172.16.1.6:8080',
                    imgUrl: this.shareImgUrl,
                    success: () => {
                        // 分享成功回调
                        console.log('分享给朋友成功');
                    },
                    cancel: () => {
                        // 用户取消分享
                        console.log('用户取消分享给朋友');
                    }
                });
            });
        },

        /**
         * 分享给朋友
         */
        shareToFriend() {
            // 在按钮点击时触发分享给朋友
            wx.ready(() => {
                wx.updateAppMessageShareData({
                    title: this.shareTitle,
                    desc: this.shareDesc,
                    link: 'http://172.16.1.6:8080',
                    imgUrl: this.shareImgUrl,
                    success: () => {
                        // 分享成功回调
                        console.log('分享给朋友成功');
                    },
                    cancel: () => {
                        // 用户取消分享
                        console.log('用户取消分享给朋友');
                    }
                });
            });
        },

        shareToCircle() {
            wx.updateTimelineShareData({
                title: '分享标题',
                link: '分享链接',
                imgUrl: '分享图标',
                success: function () {
                    // 分享成功回调
                    console.log('分享到朋友圈成功');
                },
                cancel: function () {
                    // 用户取消分享
                    console.log('用户取消分享到朋友圈');
                }
            });
        },

        handleGoBack: function () {
            this.$router.push('/ExportComments');
        },

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

        // 字符串加密成 hex 字符串
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
        }
    },
};
</script>
<style scoped>
.shareWord {
    width: 100%;
    height: 100%;
    background-color: #fff;
}

.mask-shareWord {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    z-index: 10003;
}

.mask-shareWord img {
    width: 75%;
    height: 80%;
    padding: 10px 15px;
    float: right;
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
