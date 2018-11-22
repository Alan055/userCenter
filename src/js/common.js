// 判断是否为函数
export const isFunction = function (fn) {
    return Object.prototype.toString.call(fn) === '[object Function]';
};

// 获取元素在数组中的位置，没有则返回-1
export const inArray = function(item, arr) {
    for (let i = 0; i < arr.length; i++) {
        if (item === arr[i]) {
            return i;
        }
    }
    return -1;
};

// 将秒格式化为时分秒对象
export const formateSecond = function(time) {
    if (time > 0) {
        let hour = ('00' + parseInt(time / 60 / 60)).slice(-2);
        let minute = ('00' + parseInt((time - hour * 60 * 60) / 60)).slice(-2);
        let second = ('00' + parseInt((time - hour * 60 * 60 - minute * 60))).slice(-2);
        return {
            hour: hour,
            minute: minute,
            second: second
        };
    }

    return {
            hour: '00',
            minute: '00',
            second: '00'
    };

};

// 数组排序引用函数
export const sortNumber = function (a, b) {
    return a - b;
};

// 日期月份/天的显示，如果是1位数，则在前面加上'0'
export const getFormatDate = function(arg) {
    if (arg === undefined || arg === '') {
        return '';
    }
    let re = arg + '';
    if (re.length < 2) {
        re = '0' + re;
    }
    return re;
};

// 日期，在原有日期基础上，增加days天数，默认增加1天
export const addDate = function(today, days, fomat) {
    if (days === undefined || days === '') {
        days = 1;
    }
    let date = new Date(today);
    date.setDate(date.getDate() + days);
    let month = date.getMonth() + 1;
    let day = date.getDate();
    return date.getFullYear() + fomat + getFormatDate(month) + fomat + getFormatDate(day);
};

// 获取元素所有兄弟节点、所有子节点
export const getNodes = function(elem) {
    let parentNode = elem.parentNode;
    let nodeArr = parentNode.childNodes;
    let siblings = [];
    let children = elem.childNodes;
    let childNodes = [];
    for (let i = 0; i < nodeArr.length; i++) {
        if (nodeArr[i].nodeName === '#text' && !/\S/.test(nodeArr[i].nodeValue)) {
            parentNode.removeChild(nodeArr[i]);
        } else {
            siblings.push(nodeArr[i]);
        }
    }
    for (let i = 0; i < children.length; i++) {
        if (children[i].nodeName === '#text' && !/\S/.test(children[i].nodeValue)) {
            elem.removeChild(children[i]);
        } else {
            childNodes.push(children[i]);
        }
    }
    return {
        siblings,
        childNodes
    };
};

// cookie操作
export const Cookie = {
  setCookie(cName, value, expiredays) {
    let exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = cName + "=" + escape(value) + ((expiredays === null) ? "" : ";expires=" + exdate.toGMTString());
  },
  getCookie(cName) {
    if (document.cookie.length > 0) {
      let cStart = document.cookie.indexOf(cName + '=');

      if (cStart !== -1) {
        cStart = cStart + cName.length + 1;
        let cEnd = document.cookie.indexOf(';', cStart);
        if (cEnd === -1) {
          cEnd = document.cookie.length;
        }
        return unescape(document.cookie.substring(cStart, cEnd));
      }
    }
    return "";
  },
  checkCookie(cName) {
    let name = this.getCookie(cName);
    if (name !== null && name !== '') {
      return false;
    }
    return true;
  }
};
// 判断是否为PC
export const IsPC = function () {
  var userAgentInfo = navigator.userAgent;
  var Agents = ["Android", "iPhone",
    "SymbianOS", "Windows Phone",
    "iPad", "iPod"];
  var flag = true;
  for (let v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
      flag = false;
      break;
    }
  }
  return flag;
};
// 获取元素距离浏览器边框的距离
export const getRect = function (element) {
  let rect = element.getBoundingClientRect();
  let clientTop = document.documentElement.clientTop;
  let clientLeft = document.documentElement.clientLeft;
  return { // 兼容ie多出的两个px
    top: rect.top - clientTop, // 距离顶部的位置
    bottom: rect.bottom - clientTop, // 距离顶部加上元素本身的高度就等于bottom的位置
    left: rect.left - clientLeft, // 距离左边的位置
    right: rect.right - clientLeft // 距离右边的位置就是 距离左边的位置加上元素本身的宽度
  };
};
// 判断浏览器类型
export const browserType = function() {
  let Sys = {};
  let ua = navigator.userAgent.toLowerCase();
  let s;
  (s = ua.match(/rv:([\d.]+)\) like gecko/)) ? Sys.ie = s[1] : (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] : (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1]
    : (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] : (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] : (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;

  if (Sys.ie) {
    return {name : 'IE', version : Sys.ie}
  }
  if (Sys.firefox) {
    return {name : 'firefox', version : Sys.firefox}
  };
  if (Sys.chrome) {
    return {name : 'chrome', version : Sys.chrome}
  };
  if (Sys.opera) {
    return {name : 'opera', version : Sys.opera}
  };
  if (Sys.safari) {
    return {name : 'safari', version : Sys.safari}
  };
  return {name: ''}
}

