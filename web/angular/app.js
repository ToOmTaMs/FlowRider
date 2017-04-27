

angular.module('abAPP', [ 'abAPP.controllers',  'abAPP.services', 'abAPP.directives',
  'ngRoute', 'AB',
  'toaster', 'flow',
  'textAngular',
  'pascalprecht.translate',
  'ngTagsInput','ui-rangeSlider',
  'abAPP.setting',
  'abAPP.home',
  //'abAPP.exMember',
  //'abAPP.operation',
  'abAPP.report',
  'ui.bootstrap',
  'treasure-overlay-spinner',
  'ngTouch',
  'angular-carousel',
  'fixed.table.header'
  ])



.config(function($provide,$routeProvider,$translateProvider,tagsInputConfigProvider) {
  console.log('config');

  var domain = BASE_URL;
  //var domain = "http://192.168.1.224:82/";
  // Main configuration


  var t_prefix = BASE_URL + BASE_WEB + '/web/i18n/';
  $translateProvider.useStaticFilesLoader({
    prefix: t_prefix,
    suffix: '.json'
  });
  localStorage.RGLang = "th";
  var lang = localStorage.RGLang || 'th';
  $translateProvider.preferredLanguage(lang);


  tagsInputConfigProvider.setDefaults('tagsInput', {
    placeholder: 'New tag',
    removeTagSymbol: '✖'
  })

  var time = new Date().getTime();
  var conf = {
    version: '0.1',
    homeUrl: domain +BASE_WEB + '/web/index.html',
    loginUrl: domain +BASE_WEB + '/web/login.html',
    baseUrl: domain + BASE_API , // + 'fderm_center_ps/index.php/',
    imgHost: 'http://9hosts.com/alpo/user-data/',
    // imgHost: 'http://localhost/2014/9hosts/alpo/user-data/',
    appId: 'c58e8-cbe3d-e9e56-e30d2-e2ce6',

	/*
	url: '#stock_counting_main_new',
    title: 'สร้างข้อมูลตรวจนับ',
    icon: 'fa-list text-yellow',
    view : 'views/operation/stock_counting_main.html',
    ctrl: 'Stock_counting_mainCtrl',
    hidden: true,
    */


 	menu: [
 	  { url: '#home',
        title: 'Home',
      	icon:'fa-home',
      	hidden: true,
        view : 'views/home/home.html?ver='+time,
        ctrl: 'Home.Ctrl',
      },
      { url: '#member_manage',
        title: 'จัดการสมาชิก',
      	icon:'fa-newspaper-o',
      	hidden: true,
        view : 'views/setting/member_manage.html?ver='+time,
        ctrl: 'Member.Manage.Ctrl',
        group : "member",
      },
      { url: '#member_history',
        title: 'ประวัติสมาชิก',
      	icon:'fa-newspaper-o',
      	hidden: true,
        view : 'views/setting/member_history.html?ver='+time,
        ctrl: 'Member.History.Ctrl',
        group : "member",
      },
      { url: '#agent_manage',
        title: 'จัดการ Agent',
      	icon:'fa-users',
      	hidden: true,
        view : 'views/setting/agent_manage.html?ver='+time,
        ctrl: 'Agent.Manage.Ctrl',
        group : "agent",
      },
      { url: '#agent_history',
        title: 'ประวัติ Agent',
      	icon:'fa-users',
      	hidden: true,
        view : 'views/setting/agent_history.html?ver='+time,
        ctrl: 'Agent.History.Ctrl',
        group : "agent",
      },
      { url: '#report_member',
        title: 'สมาชิก',
      	icon:'fa-pie-chart',
      	hidden: true,
        view : 'views/report/report.html?ver='+time,
        ctrl: 'Report.Ctrl',
        group : "report",
      },
      { url: '#report_agent',
        title: 'Agent',
      	icon:'fa-pie-chart',
      	hidden: true,
        view : 'views/report/report.html?ver='+time,
        ctrl: 'Report.Ctrl',
        group : "report",
      },
      { url: '#report_receipt',
        title: 'Receipt',
      	icon:'fa-pie-chart',
      	hidden: true,
        view : 'views/report/report.html?ver='+time,
        ctrl: 'Report.Ctrl',
        group : "report",
      },
      { url: '#setting',
        title: 'Agent',
      	icon:'fa-gear',
      	hidden: true,
        view : 'views/setting/setting.html?ver='+time,
        ctrl: 'Setting.Ctrl',
      },
      { url: '#conf',
        title: 'ใบเสร็จ',
      	icon:'fa-gear',
      	hidden: false,
        view : 'views/setting/conf.html?ver='+time,
        ctrl: 'Conf.Ctrl',
        group : "setting",
      },
      { url: '#lanes',
        title: 'Lanes',
      	icon:'fa-gear',
      	hidden: false,
        view : 'views/setting/lanes.html?ver='+time,
        ctrl: 'Lanes.Ctrl',
    	group : "setting",
      },
      { url: '#menu',
        title: 'หมวดอาหาร',
      	icon:'fa-gear',
      	hidden: false,
        view : 'views/setting/menu.html?ver='+time,
        ctrl: 'Menu.Ctrl',
    	group : "setting",
      },
      { url: '#item',
        title: 'รายการอาหาร',
      	icon:'fa-gear',
      	hidden: false,
        view : 'views/setting/item.html?ver='+time,
        ctrl: 'Item.Ctrl',
    	group : "setting",
      },
      { url: '#user',
        title: 'User',
      	icon:'fa-gear',
      	hidden: false,
        view : 'views/setting/user.html?ver='+time,
        ctrl: 'User.Ctrl',
      },
      { url: '#signout',
        title: 'SignOut',
        hidden: false,
      },
    ],
    pageTitle: 'Home',
    pageCaption: ''
  };



  // we cannot inject .value into .config. only provider can see angular module doc.
  $provide.value('APPconf', conf);

  // default item.url format if you do not explicit declare:
  // #email --> state = '/email', view = 'views/email.html', ctrl = 'EmailCtrl'
  function createRoute (menu) {

    var state,view,ctrl;
    angular.forEach(menu, function(item) {
      if (item.type =='treeview' || item.type =='treeview active') {
        createRoute(item.submenu);
        //console.log("submenu",item.submenu);
      }
      else {
        state = item.state || "/" + item.url.substr(1);
        view = item.view || "views/" + item.url.substr(1) + ".html";
        ctrl = item.ctrl || item.url.substr(1,1).toUpperCase() + item.url.substr(2) + "Ctrl";
        //alert(state+" "+view+" "+ctrl );
        $routeProvider.
          when(state, {
            templateUrl: view,
            controller: ctrl
          });
      }
    })

  }
  createRoute(conf.menu);
  //alert("999");


  // $routeProvider
  // .when('/adv.location/:id', {
  //   templateUrl: 'views/adv.location.form.html',
  //   controller: 'Adv.locationCtrl'
  // })

  // เอาออกก่อน จะได้ไม่วิ่ง
  $routeProvider
    .otherwise({ redirectTo:'/home'
   });

})

