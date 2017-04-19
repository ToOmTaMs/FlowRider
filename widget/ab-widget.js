// ab-auth.js
// 2014-08-07
// load bootstrap 3 css if need
var AppBerry = { version: "0.1" };			// this is only obj. expose as global

(function(AB,$) {

	AB.conf 			= {};		// default conf.
	AB.uconf 			= {};		// user override conf.
	// AB.domain     = "http://pr1-9net.local";
	//AB.domain     = "http://api.tappr1.com";
	AB.domain     = BASE_URL;
	//AB.domain     = "http://192.168.1.224:82/fderm_stock_mm";
	//AB.domain     = "http://203.147.39.167:82/fderm_stock_mm";
	//AB.domain     = "http://203.147.39.167:82/fderm_stock_mm_test_20161101";
	AB.baseUrl 		= AB.domain + "/api/appberry/v1/";
	AB.conf.isInit		= false;

	var FB_LOGIN_URL = 'https://www.facebook.com/dialog/oauth',
			runningInCordova = false,
			oauthRedirectURL,
			deferredLogin = new $.Deferred(),
			messageIntervalId,
			loginWindowTimeout
			;

	document.addEventListener("deviceready", function () {
    runningInCordova = true;
    console.log("runningInCordova",runningInCordova);
  }, false);


	AB.hello = function () {
		alert("hello from AppBerry.co");
	}

	AB.showMsg = function (id,msg) {
		$("#" + id).show().html(msg);
	}

	AB.cbOk = function (res) {
		// console.log(res);
	}

	AB.cbFail = function (xhr,status,errorThrown) {
		 console.log(status);
		//AB.showMsg("login-alert",xhr.responseJSON.err_msg);
	}

	// return promise
	AB.api = function (service,data,method,cbOk,cbFail) {
		service = service || "";
		if (service === "") {
			return null;		// service is required
		}
		data = data || {};
		method = method || "GET";
		cbOk = cbOk || AB.cbOk;
		cbFail = cbFail || AB.cbFail;
		//alert(AB.baseUrl + service);
		//console.log("POST",AB.baseUrl + service);
		var req = $.ajax({
			url: AB.baseUrl + service,
			type: method,
			data: data,
			dataType: "json",
			success: cbOk,
			error: cbFail,
			complete: function () {}
		});
		return req;
	}
	AB.get = function (service,data,cbOk,cbFail) {
		return AB.api(service,data,'GET',cbOk,cbFail);
	}
	AB.post = function (service,data,cbOk,cbFail) {
		return AB.api(service,data,'POST',cbOk,cbFail);
	}

	AB.customize = function (s,t) {
		var r = s;
		var re,find;
		for (var k1 in t) {
			find = '{{' + k1 + '}}';
			re = new RegExp(find, 'g');
			//console.log(find + " " + t[k1]);
			r = r.replace(re,t[k1]);
		}
		return r;
	}
	AB.embedded = function () {
		// we need to use server proxy to do CORS, or use jsonp
		AB.get('app.get_template/', {f:AB.conf.templateUrl},function(data) {
			var html = AB.customize(data.html,AB.conf.text);
			$(AB.conf.container).append(html);
			$("#ab-wrapper").removeClass('popup');
			$("#bu-close-popup").hide();
			$("#bu-close-popup2").hide();
		});
	}
	AB.popup = function () {
		console.log('popup');
		if (AB.conf.isInit) {
			AB.popupOpen();
			return;
		}
		// $.get(AB.conf.templateUrl,function(html) {
		AB.get('app.get_template/', {f:AB.conf.templateUrl},function(data) {
			html = AB.customize(data.html,AB.conf.text);
			$(AB.conf.container).append(html);
			AB.popupOpen();
		});
	}
	AB.popupOpen = function () {
		$("#ab-wrapper").addClass('open');
	}
	AB.popupClose = function () {
		$("#ab-wrapper").removeClass('open');
	}

	AB.init = function (opts,cbAfterinit) {
		if (typeof opts === "object") AB.uconf = opts;
		if (typeof opts === "string") AB.uconf.appId = opts;


		// load config from server
		var q;
		q = AB.get('app/' + AB.uconf.appId,{},function(res) {
			// merge with user override
			AB.uconf.text = $.extend(res.options.text,AB.uconf.text);				// deep object
			$.extend(AB.conf,res.options,AB.uconf);

			var bootstrap_enabled = (typeof $().modal == 'function');
			console.log('boostrap css:',bootstrap_enabled);
			// if (! bootstrap_enabled && (AB.conf.templateUrl.indexOf('http://appberry.co') ==-1)) {
			if (! bootstrap_enabled) {
				//load boostrap css, we need it, it need to be here. if not it break facebook SDK asyncInit
				$("<link/>", {
					rel: "stylesheet",
					type: "text/css",
					href: "//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css"
				}).appendTo("head");
			}

			console.log(AB.conf);
			console.log(runningInCordova);
			// put widget in container or popup
			AB[AB.conf.mode]();
			AB.conf.isInit = true;


			if (typeof cbAfterinit === "function") cbAfterinit();
		});
		return q;
	}

	AB.doAuth = function (username,password,cbOk) {
		// get username,password from form. Default id is login-username, login-password
		username = username || $('#login-username').val();
		password = password || $('#login-password').val();

		AB.post("user.auth",{ c_email:username,c_passwd:password,c_app_id:AB.conf.appId })
		.done(function(data) {
			console.log(data)	;
			AB.showMsg("login-success","Successful Auth.");
			localStorage.ABuser = JSON.stringify(data);
			if (AB.conf.redirect !=="") window.location.replace(AB.conf.redirect);
			else {
				// do call back for one-page app
				if (typeof cbOk === "function") cbOk(data);
			}
		})
		.always(function() {
			$("#btn-login").prop("disabled", false);
		});

	}

	AB.doForgetPasswd = function (username,cbOk,cbFail) {
		username = username || $('#login-email').val();
		console.log(useremail);
		AB.showMsg("reset-passwd-success","Email is sent");
	}


	function parseQueryString(queryString) {
    var qs = decodeURIComponent(queryString),
        obj = {},
        params = qs.split('&');
    params.forEach(function (param) {
      var splitter = param.split('=');
      obj[splitter[0]] = splitter[1];
	  });
    return obj;
	}
	AB.oauthCallback = function (url) {
    var queryString,obj;
    console.log('ocb',url);
    // loginProcessed = true;
    if (url.indexOf("access_token=") > 0) {
    	queryString = url.substr(url.indexOf('#') + 1);
    	obj = parseQueryString(queryString);
    	console.log(obj['access_token']);
    	deferredLogin.resolve(obj['access_token']);
    } else if (url.indexOf("error=") > 0) {
    	queryString = url.substring(url.indexOf('?') + 1, url.indexOf('#'));
    	obj = parseQueryString(queryString);
    	deferredLogin.reject(obj);
    } else {
    	deferredLogin.reject();
    }
  }

	AB.FBauth = function (fbtoken) {
		loginWindow.close();
  	AB.post('user.facebook',{ fbtoken: fbtoken,c_app_id: AB.conf.appId})
	    .done(function(data) {
	    	console.log(data);
				AB.showMsg("login-success","Successful fb SDK login.");
				localStorage.ABuser = JSON.stringify(data);
				if (AB.conf.redirect !=="") window.location.replace(AB.conf.redirect);
				else {
					// do call back for one-page app
					if (typeof AB.conf.cbOk === "function") AB.conf.cbOk(data);
				}
			})
	}

	AB.doFBlogin = function () {
		loginWindow = window.open(AB.domain + '/widget/fblogin.php'+
    						'?fbAppId=' + AB.conf.fbAppId + '&fbScope=' + AB.conf.fbScope, '_blank1', 'location=no');

		if (runningInCordova) {
			loginWindow.addEventListener('loadstart', function (event) {
			// loginWindow.addEventListener('PageStared', function (event) {
				var url = event.url;
				console.log(227);
				console.log(url);
				if (url.indexOf("access_token=") > 0 || url.indexOf("error=") > 0) {
					// loginWindow.close();
					AB.oauthCallback(url);
				}
			});

			loginWindow.addEventListener('exit', function () {
        deferredLogin.reject({error: 'user_cancelled', error_description: 'User cancelled login process', error_reason: "user_cancelled"});
      });
		}
		else {
			messageIntervalId = window.setInterval(function(){myTimer()}, 1000);
			setTimeout(function() {
				window.clearInterval(messageIntervalId);
				loginWindow.close();
			},1000 * 60 * 2);	// clear after 2 minutes

			function myTimer() {
				loginWindow.postMessage('helo',AB.domain);
			}
		}
	  return deferredLogin.promise();
	}

	AB.FBlogin = function () {
		if (!AB.conf.fbAppId) {
			alert("Facebook App ID required");
    	return;
    }
    AB.doFBlogin()
    .then(function(res) {
    	AB.FBauth(res);
    })


    // .then(function(res) {
    // 	console.log('ok',res);
    // },function(res){
    // 	console.log('error:',res);
    // })
	}

	// keep for single line auth. feature
	AB.forgetPasswd = function (opts) {
		$("#btn-reset-passwd").prop("disabled", true);
		if (!AB.conf.isInit) {
			AB.init(opts,AB.doForgetPasswd);
		}
		else AB.doForgetPasswd();
	}

	AB.auth = function (opts) {
		$("#btn-login").prop("disabled", true);
		if (!AB.conf.isInit) {
			AB.init(opts,AB.doAuth);
		}
		else AB.doAuth();
	}

}(AppBerry,jQuery));

// Global function called back by the OAuth login dialog
// function oauthCallback(url) {
// 	console.log(url);
// 	console.log(AppBerry);
// 	AppBerry.oauthCallback(url);
// }

window.addEventListener("message", function(ev) {
	console.log(ev);
	AppBerry.oauthCallback(ev.data);
});