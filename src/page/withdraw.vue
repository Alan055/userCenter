<template>
  <div class="withdraw">
    <div class="withdraw_top">
      <div class="left" :class="{'noClick':leftBank===0||!canMobile}" @click="(leftBank!==0&&canMobile)&&leftBank--"><em
        class="icon_v3">&#xe704;</em></div>
      <div class="bankList">
        <div class="bankListBox">
          <div class="box" v-for="(v,i) in bankList" :key="i">
            <div class="item" :class="{'active':currentBank===i}" @click="currentBank=i" v-if="bankList.length"
                 :style="`background:url(/static/img/bank_v3/bank_bg_${v.bankId}.png) no-repeat;background-size:100% 100%;`">
              <div class="bankName">{{v.bankName}}</div>
              <div class="cardType">{{'储蓄卡'}}</div>
              <div class="cardNum">
                <span>****</span>
                <span>****</span>
                <span>****</span>
                <span>{{v.bankCardId.replace(/\**/g,'')}}</span>
              </div>
            </div>
          </div>
          <div class="box" v-if="bankList&&bankList.length<5">
            <div class="item" @click="jumpBank()">
              <b><em class="icon">&#xe61d;</em></b>
              <span class="adds">添加银行卡</span>
            </div>
          </div>

        </div>
      </div>
      <div class="right" :class="{'noClick':!canRight}"
           @click="canRight&&leftBank++">
        <em class="icon_v3">&#xe704;</em>
      </div>
    </div>
    <div class="withdraw_content">
      <div class="item">
        <span class="left">可提现金额：</span>
        <span class="right blance">¥ {{baseInfo.lotteryBalance}}</span>
      </div>
      <div class="item">
        <span class="left">提现金额：</span>
        <div class="right">
          <input autocomplete="off" v-model="withdrawMoney" placeholder="单次提现金额100~49999元"/>
          <span>元</span>
        </div>
      </div>
      <div class="item">
        <span class="left">资金密码：</span>
        <div class="right">
          <!--<passwordVue :idx="'password2'" :callBack="fundPassword"></passwordVue>-->
          <input autocomplete="off" type="password" v-model="password" @keyup.enter="(withdrawMoney>=100&&withdrawMoney<=49999)&&password_md5&&bankList.length&&submit()" placeholder=""/>
        </div>
      </div>
    </div>
    <div class="withdraw_bottom"><span
      :class="{'noClick':!(withdrawMoney>=100&&withdrawMoney<=49999)||!password_md5||!bankList.length}"
      @click="(withdrawMoney>=100&&withdrawMoney<=49999)&&password_md5&&bankList.length&&submit()">提交申请</span>
    </div>
  </div>
</template>

