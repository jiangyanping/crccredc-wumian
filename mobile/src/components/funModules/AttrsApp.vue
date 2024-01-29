<template>
    <div id="attrs" v-show="attrsApp">
        <div class="popup-attrs-wrap" v-show="simpleAttrsShow">
            <div class="popup-attrs">
                <p class="left-attr-head">基本属性<span class="unfold-attrs" @click.prevent="unfoldAttrs()"></span></p>
                <div class="table-wrap">
                    <table>
                        <tbody>
                            <template v-if="hasData == false">
                                <td style="border:none;">没有属性数据</td>
                            </template>
                            <template v-else>
                                <template v-if="attrsApp.uid == ''">
                                    <td style="border:none;">请选择一个构件</td>
                                </template>
                                <template v-else>
                                    <tr v-for="(item,index) in simpleAttrs" :key="index">
                                        <td>{{item.name}}</td>
                                        <td>{{item.value}}</td>
                                    </tr>
                                </template>
                            </template>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="attrs-wrap" v-show="attrsShow">
            <div class="left-attrs">
                <p>构件属性<span class="fold-attrs" @click.prevent="foldAttrs()"></span></p>
                <div class="table-wrap">
                    <table>
                        <tbody>
                            <template v-if="hasData == false">
                                <td style="border:none;">没有属性数据</td>
                            </template>
                            <template v-else>
                                <template v-if="attrsApp.uid == ''">
                                    <td style="border:none;">请选择一个构件</td>
                                </template>
                                <template v-else>
                                    <tr v-for="(item,index) in allAttrs" :key="index">
                                        <template v-if="item.name == '分组名称'">
                                            <td class="left-attr-head" colspan="2">{{item.value}}</td>
                                        </template>
                                        <template v-else>
                                            <td>{{item.name}}</td>
                                            <td>{{item.value}}</td>
                                        </template>
                                    </tr>
                                </template>
                            </template>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
    .attrs-wrap {
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.6);
        position: absolute;
        left: 0;
        top: 0;
        overflow-y: auto !important;
        z-index: 100000;
    }

    .left-attrs {
        width: 100%;
        height: 100%;
        overflow-x: hidden;
        overflow-y: auto;

    }

    .left-attrs p {
        font-size: 0.32rem;
        color: #fff;
        line-height: .9rem;
        height: 1rem;
        margin: 0 0 0 .34rem;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;

    }

    .left-attrs p span {
        display: inline-block;
        width: 0.5rem;
        height: 0.5rem;
        background: url('../../assets/img/fold.png') no-repeat center;
        background-size: 0.5rem 0.5rem;
        margin: 0.1rem 0.34rem 0.1rem 0.3rem;
        vertical-align: middle;
        position: absolute;
        right: 0;
        top: .15rem;
    }

    .left-attrs .table-wrap {
        height: calc(100% - 1rem);
        overflow: auto;
        margin-top: 1rem;
    }

    .left-attrs table {
        width: 100%;
        border-collapse: collapse;
    }

    .left-attrs table td {
        border: 1px solid #F5F5F5;
        line-height: 0.6rem;
        min-height: 0.6rem;
        padding: 0 0.1rem;
        box-sizing: border-box;
        text-align: center;
        font-size: 0.28rem;
        color: #fff;
    }

    .left-attr-head,
    .right-attr-head {
        background: rgba(222, 219, 219, 0.5);
    }

    /*简要信息弹出层-开始*/
    .popup-attrs-wrap {
        background-color: rgba(0, 0, 0, 0.6);
        position: absolute;
        left: 0;
        top: 0;
        overflow-y: auto !important;
        z-index: 10000;
        max-width: 5rem;
    }

    @media screen and (orientation:landscape) {
        .popup-attrs-wrap {
            background-color: rgba(0, 0, 0, 0.6);
            position: absolute;
            left: 2.4rem;
            top: 0;
            overflow-y: auto !important;
            z-index: 10000;
        }
    }

    .popup-attrs {
        width: 100%;
        height: 100%;
        overflow-x: hidden;
        overflow-y: auto;

    }

    .popup-attrs p {
        border: 1px solid #F5F5F5;
        border-bottom: none;
        min-height: 0.6rem;
        padding: 0.1rem 0.1rem;
        box-sizing: border-box;
        text-align: center;
        font-size: 0.28rem;
        color: #fff;
        margin: 0;

    }

    .popup-attrs span.unfold-attrs {
        display: inline-block;
        width: 0.4rem;
        height: 0.4rem;
        background: url('../../assets/img/unfold.png') no-repeat center;
        background-size: 0.4rem 0.4rem;
        float: right;
        vertical-align: middle;
    }

    .popup-attrs .table-wrap {
        overflow: auto;
    }

    .popup-attrs table {
        width: 100%;
        border-collapse: collapse;
    }

    .popup-attrs table td {
        border: 1px solid #F5F5F5;
        min-height: 0.6rem;
        padding: 0.1rem 0.1rem;
        box-sizing: border-box;
        text-align: center;
        font-size: 0.28rem;
        color: #fff;
    }

    .popup-attrs table tr td:first-child {
        min-width: 1.4rem;
    }

    /* 简要信息弹出层-结束 */
