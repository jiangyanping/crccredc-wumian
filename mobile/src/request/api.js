import request from './axios'

export const API = {
    // // 获取二维码名称
    // getQRName: (query) => {
    //     return request({
    //         url: '/QRCode/getQRName',
    //         method: 'get',
    //         params: query
    //     })
    // },

    // // 模型是否组建完成[0:未完成 1:已完成]
    // QRCodeIsBuild: (query) => {
    //     return request({
    //         url: '/QRCode/isBuild',
    //         method: 'get',
    //         params: query
    //     })
    // },

    // // 获取二维码绑定的资源
    // getRQRels: (query) => {
    //     return request({
    //         url: '/qrcode/getRQRels',
    //         method: 'get',
    //         params: query
    //     })
    // },

    // //评论部分
    // //二维码是否带评论
    // QRCodeIsComment: (query) => {
    //     return request({
    //         url: '/QRCode/isComment',
    //         method: 'post',
    //         params: query
    //     })
    // },

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
    addRealName:(query) => {
        return request({
            url: '/addRealName',
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


    // //通过openid获取微信是否登录
    // weixinisloginbyopenid: (query) => {
    //     return request({
    //         url: '/weixinisloginbyopenid',
    //         method: 'get',
    //         params: query
    //     })
    // },

    // //获取二维码的评论
    // getComments: (query) => {
    //     return request({
    //         url: '/comment/getComments',
    //         method: 'post',
    //         params: query
    //     })
    // },

    // //获取二维码的评论数量
    // getCommentsNum: (query) => {
    //     return request({
    //         url: '/comment/commentNum',
    //         method: 'post',
    //         params: query
    //     })
    // },

    // //二维码评论时，上传图片
    // commentsImgUpload: (query, headers) => {
    //     return request({
    //         url: '/comment/imgUpload',
    //         method: 'post',
    //         data: query,
    //         headers: headers,
    //     })
    // },

    // //新增二维码评论
    // addComment: (query) => {
    //     return request({
    //         url: '/comment/addComment',
    //         method: 'post',
    //         data: query
    //     })
    // },

    // //根据二维码评论ID查询评论信息（包含视角）
    // getDeteilByCommentId: (query) => {
    //     return request({
    //         url: '/comment/getDeteilByCommentId',
    //         method: 'post',
    //         params: query
    //     })
    // },

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
};
export default API;