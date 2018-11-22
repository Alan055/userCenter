import Vue from 'vue';
import Router from 'vue-router';

import userCont from '@/page/userCont.vue'

Vue.use(Router);
export default new Router({
	mode: 'history',
	routes: [
		{path: '/', name: 'home', component: userCont},
		{
			path: '/userCenters',
			name: 'userCont',
			component: userCont,
			children: [
				{
					path: '/', name: 'userCenter', component: () => import('@/page/userCenter.vue')
				},
				{
					path: '/userCenters/userOverview',
					name: 'userCenter',
					component: () => import('@/page/userCenter.vue')
				},
				{
					path: '/userCenters/userDetail',
					name: 'userDetail',
					component: () => import('@/page/userDetail.vue')
				},
				{
					path: '/userCenters/userForm',
					name: 'userForm',
					component: () => import('@/page/userForm.vue')
				},
				{
					path: '/userCenters/userEmail',
					name: 'userEmail',
					component: () => import('@/page/userEmail.vue') // 修改邮箱
				},
				{
					path: '/userCenters/userPhone',
					name: 'userPhone',
					component: () => import('@/page/userPhone.vue') // 手机号
				},
				{
					path: '/userCenters/fundsPass',
					name: 'fundsPass',
					component: () => import('@/page/fundsPass.vue') // 资金密码
				},
				{
					path: '/userCenters/userPassword',
					name: 'userPassword',
					component: () => import('@/page/userPassword.vue') // 资金密码
				},
				{
					path: '/userCenters/resetUserName',
					name: 'resetUserName',
					component: () => import('@/page/resetUserName.vue') // 修改手机注册时的用户名
				},
				{
					path: '/userCenters/userMessages',
					name: 'userMessages',
					component: () => import('@/page/userMessage.vue')
				},
				{
					path: '/userCenters/task', name: 'task', component: () => import('@/page/taskHall.vue')
				},
				{
					path: '/userCenters/recharge',
					name: 'recharge',
					component: () => import('@/page/recharge.vue')// 财务中心的充值方式
				},
				{
					path: '/userCenters/rechargeInfo/:index',
					name: 'rechargeInfo',
					component: () => import('@/page/rechargeInfo.vue')// 财务中心的充值 -具体类型
				},
				{
					path: '/userCenters/withdraw',
					name: 'withdraw',
					component: () => import('@/page/withdraw.vue')// 财务中心的提现
				},
				{
					path: '/userCenters/transfer',
					name: 'transfer',
					component: () => import('@/page/transfer.vue')// 财务中心的转账
				},
				{
					path: '/userCenters/fundsOrder',
					name: 'fundsOrder',
					component: () => import('@/page/fundsOrder.vue')// 报表中心的资金记录
				},
				{
					path: '/userCenters/betOrder',
					name: 'betOrder',
					component: () => import('@/page/betOrder.vue')// 报表中心的投注记录
				},
				{
					path: '/userCenters/chaseOrder',
					name: 'chaseOrder',
					component: () => import('@/page/chaseOrder.vue')// 报表中心的只好记录
				},
				{
					path: '/userCenters/addCard', name: 'addCard', component: () => import('@/page/addCard.vue')// 财务中心的添加银行卡
				},
				// {
				// 	path: '/userCenters/teamView',
				// 	name: 'teamView',
				// 	component: () => import('@/page/proxy/teamView.vue')// 团队总揽
				// },
			]
		},
	]
});