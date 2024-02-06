<!-- 管控页 -->
<template>
    <div class="control">
        <div class="drawing-wrap">
            <div class="drawing">
                <img src="../assets/img/controlDrawing.png" alt="">
                <span class="mask" :class="'mask' + (index + 1)" v-for="(item, index) in drawingPoint.points" :key="item.id"
                    @click.prevent="handleModelPano(item.panoMark)">{{ item.name }}</span>
            </div>
            <v-row class="text-center mt-3 mb-3" justify="center">
                <v-col cols="12" md="3" style="padding:16px;">
                    <v-btn block large class="pa-2 primary text-no-wrap rounded-pill j-look-model" @click="handleLookModel">查看模型</v-btn>
                </v-col>
            </v-row>
            <v-row class="text-center mx-5 j-control-legend" justify="center">
                <div class="j-legend"><span class="bg-color-red"></span>必查点未检查</div>
                <div class="j-legend"><span class="bg-color-grey"></span>非必查点未检查</div>
                <div class="j-legend"><span class="bg-color-orange"></span>未整改</div>
                <div class="j-legend"><span class="bg-color-green"></span>已整改</div>
            </v-row>
            <div class="j-control">
                <v-card class="mx-auto ma-3 mlr4 j-control-card" max-width="374"
                    v-for="(item, index) in control.controlPoints" :key="index">
                    <v-card-text>
                        <v-row>
                            <v-btn class="j-control-node-btn bg-color-red" depressed
                                v-if="item.mustBeChecked && (item.commentNumTotal == 0)"
                                @click="handleGoResource(item.controlPointSort)">{{
                                    item.controlPoint }}</v-btn>
                            <v-btn class="j-control-node-btn bg-color-grey" depressed
                                v-if="!item.mustBeChecked && (item.commentNumTotal == 0)"
                                @click="handleGoResource(item.controlPointSort)">{{
                                    item.controlPoint }}</v-btn>
                            <v-btn class="j-control-node-btn bg-color-green" depressed
                                v-if="item.commentNumTotal != 0 && item.commentNumUnconfirmed == 0"
                                @click="handleGoResource(item.controlPointSort)">{{
                                    item.controlPoint }}</v-btn>
                            <v-btn class="j-control-node-btn bg-color-orange" depressed
                                v-if="item.commentNumUnconfirmed != 0" @click="handleGoResource(item.controlPointSort)">{{
                                    item.controlPoint }}</v-btn>
                            <div class="j-control-info">
                                <span class="">共{{ item.commentNumTotal }}条</span>
                                <span class="">待整改{{ item.commentNumUnconfirmed }}条</span>
                            </div>
                            <v-btn class="j-control-problem-btn pa-2 mt-1" outlined color="teal"
                                @click.prevent="getWeixinKey(`/comment/${controlSort}/${item.controlPointSort}`)">问题记录</v-btn>
                        </v-row>
                    </v-card-text>
                </v-card>
                <!-- <v-card class="mx-auto ma-3 mlr4 j-control-card" max-width="374">
                    <v-card-text>
                        <v-row>
                            <v-btn class="j-control-node-btn bg-color-green" depressed><router-link to="/control"> 01
                                    平屋面通用做法</router-link></v-btn>
                            <div class="j-control-info">
                                <span class="">共5条</span>
                                <span class="">待整改0条</span>
                            </div>
                            <v-btn class="j-control-problem-btn pa-2 mt-1" outlined color="teal"
                                @click.prevent="getWeixinKey(`/comment/${controlSort}/01`)">问题记录</v-btn>
                        </v-row>
                    </v-card-text>
                </v-card> -->
            </div>
        </div>
        <div class="j-realName" v-show="popupRealName">
            <div class="mask-inpField" v-show="popupRealName" @click.prevent="popupRealName = !popupRealName"></div>
            <v-row justify="space-between" class="j-realName-inp mx-4">
                <v-col cols="12">
                    <v-form ref="form">
                        <v-text-field v-model="realNameObj.realName" label="真实姓名：" required></v-text-field>
                        <v-btn class="j-realName-btn pa-2 mt-1" color="primary"
                            @click.prevent="handleAddRealName">确定</v-btn>
                    </v-form>
                </v-col>
            </v-row>
        </div>
        <div @click.stop="handleGoBack" class="goBack">
            <svg t="1704783045457" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1291" width="64" height="64"><path d="M708.42516 957.314205c-13.715373 0-27.426653-5.215792-37.895075-15.678074L277.717627 548.823674c-20.925588-20.893866-20.925588-54.821583 0-75.747171L670.530085 80.225159c20.931728-20.925588 54.821583-20.925588 75.752288 0 20.925588 20.893866 20.925588 54.821583 0 75.747171L391.359874 510.934738l354.922499 354.915335c20.925588 20.931728 20.925588 54.821583 0 75.753311C735.852836 952.098413 722.135416 957.314205 708.42516 957.314205L708.42516 957.314205zM708.42516 957.314205" fill="#ffffff" p-id="1292"></path></svg>
        </div>
    </div>
