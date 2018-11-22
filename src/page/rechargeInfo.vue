<template>
  <div class="rechargeInfo">
    <div class="top">
      <div class="left">
        <Select v-model="currentSelect" style="width:200px" @on-change="jump">
          <Option v-for="item,i in rechargeData" :value="i" :key="i" v-if="item.arr.length>0">{{ item.categoryName }}
          </Option>
        </Select>
      </div>
      <div class="right">
        <span @click="jumpLast()">返回上一步</span>
      </div>
    </div>
    <div class="content">
      <div class="one item">
        <div class="left">步骤1</div>
        <div class="right">
          <div class="rightTop">
            <b></b>请选择支付方式
          </div>
          <div class="rightContent" v-if="currentData">
            <span v-for="(v,i) in currentData.arr" :key="i" :class="{'active':currentDataIndex===i}"
                  @click="step!=1&&(currentDataIndex=i,changeCharge(v))" :style="step==1?'cursor: not-allowed':''">
              <img :src="v.pcLogoPicture?v.pcLogoPicture:'/static/img/lottery/placeChart.png'" alt=""> {{translation(v)}}
              <img :src="v.pcActivityPicture" alt="" class="activity" v-if="v.pcActivityPicture">
              <guide type="down1" class="guideDown" text="充值额外送" width="100px"
                     guideKey="smallType" v-if="guideNum[i]&&rechargeGuide&&!rechargeGuide.smallType"></guide>
            </span>
          </div>
          <div class="rightContent" v-if="smallType&&smallType.banklist&&smallType.banklist.length">
            <span v-for="(v,i) in smallType.banklist" :key="i" :class="'b'+v.bankId+' '+(bankIndex===i?'active1':'')"
                  class="bankThree" @click="step!=1&&(bankIndex=i)" :style="step==1?'cursor: not-allowed':''">
            </span>
          </div>
        </div>
      </div>
      <div class="two item" v-if="smallType">
        <div class="left">步骤2</div>
        <div class="right" :class="{'noTop':smallType.label.search(/qrCodeList/)>-1&&step===1}">
          <div class="rightTop" v-if="step!==1">
            <b></b>{{prompt[step].text}}
          </div>
          <!--第一步  需要设置金额-->
          <div class="process" v-if="currentData&&currentData.arr.length>0&&step===0">
            <div class="line">
              <div class="lineLeft">充值账号 :</div>
              <div class="lineRight userName">{{baseInfo.nickName}}</div>
            </div>

            <div class="line">
              <div class="lineLeft">充值金额 :</div>
              <!--输入常规金额  输入框-->
              <div class="lineRight" v-if="smallType.amountInputType!=3">
                <input v-model="rechangeMoney" @input="rechangeMoneyChange(rechangeMoney)" class="rechargeInput"
                       :placeholder="Number(smallType.minUnitRecharge).toFixed(2)+' ~ '+Number(smallType.maxUnitRecharge).toFixed(2)"/>
                <guide type="left" class="guideLeft" text="输入金额自动生成小数点" width="190px" guideKey="input" v-if="rechargeGuide&&!rechargeGuide.input"></guide>
              </div>
              <!--输入固定金额 &#45;&#45;下拉框-->
              <div class="lineRight" v-if="smallType.amountInputType==3&&rechangeMoneyArr">
                <Select v-model="rechangeMoney" style="width:200px;height: 40px;">
                  <Option v-for="item in rechangeMoneyArr" :value="item.value" :key="item.value">{{ item.label }}
                  </Option>
                </Select>
              </div>
            </div>
            <div class="line" v-if="smallType.label==='transferList'">
              <div class="lineLeft">输入附言 :</div>
              <div class="lineRight">
                <input v-model="fuyan" class="rechargeInput" placeholder="请输入附言"/>
              </div>
              <em class="icon_v3" @click="fuyan=''">&#xe648;</em>
            </div>
            <div class="lastStep">
              <span :class="{'noClick':!isNextStep||!(smallType.label==='transferList'?fuyan:true)}" @click="isNextStep&&(smallType.label==='transferList'?fuyan:true)&&goNext()">下一步</span>
              <guide type="left" class="guideLast" width="140px" text="点击进行下一步" guideKey="next" v-if="isNextStep&&(smallType.label==='transferList'?fuyan:true)&&rechargeGuide&&!rechargeGuide.next"></guide>
            </div>
            <div class="prompt">
              <friendlyPrompt :message="smallType.pcFriendlyPrompt"></friendlyPrompt>
            </div>
            <div class="tranferPrompt">{{smallType.pcPromptMessage}}</div>
          </div>
          <!--第二步 根据不同的渠道来进入不同的第二步-->
          <div class="process2" v-if="step===1">
            <!--扫码充值-->
            <scanRecharge :data="nextData" v-if="nextData.typeStr==='qrCodeList'"></scanRecharge>
            <!--转账充值-->
            <transferRecharge :info="nextData" v-if="nextData.typeStr==='transferList'"></transferRecharge>
            <!--第三方充值-->
            <div class="thridRecharge" v-if="nextData.typeStr==='thridList'">
              <div class="thridRecharge_table">
                <div class="thridRecharge_row">
                  <span class="left">存入金额</span>
                  <span class="right">{{Number(nextData.amount).toFixed(2)}}元</span>
                  <span class="copy" @click="copy(Number(nextData.amount).toFixed(2))">复制</span>
                </div>
                <div class="thridRecharge_row">
                  <span class="left">订单编号</span>
                  <span class="right">{{nextData.billno}}</span>
                  <span class="copy" @click="copy(nextData.billno)">复制</span>
                </div>
              </div>
              <div class="thridRechargeBtn">
                <guide type="up" class="guideUp" text="新页打开第三方进行充值" width="190px" guideKey="third" v-if="rechargeGuide&&!rechargeGuide.third"></guide>
                <span class="goThrid" @click="goThridRecharge()">
                  <form :action="nextData.link" target="_blank" method="post" id="goThrid">
                      进入第三方付款
                    <input type="hidden" name="text" :value="nextData.text">
                  </form>
                </span>

                <span class="goLast" @click="cancelOrder()">上一步</span>
                <!--充值 vip 客服链接--><!--普通-->
                <a  class="kefu" :href="bindInfo.vipFlag=='true'?bindInfo.vipChannelUrl:appConfigData.kefu" target="_blank">联系客服</a>
              </div>
              <friendlyPrompt :message="smallType.pcFriendlyPrompt"></friendlyPrompt>
            </div>
            <div class="bottomBtn" :class="{'toLeft':nextData.typeStr==='transferList'}"
                 v-if="nextData.typeStr!=='thridList'">
              <span class="cancel" @click="cancelOrder()">取消订单</span>
              <span class="ok" @click="ok()">充值完成</span>
              <guide type="left" class="guideDown" text="充值完成后请确认订单" width="170px" guideKey="finish" v-if="rechargeGuide&&!rechargeGuide.finish"></guide>
            </div>
          </div>
          <!--第三步  充值成功的页面-->
          <div class="process3" v-if="step===2">
            <img src="./img/rechargeSuccess.png" alt="">
            <div class="rechargeSuccess">充值成功</div>
            <span @click="jumpHome()">自动返回首页{{lastTime}}s</span>
          </div>
        </div>
      </div>
    </div>
    <div class="step2Prompt" v-if="step==2">温馨提示：3s后未返回首页，可手动点击返回。</div>

    <!--扫码充值-->
    <Modal class="rechargeModal"
           v-model="rechargeModal"
           title="充值支付"
           :closable="false"
           :mask-closable="false"
           class-name="vertical-center-modal"
           width="800px">
      <div class="rechargeModal_Box" v-if="undoneOrder">
        <!--扫码充值-->
        <scanRecharge :data="undoneOrder" v-if="undoneOrder.typeStr==='qrCodeList'"></scanRecharge>
        <!--转账充值-->
        <transferRecharge :info="undoneOrder" v-if="undoneOrder.typeStr==='transferList'"></transferRecharge>
      </div>
      <div slot="footer">
        <span class="cancel" @click="cancelOrder()">取消订单</span>
        <span class="ok" @click="ok()">
          完成订单
        </span>
        <guide type="left" class="guideFinish" text="充值成功后请确认订单" width="144px" guideKey="finishModal" v-if="rechargeModal&&rechargeGuide&&!rechargeGuide.finishModal"></guide>
      </div>
    </Modal>

  </div>
