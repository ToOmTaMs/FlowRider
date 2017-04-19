// ab-angular.js
// 2014-12-06
// appberry javascript library for angularjs project
angular.module('AB', [ 'AB.services', 'AB.directives' ]);

// -------------------------------------- START SERVICE -------------------------------------------
angular.module('AB.services', [])
.factory('abAPI', ['abAPIcore', function (abAPIcore) {
  var abAPI = new abAPIcore('ccc');

  abAPI.setAppId = function (a) {
    this.conf.appId = a;
  }

  // refresh data from appberry, and store in localstorage
  // items can be null for all or array of what you want to sync (user,msg,vcash)
  abAPI.sync = function (items) {
    // a_user
    // a_msg
  }
  return abAPI;
}])

.factory('abAPIcore', ['$http','$location', function ($http,$location) {
	var abAPIcore = function (a) {
		this.conf = {
      'appId': '',
	  'version': '0.1',
      // 'baseUrl': 'http://pr1-9net.local/api/appberry/1501/',
      //'baseUrl': 'http://api.tappr1.com/api/appberry/1501/',
      'baseUrl': BASE_URL+'/api/appberry/v1/',
      //'baseUrl': 'http://192.168.1.224:82/fderm_stock_mm/api/appberry/v1/',
      //'baseUrl': 'http://203.147.39.167:82/fderm_stock_mm/api/appberry/v1/',
      //'baseUrl': 'http://203.147.39.167:82/fderm_stock_mm_test_20161101/api/appberry/v1/',
      
      
      'imgHost': 'http://9hosts.com/alpo/user-data/',
      'cbOkFn': null,
      'cbFailFn': null
		};

    if (angular.isObject(a))
      angular.extend(this.conf, a);
    else if (angular.isString(a))
      this.conf.appId = a;

    this.gRow = {};

		this.fn = function (a) {
			console.log('in abAPIcore.fn() '+a)
		}

    // this.location = $location.path();
    this.location = $location;
    this.go = function (url) {
      console.log('go:'+url);
      $location.path(url);
    }
 
    this.get = function (service,data) {
      console.log('get service=',service);
      console.log('get data=',data);
     // console.log('get baseUrl=',this.conf.baseUrl);
     
      var q = $http({
        url: this.conf.baseUrl + service,
        method: 'GET',
        //data: data || {} //ngearb 2015-04-09 แก้ให้ มันส่ง GET ได้
        params : data || {}
      })
      .success(this.cbOkFn)
      .error(this.cbFailFn);
      
      //console.log("q get",q);
      return q;
    }
    this.post = function (service,data) {
    	
      //console.log('post service=',service);
      //console.log('post data=',data);  
       	
      var q = $http({
        url: this.conf.baseUrl + service,
        method: 'POST',
        data: data || {}
      })
      .success(this.cbOkFn)
      .error(this.cbFailFn);
      return q;
    }
    this.put = function (service,data) {
      var q = $http({
        url: this.conf.baseUrl + service,
        method: 'PUT',
        data: data || {}
      })
      .success(this.cbOkFn)
      .error(this.cbFailFn);
      return q;
    }
    this.delete = function (service,data) {
      var q = $http({
        url: this.conf.baseUrl + service,
        method: 'DELETE',
        data: data || {}
      })
      .success(this.cbOkFn)
      .error(this.cbFailFn);
      return q;
    }
	}

  abAPIcore.prototype.cbOkFn = function(data,status,header,config) {
    console.log(data);
  }
  abAPIcore.prototype.cbFailFn = function(data,status,header,config) {
    //console.error(data);
    console.log("cbFailFn",data);
  }


  abAPIcore.prototype.jsDate = function (s) {
    var t = s.split(/[- :]/);
    return new Date(t[0], t[1] - 1, t[2], t[3] || 0, t[4] || 0, t[5] || 0);
  }
  abAPIcore.prototype.arrayObjectIndexOf = function (arr, obj) {
    for (var i = 0; i < arr.length; i++) {
      if (angular.equals(arr[i], obj)) {
          return i;
      }
    };
    return -1;
  }
  abAPIcore.prototype.arrayObjectIndexOfbyKey = function (arr, obj,key) {
  	var count = 0 ;
  	for( var i in arr ){
	  if (arr[i][key] ===obj[key]) {
          return count;
      }
      count++;
	}
	return -1;
	/*
    for (var i = 0; i < arr.length; i++){
      if (arr[i][key] ===obj[key]) {
          return i;
      }
    };
    return -1;
    */
  }

	// if we define using prototype it's shared among all child class
	abAPIcore.prototype.var1 = 'var1';
	abAPIcore.prototype.fn1 = function (a) {
		console.log('in abAPIcore.fn1() '+a)
	}

  // abAPIcore.conf.cbOkFn = this.cbOkFn;
  // abAPIcore.conf.cbFailFn = this.cbFailFn;




	return abAPIcore;
}])

