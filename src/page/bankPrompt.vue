<template>
  <div class="prompt item">
    <div class="top">
      <div class="left">温馨提示：</div>
      <div class="right">
        <span>1、取款人经绑定后即无法修改，请正确填写。</span>
        <span>2、取款人姓名必须与银行卡号匹配，否则平台不予出款。</span>
        <span>3、绑定的资料为忘记密码时认证用，请会员务必正确填写。</span>
      </div>
    </div>
    <div class="bottom"></div>
  </div>
</template>

<script>
	export default {
		data() {
			return {}
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
  .item {
    height: 64px;
    width: 470px;
    margin: 0 auto;
    .top {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 44px;
      .left {
        width: 100px;
        text-align: right;
        margin-right: 5px;
        color: #333;
      }
      .right {
        width: 364px;
        height: 100%;
        > input {
          width: 100%;
          border-radius: 4px;
          .bor(#d9d9d9);
          height: 100%;
          padding: 0 10px;
          outline: none;
        }
        &.name {
          height: 100%;
          display: flex;
          justify-content: left;
          padding: 0 10px;
          align-items: center;
          color: @themeColor;
        }
        &.address {
          display: flex;
          justify-content: space-between;
          > div {
            width: 30% !important;
          }
        }
      }
    }
    .bottom {
      height: 20px;
      padding-left: 105px;
      text-align: left;
      font-size: 12px;
      color: @themeColor;
      em {
        font-size: 12px;
      }
    }
  }
  .prompt {
    font-size: 14px;
    color: @themeColor;
    margin-top: 8px;
    .top {
      .left {
        color: @themeColor !important;
        height: 100%;

      }
      .right {
        font-size: 12px;
        width: 364px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        span {
          display: flex;
        }
      }
    }

  }
</style>