</template>

<script>
	import {mapState, mapMutations, mapActions} from 'vuex';
	import service from "@/js/service.js";
	import scanRecharge from "./scanRecharge.vue";// 扫码充值组件
	import transferRecharge from "./transferRecharge.vue";// 转账充值组件
	import friendlyPrompt from "./friendlyPrompt.vue";// 问下提示组件
	import guide from "./guide.vue";


	let appconfig = appConfig();


	export default {
		components: {scanRecharge, transferRecharge, friendlyPrompt,guide},
		data() {
			return {
				undoneOrder: null,// 未完成的订单数据
				currentSelect: 0,// 当前选中的充值类型
				currentData: null,// 当前充值类型的数据
				currentDataIndex: 0,// 当前选中的类型--第二层
				bankIndex: 0,// 如果是第三方转账  会有个银行卡选择的三级菜单
				prompt: [// 步骤2上方的提示语
					{text: '请填写充值金额'},
					{text: '请根据以下信息进一步完成充值'},
					{text: '打开扫一扫，进行充值'},
				],
				step: 0,// 步骤
				rechangeMoney: '',// 常规充值金额
				decimal: '',// 整数金额时  随机生成的整数
				rechangeMoneyArr: [],// 固定充值金额  下拉框
				fuyan:'',// 附言
				isNextStep: false,// 是否可以提交到下一步

				rechargeModal: false,// 扫码支付弹框
				nextData: null,// 第二步的订单号
				look_timer: null,// 查看是否完成订单的定时器

				lastTime: 3,// 倒计时3秒后跳到首页
				timerBack: null,// 倒计时3秒的定时器
        guideNum: [],// 这个用来控制支付方式的引导展示  只有第一个额外送显示引导
			}
		},
		computed: {
			...mapState(['rechargeData', 'root_userCenter', 'baseInfo','rechargeGuide','bindInfo']),
			smallType() {
				if (!this.currentData) return null
				return this.currentData.arr[this.currentDataIndex]
			},
			kefu() {
				return appconfig.customerService
			}
		},
		watch: {
			rechargeData() {
				this.init();
			},
			$route(aft) {
				this.init();
			},
		},
		methods: {
			...mapMutations(['setBreadMore']),
			...mapActions(['findRechargeData']),
			findType() {
				let index = this.$router.currentRoute.params.index;
				this.currentData = JSON.parse(JSON.stringify(this.rechargeData[Number(index)]))
				this.currentSelect = Number(index);

				this.setBreadMore([{label: this.currentData.categoryName, url: '/rechargeInfo/' + index}]);// 写入面包屑
			},
			// 跳转到上一步
			jumpLast() {
				this.$router.push({path: this.root_userCenter + '/recharge'})
			},
			// 跳转到指定的充值方式
			jump(i) {
				this.currentDataIndex = 0;
				this.initData()
				this.init_topGuide()// 初始化头部类型的引导 只能第一个有额外送展示引导
				this.$router.push({path: this.root_userCenter + '/rechargeInfo/' + i})
			},
			// 切换充值小类的时候
			changeCharge(v) {
				this.initData();// 初始化页面的数据
				if (v.amountInputType == 3) { // 固定金额，说明是下拉框
					let arr = v.fixAmount.split('|');
					for (let val of arr) {
						this.rechangeMoneyArr.push({label: val, value: val});
					}
					this.rechangeMoney = this.rechangeMoneyArr[0].value;// 选中第一个下拉框
				}
				this.isNumberTrue(this.rechangeMoney);
			},
			// 判断金额是否为数字  且满足在某个区间内
			isNumberTrue(v) {
				this.isNextStep = !isNaN(Number(v)) && v > 0 && v >= this.smallType.minUnitRecharge && v <= this.smallType.maxUnitRecharge ? true : false
			},
			// 随机生成一个小数
			decimalRandom() {
				this.decimal = Math.floor(Math.random() * 100);
			},
			// 第一步输入框的改变事件
			rechangeMoneyChange(aft) {
				// 常规的时候
				if (this.smallType.amountInputType == 1 && aft > this.smallType.maxUnitRecharge) {
					this.rechangeMoney = this.smallType.maxUnitRecharge
				}
				// 整数的时候  后台配置小数点 前台只能输入整数
				if (this.smallType.amountInputType == 2) {
					!this.decimal && this.decimalRandom()
					let a = parseInt(aft)
					this.rechangeMoney = !isNaN(a) ? (a > this.smallType.maxUnitRecharge ? this.smallType.maxUnitRecharge : a + this.decimal / 100).toFixed(2) : '';
					this.$nextTick(function () {
						let index = this.rechangeMoney.indexOf('.')
						$('.rechargeInfo .rechargeInput')[0].setSelectionRange(index, index)
					}.bind(this))

				}
				this.isNumberTrue(this.rechangeMoney);
			},
			// 转换名字 --因为三个充值渠道的名字都是不一样的
			translation(v) {
				switch (v.label) {
					case "transferList":
						return v.frontName;
					case "qrCodeList":
						return v.nickName;
					case "thridList":
						return v.name;
					default :
						return ''
				}
			},

			// 下一步 第二步
			goNext() {
				// 这里要去请求订单的编号
				let url = 'payment/request-transfer-pay';
				let obj = {
					amount: this.rechangeMoney,
				}
				switch (this.smallType.label) {
					case "qrCodeList":
						obj.qrid = this.smallType.id, obj.payWay = this.smallType.codeType;
						break;
					case "thridList":
						obj.pid = this.smallType.code;
						url = 'payment/request-thrid-pay'
						obj.bankco = this.smallType.banklist.length > 0 ? this.smallType.banklist[this.bankIndex].code : '';
						break;
					case "transferList":
						obj.pid = this.smallType.id, obj.payWay = this.smallType.bankType, obj.fuYan = `${this.baseInfo.nickName}:${this.fuyan}`; // 这个版本没附言了
						break;
				}
				service.post(this, url, obj).then(function (result) {
					let res = result.data
					if (res.code === 0) {
						let obj = {
							billno: res.data.billno,// 订单编号
							amount: res.data.amount,// 充值金额
							seconds: 15*60,// 15分钟
						}
						if (this.smallType.label === 'qrCodeList') {// 扫码
							obj.typeStr = 'qrCodeList';
							obj.type = this.currentData.categoryName;
							obj.src = this.smallType.fileByte
						} else if (this.smallType.label === 'transferList') {// 转账
							obj.typeStr = 'transferList';
							obj.bankId = this.smallType.bankId;// 银行卡的logo
							obj.bankType = this.smallType.bankType;// 银行卡的logo
							obj.cardId = this.smallType.cardId;// 银行卡号
							obj.cardName = this.smallType.cardName;// 银行名字
							obj.place = this.smallType.place ? this.smallType.place : '';
						} else {// 第三方
							obj.typeStr = 'thridList';
							obj.link = res.data.link;// 第三方的地址
							obj.text = res.data.text// 第三方的的发送数据 --通过form表单的submit提交
						}
						this.nextData = obj
						this.step = 1;// 第二步
						this.nextData.typeStr !== 'thridList' && this.timerLook()// 定时检测是否完成 --第三方的不需要去检查
					} else {
						this.$Modal.al_default({status: 'warning', content: res.message})
					}
				}, function (err) {
					console.log(err)
				})

			},
			// 跳转到第三方
			goThridRecharge() {
				$('#goThrid').submit()
			},
			// 取消订单
			cancelOrder() {
				this.$Modal.al_default({status: 'confim', content: '检查当前订单未支付，是否取消订单重新下单？', onOk: this.cancelAjax})
			},
			// 取消订单发送请求
			cancelAjax() {
				service.post(this, 'payment/cancelRechargeOrder', {spsn: this.undoneOrder ? this.undoneOrder.billno : this.nextData.billno}).then(function (result) {
					let res = result.data
					if (res.code === 0) {
						this.$Modal.al_default({status: 'success', content: '取消订单成功'})
						this.initData();// 初始化数据
						this.step = 0;// 切换第1步
						this.rechargeModal = false;// 关闭未完成订单的弹框
						clearInterval(this.look_timer)// 先关闭定时器
						this.changeCharge(this.currentData.arr[this.currentDataIndex])// 切换充值小类的时候
					} else {
						this.$Modal.al_default({status: 'warning', content: res.message})
					}
				}, function (err) {
					console.log(err)
				})

			},
			// 完成订单
			ok() {
				this.lookOrderStatus(true)
			},
			// 检测后台是否有未完成的订单
			// lookOrderIsFinish(bol) {// bol为true的话  就是主动的  否则就是非主动的
			// 	service.post(this, 'payment/getRecordByCategoryId', {payChannelCategoryId: this.currentData.id}).then(function (result) {
			// 		let res = result.data
			// 		if (res.code === 0) {
			// 			if (!res.data) {// 已完成 --就跳到第三层
			// 				clearInterval(this.look_timer)// 先关闭定时器
			// 				this.goLast();// 进入到第三层
			// 			} else {// 未完成
			// 				// 如果是主动的  就要提示出来
			// 				if (bol) {
			// 					this.$Modal.al_default({status: 'warning', content: '检测到订单尚未完成，请稍后再试！'})
			// 				}
			// 			}
			// 		} else {
			// 			console.log(res.message) // 这个不要alert出来
			// 		}
			// 	}, function (err) {
			// 		console.log(err)
			// 	})
			// },
			// 检查指定订单是否完成
			lookOrderStatus(bol) {
				if(this.look_timer){
					service.post(this, 'account/search-recharge', {
						orderNo: this.undoneOrder ? this.undoneOrder.billno : this.nextData.billno,
						page: 0,
						size: 10,
					}).then(function (result) {
						let res = result.data
						if (res.code === 0) {
							let obj = res.data.list[0]
							if (obj.orderStatus === 0) {// 已完成 --就跳到第三层
								clearInterval(this.look_timer)// 先关闭定时器
								this.look_timer = null
								this.goLast();// 进入到第三层
							} else if (obj.orderStatus === 7 || obj.orderStatus === 8) {// 取消和失败
								this.init()// --初始化页面
							} else {// 未完成 --进行中
								// 主动动作
								bol && this.$Modal.al_default({status: 'warning', content: '检查到您的订单暂未完成，请稍后再试'})
								// 定时器被动的动作
								// 无动作
							}
						} else {
							this.$Modal.al_default({status: 'warning', content: res.message})
						}
					}, function (err) {
						console.log(err)
					})
        }

			},
			// 定时检测未完成的订单是否完成  -30秒
			timerLook() {
				clearInterval(this.timerBack)
				this.look_timer = setInterval(function () {
					this.lookOrderStatus()
				}.bind(this), 30 * 1000)
			},

			// 跳到第三步
			goLast() {
				this.rechargeModal = false;// 关闭未完成订单的弹框
				this.step = 2;// 跳到第三步
				this.lastTime = 3;// 定时器为3秒钟
        let that = this;
				this.timerBack = setInterval(function () {
					if (that.lastTime <= 0) {
						that.lastTime = 0
						that.lookOrderStatus()
						clearInterval(that.look_timer)// 取消30秒的循环查询的定时器
						clearInterval(that.timerBack)// 取消当前这个定时器
						that.init()
					} else {
						that.lastTime--;
					}
				}, 1000)
			},
			// 跳转到首页
			jumpHome() {
				this.$router.push({path: '/userCenters/recharge'})
			},

			// 查看当前大类下未支付的订单 （ 扫码 转账 这里没有第三方）
			findUndoneOrder() {
				let that = this;
				service.post(this, 'payment/getRecordByCategoryId', {payChannelCategoryId: this.currentData.id}).then(function (result) {// payChannelCategoryId为1是pc的
					let res = result.data
					if (res.code === 0) {
						if (!res.data) {// 返回的数据为null的时候  说明是没有未支付的数据  不做任何操作
							this.undoneOrder = null
							this.rechargeModal = false
							this.changeCharge(this.currentData.arr[0])// 切换充值小类的时候
						} else {
							let obj = {
								billno: res.data.rechargeOrder.spsn,// 订单
								amount: res.data.rechargeOrder.cash,// 现金
								seconds: res.data.rechargeOrder.seconds,// 倒计时
							};
							for (let key in res.data) {
								if (key === 'remitBankInfo') {// 转账
									obj.typeStr = 'transferList';// 类型是转账
									obj.bankId = res.data.rechargeOrder.way// 银行卡的logo
									obj.cardId = res.data[key].remitBankNo// 银行卡号
									obj.cardName = res.data[key].sn// 户主名字
									obj.place = res.data[key].place// 银行卡号
									obj.bankType = res.data[key].bankType// 银行卡号
                  obj.bankAlias=res.data[key].bankAlias;// 银行标识
								} else if (key === 'qrCodePayInfo') {// 二维码
									obj.typeStr = 'qrCodeList';// 类型是扫码
									obj.type = res.data[key].nickName;// 名字
									obj.src = res.data[key].fileByte;// 二维码链接
								}
							}
							this.undoneOrder = obj
							this.rechargeModal = true
							this.timerLook()// 定时检测是否完成
						}
					} else {
						that.$Modal.al_default({status: 'warning', content: res.message})
					}
				}, function (err) {
					console.log(err)
				})
			},
			// 每次切换小类和大类的时候  都应该去初始化页面的数据
			initData() {
				this.fuyan = this.bindInfo.withdrawName?this.bindInfo.withdrawName:''
				this.bankIndex = 0;//
				this.rechangeMoney = '';// 常规充值金额
				this.isNextStep = false;// 不可进行下一步
				this.decimal = '';// 整数金额时  随机生成的整数
				this.step = 0;// 步骤
				this.rechangeMoneyArr = [];// 固定充值金额  下拉框
				this.nextData = null// 第二步的订单号
				this.undoneOrder = null// 未完成的订单数据
				clearInterval(this.timerBack)
				clearInterval(this.look_timer)// 先关闭定时器
	},
      // 初始化头部类型的引导 只能第一个有额外送展示引导
      init_topGuide(){
				let i = 0;
	      for(let val of this.currentData.arr){
		      this.guideNum[i] = (val.pcActivityPicture && this.guideNum.indexOf(true)===-1) ? true : false;
		      i++
	      }
      },
			init() {
				this.rechargeModal = false; // 初始化关闭弹框
				if (!this.rechargeData) {
					this.findRechargeData(this)
					return
				}

				this.guideNum = []// 处理引导
				this.findType();// 通过路由找类型
        this.init_topGuide()// 初始化头部类型的引导 只能第一个有额外送展示引导
				this.findUndoneOrder()// 查看当前大类下未支付的订单 （ 扫码 转账 这里没有第三方）
			}
		},
		created() {
			this.init()
		},
		mounted() {
		},
		destroyed() {
			clearInterval(this.timerBack)
			clearInterval(this.look_timer)// 先关闭定时器
		}
	}
