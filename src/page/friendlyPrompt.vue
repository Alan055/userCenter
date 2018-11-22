<template>
  <div class="friendlyPrompt">
    <div class="promptLeft">温馨提示 :</div>
    <div class="promptRight" v-html="message"></div>
  </div>
</template>

<script>
	export default {
		props:['message'],
		data() {
			return {

      }
		},
		computed: {},
		watch: {},
		methods: {},
		created() {
		},
		mounted() {
		},
	}
</script>

<style lang='less' scoped>
  @import "../less/global.less";
  .friendlyPrompt{
    display: flex;
    justify-content: left;
    color: @themeColor;
    .promptLeft{
      width: 78px;
      text-align: left;
    }
    .promptRight{
      text-align: left;
    }
  }
</style>