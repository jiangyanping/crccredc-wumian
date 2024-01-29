import axios from 'axios'
axios.defaults.withCredentials = true;
//axios.defaults.baseURL = 'http://172.16.0.124:8080'; //开发的，在后台取数据
axios.defaults.baseModelURL = 'https://sofa.rebim.cn/' //开发的，加载模型
axios.defaults.onlinePreviewFileUrl = "https://fileview.rebim.cn/" //开发的，加载其他资源

axios.defaults.baseURL = 'http://47.93.210.113'; //阿里云oss，在后台取数据
/*axios.defaults.baseURL = 'https://back.sofa.rebim.cn/sofa'; //生产的，在后台取数据
axios.defaults.baseModelURL = 'https://sofa.rebim.cn/'  //生产的，oss域名，加载模型
axios.defaults.onlinePreviewFileUrl = "https://fileview.rebim.cn/"  //生产的，加载其他资源*/

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