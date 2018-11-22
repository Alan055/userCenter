import Vue from 'vue';
const copy = require('clipboard-copy')// npm install clipboard-copy 复制插件
let config = appConfig()


export default {
	install(Vue, options) {
		Vue.prototype.domain = config.domain
		// 官方玩法奖金  每个平台的奖金模式是不同的  彩天堂是1960 游彩是1970
		Vue.prototype.bonusModal = 1980;
		//映射表，角中文转换成发送给后台所需的字段  0123代表是0.1的多少次方  取实际钱的时候  就可以用钱*0.1的x次方
		Vue.prototype.moneyTranslation = {
			'元': {text: 'yuan', num: 0, rate: 1},
			'角': {text: 'jiao', num: 1, rate: 0.1},
			'分': {text: 'fen', num: 2, rate: 0.01},
			'厘': {text: 'li', num: 3, rate: 0.001}
		};
		// 官方和经典玩法切换的字典
		Vue.prototype.dictionary = [
			//官方
			{
				'11': '80',
				'22': '102',
				'23': '104',
				'24': '100',
				'26': '103',
				'28': '105',
				'31': '90',
				'43': '110',
				'151': '82',
				'191': '88',
				'200': '85',
				'201': '86',
				'202': '87',
				'205': '71',
				'206': '72',
				'601': '70',
			},
			//经典
			{
				'70': '601',
				'71': '205',
				'72': '206',
				'80': '11',
				'82': '151',
				'85': '200',
				'86': '201',
				'87': '202',
				'88': '191',
				'90': '31',
				'100': '24',
				'102': '22',
				'103': '26',
				'104': '23',
				'105': '28',
				'110': '43',
			},
		];
		//
		Vue.prototype.dealLotteryDictionary = function(res){
			let GF = this.dictionary[0]// 官方切换经典玩法的字典
			for(let key in GF){
				if(!(res.find(e=>(e.id==key))&&res.find(e=>(e.id==GF[key])))){// 如果key和value不是都在彩种栏里面的，就要从字典中删除
					delete this.dictionary[1][GF[key]] // 删除经典的字段
					delete GF[key]// 删除官方的字典
				}
			}
		},
		// 银行卡类型
		Vue.prototype.bankArr = [
			{value: 'CEB', label: '光大银行',},
			{value: 'PSBC', label: '中国邮政储蓄银行',},
			{value: 'ABC', label: '中国农业银行',},
			{value: 'CCB', label: '中国建设银行',},
			{value: 'GDB', label: '广东发展银行',},
			{value: 'BOCM', label: '交通银行',},
			{value: 'NBBANK', label: '宁波银行',},
			{value: 'HXB', label: '华夏银行',},
			{value: 'HZCB', label: '杭州银行',},
			{value: 'NJCB', label: '南京银行',},
			{value: 'HKBEA', label: '东亚银行',},
			{value: 'BCCB', label: '北京银行',},
			{value: 'CMBC', label: '民生银行',},
			{value: 'NBCB', label: '宁波银行',},
			{value: 'SDB', label: '平安银行',},
			{value: 'CGB', label: '广发银行',},
			{value: 'BOB', label: '北京银行',},
			{value: 'BOC', label: '中国银行',},
			{value: 'CMB', label: '招商银行',},
			{value: 'ICBC', label: '中国工商银行',},
			{value: 'CITIC', label: '中信银行',},
			{value: 'CIB', label: '兴业银行',},
			{value: 'SPDB', label: '上海浦发银行'},
		];
		// 复制功能
		Vue.prototype.copy = function (v) {
			copy(v)
			this.$Modal.al_default({status: 'success', content: '您已复制成功'})
		}
		// 时间转换器
		Vue.prototype.timeTranslate2 = function (v) {
			let m = Math.floor(v / 60)
			let s = v - (m * 60)
			return String(m).padStart(2,'0')+':'+String(s).padStart(2,'0')
		}
		// 客服链接
		Vue.prototype.kefu = '';
		// 修改手机号码 178******11
		Vue.prototype.transationPhone = function (v) {
			return v.replace(/^86/,'').replace(/(\d{3})\d{6}(\d{2})/, "$1******$2")
		}

	}
}