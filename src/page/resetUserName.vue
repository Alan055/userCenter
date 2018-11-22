<template>
  <div class="warpper-con">
    <div class="warpper-form">
      <div class="form-main">
        <!-- 手机号注册时设置用户名 -->
        <div class="replacePhone" >
          <div class="boxMain" >
            <div class="phoneNum">
              <h4 class="fl">用户名：</h4>
              <div class="selInput fl" :class="username!='' &&!verificationSetUsername&&isReg?'errborder':''">
                <input type="text" placeholder="请输入用户名" class="fl" v-model="username" @blur="vericationUserName"  @input="userInput"/>
                <i class="icon_v3 success" v-if="username!=''&&verificationSetUsername&&!isReg">&#xe646;</i>
              </div>
            </div>
            <div class="errTips"  v-html="resetPwdErroe">
              <!-- <div ><i class="icon_v3">&#xe645;</i>{{resetPwdErroe}}</div> -->
            </div>
            <div class="phoneNum">
              <h4 class="fl">登录密码：</h4>
              <div class="selInput fl" :class="!verificationOldPass && oldPassword != '' && verificationSetUsername?'errborder':''">
                <input type="password" placeholder="请输入登录密码" class="fl" v-model="oldPassword" />
                <i class="icon_v3 success" v-if="oldPassword!=''&&verificationOldPass&&verificationSetUsername">&#xe646;</i>
              </div>
            </div>
            <!-- <div class="errTips" >
              <div v-if="!verificationOldPass && oldPassword != '' && verificationSetUsername">
                <i class="icon_v3">&#xe645;</i>密码须为6-24位字符</div>
            </div> -->
            <div class="phoneNum" v-if="false">
              <h4 class="fl">资金密码：</h4>
              <div class="selInput fl" :class="verificationOldPass&& verificationSetUsername&&pass!=''&&!verificationSetFundPsw&&isReg?'errborder':''">
                <input type="password" placeholder="请输入资金密码" class="fl" v-model="pass" />
                <i class="icon_v3 success" v-if="pass!=''&&verificationSetUsername&&verificationOldPass&&verificationSetFundPsw&&!isReg">&#xe646;</i>
              </div>
            </div>
            <div class="errTips" >
              <div v-if="!verificationOldPass && oldPassword != '' && verificationSetUsername">
                <i class="icon_v3">&#xe645;</i>{{send_error?send_error:'密码须为6-24位字母或数字'}}</div>
            </div>
            <div class="submit" @click="verificationOldPass &&verificationSetUsername&&!isReg && setUsername()">
              <span :class="verificationOldPass&&verificationSetUsername&&!isReg?'active':''">提交</span>
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
  getVerifyCode,
  regCheckuser
} from "@/js/index.js";
import { verifyRule } from "@/js/const.js";
import { mapState, mapMutations, mapGetters } from "vuex";
// import base from "@/js/pubilc.js";
import md5 from 'js-md5';

// const ITEM = base.storage();
let constructObj = function() {
  let obj = {};

  for (let key in verifyRule) {
    if (
      key === "username" ||
      key === "regUsername" ||
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
          username: "", // 用户名
          safetySrc: "", //获取图片验证码
          newPassword: "", // 新密码
          // isBindWithdrawPassword: null,
          pass: "", // 资金密码
          oldPassword: "", // 旧密码
          resetPwdErroe: "", // 设置密码的错误提示
          formObj: constructObj(),
          // isbind: {}, //用户绑定的数据  如是否绑定手机号。。。
          isReg:true,   // 用户名是否被注册
          send_error:'',   // 错误提示
        };
    },
    components: {},
    computed:{
      ...mapState(['bindInfo']),
      // 验证登录旧密码
      verificationOldPass() {
        return verifyRule.psw.reg.test(this.oldPassword);
      },
      // 验证用户名
      verificationSetUsername() {
        return verifyRule.regUsername.reg.test(this.username);
      },
      // 验证设置资金密码
      verificationSetFundPsw() {
        return /^\d{6}$/.test(this.pass);
      },
    },
    methods: {
      ...mapMutations(['setBread','setBreadMore']),
      userInput(){
        if(this.verificationSetUsername){
          this.resetPwdErroe = ''
        }else{
          this.resetPwdErroe = `<i class="icon_v3">&#xe645;</i>"用户名须为：大小写字母或'_'开头，6-10个字符"`
        }
      },
      // 验证修改的用户名是否已注册
      vericationUserName(){
        let _this = this;
        if(this.verificationSetUsername){
          _this.$http.get('/yx/rg/exist?userName='+_this.username).then((response) => {
            let data = response.body;
            if(data.data === true){
              _this.resetPwdErroe = `<i class="icon_v3">&#xe645;</i>该账号已被注册！`
              _this.isReg = true;
            }else{
              _this.resetPwdErroe = '';
              _this.isReg = false
            }
          })
        }
      },
      // 设置用户名
      setUsername() {
        console.log(this.isbind);
        let _this = this;
        let options = {
          cn: _this.username,
          password: md5(_this.oldPassword),
          // withdrawPassword: md5(_this.formObj.fundPsw.val)
        }
        // if(this.bindInfo.withdrawPassword){
        //   options.withdrawPassword = md5(_this.pass)
        // }
        _this.$http.post('/yx/u/api/account/first-time-modify-cn',options,{emulateJSON: true}).then(res=>{
          let data = res.body;
          if (data.code === 0) {
            _this.usernameShow = false;
            this.$Modal.al_openLottery({status:'success',content:'用户名设置成功，2s后自动跳转至登录...',time:2000})
            let timer = setTimeout(function () {
              clearTimeout(timer);
              userInit().loginout(_this, {target: "/login", islogin: true});
            }, 2000);
          } else {
            _this.send_error = data.message;
            _this.oldPassword = 'false'
          }
        })
        // init.userContent.resetUsername(this);
      },
    },
    created () {
      this.setBread([{label: '个人中心',}, {label: '账户信息', url: '/userDetail'}])
		  this.setBreadMore([{label: '修改用户名', url: '/resetUserName'}])
    }
}

</script>
<style lang="less" scoped>
@import "../less/userForm.less";
</style>