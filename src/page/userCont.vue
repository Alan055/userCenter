<template>
  <div class="user-warpper">
    <div class="warpper">
      <div class="centerNav fl">
        <div class="user-title">
          <div>
            <div class="userIcon"> <img  src="./img/icon_youxiang.png" width="100%"/></div>
            <div class="userTime">{{baseInfo.userTime}},{{baseInfo.nickName}}</div>
          </div>
        </div>
        <div v-for="(v,i) in Menu" :key="i" class="userCenter">
          <div class="userCenter-title" :class="{'active':MenuIndex===i}" @click="MenuIndex!==i&&(MenuIndex=i,jump(v))"> <!--v-if="i===3?(baseInfo.mainAccount.type===1?true:false):true"-->
            <i class="icon_v3" v-html="v.icon"></i><span>{{v.one}}</span><i class="icon_v3 iconRight">&#xe704;</i>
          </div>
          <div class="userCenter-nav" v-show='MenuIndex===i'>
             <!-- <div class="title-nav" v-if="MenuIndex===i"></div> 小三角-->
            <p v-for="(m,n) in v.two" :key="n" :class="{'twoActive':MenuIndex===i&&twoIndex===n}"
                    @click="MenuIndex=i,twoIndex=n,setBreadFn()">
              <router-link :to="root_userCenter+m.url">{{m.label}}</router-link>
            </p>
          </div>
        </div>

      </div>

      <div class="centerMain fl">
        <div class="break">
          <breadNav></breadNav>
        </div>
        <div class="content">
          <router-view></router-view>
          <a target="_blank" :href="bindInfo.vipChannelUrl" v-if="bindInfo.vipFlag=='true'" v-show="rechargevip" style="float:right"><img src="/static/img/kefu_gif.gif" alt="充值vip客服" style="width:300px;height:282px;"></a >
        </div>

      </div>
    </div>
  </div>
</template>

