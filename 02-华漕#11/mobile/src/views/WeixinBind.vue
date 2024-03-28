<template>
    <div class="j-weixinBind">
        <v-row justify="space-between" class="j-weixinBind-inp">
            <v-col cols="12">
                <v-form ref="form">
                    <v-text-field v-model="weixinBind.phoneNum" label="手机号：" required></v-text-field>
                    <div class="j-weixinBind-code">
                        <v-text-field v-model="weixinBind.code" label="验证码：" required></v-text-field>
                        <v-btn small v-show="codeShow"
                            class="j-weixinBind-btn j-weixinBind-code-btn pa-2 mt-1 rounded-pill px-3 pt-2" color="primary"
                            @click.prevent="handleGetCode">获取验证码</v-btn>
                        <v-btn small v-show="!codeShow"
                            class="j-weixinBind-btn j-weixinBind-code-btn pa-2 mt-1 rounded-pill px-3 pt-2"
                            color="primary">{{ count }}秒后重试</v-btn>
                    </div>
                    <v-btn block large class="j-weixinBind-sure-btn pa-2 primary text-no-wrap rounded-pill"
                        @click.prevent="handleWeixinBind">确定</v-btn>
                </v-form>
            </v-col>
        </v-row>
    </div>
</template>
<script>
import API from "../request/api.js";
import weixinLogin from "../assets/js/weixinLogin.js";

export default {
    name: 'OtherRes',
    data: function () {
        return {
            weixinBind: {
                key: '',
                openId: '',
                phoneNum: '',
                code: '',
            },
            codeShow: true, //按钮显示
            count: '', //倒计时
            timer: null, //计时器
        };
    },
    mounted() {
        document.title = '微信绑定';
        this.weixinIsLogin();
    },
    methods: {
        /**
         * 微信是否登录
         */
        async weixinIsLogin(){
            let res = await weixinLogin.getWeixinKey();
            if(res && res.realName){
                this.$router.push('/home');  //微信登录并且绑定跳转到首页
            }
        },

        /**
         * 获取验证码
         */
        handleGetCode() {
            if (!(/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(this.weixinBind.phoneNum))) {
                alert('请填写正确手机号');
                return;
            }

            let clicktime = new Date().getTime() + 60000; //未来60秒，这里也毫秒为单位
            sessionStorage.setItem('EndTime', JSON.stringify(clicktime)); //存入sessionStorage

            API.getCode({ phoneNum: this.weixinBind.phoneNum }).then(res => {
                if (res.data.code == 0 && res.data.data.indexOf('成功') > -1) {
                    alert(res.data.data);
                    this.timeDown(clicktime) //请求成功则触发timeDown并将时间携带过去
                }
            });
        },

        /**
        * 获取验证码倒计时器
        */
        timeDown(clicktime) {
            if (!this.timer) {
                this.count = Math.ceil((JSON.parse(clicktime) - new Date().getTime()) / 1000); //取出计时
                this.codeShow = false;
                this.timer = setInterval(() => {
                    if (this.count > 0) {
                        this.count--;
                    } else {
                        this.codeShow = true;
                        clearInterval(this.timer); //清除计时器
                        this.timer = null;
                        sessionStorage.removeItem('EndTime') //计时完后清除sessionStorage
                    }
                }, 1000)
            }

        },

        /**
         * 通过手机号和验证码进行微信绑定
         */
        handleWeixinBind() {
            let vm = this;
            if (!(/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(this.weixinBind.phoneNum))) {
                alert('请填写正确手机号');
                return;
            }
            if (!this.weixinBind.code) {
                alert('请填验证码');
                return;
            }
            API.addRealName({ key: localStorage.getItem('weixinkey'), openId: localStorage.getItem('openId'), code: this.weixinBind.code, phoneNum: this.weixinBind.phoneNum }).then(res => {
                if (res.data.code == 0 && res.data.msg.indexOf('成功') > -1) {
                    Object.assign(this.$data, this.$options.data().realNameObj);
                    alert("绑定成功！");
                    vm.$router.push('/home');  //绑定完跳转到首页
                }
            });
        },
    },
};
</script>
<style scoped>
.mask-inpField {
    background: rgba(0, 0, 0, 0.5);
}

.j-weixinBind {
    border-top: 1px solid #dfdfdf;
}

.j-weixinBind .j-weixinBind-inp {
    width: 100%;
    /* background-color: #fff; */
    box-sizing: border-box;
    margin: 0;
}

.v-btn.v-size--default {
    font-size: .28rem;
}

.col-12 {
    padding: .28rem;
}

.j-weixinBind-code {
    position: relative;
}

.j-weixinBind-code-btn {
    position: absolute;
    bottom: 30px;
    right: 0;
    font-size: .28rem;
}

.j-weixinBind-sure-btn {
    width: 100%;
    height: 0.88rem !important;
    font-size: .28rem;
    margin: 20px 0;
}

::v-deep .theme--light.v-text-field>.v-input__control>.v-input__slot:before {
    border-color: #dfdfdf;
}

::v-deep .v-text-field .v-label {
    color: #fff !important;
}

::v-deep .v-text-field input {
    color: #fff;
}
</style>