// -------------------------------------- END SERVICE -------------------------------------------

// -------------------------------------- START DIRECTIVE -------------------------------------------
angular.module('AB.directives', ['ui.bootstrap'])

// one level menu, tree view need to call jQuery  $(".sidebar .treeview").tree(); after rendering
.directive('abMenu', [function () {
  return {
    restrict: 'E',
    scope: {
      menu: "="
    },
    transclude: 'true',
    replace: 'true',
    controller: 'abMenuCtrl',
    templateUrl: '../common/views/tpl.ab-menu.html',
    link: function (scope, iElement, iAttrs) {
    }
  };
}])
.controller('abMenuCtrl', ['$scope', 'iAPI', function ($scope,iAPI) {
  $scope.menuClick = function(item) {
    // iAPI.setConf('pageTitle',item.title || item.url || 'no-title');
    // iAPI.setConf('pageCaption',item.caption || '');
    //alert("6666");
  }

  //test menu	
  console.log('scope ----menu---',$scope.menu);
  //delete $scope.menu;
  //console.log('scope ----menu---',$scope.menu); 
  
  
  
  //alert("7777");  
}])
//user for function after rendering
.directive('onLastRepeatMenu', function() {
        return function(scope, element, attrs) {
            if (scope.$last) setTimeout(function(){
                scope.$emit('onRepeatLastMenu', element, attrs);
            }, 1);
        };
})


.directive('abBox', [function () {
  return {
    restrict: 'E',
    scope: {
      options: '=',
      row: '='
    },
    transclude: 'true',
    replace: 'true',
    controller: 'abBoxCtrl',
    templateUrl: '../common/views/tpl.ab-box.html',
    link: function (scope, iElement, iAttrs) {
    }
  };
}])
.controller('abBoxCtrl', ['$scope', function ($scope) {
	var defaultOpt = {
		type: 'primary',
		title: 'defTitle',
    allowClose: false,
		hideBody: false,
		hideBox: false
	}
	// merge user options with default options. This let your tpl cleaner.
	$scope.opt = angular.extend({}, defaultOpt, $scope.options);
}])



.directive('abNavDropdown', [function () {
  return {
    restrict: 'E',
    scope: {
      options: '='
    },
    transclude: 'true',
    replace: 'true',
    controller: 'abNavDropdownCtrl',
    templateUrl: '../common/views/tpl.ab-navdropdown.html',
    link: function (scope, iElement, iAttrs) {
    }
  };
}])
.controller('abNavDropdownCtrl', ['$scope', function ($scope) {
	var defaultOpt = {
		icon: 'envelope',
		badge: {
			text: 'x',
			type: 'success'
		}
	}
	$scope.opt = angular.extend({}, defaultOpt, $scope.options);
  console.log('nav');
}])




.directive('abModal', [function () {
  return {
    restrict: 'E',
    scope: {
      options: '='
    },
    transclude: 'true',
    // replace: 'true',
    controller: 'abModalCtrl',
    templateUrl: '../common/views/tpl.ab-modal.html',
    link: function (scope, iElement, iAttrs) {
    }
  };
}])
.controller('abModalCtrl', ['$scope', function ($scope) {
  var defaultOpt = {
    modalSize: '',      // lg,sm,(md,'')
    title: 'no-title',
    titleColor: '',     // text-navy,light-blue,aqua,red,green,yellow,purple,blue,maroon
    titleBgColor: '',   // bg-navy,light-blue,aqua,red,green,yellow,purple,blue,maroon
    icon: 'pencil-square-o',
    buCloseText: 'Close',
    allowEdit: false,
    buSaveText: 'Save & Close',
  }
  $scope.opt = angular.extend({}, defaultOpt, $scope.options);

}])



/**
 * col,options attr is only one that need to pass to ab-table.
 *
 */
