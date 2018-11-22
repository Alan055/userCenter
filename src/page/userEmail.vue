<template>
  <div class="warpper-con">
    <div class="warpper-form">
      <div class="form-main">
        <!-- 电子邮箱 -->
       <div class="replacePhone" >
          <div class="boxMain" v-show="isbindEmail">
            <h5 class="email-title" style="text-align: center" v-show="ismodifyEmail">若需要更改，请添入新的电子邮箱</h5>
            <div class="phoneNum">
              <h4 class="fl">电子邮箱：</h4>
              <div class="selInput fl" :class="!verificationEmail && email !== ''?'errborder':''">
                <input type="text" v-model="email" placeholder="请输入您的电子邮箱">
              </div>
            </div>
            <div class="errTips">
              <div v-if="!verificationEmail && email !== ''">
                <i class="icon_v3">&#xe645;</i>邮箱格式错误</div>
            </div>
            <div class="submit" @click="verificationEmail && email !== '' && nextEmail()">
              <span :class="verificationEmail && email !== ''?'active':''">下一步</span>
            </div>
          </div>

          <div class="boxMain" v-show="replaceEmail">
            <h5 class="email-title" style="text-align: center">开启邮件后请点击
              <!-- <span >【验证链接】</span>完成邮箱绑定。 -->
              <span >【验证链接】</span>完成邮箱绑定。<em v-show="ismodifyEmail">( 换绑邮箱：<span>{{email}}</span> )</em>
            </h5>
            <div class="yzCode emailMain" >
              <!-- <h4 class="fl">邮箱验证码：</h4>
              <div class="selInput fl" :class="!btns && yzCode !== ''?'errborder':''">
                <input type="text" placeholder="请输入验证码" class="fl" v-model="yzCode" @input="checkCode" />
              </div> -->
              <span class="yzCodeBtn fl" style="width:180px" v-show="!isCountFinish" @click="emailCode">重新发送邮箱验证链接({{countTime}}s)</span>
              <!-- <span class="yzCodeBtn renew fl" v-show="isCountFinish">{{countTime}}s 后重新发送</span> -->
            </div>
            <div class="errTips">
              <div v-if="login_pass_error">
                <i class="icon_v3">&#xe645;</i>{{login_pass_error}}</div>
            </div>
            <div class="tips">如果半小时内没有收到邮件，请到邮箱的广告邮件，垃圾邮件列表找找或者联系客服，由客服帮您解决。</div>
            <div class="submit" @click="btns && bindEmail()">
              <span :class="btns?'active':''">完成</span>
            </div>
          </div>
        </div> 
      </div>
    </div>
  </div>
</template>

<script>
import {
  userConter,
  userInit,
  registerInit,
  inputlineBtn,
  Prompt,
  getVerifyCode
} from "@/js/index.js";
import { verifyRule } from "@/js/const.js";
import { mapState, mapMutations, mapGetters } from "vuex";
// import base from "@/js/pubilc.js";
import breadNav from "./breadNav";

// const ITEM = base.storage();
let constructObj = function() {
  let obj = {};

  for (let key in verifyRule) {
    if (
      key === "username" ||
      key === "mobile" ||
      key === "psw" ||
      key === "fundPsw" ||
      key === "repeatPsw" ||
      key === "verifyImg" ||
      key === "verifyCode" ||
      key === "fundPsw"
    ) {
      obj[key] = {
        isShow: false,
        val: "",
        tip: verifyRule[key].tip,
        reg: verifyRule[key].reg,
        error: verifyRule[key].error,
        isPass: false,
        isFocus: false
      };
    }
  }
  return obj;
};
let init = {
  userHeader: userInit(),
  userContent: userConter(),
  registerInit: registerInit()
};
export default {
  data() {
    return {
      email: "",
      login_pass_error1: "两次密码不一致！",
      login_pass_error: "",
      send_code_error: "",
      formObj: constructObj(),
      btns: false, // 不符合规则  按钮不可用
      isCountFinish: false, //是否显示获取验证按钮
      yzCode:'',
      countTime:120,  // 倒计时
    };
  },
  components: {},
  computed:{
    ...mapState([
      "ismodifyEmail", // 是否显示更换邮箱界面
      "isbindEmail", // 是否显示绑定邮箱界面
      "replaceEmail", //
      "root_userCenter",
      "bindInfo", // 用户绑定的信息
    ]),
    // 验证设置邮箱
    verificationEmail() {
      return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(this.email);
    },
  },
  methods: {
    ...mapMutations(['setData','setBreadMore','setBread']),
    // 更换邮箱下一步
    nextEmail() {
      let _this = this;
      let options = {
        email:this.email
      }
      _this.$http.post('/yx/u/api/personal/send-email',options).then(res=>{
        let data = res.body;
        console.log(data);
        let timer = setInterval(function() {
          if(_this.countTime === 0) {
              clearInterval(timer);
              _this.countTime = 60;
              _this.isCountFinish = false;
          }
          _this.countTime--;
      }, 1000);
      })
      this.setData({ key: "isbindEmail", value: false });
      this.setData({ key: "replaceEmail", value: true });
      this.btns = false;
    },
    // 绑定邮箱
    bindEmail() {},
    emailCode() {
      // App.alert('info', '提示消息', '邮箱验证码已发送至邮箱'+this.email+'请注意查收！', 3000);
    },
    // 检验验证码是否符合规则
    checkCode() {
      this.send_code_error = "";
      if (!verifyRule.verifyCode.reg.test(this.yzCode)) {
        this.resetPwdErroe = verifyRule.verifyCode.error;
        return false;
      } else {
        this.resetPwdErroe = "";
        this.btns = true;
      }
    },
    // 修改面包屑
    setBreadInfo() {
      this.setBreadMore([{label: this.isSetFunds?'绑定电子邮箱':'修改电子邮箱', url: '/userEmail'}])
    },
    init(){
      if(!this.isbindEmail&&!this.ismodifyEmail&&!this.replaceEmail){
        this.$router.push({path: this.root_userCenter + '/userDetail'})// 跳转到前一个页面
      }
      this.setBreadInfo()
    }
  },
  created () {
    this.init()
  }
};
</script>
<style lang="less" scoped>
@import "../less/userForm.less";
</style>
