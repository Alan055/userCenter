var LtClsLibs = LtClsLibs || {};
var _pankouInit = null;

function appConfig() {
	let cof = {
		// 域名
		// domain: 'http://dtnjyy.com',
		domain: 'http://119.28.191.73',
		// domain: 'http://test.tc508.com',
		// 测速地址
		// speedSrc: 'http://dtnjyy.com,http://dtnjyy.com'.split(','),
		speedSrc: 'http://119.28.191.73'.split(','),
		// 测速参数
		speedConfig: [[95, 85, 75, 65, 55, 45, 35, 35, 35], ['线路一', '线路二', '线路三', '线路四', '线路五', '线路六', '线路七']],
		// 下载页面android 二维码
		downloadAndroid: '/static/images/img/ercodeAndroid.png',
		// 下载页面ios 二维码
		downloadIos: '/static/images/img/downloadIOS.png',
		// 项目title
		title: '彩天堂',
		fullname: '彩天堂',
		isqiandao: true,
		hotlt: [11, 43, 911, 200, 201, 202],
		newlt: [50, 61],
		// DIST目录
		distpath: '/static/v3/js/game/',
		// 设置色站连接过期时间 /ms  毫秒
		expiredReferrer: 8640000,
		// 第三方游戏集合
		thirdPartyGame: {
			// 是否开启棋牌
			cardObj: {platformId: 7, isOpen: true, val: 'ky_01'},
			// 是否开启真人娱乐
			realObj: {platformId: 5, isOpen: true, val: 'agin_01'},
			// 是否开启体育
			sportObj: {platformId: 6, isOpen: true, val: 'im_01'},
		},
		ltgroups: {
			// 'ssc': [11, 46, 151, 911, 161, 119, 711, 6, 811, 191, 200, 601, 201, 51, 202, 203, 42, 205, 206, 711],
			// 'pk10': [204, 43, 47],
			// '11y': [21, 22, 24, 23, 28, 26],
			// '3d': [41],
			// 'k3': [31, 32, 33, 35, 36],
			// 'kl8': [],
			// 'lhc': [801],
			'ssc': [11, 161, 151, 6, 119, 161, 51, 711, 811, 46, 203, 50, 61, 191, 601, 911, 205, 206], // 时时彩id
			// 'tsssc': [911, 205, 206, 191, 601],
			'flb': [200, 201, 202], // 菲律宾彩id
			// 'qth': [711, 811, 601, 51, 203],
			'xuan': [21, 22, 23, 24, 25, 26, 28, 53, 55],
			// 'kuai': [32, 33, 35, 36],
			'other': [204, 43, 47], // 其他彩id  pk10 + 幸运飞艇
			'pk10': [204, 43, 47],
			'11y': [21, 22, 24, 25, 23, 28, 26, 53, 55], // 11选五彩
			'3d': [41], // 3d福彩
			'k3': [31, 32, 33, 34, 35, 36, 54, 56],
			'dpc': [41, 42],
			// 'kl8': [711],
			'jd': [70, 71, 72, 80, 82, 85, 86, 87, 88, 90, 100, 102, 103, 104, 105, 110, 250], // 经典玩法对应的id
},
		getClsFile: function () {
			return ltClsFile;
		},
		pankouInit: function (obj) {
			if (obj) _pankouInit = obj;
			return _pankouInit;
		},
		officalsite: {
			'61': 'http://www.77qqtj.com/'
		},
		// 六合彩
		isLhcShow: true,
		loginType: 0,
		activityMap: {
			'798c3e945d3a17db5223e6d3ff614615c53eef15336ecfcc': 3,
		},
		referrerMap: ['e8b990acfe34c8f9', 'da8c751bb8627018', 'd35fe83aa85669d7175a3e246dfd4b42'],

		// 客服链接
		customerService: 'https://v88.live800.com/live800/chatClient/chatbox.jsp?companyID=925834&configID=8015&jid=8547731414&s=1',
		register: {
      // 开户区+间 保留小数位数
      toFixed: 1,
      // 平级开户 [若平级开户设置为 0,若不晕平级开户可直接设置需要减少的返点值,如: 0.1]
      // isequalSub: -10,
	    isequalSub: -5,
      /*
        @ 代理是否开启玩家开户 [Boolean | Function]
        @ 默认所有级别代理开放玩家开户
        @ 特殊要求可以自定义 改为函数 如下示例
          @ [object] obj [参数 ]
            玩家按钮DOM对象
          @ [object] dataPoint [参数]
            开户区间自定义设置的必须参数包含 [代理/玩家开户最低最高返点 提示文字dom对象;]
          @ [number] userLevel [上下文属性]
            动态追加的当前用户等级
          @ [object] this 指向函数定义上下文对象
          @ 函数内可使用jq操作
          function(obj, dataPoint){
            // 是否开启玩家号 自定义设置
            if(this.userLevel <= '0') {
              obj.hide();
            }
            // 代理/玩家  返点区间设置
            if(dataPoint.agemin < 12.8) {
              dataPoint.ageipt.val('12.2');
            }
            // 代理/玩家  返点区间设置 [链接开户]
            if(dataPoint.playmin < 12.8) {
              dataPoint.playipt.val('11.2');
            }
          }
      */
	    isAgentPlayer: function (obj, dataPoint) {
	    		console.log(obj, '>>>>>obj', dataPoint, '>>>>>>dataPoint')
	//          	console.log(dataPoint, 434343433)
//					console.log(obj,'>>>>>obj',dataPoint, '>>>>>>dataPoint')
	        if (this.userLevel < '3') {
	        	// userLevel 1 2 开出 固定13.5
	            obj.hide();
	            dataPoint.ageipt.val(dataPoint.agemax);
	            dataPoint.ageipt.attr('readonly', true);
	            dataPoint.ageipt.css({'background-color': '#ccc'});
	             dataPoint.ageobj.html('开户区间：' + dataPoint.agemax);
	            dataPoint.playipt.val(dataPoint.agemax);
	            dataPoint.playipt.attr('readonly', true);
	            dataPoint.playipt.css({'background-color': '#ccc'});
	             dataPoint.playobj.html('开户区间：' + dataPoint.agemax);
//	             $('.tabsLys .tabsLink').hide();
	        }else{
	            obj.show();
	            if(this.userLevel == '3') {
		            // userLevel == 3 不能开 会员
		            obj.hide();
	            }
	        }

	    },
      // 允许代理开玩家账号的代理级别 [只有在 isAgentPlayer 为 false下生效]
      PlayerLevel: 4,
    },
    /*
      @ 会员管理设置
      @ 数组第一项为空则不现实当前功能[第一项内容文字可更改]
        数组第二项配置:当前账号级别 < 数组第二项 则显示当前功能; 如不设置则没有限制
    */
    numberPage: {
      salary: ['工资管理'],
      dividend: ['分红'],
      dandanFh: ['单单亏损分红'],
      dandanZjjj: ['中奖加奖'],
      dandanRgz: ['单单日工资']
    },
    // 投注设置
    lottery: {
      // 输入最大倍数
      maxNum: 99999,
    },
	};
	return cof;
}