.directive('abTable', [function () {
  return {
    restrict: 'E',
    scope: {
      options: '=',
      cols: '=',
    },
    transclude: 'true',
    replace: 'true',
    controller: 'abTableCtrl',
    templateUrl: '../common/views/tpl.ab-table.html',
    link: function (scope, iElement, iAttrs) {
    }
  };
}])
.controller('abTableCtrl', ['$scope', '$filter', 'iAPI', function ($scope,$filter,iAPI) {
  var defaultOpt = {
    classTable: 'table table-striped table-hover table-condensed',
    tableBg: 'bg-aqua',
    showPagination: true,
    itemPerPpage: 5,
    showCheckbox: false,
    allowOp: 'view',    // string comma separator [add,update,delete,view]
    modalTemplate: 'views/modal/m-modal.html',
    modalId: '#edit-modal',
  }
  var defaultFilters = ['currency', 'date', 'json', 'lowercase', 'number', 'uppercase'];

  $scope.opt = angular.extend({}, defaultOpt, $scope.options);

  $scope.ABuser = iAPI.ABuser;
  $scope.q = '';


  // we do custom iFilter, filter only on screen data. Not the entire row/object
  $scope.iFilter = function(item) {
    if ($scope.q =='') return true;

    // this loop is faster than foreach, because we cannot break foreach loop
    // use stack var, the fastest var in loop
    for (var i =0, j =$scope.cols.length, q = $scope.q.toLowerCase(); i< j;i++) {
      if (item[$scope.cols[i]['map']].toString().toLowerCase().indexOf(q) >=0) return true;
    }
    return false;

    // var tmp ='';
    // angular.forEach($scope.cols, function(col) {
    //   tmp += item[col.map].toString().toLowerCase();
    //   console.log(tmp);
    // })
    // return tmp.indexOf($scope.q.toLowerCase()) >=0
  }

  $scope.formatValue = function(v,formatFn,formatStr) {
    var returnFn;
    if (formatFn && angular.isFunction(formatFn)) returnFn = formatFn;
    else {
      if (defaultFilters.indexOf(formatFn) !== -1) {
        returnFn = $filter(formatFn);
        if (formatFn ==='date') v = iAPI.jsDate(v);
      }
      else {
        returnFn = function (v) { return v; }
      }
    }
    return returnFn(v,formatStr);
  }
  $scope.pageChanged = function() {
    $scope.firstRow = ($scope.currentPage - 1) * $scope.opt.itemPerPpage;
    $scope.lastRow = $scope.currentPage * $scope.opt.itemPerPpage;
    $scope.checkAll = false;
  };
  $scope.doSort = function (col,r) {
    $scope.predicate = col;
    r = r || !$scope.reverse;
    $scope.reverse = r;
  }
  $scope.doSelectAll = function () {
    console.log($scope.firstRow,$scope.lastRow);
    for (var i =$scope.firstRow; i <$scope.lastRow; i++) {
      $scope.filterRows[i].isSelected = $scope.checkAll;
    }
  };

  $scope.deSelectRow = function () {
    $scope.currentRow = null;
    $scope.isConfirmDelete = false;
  }
  $scope.confirmDelete = function (row) {
    $scope.currentRow = row;
    $scope.isConfirmDelete = true;
  }

  $scope.updRow = function (row) {
    $scope.currentRow = row;
    if (angular.isFunction($scope.opt.modalFns.updRow))
      $scope.opt.modalFns.updRow(row).then(function(res) {
        var i = iAPI.arrayObjectIndexOfbyKey($scope.rows,res.data,'id');
        if (i !=-1)
          $scope.rows[i] = angular.copy(res.data);
        else {
          $scope.rows.push(res.data);
          // $scope.pageChanged();
        }
        iAPI.toaster.pop('success', 'Data submit ok', '' , null, 'trustedHtml');
        // if tpl.ab-modal.html bu_save not dismiss
        // $($scope.opt.modalId).modal('hide');
      },function(error) {
        iAPI.toaster.pop('error', 'Error:', error.data.err_msg , null, 'trustedHtml');
      });
  }
  $scope.delRow = function (row) {
    $scope.currentRow = row;
    if (angular.isFunction($scope.opt.modalFns.delRow))
      $scope.opt.modalFns.delRow(row).then(function(res) {
        var i = iAPI.arrayObjectIndexOfbyKey($scope.rows,row,'id');
        if (i !=-1) $scope.rows.splice(i,1);
        $scope.deSelectRow();
        iAPI.toaster.pop('success', 'Data delete ok', '' , null, 'trustedHtml');
      },function(error) {
        $scope.deSelectRow();
        iAPI.toaster.pop('error', 'Error:', error.data.err_msg , null, 'trustedHtml');
      });
  }

  // data operations
  $scope.getData = function (nocache) {
    if (!angular.isFunction($scope.opt.modalFns.getData)) return;
    nocache = nocache || false;
    $scope.currentPage = 1;
    $scope.doSort($scope.cols[0].map,true);
    $scope.pageChanged();
    if (nocache || angular.isUndefined($scope.rows))
      $scope.opt.modalFns.getData().then(function(res) {
        $scope.rows = $scope.filterRows = res.data;
      },function(res) {
        $scope.rows = [];
      });
  }

  $scope.getData();
}])


