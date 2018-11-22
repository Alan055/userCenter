<template>
  <div class="warpper-con">
    <div class="warpper-form">
      <div class="form-main">
        <!-- 手机号码 -->
        <div class="replacePhone" >
          <div class="boxMain" v-if="isBindPhone">
            <h5 style="text-align: center">进行手机号码换绑，您要先验证原有的手机号码，请点击发送手机验证码</h5>
            <div class="phoneNum">
              <h4 class="fl">手机号：</h4>
              <div class="selInput fl">
                <!-- <input type="text" readonly v-model="cellphone" value="" > -->
                <!-- <span class="replaceCell">{{bindInfo.cellphone}}</span> -->
                <span class="replaceCell">{{transationPhone(bindInfo.cellphone)}}</span>
              </div>
            </div>
            <div class="errTips"></div>
            <div class="yzCode" v-if="isCaptcha">
              <h4 class="fl">图片验证码：</h4>
              <div class="selInput replaceCell fl" :class="!verificationImgCode && imgYzCode !== ''?'errborder':''">
                <input type="text" class="imgInput fl" placeholder="请输入图片验证码" v-model="imgYzCode" @input="(isCountFinish = false,send_code_error='')" />
                <span class="imgyzCode  fl" @click="RefreshSrc"><img :src="safetySrc" alt=""></span>
              </div>
            </div>
            <div class="errTips" v-if="isCaptcha"></div>
            <div class="yzCode">
              <h4 class="fl">验证码：</h4>
              <div class="selInput fl" :class="!verificationMobileCode && yzCode !== ''?'errborder':''">
                <input type="text" placeholder="请输入验证码" v-model="yzCode" @input="checkCode" />
              </div>
              <span class="yzCodeBtn fl" v-show="!isCountFinish" @click="modifyMoblieCode">获取验证码</span>
              <span class="yzCodeBtn renew fl" v-show="isCountFinish">{{countTime}}s 后重新发送</span>
            </div>
            <div class="errTips" v-if="send_code_error">
              <div>
                <i class="icon_v3">&#xe645;</i>{{send_code_error}}</div>
            </div>
            <div class="errTips">
              <div v-if="!verificationMobileCode && yzCode !== ''">
                <i class="icon_v3">&#xe645;</i>{{resetPwdErroe}}</div>
            </div>
            <div class="submit" @click="verificationMobileCode && yzCode !== '' && nextTempo()">
              <span :class="verificationMobileCode && yzCode !== ''?'active':''">下一步</span>
            </div>
          </div>

          <!-- 绑定手机号 -->
          <div class="boxMain" v-if="replacePhone">
            <div class="country">
              <h4 class="fl">国家/地区：</h4>
              <div class="selInput fl">
                <Select class="selCountry" v-model="phoneType" @on-change="phone = ''">
                  <Option v-for="(item,idx) in phoneTypeList" :key="idx" :value="item.value">{{item.label}}</Option>
                </Select>
              </div>
            </div>
            <div class="errTips"></div>
            <div class="phoneNum">
              <h4 class="fl">手机号：</h4>
              <div class="selInput fl" :class="!verificationMobile && phone !== ''?'errborder':''">
                <input placeholder="请输入手机号" v-model="phone" maxlength="11" @input="verificationMobile&&verficationPhoneNumber();(isCountFinish = false,send_code_error='')" >
                <i class="icon_v3 success" v-show="verificationMobile && phone !== ''&&!isReg">&#xe646;</i>
                <i class="icon_v3 clearAll" v-show="phone !== ''" @click="clearInput">&#xe647;</i>
              </div>
            </div>
            <div class="errTips">
              <div v-if="!verificationMobile && phone !== ''">
                <i class="icon_v3">&#xe645;</i>请输入真实有效的手机号码</div>
            </div>
            <div class="yzCode" v-if="isCaptcha">
              <h4 class="fl">图片验证码：</h4>
              <div class="selInput replaceCell fl" :class="!verificationImgCode && imgYzCode !== ''?'errborder':''">
                <input type="text" class="imgInput fl" placeholder="请输入图片验证码" v-model="imgYzCode" @input="(isCountFinish = false,send_code_error='')" />
                <span class="imgyzCode  fl" @click="RefreshSrc"><img :src="safetySrc" alt=""></span>
              </div>
            </div>
            <div class="errTips" v-if="isCaptcha"></div>
            <div class="yzCode">
              <h4 class="fl">验证码：</h4>
              <div class="selInput fl" :class="!verificationMobileCode && yzCode!=''&&verificationMobile?'errborder':''">
                <input type="text" placeholder="请输入验证码" class="fl" v-model="yzCode" @input="checkCode" />
              </div>
              <span class="yzCodeBtn fl" v-show="!isCountFinish" @click="phone !== ''&&getMoblieCode()">获取验证码</span>
              <span class="yzCodeBtn renew fl" v-show="isCountFinish">{{countTime}}s 后重新发送</span>
            </div>
            <div class="errTips" v-if="send_code_error">
              <div>
                <i class="icon_v3">&#xe645;</i>{{send_code_error}}</div>
            </div>
            <div class="errTips">
              <div v-if="!verificationMobileCode && yzCode!=''&&verificationMobile">
                <i class="icon_v3">&#xe645;</i>{{resetPwdErroe}}</div>
            </div>
            <div class="submit" @click="verificationMobileCode && yzCode!=''&&verificationMobile&&!isReg&& setMobile()">
              <span :class="verificationMobileCode && yzCode!=''&&verificationMobile&&!isReg?'active':''">提交</span>
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
          isReg:false, // 手机号是否已注册
          isModifyMoblie:false,  // 是否是修改手机号码页面
          phone: "", // 手机号
          imgYzCode: "", // 图片验证码
          isCaptcha: false, //图片验证码是否显示
          email: "",
          // cellphone: "", // 绑定的手机号
          yzCode: "", // 手机验证码
          isphone: false, // 是否符合规则
          login_pass_error1: "两次密码不一致！",
          login_pass_error: "",
          send_code_error: "",
          formObj: constructObj(),
          countTime: 60,
          isCountFinish: false, //是否显示获取验证按钮
          mobileShow: false,
          btns: false, // 不符合规则  按钮不可用
          isbind: "",
          pass: "",
          isBindWithdrawPassword: null,
          username: "", // 用户名
          safetySrc: "", //获取图片验证码
          newPassword: "", // 新密码
          passAgain: "", // 重复资金密码
          rePassword: "", // 重复登录密码
          oldPassword: "", // 旧密码
          resetPwdErroe: "", // 设置密码的错误提示
          phoneType: "86", // 默认选中中国大陆
          phoneTypeList: [
            {
              value: "86",
              label: "中国大陆   +0086"
            },
            // {
            //   value: "60",
            //   label: "马来西亚   +60"
            // },
            // {
            //   value: "63",
            //   label: "菲律宾   +63"
            // },
            // {
            //   value: "01",
            //   label: "美国   +001"
            // }
          ]
        };
    },
    components: {},
    computed:{
      ...mapState([
        "isBindPhone", // 是否显示绑定手机号界面
        "replacePhone", // 是否显示绑定邮箱界面
        "bindInfo",   //  用户绑定的信息
        "root_userCenter"
      ]),
      // 验证登录旧密码
      verificationOldPass() {
        // this.resetPwdErroe = ''
        return verifyRule.psw.reg.test(this.oldPassword);
      },
      // 验证登录新密码
      verificationNewPass() {
        return verifyRule.psw.reg.test(this.newPassword);
      },
      // 绑定手机号
      verificationMobile() {
        if (this.phoneType === "86") {
          return verifyRule.mobile.reg.test(this.phone);
        } else {
          return /^([0-9]{4,18})$/.test(this.phone);
        }
      },
      // 绑定手机号验证码
      verificationMobileCode() {
        return verifyRule.verifyCode.reg.test(this.yzCode);
      },
      // 绑定图片验证码
      verificationImgCode() {
        return verifyRule.verifyImg.reg.test(this.imgYzCode);
      },
    },
    watch: {
      phone(v){
        let num = parseInt(v)
        if (isNaN(num)) {
          num = ''
        }
				this.phone = num
      }
    },
    methods: {
      ...mapMutations(["setData","setBread","setBreadMore"]),
      clearInput() {
        this.phone = "";
        this.isphone = false;
        this.tips = "";
        this.btns = false;
      },
      //获取图片验证码
      RefreshSrc() {
        init.registerInit.RefreshSrc(this);
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
       // 检测手机号是否已被绑定
      verficationPhoneNumber() {
        let _this = this;
        _this.$http.get('/yx/rg/exist?userName=' + _this.phone).then((response) => {
					let data = response.body;
					console.log(data);
					if (data.data == true) {
						_this.isReg = true;
						_this.send_code_error = '该手机号已注册，请更换后再试'
					} else {
						_this.isReg = false;
						_this.send_code_error = ''
					}
				})
      },
      // 获取手机验证码
      getMoblieCode() {
        let that = this;
        let options = {
          phoneNum: that.phone,
          capchaCode: that.imgYzCode,
          checkUnique: false,
          type: 1
        };
        if(that.isReg){
          return false
        }
        // this.isCountFinish = true;
        if (that.verificationMobile) {
          getVerifyCode(this, options);
        }
      },
      // 修改手机前的验证码
      modifyMoblieCode() {
        let _this = this;
        let options = {
          phoneNum: _this.bindInfo.cellphone,
          capchaCode: _this.imgYzCode,
          checkUnique: false,
          type: 1
        };
        getVerifyCode(this, options);
      },
      // 修改手机号的下一步,验证旧手机号验证码
      nextTempo() {
        let _this = this;
        let options = {
          phoneNum: _this.bindInfo.cellphone,
          phYzCode: _this.yzCode
        };
        _this.$http
          .post("/yx/u/api/account/modifyPhoneVerifyOld", options, { emulateJSON: true })
          .then(response => {
            let data = response.body;
            if (data.code === 0) {
              _this.setData({ key: "isBindPhone", value: false });
              _this.setData({ key: "replacePhone", value: true });
              _this.yzCode = "";
              _this.imgYzCode = "";
              _this.isCaptcha = false;
              _this.isCountFinish = false;
              _this.send_code_error = "";
              _this.resetPwdErroe = "";
              clearInterval(_this.timer);
              _this.countTime = 60;
              _this.isCountFinish = false;
              _this.isModifyMoblie = true;
            }else{
              _this.send_code_error = data.message;
            }
          });
      },
      // 修改手机号码
      modifyMobile() {
        let that = this;
        if (!this.verificationMobile) {
          return;
        }
        if (!this.verificationMobileCode) {
          return;
        }
        this.$http
          .post(
            "/yx/u/api/account/update-phone",
            { phone: that.phone, phYzCode: that.yzCode },
            { emulateJSON: true }
          )
          .then(res => {
            let data = res.body;
            console.log(data);
            that.getAccoutStatus();
            if (data.code === 0) {
              that.mobileShow = false;
              that.$Modal.al_openLottery({status:'success',content:'手机号换绑成功',time:2000})
              let timer =  setTimeout(function(){
                clearTimeout(timer);
                location.href = "/userCenters/userDetail";
              },2000)
            } else {
              that.send_code_error = data.message;
            }
          });
      },
      // 绑定手机号
      setMobile() {
        if(this.isModifyMoblie){
          this.modifyMobile()
          return false 
        }
        let that = this;
        if (!this.verificationMobile) {
          return;
        }
        if (!this.verificationMobileCode) {
          return;
        }
        this.$http.post("/yx/u/api/account/bind-phone",
            { phone: that.phone, phYzCode: that.yzCode },
            { emulateJSON: true }
          )
          .then(res => {
            let data = res.body;
            console.log(data);
            that.getAccoutStatus();
            if (data.code === 0) {
              that.mobileShow = false;
              that.$Modal.al_openLottery({status:'success',content:'手机号绑定成功',time:2000})
              let timer =  setTimeout(function(){
                clearTimeout(timer);
                location.href = "/userCenters/userDetail";
              },2000)
            } else {
              that.send_code_error = data.message;
            }
          });
      },
      // 获取用户账户状态
      getAccoutStatus() {
        let _this = this;

        this.$http.post("/yx/u/api/account/get-bind-status").then(response => {
          let mainBody = response.body;

          if (mainBody.code === 0) {
            _this.isbind = mainBody.data;
            _this.$store.commit("setAccountStatus", mainBody.data);
          }
        });
      },
      setBreadInfo() {
				// this.setBread([{label: '个人中心',}, {label: '账户总览', url: '/userOverview'}])// 这个不需要了
				this.setBreadMore([{label: this.isBindPhone?'修改手机号码':'绑定手机号码', url: '/userPhone'}])
			},
      init(){
        if(!this.isBindPhone&&!this.replacePhone){
          this.$router.push({path: this.root_userCenter + '/userDetail'})// 跳转到前一个页面
        }
        this.setBreadInfo()
      }
    },
    created() {
      this.init()
      // this.setBread([{label: '个人中心',}, {label: '账户信息', url: '/userDetail'}])
    },
    destroyed () {
      this.setData({key:'replacePhone',value:false})
      this.setData({key:'isBindPhone',value:false})
    }
}

</script>
<style lang="less" scoped>
@import "../less/userForm.less";
</style>