// test about OOP
// .run(['abAPIcore','iAPI','abAPI','APPconf', function (abAPIcore,iAPI,abAPI,APPconf) {
//   var a = new abAPIcore('aaa');
//   var b = new abAPIcore({'version':'2','appId':'bbb'});
//   a.fn('aa  print');
//   a.fn1('bb print');
//   console.log(a.conf);
//   console.log(b.conf);
//   console.log(iAPI.conf);
//   iAPI.fn('eeee');
//   iAPI.fn1('fff');
//   console.log('run');
//   console.log(iAPI);
//   abAPIcore.prototype.var1 = 'change var1 in abAPIcore'; // this will change both a and b
//   console.log(b.var1);

//   abAPI.setAppId(APPconf.appId);
//   console.log(abAPI.conf);
// }])

.run(['abAPIcore','iAPI','abAPI','APPconf','$location', function (abAPIcore,iAPI,abAPI,APPconf,$location) {

  console.log("APPconf is config",APPconf);

  	var FRuser = JSON.parse(localStorage.FRuser);
  	var location_url = $location.url().replace("/", "");
//  	if( location_url == "" ) location_url = "actcode";
    if( location_url == "" ) location_url = "login";
  	if( FRuser.location_url ==  "" || FRuser.location_url == null ) FRuser.location_url = location_url;

 	//alert(FRuser.location_url + " " +  location_url);
 	/*
  	if( FRuser.location_url != location_url){
		localStorage.removeItem("FRuser");
		iAPI.chkUser();
	}
	*/


  abAPI.setAppId(APPconf.appId);


  // with this prototype fn. we can do centralize error management
  abAPIcore.prototype.cbOkFn = function(data,status,header,config) {
    //console.log("cbOkFn in tap.app.js 2 status",status);
    //console.log('cbOkFn in header',header);
    console.log('cbOkFn in config',config);
    console.log('cbOkFn data',data);


  }

  abAPIcore.prototype.cbFailFn = function(data,status,header,config,statusText) {
    console.log("cbFailFn in tap.app.js 2 status",status);
    console.log("cbFailFn data",data);
    console.log("cbFailFn header",header);
    console.log("cbFailFn config",config);
    console.log("cbFailFn statusText",statusText);
    //iAPI.toaster.pop('error', 'Error:', data.err_msg , null, 'trustedHtml');
    //if (data.fatal) {
      // window.location.replace(APPconf.homeUrl);
    //}
  }

  //console.log("cbOkFn",abAPI.cbOkFn);
  //abAPI.get('user'); //.then (function(a) { console.log(a)},function(err){console.log(err)})

  console.log("iAPI.conf",iAPI.conf);
  console.log("abAPI.conf",abAPI.conf);


}])



.directive('validNumber', function() {
    return {
        require: '?ngModel',
        link: function(scope, element, attrs, ngModelCtrl) {
            if (!ngModelCtrl) {
                return;
            }
            ngModelCtrl.$parsers.push(function(val) {
                if (angular.isUndefined(val)) {
                    var val = '';
                }
                var clean = val.replace(/[^0-9.-]/g, '');
                if (val !== clean) {
                    ngModelCtrl.$setViewValue(clean);
                    ngModelCtrl.$render();
                }
                return clean;
            });
            element.bind('keypress', function(event) {
                if (event.keyCode === 32) {
                    event.preventDefault();
                }
            });
        }
    };
})

.directive('focus', function($timeout, $parse) {
	return {
	  restrict: 'A',
	  link: function(scope, element, attrs) {
	      scope.$watch(attrs.focus, function(newValue, oldValue) {
	          if (newValue) { element[0].focus(); }
	      });
	      element.bind("blur", function(e) {
	          $timeout(function() {
	              scope.$apply(attrs.focus + "=false");
	          }, 0);
	      });
	      element.bind("focus", function(e) {
	          $timeout(function() {
	              scope.$apply(attrs.focus + "=true");
	          }, 0);
	      })
	  }
	}
})

// .value -> .config -> [service that inject to run] -> .run
// cannot use service(factory) in .config, but .run can use service
// .value can change, it's not a constant