// ------------------------------------------- END DIRECTIVE ---------------------------------------
.directive('abForm', [function () {
  return {
    restrict: 'E',
    scope: {
      options: '=',
      cols: '=',
      row: '='
    },
    transclude: 'true',
    // replace: 'true',
    controller: 'abFormCtrl',
    templateUrl: '../common/views/tpl.ab-form.html',
    link: function (scope, iElement, iAttrs) {
    }
  };
}])
.controller('abFormCtrl', ['$scope', '$filter', 'iAPI', function ($scope,$filter,iAPI) {
  var defaultOpt = {
    showNav: true,
    backTo: '',
  }
  $scope.options = angular.extend({}, defaultOpt, $scope.options);
  $scope.goBack = function () {
    var url = $scope.options.backTo || iAPI.location.path().split('/')[1];
    iAPI.go(url);
  }
  $scope.go = function(id) {
    var url = iAPI.location.path().split('/')[1];
    iAPI.go(url+"/"+id);
  }

  $scope.getData = function() {
    if (angular.isFunction($scope.options.getDataFn)) {
      $scope.options.getDataFn();
    }
    else
    if ($scope.options.rowId >0 && $scope.row ===null) {
      iAPI.get($scope.options.apiUrl + "/" + $scope.options.rowId ).success(function(data) {
        $scope.row = data;
        // console.log(angular.isFunction($scope.options.afterGetDataFn));
        if (angular.isFunction($scope.options.afterGetDataFn)) {
          res = $scope.options.afterGetDataFn($scope.row);
        }
        if ($scope.options.showNav) {
          // try get next-prev record using GET api.get_next_prev/<id>
          iAPI.get($scope.options.apiUrl + ".get_next_prev/" + $scope.row.id)
            .success(function(data) {
              $scope.options.prevRow = data.prev;
              $scope.options.nextRow = data.next;
            });
        }
      }).error(function(data) {
        $scope.fetchError = true; // cannot proceed
      })
    }
    else {
      $scope.row = angular.copy($scope.options.newRow);
    }
  }
  $scope.postData = function() {
    var url,res = true;
    if (angular.isFunction($scope.options.beforePostDataFn)) {
      res = $scope.options.beforePostDataFn();
    }

    if (res) {
      if ($scope.options.rowId >0)
        url =$scope.options.apiUrl +"/" +$scope.options.rowId;
      else
        url =$scope.options.apiUrl;
      iAPI.post(url,$scope.row)
        .success(function(data) {
          $scope.goBack();
        })
        .error(function(data) {
        });
    }
  }
  $scope.delRow = function() {
    iAPI.delete($scope.options.apiUrl + "/" + $scope.row.id).then(function(data) {
      iAPI.showMessage("Row Deleted");
      if (!$scope.options.showNav) {
        $scope.goBack();
        return;
      }
      if ($scope.options.prevRow) $scope.go($scope.options.prevRow)
      else if ($scope.options.nextRow) $scope.go($scope.options.nextRow)
      else $scope.goBack();
    });
  }

  $scope.getData();

}])


