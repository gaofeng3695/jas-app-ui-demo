/**
 * @author gf 2018.08.08
 * @description 通用方法
 *
 */

(function () {
	/**
	 * @description 添加页面报错的监听
	 */
	var addErrorListener = function () {
		window.onerror = function (errorMessage, scriptURI, lineNumber) {
			if (scriptURI.indexOf('appcan.js') > -1 || !scriptURI) return; // 过滤appcan点击的bug
			alert(JSON.stringify({
				message: errorMessage,
				script: scriptURI,
				line: lineNumber
			}, 4, 4));
		}
	};
	addErrorListener();
})();


(function (window) {

	/**
	 * @description 基础操作库
	 *
	 */
	var tools = (function () {
		/**
		 * @description 创建uuid
		 */
		var createuuid = function () {
			var s = [];
			var hexDigits = "0123456789abcdef";
			for (var i = 0; i < 36; i++) {
				s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
			}
			s[14] = "4";
			s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
			s[8] = s[13] = s[18] = s[23] = "-";
			var uuid = s.join("");
			return uuid;
		};


		/**
		 * @description 继承对象
		 * @param target  要被继承的对象
		 */
		var extend = function (target) {
			for (var i = 1, j = arguments.length; i < j; i++) {
				var source = arguments[i] || {};
				for (var prop in source) {
					if (source.hasOwnProperty(prop)) {
						var value = source[prop];
						if (value !== undefined) {
							target[prop] = value;
						}
					}
				}
			}
			return target;
		};


		/**
		 * @description   获取url的
		 * @param target  要被继承的对象
		 */
		var getParamsInUrl = function (url) {
			var obj = null;
			if (url) {
				var arr = url.split('?');
				if (arr.length > 1) {
					var str = arr[1];
					var arr2 = str.split('&');
					arr2.forEach(function (item) {
						var _arr = item.split('=');
						if (_arr.length > 1) {
							obj = obj ? obj : {};
							obj[_arr[0]] = _arr[1];
						}
					})
				}
			} else {
				var str = uexWindow.getUrlQuery();
				if (!str) return {};
				var arr2 = str.split('&');
				arr2.forEach(function (item) {
					var _arr = item.split('=');
					if (_arr.length > 1) {
						obj = obj ? obj : {};
						obj[_arr[0]] = _arr[1];
					}
				})
			}
			return obj || {};
		};


		/**
		 * @description  	向url上添加 key:value
		 * @param url  locoation.href
		 * @param obj  键值对
		 */
		var setParamsToUrl = function (url, obj) {
			if (!obj || typeof obj !== 'object') {
				return url
			}
			for (var prop in obj) {
				if (obj.hasOwnProperty(prop)) {
					var value = obj[prop];
					if (value !== undefined) {
						var str_connenct = url.indexOf('?') === -1 ? '?' : '&';
						url += str_connenct + prop + '=' + value;
					}
				}
			}
			return url;
		};


		var getIdArrFromTree = function (treeData, nodeId, config) {

			var pidArr = [nodeId];
			var getPId = function (dataArr, id, pid) {
				for (var i = 0; i < dataArr.length; i++) {
					var item = dataArr[i];
					if (item.id === id) {
						return pid;
					} else {
						if (item.children && item.children.length > 0) {
							var result = getPId(item.children, id, item.id);
							if (result) return result;
						}
					}
				}
			};
			var getPPId = function (dataArr, id) {
				var pid = getPId(dataArr, id, '');
				if (pid) {
					pidArr.push(pid);
					getPPId(dataArr, pid);
				} else {
					return pidArr;
				}
			};

			getPPId(treeData, nodeId);
			return pidArr.reverse();
		};

		//字符串下划线转为驼峰
		var switchToCamelCase = function (string) {
			// Support: IE9-11+
			return string.replace(/_([a-z])/g, function (all, letter) {
				return letter.toUpperCase();
			});
		}

		var eventBus = function (eventObj, fn) {
			function EvnentBus(eventObj, fn) {
				this.nameList = [];
				this.fnList = [];
				this.fn = fn;
				this.init(eventObj, fn);
			}
			EvnentBus.prototype = {
				constructor: EvnentBus,
				init: function (eventObj, fn) {
					for (var key in eventObj) {
						if (eventObj.hasOwnProperty(key)) {
							this.nameList.push(key);
							this.fnList.push(eventObj[key]);
						}
					}
					this.go(0);
				},
				go: function (index) {
					if (index > this.fnList.length - 1) {
						this.fn && this.fn();
					} else {
						this.index = index;
						this.currentFnName = this.nameList[this.index];
						this.fnList[index] && this.fnList[index].call();
					}
				},
				next: function () {
					this.index++;
					this.go(this.index);
				}
			};
			return new EvnentBus(eventObj, fn);
		};

		var formatDate = function (oDate, sFormat) { // 入参：date对象，格式化格式
			/*
			 * 对Date的扩展，将 Date 转化为指定格式的String
			 * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
			 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
			 * 例子：
			 * formatDate(new Date(),"yyyy-MM-dd HH:mm:ss.S") ==> 2006-07-02 08:09:04.423
			 * formatDate(new Date(),"yyyy-M-d H:m:s.S")      ==> 2006-7-2 8:9:4.18
			 * formatDate(new Date(),"yyyyMMddHHmmssS")      ==> 20060702080904423
			 */
			var o = {
				"M+": oDate.getMonth() + 1, //月份
				"d+": oDate.getDate(), //日
				"H+": oDate.getHours(), //小时
				"m+": oDate.getMinutes(), //分
				"s+": oDate.getSeconds(), //秒
				"q+": Math.floor((oDate.getMonth() + 3) / 3), //季度
				"S": oDate.getMilliseconds() //毫秒
			};
			if (/(y+)/.test(sFormat)) sFormat = sFormat.replace(RegExp.$1, (oDate.getFullYear() + "").substr(4 - RegExp.$1.length));
			for (var k in o)
				if (new RegExp("(" + k + ")").test(sFormat)) sFormat = sFormat.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
			return sFormat;
		};

		return {
			createuuid: createuuid,
			extend: extend,
			getParamsInUrl: getParamsInUrl,
			setParamsToUrl: setParamsToUrl,
			getIdArrFromTree: getIdArrFromTree,
			switchToCamelCase: switchToCamelCase,
			eventBus: eventBus,
			formatDate: formatDate,
		};
	})();

	//
	var ajax = (function (appcan) {
		var protocolConfig = appcan.locStorage.getVal('serverProtocol') || 'https://'; //协议
		var host = appcan.locStorage.getVal('serverIP') || 'daq.zyax.cn'; //主机
		var portConfig = appcan.locStorage.getVal('serverPort') || ''; //端口号

		var serverURL = protocolConfig + host + (portConfig ? ':' : '') + portConfig + '/';
		var routeURL = 'DAQProject';
		var completeURL = serverURL + routeURL;

		var ajax = function (sType, sUrl, oData, fnSuccess, fnFail, defaultToast) { //defaultToast boolean 默认false，
			if (!sType) {
				alert('请传入类型！');
				return;
			}
			if (!sUrl) {
				alert('请传入url！');
				return;
			}

			appcan.ajax({
				type: sType,
				url: completeURL + sUrl + (sUrl.indexOf("?") !== -1 ? '&' : '?') + 'token=' + localStorage.getItem("token"),
				data: oData,
				headers: {
					"Content-type": "application/json;charset=utf-8",
					"Accept": "*/*"
				}, //设置请求头
				contentType: "application/json;charset=utf-8", //请求时发送的数据格式
				dataType: 'json', //期望服务器返回的数据格式
				timeout: 30000, //超时时间
				cache: false, //不缓存get返回的数据
				beforeSend: function () {

					//baseOperation.londingToast('数据请求中，请稍后...', 999999);
				},
				success: function (oData, status, requestCode, response, xhr) {
					//baseOperation.closeToast();
					if (oData.success == 1 || oData.status == 1 || (!oData.success && !oData.status)) {
						return fnSuccess && fnSuccess(oData, status, requestCode, response, xhr);
					} else {
						//baseOperation.alertToast('网络繁忙，请稍后再试');
						if (oData.code == 402) {
							appcan.window.confirm({
								title: '提示',
								content: '您的登录验证已失效',
								buttons: ['去登录', '取消'],
								callback: function (err, data, dataType, optId) {
									if (data == 0) {
										appcan.window.evaluateScript('index', 'vm.goToLogin()')
									}
								}
							});
						}
						if (!defaultToast) {
							Vue && Vue.prototype.$indicator.close();
							Vue && Vue.prototype.$toast(oData.msg || '网络繁忙，请稍后再试');
						}
						return fnFail && fnFail(oData);
					}
				},
				error: function (xhr, erroType, error, msg) {
					Vue && Vue.prototype.$indicator.close();
					Vue && Vue.prototype.$toast('网络连接失败，请检查您的网络');
					//baseOperation.alertToast('网络连接失败，请检查您的网络', 3333);
					return fnFail && fnFail(xhr);
				}
			});
		};

		/*
		 * 请求对象
		 */
		function JasHttpRequest() {
			timeout = 30000; //请求超时时间30秒
			requestHeader = '{"Content-type":"application/json;charset=utf-8"}'; //请求的报文头

		}

		JasHttpRequest.prototype = {
			constructor: JasHttpRequest,
			//服务请求的方法
			jasHttpGet: function (partURL, requestCallback) {
				//创建请求唯一标识
				var requestID = Math.floor(Math.random() * (100000 + 1));
				//请求的URL
				var getURL = jasTools.ajax.completeURL + partURL;
				if (appcan.locStorage.getVal("token") !== 'undefined' && appcan.locStorage.getVal("token") != null && appcan.locStorage
					.getVal("token").length > 0) {
					var token = appcan.locStorage.getVal("token");
					if (getURL.indexOf("?") != -1) {
						getURL += "&token=" + token;
					} else {
						getURL += "?token=" + token;
					}
				}
				//异步请求完成的回调函数
				if (appcan.isFunction(requestCallback)) {
					uexXmlHttpMgr.onData = requestCallback;
					uexXmlHttpMgr.close(requestID);
				}
				//创建一个请求对象
				uexXmlHttpMgr.open(requestID, "GET", getURL, timeout);
				//设置请求对象表头
				uexXmlHttpMgr.setHeaders(requestID, requestHeader);
				//发送请求
				uexXmlHttpMgr.send(requestID);
			},
			jasHttpPost: function (partURL, requestCallback, postData, onPostProgressCallback) {

				//创建请求唯一标识
				var requestID = Math.floor(Math.random() * (100000 + 1));
				//请求的URL
				var getURL = jasTools.ajax.completeURL + partURL;


				if (appcan.locStorage.getVal("token") !== 'undefined' && appcan.locStorage.getVal("token") != null && appcan.locStorage
					.getVal("token").length > 0) {
					var token = appcan.locStorage.getVal("token");
					if (getURL.indexOf("?") != -1) {
						getURL += "&token=" + token;
					} else {
						getURL += "?token=" + token;
					}
				}

				//异步请求完成的回调函数
				if (appcan.isFunction(requestCallback)) {
					uexXmlHttpMgr.onData = requestCallback;
					uexXmlHttpMgr.close(requestID);
				}
				//发送进度改变的监听方法
				if (appcan.isFunction(onPostProgressCallback)) {
					uexXmlHttpMgr.onPostProgress = onPostProgressCallback;
				}
				//创建一个请求对象
				uexXmlHttpMgr.open(requestID, "POST", getURL, timeout);
				//设置请求对象表头
				uexXmlHttpMgr.setHeaders(requestID, requestHeader);
				//设置请求对象的body参数
				uexXmlHttpMgr.setBody(requestID, postData);
				//发送请求
				uexXmlHttpMgr.send(requestID);
			},
			jasHttpClose: function (requestID) {
				uexXmlHttpMgr.close(requestID);
			}
		}

		return {
			protocolConfig: protocolConfig,
			host: host,
			portConfig: portConfig,
			serverURL: serverURL,
			completeURL: completeURL,
			refreshIpConfig: function () {
				protocolConfig = appcan.locStorage.getVal('serverProtocol') || 'https://'; //协议
				host = appcan.locStorage.getVal('serverIP') || 'daq.zyax.cn'; //主机
				portConfig = appcan.locStorage.getVal('serverPort') || ''; //端口号
				serverURL = protocolConfig + host + (portConfig ? ':' : '') + portConfig + '/';
				completeURL = serverURL + routeURL;

				this.protocolConfig = protocolConfig;
				this.host = host;
				this.portConfig = portConfig;
				this.serverURL = serverURL;
				this.completeURL = completeURL;

			},
			get: function (sUrl, oData, fnSuccess, fnFail, defaultToast) {
				try {
					ajax.call(this, 'GET', sUrl, oData, fnSuccess, fnFail, defaultToast);
				} catch (e) {
					Vue && Vue.prototype.$indicator.close();
					Vue && Vue.prototype.$toast('系统故障，网络已中断');

					return fnFail && fnFail(e);
				}
			},
			post: function (sUrl, oData, fnSuccess, fnFail, defaultToast) {
				try {
					ajax.call(this, 'POST', sUrl, oData, fnSuccess, fnFail, defaultToast);
				} catch (e) {
					Vue && Vue.prototype.$indicator.close();
					Vue && Vue.prototype.$toast('系统故障，网络已中断');

					return fnFail && fnFail(e);
				}
			},
			postByOldWay: function (sUrl, oData, fnSuccess, fnFail, defaultToast) {
				try {
					var jasHttpRequest = new JasHttpRequest();
					jasHttpRequest.jasHttpPost(sUrl, function (id, state, dbSource) {
						if (state == -1 || dbSource.length == 0) {
							fnFail && fnFail();
						} else {
							var result = JSON.parse(dbSource);
							if (result.success == 1 || result.status == 1 || (!result.success && !result.status)) {
								return fnSuccess && fnSuccess(result, status);
							} else {
								if (result.code == 402) {
									appcan.window.confirm({
										title: '提示',
										content: '您的登录验证已失效',
										buttons: ['去登录', '取消'],
										callback: function (err, data, dataType, optId) {
											if (data == 0) {
												appcan.window.evaluateScript('index', 'vm.goToLogin()')
											}
										}
									});
								}
								if (!defaultToast) {
									Vue && Vue.prototype.$indicator.close();
									Vue && Vue.prototype.$toast(result.msg || '网络繁忙，请稍后再试');
								}
								return fnFail && fnFail(result);
							}
						}
					}, JSON.stringify(oData));
				} catch (e) {
					Vue && Vue.prototype.$indicator.close();
					Vue && Vue.prototype.$toast('系统故障，网络已中断');
					return fnFail && fnFail(e);
				}
			},
			uploadFile: function (sUrl, sPath, fnSuccess, fnFail, fnProgress, isHideTip) { //sPath :文件路径,
				//此处有一个坑，多个文件上传成功后，会出现调用error的情况
				appcan.ajax({
					type: 'POST',
					url: completeURL + sUrl + (sUrl.indexOf("?") !== -1 ? '&' : '?') + 'token=' + appcan.locStorage.getVal("token"),
					data: {
						file: {
							path: sPath
						}
					},
					contentType: false, //请求时发送的数据格式
					dataType: 'json', //期望服务器返回的数据格式
					timeout: 30000, //超时时间
					beforeSend: function () {
						//baseOperation.londingToast('数据请求中，请稍后...', 999999);
					},
					success: function (oData, status, requestCode, response, xhr) {
						//baseOperation.closeToast();
						if (oData.success === 1 || oData.status === 1) {
							return fnSuccess && fnSuccess(oData, status, requestCode, response, xhr);
						} else {
							//(!isHideTip) && baseOperation.alertToast('网络繁忙，请稍后再试');
							return fnFail && fnFail();
						}
					},
					progress: function (progress, xhr) {},
					error: function (xhr, erroType, error, msg) {
						// Vue && Vue.prototype.$toast('网络连接失败，请检查您的网络');
						return fnFail && fnFail();
					}
				});
			},

			uploadFiles: function (sBizId, oFiles, fnSuccess, fnFail, isHideTip) {
				var that = this;
				var nFileQtty = 0;
				var nFileQtty_success = 0;
				var nFileQtty_fail = 0;
				var fnResult_done = false;

				var fnResult = function () {
					if (nFileQtty_success + nFileQtty_fail < nFileQtty || fnResult_done) {
						return; //未全部上传成功，返回
					}
					if (nFileQtty_success > 0) {
						fnResult_done = true;
						return fnSuccess && fnSuccess(); //有一个附件上传成功，就算成功
					}
					return fnFail && fnFail(); //否则，算作失败
				};
				//http://192.168.100.43/DAQProject/attachment/upload.do?businessId=1f4dea6c-0ae2-487c-8151-4e52bc7a20a7&businessType=file
				for (var item in oFiles) { //循环，异步上传附件，是否上传成功，会在回调中计算
					if (oFiles.hasOwnProperty(item)) {
						var bizType = item;
						var aFiles = oFiles[item];
						var sUrl = "/attachment/upload.do?businessId=" + sBizId + "&businessType=" + bizType;
						aFiles.forEach(function (src, index) {
							nFileQtty++;
							that.uploadFile(sUrl, src, function () {
								nFileQtty_success++;
								//alert('nFileQtty_success'+nFileQtty_success)
								fnResult();
							}, function () { //有时候上传成功后也会走失败，这是坑，加了fnResult_done做判断，已解决
								//alert('nFileQtty_fail'+nFileQtty_fail)
								nFileQtty_fail++;
								fnResult();
							}, true);
						});
					}
				}
				if (nFileQtty === 0) { //如果没有附件，直接运行成功回调
					return fnSuccess && fnSuccess();
				}
			},
			deleteFilesByBizId: function (sBizId, fnSuccess) {

				var partURL = "cloudlink-core-file/attachment/delBizAndFileByBizIdsAndBizAttrs";
				var queryObj = {
					"bizTypes": ["pic", "signature"],
					"bizIds": [sBizId]
				};
				jasRequest.post(partURL, queryObj, function (oData) {
					return fnSuccess && fnSuccess();
				});
			}
		};
	})(appcan);

	window.jasTools = {
		base: tools,
		ajax: ajax,
	};
})(window);