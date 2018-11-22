<template>
  <div class="userContent-warpper">
    <div class="warpper-content">
      <div class="centerMain fl">
        <div class="onePart" >
          <div class="centerMain-title">
            <h2>资产明细：</h2>
            <div class="lotteryDetail">
              <div class="lotteryDetail_left fl">
                <div class="lotteryDetail_left_top">
                  <div class="lotery_left fl">
                    <div class="lotteryImg fl" > <img src="./img/icon_qianbao.png"/></div>
                    <div class="lotteryDetail_left_mian lotteryLine fl">
                      <div class="loteeryTitle">账户余额：</div>
                      <div class="loteeryNumber">￥{{Number(baseInfo.lotteryBalance).toFixed(4)}}<em class="icon_v3" :class="{'tran':isUpdata1}" @click="!isUpdata&&updata1()">&#xe663;</em></div>
                      <div class="transferBtn" @click="goRecharge">充值</div>
                    </div>
                  </div>
                  <div class="lotery_left lotery_right fl">
                    <div class="lotteryImg fl"><img src="./img/icon_keti_money.png"/></div>
                    <div class="lotteryDetail_left_mian fl">
                      <div class="loteeryTitle">可提现金额：</div>
                      <div class="loteeryNumber">￥{{Number(baseInfo.lotteryBalance).toFixed(4)}}<em class="icon_v3" :class="{'tran':isUpdata1}" @click="!isUpdata&&updata1()">&#xe663;</em></div>
                      <div class="transferBtn withdrawBtn" @click="goWithdraw">提现</div>
                    </div>
                    </div>
                  </div>
                  <div class="lotteryDetail_left_bottom">
                    <div class="detailsThree fl">
                      <p>KY钱包</p>
                      <p class="oddMoney">￥{{Number(platformBalance.ky_01).toFixed(2)}}</p>
                    </div>
                    <div class="detailsThree fl">
                      <p>AG钱包</p>
                      <p class="oddMoney">￥{{Number(platformBalance.agin_01).toFixed(2)}}</p>
                    </div>
                    <div class="detailsThree fl">
                      <p>IM钱包</p>
                      <p class="oddMoney">￥{{Number(platformBalance.im_01).toFixed(2)}}</p>
                    </div>
                    <div class="detailsThree fl">
                      <p>虚拟币钱包</p>
                      <p class="virtual">未开通</p>
                    </div>
                  </div>
                </div>
                <div class="lotteryDetail_right fl">
                  <div class="lotteryDetail_right_box fl">
                    <div class="transferInput"><input type="text" placeholder="请输入金额" v-model="money" @blur='verficationMoney'></div>
                    <div class="transferbag">
                      <Select class="sel" data-type="static-bigger" v-model="nowBanlance"  name="fromacc">
                        <Option v-for="(v,i) in banlanceList" :key="i" :value="v.value">{{v.label}}</Option>
                      </Select>
                    </div>
                    <div class="transferbagBtn" @click="transfer">转账</div>
                  </div>
                  <div class="conversion fl"><em class="icon_v3" @click="conversionTransfer();isConversion=!isConversion">&#xe66e;</em></div>
                </div>
              </div>

              <!-- <div class="detailOne">
                <div class="fl">
                  <span>可提金额：</span>
                  <span class="withdraw">￥{{Number(baseInfo.lotteryBalance).toFixed(4)}}
                  </span>
                  <span class="btnText withdrawBtn fr " @click="goWithdraw">提现</span>
                </div>
                <div class="fl">
                  <span>第三方游戏：</span>
                  <span class="totalMoney">￥{{(Number(platformBalance.im_01)+Number(platformBalance.ky_01)+Number(platformBalance.agin_01)).toFixed(2)}}
                    <em class="icon_v3" :class="{'tran':isUpdata}" @click="!isUpdata&&updata()">&#xe663;</em></span>
                </div>
              </div> -->
              <!-- <div class="detailTwo">
                <div class="fl">
                  <span>钱包金额：</span>
                  <span class="wallet">￥{{Number(baseInfo.lotteryBalance).toFixed(4)}}
                    <em class="icon_v3" :class="{'tran':isUpdata1}" @click="!isUpdata&&updata1()">&#xe663;</em>
                  </span>
                  <span class="btnText fr" @click="goRecharge">充值</span>
                </div>
                <div class="fl">
                  <input type="text" placeholder="请输入金额" v-model="money" @blur='verficationMoney'>
                  <span class="unit">元</span>
                  <i class="icon_v3">&#xe713;</i>
                  <div class="transfer">
                    <Select class="sel" data-type="static-bigger" v-model="nowBanlance" name="fromacc">
                      <Option v-for="(v,i) in banlanceList" :key="i" :value="v.value">{{v.label}}</Option>
                    </Select>
                  </div>
                  <span class="btnText transferBtn fr" @click="transfer">转账</span>
                </div>
              </div> -->
              <!-- <div class="detailThree">
                <div class="fl">
                  <p class="odd fl">
                    <span>KY钱包：</span>
                    <span class="oddMoney">￥{{Number(platformBalance.ky_01).toFixed(2)}}</span>
                  </p>
                  <p class="odd fr" style="border:none">
                    <span>AG钱包</span>
                    <span class="oddMoney">￥{{Number(platformBalance.agin_01).toFixed(2)}}</span>
                  </p>
                </div>
                <div class="fl">
                  <p class="odd fl">
                    <span>IM钱包：</span>
                    <span class="oddMoney">￥{{Number(platformBalance.im_01).toFixed(2)}}</span>
                  </p>
                  <p class="fr">
                    <span>虚拟币钱包:</span>
                    <span class="virtual">未开通</span>
                  </p>
                </div>
              </div> -->
            </div>
            <div class="vipMsg">
              <h2>vip信息：</h2>
              <div class="vipDetail">
                <!-- <table>
                  <thead>
                    <tr>
                      <td :class="v.cla" v-for="(v,i) in vipMenu" :key="i">
                        <h3>{{v.name}}</h3>
                      </td>
                      <td class="advance">
                        <h3 class="fl">晋级VIP</h3>
                        <i class="icon_v3 cursor fl" @click="vipDetails">&#xe661;</i>
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div class="vipImg"><img src="img/user/IC_HJW-JCB.png" alt=""></div>
                        <div class="vipHJ">黄金玩家</div>
                      </td>
                      <td>
                        <p>
                          <i class="vipCount">1</i>每日签到领取专属现金奖励，专线客服让你畅玩无忧。</p>
                        <p>
                          <i class="vipCount">2</i>每日签到领取专属现金奖励，专线客服让你畅玩无忧。</p>
                        <p>
                          <i class="vipCount">3</i>每日签到领取专属现金奖励，专线客服让你畅玩无忧。</p>
                      </td>
                      <td>
                        <p>只要在进行888有效投注，即可升级为砖石玩家，加油喔！</p>
                      </td>
                      <td>
                        <div class="vipImg"><img src="img/user/IC_ZSWJCB.png" alt=""></div>
                        <div class="vipZS">钻石玩家</div>
                      </td>
                    </tr>
                  </tbody>
                </table> -->
              </div>
            </div>
            <div class="cradMsg">
              <h2>银行卡信息：</h2>
              <addCards></addCards>
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
  inputlineBtn,
  Prompt,
  registerInit,
  getVerifyCode,
  getThreeAllMoney
} from "@/js/index.js";
import { verifyRule } from "@/js/const.js";
import userDetail from "./userDetail.vue";
import addCards from "./addCards.vue";
import { mapState, mapMutations } from "vuex";
// import base from "@/js/pubilc.js";
import md5 from 'js-md5';

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
let getSrcSafe = registerInit();
let init = {
  userHeader: userInit(),
  userContent: userConter()
};
let oPrompt = Prompt();
let count = 0; //银行卡移动的倍数
// const ITEM = base.storage();
export default {
  data() {
    return {
      vipMenu:[
        {name:'当前等级',cla:'grade'},
        {name:'当前福利',cla:'welfare'},
        {name:'晋级条件',cla:'condition'},
      ],
      vipContent:[
        {content:'',cla:''},
        {content:'',cla:''},
        {content:'',cla:''},
        {content:'',cla:''},
      ],
      onePart: true, //是否显示个人中心
      secPart: false, //是否显示账户中心
      isUpdata1: false,// 是否可以点击刷新按钮---钱包
      isUpdata: false,// 是否可以点击刷新按钮---第三方游戏
      active: 0,
      height: document.documentElement.clientHeight,
      width: document.documentElement.clientWidth,
      isBindWithdrawPassword: null,
      initColor:
        localStorage.getItem("_bgIndex") !== "undefined"
          ? localStorage.getItem("_bgIndex")
          : 1,
      resetPwd: false,
      safetySrc: "",
      isCountFinish: false,
      countTime: 60,
      info: {},

      bindBankList: [], // 已绑定银行卡列表
      bankList: [], // 获取可绑定银行卡列表
      bindBankLists: [],
      realName: "",
      nickNames: "",
      isAddBank: true,
      isCloseUserData: false,
      isuserbank:
        localStorage.getItem("_bankCard") !== "undefined"
          ? localStorage.getItem("_bankCard")
          : false,
      isbindBg: false, //

      nickNameNote:
        "（提款的时候只能用真实姓名操作，不能填写字母、数字、特殊字符。)", // 取款人提示信息
      bankNumberNote: "由16或19位数字组成，请填写银行借记卡。",
      backNmaeNote: "填写支行名称遇到问题，请联系客服。", // 支行错误提示
      fundsPwdNote: "最少要输入 8 个字符",
      bankNumberNoteAgain: "",
      openBank: "", // 开户银行
      bankNumber: "",
      bankName: "", // 支行名称
      bankNumberAgain: "",
      fundsPwd: "",
      isSendData: true,
      receiveError: "",
      resetPwdErroe: "",
      oldPassword: "",
      newPassword: "",
      rePassword: "",
      replaceTitle: "登录密码",
      loginTime: "", // 上次登录时间
      clientIp: "", // ip
      loginListInfo: [], // 最近登录日志
      timer: null,
      formObj: constructObj(),
      isConversion:false,   // 是否转换方向
      // 提示问题
      oldPasswordTip: "",
      newPasswordTip: "",
      rePasswordTip: "",
      // 用户名设置相关
      usernameShow: false,
      login_pass_error: "",
      login_pass_error1: "",
      // 手机绑定相关
      mobileShow: false,
      // 第三方钱包
      im_01Banlance: "",
      ky_01Banlance: "",
      agin_01Banlance: "",
      lotteryBalance: 0, //余额
      availableBanlance: 0, //可提现余额
      totalBanlance: 0, //总资产
      isShowLeftBtn: false,
      turnOut:'sobet_01', // 转出账户
      nowBanlance: "sobet_02",
      money: null,
      banlanceList: [
        {
          label: "请选择钱包类型",
          value: "sobet_02"
        },
        {
          label: "KY钱包",
          value: "ky_01"
        },
        {
          label: "AG钱包",
          value: "agin_01"
        },
        {
          label: "IM钱包",
          value: "im_01"
        },
      ]
    };
  },
  components: {
    userDetail,
    addCards
  },
  computed: {
    ...mapState(['baseInfo','platformBalance'])
  },
  watch: {
    money(aft){
      let nowBanlance = this.nowBanlance
      if(this.isConversion){
        console.log(this.platformBalance[nowBanlance]);
        if(aft>Number(this.platformBalance[nowBanlance])){
          this.money = parseInt(this.platformBalance[nowBanlance])
        }
      }else{
        if(aft>this.baseInfo.lotteryBalance){
          this.money = parseInt(this.baseInfo.lotteryBalance)
        }
      }
    },
  },

  methods: {
    ...mapMutations(['setData','setBread','setBreadMore']),
    init() {
      this.getThreeMoney();
      this.getBanlance();
    },
    // 刷新余额
    updata() {
      this.isUpdata = true// 不可以点击刷新
      setTimeout(function () {
        this.getThreeMoney()
      }.bind(this),1000)
    },
    updata1() {
      this.isUpdata1 = true// 不可以点击刷新
      this.$store.commit('setBaseInfo', {lotteryBalance: '0.00'})
      setTimeout(function () {
        userInit().initlotteryBalance(this)// 刷新金额
        this.isUpdata1 = false// 可以点击刷新
      }.bind(this),1000)
    },
    // vip的弹框信息
    vipDetails() {
      this.$Modal.al_openLottery({ status: "warning", content: "暂未开放" });
    },
    // 去提现界面
    goWithdraw() {
      this.$router.push('/userCenters/withdraw')
    },
    // 去充值页面
    goRecharge() {
      this.$router.push('/userCenters/recharge')
    },
    // 失去焦点检查金额
    verficationMoney() {
      if(!/(^[1-9]+\d*$)/.test(this.money)) {
        this.money = ''
      }
    },
    // 转换转账的方向
    conversionTransfer(){
      this.money = ''
      this.nowBanlance = "sobet_02"
      if(this.isConversion){
        $('.transferInput').css({top: '0px'})
        $('.transferbag').css({ top: '0px'})
      }else{
        $('.transferInput').css({ top: '54px' })
        $('.transferbag').css({ top: '-54px' })
      }
    },
    // 转账到第三方钱包
    transfer() {
      let _this = this;
      if(!_this.money) {
        this.$Modal.al_openLottery({status:'warning', content:'请输入转账金额',time:3000})
        return false
      }
      if(_this.nowBanlance === 'sobet_02') {
        this.$Modal.al_openLottery({status:'warning',content:'请选择要转入或转出的账户',time:3000})
        return false
      }
      this.$http.post('/yx/api/i/u/bank/playerTransferRefreshToken').then(res=>{
        if(res.body.code === 0) {
          let option1 = {
            turnOut: _this.turnOut,
            turnIn: _this.nowBanlance,
            cash: _this.money,
            token:res.body.data,
            // payPasswd:md5(111)
          }
          let option2 = {
            turnOut: _this.nowBanlance,
            turnIn: _this.turnOut,
            cash: _this.money,
            token:res.body.data,
            // payPasswd:md5(111)
          }
          _this.$http.post('/yx/api/i/u/bank/playerTransfer',this.isConversion?option2:option1,{emulateJSON: true}).then(res=>{
            let data = res.body;
            if(data.code === 0) {
              _this.getThreeMoney();
              // this.$Modal.al_openLottery({status:'success',content:data.data,time:3000})
              this.$Modal.al_default({status:'success',content:data.data,onOk:this.transferOk()})
            }else{
              this.$Modal.al_default({status:'warning',content:data.message})
            }
          })
        }
      })

    },
    // 转账成功将金额附空
    transferOk() {
      this.money = ''
      this.nowBanlance = 'sobet_02'
    },
    // 获取第三方钱包余额
    getThreeMoney() {
      let that = this;
      getThreeAllMoney(this)
      // this.$http.post("/yx/api/i/u/bank/getPcodeCbBaseList").then(response => {
      //   let res = response.body;
      //   if(res.code === 0){
      //     let balanceThird =[]
      //     for (let val of res.data) {
      //       balanceThird.push({[val.cbId]:val.balance})
      //     }
      //     let thridMOney = Object.assign({},...balanceThird);
      //     that.$store.commit('setPlatformBalance',thridMOney)
      //     that.im_01Banlance = thridMOney.im_01;
      //     that.ky_01Banlance = thridMOney.ky_01;
      //     that.agin_01Banlance = thridMOney.agin_01;
          that.isUpdata = false // 可以点击刷新
      //   }else{
      //     this.isUpdata = false// 可以点击刷新
      //   }
      // });
    },
    // 获取余额
    getBanlance() {
      // let that = this;
      // this.$http.post('yx/game-lottery/init-page'
      // ).then((response) => {
      //     let obj = response.body.data;
      // })
    },
  },
  mounted() {
    // if(!this.nickNames) {
    //     this.fundsPwdNote = '为了你的账户安全，请先设置资金密码，该密码用于验证您的资金操作。'
    // }
    //sendApi.checkgrade(this).checkClient(this).checkCard(this).loadBanks(this).getLoginListInfo(this);
    //window.lys_TransferAccount();
    // inputlineBtn();
    // // init.userHeader.initUserInfo(this);
    // init.userContent.checkgrade(this).checkCard(this).loadBanks(this)
    // if (!this.bindBankList.length) {
    //     this.bindBankLists = [5, 4, 3, 2, 1];
    // } else {
    //     for (let a = 5 - this.bindBankList.length; a > 0; a--) {
    //         this.bindBankLists.push(a);
    //     }
    // }
    // });
  },
  created() {
    this.init();
    this.setBread([{label: '个人中心',}, {label: '账户总览', url: '/userOverview'}])
		// this.setBreadMore([{label: '添加银行卡', url: '/addCard'}])
  },
  destroyed() {
  }
};
</script>
<style lang="less" scoped>
  @import "../less/global.less";