export function LZString() {
	function o(o, r) {
		if (!t[o]) {
			t[o] = {};
			for (var n = 0; n < o.length; n++) t[o][o.charAt(n)] = n
		}
		return t[o][r]
	}

	var r = String.fromCharCode, n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
		e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$", t = {}, i = {
			compressToBase64: function (o) {
				if (null == o) return "";
				var r = i._compress(o, 6, function (o) {
					return n.charAt(o)
				});
				switch (r.length % 4) {
					default:
					case 0:
						return r;
					case 1:
						return r + "===";
					case 2:
						return r + "==";
					case 3:
						return r + "="
				}
			}, decompressFromBase64: function (r) {
				return null == r ? "" : "" == r ? null : i._decompress(r.length, 32, function (e) {
					return o(n, r.charAt(e))
				})
			}, compressToUTF16: function (o) {
				return null == o ? "" : i._compress(o, 15, function (o) {
					return r(o + 32)
				}) + " "
			}, decompressFromUTF16: function (o) {
				return null == o ? "" : "" == o ? null : i._decompress(o.length, 16384, function (r) {
					return o.charCodeAt(r) - 32
				})
			}, compressToUint8Array: function (o) {
				for (var r = i.compress(o), n = new Uint8Array(2 * r.length), e = 0, t = r.length; t > e; e++) {
					var s = r.charCodeAt(e);
					n[2 * e] = s >>> 8, n[2 * e + 1] = s % 256
				}
				return n
			}, decompressFromUint8Array: function (o) {
				if (null === o || void 0 === o) return i.decompress(o);
				for (var n = new Array(o.length / 2), e = 0, t = n.length; t > e; e++) n[e] = 256 * o[2 * e] + o[2 * e + 1];
				var s = [];
				return n.forEach(function (o) {
					s.push(r(o))
				}), i.decompress(s.join(""))
			}, compressToEncodedURIComponent: function (o) {
				return null == o ? "" : i._compress(o, 6, function (o) {
					return e.charAt(o)
				})
			}, decompressFromEncodedURIComponent: function (r) {
				return null == r ? "" : "" == r ? null : (r = r.replace(/ /g, "+"), i._decompress(r.length, 32, function (n) {
					return o(e, r.charAt(n))
				}))
			}, compress: function (o) {
				return i._compress(o, 16, function (o) {
					return r(o)
				})
			}, _compress: function (o, r, n) {
				if (null == o) return "";
				var e, t, i, s = {}, p = {}, u = "", c = "", a = "", l = 2, f = 3, h = 2, d = [], m = 0, v = 0;
				for (i = 0; i < o.length; i += 1) if (u = o.charAt(i), Object.prototype.hasOwnProperty.call(s, u) || (s[u] = f++, p[u] = !0), c = a + u, Object.prototype.hasOwnProperty.call(s, c)) a = c; else {
					if (Object.prototype.hasOwnProperty.call(p, a)) {
						if (a.charCodeAt(0) < 256) {
							for (e = 0; h > e; e++) m <<= 1, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++;
							for (t = a.charCodeAt(0), e = 0; 8 > e; e++) m = m << 1 | 1 & t, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t >>= 1
						} else {
							for (t = 1, e = 0; h > e; e++) m = m << 1 | t, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t = 0;
							for (t = a.charCodeAt(0), e = 0; 16 > e; e++) m = m << 1 | 1 & t, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t >>= 1
						}
						l--, 0 == l && (l = Math.pow(2, h), h++), delete p[a]
					} else for (t = s[a], e = 0; h > e; e++) m = m << 1 | 1 & t, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t >>= 1;
					l--, 0 == l && (l = Math.pow(2, h), h++), s[c] = f++, a = String(u)
				}
				if ("" !== a) {
					if (Object.prototype.hasOwnProperty.call(p, a)) {
						if (a.charCodeAt(0) < 256) {
							for (e = 0; h > e; e++) m <<= 1, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++;
							for (t = a.charCodeAt(0), e = 0; 8 > e; e++) m = m << 1 | 1 & t, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t >>= 1
						} else {
							for (t = 1, e = 0; h > e; e++) m = m << 1 | t, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t = 0;
							for (t = a.charCodeAt(0), e = 0; 16 > e; e++) m = m << 1 | 1 & t, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t >>= 1
						}
						l--, 0 == l && (l = Math.pow(2, h), h++), delete p[a]
					} else for (t = s[a], e = 0; h > e; e++) m = m << 1 | 1 & t, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t >>= 1;
					l--, 0 == l && (l = Math.pow(2, h), h++)
				}
				for (t = 2, e = 0; h > e; e++) m = m << 1 | 1 & t, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t >>= 1;
				for (; ;) {
					if (m <<= 1, v == r - 1) {
						d.push(n(m));
						break
					}
					v++
				}
				return d.join("")
			}, decompress: function (o) {
				return null == o ? "" : "" == o ? null : i._decompress(o.length, 32768, function (r) {
					return o.charCodeAt(r)
				})
			}, _decompress: function (o, n, e) {
				var t, i, s, p, u, c, a, l, f = [], h = 4, d = 4, m = 3, v = "", w = [],
					A = {val: e(0), position: n, index: 1};
				for (i = 0; 3 > i; i += 1) f[i] = i;
				for (p = 0, c = Math.pow(2, 2), a = 1; a != c;) u = A.val & A.position, A.position >>= 1, 0 == A.position && (A.position = n, A.val = e(A.index++)), p |= (u > 0 ? 1 : 0) * a, a <<= 1;
				switch (t = p) {
					case 0:
						for (p = 0, c = Math.pow(2, 8), a = 1; a != c;) u = A.val & A.position, A.position >>= 1, 0 == A.position && (A.position = n, A.val = e(A.index++)), p |= (u > 0 ? 1 : 0) * a, a <<= 1;
						l = r(p);
						break;
					case 1:
						for (p = 0, c = Math.pow(2, 16), a = 1; a != c;) u = A.val & A.position, A.position >>= 1, 0 == A.position && (A.position = n, A.val = e(A.index++)), p |= (u > 0 ? 1 : 0) * a, a <<= 1;
						l = r(p);
						break;
					case 2:
						return ""
				}
				for (f[3] = l, s = l, w.push(l); ;) {
					if (A.index > o) return "";
					for (p = 0, c = Math.pow(2, m), a = 1; a != c;) u = A.val & A.position, A.position >>= 1, 0 == A.position && (A.position = n, A.val = e(A.index++)), p |= (u > 0 ? 1 : 0) * a, a <<= 1;
					switch (l = p) {
						case 0:
							for (p = 0, c = Math.pow(2, 8), a = 1; a != c;) u = A.val & A.position, A.position >>= 1, 0 == A.position && (A.position = n, A.val = e(A.index++)), p |= (u > 0 ? 1 : 0) * a, a <<= 1;
							f[d++] = r(p), l = d - 1, h--;
							break;
						case 1:
							for (p = 0, c = Math.pow(2, 16), a = 1; a != c;) u = A.val & A.position, A.position >>= 1, 0 == A.position && (A.position = n, A.val = e(A.index++)), p |= (u > 0 ? 1 : 0) * a, a <<= 1;
							f[d++] = r(p), l = d - 1, h--;
							break;
						case 2:
							return w.join("")
					}
					if (0 == h && (h = Math.pow(2, m), m++), f[l]) v = f[l]; else {
						if (l !== d) return null;
						v = s + s.charAt(0)
					}
					w.push(v), f[d++] = s + v.charAt(0), h--, s = v, 0 == h && (h = Math.pow(2, m), m++)
				}
			}
		};
	return i
}
// 判断数组中有几个重复的元素
export function hasDuplicates(a, len) {
	if (arguments.length > 2) {
		var chkeylen = arguments[2];
		var bc = _.countBy(a, _.identity);
		var maxsame = 0;
		for (var key in bc) {
			if (typeof bc[key] !== 'undefined') {
				if (bc[key] > maxsame) {
					maxsame = bc[key];
				}
			}
		}
		var allkeys = Object.keys(bc);
		if (arguments.length > 3) {
			return _.uniq(a).length !== a.length && chkeylen == maxsame && arguments[3] == allkeys.length && (a.length - _.uniq(a).length == len);
		}
		return _.uniq(a).length !== a.length && chkeylen == maxsame && (a.length - _.uniq(a).length == len);
	}
	return _.uniq(a).length !== a.length ? (a.length - _.uniq(a).length  == len) : true;
}
/*
 * 获取彩种类别-大类（只有6大类）
*/
export function getLotteryType(data) {
	// 线路的列表号
	// 这个appConfig一般从线上获取，我们本地不能写死的，会随时修改
	let ltgroups = appConfig().ltgroups
	let jd = `,${ltgroups.jd.join(',')},`
	let sscs = `,${ltgroups.ssc.join(',')},`
	let flb = `,${ltgroups.flb.join(',')},`
	let k3 = `,${ltgroups.k3.join(',')},`
	let pk10 = `,${ltgroups.pk10.join(',')},`
	let elvenY = `,${ltgroups['11y'].join(',')},`
	let dpc = `,${ltgroups['dpc'].join(',')},`
	let id = `,${data},`
  // console.log(data,'getLotteryTypegetLotteryType');
	if (jd.indexOf(id) > -1) {
		return 'jd'
	} else if (sscs.indexOf(id) > -1 || parseInt(data,10)==42) {
		return 'sscs'
	} else if (flb.indexOf(id) > -1) {
		return 'flb'
	} else if (pk10.indexOf(id) > -1) {
		return 'pk10'
	} else if (elvenY.indexOf(id) > -1) {
		return 'elvenY'
	} else if (k3.indexOf(id) > -1) {
		return 'k3'
	} else if(dpc.indexOf(id) > -1 && parseInt(data,10)!=42){
		return 'dpc'
	}else{
		return ''
	}
	return ''
}
