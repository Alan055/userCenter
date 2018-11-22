<template>
  <div class="withdraw_top addCardCont">
      <div class="left" :class="{'noClick':leftBank===0}" @click="(leftBank!==0)&&leftBank--"><em
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
            <div class="item" @click="$router.push({path:'/userCenters/addCard'})">
              <b><em class="icon">&#xe61d;</em></b>
              <span class="adds">添加银行卡</span>
            </div>
          </div>

        </div>
      </div>
      <div class="right" :class="{'noClick':!canRight}" @click="canRight&&leftBank++">
        <em class="icon_v3">&#xe704;</em>
      </div>
    </div>
</template>

<script>
import {mapState, mapMutations, mapActions} from 'vuex';
import service from "@/js/service.js";
import md5 from "js-md5";


export default {
    data () {
        return {
          bankList: [],// 用户银行卡信息
          currentBank: 0,// 当前选中的银行卡
          leftBank: 0,// 当前box中最左边的银行卡下标
          withdrawMoney: null,// 提现金额
          password: null,// 资金密码
          password_md5: null,// 密码md5
        };
    },
    computed: {
      ...mapState(['bankInfo']),
    	canRight(){
    		if(!this.bankInfo) return false
		    return this.bankList.length>=3&&(this.bankList.length<this.bankInfo.maxCount&&this.leftBank<(this.bankList.length-2))||(this.bankList.length==this.bankInfo.maxCount&&this.leftBank<(this.bankList.length-3))
    	}
    },
    watch: {
			// 点击移动的滑动效果
			leftBank() {
				$('.addCardCont .bankListBox').css({'transition':'0.3s','left':-this.leftBank*($('.addCardCont .bankListBox .item')[0].offsetWidth+12)})// 用css去控制
			},
		},
    methods: {
      ...mapMutations(['setBreadMore']),
			// 获取用户银行卡信息
			findBankList() {
				service.post(this, 'account/list-card', {}).then(function (result) {
					let res = result.data
					if (res.code === 0) {
            this.bankList = res.data;
            console.log(res.data.length);
            
					} else {
						this.$Modal.al_default({status: 'warning', content: res.message})
					}
				}, function (err) {
					console.log(err)
				})
      },
      init() {
				this.setBreadMore([])// 先改变面包屑数据 --没有更多面包屑  只有前面两个
				this.findBankList();// 获取用户银行卡信息
			}
    },
    mounted() {
    },
    created() {
			this.init();
		},
}

</script>
<style lang="less" scoped>
@import "../less/global.less";
@color:@themeColor;
.addCardCont{
  border: 1px solid @userColor_bor;
}
.withdraw_top {
    height: 140px;
    padding: 0 16px;
    display: flex;
    justify-content: left;
    align-items: center;
    .left, .right {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #ccc;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      cursor: pointer;
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
            .bor(#e3e3e3);
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

            &.active, &:hover {
              .bor(@themeColor);
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
              .bor(#e3e3e3);
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
@media (max-width:1024px) {
  .withdraw_top{
    .bankList{
      width: 656px;
      .box .item{
        width: 206px !important;
      }
      .bankListBox .box .item{
        padding-left: 44px;
        .cardNum span{
          margin-right: 2px;
        }
      }
    }
  }
  .cradMain{
    width:75% !important;
    margin-left: 34px !important;
  }
}
</style>