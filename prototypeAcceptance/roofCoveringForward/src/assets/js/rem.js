//自适配
import Bus from "./Bus";
export function remResize() {
    // console.log("是否进入")
    renderResize()
    window.addEventListener("resize", renderResize, false)
}

function renderResize() {
    var docEl = document.documentElement
    let clientWidth = document.documentElement.clientWidth
    let clientHeight = document.documentElement.clientHeight
    if (clientWidth > clientHeight) {
        //宽度大于高度  就是横屏
        //docEl.style.fontSize = (clientWidth / 20) + 'px';
        if (clientHeight < 750) {
            docEl.style.fontSize = 100 * (clientHeight / 750) + 'px';
        } else {
            docEl.style.fontSize = '100px';
        }
    } else if (clientWidth < clientHeight) {
        //docEl.style.fontSize = 100 * (clientWidth / 750) + 'px';
        //宽度小于高度  就是竖屏
        if (clientWidth < 750) {
            docEl.style.fontSize = 100 * (clientWidth / 750) + 'px';
        } else {
            docEl.style.fontSize = '100px';
        }
    }
    /*if (window.isIndex) {
        return
    } else {*/
    if (clientWidth > 750 && clientHeight > 750) {
        //竖屏
        Bus.$emit("restToober", { isShowDown: true, isShowUp: false, notUsed: false, isShowLeft: false, isShowRight: false, notUsedTransverse: false })
    } else if (clientWidth > clientHeight) {
        //宽度大于高度  就是横屏
        Bus.$emit("restToober", { isShowDown: false, isShowUp: false, notUsed: false, isShowLeft: true, isShowRight: false, notUsedTransverse: false })
    } else if (clientWidth < clientHeight) {
        //竖屏
        Bus.$emit("restToober", { isShowDown: true, isShowUp: false, notUsed: false, isShowLeft: false, isShowRight: false, notUsedTransverse: false })
    }
    /*}*/


}