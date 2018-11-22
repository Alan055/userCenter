<template>
  <div class="userDetail-warpper">
    <!-- <div> -->
      <div class="userAvater">
        <div class="avater-left fl">
          <div class="avaterImg fl"><img src="./img/userImgBig.png" alt=""></div>
          <div class="nickname fl">
            <h3>{{baseInfo.nickName}}</h3>
            <p class="vipGrade"><i class="icon_v3">&#xe60f;</i>黄金玩家</p>
          </div>
        </div>
        <div class="avater-right fl">
          <div class="safetyGrad">
            <p class="fl">账户安全：</p>
            <div class="userBomMain fl">
              <div class="userBomDiv " :style="{width:gradeMsg.num+'%'}"></div>
            </div>
            <span class="fl">{{gradeMsg.title}}</span>
          </div>
          <div class="gender">
            <p class="fl"> 性别：</p>
            <div class="fl">
              <Select name="" v-model="bindInfo.gender" class="sel" :disabled="isbind.isBindGender" >
                <Option v-for="(item,idx) in genderList" :value="item.value" :key="idx"  >{{item.label}}</Option>
              </Select>
            </div>
            <span class="nowAdd fl" @click="setGender" v-if="!isbind.isBindGender">立即设置</span>
          </div>
          <div class="birth">
            <p class="fl">生日：</p>
            <div class="fl" v-if="!isbind.isBindBirthday">
              <DatePicker  format="yyyy年MM月dd日"    placeholder="请输入您的生日" type="date" :options="dateLimit"  
              v-model="date " ></DatePicker>   <!-- :disabled="accountStatus.isBindBirthday"  v-if="!accountStatus.isBindBirthday"-->
            </div>
            <div class="fl" v-if="isbind.isBindBirthday">
              <DatePicker  format="yyyy年MM月dd日"  disabled type="date" :options="dateLimit"  
              v-model="bindInfo.birthday " ></DatePicker>   <!-- :disabled="accountStatus.isBindBirthday"  v-if="!accountStatus.isBindBirthday"-->
            </div>
            <span class="nowAdd fl" @click="setBrith" v-if="!isbind.isBindBirthday" >设置生日有惊喜！</span> 
          </div>
        </div>
      </div>
      <div class="safety" >
          <h2>安全中心</h2>
          <div class="safety-main">
              <div class="safetyBox">
                  <div class="safetyWarps  fl">
                      <div class="safetyWarpLeft  fl">
                          <div class="safetyWarpImg fl">
                              <i class="icon_v3" :class="isbind.isBindCellphone?'seccess':''">&#xe607;</i>
                          </div>
                          <h3 class="fl" v-show="!isbind.isBindCellphone">手机号</h3>
                          <h3 class="fl" v-show="isbind.isBindCellphone">{{bindInfo.cellphone?transationPhone(bindInfo.cellphone):''}}</h3>
                      </div>
                      <div class="safetyWarpRight fr">
                          <h4 class=" " @click="mobileClick" v-show="!isbind.isBindCellphone">
                              <span class="addbtn"  >未设置</span>
                          </h4>
                          <h4 class=" " v-show="isbind.isBindCellphone" > <!-- -->
                              <span class=" addbtn "  @click="modifyMobile"   :class="[isbind.isBindCellphone && 'modifyBtn']">修改</span>
                          </h4>
                      </div>
                  </div>
                  <div class="safetyWarps  fl">
                      <div class="safetyWarpLeft fl">
                          <div class="safetyWarpImg fl">
                              <i class="icon_v3" :class="isbind.isBindEmail?'seccess':''">&#xe605;</i>
                          </div>
                          <h3 class=" fl" v-show="!isbind.isBindEmail">用户邮箱</h3>
                          <h3 class=" fl" v-show="isbind.isBindEmail">{{bindInfo.email}}</h3>
                      </div>
                      <div class="safetyWarpRight fr">
                          <h4 class=" " v-show="!isbind.isBindEmail"  @click="bindEmail">
                              <span class="addbtn" >未设置</span>
                          </h4>
                          <h4 class=" " v-show="isbind.isBindEmail" @click="modifyEmail">
                              <span class="addbtn " :class="[isbind.isBindEmail && 'modifyBtn']" >修改</span>
                          </h4>
                      </div>
                  </div>
              </div>
              <div class="safetyBox">
                  <div class="safetyWarps  fl">
                      <div class="safetyWarpLeft  fl">
                          <div class="safetyWarpImg fl">
                              <i class="icon_v3" :class="isbind.isCnReset?'seccess':''">&#xe608;</i>
                          </div>
                          <h3 class="fl">登录密码</h3>
                      </div>
                      <div class="safetyWarpRight fr">
                          <!-- <h4 class=" ">
                              <span class="addbtn" v-show="!isbind.isCnReset">未设置</span>
                          </h4> -->
                          <h4 class=" "   @click="modifyPass"> <!-- v-show="isbind.isCnReset" -->
                              <span class=" addbtn modifyBtn"  >修改</span>
                          </h4>
                      </div>
                  </div>
                  <div class="safetyWarps  fl">
                      <div class="safetyWarpLeft fl">
                          <div class="safetyWarpImg fl">
                              <i class="icon_v3" :class="isbind.isBindWithdrawPassword?'seccess':''">&#xe608;</i>
                          </div>
                          <h3 class=" fl" >资金密码</h3>
                      </div>
                      <div class="safetyWarpRight fr">
                          <h4 class=" " v-show="!isbind.isBindWithdrawPassword">
                              <span class="addbtn"   @click="setFundsPass">未设置</span>
                          </h4>
                          <h4 class=" " v-show="isbind.isBindWithdrawPassword" >
                              <span class="addbtn " :class="[isbind.isCnReset && 'modifyBtn']" @click="modifyFundsPass">修改</span>
                          </h4>
                      </div>
                  </div>
              </div>
              <div class="safetyBox">
                  <div class="safetyWarps  fl">
                      <div class="safetyWarpLeft  fl">
                          <div class="safetyWarpImg fl">
                              <i class="icon_v3" :class="isbind.isCnReset?'seccess':''">&#xe60e;</i>
                          </div>
                          <h3 class="fl" v-show="!isbind.isCnReset">用户姓名</h3>
                          <h3 class="fl" v-show="isbind.isCnReset">{{nickname}}</h3>
                      </div>
                      <div class="safetyWarpRight fr">
                          <h4 class=" ">
                              <span class="addbtn modifyBtn" v-show="!isbind.isCnReset"  @click="$router.push({path:'/userCenters/resetUserName'})">修改</span>
                          </h4>
                          <h4 class=" " v-show="isbind.isCnReset">
                              <span class=" addbtn "  :class="[isbind.isCnReset && 'disabledBtn']">已设置</span>
                          </h4>
                      </div>
                  </div>
                  <div class="safetyWarps  fl">
                      <div class="safetyWarpLeft fl">
                          <div class="safetyWarpImg fl">
                              <i class="icon_v3" :class="isbind.isBindQQ?'seccess':''">&#xe609;</i>
                          </div>
                          <h3 class=" fl" v-show="!isbind.isBindQQ">
                              <input type="text" v-model="qqNum" placeholder="请输入QQ号" >
                          </h3>
                          <h3 class=" fl" v-show="isbind.isBindQQ">{{bindInfo.qq}}</h3>
                      </div>
                      <div class="safetyWarpRight fr">
                          <h4 class=" " v-show="!isbind.isBindQQ" @click="verficationQQNum&&setQQNum()">
                              <span id="setqq" class="addbtn " :class="verficationQQNum&&qqNum!=''?'':'disabledBtn'">确定</span>
                          </h4>
                          <h4 class=" " v-show="isbind.isBindQQ">
                              <span class="addbtn " :class="[isbind.isBindQQ && 'disabledBtn']" >已设置</span>
                          </h4>
                      </div>
                  </div>
              </div>
              <div class="safetyBox">
                  <div class="safetyWarps  fl" >
                      <div class="safetyWarpLeft  fl">
                          <div class="safetyWarpImg fl">
                              <i class="icon_v3" :class="isbind.isBindWithdrawName?'seccess':''">&#xe60b;</i>
                          </div>
                          <h3 class="fl" v-show="!isbind.isBindWithdrawName">取款人姓名</h3>
                          <h3 class="fl" v-show="isbind.isBindWithdrawName">{{bindInfo.withdrawName}}</h3>
                      </div>
                      <div class="safetyWarpRight fr" >
                          <h4 class=" " v-show="!isbind.isBindWithdrawName" @click="$router.push({path:'/userCenters/addCard'})">
                              <span class="addbtn" >未设置</span>
                          </h4>
                          <h4 class=" " v-show="isbind.isBindWithdrawName">
                              <span class=" addbtn " :class="[isbind.isBindWithdrawName && 'disabledBtn']">已设置</span>
                          </h4>
                      </div>
                  </div>
                  <div class="safetyWarps  fl" style="border-right:none">
                      <div class="safetyWarpLeft fl">
                          <div class="safetyWarpImg fl">
                              <i class="icon_v3" :class="isbind.isBindWeChat?'seccess':''">&#xe60a;</i>
                          </div>
                          <h3 class=" fl" v-show="!isbind.isBindWeChat">
                              <input type="text" placeholder="请输入微信账号" v-model="weChat" >
                          </h3>
                          <h3 class=" fl" v-show="isbind.isBindWeChat">{{bindInfo.wechatId}}</h3>
                      </div>
                      <div class="safetyWarpRight fr" >
                          <h4 class=" " v-show="!isbind.isBindWeChat" @click="verficationweChatNum&&setWeChatNum()">
                              <span class="addbtn"  :class="verficationweChatNum&&weChat!=''?'':'disabledBtn'" >确定</span>
                          </h4>
                          <h4 class=" " v-show="isbind.isBindWeChat">
                              <span class="addbtn "  :class="[isbind.isBindWeChat && 'disabledBtn']">已设置</span>
                          </h4>
                      </div>
                  </div>
                  <addCards></addCards>
              </div>
          </div>
      </div>
    <!-- </div> -->
    <!-- <div class="form-mainDetail"  v-if="!isShowBind">
      <userForm></userForm>
    </div> -->
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
  personalBind,
  getBindInfo
} from "@/js/index.js";
// import {verifyRule} from '@/js/const.js';
import breadNav from "./breadNav";
// import base from "@/js/pubilc.js";
import { mapState, mapMutations, mapActions } from "vuex";
import userForm from "./userForm";
import addCards from './addCards.vue'