</style>
<script>
    import API from "../../request/api";
    export default {
        name: 'AttrsApp',
        props: ['attrsApp'],
        data: function() {
            return {
                simpleAttrs: [],
                allAttrs: [],
                simpleAttrsShow: false,
                attrsShow: false,
                hasData: true,
                briefParamsByUid: [],
            };
        },
        watch: {
            attrsApp: {
                immediate: true,
                handler(newValue) {
                    if (newValue.show) {
                        this.simpleAttrsShow = newValue.show;
                        if (newValue.uid != '') {
                            this.getBriefParameterByUid();
                        }
                    } else {
                        this.simpleAttrsShow = newValue.show;
                        this.attrsShow = newValue.show;
                    }
                },
                deep: true
            },
        },
        computed: {},
        methods: {
            //将返回数据根据group进行分组
            attrsDataDeal: function(d) {
                let listArr = [];
                d.forEach(function(el) {
                    for (let i = 0; i < listArr.length; i++) {
                        // 对比相同的字段key，相同放入对应的数组
                        if (listArr[i].Group == el.Group) {
                            listArr[i].listInfo.push(el);
                            return;
                        }
                    }
                    // 第一次对比没有参照，放入参照
                    listArr.push({
                        Group: el.Group,
                        listInfo: [el]
                    });
                });
                return listArr;
            },
            getLeftPAttrsApp: function() {
                let vm = this;
                let params = {
                    fid: vm.attrsApp.fid,
                    ver: 1,
                    uid: vm.attrsApp.uid,
                };
                API.getGoujianParameter(params).then(res => {
                    if (Number(res.data.code) === 0) {
                        vm.hasData = true;
                        vm.simpleAttrs = [];
                        vm.allAttrs = [];
                        let result, size = false,
                            level = false,
                            offset = false;
                        if (typeof res.data.data === 'string' && res.data.data.constructor == String) {
                            result = JSON.parse(res.data.data);
                        }
                        let briefGoujianParams = [];
                        let leftlistArr = vm.attrsDataDeal(result.Parameters);
                        if (vm.briefParamsByUid.length > 0) {
                            let getGoujianParameter = result.Parameters;
                            for (let i = 0; i < getGoujianParameter.length; i++) {
                                for (let j = 0; j < vm.briefParamsByUid.length; j++) {
                                    if (getGoujianParameter[i].Name == vm.briefParamsByUid[j].name && getGoujianParameter[i].Group == vm.briefParamsByUid[j].group) {
                                        briefGoujianParams.push(getGoujianParameter[i]);
                                    }
                                }
                            }
                            for (let k of leftlistArr) {
                                vm.allAttrs.push({ "name": "分组名称", "value": k.Group });
                                for (let item of k.listInfo) {
                                    if (item.type == 3) vm.allAttrs.push({ "name": item.Name, "value": item.Value });
                                    else vm.allAttrs.push({ "name": item.Name, "value": item.ValueString });
                                }
                            }
                        } else {
                            if (result.ElementName) vm.simpleAttrs.push({ "name": "名称", "value": result.ElementName })
                            else vm.simpleAttrs.push({ "name": "名称", "value": "无" });
                            if (result.ElementId) vm.simpleAttrs.push({ "name": "ID", "value": result.ElementId })
                            else vm.simpleAttrs.push({ "name": "ID", "value": "无" });
                            for (let h of leftlistArr) {
                                vm.allAttrs.push({ "name": "分组名称", "value": h.Group });
                                for (let item of h.listInfo) {
                                    let li;
                                    if (item.type == 3) li = { "name": item.Name, "value": item.Value };
                                    else li = { "name": item.Name, "value": item.ValueString };
                                    vm.allAttrs.push(li);
                                    if (item.Name == "尺寸" || item.Name == "参照标高" || item.Name == "偏移") vm.simpleAttrs.push(li);
                                }
                            }
                            for (let k of vm.simpleAttrs) {
                                if (k.name == "尺寸") size = true;
                                if (k.name == "参照标高") level = true;
                                if (k.name == "偏移") offset = true;
                            }
                            if (!size) vm.simpleAttrs.push({ "name": "尺寸", "value": "无" });
                            if (!level) vm.simpleAttrs.push({ "name": "参照标高", "value": "无" });
                            if (!offset) vm.simpleAttrs.push({ "name": "偏移", "value": "无" });
                        }
                        let PDBId = result.PDBId;
                        params.uid = PDBId;
                        API.getGoujianTypeParameter(params).then(res => {
                            if (Number(res.data.code) === 0) {
                                let result;
                                if (typeof res.data.data === 'string' && res.data.data.constructor == String) {
                                    result = JSON.parse(res.data.data);
                                }
                                let rightlistArr = vm.attrsDataDeal(result.Parameters);
                                if (vm.briefParamsByUid.length > 0) {
                                    let getGoujianParameter = result.Parameters;
                                    for (let i = 0; i < getGoujianParameter.length; i++) {
                                        for (let j = 0; j < vm.briefParamsByUid.length; j++) {
                                            if (getGoujianParameter[i].Name == vm.briefParamsByUid[j].name && getGoujianParameter[i].Group == vm.briefParamsByUid[j].group) {
                                                briefGoujianParams.push(getGoujianParameter[i]);
                                            }
                                        }
                                    }
                                    for (let j = 0; j < briefGoujianParams.length; j++) {
                                        if (briefGoujianParams[j].type == 3) {
                                            vm.simpleAttrs.push({ "name": briefGoujianParams[j].Name, "value": briefGoujianParams[j].Value });
                                        } else {
                                            vm.simpleAttrs.push({ "name": briefGoujianParams[j].Name, "value": briefGoujianParams[j].ValueString });
                                        }
                                    }
                                }
                                for (let k of rightlistArr) {
                                    vm.allAttrs.push({ "name": "分组名称", "value": k.Group });
                                    for (let item of k.listInfo) {
                                        if (item.type == 3) vm.allAttrs.push({ "name": item.Name, "value": item.Value })
                                        else vm.allAttrs.push({ "name": item.Name, "value": item.ValueString });
                                    }

                                }
                            }
                        });

                    } else if (Number(res.data.code) === -1) {
                        vm.hasData = false;
                    }
                })
            },
            getBriefParameterByUid: function() {
                let vm = this;
                let params = {
                    uid: vm.attrsApp.uid,
                };
                vm.briefParamsByUid = [];
                API.getBriefParameterByUid(params).then(res => {
                    if (Number(res.data.code) === 0 && res.data.data) {
                        vm.briefParamsByUid = res.data.data.briefParameterChilds;
                    }
                    vm.getLeftPAttrsApp();
                });
            },
            unfoldAttrs: function() {
                this.simpleAttrsShow = false;
                this.attrsShow = true;
            },
            foldAttrs: function() {
                this.simpleAttrsShow = true;
                this.attrsShow = false;
            }
        },
    };
</script>