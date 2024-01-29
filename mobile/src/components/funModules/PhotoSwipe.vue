<template>
    <!-- 把photoSwipe单独放到一个.vue文件里，就是死活不好使，报错，Uncaught TypeError: Cannot read property 'x' of undefined，不知道为什么，把pswp div放到index.html里也是在网上看到有这种解决办法 -->
    <div v-show="photoSwipe.show" style="width: 100%;height: 100%;">
        <div class="pswp" tabindex="-1" role="dialog" aria-hidden="true">
            <!-- Background of PhotoSwipe. 
         It's a separate element, as animating opacity is faster than rgba(). -->
            <div class="pswp__bg"></div>
            <!-- Slides wrapper with overflow:hidden. -->
            <div class="pswp__scroll-wrap">
                <!-- Container that holds slides. PhotoSwipe keeps only 3 slides in DOM to save memory. -->
                <div class="pswp__container">
                    <!-- don't modify these 3 pswp__item elements, data is added later on -->
                    <div class="pswp__item"></div>
                    <div class="pswp__item"></div>
                    <div class="pswp__item"></div>
                </div>
                <!-- Default (PhotoSwipeUI_Default) interface on top of sliding area. Can be changed. -->
                <div class="pswp__ui pswp__ui--hidden">
                    <div class="pswp__top-bar">
                        <!--  Controls are self-explanatory. Order can be changed. -->
                        <div class="pswp__counter"></div>
                        <button class="pswp__button pswp__button--close" title="Close (Esc)" style="color: #000;height: .5rem;width: .5rem;line-height: .5rem;background: #fff;text-align: center;position: absolute;left: .24rem;top: .24rem;z-index: 10;cursor: pointer;font-size: .3rem;font-weight: bold;opacity: .8">X</button>
                        <!-- <button class="pswp__button pswp__button--share" title="Share"></button>
                    <button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button>
                    <button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button> -->
                        <!-- Preloader demo https://codepen.io/dimsemenov/pen/yyBWoR -->
                        <!-- element will get class pswp__preloader--active when preloader is running -->
                        <div class="pswp__preloader">
                            <div class="pswp__preloader__icn">
                                <div class="pswp__preloader__cut">
                                    <div class="pswp__preloader__donut"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
                        <div class="pswp__share-tooltip"></div>
                    </div>
                    <button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)">
                    </button>
                    <button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)">
                    </button>
                    <div class="pswp__caption">
                        <div class="pswp__caption__center"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style>
.pswp{
    z-index: 15000;
}
</style>
<script>
    import 'photoswipe/dist/photoswipe.css';
    import 'photoswipe/dist/default-skin/default-skin.css'
    import PhotoSwipe from 'photoswipe'
    import PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default'

    export default {

        name: 'PhotoSwipe',
        props: ['photoSwipe'],
        components: {
        },
        data: function() {
            return {
            };
        },
        watch: {
            photoSwipe: {
                immediate: true,
                handler(newValue) {
                    if (newValue.show) {
                        this.openPhotoSwipe(newValue.el);
                    }
                },
                deep: true
            },
        },
        methods: {
            openPhotoSwipe: function(_this) {  //初始化
                var pswpElement = document.querySelectorAll('.pswp')[0];
                var items = [{
                    src: _this.getAttribute('src'),
                    w: _this.width * 20,
                    h: _this.height * 20
                }];
                var options = {
                    // 索引:当前点击
                    //index: Index,
                    // history & focus options are disabled on CodePen        
                    history: false,
                    focus: false,
                    // 图片间的间距
                    //spacing: 0.05,
                    //点击图片/黑边关闭
                    //tapToClose: true,
                    showAnimationDuration: 0,
                    hideAnimationDuration: 0
                };
                var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
                gallery.init();
                //})
            },
        }
    };
</script>