<template>
  <div class="transferRecharge">
    <div class="left" :style="info.bankType<2?'':'width:100%'">
      <div class="card">
        <div class="item">
          <span class="bankIcon" :class="'banktag'+(info.bankAlias?info.bankAlias:info.bankId)"></span>
          <span class="bankType">{{'储蓄卡'}}</span>
        </div>
        <div class="item">
          <span class="bankNumber">{{info.cardId}}</span>
          <span class="copy" @click="copy(info.cardId)">复制</span>
        </div>
        <div class="item">
          <span class="itemLeft">
            <span class="bankUser">{{info.cardName}}</span>
            <span class="copy copy1" @click="copy(info.cardName)">复制</span>
          </span>
          <span class="location">{{info.place}}</span>
        </div>
      </div>
      <div class="table">
        <div class="item">
          <div class="itemLeft">存入金额</div>
          <div class="itemRight">{{Number(info.amount).toFixed(2)}}元<span @click="copy(Number(info.amount).toFixed(2))">复制</span>
          </div>
        </div>
        <div class="item">
          <div class="itemLeft">订单编号</div>
          <div class="itemRight">{{info.billno}}
            <!--<span>复制</span>-->
          </div>
        </div>
        <div class="item order">
          订单失效时间还剩 {{timeStr}}
        </div>
      </div>
      <rechargePrompt></rechargePrompt>
    </div>
    <div class="right" v-if="info.bankType<2">
      <div class="pre"><em class="icon_v3" :class="{'noClick':index===0}" @click="index!==0&&index--">&#xe614;</em>
      </div>
      <div class="box">
        <ul>
          <li v-for="(v,i) in img" :key="i">
            <img :src="v.url" alt="">
          </li>
        </ul>
      </div>
      <div class="next"><em class="icon_v3" :class="{'noClick':index===(img.length-1)}"
                            @click="index!==(img.length-1)&&index++">&#xe614;</em></div>
      <div class="num">
        <div class="point">
          <span v-for="(v,i) in img" :key="i" :class="{'active':index===i}" @click="index=i"></span>
        </div>
        <div class="text">{{BankTypeObj[info.bankType].label}}教程</div>
      </div>
    </div>
  </div>
</template>

<script>
	import rechargePrompt from "./rechargePrompt.vue";// 支付提示组件

	export default {
		props: ['info'],
		components: {rechargePrompt},
		data() {
			return {
				BankTypeObj: [
					{label: '支付宝转账', imgName: 'z'},
					{label: '微信转账', imgName: 'v'},
					// {label: '微信扫码', imgName: 'z'},
					// {label: 'qq扫码', imgName: 'z'},
					// {label: '手机扫码', imgName: 'z'},
					// {label: '网银转账', imgName: 'z'},
				],
				timeStr: '',
				timer: null,// 定时器
				index: 0,// 当前展示第几章转账流程图
			}
		},
		computed: {
			img() {
				if (this.info.bankType === 0) {// 支付宝
					return [
						{url: `/static/v3/images/img/z1.png`},
						{url: `/static/v3/images/img/z2.png`},
						{url: `/static/v3/images/img/z3.png`},
						{url: `/static/v3/images/img/z4.png`},
					]
				} else {// 微信
					return [
						{url: `/static/v3/images/img/v1.png`},
						{url: `/static/v3/images/img/v2.png`},
						{url: `/static/v3/images/img/v3.png`},
						{url: `/static/v3/images/img/v4.png`},
						{url: `/static/v3/images/img/v5.png`},
					]
				}
			}
		},
		watch: {
			index(aft) {
				$('.transferRecharge .right .box ul').css({'transition': '0.3s', 'left': -aft * 158})// 用css去控制
			}
		},
		methods: {
			// 倒计时
			lastTime() {
				let timeNum = this.info.seconds
				this.timer = setInterval(function () {
					this.timeStr = this.timeTranslate2(timeNum--);
					if(timeNum<0){
						clearInterval(this.timer)
          }
				}.bind(this), 1000)
			}
		},
		created() {
			console.log(this.info)
		},
		mounted() {
			this.lastTime()
		},
		destroyed() {
			clearInterval(this.timer)
		}
	}
</script>

