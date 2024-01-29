import Vue from 'vue'
// 直接将Vue组件作为Vue.extend的参数
const constructor = Vue.extend(require('./message.vue').default)

// import message from "./message.vue"
// const constructor = Vue.extend(message)

let nId = 1

const Message = (options) => {
  let id = 'notice-' + nId++;
  options = options || {};
  if (typeof options === 'string') {
    options = {
      message: options
    };
  }

  const instance = new constructor({
    data:options//重点：在这里将你传过来的参数匹配到message.vue组件的data
  })

  instance.id = id;
  instance.$mount(); // 挂载但是并未插入dom，是一个完整的Vue实例
  document.body.appendChild(instance.$el) // 将dom插入body
  instance.visible = true   //这里修改message.vue数据中的visible,这样message组件就显示出来

  return instance
};

//同element-ui一样，在给Message绑定四个方法，直接调用
['success', 'warning', 'info', 'error'].forEach(type => {
  Message[type] = options => {
    if (typeof options === 'string') {
      options = {
        message: options
      };
    }
    options.type = type;
    return Message(options);
  };
});

export default  Message;
