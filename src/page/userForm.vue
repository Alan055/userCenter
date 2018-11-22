<template>
  <div class="warpper-con">
    <div class="warpper-form">
      <div class="form-main">
        <!-- 手机号码 -->
        <div class="replacePhone" v-show="showType === '1'">
          <div class="boxMain" v-if="isBindPhone">
            <h5 style="text-align: center">进行手机号码换绑，您要先验证原有的手机号码，请点击发送手机验证码</h5>
            <div class="phoneNum">
              <h4 class="fl">手机号：</h4>
              <div class="selInput fl">
                <!-- <input type="text" readonly v-model="cellphone" value="" > -->
                <span class="replaceCell">{{cellphone.replace(/(\d{3})\d{4}(\d{3})/, "$1****$2")}}</span>
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
                <input placeholder="请输入手机号" v-model="phone" @input="(isCountFinish = false,send_code_error='')">
                <i class="icon_v3 success" v-show="verificationMobile && phone !== ''">&#xe646;</i>
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
              <span class="yzCodeBtn fl" v-show="!isCountFinish" @click="getMoblieCode">获取验证码</span>
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
            <div class="submit" @click="verificationMobileCode && yzCode!=''&&verificationMobile&& setMobile()">
              <span :class="verificationMobileCode && yzCode!=''&&verificationMobile?'active':''">提交</span>
            </div>
          </div>
        </div>

        <!-- 电子邮箱 -->
        <div class="replacePhone" v-show="showType === '2'">
          <div class="boxMain" v-show="!isbindEmail">
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

          <div class="boxMain" v-show="isbindEmail">
            <h5 class="email-title">验证邮件已发送至您的邮箱：
              <span>{{email}}</span>，请找来自彩天堂娱乐的验证邮箱， 开启邮件后查看并输入
              <span>【验证码】</span>完成邮箱绑定。
            </h5>
            <div class="yzCode">
              <h4 class="fl">邮箱验证码：</h4>
              <div class="selInput fl" :class="!btns && yzCode !== ''?'errborder':''">
                <input type="text" placeholder="请输入验证码" class="fl" v-model="yzCode" @input="checkCode" />
              </div>
              <span class="yzCodeBtn fl" style="width:150px" v-show="!isCountFinish" @click="emailCode">重新发送邮箱验证码</span>
              <!-- <span class="yzCodeBtn renew fl" v-show="isCountFinish">{{countTime}}s 后重新发送</span> -->
            </div>
            <div class="errTips">
              <div v-if="login_pass_error">
                <i class="icon_v3">&#xe645;</i>{{login_pass_error}}</div>
            </div>
            <div class="tips">如果半小时内没有收到邮件，请到邮箱的广告邮件，垃圾邮件列表找找或者联系客服，由客服帮您解决。</div>
            <div class="submit" @click="btns && bindEmail()">
              <span :class="btns?'active':''">提交</span>
            </div>
          </div>
        </div>

        <!-- 资金密码 -->
        <div class="replacePhone" v-if="showType === '3'">
          <div class="boxMain" v-if="isShowFunds">
            <h5 style="text-align: center">资金密码会在发生提款等交易金额时使用</h5>
            <div class="phoneNum">
              <h4 class="fl">设置资金密码：</h4>
              <div class="selInput fl" :class="pass!=''&&!verificationSetFundPsw?'errborder':''">
                <input type="password" placeholder="请输入密码" class="fl" v-model="pass" />
              </div>
            </div>
            <div class="errTips">
              <div v-if="pass!=''&&!verificationSetFundPsw">
                <i class="icon_v3">&#xe645;</i>密码须为8-24位字符</div>
            </div>
            <div class="phoneNum">
              <h4 class="fl">确认资金密码：</h4>
              <div class="selInput fl" :class="rePassword !== pass && verificationSetFundPsw?'errborder':''">
                <input type="password" placeholder="请再次输入密码" class="fl" v-model="rePassword" />
              </div>
            </div>
            <div class="errTips">
              <div v-if="rePassword !== pass&& verificationSetFundPsw">
                <i class="icon_v3">&#xe645;</i>{{login_pass_error1}}</div>
            </div>
            <div class="submit" @click="rePassword === pass && verificationSetFundPsw && setFundsPass()">
              <span :class="rePassword === pass&& verificationSetFundPsw?'active':''">提交</span>
            </div>
          </div>

          <div class="boxMain" v-if="!isShowFunds">
            <div class="phoneNum">
              <h4 class="fl">旧密码：</h4>
              <div class="selInput fl" :class="oldPassword!=''&&!verificationFundPsw?'errborder':''">
                <input type="password" placeholder="请输入旧密码" class="fl" v-model="oldPassword" />
              </div>
            </div>
            <div class="errTips">
              <div v-if="oldPassword!=''&&!verificationFundPsw">
                <i class="icon_v3">&#xe645;</i>{{resetPwdErroe?resetPwdErroe:'密码格式不正确！'}}</div>
            </div>
            <div class="phoneNum">
              <h4 class="fl">新密码：</h4>
              <div class="selInput fl" :class="pass!=''&&!verificationNewFundPass && verificationFundPsw?'errborder':''">
                <input type="password" placeholder="请输入新密码" class="fl" v-model="pass" />
              </div>
            </div>
            <div class="errTips">
              <div v-if="pass!=''&&!verificationNewFundPass && verificationFundPsw">
                <i class="icon_v3">&#xe645;</i>密码须为8-24位字符</div>
            </div>
            <div class="phoneNum">
              <h4 class="fl">确认密码：</h4>
              <div class="selInput fl" :class="rePassword !== pass&& verificationNewFundPass && verificationFundPsw?'errborder':''">
                <input type="password" placeholder="请再次输入密码" class="fl" v-model="rePassword" />
              </div>
            </div>
            <div class="errTips">
              <div v-if="rePassword !== pass&& verificationNewFundPass && verificationFundPsw">
                <i class="icon_v3">&#xe645;</i>两次输入密码不一致</div>
            </div>
            <div class="submit" @click="rePassword === pass&& verificationNewFundPass && verificationFundPsw&& sendResetFunds()">
              <span :class="rePassword === pass&& verificationNewFundPass && verificationFundPsw?'active':''">提交</span>
            </div>
          </div>
        </div>

        <!-- 登陆密码 -->
        <div class="replacePhone" v-if="showType === '4'">
          <div class="boxMain" v-if="true">
            <div class="phoneNum">
              <h4 class="fl">旧密码：</h4>
              <div class="selInput fl" :class="oldPassword!='' &&!verificationOldPass?'errborder':''">
                <input type="password" placeholder="请输入旧密码" class="fl" v-model="oldPassword" />
                <!-- <input type="password" placeholder="请输入旧密码" class="fl" v-model="oldPassword"  @input="userOldPassword"/> -->
              </div>
            </div>
            <div class="errTips">
              <div v-if="oldPassword!='' &&!verificationOldPass">
                <i class="icon_v3">&#xe645;</i>{{resetPwdErroe?resetPwdErroe:'密码格式不正确！'}}</div>
            </div>
            <div class="phoneNum">
              <h4 class="fl">新密码：</h4>
              <div class="selInput fl" :class="verificationOldPass && newPassword != '' && !verificationNewPass?'errborder':''">
                <input type="password" placeholder="请输入新密码" class="fl" v-model="newPassword" />
                <!-- <input type="password" placeholder="请输入新密码" class="fl" v-model="newPassword"  @input="userPassword"/> -->
              </div>
            </div>
            <div class="errTips">
              <div v-if="verificationOldPass && newPassword != '' && !verificationNewPass">
                <i class="icon_v3">&#xe645;</i>密码须为6-24位字符</div>
            </div>
            <div class="phoneNum">
              <h4 class="fl">确认密码：</h4>
              <div class="selInput fl" :class="rePassword!==newPassword&&verificationOldPass&& verificationNewPass?'errborder':''">
                <input type="password" placeholder="请再次输入密码" class="fl" v-model="rePassword" />
              </div>
            </div>
            <div class="errTips">
              <div v-if="rePassword!==newPassword&&verificationOldPass&& verificationNewPass">
                <i class="icon_v3">&#xe645;</i>两次输入密码不一致</div>
            </div>
            <div class="submit" @click="verificationOldPass && verificationNewPass && rePassword===newPassword && sendResePass()">
              <span :class="verificationOldPass && verificationNewPass && rePassword===newPassword?'active':''">提交</span>
            </div>
          </div>
        </div>

        <!-- 手机号注册时设置用户名 -->
        <div class="replacePhone" v-if="showType === '5'">
          <div class="boxMain" v-if="true">
            <div class="phoneNum">
              <h4 class="fl">用户名：</h4>
              <div class="selInput fl" :class="username!='' &&!verificationSetUsername?'errborder':''">
                <input type="text" placeholder="请输入用户名" class="fl" v-model="username" />
              </div>
            </div>
            <div class="errTips">
              <div v-if="username!='' &&!verificationSetUsername">
                <i class="icon_v3">&#xe645;</i>{{resetPwdErroe?resetPwdErroe:'格式不正确！'}}</div>
            </div>
            <div class="phoneNum">
              <h4 class="fl">登录密码：</h4>
              <div class="selInput fl" :class="!verificationOldPass && oldPassword != '' && verificationSetUsername?'errborder':''">
                <input type="password" placeholder="请输入登录密码" class="fl" v-model="oldPassword" />
              </div>
            </div>
            <div class="errTips">
              <div v-if="!verificationOldPass && oldPassword != '' && verificationSetUsername">
                <i class="icon_v3">&#xe645;</i>密码须为6-24位字符</div>
            </div>
            <div class="phoneNum" v-if="isBindWithdrawPassword">
              <h4 class="fl">资金密码：</h4>
              <div class="selInput fl" :class="verificationOldPass&& verificationSetUsername&&pass!=''&&!verificationSetFundPsw?'errborder':''">
                <input type="password" placeholder="请输入资金密码" class="fl" v-model="pass" />
              </div>
            </div>
            <div class="errTips">
              <div v-if="verificationOldPass&& verificationNewPass&&pass!=''&&!verificationSetFundPsw">
                <i class="icon_v3">&#xe645;</i>两次输入密码不一致</div>
            </div>
            <div class="submit" @click="verificationOldPass && verificationNewPass && rePassword===newPassword && setUsername()">
              <span :class="verificationOldPass && verificationNewPass && rePassword===newPassword?'active':''">提交</span>
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
// const REG = matchReg;
export default {
  data() {
    return {
      phone: "", // 手机号
      imgYzCode: "", // 图片验证码
      isCaptcha: false, //图片验证码是否显示
      email: "",
      cellphone: "17688532922", // 绑定的手机号
      yzCode: "", // 手机验证码
      showType: ITEM.get("showType"),
      itemType: ITEM.get("itemType"),
      isphone: false, // 是否符合规则
      login_pass_error1: "两次密码不一致！",
      login_pass_error: "",
      send_code_error: "",
      formObj: constructObj(),
      //   bankList: [], // 获取可绑定银行卡列表
      isBindBank: true, // 是否显示绑定银行卡页面
      nickNameNote:
        "（提款的时候只能用真实姓名操作，不能填写字母、数字、特殊字符。)", // 取款人提示信息
      bankNumberNote: "由16或19位数字组成，请填写银行借记卡。",
      backNmaeNote: "填写支行名称遇到问题，请联系客服。", // 支行错误提示
      fundsPwdNote: "最少要输入 8 个字符",
      bankNumberNoteAgain: "", // 重复银行卡号
      openBank: "", // 开户银行
      selectedProvince: provinces[0],
      selectedCity: 0,
      selectedBlock: 0,
      cities: 0,
      provinces,
      blocks: 0,
      bankNumberAgain: "", //重复银行号
      nickNames: "", // 取款人姓名
      category: [
        { value: "card_01", name: "信用卡" },
        { value: "card_02", name: "储蓄卡" },
        { value: "card_03", name: "借记卡" }
      ], // 卡类型
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
        {
          value: "60",
          label: "马来西亚   +60"
        },
        {
          value: "63",
          label: "菲律宾   +63"
        },
        {
          value: "01",
          label: "美国   +001"
        }
      ]
    };
  },
  components: {
    breadNav
  },
  watch: {
    selectedProvince(newVal, oldVal) {
      // 港澳台数据只有一级,特殊处理
      if (
        newVal.sheng === "71" ||
        newVal.sheng === "81" ||
        newVal.sheng === "82"
      ) {
        console.log(1111);

        this.cities = [newVal];
        this.blocks = [newVal];
      } else {
        console.log(222);

        this.cities = this.provinces.filter(item => {
          if (item.level === 2 && item.sheng && newVal.sheng === item.sheng) {
            return true;
          }
        });
      }
      // 此时在渲染DOM,渲染结束之后再选中第一个
      Vue.nextTick(() => {
        this.selectedCity = this.cities[0];
        this.$emit("input", this.info);
      });
    },
    selectedBlock() {
      Vue.nextTick(() => {
        this.$emit("input", this.info);
      });
    },
    selectedCity(newVal) {
      // 选择了一个市,要选择区了 di是城市的代表,sheng
      if (
        newVal.sheng === "71" ||
        newVal.sheng === "81" ||
        newVal.sheng === "82"
      ) {
        this.blocks = [newVal];
        this.cities = [newVal];
      } else {
        this.blocks = this.provinces.filter(item => {
          if (
            item.level === 3 &&
            item.sheng &&
            item.sheng == newVal.sheng &&
            item.di === newVal.di &&
            item.name !== "市辖区"
          ) {
            return true;
          }
        });
      }
      Vue.nextTick(() => {
        this.selectedBlock = this.blocks[0];
        // 触发与 v-model相关的 input事件
        this.$emit("input", this.info);
      });
    }
  },
  computed: {
    ...mapState([
      "isBindPhone", // 是否显示绑定手机号界面
      "replacePhone", // 是否显示绑定邮箱界面
      "isShowFunds", // 是否显示资金密码修改界面
      "ismodifyEmail", // 是否显示更换邮箱界面
      "isbindEmail", // 是否显示绑定邮箱界面
      "bankList" // 获取可绑定银行卡列表
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
    // 验证修改资金密码
    verificationFundPsw() {
      return verifyRule.fundPsw.reg.test(this.oldPassword);
    },
    // 验证资金新密码
    verificationNewFundPass() {
      return verifyRule.fundPsw.reg.test(this.pass);
    },
    // 验证设置资金密码
    verificationSetFundPsw() {
      return verifyRule.fundPsw.reg.test(this.pass);
    },
    // 验证设置邮箱
    verificationEmail() {
      return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(this.email);
    },
    // 验证用户名
    verificationSetUsername() {
      return /^[\u4e00-\u9fa5]+$/.test(this.username);
    },
    // 验证银行卡号
    verficationBankNumber() {
      return /^([1-9]{1})(\d{15}|\d{17}|\d{18})$/.test(this.bankNumber);
    },
    // 验证银行卡开号网点
    verficationBankName() {
      return /^[\u4e00-\u9fa5]+$/.test(this.bankName);
    },
    info() {
      return {
        province: this.selectedProvince,
        city: this.selectedCity,
        block: this.selectedBlock
      };
    }
  },
  watch: {},
  methods: {
    ...mapMutations(["setData"]),
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
    // 修改登录密码
    sendResePass() {
      if (this.oldPassword === this.newPassword) {
        this.resetPwdErroe = "新旧密码相同,请重新输入！！";
        this.oldPassword = "false";
        return false;
      }
      if (this.verificationOldPass && this.verificationNewPass) {
        init.userContent.resetPwd(this);
      }
    },
    // 设置资金密码
    setFundsPass() {},
    // 修改资金密码
    sendResetFunds() {
      if (this.oldPassword === this.pass) {
        this.resetPwdErroe = "新旧密码相同";
        this.oldPassword = "false";
        return false;
      }
      if (this.verificationFundPsw && this.verificationNewFundPass) {
        init.userContent.resetFundsPwd(this);
      }
    },
    // 检验邮箱
    checkEmail() {
      let that = this;
      if (!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(that.email)) {
        that.login_pass_error = "请输入真实有效的电子邮箱";
        that.btns = false;
        return false;
      } else {
        that.login_pass_error = "";
        that.btns = true;
      }
    },
    // 更换邮箱下一步
    nextEmail() {
      let _this = this;
      let options = {
        email:this.email
      }
      _this.$http.post('/yx/u/api/personal/send-email',options).then(res=>{
        let data = res.body;
        console.log(data);
        
      })
      this.setData({ key: "isbindEmail", value: true });
      this.btns = false;
    },
    // 绑定邮箱
    bindEmail() {},
    emailCode() {
      // App.alert('info', '提示消息', '邮箱验证码已发送至邮箱'+this.email+'请注意查收！', 3000);
    },
    // 设置用户名
    setUsername() {
      this.isBindBank = false;
    },
    //重新输入
    renew() {
      this.isBindBank = true;
      this.username = this.bankNumber = this.bankNumberAgain = this.openBank = this.banlCategory = this.province = this.city = this.area = this.bankName =
        "";
    },
    // 发送请求绑定银行卡
    setUsernameNext() {
      init.userContent.resetUsername(this);
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
      let that = this;
      let options = {
        name: this.phone,
        yanzCode: this.imgYzCode
      };
      if (this.phone && verifyRule.verifyImg.reg.test(this.imgYzCode)) {
        that.$http
          .post("/yx/validate-reset-login-pwd", options, { emulateJSON: true })
          .then(response => {
            console.log(response);
          });
      }
      // this.RefreshSrc();
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
      this.isCountFinish = true;
      if (that.verificationMobile) {
        getVerifyCode(this, options);
      }
    },
    // 修改手机前的验证码
    modifyMoblieCode() {
      let that = this;
      let options = {
        phoneNum: that.cellphone,
        capchaCode: that.imgYzCode,
        checkUnique: false,
        type: 1
      };
      this.isCountFinish = true;
      // if(that.verificationMobile ){
      getVerifyCode(this, options);
      // }
    },
    // 修改手机号的下一步
    nextTempo() {
      let _this = this;
      let options = {
        phoneNum: _this.cellphone,
        phYzCode: _this.yzCode
      };
      _this.$http
        .post("/yx/verification-phone-code", options, { emulateJSON: true })
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
            clearInterval(timer);
            _this.countTime = 60;
            _this.isCountFinish = false;
          }
          _this.send_code_error = data.message;
        });
    },
    // 绑定手机号
    setMobile() {
      let that = this;
      if (!this.verificationMobile) {
        return;
      }
      if (!this.verificationMobileCode) {
        return;
      }
      this.$http
        .post(
          "/yx/u/api/account/bind-phone",
          { phone: that.phone, phYzCode: that.yzCode },
          { emulateJSON: true }
        )
        .then(res => {
          let data = res.body;
          console.log(data);
          that.getAccoutStatus();
          if (data.code === 0) {
            that.mobileShow = false;
            that.$Modal.al_default({
              status: "warning",
              content: "手机号绑定成功"
            });
            location.href = "/userDetail";
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
    }
  },
  created() {
    this.RefreshSrc();

    // 数据初始化,默认选中北京市,默认选中第一个;北京市数据为总数据的前18个
    let beijing = this.provinces.slice(0, 19);
    this.cities = beijing.filter(item => {
      if (item.level === 2) {
        return true;
      }
    });
    this.selectedCity = this.cities[0];
    this.blocks = beijing.filter(item => {
      if (item.level === 3) {
        return true;
      }
    });
    this.selectedBlock = this.blocks[0];
  }
};
</script>
<style lang="less" scoped>
  @import "../less/global.less";
  .warpper-con {
    width: 100%;
    height: 100%;
    margin-top: 0px;
    .warpper-form {
      width: 100%;
      height: 100%;
      .form-main {
        width: 100%;
        height: 96%;
        border: 1px solid #e3e3e3;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        .replacePhone {
          .boxMain {
            overflow: hidden;
            div.banKDetail{
              width: 100%;
              background: #F6F6F6;
              border: 1px solid #ccc;
              padding: 10px 10px 10px 30px;
              text-align: left;
              margin-bottom: 20px;
              p{
                line-height: 2.5;
                color: #A7A7A7;
                font-size: 14px;
                span{
                  color: #333;
                }
                .nameDetail{
                  color: @themeColor;
                }
              }
            }
            h5 {
              margin-bottom: 20px;
              text-align: left;
              span {
                color: #f53b4a;
              }
            }
            .country,
            .phoneNum,
            .yzCode {
              height: 44px;
              // overflow: hidden;
              h4 {
                width: 84px;
                height: 44px;
                line-height: 44px;
                text-align: right;
              }
            }
            .country {
              // margin-bottom: 10px;
              .selInput {
                width: 250px;
                height: 44px;
                line-height: 44px;
                .selCountry {
                  display: block;
                  width: 250px;
                  height: 44px;
                  line-height: 44px;
                }
              }
            }
            .phoneNum {
              clear: both;
              // margin-top: 20px;
              .selInput {
                width: 364px;
                height: 44px;
                position: relative;
                .nickNames{
                  text-align: left;
                  color: @themeColor;
                  line-height: 42px;
                }
                .replaceCell {
                  display: inline-block;
                  width: 364px;
                  height: 44px;
                  line-height: 44px;
                  text-align: left;
                  border: 1px solid #d8d8d8;
                  border-radius: 5px;
                  padding-left: 8px;
                }
                input {
                  width: 362px;
                  height: 42px;
                  line-height: 44px;
                  border: 1px solid #d8d8d8;
                  border-radius: 5px;
                  padding-left: 8px;
                  outline: none;
                }
                .success {
                  position: absolute;
                  color: #148eff;
                  top: 10px;
                  right: 10%;
                }
                .clearAll {
                  position: absolute;
                  color: #cccccc;
                  top: 10px;
                  right: 3%;
                  cursor: pointer;
                }
                p {
                  color: @themeColor;
                  text-align: left;
                  padding-left: 10px;
                }
              }
              .errborder {
                //border: 1px solid @themeColor;
                //border-radius: 5px;
              }
            }
            .emailMain{
              display: flex;
              justify-content: center;
            }
            .yzCode {
              clear: both;
              // margin-top: 10px;
              .selInput {
                width: 250px;
                height: 44px;
                input {
                  width: 248px;
                  height: 42px;
                  line-height: 44px;
                  border: 1px solid #d8d8d8;
                  border-radius: 5px;
                  padding-left: 8px;
                  outline: none;
                }
                .ivu-input {
                  height: 44px;
                }
              }
              .replaceCell {
                display: inline-block;
                width: 364px;
                height: 44px;
                line-height: 44px;
                text-align: left;
                border: 1px solid #d8d8d8;
                border-radius: 5px;
                padding-left: 8px;
                .imgInput {
                  border: none;
                  padding: 0;
                }
                .imgyzCode {
                  width: 106px;
                  height: 42px;
                  border-left: 1px solid #d8d8d8;
                  margin: 0;
                  overflow: hidden;
                  cursor: pointer;
                  img {
                    width: 100%;
                    height: 100%;
                    vertical-align: top
                  }
                }
              }
              .errborder {
                border: 1px solid @themeColor;
                border-radius: 5px;
              }
              .yzCodeBtn {
                width: 104px;
                height: 44px;
                border: 1px solid @themeColor;
                line-height: 44px;
                text-align: center;
                border-radius: 5px;
                color: @themeColor;
                cursor: pointer;
                margin-left: 10px;
              }
              .renew {
                background: #ffe7e7;
              }
            }
            .submit {
              margin-top: 40px;
              span {
                display: inline-block;
                width: 180px;
                height: 44px;
                line-height: 44px;
                font-size: 18px;
                color: #adadad;
                cursor: pointer;
                background: #e1e1e1;
                border-radius: 25px;
                margin-left: 10%;
              }
              .active {
                background: @themeColor;
                color: #fff;
              }
              .renew{
                background: #E1E1E1;
                color: #333;
                margin-right: 20px;
              }
            }
            .tips {
              width: 100%;
              font-size: 13px;
              color: #333;
              text-align: left;
              margin-top: 30px;
            }
            .errTips {
              width: 360px;
              height: 20px;
              line-height: 20px;
              text-align: left;
              color: @themeColor;
              position: relative;
              left: 85px;
              overflow: hidden;
              div{
                width: 100%;
                height: 100%;
              }
              .icon_v3 {
                vertical-align: middle;
                margin-right: 3px;
                font-size: 14px;
              }
            }
          }
        }
      }
    }
  }
</style>