<script>
	import {mapState, mapMutations, mapActions} from 'vuex';
	import breadNav from "./breadNav.vue";// 面包屑组件
	import {updaAccoutStatus} from "@/js/index.js";



	export default {
		data() {
			return {
        userTime:'',  //下午好。。。
				Menu: [ // value用于面包屑展示的名称
					{
						one: '个人中心', icon: '&#xe706;', two: [
							{label: '账户总览', value:'账户总览', url: '/userOverview',arr:[]},
							{label: '账户信息', value:'账户信息', url: '/userDetail',arr:['userPhone','addCard','fundsPass']},
							{label: '我的消息', value:'我的消息', url: '/userMessages',arr:[]},
						],
					},
					{
						one: '财务中心', icon: '&#xe707;', two: [
							{label: '充值', value:'充值方式', url: '/recharge',arr:['rechargeInfo']},
							{label: '提现', value:'提现', url: '/withdraw',arr:[]},
							{label: '转账', value:'转账', url: '/transfer',arr:[]},
						],
					},
					// {
					// 	one: '任务中心', icon: '&#xe703;', two: [
					// 		{label: '任务大厅', value:'任务大厅', url: '/task',arr:[]},
					// 	],
					// },
					{
						one: '报表中心', icon: '&#xe701;', two: [
							{label: '资金记录', value:'资金记录', url: '/fundsOrder',arr:[]},
							{label: '投注记录', value:'投注记录', url: '/betOrder',arr:[]},
							{label: '追号记录', value:'追号记录', url: '/chaseOrder',arr:[]},
						],
					},
					// {
					// 	one: '代理管理', icon: '&#xe703;', two: [
					// 		{label: '团队总揽', value:'团队总揽', url: '/teamView#page=0_proxy',href:'page=0_proxy',arr:[]},
					// 		{label: '开户中心', value:'开户中心', url: '/teamView#page=1_proxy',href:'page=1_proxy',arr:[]},
					// 		{label: '会员管理', value:'会员管理', url: '/teamView#page=2_proxy',href:'page=2_proxy',arr:[]},
					// 		{label: '在线会员', value:'在线会员', url: '/teamView#page=3_proxy',href:'page=3_proxy',arr:[]},
					// 		{label: '游戏记录', value:'游戏记录', url: '/teamView#page=4_proxy',href:'page=4_proxy',arr:[]},
					// 		{label: 'VR游戏记录', value:'VR游戏记录', url: '/teamView#page=5_proxy',href:'page=5_proxy',arr:[]},
          //     {label: '帐变记录', value:'帐变记录', url: '/teamView#page=6_proxy',href:'page=6_proxy',arr:[]},
          //     {label: '团队报表', value:'团队报表', url: '/teamView#page=7_proxy',href:'page=7_proxy',arr:[]},
					// 		{label: '第三方团队报表', value:'第三方团队报表', url: '/teamView#page=10_proxy',href:'page=10_proxy',arr:[]},
					// 	],
					// },
				],
				MenuIndex: 0,// 当前菜单的选项 一级
				twoIndex: 0,// 当前菜单的选项 二级
			};
		},
		components: {breadNav},
		computed: {
			...mapState([
        'root_userCenter',// 个人中心根路由
        'baseInfo',
        'rechargeGuide',
        'bindInfo'//取vip 客服链接
			]),
			// 默认出现,切换路由时会消失 vipFlag 变量类型是  string
			rechargevip(){
				return  this.$route.name === this.Menu[1].two[0].url.replace('/','')
      }
		},
    watch:{
	    baseInfo(){
		    !this.rechargeGuide&&this.baseInfo.nickName&&this.getRechargeGuide()// 初始化充值引导-从缓存中读取  并存在vuex中
      },
	    $route(cur){
		    this.findCurrentRouter()
	    },
    },
		methods: {

			...mapMutations(['setData','setBread','setBreadMore','getRechargeGuide']),
      ...mapActions(['findBankList']),
			// 调整路由
			jump(v) {
				if(v.two) { // 说明点击的是一级菜单  -要吧二级菜单给置位第一个
					this.$router.push({path: this.root_userCenter + v.two[0].url})
					this.twoIndex = 0;
				}else{ // 点击的是二级菜单
					this.$router.push({path: this.root_userCenter + v.url})
				}
        this.setBreadFn()
			},
			// 检测当前是哪个页面
			findCurrentRouter() {
        // 使用页面url来判断
				let url = location.pathname
				let num = url.split('/')
				if (num === 2) {
					// 说明当前路由是  /userCenters    所以默认一级和二级菜单都是0
					this.MenuIndex = 0;
					this.twoIndex = 0;
					this.setBreadFn()
				} else {
					// 说明当前路由是  /userCenters/xxxx  所以需要去寻找一级和二级路由
          let oneI = 0;
					for (let val of this.Menu) {
            let twoI = 0;
						for (let str of val.two) {
							// if (url.includes(str.url)||str.arr.find(e=>(url.includes(e)))) {
							if (url.indexOf(str.url)!=-1||str.arr.find(e=>(url.indexOf(e)!=-1))) {
								this.MenuIndex = oneI;
								this.twoIndex = twoI;
                this.setBreadFn()
								return
              }
              // 代理中心的特殊处理
              if(this.$route.hash.indexOf('proxy')!=-1){
                if (this.$route.hash.indexOf(str.href)!=-1) {
                  this.MenuIndex = oneI;
                  this.twoIndex = twoI;
                  this.setBreadFn()
                  return
                }
              }
							twoI++
						}
						oneI++;
					}
				}
			},
			// 写入面包屑
      setBreadFn(){
				this.setBread([
					{label:this.Menu[this.MenuIndex].one},
					this.Menu[this.MenuIndex].two[this.twoIndex]
				])
        this.setBreadMore([])
      },


			init() {
				this.findCurrentRouter();// 检测当前是哪个页面
        this.baseInfo.nickName&&this.getRechargeGuide()// 初始化充值引导-从缓存中读取  并存在vuex中
				updaAccoutStatus(this)// 更新用户账户状态
        this.findBankList(this)// 获取银行卡（下拉选项，最多卡数等）相关信息
			}
		}
		,
		created() {
			this.init();
		}
	}

