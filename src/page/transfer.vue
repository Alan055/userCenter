<template>
  <div class="transfer">
    <div class="top">
      <div class="topItem">
        <em class="icon_v3" :class="{'tran':isUpdata}" @click="!isUpdata&&updata()">&#xe663;</em>第三方资产：<span
        class="red">¥{{(Number(nav[0].money)+Number(nav[1].money)+Number(nav[2].money)).toFixed(2)}}</span>
      </div>
      <div class="topItem center">
        <em class="icon_v3 red">&#xe603;</em>
        <span @click="allTransfer()"><em class="icon_v3">&#xe604;</em>一键转入钱包</span>
        <em class="icon_v3 blue">&#xe601;</em>
      </div>
      <div class="topItem">
        <em class="icon_v3" :class="{'tran':isUpdata1}" @click="!isUpdata1&&updata1()">&#xe663;</em>钱包：<span
        class="blue">¥{{Number(baseInfo.lotteryBalance).toFixed(4)}}</span>
      </div>
    </div>
    <div class="contentBox">
      <div class="nav">
        <div v-for="(v,i) in nav" :key="i" class="navItem" :class="{'active':navIndex===i}" @click="navIndex=i;money=''">
          <span class="label">{{v.label}}</span>
          <span class="money">{{Number(v.money).toFixed(2)}}</span>
        </div>
      </div>
      <div class="content">
        <div class="chooseDirection">
          <span v-for="(v,i) in direction" :key="i" :class="{'active':directionIndex===i}"
                @click="directionIndex=i;money=''">
            {{v.label}}
          </span>
        </div>
        <div class="balance">可转入金额: <span>{{Math.floor(directionIndex===1?nav[navIndex].money:Number(baseInfo.lotteryBalance))}}元</span>
        </div>
        <div class="write">
          转入金额：<input type="text" v-model="money"
                      :placeholder="initshow"><span
          @click="money=initshow">全部转入</span>
          <em>元</em>
        </div>
        <div class="btn" :class="{'noClick':!(money>0)}" @click="money>0&&tranfer()">确定转入</div>
      </div>
      <div class="loadBox" v-if="loading">
        <em class="icon_v3">&#xe6d6;</em>正在加载中....
      </div>
    </div>
  </div>
</template>

