<template>
  <div class="addCard">
    <div class="addcard_content" v-if="Page[0].status">
      <div class="item">
        <div class="top">
          <div class="left">取款人姓名：</div>
          <div class="right name">{{name?name[0]+ name.replace(/./g,'*').substr(0,name.length-1):name}}</div>
        </div>
        <div class="bottom"></div>
      </div>
      <div class="item">
        <div class="top">
          <div class="left">银行卡号：</div>
          <div class="right"><input type="text" @input="isCanNext()" v-model="bankNumber1" maxlength="19"
                                    placeholder="请输入15-19位数字的银行卡号"></div>
        </div>
        <div class="bottom" v-show="!/^[1-9]{1}\d{14,18}$/.test(bankNumber1)&&bankNumber1!==''">
          <em class="icon_v3">&#xe645;</em>输入的银行卡号有误
        </div>
      </div>
      <div class="item">
        <div class="top">
          <div class="left">确定卡号：</div>
          <div class="right"><input type="text" @input="isCanNext()" v-model="bankNumber2" maxlength="19"
                                    placeholder="请再次输入银行卡号">
          </div>
        </div>
        <div class="bottom" v-show="bankNumber2!=bankNumber1&&String(bankNumber2).length>0"><em
          class="icon_v3">&#xe645;</em>两次输入的银行卡不同
        </div>
      </div>
      <div class="item">
        <div class="top">
          <div class="left">开户银行：</div>
          <div class="right">
            <Select v-model="bankName" style="width:364px;height: 44px;" :label-in-value="true"
                    @on-change="bankNameChange" v-if="bankInfo">
              <Option v-for="v,i in bankInfo.bankList" :value="v.code" :key="i">{{ v.name }}</Option>
            </Select>
          </div>
        </div>
        <div class="bottom"></div>
      </div>
      <div class="item">
        <div class="top">
          <div class="left">卡类别：</div>
          <div class="right">
            <Select v-model="bankType" style="width:364px;height: 44px;" :label-in-value="true"
                    @on-change="bankTypeChange">
              <Option v-for="v,i in bankTypeArr" :value="v.value" :key="i">{{ v.label }}</Option>
            </Select>
          </div>
        </div>
        <div class="bottom"></div>
      </div>
      <div class="item">
        <div class="top">
          <div class="left">开户点：</div>
          <div class="right address">
            <Select v-model="province" :label-in-value="true" @on-change="provinceChange">
              <Option v-for="v,i in provinceArr" :value="v.proId" :key="i">{{ v.proName }}</Option>
            </Select>
            <Select v-model="city" @on-change="cityChange" :label-in-value="true">
              <Option v-for="v,i in cityArr" :value="v.cityId" :key="i" v-if="province">{{ v.cityName }}</Option>
            </Select>
            <Select v-model="district" @on-change="districtChange" :label-in-value="true">
              <Option v-for="v,i in districtArr" :value="v.countyId" :key="i" v-if="city">{{ v.countyName }}</Option>
            </Select>
          </div>
        </div>
        <div class="bottom"></div>
      </div>
      <div class="item">
        <div class="top">
          <div class="left">开户网点：</div>
          <div class="right"><input type="text" v-model="netWortAdd" @input="isCanNext()" placeholder="如：北京市朝阳区中关村支行">
          </div>
        </div>
        <div class="bottom"></div>
      </div>
      <!--<div class="item" >-->
      <!--<div class="top">-->
      <!--<div class="left">资金密码：</div>-->
      <!--<div class="right">-->
      <!--&lt;!&ndash;<input @keyup.enter="isSubmit&&submit()" type="password" maxlength="24" @input="isCanNext()" autocomplete="off" v-model="fundPassword">&ndash;&gt;-->
      <!--<password :callBack="endPassword" :idx="'password1'"></password>-->
      <!--</div>-->
      <!--</div>-->
      <!--<div class="bottom" v-show="fundPassword!==''&&truePassword">您输入的密码格式不正确，密码须为6位数字！</div>-->
      <!--</div>-->
      <!--<div class="item" >-->
      <!--<div class="top">-->
      <!--<div class="left">确认密码：</div>-->
      <!--<div class="right">-->
      <!--&lt;!&ndash;<input type="password" @keyup.enter="isSubmit&&submit()" maxlength="24" autocomplete="off" @input="isCanNext()" v-model="fundPassword1">&ndash;&gt;-->
      <!--<password :callBack="endPassword1" :idx="'password2'"></password>-->
      <!--</div>-->
      <!--</div>-->
      <!--<div class="bottom" v-show="fundPassword1!==''&&fundPassword!==fundPassword1">两次输入的密码不一样！</div>-->
      <!--</div>-->
      <bankPrompt></bankPrompt>

      <div class="nextBtn" :class="{'noClick':!canNext}" @click="canNext&&(Page[0].status=false,Page[1].status=true)">
        下一步
      </div>
    </div>
    <div class="twoPage" v-if="Page[1].status">
      <div class="info">
        <div class="item">取款人姓名 : <span class="name">{{name?name[0]+ name.replace(/./g,'*').substr(0,name.length-1):name}}</span>
        </div>
        <div class="item">银行卡号 : <span class="name">{{bankNumber1}}</span></div>
        <div class="item">开户银行 : <span>{{bankName1}}</span></div>
        <div class="item">卡类别 : <span>{{bankType1}}</span></div>
        <div class="item">开户点 : <span>{{province1+city1+district1}}</span></div>
        <div class="item">开户网点 : <span>{{province1+city1+district1+netWortAdd}}</span></div>
      </div>
      <div class="item">
        <div class="top">
          <div class="left">请输入6位数的资金密码</div>
          <div class="right">
            <!--<input @keyup.enter="isSubmit&&submit()" type="password" maxlength="24" @input="isCanNext()" autocomplete="off" v-model="fundPassword">-->
            <password :callBack="endPassword" :idx="'password1'" ref="password"></password>
          </div>
        </div>
        <div class="bottom" v-show="fundPassword!==''&&truePassword">您输入的密码格式不正确，密码须为6位数字！</div>
      </div>
      <!--<bankPrompt></bankPrompt>-->
      <div class="prompt">
        资金密码为出款时唯一认证密码，请会员务必牢记，并且勿将资金密码透露给其他人，请妥善保管好您的密码，如遗忘请使用密保功能找回或联系
        <a :href="kefu" target="_blank">在线客服</a>处理。
      </div>
      <div class="twoPageBtn">
        <span class="back" @click="Page[0].status=true,Page[1].status=false,initData()">重新输入</span>
        <span class="next" :class="{'noClick':!fundPassword}" @click="fundPassword&&submit()">提交</span>
      </div>
    </div>

    <div class="threePage" v-if="Page[2].status&&false">
      <!--<div class="top">请输入6位数的资金密码</div>-->
      <!--<password :callBack="endPassword" :idx="'password1'"></password>-->

      <div class="top" v-if="!accountStatus.isBindWithdrawPassword">请输入6位数字的资金密码</div>
      <div class="passwordInput" :class="{'testPassword':accountStatus.isBindWithdrawPassword}">
        资金密码：
        <!--<input @keyup.enter="isSubmit&&submit()" type="password" maxlength="24" autocomplete="off" v-model="fundPassword">-->
        <password :callBack="endPassword" :idx="'password1'"></password>

        <span v-if="fundPassword!==''&&truePassword&&!this.accountStatus.isBindWithdrawPassword">您输入的密码格式不正确！</span>
      </div>
      <div class="passwordInput" v-if="!accountStatus.isBindWithdrawPassword">
        确认密码：
        <!--<input type="password" @keyup.enter="isSubmit&&submit()" maxlength="24" autocomplete="off" v-model="fundPassword1">-->
        <password :callBack="endPassword1" :idx="'password2'"></password>
        <span v-if="fundPassword1!==''&&fundPassword!==fundPassword1">两次输入的密码不一样！</span>
      </div>
      <div class="prompt">
        资金密码为出款时唯一认证密码，请会员务必牢记，并且勿将资金密码透露给其他人，请妥善保管好您的密码，如遗忘请使用密保功能找回或联系
        <a :href="kefu" target="_blank">在线客服</a>处理。
      </div>
      <div class="submit" :class="{'noClick':!isSubmit}" @click="isSubmit&&submit()">提交</div>
    </div>

    <Modal v-model="addcard" class="addcardModal" width="500px" :closable="false" class-name="vertical-center-modal"
           title="设置取款人"
           :mask-closable="false">
      <div class="content">
        <div class="input">
          取款人：<input type="text" v-model="Withdrawaler" placeholder="请输入真实姓名"
                     @keyup.enter="Withdrawaler&&!errPrompt&&modalOk()"/>
        </div>
        <div class="err" v-show="errPrompt"><em class="icon_v3">&#xe645;</em>取款人姓名至少为两位汉字</div>
      </div>
      <div class="prompt">温馨提示：取款人经绑定后即无法修改，请正确填写</div>
      <div slot="footer">
        <Button type="text" @click="modalCancel()">取消</Button>
        <Button type="primary" :class="{'noClick':!Withdrawaler||errPrompt}"
                @click="Withdrawaler&&!errPrompt&&modalOk()">确认
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script>

	import {mapState, mapMutations, mapActions} from 'vuex';
	import bankPrompt from "./bankPrompt.vue";  // 引入绑定银行卡提示组件
	import password from "./password.vue";// 引入资金密码组件
	import service from "@/js/service.js";
	import md5 from "js-md5";
	import {updaAccoutStatus} from "@/js/index.js";
	import {verifyRule} from "@/js/const.js";// 获取验证js


	/*
  * 流程说明：
  * 1、是否绑定真实姓名   没绑定就绑定
  * 2、是否设置了资金密码    没绑定就要绑定   绑定了就要验证资金密码
  * 3、然后设置银行卡的数据
   */
	export default {
		components: {bankPrompt, password},
		data() {
			return {
				Page: [
					{status: false},
					{status: false},
					{status: false},
				],
				addcard: false,// 控制弹框的显示与否  --设置取款人
				Withdrawaler: '',// 取款人 --仅仅是弹框里面的
				errPrompt: false,// 错误信息
				// 页面数据
				name: '',// 取款人
				bankNumber1: '',// 银行卡号
				bankNumber2: '',// 确定银行卡号
				bankName: '',// 银行名称
				bankName1: '',// 银行名称--这个用来提交前展示
				bankType: '',// 银行卡类别
				bankType1: '',// 银行卡类别  --这个用来提交前展示
				province: '',// 省
				province1: '',// 省  --这个用来提交前展示
				city: '',// 市 --这个用来绑定数据的
				city1: '',// 市  --这个用来在提交前展示数据
				district: '',// 区 --这个用来绑定数据的
				district1: '',// 区 -这个用来在提交前展示数据
				canNext: false,// 是否可以点击下一步
				fundPassword: '',// 资金密码
				fundPassword1: '',// 资金密码 --校验是否相同
				// 选项

				// 银行卡类型
				bankTypeArr: [
					// {label: '储蓄卡', value: '储蓄卡'},
					{label: '借记卡', value: '1'},
					{label: '信用卡', value: '2'},
				],
				cityArr: [],// 城市
				districtArr: [],// 区
				// 开户点
				provinceArr: [],
				netWortAdd: ''// 开户网点

			}
		},
		computed: {
			...mapState(['root_userCenter', 'bindInfo', 'accountStatus', 'bankInfo', 'appConfigData']),// 个人中心根路由bindInfo.withdrawName
			// 密码校验规则是否正确
			truePassword() {
				return !verifyRule.fundPsw.reg.test(this.fundPassword)
			},
			// 是否可以点击提交
			isSubmit() {
				if (this.accountStatus.isBindWithdrawPassword) {// 绑定了资金密码
					return this.fundPassword ? true : false;
				} else {// 未绑定资金密码
					return !this.truePassword && this.fundPassword === this.fundPassword1
				}
			},
			kefu() {
				return this.appConfigData.kefu
			},
			getBindPasswordStatus(){
				return this.$store.state.accountStatus.isBindWithdrawPassword
			}
		},
		watch: {
			// 限制成中文
			Withdrawaler() {
				let re = /[^\u4e00-\u9fa5]/
				this.errPrompt = re.test(this.Withdrawaler.replace(/·/g,'')) || this.Withdrawaler.replace(/·/g,'').length === 1 || /[0-9]/.test(this.Withdrawaler) ? true : false;
			},
			// 银行卡号只能输入数字
			bankNumber1(cur, bef) {
				!/^([0-9]){0,19}$/.test(cur) && (this.bankNumber1 = bef)
			},
			bankNumber2(cur, bef) {
				!/^([0-9]){0,19}$/.test(cur) && (this.bankNumber2 = bef)
			},
			// 监听账户绑定了哪些信息
			bindInfo() {
				this.init()
			},
			// 监听账户是否绑定了某些信息
			accountStatus() {
				this.init()
			}
		},
		methods: {
			...mapMutations(['setBread', 'setBreadMore', 'setBindInfo', 'setData']),
			// 写入面包屑
			setBreadInfo() {
				// this.setBread([{label: '个人中心',}, {label: '账户总览', url: '/userOverview'}])// 这个不需要了
				this.setBreadMore([{label: '添加银行卡', url: '/addCard'}])
			},
			// 设置取款人姓名  弹框的ok事件
			modalOk() {
				service.post(this, 'account/apply-bind-withdrawName', {withdrawName: this.Withdrawaler}).then(function (result) {
					let res = result.data
					if (res.code === 0) {
						this.addcard = false
						this.name = this.Withdrawaler
						this.setBindInfo({withdrawName: this.Withdrawaler})
						this.isBindPassword()
					} else {
						this.$Modal.al_default({status: 'warning', content: res.message})
					}
				}, function (err) {
					console.log(err)
				})
			},
			// 设置取款人姓名  弹框的cancel事件  跳到前面一个页面（账户总览）
			modalCancel() {
				this.addcard = false
				this.$router.push({path: this.root_userCenter + '/userDetail'})// 跳转到前一个页面
			},
			// 市的下拉框选中时
			cityChange(v) {
				if (!v) return
				this.city1 = v.label;
				service.post(this, 'account/getCountyByCity', {cityId: v.value}).then(function (result) {
					let res = result.data
					if (res.code === 0) {
						this.districtArr = res.data
						this.district = ''
						this.isCanNext()
					} else {
						this.$Modal.al_default({status: 'warning', content: res.message})
					}
				}, function (err) {
					console.log(err)
				})
			},
			districtChange(v) {
				this.district1 = ''
				this.isCanNext()
			},
			bankTypeChange(v) {
				this.bankType1 = v.label
				this.isCanNext()
			},
			bankNameChange(v) {
				this.bankName1 = v.label
				this.isCanNext()
			},
			provinceChange(v) {
				this.cityArr = this.provinceArr.find(e => (e.proName === v.label)).cities
				this.province1 = v.label
				this.district = ''
				this.city = ''
				this.isCanNext()
			},
			// 判断是否可以进行下一步
			isCanNext() {
				this.canNext = /^[1-9]{1}\d{14,18}$/.test(this.bankNumber1) && this.bankNumber1 == this.bankNumber2 && this.bankName && this.bankType && this.province && this.city && this.district && this.netWortAdd
			},
			// 跳转页面
			jump() {
				this.$router.push({path: this.root_userCenter + '/userOverview'})// 跳转到账户总览的页面
			},
			// 获取省市数据
			findprovince_city() {
				service.post(this, 'account/queryProCity', {}).then(function (result) {
					let res = result.data
					if (res.code === 0) {
						this.provinceArr = res.data
					} else {
						this.$Modal.al_default({status: 'warning', content: res.message})
					}
				}, function (err) {
					console.log(err)
				})
			},


			// 密码输入完成的回调函数
			endPassword(v) {
				this.fundPassword = v
			},
			// 提交
			submit() {
				let obj = {
					bankCardId: this.bankNumber1,
					cardType: this.bankType,
					province: this.province1,
					city: this.city1,
					country: this.district1,
					bankId: this.bankName,
					bankBranch: this.netWortAdd,
					withdrawPassword: md5(this.fundPassword),
				}
				if (this.getBindPasswordStatus!=undefined&&this.getBindPasswordStatus===false) {// 没有绑定过资金密码  绑定

					// service.post(this, 'account/apply-bind-withdrawPwd', {withdrawPassword: md5(this.fundPassword)}).then(function (result) {
					// 	let res = result.data
					// 	if (res.code === 0) {
					// 		updaAccoutStatus(this)// 刷新账户的信息
					// 		// 提到下一页 --添加银行卡
					// 		this.Page = [
					// 			{status: true},// 打开第一步
					// 			{status: false},
					// 			{status: false},
					// 		];
					// 	} else {
					// 		this.$Modal.al_default({status: 'warning', content: res.message})
					// 	}
					// }, function (err) {
					// 	console.log(err)
					// })

					// 首次绑定银行卡 需要带上密码
					service.post(this, 'account/apply-bind', obj).then(function (result) {
						this.bindSuccess(result)
					}, function (err) {
						console.log(err)
					})
				} else {// 绑定过资金密码  提交  --写成两个  后期会有很多变化
					service.post(this, 'account/bind-card', obj).then(function (result) {
						this.bindSuccess(result)
					}, function (err) {
						console.log(err)
					})
				}
			},
			// 绑定银行卡成功的接口
			bindSuccess(result) {
				let res = result.data
				if (res.code === 0) {
					this.$Modal.al_default({status: 'success', content: '添加银行卡成功！', onOk: this.bindSuccessCallback})
					updaAccoutStatus(this)// 更新用户账户状态
				} else {
					this.$Modal.al_default({status: 'warning', content: res.message, onOk: this.passwordError})
				}
			},
			// 密码错误时，跳回第一步，并且把密码去掉
			passwordError() {
				this.fundPassword = ''// 资金密码
				this.$refs.password.pwdList = []
			},
			// 绑定成功的回调
			bindSuccessCallback() {
				this.$router.push({path: this.root_userCenter + '/userOverview'})
			},
			// 跳转到资金密码修改页面
			jumpModifyFundsPass() {
				this.setData({key: "isShowFunds", value: true});
				this.$router.push({path: '/userCenters/fundsPass'})
			},
			// 判断是否绑定过资金密码
			isBindPassword() {
				// 没有绑定资金密码就跳到绑定资金密码去
				if (this.getBindPasswordStatus!=undefined&&this.getBindPasswordStatus===false) {
					this.$Modal.al_default({status: 'warning', content: '您还没有设置资金密码，请先设置资金密码！', onOk: this.goPassword})
				}
			},
			// 跳转到设置资金密码的页面去
			goPassword() {
				this.setData({key: "isSetFunds", value: true});
				this.$router.push({path: this.root_userCenter + '/fundsPass'})
			},

			// 重新输入
			initData() {
				this.bankNumber1 = ''// 银行卡号
				this.bankNumber2 = ''// 确定银行卡号
				this.bankName = ''// 银行名称
				this.bankType = ''// 银行卡类别
				this.province = ''// 省
				this.city = ''// 市
				this.district = ''// 区
				this.canNext = false// 是否可以点击下一步
				this.netWortAdd = ''// 开户网点清空
				this.fundPassword = ''// 资金密码
				this.fundPassword1 = ''// 确认密码
			},
			init() {
				this.initData()
				this.setBreadInfo()
				if(JSON.stringify(this.bindInfo) === '{}') return
				if (this.bindInfo.withdrawName !== undefined) {
					// 判断是否绑定取款人姓名   没有就弹出框 让其绑定
					this.addcard = this.bindInfo.withdrawName ? false : true;
					!this.addcard && this.isBindPassword()
					this.name = this.bindInfo.withdrawName
				} else {
					this.isBindPassword()
				}
				this.Page = [
					{status: true},
					{status: false},
					{status: false},// 打开第三步  绑定或验证资金密码
				];

				if (!this.accountStatus.isUpdateWithdrawPassword && this.accountStatus.isBindWithdrawPassword) {
					this.$nextTick(function () {
						this.$Modal.modifyFundsPass_Modal({
							status: 'warning',
							content: '为了保障您的资金安全，现引用支付宝资金安全技术，需要您重新设定新的资金密码即可生效。',
							onOk: this.jumpModifyFundsPass
						})
					}.bind(this))
				}
			}
		},
		created() {
			this.init()
			this.findprovince_city()// 后台查询省市的数据
		},
		mounted() {
		},
	}