<style lang='less' scoped>
  @import "../less/global.less";

  .transferRecharge {
    display: flex;
    justify-content: left;
    .left {
      max-width: 59%;
      .card {
        width: 316px;
        height: 135px;
        background-image: linear-gradient(to left, #de2159, #ec356d);
        color: #fff;
        border-radius: 8px;
        .item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 20px;
          height: 33%;
          > span {

          }
          .bankIcon {
            display: flex;
            width: 145px;
            height: 34px;
            background: url("./img/banks_white.png") no-repeat;
            &.banktag1,
            &.banktagICBC{
              background-position: -6px 3px;
            }
            &.banktag2,
            &.banktagCCB{
              background-position: -6px -54px;
            }
            &.banktag3,
            &.banktagABC{
              background-position: -6px -111px;
            }
            &.banktag4,
            &.banktagCMB{
              background-position: -6px -168px;
            }
            &.banktag5,
            &.banktagB0C
            {
              background-position: -6px -225px;
            }
            &.banktag6,
            &.banktagBOCM{
              background-position: -6px -282px;
            }
            &.banktag7,
            &.banktagSPDB{
              background-position: -6px -342px;
            }
            &.banktag8,
            &.banktagCIB{
              background-position: -6px -397px;
            }
            &.banktag9,
            &.banktagCITIC{
              background-position: -6px -455px;
            }
            &.banktag10,
            &.banktagNBBANK{
              background-position: -6px -513px;
            }
            &.banktag11,
            &.banktagSHB{
              background-position: -6px -570px;
            }
            &.banktag12,
            &.banktagHZCB{
              background-position: -6px -627px;
            }
            &.banktag13,
            &.banktag13{
              background-position: -6px -684px;
            }
            &.banktag14,
            &.banktag14{
              background-position: -6px -746px;
            }
            &.banktag15,
            &.banktagGDB{
              background-position: -6px -780px;
            }
            &.banktag16,
            &.banktagPSBC{
              background-position: -6px -857px;
            }
            /*平安银行*/
            &.banktag17,
            &.banktagSDB{
              background-position: -6px -915px;
            }
            &.banktag18,
            &.banktagCMBC{
              background-position: -6px -972px;
            }
            &.banktag19,
            &.banktagCEB{
              background-position: -6px -1029px;
            }
            &.banktag20,
            &.banktagHXB{
              background-position: -6px -1086px;
            }
            &.banktag21,
            &.banktagBOB{
              background-position: -6px -1145px;
            }
            &.banktag22,
            &.banktag22{
              background-position: -6px -1203px;
            }
            &.banktag23,
            &.banktagPINGAN{
              background-position: -6px -1261px;
            }
          }
          .itemLeft {
            display: flex;
            justify-content: left;
            /*width: 110px;*/
            align-items: center;
            .copy1 {
              margin-left: 10px;
            }
          }
          .copy {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 56px;
            height: 24px;
            background: #fff;
            color: #333;
            cursor: pointer;
            border-radius: 12px;
          }

        }
      }
      .table {
        margin-top: 10px;
        width: 316px;
        .bor(#e3e3e3);
        .item {
          height: 34px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #e3e3e3;
          &:first-child {
            .itemRight {
              color: @themeColor;
            }
          }
          > div {
            height: 100%;
            display: flex;

            align-items: center;
          }
          .itemLeft {
            width: 80px;
            background: #f5f5f5;
            border-right: 1px solid #e3e3e3;
            justify-content: center;
          }
          .itemRight {
            width: calc(~"100% - 80px");
            position: relative;
            justify-content: left;
            padding-left: 10px;
            span {
              position: absolute;
              width: 56px;
              height: 26px;
              display: flex;
              justify-content: center;
              align-items: center;
              right: 10px;
              top: 3px;
              border-radius: 12px;
              background: @themeColor;
              color: #fff;
              cursor: pointer;
            }
          }

        }
        .order {
          background: @themeColor;
          color: #fff;
          justify-content: center;
          border-bottom: none;
        }
      }
    }
    .right {
      width: 41%; // 这个不能改  要适应1024px
      display: flex;
      justify-content: center;
      align-items: flex-start;
      position: relative;
      /*user-select: none;*/
      .box {
        width: 158px;
        height: 316px;
        overflow: hidden;
        position: relative;
        ul {
          position: absolute;
          left: 0;
          top: 0;
          width: max-content;
          /*display: flex;*/
          /*justify-content: left;*/
          height: 316px;
          li {
            float: left;
            /*width: 100%;*/
            height: 100%;
            width: 158px;

            img {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
      > div {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 10px;
        em {
          display: inline-block;
          font-size: 40px;
          color: #666;
          cursor: pointer;
          &.noClick {
            cursor: not-allowed;
            color: #ccc;
          }
        }
      }
      .pre {
        em {
          transform: rotate(90deg);
        }
      }
      .next {
        em {
          transform: rotate(-90deg);
        }
      }
      .num {
        position: absolute;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 30px;
        top: 325px;
        left: 94px;
        .point {
          display: flex;
          justify-content: space-between;
          width: 50px;
          span {
            width: 8px;
            height: 8px;
            background: #ccc;
            border-radius: 50%;
            cursor: pointer;
            &.active {
              background: @themeColor;
            }
          }
        }
        .text {
          font-size: 12px;

        }

      }
    }
  }
</style>