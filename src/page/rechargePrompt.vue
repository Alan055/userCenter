<template>
  <div class="rechargePrompt">
    <div>支付时，请务必按照页面显示的金额（含小数点）进行支付，否则可能将导致存款订单延误或者掉单。</div>
    <div v-if="bindInfo.vipFlag=='true'">支付遇到困难？<a :href="bindInfo.vipChannelUrl" target="_blank">请联系客户人员获得帮助</a></div>
    <div v-else>支付遇到困难？<a :href="appConfigData.kefu" target="_blank">请联系客户人员获得帮助</a></div>
  </div>
</template>

<script>
  import {mapState} from 'vuex';
	let appconfig = appConfig();

	export default {
		data() {
			return {}
		},
		computed: {
      ...mapState([
        'appConfigData',
        'bindInfo',//取vip 客服链接
      ]),
			// kefu(){
			// 	return appconfig.customerService
      // }
    },
		watch: {},
		methods: {
    },
		created() {

		},
		mounted() {
		},
	}
</script>

<style lang='less' scoped>
.rechargePrompt{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  padding: 15px 0;
  color: #666;
  text-align: left;
  a{
    color: #258edf;
    cursor: pointer;
  }
}
</style>