<script>
	import {mapState, mapMutations, mapActions} from 'vuex';
	import service from "@/js/service.js";
	import md5 from "js-md5";
	import {userInit} from '@/js/index.js'// 刷新金额

	export default {
		data() {
			return {
				isUpdata: false, // 是否可以点击刷新按钮---第三方游戏
				isUpdata1: false, // 是否可以点击刷新按钮---钱包
				nav: [ // 导航栏
					{label: 'AG', money: 0, cbId: 5, value: 'agin_01'}, // 第三方平台的余额 --ag
					{label: 'IM', money: 0, cbId: 6, value: 'im_01'}, // 第三方平台的余额 --im
					{label: 'KY', money: 0, cbId: 7, value: 'ky_01'}, // 第三方平台的余额 --ky
				],
				navIndex: 0, // 当前选中导航栏
				direction: [
					{label: '转入游戏'},
					{label: '转入钱包'},
				],
				directionIndex: 0, // 当前选中的方向
				money: '', // 写入的金额
				timer: null, // 定时器
				loading: false, // 刷新中

				str: ''// 一键转到钱包的接口 提示信息
			}
		},
		computed: {
			...mapState(['baseInfo', 'platformBalance']),
			initshow() {
				return Math.floor(this.directionIndex === 1 ? this.nav[this.navIndex].money : Number(this.baseInfo.lotteryBalance ? this.baseInfo.lotteryBalance : 0))
			}
		},
		watch: {
			money(aft) {
				let num = parseInt(aft)
				if (isNaN(num)) {
					num = ''
				} else {
					let canMoney = Math.floor(this.directionIndex === 1 ? this.nav[this.navIndex].money : this.baseInfo.lotteryBalance)
					num > canMoney && (num = canMoney)
				}
				this.money = num
			},
			platformBalance: {
				deep: true,
				handler: function () {
					this.init()
				}
			}
		},
		methods: {
			...mapMutations(['setPlatformBalance']),
			updata() {
				this.isUpdata = true// 不可以点击刷新
				setTimeout(function () {
					this.outGame_init(0, true, true)
				}.bind(this), 1000)
			},
			updata1() {
				this.isUpdata1 = true// 不可以点击刷新
				this.$store.commit('setBaseInfo', {lotteryBalance: '0.00'})
				setTimeout(function () {
					userInit().initlotteryBalance(this)// 刷新金额
					this.isUpdata1 = false// 可以点击刷新
				}.bind(this), 1000)
			},
			// 获取第三方平台的数据  余额
			outGame_init(i, continuous, isForced) {
				if (i >= this.nav.length) return
				let obj = {platformId: this.nav[i].cbId};
				isForced && (obj.isForced = true)// 传值的话  就是手动刷新按钮  没有传值的话  就不是手动刷新
				this.$http.post('/yx/thirdGameApi/common/showThirdAmount', obj).then(function (result) {
					let res = result.data
					if (res.code === 0) {
						this.setPlatformBalance({[this.nav[i].value]: res.data})
						continuous ? i >= (this.nav.length - 1) && (this.isUpdata = false) : this.isUpdata = false // 可以点击刷新
						continuous && (this.outGame_init(++i, true))
					} else {
						this.$Modal.al_default({status: 'warning', content: res.message})
						this.isUpdata = false // 可以点击刷新
					}
				}, function (err) {
					this.isUpdata = false// 可以点击刷新
					console.log(err)
				})
			},


			// 转账事件
			tranfer() {
				this.$Modal.al_default({status: 'confim', content: `是否从${this.directionIndex === 1 ? this.nav[this.navIndex].label+'账户' : '钱包'}里面转入${this.money}元到${this.directionIndex === 0? this.nav[this.navIndex].label+'账户' : '钱包'}`, onOk: this.sendAjax})
			},
			// 发送请求
			sendAjax(i, money) {
        this.loading = true;// 加载中...
        // !i && (i = this.navIndex)
				i = this.navIndex
        !money && (money = this.money)
        console.log(this.nav[i],i,this.navIndex,this.money);
				// 先获取token
				let that = this
				this.$http.post('/yx/api/i/u/bank/playerTransferRefreshToken').then(function (result) {
					let res = result.data
					if (res.code === 0) {
						that.$http.post('/yx/api/i/u/bank/playerTransfer', {
							turnOut: that.directionIndex === 1 ? that.nav[i].value : 'sobet_01',
							turnIn: that.directionIndex === 0 ? that.nav[i].value : 'sobet_01',
							cash: money,
							// payPasswd: md5('a12345678'), // 这个后面要去掉  不要资金密码了
							token: res.data,
						}).then(function (result1) {
							let res1 = result1.data
							if (res1.code === 0) {
								this.$Modal.al_default({status: 'success', content: res1.data})
								this.money = '',
									userInit().initlotteryBalance(that)// 刷新金额
								that.outGame_init(i, false, true)// 刷新第三方平台的金额
							} else {
								this.$Modal.al_default({status: 'warning', content: res1.message})
							}
							that.loading = false;// 加载中关闭
						}, function (err1) {
							console.log(err1)
							that.loading = false;// 加载中关闭
						})
					} else {
						this.$Modal.al_default({status: 'warning', content: res.message})
						that.loading = false;// 加载中关闭
					}
				}, function (err) {
					console.log(err)
					that.loading = false;// 加载中关闭
				})
			},
			// 一键转入
			allTransfer() {
				// 总资产为0  不允许转入
				if (Number(this.nav[0].money) < 1 && Number(this.nav[1].money) < 1 && Number(this.nav[2].money) < 1) {
					this.$Modal.al_default({status: 'confim', content: '转账金额不足'})
				} else {
					this.$Modal.al_default({status: 'confim', content: '是否全部转入到钱包', onOk: this.sendAjax_all})
				}
			},
			sendAjax_all() {
				this.sendAjax_all1(0)// 这个用来递归循环
			},
			sendAjax_all1(t) {
				// 一键转入到钱包
				let that = this;
				let p = [this.$http.post('/yx/api/i/u/bank/playerTransferRefreshToken'),];
				Promise.all(p).then(function (result) {
					let k = []
					let i = 0;
					for (let val of result) {
						let res = val.data
						if (res.code === 0) {
							k.push(that.$http.post('/yx/api/i/u/bank/playerTransfer', {
								turnOut: that.nav[t].value,
								turnIn: 'sobet_01',
								cash: parseInt(that.nav[t].money),
								token: res.data
							}))
						} else {
							console.log(res.message)
						}
						i++
					}
					Promise.all(k).then(function (data) {
						let j = 0;
						for (let val of data) {
							let res1 = val.data
							that.str += that.nav[t].label + (res1.code === 0 ? '转账成功' : res1.message) + '<br>'
							j++
						}
						t++;
						if (t === that.nav.length) {
							if (that.str.split('成功').length - 1 === 3) { // 如果都是成功的话，那就不提示三遍了  只提示一遍即可
								that.str = '转账成功'
								that.$Modal.al_default({status: 'success', content: that.str})
							} else {
								that.$Modal.al_default({status: 'warning', content: that.str})
							}

							that.str = '';
							that.outGame_init(0, true, true)
							userInit().initlotteryBalance(that)// 刷新金额
						} else {
							that.sendAjax_all1(t)
						}

					}).catch(function (err) {
						console.log(err)
					})
				}).catch(function (err) {
					console.log(err)
				})
			},

			init() {

				if (this.platformBalance.agin_01 === undefined) return
				this.nav[0].money = this.platformBalance.agin_01
				this.nav[1].money = this.platformBalance.im_01
				this.nav[2].money = this.platformBalance.ky_01
			}
		},
		created() {
			this.outGame_init(0, true, true)// 获取第三方平台的数据
			this.init()
		},
		mounted() {
		},
		destroyed() {
		}
	}
