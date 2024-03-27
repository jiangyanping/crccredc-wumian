import axios from 'axios'
axios.defaults.withCredentials = true;

//开发路径地址
axios.defaults.baseURL = 'http://172.16.0.124:8080'; //开发的，在后台取数据
axios.appId = 'wxc9760cd0f9ffcfbc';  // 开发的，导出评论用的appId

axios.buildingName = ''; // 开发的，该二维码的项目，楼号
axios.weixinLoginRedirectUrl = '@';  //微信登录跳转的地址设置
axios.docTitle = '华漕屋面';   //页面的title值
axios.shareLink = 'http://172.16.1.6:8080/#/Acceptance', //点评验收分享出的链接
axios.default.shareImgUrl = 'http://conmanage.rebim.cn/A-others/images/one.jpg',   //分享导出评论图标
axios.defaults.baseModelURL = 'https://sofa.rebim.cn/' //开发的，加载模型
axios.defaults.onlinePreviewFileUrl = "https://fileview.rebim.cn/" //开发的，加载其他资源

//线上路径地址
// axios.defaults.baseURL = 'http://47.93.210.113'; //阿里云oss，在后台取数据
// axios.appId = 'wx72cc3345b698d35e';  // 生产的，导出评论用的appId

// axios.buildingName = ''; // 开发的，该二维码的项目，楼号
// axios.weixinLoginRedirectUrl = '/02_prototypeAcceptance/02_roofCoveringForward/index.html@';  //微信登录跳转的地址设置
// axios.docTitle = '华漕屋面';   //页面的title值
// axios.shareLink = 'http://conmanage.rebim.cn/02_prototypeAcceptance/02_roofCoveringForward/index.html#/home', //点评验收分享出的链接
// axios.default.shareImgUrl = 'http://conmanage.rebim.cn/A-others/images/one.jpg',   //分享导出评论图标
// axios.defaults.baseModelURL = 'https://sofa.rebim.cn/'  //生产的，oss域名，加载模型
// axios.defaults.onlinePreviewFileUrl = "https://fileview.rebim.cn/"  //生产的，加载其他资源

axios.interceptors.request.use(
    config => {
        return config;
    }, err => {
        return Promise.reject(err);
    });
axios.interceptors.response.use(
    res => {
        return res;
    }, err => {
        console.log(err);
        return Promise.reject(err);
    });
export default axios;