// const ITEM = base.storage();
let init = {
  userHeader: userInit(),
  userContent: userConter(),
};
export default {
  data() {
    return {
      nickname: "获取中....",
    //   birthday: "2018-01-01",
      gender: 0,
      qqNum: "", //qq号
      weChat: "",
      canSetqq: false, //是否显示绑定QQ号按钮
      canSetWeChat: false, //是否显示绑定微信号按钮
      isbindBg: "",
      isBindWithdrawPassword: null,
      isuserinfoInt: "",
      tabnickName: "",
      nickNames: "",
      bankList:[],
      genderList: [
        { value: "0", label: "女" },
        { value: "1", label: "男" },
        { value: "2", label: "保密" }
      ],
      date:moment().subtract(18, 'y').format('YYYY-MM-DD'),// 当前选择的日期
      dateLimit: {// 控制时间选择器的可选时间长度
        disabledDate(date) {
          // return date &&  (true );
          return date &&  (date.valueOf() > moment().subtract(18, 'y').valueOf());
        }
      },
      isCloseUserData: "",
      gradeMsg: {
        //安全等级
        num: 10,
        title: ""
      },
      isbind: {} //用户绑定的数据  如是否绑定手机号。。。
    };
  },
  components: {
    breadNav,
    addCards
  },
  computed: {
    ...mapState(['isShowBind','bindInfo','accountStatus','breadafter','baseInfo']),
    // 检验QQ号
    verficationQQNum() {
      return /^[1-9][0-9]{4,11}$/.test(this.qqNum);
    },
    // 检验微信号
    verficationweChatNum() {
      return /^[a-zA-Z]{1}[-_a-zA-Z0-9]{5,19}$/.test(this.weChat);
    },
  },
  watch: {
    // status:{
    //   deep:true,
    //   handler:function () {
        
    //   }
    // }
  },

  methods: {
    ...mapMutations(['setData','setBreadMore','setBread','setBindInfo']),
    init() {
      init.userContent;
    },
    // 设置性别
    setGender(){
      let _this = this;
      if(!_this.bindInfo.gender){
        this.$Modal.al_openLottery({status:'warning',content:'选项不能为空！',time:2000})
        return false
      }
      let options = {
        category:1,
        sex:_this.bindInfo.gender
      }
      personalBind(_this,options)
    },
    // 设置生日
    setBrith() {
      let _this = this;
      
      // if(!_this.bindInfo.birthday){
      //   this.$Modal.al_openLottery({status:'warning',content:'选项不能为空！',time:2000})
      //   return false
      // }
      console.log(_this.bindInfo.birthday,'22222222');
      
      let birth = _this.date.getFullYear() + '-' + (_this.date.getMonth() + 1) + '-' + _this.date.getDate() 
      let options = {
        category:2,
        birthday:birth
      }
      personalBind(_this,options)
    },
    birthChange(){
      console.log(this.date);
      
      this.date = this.bindInfo.birthday
      //  this.bindInfo.birthday = this.date
      // this.setBindInfo({birthday: this.date})
      // console.log(this.bindInfo.birthday);
    },
    // 设置手机号
    mobileClick() {
      this.setData({key:'isBindPhone',value:false})
      this.setData({key:'replacePhone',value:true})
      this.$router.push('/userCenters/userPhone');
    },
    // 修改手机号
    modifyMobile() {
      this.$router.push('/userCenters/userPhone');
      this.setData({key:'isBindPhone',value:true});
      this.setData({key:'replacePhone',value:false});
    },
    // 设置邮箱
    bindEmail() {
      this.$Modal.al_openLottery({status:'warning',content:'敬请期待！',time:2000})
      // this.$router.push('/userCenters/userEmail');
      // this.setData({ key: "ismodifyEmail", value: false });
      // this.setData({ key: "isbindEmail", value: true });
    },
    // 修改邮箱
    modifyEmail() {
      this.$Modal.al_openLottery({status:'warning',content:'敬请期待！',time:2000})
      // this.$router.push('/userCenters/userEmail');
      // this.setData({ key: "ismodifyEmail", value: true });
      // this.setData({ key: "isbindEmail", value: true });
    },
    // 设置资金密码
    setFundsPass() {
      this.$router.push('/userCenters/fundsPass');
      this.setData({ key: "isSetFunds", value: true });
    },
    // 修改资金密码
    modifyFundsPass() {
      this.$router.push('/userCenters/fundsPass');
      this.setData({ key: "isShowFunds", value: true });
    },
    // 修改登录密码
    modifyPass() {
      this.$router.push('/userCenters/userPassword');
    },
    // 绑定QQ号
    setQQNum() {
      let _this = this;
      let options = {
        category:4,
        qqNum:_this.qqNum
      }
      personalBind(_this,options)
    },
    // 绑定微信号
    setWeChatNum() {
      let _this = this;
      let options = {
        category:3,
        wechatNum:_this.weChat
      }
      personalBind(_this,options)
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
    setUserData() {
      this.isbindBg = true;
      this.isCloseUserData = false;
    }
  },
  mounted() {
    let that = this;
    if (!this.nickNames) {
      this.fundsPwdNote =
        "为了你的账户安全，请先设置资金密码，该密码用于验证您的资金操作。";
    }
    //sendApi.checkgrade(this).checkClient(this).checkCard(this).loadBanks(this).getLoginListInfo(this);
    //window.lys_TransferAccount();

    inputlineBtn();
    init.userHeader.initUserInfo(this);
    init.userContent
      .checkgrade(this)
    // getBindInfo(this)
      // .checkCard(this)
      // .loadBanks(this)
      // .getLoginListInfo(this, function() {
      //   if (this.isuserbank && this.isuserbank == "1") {
      //     if (this.bindBankList.length >= 5) {
      //       this.isuserbank = false;
      //       localStorage.setItem("_bankCard", 0);
      //       oPrompt({
      //         idx: "userbank",
      //         message: "银行卡已绑满5张."
      //       });
      //     }
      //   }
      //   this.isAddBank = true;

      //   // if (!this.bindBankList.length) {
      //   // this.bindBankLists = [5, 4, 3, 2, 1];
      //   // } else {
      //   // for (let a = 5 - this.bindBankList.length; a > 0; a--) {
      //   //     this.bindBankLists.push(a);
      //   // }
      //   // }
      // });
  },
  created() {
    this.init();
    this.setBread([{label: '个人中心',}, {label: '账户信息', url: '/userDetail'}])
  },
  destroyed() {
  }
};
</script>
<style lang="less" scoped>
  @import "../less/global.less";
.userDetail-warpper {
  width: 100%;
  height: 100%;
  .form-mainDetail{
    width: 100%;
    height: 100%;
  }
  .userAvater {
    width: 100%;
    height: 120px;
    border: 1px solid @userColor_bor;
    // overflow: hidden;
    .avater-left {
      width: 26%;
      height: 119px;
      border-right: 1px solid @userColor_bor;
      // margin: 20px 0 0 20px;
      overflow: hidden;
      .avaterImg {
        width: 80px;
        height: 80px;
        margin: 20px 0 0 20px;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .nickname {
        margin: 30px 0 0 10px;
        text-align: left;
        h3 {
          margin-bottom: 10px;
          color: #333333;
          font-size: 18px;
          font-weight: normal;
        }
        p.vipGrade{
          width: 84px;
          height: 20px;
          line-height: 20px;
          text-align: center;
          color: #d48514;
          font-weight: bold;
          border-radius: 20px;
          background: #eeeeee;
          i{
            color: #FFAF00;
            vertical-align: middle;
            margin-right: 5px;
          }
        }
      }
    }
    .avater-right {
      width: 74%;
      height: 120px;
      .safetyGrad,
      .gender,
      .birth {
        width: 100%;
        height: 39px;
        line-height: 39px;
        background: #f6f6f6;
        p {
          width: 90px;
          height: 39px;
          line-height: 40px;
          text-align: right;
          font-size: 14px;
          color: #666666;
        }
        .nowAdd {
          color: #308df5;
          cursor: pointer;
        }
      }
      .safetyGrad {
        .userBomMain {
          width: 100px;
          height: 4px;
          margin: 18px;
          border-radius: 15px;
          background: #d2d2d2;
          .userBomDiv {
            width: 100px;
            height: 4px;
            border-radius: 15px;
            background: #ff8840;
          }
        }
        span {
          font-size: 18px;
          color: #ff8840;
        }
      }
      .gender {
        border-top: 1px solid @userColor_bor;
        border-bottom: 1px solid @userColor_bor;
        height: 40px;
        div {
          width: 80px;
          height: 30px;
          font-size: 12px;
          text-align: left;
          line-height: 32px;
          margin-right: 10px;
          // margin: 4px 10px 0 0;
          cursor: pointer;
          .Select {
            display: block;
            width: 80px;
            height: 30px;
            padding: 5px 10px 5px 0px;
            border: 1px solid #dedede;
            border-radius: 5px;
            outline: none;
          }
        }
        &:after {
          clear: both;
        }
      }
      .birth {
        clear: both;
        div {
          // width: 80px;
          height: 30px;
          font-size: 12px;
          text-align: left;
          line-height: 32px;
          // margin: 4px 10px 0 0;
          // cursor: pointer;
          .Select {
            display: block;
            width: 80px;
            height: 30px;
            padding: 5px 10px 5px 0px;
            border: 1px solid #d2d2d2;
            border-radius: 5px;
            outline: none;
          }
        }
        span {
          margin: 0 10px;
        }
      }
    }
  }
  .safety {
    margin-top: 26px;
    h2 {
      margin: 10px;
      text-align: left;
    }
    .safety-main {
      width: 100%;
      max-width: 936px;
      height: 460px;
      border: 1px solid @userColor_bor;
      .safetyBox {
        height: 80px;
        border-bottom: 1px solid @userColor_bor;
        padding: 0;
        &:last-child{
          border-bottom: none;
        }
        .addCardCont{
          border:none;
          border-top: 1px solid @userColor_bor;
        }
        div.safetyWarps {
          width: 50%;
          max-width: 467px;
          height: 80px;
          line-height: 80px;
          border-right: 1px solid @userColor_bor;
          &:last-child{
            border-right: none;
          }
          .safetyWarpLeft {
            width: 72%;
            // max-width: 290px;
            height: 100%;
            .safetyWarpImg {
              width: 54px;
              height: 54px;
              line-height: 54px;
              margin: 17px 0 0 25px;
              overflow: hidden;
              i {
                font-size: 52px;
                color:@themeColor;
              }
              .seccess{
                color: #cccccc;
              }
            }
            h3 {
              margin: 0;
              margin-left: 14px;
              text-align: left;
              width: 60%;
              font-weight: normal;
              font-size: 16px;
              overflow: hidden; 
              text-overflow: ellipsis; 
              white-space: nowrap;
              input {
                width: 100%;
                max-width: 222px;
                height: 34px;
                border: 1px solid @userColor_bor;
                border-radius: 25px;
                outline: none;
                padding-left: 15px;
              }
            }
          }
          .safetyWarpRight {
            width: 28%;
            // max-width: 120px;
            height: 80px;
            line-height: 80px;
            h4 {
              .addbtn {
                display: inline-block;
                width: 100px;
                height: 34px;
                line-height: 32px;
                text-align: center;
                border: 1px solid @themeColor;
                border-radius: 25px;
                margin-right: 20px;
                font-size: 14px;
                color: @themeColor;
                cursor: pointer;
                &:hover {
                  background: @themeColor;
                  color: #fff;
                }
              }
              .disabledBtn {
                background: #fff !important;
                .bor(@userColor_bor);
                cursor: default ;
                color: #666666;
                &:hover {
                  color: #666666;
                }
              }
              .modifyBtn {
                background: #fff ;
                .bor(@userColor_bor);
                color: #666666;
                &:hover {
                  background: @themeColor ;
                  color: #fff;
                  cursor: pointer ;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