@keyframes tran {
  0%{transform: rotate(0deg)}
  100%{transform: rotate(360deg)}
}
.userContent-warpper {
  width: 100%;
  height: 100%;
  background: #f2f2f2;
  overflow: hidden;
  .warpper-content {
    width: 100%;
    height: 100%;
    margin: 0 auto;
    overflow: hidden;
    background: #fff;
    .centerNav {
      width: 226px;
      cursor: pointer;
      .userCenter,
      .financeCenter,
      .taskCenter,
      .reportCenter {
        .userCenter-title {
          width: 226px;
          height: 70px;
          background: #f6f6f6;
          text-align: center;
          line-height: 70px;
          cursor: pointer;
          .icon_v3 {
            color: @themeColor;
          }
          &:hover {
            background: @themeColor;
            color: #fff;
            .icon_v3 {
              color: #fff;
            }
          }
        }
        .active {
          background: @themeColor;
          color: #fff;
          .icon_v3 {
            color: #fff;
          }
        }
        .userCenter-nav {
          width: 226px;
          min-height: 64px;
          padding: 10px 0 10px 30px;
          line-height: 64px;
          p {
            height: 30px;
            line-height: 30px;
            text-align: left;
            span {
              display: inline-block;
              width: 80px;
              text-align: left;
              height: 30px;
              // line-height: 64px;
              &:hover {
                color: @themeColor;
              }
            }
            .active {
              color: @themeColor;
            }
          }
        }
      }
    }
    .centerMain {
      width: 100%;
      height: 100%;
      // border-left: 1px solid #f6f6f6;
      .onePart {
        width: 100%;
        height: 100%;
        .centerMain-title {
          h2 {
            text-align: left;
            font-size: 16px;
            padding-left: 12px;
            font-weight: normal;
            color:#333;
            width: 100%;
            height: 36px;
            line-height:36px;
            background:@userBg_Top;
            .bor(@userColor_bor);
          }
          .lotteryDetail {
            width: 100%;
            // max-width: 936px;
            height: 190px;
            .bor(@userColor_bor);
            border-top:none;
            .lotteryDetail_left{
              width:70%;
              height:100%;
              float: left;
              .lotteryDetail_left_top{
                border-right: 1px solid @userColor_bor;
                height: 127px;
                .lotery_left{
                  width:50%;
                  height:100%;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  border-right: 1px dotted @userColor_bor;
                  .lotteryImg{
                    // background: #FEE9EC;
                    border-radius: 50%;
                    width: 75px;
                    height: 75px;
                    padding-top: 3px;
                    margin-right: 15px;
                    text-align: center;
                    overflow:hidden;
                  }
                  .lotteryDetail_left_mian{
                    text-align: left;
                    color: #666666;
                    font-size:14px;
                    .loteeryNumber{
                      color:@userColor_money;
                      font-size:20px;
                      margin:10px 0px 10px 0;
                      em{
                        color:#b8b8b8;
                        margin:0px 0px 0px 10px;
                        cursor: pointer;
                        display: inline-block;
                      }
                      .tran{
                        animation: tran 0.5s linear alternate infinite;
                        cursor: not-allowed;
                      }
                    }
                    .transferBtn{
                      width: 57px;
                      height: 22px;
                      text-align: center;
                      line-height: 22px;
                      border-radius: 3px;
                      background-color: #fc6828;
                      color: #fff;
                      cursor: pointer;
                    }
                    .withdrawBtn{
                      background-color: @themeColor;
                    }
                  }
                  .lotteryLine{
                    // border-right: 1px dotted #ddd;
                    // padding-right: 14%;
                  }
                }
                .lotery_right{
                  border: none;
                  .lotteryImg{
                    background: #E6F1FF;
                    em{
                      color: #248BE4;
                    }
                  }
                }
              }
              .lotteryDetail_left_bottom{
                height:62px;
                width: 100%;
                clear: both;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-top: 1px solid @userColor_bor;
                border-right: 1px solid @userColor_bor;
                .detailsThree{
                  color: #666666;
                  border-right: 1px solid @userColor_bor;
                  width: 25%;
                  text-align: center;
                  .oddMoney{
                    color: @userColor_money;
                  }
                  .virtual{
                    color: #ccc;
                  }
                  &:last-child{
                    border:none;
                  }
                }
              }
            }
            .lotteryDetail_right{
              width:30%;
              height:100%;
              float: left;
              display: flex;
              justify-content: center;
              align-items: center;
              position: relative;
              .lotteryDetail_right_box{ 
                width: 80%;
                max-width: 223px;
                position: relative;
                .transferInput,.transferbag,.transferbagBtn{
                  width: 100%;
                  height: 36px;
                  margin-bottom: 18px;
                  transition: all 1s ease 0s;
                  position: relative;
                  top:0;
                }
                .transferInput{
                  input{
                    width: 100%;
                    height: 100%;
                    outline: none;
                    padding-left: 12px;
                    border-radius: 4px;
                    .bor(@userColor_bor);
                  }
                }
                .transferbagBtn{
                  background: linear-gradient(to right,@themeColor*1.3,@themeColor);
                  border-radius: 4px;
                  color: #fff;
                  font-size: 16px;
                  text-align: center;
                  line-height: 36px;
                  cursor: pointer;
                  margin-bottom: 0px;
                }
              }
              .conversion{
                width: 30px;
                height: 54px;
                .bor(@userColor_bor);
                border-left: none;
                position: relative;
                top: -15%;
                left: 0px;
                em{
                  color: @themeColor;
                  transform: rotate(90deg);
                  position: absolute;
                  top: 24%;
                  left: 70%;
                  background: #fff;
                  cursor: pointer;
                }
              }
            }
            // .detailOne,
            // .detailTwo,
            // .detailThree {
            //   width: 100%;
            //   height: 70px;
            //   line-height: 70px;
            //   div {
            //     width: 50%;
            //     max-width: 466px;
            //     height: 70px;
            //     padding-left: 16px;
            //     text-align: left;
            //     span{
            //       font-size: 14px;
            //       color: #333333;
            //     }
            //     &:first-child {
            //       border-right: 1px solid #ececec;
            //     }
            //     .withdraw {
            //       font-size: 18px;
            //       color: #3ca0fc;
            //     }
            //     .totalMoney {
            //       font-size: 18px;
            //       color: @themeColor;
            //     }
            //     .wallet {
            //       font-size: 18px;
            //       color: #000;
            //     }
            //     .withdraw,.totalMoney,.wallet{
            //        em {
            //         display: inline-block;
            //         color: @themeColor;
            //         cursor: pointer;
            //         &.tran{
            //           animation: tran 0.5s linear alternate infinite;
            //           cursor: not-allowed;
            //         }
            //       }
            //     }
            //     .btnText {
            //       display: inline-blockl;
            //       width: 80px;
            //       height: 34px;
            //       line-height: 32px;
            //       border: 1px solid @themeColor;
            //       background: #fff;
            //       border-radius: 20px;
            //       font-size: 14px;
            //       text-align: center;
            //       margin: 16px 20px 0 0;
            //       color: @themeColor;
            //       cursor: pointer;
            //       a {
            //         color: @themeColor;
            //       }
            //       &:hover {
            //         background: @themeColor;
            //         color: #fff;
            //         a {
            //           color: #fff;
            //         }
            //       }
            //     }
            //     .withdrawBtn{
            //       color: #333333;
            //       border: 1px solid #dddddd;
            //     }
            //     .transferBtn{
            //       background: @themeColor;
            //       color: #fff;
            //       a {
            //         color: #fff;
            //       }
            //     }
            //   }
            // }
            // .detailTwo {
            //   border-top: 1px solid #ececec;
            //   border-bottom: 1px solid #ececec;
            //   background: #f6f6f6;
            //   height: 70px;
            //   div {
            //     position: relative;
            //     input {
            //       width: 31%;
            //       max-width: 130px;
            //       height: 34px;
            //       line-height: 34px;
            //       border: 1px solid #dddddd;
            //       outline: none;
            //       border-radius: 5px;
            //       padding-left: 10px;
            //     }
            //     .unit {
            //       position: absolute;
            //       left: 26%;
            //     }
            //     .icon_v3 {
            //       margin: 0 5px 0 5px;
            //     }
            //     .transfer {
            //       display: inline-block;
            //       width: 28%;
            //       max-width: 130px;
            //       height: 34px;
            //       font-size: 12px;
            //       line-height: 40px;
            //       cursor: pointer;
            //       .sel {
            //         width: 130px;
            //         height: 34px;
            //         // padding: 5px  10px 5px 0px;
            //         border: none;
            //         border-radius: 5px;
            //         outline: none;
            //         // .ivu-select-selection{
            //         //     width: 130px !important;
            //         //     height: 34px !important;
            //         // }
            //       }
            //     }
            //   }
            // }
            // .detailThree {
            //   // clear: both;
            //   height: 38px;
            //   line-height: 38px;
            //   background: #f6f6f6;
            //   div {
            //     width: 50%;
            //     height: 100%;
            //     padding-left: 0;
            //     p {
            //       width: 50%;
            //       height: 100%;
            //       text-align: left;
            //       padding-left: 16px;
            //       span{
            //         color: #666666;
            //       }
            //       .virtual{
            //         color: @themeColor;
            //       }
            //     }
            //     .odd {
            //       border-right: 1px solid #ececec;
            //       .oddMoney{
            //         color: #333333;
            //       }
            //     }
            //   }
            // }
          }
        }
        .vipMsg {
          clear: both;
          margin-top: 20px;
          h2 {
            text-align: left;
            font-size: 16px;
            padding-left: 12px;
            font-weight: normal;
            color:#333;
            width: 100%;
            height: 36px;
            line-height:36px;
            background:@userBg_Top;
            .bor(@userColor_bor);
          }
          .vipDetail {
            width: 100%;
            // max-width: 936px;
            height: 160px;
            border-radius: 5px;
            background: url('img/img_all.png') no-repeat;
            background-size: 100% 100% ;
            table {
              text-align: center;
              .bor(@userColor_bor);
              border-radius: 5px;
              thead {
                width: 936px;
                tr {
                  height: 40px;
                  line-height: 40px;
                }
              }
              tbody{
                color: #666666;
              }
              tr {
                height: 120px;
              }
              h3 {
                text-align: center;
                margin: 0;
              }
              td {
                text-align: center;
                .bor(@userColor_bor);
                p {
                  line-height: 2;
                }
                div.vipImg{
                  width: 50px;
                  height: 60px;
                  margin-left: 34%;
                  overflow: hidden;
                  img{
                    width: 100%;
                    height: 100%;
                  }
                }
                div.vipHJ{
                  color: #d48514;
                  font-size: 14px;
                }
                div.vipZS{
                  color: #601b89;
                  font-size: 14px;
                }
                .vipCount{
                  display: inline-block;
                  width: 16px;
                  height: 16px;
                  line-height: 16px;
                  text-align: center;
                  color: #fff;
                  margin-right: 10px;
                  background-color: #bfbfbf;
                  border-radius: 50%;
                }
              }
              .grade {
                width: 156px;
              }
              .welfare {
                width: 422px;
              }
              .condition {
                width: 190px;
              }
              .advance {
                width: 168px;
                justify-content: center;
                align-items: center;
                display: flex;
                border: none;
                h3{
                  margin-right: 5px;
                }
                .icon_v3{
                  color: #bbbbbb
                }
              }
            }
          }
        }
        .cradMsg {
          clear: both;
          margin-top: 30px;
          width: 100%;
          h2 {
            text-align: left;
            font-size: 16px;
            font-weight: normal;
            padding-left: 12px;
            color:#333;
            width: 100%;
            height: 36px;
            line-height:36px;
            background: @userBg_Top;
            .bor(@userColor_bor);
            border-bottom: none;
          }
        }
      }
      .secPart {
        width: 100%;
        height: 100%;
      }
    }
  }
  .jBox-containe {
    .jBox-title {
      background: @themeColor;
    }
  }
}
</style>
