<template>
  <div class="warpper-con">
    <div class="warpper-form">
      <div class="form-main">
        <!-- 资金密码 -->
        <div class="replacePhone" >
          <div class="boxMain" v-if="isSetFunds">
            <h5 style="text-align: center">资金密码会在发生提款等交易金额时使用</h5>
            <div class="phoneNum">
              <h4 class="fl">设置资金密码：</h4>
              <div class="selInput fl" :class="pass!=''&&!verificationSetFundPsw?'errborder':''">
                <!--<input type="password" placeholder="请输入密码" class="fl" v-model="pass" />-->
                <password :callBack="endPassword" :idx="'password3'"></password>
                <!--<i class="icon_v3 success" v-if="pass!=''&&verificationSetFundPsw">&#xe646;</i>-->
              </div>
            </div>
            <div class="errTips">
              <div v-if="!pass">
                <i class="icon_v3">&#xe645;</i>密码须6位数字</div>
                <!-- <i class="icon_v3">&#xe645;</i>密码须为大小写字母或'_'开头，8-24位字符</div> -->
            </div>
            <div class="phoneNum">
              <h4 class="fl">确认资金密码：</h4>
              <div class="selInput fl" :class="rePassword !== pass && rePassword != ''?'errborder':''">
                <!--<input type="password" placeholder="请再次输入密码" class="fl" v-model="rePassword" />-->
                <password :callBack="endPassword1" :idx="'password4'" ></password>
                <!--<i class="icon_v3 success" v-if="rePassword === pass && verificationSetFundPsw ">&#xe646;</i>-->
              </div>
            </div>
            <div class="errTips">
              <div v-if="rePassword !== pass&& rePassword != ''">
                <i class="icon_v3">&#xe645;</i>{{login_pass_error1}}</div>
            </div>
            <div class="submit" @click="rePassword === pass && verificationSetFundPsw && setFundsPassword()">
              <span :class="rePassword === pass&& verificationSetFundPsw?'active':''">提交</span>
            </div>
          </div>

          <div class="boxMain" v-if="isShowFunds">
            <div class="phoneNum">
              <h4 class="fl">旧密码：</h4>
              <div class="selInput fl" :class="oldPassword!=''&&resetPwdErroe?'errborder':''">
                <input type="password" placeholder="请输入旧密码" class="fl" v-model="oldPassword" />
                <i class="icon_v3 success" v-if="oldPassword!=''&&verificationFundPsw&&!resetPwdErroe">&#xe646;</i>
              </div>
            </div>
            <div class="errTips">
              <div v-if="oldPassword!=''&&resetPwdErroe">
                <i class="icon_v3">&#xe645;</i>{{resetPwdErroe}}</div>
            </div>
            <div class="phoneNum">
              <h4 class="fl">新密码：</h4>
              <div class="selInput fl" :class="pass!=''&&!verificationNewFundPass && verificationFundPsw?'errborder':''">
                <!--<input type="password" placeholder="请输入新密码" class="fl" v-model="pass" @input="resetPwdErroe=''"/>-->
                <password :callBack="endPassword" :idx="'password4'"></password>
                <!--<i class="icon_v3 success" v-if="pass!=''&&verificationNewFundPass && verificationFundPsw">&#xe646;</i>-->
              </div>
            </div>
            <div class="errTips">
              <div v-if="pass==''">
                <!-- <i class="icon_v3">&#xe645;</i>密码须为大小写字母或'_'开头，8-24位字符</div> -->
                <i class="icon_v3">&#xe645;</i>密码须为6位数字</div>
            </div>
            <div class="phoneNum">
              <h4 class="fl">确认密码：</h4>
              <div class="selInput fl" :class="rePassword !== pass&& rePassword!=''?'errborder':''">
                <!--<input type="password" placeholder="请再次输入密码" class="fl" v-model="rePassword" />-->
                <password :callBack="endPassword1" :idx="'password5'"></password>
                <!--<i class="icon_v3 success" v-if="rePassword === pass&& verificationNewFundPass && verificationFundPsw">&#xe646;</i>-->
              </div>
            </div>
            <div class="errTips">
              <div v-if="rePassword !== pass&& rePassword!=''">
                <i class="icon_v3">&#xe645;</i>两次输入密码不一致</div>
            </div>
            <div class="submit" @click="rePassword === pass&& verificationNewFundPass && verificationFundPsw&&!resetPwdErroe&& sendResetFunds()">
              <span :class="rePassword === pass&& verificationNewFundPass && verificationFundPsw&&!resetPwdErroe?'active':''">提交</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Modal v-model="errTipsMadel" class="errTipsMadel" width="500px" :closable="false" class-name="vertical-center-modal"
           :mask-closable="false">
      <div class="defaultModal_content" :class="{
      'success':errTipsMadelContent.status==='success',
      'warning':errTipsMadelContent.status==='warning',
      'confim':errTipsMadelContent.status==='confim',
      }" v-html="errTipsMadelContent.content">
      </div>

      <div class="defaultModal_bottom">
        <span class="cancel"   @click="setData({key: 'errTipsMadel', value: false})">取消</span>
        <span class="ok"  ><a :href="appConfigData.kefu" target="_blank">联系客服</a></span>
      </div>
    </Modal>
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
  setFundsPass
} from "@/js/index.js";
import { verifyRule } from "@/js/const.js";
import { mapState, mapMutations, mapGetters } from "vuex";
// import base from "@/js/pubilc.js";
import breadNav from "./breadNav";
import md5 from 'js-md5';
import password from "./password.vue";



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
      Withdrawaler: '',// 取款人 --仅仅是弹框里面的
      errPrompt: false,// 错误信息
      // errTipsMadel:false,  // 提示弹出框
      errTipsMadelContent:{},   // 提示框内容
    };
  },
  components: {password},
  computed:{
    ...mapState([
      "isBindPhone", // 是否显示绑定手机号界面
      "isSetFunds", // 是否显示资金密码设置界面
      "isShowFunds", // 是否显示资金密码修改界面
      "bindInfo",    // 用户绑定的信息
      "root_userCenter",  // 中心路由
      "accountStatus" , // 用户是否绑定的信息
      "appConfigData",  // 客服链接等信息
      "errTipsMadel",   // 提示弹出框
    ]),
    // 验证修改资金密码
    verificationFundPsw() {
      // return /^[a-zA-Z0-9]{6,}$/.test(this.oldPassword);
      // if(verifyRule.fundPsw.reg.test(this.oldPassword)){
      if(/^[a-zA-Z0-9]{6,}$/.test(this.oldPassword)){
        this.resetPwdErroe = ''
        return true
      }else{
        this.resetPwdErroe = '密码格式不正确！'
        return false;
      }
      
    },
    // 验证资金新密码
    verificationNewFundPass() {
      return verifyRule.fundPsw.reg.test(this.pass);
      // return /^\d{6}$/.test(this.pass);
    },
    // 验证设置资金密码
    verificationSetFundPsw() {
      return verifyRule.fundPsw.reg.test(this.pass);
      // return /^\d{6}$/.test(this.pass);
    },
  },
  methods: {
    ...mapMutations(['setBread','setBreadMore','setData']),
    // 设置资金密码
    setFundsPassword() {
      let _this = this;
      let options = {
        withdrawPassword:md5(this.pass)
      }
      setFundsPass(this,options)
    },
    // 修改资金密码
    sendResetFunds() {
      if (this.oldPassword === this.pass) {
        this.resetPwdErroe = "新旧密码相同,请重新输入！";
        return false;
      }
      if (this.verificationFundPsw && this.verificationNewFundPass) {
        init.userContent.resetFundsPwd(this);
      }
    },
    // 提示修改资金密码错误已到最大次数
    init_errTipsMadel() {
      this.$Modal.errTipsMadel = function (data) {
        this.errTipsMadelContent = data
        this.setData({key: "errTipsMadel", value: true})
      }.bind(this)
      // 使用方法
      // this.$Modal.errTipsMadel({status:'warning',content:'这个是标题'})
    },
    // modalOk() {
    //   this.errTipsMadel = false
    //   // this.name = this.Withdrawaler
    //   let _this = this;
    //   let options = {
    //     withdrawName:this.Withdrawaler
    //   }
    //   this.$http.post('/yx/u/api/account/apply-bind-withdrawName',options).then(res=>{
    //     let data = res.body;
    //     if(data.code===0){
    //       this.$Modal.al_openLottery({status:'success',content:'设置成功'})
    //     }
    //   })
    // },
    // modalCancel() {
    //   this.errTipsMadel = false
    //   this.$router.push({path: this.root_userCenter + '/userDetail'})// 跳转到前一个页面
    // },
    // 跳转到绑定银行卡页面
    jump(){
      this.$router.push({path:this.root_userCenter+'/addCard'})
    },
    // 修改面包屑
    setBreadInfo() {
      this.setBread([{label: '个人中心',}, {label: '账户信息', url: '/userDetail'}])
      this.setBreadMore([{label: this.isSetFunds?'设置资金密码':'修改资金密码', url: '/fundsPass'}])
    },
    // 密码组件的回调函数
	  endPassword(v){
    	this.pass = v
    },
    // 密码组件的回调函数
	  endPassword1(v){
    	this.rePassword = v
    },
    init(){
      if(!this.isShowFunds&&!this.isSetFunds){  
        this.$router.push({path: this.root_userCenter + '/userDetail'})// 跳转到前一个页面
      }
      this.setBreadInfo()
    }
  },
  created () {
  	console.log("123456")
    this.init()
    !this.$Modal.errTipsMadel && this.init_errTipsMadel();
  },
  destroyed() {
    this.setData({key:'isShowFunds',value:false});
    this.setData({key:'isSetFunds',value:false});
  },
};
</script>
<style lang="less" scoped>
@import "../less/userForm.less";
</style>
