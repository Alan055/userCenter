<template>
  <div class="scanRecharge">
    <div class="content">
      <div class="recharge_scan_top" >
        <b></b>{{data.type}}打开扫一扫，进行充值
      </div>
      <div class="table">
        <div class="left">
          <div class="pictureLabel">¥{{Number(data.amount).toFixed(2)}}</div>
          <img :src="'data:image/gif;base64,'+data.src" alt="">
        </div>
        <div class="right">
          <div class="right1">充值金额</div>
          <div class="right2">{{Number(data.amount).toFixed(2)}}</div>
          <div class="right3">订单编号</div>
          <div class="right4">{{data.billno}}</div>
          <div class="right5">订单失效时间还剩<span>{{timeStr}}</span></div>
        </div>
      </div>
      <rechargePrompt></rechargePrompt>
    </div>
  </div>
</template>

<script>
	import rechargePrompt from "./rechargePrompt.vue";// 支付提示组件
	export default {
		props:['data'],
    components:{rechargePrompt},
		data() {
			return {
				timeStr: '',
				timer: null,// 定时器
      }
		},
		computed: {},
		watch: {},
		methods: {
			// 倒计时
			lastTime() {
				let timeNum = this.data.seconds
				this.timer = setInterval(function () {
					this.timeStr = this.timeTranslate2(timeNum--);
					if(timeNum<0){
						clearInterval(this.timer)
					}
				}.bind(this), 1000)
			}
    },
		created() {

		},
		mounted() {
			this.lastTime()
		},
	}
</script>

<style lang='less' scoped>
  @import "../less/global.less";
  .scanRecharge{
    width: 100%;
    .content{
      width: 652px;
      .recharge_scan_top{
        width: 100%;
        height: 50px;
        display: flex;
        justify-content: left;
        align-items: center;
        b{
          display: flex;
          width: 4px;
          height: 14px;
          margin-right: 10px;
          background: @themeColor;
        }
      }
      .table{
        width: 100%;
        display: flex;
        justify-content: space-between;
        .bor(#e3e3e3);
        >div{
          width: 50%;
        }
        .left{
          border-right: 1px solid #e3e3e3;
          display: flex;
          flex-direction: column;
          align-items: center;
          .pictureLabel{
            height: 36px;
            font-size: 20px;
            color: @themeColor;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          >img{
            width: 173px;
            height: 183px;
          }
          .picture{
            width: 173px;
            height: 183px;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            background: #24aa39;
            border-radius: 4px;
            color: #fff;
            span{
              display: flex;
              height: 42px;
              justify-content: center;
              align-items: center;
            }
          }
        }
        .right{
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          >div{
            height: 46px;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            border-bottom: 1px solid #e3e3e3;
            &:last-child{
              border: none;
            }
          }
          .right1,.right3{
            background: #f5f5f5;
            color: #666;
          }
          .right2{
            color: @themeColor;
            font-weight: bold;
          }
          .right4{
            color: #000;
          }
          .right5{
            color: #fff;
            background: @themeColor;
          }
        }
      }
    }
  }
</style>





