<script>
	import {mapState, mapMutations, mapActions} from 'vuex';
	import service from "@/js/service.js";
	import md5 from "js-md5";
	import passwordVue from "./password.vue";


	export default {
		components: {passwordVue},
		data() {
			return {
				bankList: [],// 用户银行卡信息
				currentBank: 0,// 当前选中的银行卡
				leftBank: 0,// 当前box中最左边的银行卡下标
				canMobile: true,// 是否可以点击移动的按钮
				withdrawMoney: null,// 提现金额
				password: null,// 资金密码
				password_md5: null,// 密码md5
			}
		},
		computed: {
			...mapState(['baseInfo', 'bindInfo', 'root_userCenter','bankInfo','accountStatus']),
			canRight(){
				if(!this.bankInfo) return false
				return this.bankList.length>=3&&(this.bankList.length<this.bankInfo.maxCount&&this.leftBank<(this.bankList.length-2))||(this.bankList.length==this.bankInfo.maxCount&&this.leftBank<(this.bankList.length-3))
      }
		},
		watch: {
			// 点击移动的滑动效果
			leftBank() {
				$('.withdraw  .bankListBox').css({'transition':'0.3s','left':-this.leftBank*($('.withdraw  .bankListBox .item')[0].offsetWidth+12)})// 用css去控制
			},
			// 资金密码
			password() {
				this.password_md5 = this.password ? md5(this.password) : ''
			},
			// 提现金额
			withdrawMoney(cur) {
				if (cur > this.baseInfo.lotteryBalance) {
					this.withdrawMoney = parseInt(this.baseInfo.lotteryBalance)
				} else {
					let num = parseInt(cur);
					if (isNaN(num)) {
						this.withdrawMoney = ''
					} else {
						this.withdrawMoney = num
					}
				}
			},
			bindInfo:{
				deep:true,
        handler:function () {
          this.init()
        }
      }
		},
		methods: {
			...mapMutations(['setBreadMore', 'setData']),
			// 获取用户银行卡信息
			findBankList() {
				service.post(this, 'account/list-card', {}).then(function (result) {
					let res = result.data
					if (res.code === 0) {
						this.bankList = res.data;
						if (this.bankList.length === 0 && this.bindInfo.cellphone) {
							this.$Modal.al_default({status: 'warning', content: '您还没有绑定银行卡，请先绑定银行卡', onOk: this.jumpBank})
						}
					} else {
						this.$Modal.al_default({status: 'warning', content: res.message})
					}
				}, function (err) {
					console.log(err)
				})
			},
			// 获取密码的回调
			fundPassword(v) {
				this.password = v
			},
			// 跳转到绑定手机号页面
			jump() {
				this.setData({key: 'replacePhone', value: true})
				this.$router.push({path: this.root_userCenter + '/userPhone'})
			},
			// 跳转到绑定银行卡页面
			jumpBank() {
				this.$router.push({path: '/userCenters/addCard'})
			},
			// 跳转到资金密码修改页面
			jumpModifyFundsPass() {
        this.setData({ key: "isShowFunds", value: true });
        this.$router.push({path: this.root_userCenter + '/fundsPass'})
			},

			// 提交申请  这里有两个步骤  第一步验证密码，第二步在提交申请
			submit() {
				// 这个接口是验证密码
				service.post(this, 'payment/apply-withdraw', {
					amount: this.withdrawMoney,
					cardId: this.bankList[this.currentBank].id,
					withdrawPassword: /^cws8|^ctt8/.test(this.baseInfo.nickName)?this.password:this.password_md5,
				}).then(function (result) {
					let res = result.data
					if (res.code === 0) {
						this.sendApply()
					} else {
						this.$Modal.al_default({status: 'warning', content: res.message})
					}
				}, function (err) {
					console.log(err)
				})
			},
			// 验证密码之后的发送申请
			sendApply() {
				service.post(this, 'payment/prepare-withdraw', {}).then(function (result) {
					let res = result.data
					if (res.code === 0) {
						this.$Modal.al_default({status: 'success', content: '您的提现请求已申请，请等待工作人员处理！'})
					} else {
						this.$Modal.al_default({status: 'warning', content: res.message})
					}
					this.password = ''
				}, function (err) {
					console.log(err)
				})
			},

			init() {
				this.setBreadMore([])// 先改变面包数据 --没有更多面包屑  只有前屑面两个
				this.findBankList();// 获取用户银行卡信息
				// 如果没有绑定手机号码   是不允许提现的  必须先转到绑定手机号的页面中去
				if (this.bindInfo.cellphone===null) {
					// 这里这样写  是因为每次切换url的时候  都会先把所有的公共全局弹框给关闭掉   不这么写  这个弹框就会打开之后立马被关闭
					this.$nextTick(function () {
						this.$Modal.al_default({status: 'warning', content: '您还没有绑定手机号码，请先绑定手机号码！',onOk:this.jump})
					}.bind(this))
        }
        if(!this.accountStatus.isUpdateWithdrawPassword&&this.accountStatus.isBindCellphone&&this.accountStatus.isBindWithdrawName&&this.bankList.length > 0) {
          this.$nextTick(function () {
						this.$Modal.modifyFundsPass_Modal({status: 'warning', content: '为了保障您的资金安全，现引用支付宝资金安全技术，需要您重新设定新的资金密码即可生效。',onOk:this.jumpModifyFundsPass})
					}.bind(this))
        }
			}
		},
		created() {
			this.init();
		},
		mounted() {

		},
	}
