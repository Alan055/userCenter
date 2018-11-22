<template>
  <div class="guide" ref="guideDom">
    <div class="box" :class="type" v-if="type.includes('left')" :style="`width:${width};`">
      {{text}}
      <img class="triangle" src="./img/guide_tri.png">
    </div>
    <div class="box" :class="type" v-if="type.includes('down')" :style="`width:${width};`">
      {{text}}
      <img class="triangle" src="./img/guide_tri.png">
    </div>
    <div class="box" :class="type" v-if="type.includes('up')" :style="`width:${width};`">
      {{text}}
      <img class="triangle" src="./img/guide_tri.png">
    </div>
  </div>
</template>

<script>
	import {mapState, mapMutations, mapActions} from 'vuex';
	export default {
		props:['type','text','guideKey','width'],
		data() {
			return {}
		},
		computed: {},
		watch: {},
		methods: {
      ...mapMutations(['setRechargeGuide']),
			init(){
				// 在改元素父级的父级绑定一个点击事件  点击就关闭这个引导状态
        let that = this;
        let ele = $(this.$refs.guideDom).parent().parent()
				ele.click(function () {
					that.setRechargeGuide({[that.guideKey]:true})
					ele.unbind('click')
        })
      }
    },
		created() {
		},
		mounted() {
			this.init()
		},
	}
</script>

<style lang='less' scoped>
  @import "../less/global.less";
  .guide{
    position: relative;
    /*border: 1px solid #f53b4a;*/
    width: 20px;
    height: 20px;
    box-shadow: 0px 0px 35px @themeColor;
    .box{
      padding: 10px;
      border: 1px solid @themeColor;
      position: absolute;
      border-radius: 6px;
      background: @userBg_Top;
      color: #333;
      /*width: max-content;*/
      img{
        position: absolute;
      }
    }
    .left{
      top: -2%;
      left: calc(~"100% + 30px");
      img{
        top: 17px;
        left: -10px;
        transform: rotate(90deg);
      }
    }
    .down{
      top: -72px;
      left: -4px;
      img{
        bottom: -8px;
        left: 10px;
      }
    }
    .down1{
      top: -58px;
      left: -8px;
      img{
        bottom: -8px;
        left: 10px;
      }
    }
    .up{
      top: 62px;
      left: -2px;
      img{
        top: -8px;
        left: 40px;
        transform: rotate(-180deg);
      }
    }


  }
</style>