</script>

<style lang='less'>
  @import "../less/global.less";

  .addCard {
    .bor(@methodBox_bor);
    margin-bottom: 20px;
    .addcard_content {
      //.bor(@methodBox_bor);
      padding-top: 20px;
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
      .nextBtn {
        width: 177px;
        height: 48px;
        line-height: 48px;
        border-radius: 24px;
        font-size: 16px;
        color: #fff;
        background: @themeColor;
        cursor: pointer;
        margin: 0 auto;
        margin-bottom: 40px;
      }
      .noClick {
        color: #999;
        background: #ddd;
        cursor: not-allowed;
      }
    }
    .twoPage {
      .info {
        width: 460px;
        height: 226px;
        margin: 0 auto;
        .bor(#e3e3e3);
        background: #f6f6f6;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        padding: 0 20px;
        font-size: 14px;
        margin-top: 100px;
        margin-bottom: 30px;
        .item {
          color: #666;
          display: flex;
          justify-content: left;
          span {
            margin-left: 5px;
            color: #333;
            &.name {
              color: @themeColor;
            }
          }

        }
      }
      .twoPageBtn {
        margin: 40px auto;
        display: flex;
        justify-content: center;
        > span {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 177px;
          height: 48px;
          border-radius: 24px;
          font-size: 16px;
          cursor: pointer;
        }
        .back {
          background: #e1e1e1;
          color: #333;
          margin-right: 20px;
        }
        .next {
          background: @themeColor;
          color: #fff;
          &.noClick {
            color: #999;
            background: #ddd;
            cursor: not-allowed;
          }
        }
      }
      > .item {
        .left {
          margin-bottom: 15px;

        }
        .right {
          width: 350px;
          margin: 0 auto;
        }
      }
      .prompt {
        width: 442px;
        height: 35px;
        margin: 0 auto;
        margin-top: 50px;
        color: @themeColor;
        text-align: left;
        a {
          color: @themeColor_Sec;
        }
      }
    }
    .threePage {
      .top {
        margin: 0 auto;
        margin-top: 100px;
        margin-bottom: 30px;
        font-size: 14px;
        color: #333;
      }
      .prompt {
        width: 442px;
        height: 35px;
        margin: 0 auto;
        margin-top: 50px;
        color: @themeColor;
        text-align: left;
        a {
          color: @themeColor_Sec;
        }
      }
      .passwordInput {
        display: flex;
        justify-content: left;
        align-items: center;
        width: 350px;
        height: 40px;
        margin: 0 auto;
        margin-bottom: 10px;
        position: relative;
        input {
          width: 280px;
          height: 100%;
          border: 1px solid #e3e3e3;
          border-radius: 4px;
          padding-left: 10px;
          outline: none;
        }
        span {
          position: absolute;
          right: -160px;
          display: inline-block;
          width: 170px;
          text-align: left;
          padding-left: 10px;
          color: @themeColor;
        }
        &.testPassword {
          margin-top: 200px;
        }
      }
      .submit {
        margin: 0 auto;
        width: 177px;
        height: 48px;
        background: @themeColor;
        color: #fff;
        border-radius: 24px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 16px;
        margin-top: 50px;
        cursor: pointer;
        &.noClick {
          color: #999;
          background: #ddd;
          cursor: not-allowed;
        }
      }
    }
  }

</style>