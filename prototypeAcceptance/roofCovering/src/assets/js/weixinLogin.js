import API from "../../request/api.js";
import router from "../../router/index.js";
let weixinLogin = {
    /**
    * getWeixinKey  获取微信登录的key得可能值，通过key获取用户信息
    */
    async getWeixinKey() {
        let key = '';
        if (localStorage.getItem('weixinkey')) {
            key = localStorage.getItem('weixinkey');
            if(location.href.indexOf('id') > -1 && location.href.indexOf('key') > -1 ){   
                //打开地址带有id标识，要保留，key去掉   
                window.location.href = location.href.slice(0,(location.href.split("key")[0].length -3));
            }
        } else {
            let urlHasKey = location.href.indexOf('key') > -1 && location.href.length > 1 ? location.href.split("key")[1] : "";
            if (urlHasKey) {
                key = urlHasKey.split("#")[0].slice(1);
                localStorage.setItem('weixinkey', key);
                if(location.href.indexOf('id') > -1){   
                    //打开地址带有id标识，要保留，key去掉   
                    window.location.href = location.href.slice(0,(location.href.split("key")[0].length -3));
                }else{
                    //微信登录回来，地址中key，要存储key并且改变地址，去掉key
                    window.location.href = location.href.split("?")[0];  
                }
            }
        }
        let res = await this.weixinislogin(key);
        return res;
    },

    /**
     * 微信是否登录
     */
    async weixinislogin(key) {
        let res = await API.weixinislogin({ key: key }).then(res => {
            if (res.data.code == 0 && !res.data.data.openId && !res.data.data.userName) {
                //未登录,要跳转登录
                let url = API.baseURL + '/weixinlogin?key=' + res.data.data.key + '&router=' + API.weixinLoginRedirectUrl + window.location.href.split("#")[1];
                window.location.href = url;
            } else {
                //已登录，未和微信绑定
                if (!res.data.data.realName) {
                    //判断是否有realName：真实姓名，没有，到微信绑定，通过手机号，验证码进行微信绑定
                    localStorage.setItem('openId', res.data.data.openId);
                    router.push('/weixinBind');
                }else{
                    return res.data.data;
                }
            }
        });
        return res;
    }
};

export default weixinLogin;
