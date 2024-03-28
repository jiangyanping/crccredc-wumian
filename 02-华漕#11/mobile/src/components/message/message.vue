<template>
  <transition name="message-fade">
    <div v-if="visible"
         :class="wrapClasses">
      <img class="message_img"
           :src="typeImg" />
      <span>{{message}}</span>
    </div>
  </transition>
</template>


<script>
const prefixCls = 'message'
export default {
  name: 'message',
  data () {
    return {
      visible: false,
      type: 'info',
      message: '',
      duration: 3000
    }
  },
  computed: {
    typeImg () {
      return require(`../../assets/${this.type}.svg`);
    },
    wrapClasses () {
      return [
        `${prefixCls}`,
        `${prefixCls}-${this.type}`
      ]
    }
  },
  mounted () {
    // 挂载的时候就开始计时，3000ms后消失
    this.setTimer()
  },
  methods: {
    setTimer () {
      setTimeout(() => {
        // 3000ms之后调用关闭方法
        this.handleClose()
      }, this.duration)
    },
    handleClose () {
      this.visible = false
      // 从DOM里将这个组件移除
      // visible只是控制了显示与隐藏  但是dom结构中还是存在组件  为了避免消耗内存必须销毁组件
      setTimeout(() => {
        this.$el.parentNode.removeChild(this.$el)
      }, 500)
    }
  },
}
</script>


<style scoped>
.message-fade-enter-active,
.message-fade-leave-active {
  transition: all 0.3s ease;
}
.message-fade-enter, .message-fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  transform: translateY(-20px);
  opacity: 0;
}
.message {
  position: absolute;
  top: 3%;
  left: 1.5%;
  width: 88%;
  border-radius: 4px;
  padding: 13px 18px;
  color: #616060;
  font-size: 18px;
  line-height: 28px;
  /*display: flex;*/
  align-items: center;
  text-align: center;
}
.message_img {
  width: 18px;
  margin-right: 6px;
  margin-top: 5px;
}
.message-success {
  background: #dcffefd3;
  color: rgb(48, 194, 104);
}
.message-info {
  background: #c2c1c1;
  color:#707070;
}
.message-warning {
  background: #ffdec9;
  color: #ecae51;
}
.message-error {
  background: #ffe2e2;
  color: rgb(255, 108, 108);
}
</style>

