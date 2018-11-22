/*
* 这里是http请求，写得相对简单，但是很实用
 */
import Vue from 'vue'

let rootPath='/yx/u/api/';//根路径

function get(context,url,params) {
	return context.$http({
		url:rootPath+url,
		params:params,
		headers: {'Content-Type': 'application/x-www-form-urlencoded'},
		method:'get'
	})
}
//post方法
function post(context,url,obj) {
	return context.$http({
		url:rootPath+url,
		body:obj,
		method:'post'
	})
}



export default {
	get:get,
	post:post,
}