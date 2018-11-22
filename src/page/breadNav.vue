<template>
  <div class="breakBox">
    <div class="breadMain" v-if="breadbefore.length>0">
      <div class="fl">
        <h3>{{breadbefore[0].label}}</h3>
      </div>
      <div v-for="(v,i) in breadbefore" :key="i" class="fl" v-if="i>0">
        <h3 class="fl">&gt;</h3>
        <h3 class="fl" :class="{'active':v.url}" @click="jump(v)">{{v.value?v.value:v.label}}</h3>
      </div>
      <div v-for="(v,i) in breadafter" :key="i" class="fl" v-if="breadafter.length>0">
        <h3 class="fl">&gt;</h3>
        <h3 class="fl" :class="{'active':v.url}" @click="v.url&&jump(v)">{{v.label}}</h3>
      </div>
    </div>
  </div>
</template>

<script>
	import base from '@/js/pubilc.js'
	import {mapState} from 'vuex';

	export default {
		data() {
			return {
			};
		},
		components: {},
		computed: {
			...mapState(['breadbefore', 'breadafter', 'root_userCenter']),

		},
		watch: {},
		methods: {
			jump(v) {
				this.$router.push({path: this.root_userCenter + v.url})
			}
		},
		created() {
		},
	}

</script>
<style lang="less" scoped>
  @import "../less/global.less";
  .fl {
    float: left;
  }
  .breakBox {
    width: 100%;
    height: 100%;
    .breadMain {
      overflow: hidden;
      display: flex;
      justify-content: left;
      align-items: center;
      h3{
        color: #666666;
      }
      h3.active {
        color: @themeColor;
        cursor: pointer;
      }
    }
  }
</style>
