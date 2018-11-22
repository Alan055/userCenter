import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
import service from "@/js/service.js";

export default new Vuex.Store({
	state: {
		isLogin: localStorage.getItem('_status') || 'false',
		isIndex: localStorage.getItem('_isIndex') || 'true',
		contenStatus: {},
		allLotteryList: [],
		allHotList: {
			'时时彩': ['#', '#'], '菲律宾': ['#', '#'], '11选5': ['#', '#'], '低频彩': ['#', '#'], '其他': ['#', '#']
		},
		baseInfo: {}, // 账户余额等信息
		accountType: 0,
		imgPath: '/static/images/img/bg1.jpg',
		stationNoticeLen: 0,
		noticeLen: 0,
		personalDetail: null,
		cartListNum: 0,
		cartList: [],
		bindInfo: {},  // 用户绑定的信息  如生日 性别、、、

		platformBalance: {},  // 第三方游戏余额
		// 休闲游戏链接
		aglink: '',   // ag真人
		imlink: '',   // im
		kylink: '',   // ky

		gradeMsg: {
			num: 0,
			title: ''
		},
		bankList: [],  // 可绑定银行卡列表
		mask: false, // mask遮罩层
		isOfficialLottery: false, // 是否是官方玩法
		isClassicLottery: false, // 是否是经典玩法
		showThirdGame: false,  // 是否是休闲游戏
		showIndex: false, // 是否是首页
		isActivity: false,  // 是否是活动页
		isDownload: false,  // 是否是下载页
		accountStatus: {},  // 用户绑定的信息
		isPswResetPage: false,
		singleGoods: {},
		appDetection: {},  // 是否显示app下载弹窗
		isShowGuide: false, // 是否显示新手指引
		isShowNotice: false,  // 是否显示公告弹窗
		gameArr: [],
		isTryPlay: false, // 是否是试玩页

		isBetting: false,  // 是否是投注页
		isShowBetting: false, // 是否显示投注指引
		// 投注页面相关-----start

		issue: '', //即将开奖的期数
		historyLotteryInfoFirst: null, //最近一期开奖的期数和开奖号码等数据
		biggerType: '', // 最大的彩种类型  sscs jd flb other elvenY dpc
		currentIssue: '', // 当前正在开奖的期数
		currentLottery: null, // 当前选中的彩种大类  包含中文名字  英文名字  id  三个属性  cqssc 重庆时时彩 11
		openTime: '00-00-00', // 开奖时间的倒计时
		openTimeS: 0, // 开奖时间的倒计时
		currentPlayInfo: null, // 当前玩法的信息，确定投注的时候  可以使用 shortname compress
		lotteryConfig: null,
		followNum: false, // 是否追号
		note: 0, // 投注的注数
		maxBouns: 0, // 点击投注时弹框的最高限额值
		chooseNumberData: [], // 选号数据
		number_tableData: [], //添加的号码表格数据
		shortName: '', // 当前玩法的code，即缩写名字，在计算实际选号数据时 和chooseNumberData一起作为参数传入
		multiple: 1, // 选注栏里面的倍数
		mode: '元', // 元  角  分  厘
		total: 0, // 选注栏的总金额
		bonus: '', // 选注栏  --滑块的奖金
		percent: '0.0', // 选注栏  --滑块的返点
		lottery_method: null, // 如  当前玩法的说有配置数据  在选择号码的时候有很多用处  比如中文玩法名称  最高奖金
		initStatus: true, // 这个状态用来初始化选号区的数据，当我们点击投注或者预投注的时候   改变这个状态，在选号区监听，然后初始化
		initStatus_tableRecord: true, // 这个状态用来刷新订单记录组件的表格数据  监听其改变时的状态来刷新表格
		initStatus_recentGame: true, //  这个状态用来刷新最近游戏（我的喜爱） 当改变时，会初始化最近游戏 从而达到刷新倒计时的功能
		initStatus_Rank: true, // 控制出码联动的初始化状态  改变时刷新
		initStatus_history: true, // 控制历史数据的初始化
		stopOpenTime: null, //停止开奖时间

		writeNumber_Menu: '', // 做号投注菜单名 --主页面的菜单应和做号投注里面的菜单保持一致
		writeNumber_Data: {label: ''}, // 做号投注的数据 --用于做号投注生成号码之后将生成的号码同步到主页面上
		// 公共模态框
		defaultModal: false, // 基础弹框
		openLotteryModal: false, // 开奖弹框  单独出来的弹框
		ssc_openLotteryAnimation: false, // 时时彩专属开奖号码
		modal_bettingNow: false, // 投注模态框
		thridTransfer_Modal: false, // 第三方游戏转账
		modifyFundsPass_Modal:false,  // 提示老用户去修改资金密码的弹窗
		isNewTask:true,  //  是否有新手任务
		newPersonModal: false,  // 新手任务弹框
		newPersonBonus: false,  // 新手任务领取奖金弹框
		taskActivity: {},  // 新手任务奖金
		sortNo: [],  // 新手任务顺序
		newTaskMoney: [], //  新手任务完成后领取到的奖金
		H5DefaultModal: false, // 基础H5弹框
		modal_orderDetail: false, // 订单详情弹框是否打开
		modal_chaseDetail: false, // 追号详情弹框是否打开
		jd_betting: false, // 经典投注弹框
		// 中奖推送
		winningModal: false, // 中奖推送
		winningMessageData: [], // websocket传来的信息
		errTipsMadel:false,  // 修改资金密码页面提示弹出框

		// ------投注页面相关分割线  end-------
		tempoBetting: 1,
		tempo: 1, // 当前新手指引第几步
		isShowInstall: false, // 是否显示安装教程
		isBindPhone: false, //  是否显示手机号绑定界面
		replacePhone: false, //  是否显示手机号更换界面
		isbindEmail: false, //  是否显示邮箱绑定界面
		replaceEmail: false, //  是否显示邮箱界面
		isShowFunds: false, // 是否显示资金密码修改界面
		isSetFunds: false,  // 是否显示资金密码设置页面
		ismodifyEmail: false, // 是否修改绑定邮箱
		isShowBind: true, // 是否显示绑定界面

		titleNavOne: '', // 面包屑导航1
		titleNavTwo: '', // 面包屑导航2
		titleNavThree: '', // 面包屑导航3
		root_userCenter: '/userCenters',// 个人中心根路由
		breadbefore: [],// 个人中心面包屑内容 --前面两个
		breadafter: [],// 个人中心面包屑内容  --后面扩展

		nowActive: 0,  // 导航默认选择
		isUserCenter: false,   // 是否是个人中心
		isTaskCenter: false,   // 是否是任务中心
		bankInfo: null,// 银行列表数据--下拉数据  最大值等信息

		// 充值模块
		rechargeData: null,// 充值的分类数据 包括一级二级菜单
		rechargeGuide: null,// 充值引导
		luzhu: {},

		appConfigData: {}   // 下载二维码，客服链接，测速域名

	},
	mutations: {
		// 投注相关
		setData(state, data) {
			state[data.key] = data.value; // 写入投注的相关数据
		},
		// 表格添加一条数据
		addItem(state, data) {
			state.number_tableData.push(data)
		},
		// 表格中删除事件
		deleteItem(state, data) {
			state.number_tableData.splice(data, 1)
		},
		setLuzhu(state, data) {
			state.luzhu = data
		},
		// 初始化所以公告弹框的状态
		initModal(state, data) {
			state.defaultModal = false;
			state.openLotteryModal = false;
			state.ssc_openLotteryAnimation = false;
			state.modal_bettingNow = false;
			state.H5DefaultModal = false;
			state.newPersonModal = false;
			state.modal_orderDetail = false;
			state.modal_chaseDetail = false;
			state.newPersonBonus = false;
			state.winningModal = false;
		},
		// 中奖推送信息
		setWinningMessageData(state, data) {
			state.winningMessageData.push(data)
		},
		setWinningMessageAgain(state, data) {
			state.winningMessageData = data
		},
		// ---------
		// 写入面包屑 data的before是前面两个面包屑
		setBread(state, data) {
			state.breadbefore = [].concat(data)
		},
		// 扩展面包屑  after是后面的面包屑
		setBreadMore(state, data) {
			state.breadafter = [].concat(data)
		},
		// 从缓存中获取充值引导的数据
		getRechargeGuide(state, data) {
			let obj = localStorage.getItem(`tc_${state.baseInfo.nickName}_rechargeGuide`)
			obj = obj ? JSON.parse(obj) : {}
			state.rechargeGuide = Object.assign({}, obj);
		},
		// 将充值引导写入缓存中
		setRechargeGuide(state, data) {
			Object.assign(state.rechargeGuide, data)// 这样写是watch是监听不到的
			state.rechargeGuide = Object.assign({}, state.rechargeGuide)// 必须要加上这句话
			localStorage.setItem(`tc_${state.baseInfo.nickName}_rechargeGuide`, JSON.stringify(state.rechargeGuide))
		},
		setBindInfo(state, bindInfo) {
			state.bindInfo = Object.assign({}, bindInfo);
		},
		setTaskActivity(state, taskActivity) {
			state.taskActivity = taskActivity;  // 新手任务奖金
		},
		setSortNo(state, sortNo) {
			state.sortNo = sortNo   // 新手任务顺序
		},
		setNewTask(state, isNewTask) {
			state.isNewTask = isNewTask   // 是否有新手任务
		},
		setPlatformBalance(state, platformBalance) {
			Object.assign(state.platformBalance, platformBalance)
			state.platformBalance = Object.assign({}, state.platformBalance)// 第三方游戏余额
		},
		setBindPhone(state, isBindPhone) {
			state.isBindPhone = isBindPhone
		},
		setTryPlay(state, isTryPlay) {
			state.isTryPlay = isTryPlay
		},
		loginStatus(state, status) {
			localStorage.setItem('_status', status);
			state.isLogin = status;
		},
		setTempo(state, tempo) {
			state.tempo = tempo;
		},
		setGameArr(state, gameArr) {
			state.gameArr = gameArr;
		},
		setNotice(state, isShowNotice) {
			state.isShowNotice = isShowNotice;
		},
		isIndexs(state, status) {
			localStorage.setItem('_isIndex', status);
			state.isIndex = status;
		},
		userContenStatus(state, status) {
			state.contenStatus = status;
		},
		setAllLotteryList(state, list) {
			state.allLotteryList = list;
		},
		setAllHotList(state, list) {
			state.allHotList = list;
		},
		setGuide(state, isShowGuide) {
			state.isShowGuide = isShowGuide;
		},
		setInstall(state, isShowInstall) {
			state.isShowInstall = isShowInstall;
		},
		setAppDetection(state, appDetection) {
			state.appDetection = appDetection
		},
		setBaseInfo(state, obj) {
			state.baseInfo = Object.assign({}, state.baseInfo, obj);
		},
		setAppImg(state, imgPath) {
			state.imgPath = '/static/images/img/' + imgPath;
		},
		setAccountType(state, type) {
			state.accountType = type;
		},
		setPersonalDetail(state, event) {
			state.personalDetail = event;
		},
		initPersonalDetail(state, event) {
			state.personalDetail = null;
		},
		setStationNotice(state, length) {
			state.stationNoticeLen = length;
		},
		setNoticeLen(state, length) {
			state.noticeLen = length;
		},
		setUserGrade(state, gradeMsg) {
			state.gradeMsg = Object.assign({}, gradeMsg);
		},
		setAccountStatus(state, accountStatus) {
			let obj = Object.assign(state.accountStatus, accountStatus);
			state.accountStatus = Object.assign({}, obj);
		},
		setPswResetPage(state, isPswResetPage) {
			state.isPswResetPage = isPswResetPage;
		},
		setSingleGoods(state, goods) {
			state.singleGoods = Object.assign({}, goods);
		},
		setCartListNum(state, data) {
			state.cartListNum = data.num;
			state.cartList = [].concat(data.list);
		},

	},
	actions: {
		setCartListNum({commit, state}, context) {
			context.$http.get('/vip/store/queryGoods').then(function (rusult) {
				let res = rusult.body
				if (res.message.includes('成功')) {
					let index = 0;
					for (let val of res.data) {
						val.checked = false;
						val.changeNum = 0;
					}
					commit('setCartListNum', {num: res.data.length, list: res.data})
				} else {
					oPrompt({idx: "boxwarps", message: res.body.message})
				}
			}, function (err) {
				console.log(err)
			})
		},
		//立即投注和确认投注的ajax事件
		ajaxBetting({commit, state}, context) {
			let url = context.url;
			let arr = context.arr;
			!url && (url = 'game-lottery/add-order') //没有url的时候   就设置成立即投注的url   有的话就是追号的url
			let that = context.that;
			//传过去的数据必须是数组的json格式
			service.post(that, url, {'text': JSON.stringify(arr)}).then(function (result) {
				let res = result.data;
				if (res.code === 0) {
					// 提示投注成功
					that.$Modal.al_default({status: 'success', content: '您的订单投注成功！'})
					// 发送成功之后，会得到用户的剩余金额  vuex修改一下
					state.baseInfo.lotteryBalance = res.data
					//然后刷新一下订单记录表格的数据
					state.initStatus_tableRecord = !state.initStatus_tableRecord
					//选号提交（投注  追号  添加号码等）之后，需要刷新选号区的数据
					/*
					 * 添加完数据之后，需要将选号区的数据清空
					 * 这个用vuex来做，给个状态，在选号区监听，当其状态改变的时候  就清空数据
					 */
					state.initStatus = !state.initStatus
					//清空已添加选号的表格
					state.number_tableData = [];
				} else {
					that.$Modal.al_default({status: 'warning', content: res.message})
				}
			}, function (err) {
				console.log(err)
			})


		},
		// 获取充值的所有渠道数据
		findRechargeData({commit, state}, context) {
			let that = context;// 传过来的就是this 用于ajax
			/*
		*  这里的逻辑  有两个接口  request-all-category这个接口是充值方式的接口，每个充值里面的小分类是从request-all-method里面获取
		*  对接方式是request-all-category 的id 对应request-all-method的payChannelCategoryId 相同就是所属的一类
		 */
			let p = [
				service.post(that, 'payment/request-all-category', {}),
				service.post(that, 'payment/request-all-method', {}),
			]
			Promise.all(p).then(function (resulte) {
				let res0 = resulte[0].data
				let res1 = resulte[1].data
				// 第一层
				if (res0.code === 0) {
					let arr = res0.data
					// 每个元素增加一个数组  用来存放第二级的充值小分类
					for (let val of arr) {
						val.arr = []
					}
					// 第二层  分类归属
					if (res1.code === 0) {
						for (let key in res1.data) {
							// 必须是数组
							if (Array.isArray(res1.data[key])) {
								for (let v of res1.data[key]) {
									let obj = arr.find(e => (e.id == v.payChannelCategoryId))
									if (obj) {
										key === 'qrCodeList' ? v.name = v.nickName :
											key === 'transferList' ? v.name = v.bankName : '';
										v.label = key
										obj.arr.push(v)
									}
								}
							}
						}
						// 排序
						for (let val of arr) {
							val.arr.sort(function (a, b) {
								return b.sort - a.sort
							})
						}
						state.rechargeData = arr
					} else {
						that.$Modal.al_default({status: 'warning', content: res1.message})
					}
				} else {
					that.$Modal.al_default({status: 'warning', content: res0.message})
				}
			}).catch(function (err) {
				console.log(err)
			})


		},
		// 获取银行列表信息
		findBankList({commit, state}, that) {
			service.post(that, 'account/prepare-bind-card', {}).then(function (result) {
				let res = result.data
				if (res.code === 0) {
					state.bankInfo = res.data
				} else {
					that.$Modal.al_default({status: 'warning', content: res.message})
				}
			}, function (err) {
				console.log(err)
			})
		},
		// 获取当前彩种最高奖金
		findMaxBouns({commit, state}, that) {
			service.post(that, 'game-lottery/search-issue-maxBonus', {id: state.currentLottery.id}).then(function (result) {
				let res = result.data
				if (res.code === 0) {
					state.maxBouns = res.data
				} else {
					that.$Modal.al_default({status: 'warning', content: res.message})
				}
			}, function (err) {
				console.log(err)
			})
		}
	},
	getters: {
		getWinningMessageData: state => state.winningMessageData
	}
});