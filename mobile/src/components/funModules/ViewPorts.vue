<!-- 模型视口列表 -->
<template>
    <div v-show="viewports.show">
        <div class="popup-viewports-wrap">
            <div class="popup-viewports">
                <p class="popup-viewports-head">视点列表
                </p>
                <div class="table-wrap">
                    <table>
                        <tbody>
                            <template v-if="viewportsList.length == 0">
                                <td style="border:none;">无</td>
                            </template>
                            <template >
                                <tr v-for="(item,index) in viewportsList" :key="index" v-bind:class='{measureGroLibg:index==viewports.isactive}' @click="showViewports(item.viewportsInfo,index)">
                                    <td>{{item.name}}</td>
                                </tr>
                            </template>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'ViewPorts',
        props: ['viewports'],
        data: function() {
            return {
                viewportsList:[

                ],
            };
        },
        watch: {
            // viewports: {
            //     immediate: true,
            //     handler() {
            //         if (this.viewportsList && typeof this.viewportsList === 'string') {
            //             this.viewportsList = JSON.parse(this.viewportsList);
            //         }
            //     },
            //     deep: true
            // },
        },
        computed: {},
        methods: {
            showViewports: function(viewports, index) {
                this.viewports.isactive = index;
                viewports = JSON.parse(viewports);
                //显示视口
            },
        },
    };
</script>

<style scoped>
    .popup-viewports-head {
        background: rgba(222, 219, 219, 0.5);
    }

    .popup-viewports-wrap {
        background-color: rgba(0, 0, 0, 0.6);
        position: absolute;
        left: 0;
        top: 0;
        overflow-y: auto !important;
        z-index: 10000;
        max-width: 5rem;
    }

    @media screen and (orientation:landscape) {
        .popup-viewports-wrap {
            background-color: rgba(0, 0, 0, 0.6);
            position: absolute;
            left: 2.4rem;
            top: 0;
            overflow-y: auto !important;
            z-index: 10000;
        }
    }

    .popup-viewports {
        width: 100%;
        height: 100%;
        overflow-x: hidden;
        overflow-y: auto;

    }

    .popup-viewports p {
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

    .popup-viewports .table-wrap {
        max-height: 3rem;
        overflow: auto;
    }

    .popup-viewports table {
        width: 100%;
        border-collapse: collapse;
    }

    .popup-viewports table td {
        border: 1px solid #F5F5F5;
        min-height: 0.6rem;
        padding: 0.1rem 0.1rem;
        box-sizing: border-box;
        text-align: center;
        font-size: 0.28rem;
        color: #fff;
    }

    .popup-viewports table tr td:first-child {
        min-width: 1.4rem;
    }

    .measureGroLibg {
        background: rgba(222, 219, 219, 0.5);
    }
</style>