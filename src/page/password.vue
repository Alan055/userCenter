<!--<template>-->
<!--<div class="password">-->
<!--<div class="passwordBox">-->
<!--&lt;!&ndash;<span></span>&ndash;&gt;-->
<!--&lt;!&ndash;<input v-for="v,i in arr" @keydown="change(i,$event)" type="password" v-model="v.num" :key="i"/>&ndash;&gt;-->
<!--<span v-for="(v,i) in arr" :key="i"></span>-->
<!--<input type="password" v-model="num" />-->
<!--</div>-->
<!--</div>-->
<!--</template>-->

<!--<script>-->
<!--export default {-->
<!--props:['callBack'],-->
<!--data() {-->
<!--return {-->
<!--arr:[-->
<!--{num:''},-->
<!--{num:''},-->
<!--{num:''},-->
<!--{num:''},-->
<!--{num:''},-->
<!--{num:''},-->
<!--],-->
<!--num:'',-->
<!--}-->
<!--},-->
<!--computed: {},-->
<!--watch: {-->
<!--num(){-->
<!--this.num = this.num.substr(0,6)-->
<!--}-->
<!--},-->
<!--methods: {-->
<!--change(i,e){-->
<!--console.log(i,e)-->
<!--if(!(e.key>=0&&e.key<=9)) return-->
<!--for (let t=i;t<this.arr.length;t++){-->
<!--if(!this.arr[t].num){-->
<!--return this.arr[t].num=e.key-->
<!--}-->
<!--}-->
<!--}-->
<!--},-->
<!--created() {-->
<!--},-->
<!--mounted() {-->
<!--},-->
<!--}-->
<!--</script>-->

<!--<style lang='less' scoped>-->
<!--@import "../less/global.less";-->
<!--.password{-->
<!--margin: 0 auto;-->
<!--width: fit-content;-->
<!--.passwordBox{-->
<!--width: 350px;-->
<!--height: 50px;-->
<!--display: flex;-->
<!--justify-content: space-between;-->
<!--position: relative;-->
<!--span{-->
<!--display: flex;-->
<!--width: 50px;-->
<!--height: 50px;-->
<!--border-radius: 4px;-->
<!--.bor(#b3b3b3);-->
<!--justify-content: center;-->
<!--align-items: center;-->
<!--text-align: center;-->
<!--outline: none;-->
<!--font-size: 38px;-->
<!--}-->
<!--input{-->
<!--position: absolute;-->
<!--background: transparent;-->
<!--border: 1px solid red;-->
<!--width: 100%;-->
<!--height: 100%;-->
<!--z-index: 5;-->
<!--letter-spacing: 45px;-->
<!--padding-left: 16px;-->
<!--user-select: none;-->
<!--cursor: unset;-->
<!--font-size: 35px;-->
<!--}-->
<!--}-->
<!--}-->
<!--</style>-->


<template>
  <div class='am_payPwd' :id="`ids_${idx}`">
    <input type="password"
           maxlength="1"
           @input="changeInput"
           @click="changePwd"
           v-model="pwdList[i]"
           @keyup="keyUp($event)"
           @keydown="oldPwdList = pwdList.length"
           class="shortInput"
           v-for="(v, i) in 6" :key="i">
  </div>
</template>

<script>
	export default {
		data () {
			return {
				pwdList: [],
				oldPwdList: [],
				isDelete: false,
				ipt: ''
			}
		},
		props: ['idx','callBack'],// 当一个页面有多个密码输入框时，用idx来区分
    watch:{
	    pwdList(){
        this.pwdList.length==6?(this.callBack(this.pwdList.join(''))):this.callBack('');
      }
    },
		mounted () {
			this.ipt = document.querySelectorAll(`#ids_${this.idx} .shortInput`)
		},
		methods: {
			keyUp (ev) {
				let index = this.pwdList.length
				if (!index) return
				if (ev.keyCode === 8) {
					this.isDelete = true
					if (this.oldPwdList === this.pwdList.length) {
						if (index === this.pwdList.length) {
							this.pwdList.pop()
						}
						index--
					} else {
						index > 0 && index--
					}
					this.ipt[index].focus()
				} else if (this.isDelete && index === this.pwdList.length && /^\d$/.test(ev.key)) {
					this.isDelete = false
					this.pwdList.pop()
					this.pwdList.push(ev.key)
					this.ipt[this.pwdList.length] && this.ipt[this.pwdList.length].focus()
				}
				this.$emit('getPwd', this.pwdList.join(''))
			},
			changePwd () {
				let index = this.pwdList.length
				index === 6 && index--
				this.ipt[index].focus()
			},
			changeInput () {
				let index = this.pwdList.length
				let val = this.pwdList[index - 1]
				if (!/[0-9]/.test(val)) {
					this.pwdList.pop()
					return
				}
				if (!val) {
					this.pwdList.pop()
					index--
					if (index > 0) this.ipt[index - 1].focus()
				} else {
					if (index < 6) this.ipt[index].focus()
				}
			}
		}
	}
</script>

<style lang='less' scoped>
  @import "../less/global.less";

  .am_payPwd {
    width: 100%;
    height: 44px;
    display: flex;
    justify-content: space-between;
    .shortInput {
      text-align: center;
      font-size: 38px;
      width: 44px;
      height: 44px;
      color: #333;
      outline: none;
      .bor(#b3b3b3);
      border-radius: 4px;
    }
  }
</style>