.directive('abTable2', [function () {
  return {
    restrict: 'E',
    scope: {
      options: '=',
      cols: '=',
    },
    transclude: 'true',
    replace: 'true',
    controller: 'abTable2Ctrl',
    templateUrl: '../common/views/tpl.ab-table-2.html',
    link: function (scope, iElement, iAttrs) {
    }
  };
}])
.controller('abTable2Ctrl', ['$scope', '$filter', 'iAPI', function ($scope,$filter,iAPI) {
  var defaultOpt = {
    classTable: 'table table-striped table-hover table-condensed',
    tableBg: 'bg-aqua',
    showPagination: true,
    itemPerPpage: 5,
    showCheckbox: false,
    allowOp: 'view',    // string comma separator [add,update,delete,view]
  }
  var defaultFilters = ['currency', 'date', 'json', 'lowercase', 'number', 'uppercase'];
  $scope.opt = angular.extend({}, defaultOpt, $scope.options);

  $scope.q = '';


  // we do custom iFilter, filter only on screen data. Not the entire row/object
  $scope.iFilter = function(item) {
    if ($scope.q =='') return true;

    // this loop is faster than foreach, because we cannot break foreach loop
    // use stack var, the fastest var in loop
    for (var i =0, j =$scope.cols.length, q = $scope.q.toLowerCase(); i< j;i++) {
      if (item[$scope.cols[i]['map']].toString().toLowerCase().indexOf(q) >=0) return true;
    }
    return false;

    // var tmp ='';
    // angular.forEach($scope.cols, function(col) {
    //   tmp += item[col.map].toString().toLowerCase();
    //   console.log(tmp);
    // })
    // return tmp.indexOf($scope.q.toLowerCase()) >=0
  }

  $scope.formatValue = function(v,formatFn,formatStr) {
    var returnFn;
    if (formatFn && angular.isFunction(formatFn)) returnFn = formatFn;
    else {
      if (defaultFilters.indexOf(formatFn) !== -1) {
        returnFn = $filter(formatFn);
        if (formatFn ==='date') v = iAPI.jsDate(v);
      }
      else {
        returnFn = function (v) { return v; }
      }
    }
    return returnFn(v,formatStr);
  }
  $scope.pageChanged = function() {
    $scope.firstRow = ($scope.currentPage - 1) * $scope.opt.itemPerPpage;
    $scope.lastRow = $scope.currentPage * $scope.opt.itemPerPpage;
    $scope.checkAll = false;
  };
  $scope.doSort = function (col,r) {
    $scope.predicate = col;
    r = r || !$scope.reverse;
    $scope.reverse = r;
  }
  $scope.doSelectAll = function () {
    console.log($scope.firstRow,$scope.lastRow);
    for (var i =$scope.firstRow; i <$scope.lastRow; i++) {
      $scope.filterRows[i].isSelected = $scope.checkAll;
    }
  };

  $scope.updRow = function (id,row) {
    iAPI.gRow = row || {};
    var url = $scope.opt.formUrl || iAPI.location.path().split('/')[1];
    iAPI.go(url+"/"+id);
  }

  // data operations
  $scope.getData = function (nocache) {
    if (!angular.isFunction($scope.opt.getDataFn)) return;
    nocache = nocache || false;
    $scope.currentPage = 1;
    $scope.doSort($scope.cols[0].map,true);
    $scope.pageChanged();
    if (nocache || angular.isUndefined($scope.rows))
      $scope.opt.getDataFn().then(function(res) {
        $scope.rows = $scope.filterRows = res.data;
      },function(res) {
        $scope.rows = [];
      });
  }

  $scope.getData();
}])
.controller('importCsvCtrl', ['$scope', '$modalInstance',"options", function ($scope,$modalInstance,options) {
  //console.log(options);
  $scope.opt = options.importFlds;	
  $scope.csv = options.csv;
  $scope.row2 = {};
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  }
  $scope.ok = function () {
    var res ='ok press';
    $modalInstance.close($scope.row2);
  }
  $scope.fileChanged = function() {
    var reader = new FileReader();

    // A handler for the load event (just defining it, not executing it right now)
    reader.onload = function(e) {
      $scope.$apply(function() {
          $scope.row2.csvFile = reader.result;
      });
    };

    // get <input> element and the selected file
    var csvFileInput = document.getElementById('fileInput');
    var csvFile = csvFileInput.files[0];
    // use reader to read the selected file
    // when read operation is successfully finished the load event is triggered
    // and handled by our reader.onload function
    reader.readAsText(csvFile);
  };
}])
// --------------- testing
.directive('abTest', [function () {
  return {
    restrict: 'AE',
    scope: {
    },
    transclude: true,
    // replace: true,
    controller: 'abTestCtrl',
    template: '<div>in abTest before |<div ng-transclude></div>| after</div>',
    link: function (scope, iElement, iAttrs) {
    }
  };
}])
.controller('abTestCtrl', ['$scope', '$filter', 'iAPI', function ($scope,$filter,iAPI) {
}]);