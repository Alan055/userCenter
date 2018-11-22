<template>
  <div class="warpper-con">
    <div class="warpper-form">
      <div class="form-main">
        <!-- 登陆密码 -->
        <div class="replacePhone" >
          <div class="boxMain" v-if="true">
            <div class="phoneNum">
              <h4 class="fl">旧密码：</h4>
              <div class="selInput fl" :class="resetPwdErroe&&oldPassword!='' ?'errborder':''">
                <input type="password" placeholder="请输入旧密码" class="fl" v-model="oldPassword" />
                <i class="icon_v3 success" v-if="oldPassword!='' &&verificationOldPass&&!resetPwdErroe">&#xe646;</i>
              </div>
            </div>
            <div class="errTips">
              <div v-if="oldPassword!='' &&resetPwdErroe">
                <i class="icon_v3">&#xe645;</i>{{resetPwdErroe}}</div>
            </div>
            <div class="phoneNum">
              <h4 class="fl">新密码：</h4>
              <div class="selInput fl" :class="verificationOldPass && newPassword != '' && !verificationNewPass?'errborder':''">
                <input type="password" placeholder="请输入新密码" class="fl" v-model="newPassword" @input="resetPwdErroe=''"/>
                <i class="icon_v3 success" v-if="verificationOldPass && newPassword != '' && verificationNewPass">&#xe646;</i>
              </div>
            </div>
            <div class="errTips">
              <div v-if="verificationOldPass && newPassword != '' && !verificationNewPass">
                <i class="icon_v3">&#xe645;</i>请输入6-24位字母或数字</div>
            </div>
            <div class="phoneNum">
              <h4 class="fl">确认密码：</h4>
              <div class="selInput fl" :class="rePassword!==newPassword&&rePassword!=''?'errborder':''">
                <input type="password" placeholder="请再次输入密码" class="fl" v-model="rePassword" />
                <i class="icon_v3 success" v-if="rePassword===newPassword&&verificationOldPass&& verificationNewPass">&#xe646;</i>
              </div>
            </div>
            <div class="errTips">
              <div v-if="rePassword!==newPassword&&rePassword!=''">
                <i class="icon_v3">&#xe645;</i>两次输入密码不一致</div>
            </div>
            <div class="submit" @click="verificationOldPass && verificationNewPass && rePassword===newPassword&&!resetPwdErroe && sendResePass()">
              <span :class="verificationOldPass && verificationNewPass && rePassword===newPassword&&!resetPwdErroe?'active':''">提交</span>
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
    data () {
      return {
        isphone: false, // 是否符合规则
        login_pass_error1: "两次密码不一致！",
        login_pass_error: "",
        send_code_error: "",
        formObj: constructObj(),
        pass: "",
        isBindWithdrawPassword: null,
        username: "", // 用户名
        safetySrc: "", //获取图片验证码
        newPassword: "", // 新密码
        passAgain: "", // 重复资金密码
        rePassword: "", // 重复登录密码
        oldPassword: "", // 旧密码
        resetPwdErroe: "", // 设置密码的错误提示
      };
    },
    components: {},
    computed: {
      // 验证登录旧密码
      verificationOldPass() {
        if(verifyRule.psw.reg.test(this.oldPassword)){
          this.resetPwdErroe = ''
          return true;
        }else{
          this.resetPwdErroe = '格式不正确！'
          return false;
        }
      },
      // 验证登录新密码
      verificationNewPass() {
        return verifyRule.psw.reg.test(this.newPassword);
      },
    },
    methods: {
      ...mapMutations(['setBreadMore','setBread']),
      // 修改登录密码
      sendResePass() {
        if (this.oldPassword === this.newPassword) {
          this.resetPwdErroe = "新旧密码相同,请重新输入！！";
          // this.oldPassword = "false";
          return false;
        }
        if (this.verificationOldPass && this.verificationNewPass) {
          init.userContent.resetPwd(this);
        }
      },
    },
    created () {
      this.setBread([{label: '个人中心',}, {label: '账户信息', url: '/userDetail'}])
			this.setBreadMore([{label: '修改登录密码', url: '/userPassword'}])
    }
}

</script>
<style lang="less" scoped>
@import "../less/userForm.less";
</style>