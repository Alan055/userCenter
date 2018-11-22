<template>
  <div class="recharge">
    <div v-for="(v,i) in rechargeData" :key="i" class="item" @click="jump(i)" v-if="rechargeData&&v.arr.length>0">
      <img :src="v.pcLogoPicture?v.pcLogoPicture:'/static/img/lottery/placeChart.png'" alt="" class="logo">{{v.categoryName}}
      <img :src="v.pcActivityPicture" alt="" class="gift" v-if="v.pcActivityPicture">
      <guide type="down" class="guideDown" text="充值额外送" guideKey="bigType" width="120px"
             v-if="guideNum[i]&&rechargeGuide&&!rechargeGuide.bigType"></guide>
    </div>
    <div class="loading" v-if="!rechargeData||rechargeData.length===0"><em class="icon_v3">&#xe6d6;</em>正在加载中...</div>
    <div class="item last" v-else>敬请期待</div>
  </div>
</template>

<script>
	import service from "@/js/service.js";
	import {mapState, mapMutations, mapActions} from 'vuex';
	import guide from "./guide.vue";
  import {getBindInfo} from '@/js/index.js'


	export default {
		components: {guide},
		data() {
			return {
				guideNum: [],
        timer_:null
			}
		},
		computed: {
			...mapState(['rechargeData', 'rechargeGuide']),
		},
		watch: {
			rechargeData() {
				let i = 0
				for (let val of this.rechargeData) {
					this.guideNum[i] = (val.pcActivityPicture && this.guideNum.indexOf(true) === -1) ? true : false;
					i++
				}
			},
		},
		methods: {
			...mapMutations(['setData', 'setBread', 'setBreadMore']),
			...mapActions(['findRechargeData']),
			// 获取数据
			findData() {
				this.setData({key: "rechargeData", value: []})
				this.findRechargeData(this) // 到这个页面一定会请求的  其他页面没有就请求  有就不请求了！！！！！！
			},
			// 调整路由
			jump(i) {
				this.$router.push({path: 'rechargeInfo/' + i})
			},

			init() {
				this.setBread([{label: '财务中心',}, {label: '充值方式', url: '/recharge'}])// 处理面包屑
				this.setBreadMore([]);
				this.findData()// 获取数据
			}
		},
		created() {
			this.init();
			//10s 查询一次接口  不刷新 显示VIP客服
			var this_ = this;
      this_.timer_ = setInterval(function(){
        getBindInfo(this_);
      },10000)

		},
		mounted() {
		},
    destroyed(){
		  clearInterval(this.timer_);
    }
	}
</script>

<style lang='less' scoped>
  @import "../less/global.less";

  .recharge {
    padding: 20px 36px 0 56px;
    min-height: 280px;
    display: flex;
    justify-content: left;
    flex-wrap: wrap;
    border: 1px solid #e5e5e5;
    .bor(@userColor_bor);
    .item {
      position: relative;
      width: calc(~"(100% - 60px)/3");
      height: 120px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 16px;
      color: #333;
      background: #f6f6f6;
      .bor(@userColor_bor);
      border-radius: 8px;
      margin-bottom: 20px;
      margin-right: 20px;

      .logo {
        height: 50px;
        width: 50px;
        margin-right: 20px;
      }
      .gift {
        position: absolute;
        width: 32px;
        height: 52px;
        top: 0px;
        right: 10px;
        z-index: 10;
      }
      &:not(.last) {
        cursor: pointer;
        &:hover {
          border: 2px solid @themeColor;
        }
      }
      &:nth-child(1) b {
        background-position: -120px 0px;
      }
      &:nth-child(2) b {
        background-position: -180px 0px;
      }
      &:nth-child(3) b {
        background-position: 0px 0px;
      }
      &:nth-child(4) b {
        background-position: -300px 0px;
      }
      &:nth-child(5) b {
        background-position: -300px 0px;
      }
      &:nth-child(6) b {
        background-position: -60px 0px;
      }
      &.last {
        color: #999;
      }
      .guideDown {
        position: absolute;
        top: 1px;
        right: 11px;
        width: 30px;
        height: 43px;
      }
    }
    .loading {
      display: flex;
      justify-content: center;
      align-items: center;
      height: calc(~"100% - 40px");
      font-size: 14px;
      color: #888;
      margin: auto auto;
      em {
        color: #CFCFCF;
        font-size: 24px;
        animation: transitionSelf 0.7s linear infinite;
        margin-right: 8px;
      }
    }
  }
</style>