</script>

<style lang='less' scoped>
  @import "../less/global.less";

  @keyframes tran {
    0% {
      transform: rotate(0deg)
    }
    100% {
      transform: rotate(360deg)
    }
  }

  .transfer {
    .top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      .topItem {
        width: calc(~"(100% - 20px)*0.27");
        height: 90px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        font-size: 18px;
        background: #f6f6f6;
        .bor(@userColor_bor);
        color: #666;
        em {
          display: inline-block;
          color: @themeColor;
          cursor: pointer;
          &.tran {
            animation: tran 0.5s linear alternate infinite;
            cursor: not-allowed;
          }
        }

        .red {
          color: @themeColor;
        }
        .blue {
          color: @themeColor_Sec;
        }

      }
      .center {
        width: calc(~"(100% - 20px)*0.46");
        background: #ececec;
        > em {
          font-size: 38px;
        }
        span {
          cursor: pointer;
          width: 164px;
          height: 44px;
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 0 27px;
          background: #fff;
          .bor(@userColor_bor);
          border-radius: 22px;
          font-size: 16px;
          em {
            margin-right: 10px;
          }
        }
      }
    }
    .contentBox {
      position: relative;
      .bor(@userColor_bor);
      .nav {
        width: 100%;
        height: 60px;
        display: flex;
        justify-content: left;
        align-items: center;
        background: #f6f6f6;
        .navItem {
          width: 77px;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          cursor: pointer;
          border-right: 1px solid @userColor_bor;
          &:last-child {
            border-right: none;
          }
          .label {
            font-size: 20px;
            color: #333;
          }
          .money {
            color: @themeColor;
            font-size: 14px;
          }
          &.active {
            position: relative;
            background: #fff;
            .al_navWood()
          }
        }
      }
      .content {
        .chooseDirection {
          margin: 24px auto 36px;
          height: 44px;
          display: flex;
          justify-content: center;
          span {
            width: 120px;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            .bor(@userColor_bor);
            background: #e8e8e8;
            color: #333;
            border-radius: 22px;
            font-size: 16px;
            cursor: pointer;
            &:nth-child(1) {
              margin-right: 10px;
            }
            &.active {
              background: @themeColor;
              border: none;
              color: #fff;
            }
          }
        }
        .balance {
          font-size: 18px;
          color: #666;
          span {
            color: @themeColor;
          }
        }
        .write {
          margin: 24px auto 40px;
          height: 50px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 16px;
          color: #999;
          position: relative;
          width: fit-content;
          input {
            width: 363px;
            height: 100%;
            padding: 0 10px;
            .bor(@userColor_bor);
            border-radius: 4px;
            outline: none;
            margin: 0 10px;
          }
          span {
            width: 100px;
            height: 36px;
            border-radius: 18px;
            display: flex;
            justify-content: center;
            align-items: center;
            background: @themeColor_Sec;
            color: #fff;
            cursor: pointer;
          }
          em {
            position: absolute;
            right: 120px;
            top: 14px;
          }
        }
        .btn {
          margin: 0 auto 40px;
          background: @themeColor;
          color: #fff;
          width: 177px;
          height: 48px;
          border-radius: 24px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 16px;
          cursor: pointer;
          &.noClick {
            background: #e6e6e6;
            cursor: not-allowed;
          }
        }
      }
      .loadBox {
        position: absolute;
        width: 100%;
        height: 100%;
        background: rgba(220, 220, 220, 0.6);
        top: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #333;
        font-size: 18px;
        em {
          font-size: 20px;
          display: flex;
          animation: tran 0.5s linear alternate infinite;
        }
      }
    }
  }
</style>















