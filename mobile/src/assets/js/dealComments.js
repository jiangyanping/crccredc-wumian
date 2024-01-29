// let dealCommentsData = [
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
let DealComments = {

    //处理数据,将返回数据根据某个属性进行分组
    attrsDataDeal: function (d, comParams, commentsData, dealCommentsData) {
        d.forEach(function (el) {
            el.active = false;
            el.createat = el.createat.slice(0, 16);
            for (let i = 0; i < dealCommentsData.length; i++) {
                // 对比相同的字段key，相同放入对应的数组
                if (dealCommentsData[i].controlSort == el.controlSort) {
                    let controlPointSortArr = dealCommentsData[i].controlPointSortArr;
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
            dealCommentsData.push({
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
        for (let n = 0; n < dealCommentsData.length; n++) {
            let controlPointSortArr = dealCommentsData[n].controlPointSortArr;
            dealCommentsData[n].controlComNumTotal = 0;
            dealCommentsData[n].controlComNumUnconfirmed = 0;
            for (let m = 0; m < controlPointSortArr.length; m++) {
                //统计该管控步骤节点下的的总共的问题数量和未整改确认的问题数量
                controlPointSortArr[m].controlPoint = controlPointSortArr[m].comments[0].controlPoint;
                controlPointSortArr[m].commentNumTotal = controlPointSortArr[m].comments.filter(item => item.pid == 0).length;
                controlPointSortArr[m].commentNumUnconfirmed = controlPointSortArr[m].comments.filter(item => item.comState == '待' && item.pid == 0).length;
                //统计该管控步骤下的总共的问题数量和未整改确认的问题数量
                dealCommentsData[n].controlComNumTotal += controlPointSortArr[m].commentNumTotal;
                dealCommentsData[n].controlComNumUnconfirmed += controlPointSortArr[m].commentNumUnconfirmed;
            }
        }
        for (let i = 0; i < dealCommentsData.length; i++) {
            if (dealCommentsData[i].controlSort == comParams.controlSort && comParams.controlPointSort == '00') {
                let controlPointSortArr = dealCommentsData[i].controlPointSortArr;
                for (let item of controlPointSortArr) {
                    commentsData.push(item);
                }
            } else if (dealCommentsData[i].controlSort == comParams.controlSort) {
                let controlPointSortArr = dealCommentsData[i].controlPointSortArr;
                for (let j = 0; j < controlPointSortArr.length; j++) {
                    if (controlPointSortArr[j].controlPointSort == comParams.controlPointSort) {
                        commentsData.push(controlPointSortArr[j]);
                    }
                }
            }
        }
    },
    //处理数据,将返回数据根据某个属性进行分组
    addDataDeal: function (d, comParams, commentsData, dealCommentsData) {
        commentsData = [];
        d.forEach(function (el) {
            el.active = false;
            el.createat = el.createat.slice(0, 16);
            for (let i = 0; i < dealCommentsData.length; i++) {
                // 对比相同的字段key，相同放入对应的数组
                if (dealCommentsData[i].controlSort == el.controlSort) {
                    let controlPointSortArr = dealCommentsData[i].controlPointSortArr;
                    const res = controlPointSortArr.find(item => item.controlPointSort === el.controlPointSort);
                    if (res) {
                        for (let j = 0; j < controlPointSortArr.length; j++) {
                            if (controlPointSortArr[j].controlPointSort == el.controlPointSort) {
                                if (el.pid != 0) {
                                    for (let item of controlPointSortArr[j].comments) {
                                        if (item.id == el.pid) {
                                            item.active = true;
                                        }
                                    }
                                    controlPointSortArr[j].comments.push(el);  //pid不为0，是一条子评论
                                    return;
                                } else {
                                    controlPointSortArr[j].comments.unshift(el);   //pid为0，新增一条评论加在现有评论数据的最前面，最先显示
                                    return;
                                }

                            }
                        }
                    } else {
                        controlPointSortArr.push(
                            {
                                controlPointSort: el.controlPointSort,
                                controlPoint: el.controlPoint,
                                comments: [
                                    el
                                ],
                            }
                        )
                        return;
                    }
                }
            }
            // 第一次对比没有参照，放入参照
            dealCommentsData.push({
                controlSort: el.controlSort,
                controlPointSortArr: [
                    {
                        controlPointSort: el.controlPointSort,
                        controlPoint: el.controlPoint,
                        comments: [
                            el
                        ],
                    }
                ]
            });
        });

        //处理数据，加评论总数和待整改的评论数量属性,总数取pid为0的
        for (let n = 0; n < dealCommentsData.length; n++) {
            let controlPointSortArr = dealCommentsData[n].controlPointSortArr;
            dealCommentsData[n].controlComNumTotal = 0;
            dealCommentsData[n].controlComNumUnconfirmed = 0;
            for (let m = 0; m < controlPointSortArr.length; m++) {
                //统计该管控步骤节点下的的总共的问题数量和未整改确认的问题数量
                controlPointSortArr[m].controlPoint = controlPointSortArr[m].comments[0].controlPoint;
                controlPointSortArr[m].commentNumTotal = controlPointSortArr[m].comments.filter(item => item.pid == 0).length;
                controlPointSortArr[m].commentNumUnconfirmed = controlPointSortArr[m].comments.filter(item => item.comState == '待' && item.pid == 0).length;
                //统计该管控步骤下的总共的问题数量和未整改确认的问题数量
                dealCommentsData[n].controlComNumTotal += controlPointSortArr[m].commentNumTotal;
                dealCommentsData[n].controlComNumUnconfirmed += controlPointSortArr[m].commentNumUnconfirmed;
            }
        }
        console.log(dealCommentsData);
        for (let i = 0; i < dealCommentsData.length; i++) {
            if (dealCommentsData[i].controlSort == comParams.controlSort && comParams.controlPointSort == '00') {
                let controlPointSortArr = dealCommentsData[i].controlPointSortArr;
                for (let item of controlPointSortArr) {
                    commentsData.push(item);
                }
                //commentsData = controlPointSortArr;
            } else if (dealCommentsData[i].controlSort == comParams.controlSort) {
                let controlPointSortArr = dealCommentsData[i].controlPointSortArr;
                for (let j = 0; j < controlPointSortArr.length; j++) {
                    if (controlPointSortArr[j].controlPointSort == comParams.controlPointSort) {
                        commentsData.push(controlPointSortArr[j]);
                        // commentsData = [controlPointSortArr[j]];
                    }
                }
            }
        }
    },
}

export default DealComments;