import request from './axios'

export const API = {

    //微信是否登录
    weixinislogin: (query) => {
        return request({
            url: '/weixinislogin',
            method: 'get',
            params: query
        })
    },

    //微信登录
    weixinlogin: (query) => {
        return request({
            url: '/weixinlogin',
            method: 'get',
            params: query
        })
    },

    //微信登录,添加真实姓名
    addRealName: (query) => {
        return request({
            url: '/addRealName',
            method: 'get',
            params: query
        })
    },

    //微信绑定,获取验证码
    getCode: (query) => {
        return request({
            url: '/getCode',
            method: 'get',
            params: query
        })
    },

    //二维码评论时，上传图片
    commentsImgUpload: (query, headers) => {
        return request({
            url: '/comment/imgUpload',
            method: 'post',
            data: query,
            headers: headers,
        })
    },

    //新增二维码评论
    addComment: (query) => {
        return request({
            url: '/comment/addComment',
            method: 'post',
            data: query
        })
    },

    //删除二维码评论
    deleteComment: (query) => {
        return request({
            url: '/comment/deleteComment',
            method: 'get',
            params: query
        })
    },

    //修改二维码评论
    updateComment: (query) => {
        return request({
            url: '/comment/updateComment',
            method: 'post',
            data: query
        })
    },

    //获取二维码的评论
    getComments: (query) => {
        return request({
            url: '/comment/getComments',
            method: 'get',
            params: query
        })
    },

    //导出评论
    exportComments: (query) => {
        return request({
            url: '/comment/wordExport',
            method: 'get',
            params: query
        })
    },

    //导出回复评论
    exportCommentsReply: (query) => {
        return request({
            url: '/comment/wordExportReply',
            method: 'get',
            params: query
        })
    },

    //导出评论，获取签名
    getSignature: () => {
        return request({
            url: '/comment/signature',
            method: 'get',
        })
    },

    //获取问题发起人
    getUsers: (query) => {
        return request({
            url: '/comment/getUsers',
            method: 'get',
            params: query
        })
    },

    //获取模型构件实例属性信息
    getGoujianParameter: (query) => {
        return request({
            url: '/searchParameter',
            method: 'get',
            params: query
        })
    },

    //获取模型构件类型属性信息
    getGoujianTypeParameter: (query) => {
        return request({
            url: '/searchEParameter',
            method: 'get',
            params: query
        })
    },

    //根据构件id获取简略属性
    getBriefParameterByUid: (query) => {
        return request({
            url: '/briefParameter/getBriefParameterByUid',
            method: 'get',
            params: query
        })
    },

    getBriefParamsURL: request.defaults.getBriefParamsURL,
    baseURL: request.defaults.baseURL,
    baseModelURL: request.defaults.baseModelURL,
    onlinePreviewFileUrl: request.defaults.onlinePreviewFileUrl,
    appId: request.appId,
    buildingName: request.buildingName,
    shareImgUrl: request.defaults.shareImgUrl,
    weixinLoginRedirectUrl: request.weixinLoginRedirectUrl,
    docTitle: request.docTitle,
    louNum: request.louNum,
};
export default API;