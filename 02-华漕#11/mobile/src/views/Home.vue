<template>
    <div class="home">
        <div class="home-top-img">
            <img src="../assets/img/home.png" />
        </div>
        <div class="line"></div>
        <v-row class="text-center my-3" justify="center">
            <v-col cols="12" style="padding:16px;">
                <v-btn block large class="pa-2 primary text-no-wrap rounded-pill j-look-model"
                    @click="handleLookModel">查看模型</v-btn>
            </v-col>
        </v-row>
        <v-card class="mx-auto mlr4 j-look-drawing" max-width="374">
            <v-card-title>查看图纸</v-card-title>
            <v-card-text>
                <v-btn class="ma-2" small outlined fab color="teal"><router-link
                        to="/resource/ho/jian">建</router-link></v-btn>
                <v-btn class="ma-2" small outlined fab color="teal"><router-link
                        to="/resource/ho/jie">结</router-link></v-btn>
                <v-btn class="ma-2" small outlined fab color="teal"><router-link
                        to="/resource/ho/shui">水</router-link></v-btn>
                <v-btn class="ma-2" small outlined fab color="teal"><router-link
                        to="/resource/ho/nuan">暖</router-link></v-btn>
                <v-btn class="ma-2" small outlined fab color="teal"><router-link
                        to="/resource/ho/dian">电</router-link></v-btn>
                <v-btn class="ma-2" small outlined fab color="teal"><router-link
                        to="/resource/ho/qita">其他</router-link></v-btn>
            </v-card-text>
        </v-card>
        <div class="j-control">
            <v-card class="mx-auto ma-3 mlr4 j-control-card" max-width="374" v-for="(item, index) in control" :key="index">
                <v-card-text>
                    <v-row>
                        <v-btn class="j-control-node-btn" depressed :color=item.color><router-link
                                :to="'/control/' + item.controlSort">{{ item.controlName }}检查</router-link>></v-btn>
                        <div class="j-control-info">
                            <span class="" :class="(item.controlComNumTotal != 0) ? 'color-grey' : 'color-red'"
                                v-if="item.controlComNumTotal != 0">已检查</span>
                            <span class="" :class="(item.controlComNumTotal == 0) ? 'color-red' : 'color-grey'"
                                v-if="item.controlComNumTotal == 0">未检查</span>
                            <span class="" :class="(item.controlComNumTotal == 0) ? 'color-red' : 'color-grey'">共{{
                                item.controlComNumTotal }}条</span>
                            <span class="" v-if="item.controlComNumTotal != 0"
                                :class="(item.controlComNumUnconfirmed == 0) ? 'color-grey' : 'color-red'">待整改{{
                                    item.controlComNumUnconfirmed }}条</span>
                            <span class="" v-if="item.controlComNumTotal == 0"
                                :class="(item.controlComNumUnconfirmed == 0) ? 'color-red' : 'color-grey'">待整改{{
                                    item.controlComNumUnconfirmed }}条</span>
                        </div>
                        <v-btn class="j-control-problem-btn pa-2 mt-1" outlined color="teal">
                            <router-link :to="'/comment/' + item.controlSort + '/00'">问题清单</router-link>
                        </v-btn>
                        <!-- <v-btn class="j-control-problem-btn pa-2 mt-1" outlined color="teal">
                            <router-link :to="'/comment/' + item.controlSort + '/00'">审批验收</router-link>
                        </v-btn> -->
                    </v-row>
                </v-card-text>
            </v-card>
        </div>
        <v-row class="text-center my-3 mb-12" justify="center">
            <v-col cols="12" style="padding:16px;">
                <v-btn block large class="pa-2 primary text-no-wrap rounded-pill j-export-comments">
                    <router-link :to="'/exportComments'">导出评论</router-link>
                </v-btn>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import API from "../request/api.js";