</script>

<style lang='less' scoped>
  @import "../less/global.less";

  .withdraw {
    width: 100%;
    .bor(@userColor_bor);
    .withdraw_top {
      height: 140px;
      border-bottom: 1px solid @userColor_bor;
      padding: 0 8px;
      display: flex;
      justify-content: left;
      align-items: center;
      .left, .right {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: #cccccc;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #666;
        cursor: pointer;
        user-select: none;
      }
      .left {
        em {
          display: inline-block;
          transform: rotate(90deg);
        }
      }
      .right {
        em {
          display: inline-block;
          transform: rotate(-90deg);
        }
      }
      .noClick {
        cursor: not-allowed;
        color: #fff;
      }
      .bankList {
        /*width: calc(~"100% - 64px");*/
        width: 834px;
        height: 94px;
        overflow: hidden;
        position: relative;
        .bankListBox {
          position: absolute;
          top: 0;
          left: 0;
          width: max-content;
          height: 100%;
          .box {
            padding: 0 6px;
            height: 100%;
            display: inline-block;
            float: left;
            .item {
              /*width: 32%;*/
              width: 266px;
              height: 100%;
              border-radius: 10px;
              background: #ececec;
              .bor(@userColor_bor);
              cursor: pointer;
              padding-left: 60px;
              padding-top: 12px;
              color: #fff;
              > div {
                text-align: left;
                line-height: 24px;
              }
              .bankName {
                font-size: 16px;
              }
              .cardType {
                font-size: 12px;
              }
              .cardNum {
                font-size: 16px;
                span {
                  margin-right: 10px;
                  vertical-align: sub;
                  &:last-child {
                    vertical-align: top;
                  }
                }
              }
              &:hover {
                .bor(@userColor_bor);
              }
              &.active{
                .bor(@userColor_bor);
                &:hover{
                  .bor(@userColor_bor);
                }
              }

            }
            .adds{
              color: @twoMenuColor_Sel;
            }
            &:last-child .item {
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              padding-left: 0px;
              &:hover {
              }
              b {
                background: #fff;
                width: 28px;
                border-radius: 50%;
                height: 27px;
                display: inline-block;
                line-height: 28px;
                margin-bottom: 10px;
                em {
                  font-size: 28px;
                  color: #ccc;
                }
              }
              span {
                font-size: 14px;
                // color: @twoMenuColor_Sel;
              }
            }
          }

        }
      }
    }
    .withdraw_content {
      .item {
        width: 100%;
        height: 60px;
        display: flex;
        justify-content: left;
        align-items: center;
        font-size: 14px;
        color: @twoMenuColor_Sel;
        .left {
          width: 32%;
          display: flex;
          justify-content: flex-end;
          text-align: right;
          height: 100%;
          align-items: center;
        }
        .right {
          display: flex;
          justify-content: left;
          align-items: center;
          height: 48px;
          padding-left: 10px;
          color: @twoMenuColor_Lab;
          position: relative;

          input {
            height: 100%;
            .bor(@userColor_bor);
            outline: none;
            border-radius: 4px;
            width: 350px;
            padding-left: 12px;
          }
          span {
            position: absolute;
            right: 10px;
            top: 14px;
            font-size: 18px;
            color: #787876;
          }
        }
        .blance {
          font-weight: bold;
        }
      }

    }
    .withdraw_bottom {
      padding: 40px 0;
      span {
        display: inline-block;
        width: 178px;
        height: 48px;
        line-height: 48px;
        border-radius: 24px;
        color: #fff;
        background: @themeColor;
        font-size: 16px;
        cursor: pointer;
      }
      .noClick {
        background: #ccc;
      }
    }
  }
  @media (max-width:1024px) {
    .withdraw {
      .withdraw_top {
        .bankList {
          width: 656px ;
          .box .item {
            width: 206px !important;
          }
          .bankListBox .box .item {
            padding-left: 44px;
            .cardNum span {
              margin-right: 2px;
            }
          }
        }
      }
    }
  }
</style>