</script>
<style lang="less" scoped>
  @import "../less/global.less";

  .user-warpper {
    width: 100%;
    min-height: 700px;
    background: #f4f8fb;
    overflow: hidden;
    > .warpper {
      width: 95%;
      max-width: 1200px;
      min-width: 950px;
      height: 800px;
      margin: 0 auto;
      margin-top: 126px;
      margin-bottom: 20px;
      overflow: hidden;
      background: #fff;
      display: flex;
      justify-content: space-between;
      .bor(@userColor_bor);
      .centerNav {
        width: 18%;
        // cursor: pointer;
        display: flex;
        flex-direction: column;
        justify-content: start;
        // justify-content: space-between;
        height: 100%;
        .user-title{
          height:140px;
          display: flex;
          justify-content: center;
          align-items: center;
          >div{
            width: 100%;
            height: 100%;
            overflow: hidden;
            color:#666666;
            .userIcon{
              width: 79px;
              height: 76px;
              text-align: center;
              margin: 0 auto;
              display: flex;
              justify-content: center;
              align-items: center;
              overflow: hidden;
              // background: @themeColor;
              border-radius: 50%;
              margin-top: 7%;
              em{
                font-size: 50px;
                color: #fff;
              }
            }
            .userTime{
              color: #2a62ab;
              font-size: 14px;
              margin-top: 12px;
            }
          }
        }
        .userCenter {
          // height: 25%;
          .userCenter-title {
            width: 100%;
            height: 55px;
            background: #fff;
            text-align: center;
            line-height: 55px;
            cursor: pointer;
            font-size: 16px;
            // border-bottom: 1px solid @userColor_bor;
            .icon_v3 {
              color: @themeColor;
              font-size: 24px;
              vertical-align: bottom;
              margin-right: 20px;
            }
            .iconRight{
              font-size:16px;
              float: right;
              transform: rotate(-90deg);
            }
            &:hover {
              background: @themeColor;
              color: #fff;
              .icon_v3 {
                color: #fff;
              }
            }
          }
          .active {
            background: linear-gradient(to right,@themeColor*1.3,@themeColor);
            color: #fff;
            .icon_v3 {
              color: #fff;
            }
          }
          .userCenter-nav {
            width: 100%;
            /*max-width: 226px;*/
            /*min-height: 64px;*/
            // height: calc(~"100% - 70px");
            position: relative;
            background-color: @userBg_Top;
            transition: all 2s;
            .title-nav {
              // border-width: 8px;
              // border-style: solid;
              // border-color: transparent transparent #fff transparent;
              width: 33px;
              height: 10px;
              background: url('img/bnt_choose_a.png') no-repeat;
              position: absolute;
              top: -10px;
              left: 46%;
            }
            p {
              text-align: center;
              // height: 100%;
              display: flex;
              justify-content: center;
              flex-wrap: wrap;
              font-size: 16px;
              height: 44px;
              // span {
              //   display: flex;
              //   justify-content: center;
              //   align-items: center;
              //   width: 50%;
              //   height: 30px;
              //   font-size: 16px;
                a {
                  width: 100%;
                  height: 100%;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  color: #666666;
                  &:hover {
                    color: @themeColor;
                  }
                }
                &.twoActive a {
                  color: @themeColor;
                  font-weight: bold;
                }
              // }
              .nowActive {
                color: @themeColor;
              }

            }
          }
        }
      }
      .centerMain {
        width: 82%;
        border-left: 1px solid @userColor_bor;
        height: 100%;
        position: relative;
        z-index: 2;
        .al_scorll();
        padding: 0 20px;
        .break {
          height: 60px;
          line-height: 60px;
          overflow: hidden;
        }
        > .content {
          height: calc(~"100% - 60px");
          position: relative;
          >a{
            position: absolute;
            top: 450px;
            right: 10px;
          }
        }
      }
    }
  }
</style>