import weixinLogin from "../assets/js/weixinLogin.js";
export default {
    name: 'Home',
    components: {

    },
    data: function () {
        return {
            proid: '05fa9423-a2d5-48a9-aa44-1d97f10e8af5',
            dealCommentsData: [],  //后台请求回的评论数据，经过处理的
            control: [
                {
                    controlName: '结构层',
                    controlSort: 'constructural',
                    controlComNumTotal: 0,
                    controlComNumUnconfirmed: 0,
                    color: '#134be0',
                },
                {
                    controlName: '防水基层',
                    controlSort: 'conwaterproofbase',
                    controlComNumTotal: 0,
                    controlComNumUnconfirmed: 0,
                    color: '#185ceb',
                },
                {
                    controlName: '防水层',
                    controlSort: 'conwaterproof',
                    controlComNumTotal: 0,
                    controlComNumUnconfirmed: 0,
                    color: '#1e6fff',
                },
                {
                    controlName: '面层',
                    controlSort: 'consurface',
                    controlComNumTotal: 0,
                    controlComNumUnconfirmed: 0,
                    color: '#5d98ff',
                },
                {
                    controlName: '交付层',
                    controlSort: 'deliver',
                    controlComNumTotal: 0,
                    controlComNumUnconfirmed: 0,
                    color: '#98beff',
                }
            ]
        };
    },
    mounted: function () {
        this.weixinIsLogin();
        document.title = API.docTitle;
    },
    methods: {
        /**
         * 微信是否登录
         */
        async weixinIsLogin() {
            let res = await weixinLogin.getWeixinKey();
            if (res && res.realName) {
                this.handleQueryComs();  //查询评论，处理，获取评论数量信息
            }
        },

        /**
         * 查看模型
         */
        handleLookModel() {
            this.$router.push('/Engine/ho/00');
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
                    for (let item of vm.control) {
                        for (let it of vm.dealCommentsData) {
                            if (item.controlSort == it.controlSort) {
                                item.controlComNumTotal = it.controlComNumTotal;
                                item.controlComNumUnconfirmed = it.controlComNumUnconfirmed;
                            }
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
            //         'controlName':'结构层',
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
                    controlName: el.controlName,
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
    },

}
</script>

<style type="text/css" scoped>
@import '../assets/css/comment.css';

.row {
    margin: 0;
}

.home {
    height: 100%;
    color: #fff;
    overflow-y: scroll;
}

.home-top-img {
    height: 4rem;
    overflow: hidden;
    margin-bottom: 6px;
}

.home-top-img img {
    width: 100%;
    height: auto;
}

.line {
    height: 3px;
    border: 1px solid #797979;
    background-color: #fcf6f6;
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

.j-look-drawing {
    border-radius: 20px;
    margin-bottom: 30px;
    max-width: none !important;
}

.v-application .j-look-drawing a {
    color: #009688 !important;
}

.j-look-drawing .v-btn.v-size--small {
    font-size: .28rem;
}

.j-look-drawing .v-btn--fab.v-size--small {
    height: 0.8rem;
    width: 0.8rem;
    vertical-align: top;
}

.j-look-drawing .v-card__text {
    padding: 0 12px 6px;
    display: flex;
    justify-content: space-around;
    flex: 1;
}

.j-control {}

.j-control-card {
    max-width: none !important;
}

.j-control-card .v-card__text {
    padding: 0;
    line-height: 0;
}

.j-control-card .j-control-node-btn {
    font-size: .24rem;
    width: 30%;
    justify-content: flex-start;
    box-shadow: 3px 0px 3px #999;
    margin-right: 4px;
    height: 0.88rem !important;
    padding: 0 10px;
    color: #fff;
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

.j-look-model {
    width: 100%;
    height: 0.88rem !important;
}

.j-export-comments {
    width: 100%;
    height: 0.88rem !important;
}

.v-application .j-export-comments a{
    color:#fff;
    width:100%;
}
</style>