</template>
  
<script>
import API from "../request/api.js";
import controlPointsData from "../data/controlPointsData"
export default {
    name: 'Menu',
    data() {
        return {
            mark: '',
            controlPointsData,
            control: [],
            drawingPoints: [
                {
                    mark: 'constructural',  //结构层  目前四个步骤都使用这一组数据，14个点一样
                    points: [
                        {
                            id: '1',
                            name: '1',
                            panoMark: '1'
                        },
                        {
                            id: '2',
                            name: '2',
                            panoMark: '2'
                        },
                        {
                            id: '3',
                            name: '3',
                            panoMark: '3'
                        },
                        {
                            id: '4',
                            name: '4',
                            panoMark: '4'
                        },
                        {
                            id: '5',
                            name: '5',
                            panoMark: '5'
                        },
                        {
                            id: '6',
                            name: '6',
                            panoMark: '6'
                        },
                        {
                            id: '7',
                            name: '7',
                            panoMark: '7'
                        },
                        {
                            id: '8',
                            name: '8',
                            panoMark: '8'
                        },
                        {
                            id: '9',
                            name: '9',
                            panoMark: '9'
                        },
                        {
                            id: '10',
                            name: '10',
                            panoMark: '10'
                        },
                        {
                            id: '11',
                            name: '11',
                            panoMark: '11'
                        },
                        {
                            id: '12',
                            name: '12',
                            panoMark: '12'
                        },
                        {
                            id: '13',
                            name: '13',
                            panoMark: '13'
                        },
                        {
                            id: '14',
                            name: '14',
                            panoMark: '14'
                        }
                    ]
                },
                {
                    mark: 'conwaterproofbase',  //防水基层
                    points: [
                        {
                            id: '1',
                            name: '1',
                            panoMark: '1'
                        },
                        {
                            id: '2',
                            name: '2',
                            panoMark: '2'
                        },
                        {
                            id: '3',
                            name: '3',
                            panoMark: '3'
                        },
                        {
                            id: '4',
                            name: '4',
                            panoMark: '4'
                        }
                    ]
                },
                {
                    mark: 'conwaterproof',  //防水层
                    points: [
                        {
                            id: '1',
                            name: '1',
                            panoMark: '1'
                        },
                        {
                            id: '2',
                            name: '2',
                            panoMark: '2'
                        },
                        {
                            id: '3',
                            name: '3',
                            panoMark: '3'
                        },
                        {
                            id: '4',
                            name: '4',
                            panoMark: '4'
                        }
                    ]
                },
                {
                    mark: 'consurface',  //面层
                    points: [
                        {
                            id: '1',
                            name: '1',
                            panoMark: '1'
                        },
                        {
                            id: '2',
                            name: '2',
                            panoMark: '2'
                        },
                        {
                            id: '3',
                            name: '3',
                            panoMark: '3'
                        },
                        {
                            id: '4',
                            name: '4',
                            panoMark: '4'
                        }
                    ]
                }
            ],
            drawingPoint: {

            },

            proid: '08fa9423-a2d5-48a9-aa44-1d97f10e8ae9',
            controlSort: '',
            popupRealName: false,
            realNameObj: {
                key: '',
                openId: '',
                realName: '',
            },

            dealCommentsData: [],  //后台请求回的评论数据，经过处理的
        }
    },
    mounted() {

        this.controlSort = this.$route.params.controlSort;
        this.handleQueryComs();  //查询评论，处理，获取评论数量信息
        if(this.controlSort == 'constructural') document.title = '结构层检查';
        if(this.controlSort == 'conwaterproofbase') document.title = '防水基层检查';
        if(this.controlSort == 'conwaterproof') document.title = '防水层检查';
        if(this.controlSort == 'consurface') document.title = '面层检查';


        // for (const point of this.drawingPoints) {
        //     if (point.mark == this.mark) {
        //         this.drawingPoint = point;
        //     }
        // }
        this.drawingPoint = this.drawingPoints[0];
        //this.getWeixinKey();

        this.handleKey();
    },
    methods: {
        handleKey() {
            let key = '';
            let urlHasKey = location.href.indexOf('key') > -1 && location.href.length > 1 ? location.href.split("key")[1] : "";
            if (urlHasKey) {
                key = urlHasKey.split("#")[0].slice(1);
                localStorage.setItem('weixinkey', key);
                window.location.href = location.href.split("?")[0];  //微信登录回来，地址中key，要存储key并且改变地址，去掉key
            }
            return key;
        },
        /**
         * getWeixinKey  获取微信登录的可以值，一句key获取用户信息
         */
        getWeixinKey(route) {
            let key = '';
            if (localStorage.getItem('weixinkey')) {
                key = localStorage.getItem('weixinkey');
            } else {
                key = this.handleKey();
            }
            this.weixinislogin(key, route);
        },
        /**
         * 微信是否登录
         */
        weixinislogin(key, route) {
            API.weixinislogin({ key: key }).then(res => {
                console.log(res.data);
                if (res.data.code == 0 && !res.data.data.openId && !res.data.data.userName) {
                    //线下
                    //let url = API.baseURL + '/weixinlogin?key=' + res.data.data.key + '&router=' + window.location.href.split("#")[1];
                    //线上
                    let url = API.baseURL + '/weixinlogin?key=' + res.data.data.key + '&router=' + '/01_huacao/1/index.html@'  + window.location.href.split("#")[1];
                    window.location.href = url;
                } else {
                    //已登录
                    if (!res.data.data.realName) {
                        //判断是否有realName：真实姓名，没有，让填写
                        this.popupRealName = !this.popupRealName;
                        this.realNameObj.key = res.data.data.key;
                        this.realNameObj.openId = res.data.data.openId;
                    } else {
                        this.$router.push(route);
                    }
                }
            });
        },
        /**
         * 增加真是姓名，用于评论显示人称
         */
        handleAddRealName() {
            //判断是否有realName：真实姓名，没有，让填写
            API.addRealName({ key: this.realNameObj.key, openId: this.realNameObj.openId, realName: this.realNameObj.realName }).then(res => {
                if (res.data.code == 0 && res.data.msg.indexOf('成功') > -1) {
                    Object.assign(this.$data, this.$options.data().realNameObj);
                    this.popupRealName = !this.popupRealName;
                    alert("保存成功");
                }
            });
        },

        /**
         * 查看模型
         */
        handleLookModel() {
            this.$router.push('/Engine/contr/' + this.$route.params.controlSort);
        },

        /**
         * 加载除模型以外的其他资源
         */
        handleGoResource(controlPointSort) {
            this.$router.push('/resource/' + this.$route.params.controlSort + '/' + controlPointSort);
        },

        /**
         * 返回
         */
        handleGoBack: function () {
            this.$router.push('/Home');
        },

        /**
         * 查询评论
         */
        handleQueryComs() {
            let vm = this;
            vm.commentsData = [];
            //API.getComments({ proid: this.comParams.proid, key: this.comParams.key }).then(res => {
            API.getComments({ proid: this.proid }).then(res => {
                
                if (Number(res.data.code) === 0) {
                    this.attrsDataDeal(res.data.data);
                    for (let item of vm.controlPointsData) {
                        for (let it of vm.dealCommentsData) {
                            if (item.controlSort == it.controlSort) {
                                item.controlComNumTotal = it.controlComNumTotal;
                                item.controlComNumUnconfirmed = it.controlComNumUnconfirmed;
                                for (let objA of item.controlPoints) {
                                    objA.commentNumTotal = 0;
                                    objA.commentNumUnconfirmed = 0;
                                    for (let objB of it.controlPointSortArr) {
                                        if (objA.controlPointSort == objB.controlPointSort) {
                                            objA.commentNumTotal = objB.commentNumTotal;
                                            objA.commentNumUnconfirmed = objB.commentNumUnconfirmed;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    for (let item of vm.controlPointsData) {
                        if (vm.controlSort == item.controlSort) {
                            vm.control = item;   //获取评论数量的管控点
                        }
                    }
                }
            });

        },

        //处理评论数据,将返回数据根据某个属性进行分组
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
                el.createat = el.createat.slice(0, 16);
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
        },
    }
}
</script>
  
<style scoped>
.control {
    height: 100%;
    color: #fff;
    overflow-y: scroll;
}

.drawing {
    position: relative;
}

.drawing img {
    width: 100%;
}

.drawing .mask {
    display: inline-block;
    width: 18px;
    height: 18px;
    line-height: 18px;
    font-size: 14px;
    color: red;
    border-radius: 50%;
    border: 1px solid red;
    position: absolute;
}

@media all and (orientation :landscape) {

    /* 横屏 */
    .drawing .mask1 {
        top: 40%;
        left: 31.5%;
    }

    .drawing .mask2 {
        top: 40%;
        left: 66.3%;
    }

    .drawing .mask3 {
        top: 60.8%;
        left: 53.7%;
    }

    .drawing .mask4 {
        top: 60.8%;
        left: 81.5%;
    }
}

@media all and (orientation :portrait) {

    /* 竖屏 */
    .drawing .mask1 {
        top: 67%;
        left: 63%;
    }

    .drawing .mask2 {
        top: 65%;
        left: 88%;
    }

    .drawing .mask3 {
        top: 53%;
        left: 87%;
    }

    .drawing .mask4 {
        top: 37%;
        left: 74%;
    }

    .drawing .mask5 {
        top: 37%;
        left: 79.1%;
    }

    .drawing .mask6 {
        top: 48%;
        left: 62%;
    }

    .drawing .mask7 {
        top: 67%;
        left: 81%;
    }

    .drawing .mask8 {
        top: 34%;
        left: 45%;
    }

    .drawing .mask9 {
        top: 32%;
        left: 49%;
    }

    .drawing .mask10 {
        top: 20%;
        left: 60%;
    }

    .drawing .mask11 {
        top: 60%;
        left: 48%;
    }

    .drawing .mask12 {
        top: 26%;
        left: 65%;
    }

    .drawing .mask13 {
        top: 47%;
        left: 45%;
    }

    .drawing .mask14 {
        top: 51%;
        left: 75%;
    }
}

.row {
    margin: 0;
}

.v-btn.v-size--large {
    font-size: 0.28rem;
}

.v-btn--is-elevated {
    box-shadow: 0px 3px 1px -2px rgba(255, 255, 255, 0.2), 0px 2px 2px 0px rgba(255, 255, 255, 0.14), 0px 1px 5px 0px rgba(255, 255, 255, 0.12);
}

.v-card__title {
    font-size: .28rem;
    line-height: .4rem;
    text-align: center;
    display: block;

}

.mlr4 {
    margin-left: 16px !important;
    margin-right: 16px !important;
}

.v-btn.v-size--default {
    font-size: .28rem;
}

.j-control {
    margin-bottom: 50px;
    margin-top: 20px;
}

.j-control-card {
    max-width: none !important;
}

.j-control-card .v-card__text {
    padding: 0;
    line-height: 0;
}

.j-control-card .j-control-node-btn {
    font-size: .24rem;
    width: 40%;
    justify-content: flex-start;
    box-shadow: 3px 0px 3px #999;
    margin-right: 4px;
    height: 0.88rem !important;
    padding: 0 10px;
    COLOR: #FFF;
}

.j-control-card .j-control-problem-btn {
    font-size: .24rem;
    height: 0.7rem;
    line-height: 0.7rem;
    margin-right: 8px;
}

.v-application .j-control-problem-btn a {
    color: #009688 !important;
}

.v-application .j-control-card a {
    color: #fff;
}

.j-control-info {
    display: flex;
    justify-content: space-around;
    flex: 1;
}

.j-control-info span {
    font-size: .26rem;
    display: inline-block;
    line-height: 0.88rem;
    padding: 0 0.04rem;
}

.j-control-legend {
    display: flex;
    justify-content: space-around !important;
    flex: 1;
}

.j-legend {
    font-size: .25rem;
}

.j-legend span {
    display: inline-block;
    width: .26rem;
    height: .26rem;
    margin-right: 2px;
    /* border:1px solid #fff; */
    margin-top: -3px;
    vertical-align: middle;
}

.mask-inpField {
    background: rgba(0, 0, 0, 0.5);
}

.j-realName .j-realName-inp {
    position: absolute;
    top: 40%;
    width: calc(100% - 32px);
    background-color: #fff;
    z-index: 10004;
    box-sizing: border-box;
    border-radius: 8px;
}
.j-look-model{
    width:100%;
    height: 0.88rem;
}
</style>
  