</script>

<style lang='less' scoped>
  @import "../less/global.less";

  .rechargeInfo {
    .top {
      display: flex;
      justify-content: space-between;
      height: 60px;
      align-items: center;
      border-top: 1px solid @userColor_bor;
      .right {
        span {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 140px;
          height: 36px;
          border-radius: 18px;
          background-color: #e8e8e8;
          color: #666;
          font-size: 14px;
          cursor: pointer;
        }
      }
    }
    .content {
      .bor(@userColor_bor);
      .item {
        display: flex;
        justify-content: left;

        width: 100%;
        > div {
          height: auto;
          padding: 15px 0;
        }
        .noTop {
          padding: 0 !important;
        }
        .left {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 8.5%;
          border-right: 1px solid @userColor_bor;
        }
        .right {
          width: 91.5%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          > div {
            display: flex;
            justify-content: left;
            padding-left: 10px;
            align-items: center;
          }
          .rightTop {
            font-size: 14px;
            color: #333;
            b {
              display: flex;
              width: 4px;
              height: 14px;
              background: @themeColor;
              margin-right: 10px;
            }
          }
          .rightContent {
            display: flex;
            justify-content: left;
            flex-wrap: wrap;
            &:nth-child(3) {
              margin-top: 10px;
              border-top: 1px solid @userColor_bor;
            }
            span {
              display: flex;
              width: 140px;
              height: 44px;
              color: #666;
              border-radius: 4px;
              justify-content: center;
              align-items: center;
              margin-right: 10px;
              margin-top: 10px;
              cursor: pointer;
              position: relative;
              .bor(@userColor_bor);
              img {
                width: 20px;
                height: 20px;
                margin-right: 5px;
              }
              .activity {
                width: 20px;
                height: 30px;
                position: absolute;
                right: 5px;
                margin-right: 0;
                top: 0;
              }
              &.active {
                background: @themeColor;
                color: #fff;
                border: none;
              }
              &.active1 {
                .bor(@themeColor)
              }
            }
            .guideDown{
              position: absolute;
              top: 0;
              right: 5px;
              width: 19px;
              height: 25px;
              .box{
                left: -2px;
              }
            }
            .bankThree {
              background: url("./img/banklist.jpg") no-repeat;
              /*background-size: 140px 40px;*/
            }

            .b1 {
              background-position: -10px 0;
            }
            .b2 {
              background-position: -10px -40px;
            }
            .b3 {
              background-position: -10px -80px;
            }
            .b4 {
              background-position: -10px -120px;
            }
            .b5 {
              background-position: -10px -160px;
            }
            .b6 {
              background-position: -10px -200px;
            }
            .b7 {
              background-position: -10px -240px;
            }
            .b8 {
              background-position: -10px -280px;
            }
            .b9 {
              background-position: -10px -320px;
            }
            .b10 {
              background-position: -10px -360px;
            }
            .b11 {
              background-position: -10px -400px;
            }
            .b12 {
              background-position: -10px -440px;
            }
            .b13 {
              background-position: -10px -480px;
            }
            .b14 {
              background-position: -10px -520px;
            }
            .b15 {
              background-position: -10px -560px;
            }
            .b16 {
              background-position: -10px -600px;
            }
            .b17 {
              background-position: -10px -640px;
            }
            .b18 {
              background-position: -10px -680px;
            }
            .b19 {
              background-position: -10px -720px;
            }
            .b20 {
              background-position: -10px -760px;
            }
            .b21 {
              background-position: -10px -800px;
            }
            .b22 {
              background-position: -10px -840px;
            }
            .b23 {
              background-position: -10px -880px;
            }
            .b24 {
              background-position: -10px -920px;
            }
            .b98 {
              background-position: -10px -2px;
            }
            .b99 {
              background-position: -10px -2px;
            }
          }
        }
      }
      .one {
        min-height: 112px;
        border-bottom: 1px solid @userColor_bor;
      }
      .two {
        font-size: 14px;
        .process {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: left !important;
          > div {
            display: flex;
            justify-content: left;
            align-items: center;
            width: 100%;
            padding-left: 14px;
            margin-top: 10px;
            position: relative;
            .lineLeft {
              min-width: 70px;
              text-align: left;
            }
            .userName {
              color: @themeColor;
            }
            input {
              width: 360px;
              height: 40px;
              .bor(@userColor_bor);
              outline: none;
              padding-left: 10px;
              border-radius: 4px;
            }
            .lineRight{
              position: relative;
              .guideLeft{
                position: absolute;
                width: 360px;
                height: 40px;
                top: 0px;
                border-radius: 6px;
                /*cursor: text;*/
                /*z-index: -5;*/
              }
            }
            em{
              position: absolute;
              left: 420px;
              cursor: pointer;
              font-size: 18px;
              color: #ccc;
            }
          }
          .lastStep {
            position: relative;
            .guideLast{
              position: absolute;
              width: 140px;
              height: 44px;
              border-radius: 22px;
              top: 30px;
              left: 14px;
            }
            span {
              width: 140px;
              height: 44px;
              color: #fff;
              background: @themeColor;
              border-radius: 22px;
              display: flex;
              justify-content: center;
              align-items: center;
              padding: 0;
              margin-top: 30px;
              cursor: pointer;
              &.noClick {
                background: #ccc;
              }
            }
          }
          .prompt {
            margin-top: 20px;
            color: @themeColor;
            display: flex;
            justify-content: left;
            align-items: flex-start;
            .promptLeft {
              width: 70px;
            }
            .promptRight {
              display: flex;
              justify-content: center;
            }
          }

        }
        .process2 {
          display: block !important;
          .thridRecharge {
            .thridRecharge_table {
              width: 430px;
              margin-top: 10px;
              .bor(@userColor_bor);
              .thridRecharge_row {
                width: 100%;
                height: 34px;
                position: relative;
                display: flex;
                justify-content: space-between;
                &:first-child {
                  border-bottom: 1px solid @userColor_bor;
                  .right {
                    color: @themeColor;
                  }
                }
                > span {
                  display: flex;
                  height: 100%;
                  justify-content: center;
                  align-items: left;
                }
                .left {
                  width: 80px;
                  background: #f5f5f5;
                  color: #666;
                }
                .right {
                  align-items: start !important;
                  padding-left: 10px;
                }
                .copy {
                  position: absolute;
                  right: 5px;
                  background: @themeColor;
                  color: #fff;
                  width: 56px;
                  height: 23px;
                  border-radius: 12px;
                  top: 5px;
                  cursor: pointer;
                }
              }
            }
            .thridRechargeBtn {
              margin-top: 28px;
              height: 44px;
              display: flex;
              justify-content: left;
              align-items: center;
              margin-bottom: 20px;
              position: relative;
              .guideUp{
                position: absolute;
                width: 140px;
                height: 44px;
                border-radius: 22px;
                top: 0px;
                left: 0px;
              }
              > span {
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 10px;
                cursor: pointer;
              }
              .goThrid {
                width: 140px;
                height: 100%;
                background: @themeColor;
                color: #fff;
                border-radius: 22px;
                a {
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  color: #fff;
                  width: 100%;
                  height: 100%;
                }
              }
              .goLast {
                width: 140px;
                height: 100%;
                background: #e0e0e0;
                color: #666;
                border-radius: 22px;
              }
              .kefu {
                margin-left: 10px;
              }
            }
          }
          .bottomBtn {
            width: 100%;
            height: 44px;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 30px;
            position: relative;
            .guideDown{
              position: absolute;
              width: 140px;
              height: 44px;
              border-radius: 22px;
              top: 0;
              left: 431px;
            }
            &.toLeft {
              justify-content: left;
              .guideDown{
                left: 152px !important;
              }
            }
            span {
              display: flex;
              height: 100%;
              justify-content: center;
              align-items: center;
              width: 140px;
              background: @themeColor;
              color: #fff;
              border-radius: 22px;
              cursor: pointer;
              &:first-child {
                margin-right: 12px;
                background: #e0e0e0;
                color: #333;
              }
            }

          }
        }
        .process3 {
          display: flex;
          flex-direction: column;
          img {
            width: 300px;
            height: 250px;
          }
          .rechargeSuccess {
            margin-bottom: 20px;
            font-size: 23px;
            color: #04b682;
            font-weight: bold;
            padding-left: 10px;
          }
          span {
            display: flex;
            width: 140px;
            height: 44px;
            justify-content: center;
            align-items: center;
            background: @themeColor;
            color: #fff;
            border-radius: 22px;
            cursor: pointer;
            padding-left: 10px;
          }
        }
      }
    }
    .step2Prompt {
      font-size: 14px;
      color: #666;
      margin-top: 12px;
      display: flex;
      justify-content: left;
      align-items: center;
      padding-left: 100px;
    }
  }
</style>















