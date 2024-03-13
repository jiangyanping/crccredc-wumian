<template>
    <div v-show="measureGro.show">
        <div class="popup-measure-wrap">
            <div class="popup-measure">
                <p class="popup-measure-head">分组名称
                </p>
                <div class="table-wrap">
                    <table>
                        <tbody>
                            <template v-if="hasMeasureGro == false">
                                <td style="border:none;">无</td>
                            </template>
                            <template v-else>
                                <tr v-for="(item, index) in measureGro.measureGroInfoList" :key="index"
                                    v-bind:class='{ measureGroLibg: index == measureGro.isactive }'
                                    @click="showMeasureGro(item.measureInfo, index)">
                                    <td>{{ item.name }}</td>
                                </tr>
                            </template>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.popup-measure-head {
    background: rgba(222, 219, 219, 0.5);
}

.popup-measure-wrap {
    background-color: rgba(0, 0, 0, 0.6);
    position: absolute;
    left: 0;
    top: 0;
    overflow-y: auto !important;
    z-index: 10000;
    max-width: 5rem;
}

@media screen and (orientation:landscape) {
    .popup-measure-wrap {
        background-color: rgba(0, 0, 0, 0.6);
        position: absolute;
        left: 2.4rem;
        top: 0;
        overflow-y: auto !important;
        z-index: 10000;
    }
}

.popup-measure {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;

}

.popup-measure p {
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

.popup-measure .table-wrap {
    max-height: 3rem;
    overflow: auto;
}

.popup-measure table {
    width: 100%;
    border-collapse: collapse;
}

.popup-measure table td {
    border: 1px solid #F5F5F5;
    min-height: 0.6rem;
    padding: 0.1rem 0.1rem;
    box-sizing: border-box;
    text-align: center;
    font-size: 0.28rem;
    color: #fff;
}

.popup-measure table tr td:first-child {
    min-width: 1.4rem;
}

.measureGroLibg {
    background: rgba(222, 219, 219, 0.5);
}
</style>
<script>
import measureGroInfoData from "../data/measureGroInfoData"

export default {
    name: 'MeasureGro',
    props: ['measureGro'],
    data: function () {
        return {
            hasMeasureGro: true,
            measureGroInfoData,
        };
    },
    watch: {
        measureGro: {
            immediate: true,
            handler() {
                if (this.measureGro.measureGroInfoList && typeof this.measureGro.measureGroInfoList === 'string') {
                    this.measureGro.measureGroInfoList = JSON.parse(this.measureGro.measureGroInfoList);
                    for (var i = 0; i < this.measureGro.measureGroInfoList.length; i++) {
                        this.measureGro.measureGroInfoList[i].measureInfo = JSON.parse(this.measureGro.measureGroInfoList[i].measureInfo);
                    }
                }
            },
            deep: true
        },
        measureGroInfoData:{
            immediate: true,
            handler() {
                console.log(measureGroInfoData);
            },
            deep: true
        }
    },
    computed: {},
    methods: {
        showMeasureGro: function (measureInfo, index) {
            this.measureGro.isactive = index;
            let dimensionBusiness = new window.Web3D.DimensionBusiness(window.viewer);
            dimensionBusiness.cancelOperation();
            dimensionBusiness.drawLines(measureInfo);
        },
    },
};
</script>