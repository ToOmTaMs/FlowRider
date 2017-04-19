angular.module('abAPP.directives', ['ui.bootstrap'])
.filter('unique', function() {
  return function(input, key) {
    var unique = {};
    var uniqueList = [];
    for(var i = 0; i < input.length; i++){
      if(typeof unique[input[i][key]] == "undefined"){
          unique[input[i][key]] = "";
          uniqueList.push(input[i]);
      }
    }
    return uniqueList;
  };
})
.filter('numberToDate', function () {
    return function (value) {
      var result;

      if(value < 0) {
        result = moment().subtract(value*-1, 'days');
      }
      else {
        result = moment().add(value, 'days');
      }
      //console.log(">>>>> "+ value + "  " + result);
        return result.format('l');
    };
})
.directive('abFormFld', [function () {
  return {
    restrict: 'E',
    scope: {
      cols: '=',
      row: '=',
    },
    replace: 'true',
    controller: 'abFormFldCtrl',
    templateUrl: '../common/views/tpl.ab-form-fld.html',
    link: function (scope, iElement, iAttrs) {
    }
  };
}])
.controller('abFormFldCtrl', ['$scope', '$filter', 'iAPI', '$modal', '$window', function ($scope,$filter,iAPI,$modal,$window) {
 
  
  
}])	
.directive('abTable3', [function () {
  return {
    restrict: 'E',
    scope: {
      opt: '=options',
      rows: '=rows',
      row: '=',
      refashFn: '=refashfn',
      setRefashFn: '&', 
      saveFn: '=savefn',
      setSaveFn: '&',
      delFn: '=delfn',
      setDelFn: '&',   
      updFn: '=updfn',
      setUpdFn: '&',   
      chgPageFn: '=chgpagefn',
      setChgPageFn: '&',   
      chgModeFn: '=chgmodefn',
      setChgModeFn: '&'
      
            
    },
    transclude: 'true',
    replace: 'true',
    controller: 'abTable3Ctrl',
    templateUrl: '../common/views/tpl.ab-table-3.html',
    link: function (scope, iElement, iAttrs , tabsCtrl) {
    	//console.log("link",scope);
		scope.refashFn = function() {
           //alert('getData');
           scope.row = {};
           //scope.chgMode('table');
           scope.getData();
        }		
		scope.setRefashFn({theRefashFn: scope.refashFn}); 
		
		scope.saveFn = function() {
           scope.saveRow();
        }
        scope.setSaveFn({theSaveFn: scope.saveFn}); 
        
        scope.delFn = function(fn) {
           //alert('delFn');	
           //console.log(fn);
           scope.confirmDelete(fn);
           
        }	
        scope.setDelFn({theDelFn: scope.delFn}); 
        
        scope.updFn = function(idx,row) {
           //alert(idx);
           //console.log("updFn",row);
           scope.updRow(idx,row);
        }
        scope.setUpdFn({theUpdFn: scope.updFn}); 
        
        scope.chgPageFn = function(mode) {
           scope.chgPageTitle(mode);           
        }	
        scope.setChgPageFn({theChgPageFn: scope.chgPageFn}); 
            
        scope.chgModeFn = function(mode) {
           scope.chgMode(mode);           
        }	
        scope.setChgModeFn({theChgModeFn: scope.chgModeFn});             
            
            
            
    }
  };
}])
/*
.run(['abAPIcore', function (abAPIcore,) {
	
	
}])*/
.controller('abTable3Ctrl', ['$scope', '$filter', 'iAPI', '$modal', '$window', function ($scope,$filter,iAPI,$modal,$window) {
  var defaultOpt = {
    classTable: 'table  table-condensed dataTable', // table-hover //table-striped 
    tableBg: 'bg-aqua',
    showPagination: true,
    itemPerPage: 100,
    showCheckbox: false,
    transcludeAtTop: false,
    allowOp: 'view',    // string comma separator [add,update,delete,view]
  }
  var defaultFilters = ['currency', 'date', 'json', 'lowercase', 'number', 'uppercase'];
  $scope.opt = angular.extend({}, defaultOpt, $scope.opt);
  defaultOpt.itemPerPage = $scope.opt.itemPerPage;

  $scope.content_height=$window.innerHeight - 230 ;   //225;
  if(defaultOpt.itemPerPage == 10) $scope.content_height=$window.innerHeight - 300 ;
  
  if( !angular.isUndefined($scope.opt.predicate) ) $scope.predicate = $scope.opt.predicate;
  if( !angular.isUndefined($scope.opt.reverse) ) $scope.reverse = $scope.opt.reverse;
  else $scope.reverse = true;	

  $scope.opt.displayOp = "";
  $scope.opt.q = '';
  $scope.opt.unClickSave = true;

  $scope.tabs = {};
  $scope.tabs.list = {};
  $scope.tabs.list.active = true;

  $scope.filterRowsIdx = 0;

	
  $scope.getPageTitleModal = function() { 
  	if(angular.isUndefined($scope.opt.display.modal_title) ) return "55";
  	return $scope.opt.display.modal_title + $scope.opt.displayOp;   
  }
  
  $scope.getPageTitle = function() { return iAPI.getConf('pageTitle'); }
  $scope.getPageCaption = function() { return iAPI.getConf('pageCaption'); }

  $scope.chgPageTitle = function (mode) {
  	
  	//alert( iAPI.config["pageTitle_table"] );
  	//alert(mode);
  	if(mode=="Add"){
  		var e_text_option = "";
  		if( !angular.isUndefined(iAPI.config["pageTitle_table"]))
  			if( iAPI.config["pageTitle_table"] != "") 
  				e_text_option = " > " + iAPI.config["pageTitle_table"] ;
  		
		iAPI.setPageTitle('x',iAPI.config["pageTitle_org"]+e_text_option + " > "+"เพิ่ม" + " " + iAPI.config["pageTitle_add_edit"],iAPI.config["pageCaption_org"]);
		$scope.opt.displayOp = " > "+"เพิ่ม";
	}  		
  	else if(mode=="Edit"){
  		var e_text_option = "";
  		if( !angular.isUndefined(iAPI.config["pageTitle_table"]))
  			if( iAPI.config["pageTitle_table"] != "") 
  				e_text_option = " > " + iAPI.config["pageTitle_table"] ;
  		
  		var e_text = " > ";
  		if( iAPI.config["pageTitle_edit"] == " ") e_text = "";
		iAPI.setPageTitle('x',iAPI.config["pageTitle_org"]+e_text_option + e_text + ( iAPI.config["pageTitle_edit"] || "แก้ไข" ) + " " + iAPI.config["pageTitle_add_edit"],iAPI.config["pageCaption_org"]);
		$scope.opt.displayOp = " > "+"แก้ไข";
	}  		
  	else if(mode=="form"){
  		//alert(iAPI.config["pageTitle_add_edit"]);
  		var e_text_option = "";
  		if( !angular.isUndefined(iAPI.config["pageTitle_table"]))
  			if( iAPI.config["pageTitle_table"] != "") 
  				e_text_option = " > " + iAPI.config["pageTitle_table"] ;
  		
  		var e_text = " > ";
  		if( iAPI.config["pageTitle_edit"] == " ") e_text = "";
		iAPI.setPageTitle('x',iAPI.config["pageTitle_org"]+e_text_option + e_text + ( iAPI.config["pageTitle_edit"] || "แก้ไข" ) + " " + iAPI.config["pageTitle_add_edit"],iAPI.config["pageCaption_org"]);
		$scope.opt.displayOp = " > "+"แก้ไข";	
	}  		
  	else if(mode=="table"){
  		var e_text_option = "";
  		if( !angular.isUndefined(iAPI.config["pageTitle_table"]))
  			if( iAPI.config["pageTitle_table"] != "") 
  				e_text_option = " > " + iAPI.config["pageTitle_table"] ;
		//console.log("iAPI.config",iAPI.config);
		iAPI.setPageTitle('x',iAPI.config["pageTitle_org"]+e_text_option,iAPI.config["pageCaption_org"]);
		$scope.opt.displayOp = "";	
	}  		
  	else {
		iAPI.setPageTitle('x',iAPI.config["pageTitle_org"],iAPI.config["pageCaption_org"]);
		$scope.opt.displayOp = "";	
	}
  		
  }  
  
  	
  // we do custom iFilter, filter only on screen data. Not the entire row/object
  $scope.iFilter = function(item) {
    //console.log("iFilter",item);
    if ($scope.opt.q =='') return true;
    
    //alert($scope.opt.q ); //debug search 
    
    for (var i =0, j =$scope.opt.cols.length, q = $scope.opt.q.toLowerCase(); i< j;i++) {
      //console.log("iFilter",item[$scope.opt.cols[i]['map']]);
      //console.log($scope.opt.cols[i]['map']);
      if( angular.isUndefined(item[$scope.opt.cols[i]['map']]) ) continue;
      if (item[$scope.opt.cols[i]['map']].toString().toLowerCase().indexOf(q) >=0) return true;
    } 
    return false;
  }
  
  $scope.iFilter_group = function(item) {
      
    if(angular.isUndefined($scope.opt.row_group))return true;       
    var q = $scope.opt.row_group[$scope.opt.filter_group[0]['map']];
    if( angular.isDefined($scope.opt.filter_group[0]['mapSelect']))
    	q = $scope.opt.row_group[$scope.opt.filter_group[0]['mapSelect']];
    if(q==''||q=='0')return true;
    //console.log("iFilter2 - 1 /////////////////// ","///////////////////////////");
    //console.log("iFilter2 - 1 row_group ",$scope.opt.row_group);
    //console.log("iFilter2 - 2 filter_group ",$scope.opt.filter_group);
    //console.log("iFilter2 - 3 q ",q);
    //console.log("iFilter2 - 4 item ",item);
    //console.log("iFilter2 - 4 map ",$scope.opt.filter_group[0]['map']);
    //console.log("iFilter2 - 4 map ",item[$scope.opt.filter_group[0]['map']]);
    //console.log("iFilter2 - 4 text ",item[$scope.opt.filter_group[0]['map']].toString().toLowerCase());
 
 	for( var i=0 ;i<$scope.opt.filter_group.length;i++){ 		 
 		q = $scope.opt.row_group[$scope.opt.filter_group[i]['map']] ;
 		if( angular.isDefined($scope.opt.filter_group[i]['mapSelect']))
    		q = $scope.opt.row_group[$scope.opt.filter_group[i]['mapSelect']] ;
    	q = q.toString().toLowerCase();	
 		var c = item[$scope.opt.filter_group[i]['map']].toString().toLowerCase();
 		//console.log("iFilter2 - 4 " + q , c  );
		if ( c == q) return true;
		
		if(angular.isDefined($scope.opt.filter_group[i]['map2'])){
			q = $scope.opt.row_group[$scope.opt.filter_group[i]['map2']];
			//console.log("iFilter2 - 4 " + $scope.opt.filter_group[i]['map2'] , q  );
			if( angular.isUndefined(q) ) return false;
			q = q.toString().toLowerCase();	
			if ( c == q) return true;
		}		
	}
        
    /*    
    for (var i =0, j =$scope.opt.filter_group.length, 
    	q = $scope.opt.row_group[$scope.opt.filter_group[i]['map']]; 
    	i< j;
    	i++) {
    	console.log("iFilter " + q + " " + i + " " + j , item[$scope.opt.filter_group[i]['map']].toString().toLowerCase()  + " " + item[$scope.opt.filter_group[i]['map']].toString().toLowerCase()  );
    	//if (item[$scope.opt.filter_group[i]['map']].toString().toLowerCase().indexOf(q) >=0) return true;
    	if (item[$scope.opt.filter_group[i]['map']].toString().toLowerCase() == q) return true;
    	
    } 
    */
    return false;
  }
 
  
    
  $scope.iFilter_group2 = function(item) {
      
    if(angular.isUndefined($scope.opt.row_group2))return true;       
    var q = $scope.opt.row_group2[$scope.opt.filter_group2[0]['map']];
    if( angular.isDefined($scope.opt.filter_group2[0]['mapSelect']))
    	q = $scope.opt.row_group2[$scope.opt.filter_group2[0]['mapSelect']];
    if(q==''||q=='0')return true; 
 
 	
  	for( var i=0 ;i<$scope.opt.filter_group2.length;i++){ 		 
  		q = $scope.opt.row_group2[$scope.opt.filter_group2[i]['map']];
  		if( angular.isDefined($scope.opt.filter_group2[i]['mapSelect']))
    		q = $scope.opt.row_group2[$scope.opt.filter_group2[i]['mapSelect']] ;
    	q = q.toString().toLowerCase();	 	
 		var c = item[$scope.opt.filter_group2[i]['map']].toString().toLowerCase();
 		//console.log("iFilter2 - q " + q , c  );
		if ( c == q) return true;
		
		if(angular.isDefined($scope.opt.filter_group2[i]['map2'])){
			q = $scope.opt.row_group2[$scope.opt.filter_group2[i]['map2']];
			if( angular.isUndefined(q) ) return false;
			q = q.toString().toLowerCase();	 
			if ( c == q) return true;
		}		
	}
	
	/*      
    for (var i =0, j =$scope.opt.filter_group2.length, 
    	q = $scope.opt.row_group2[$scope.opt.filter_group2[i]['map']]; i< j;i++) {
    	//if (item[$scope.opt.filter_group[i]['map']].toString().toLowerCase().indexOf(q) >=0) return true;
    	if (item[$scope.opt.filter_group2[i]['map']].toString().toLowerCase() == q) return true;
    } 
    */
    
    return false;
  }

  $scope.iFilter_fix1 = function(item) {
      if(angular.isUndefined($scope.opt.filter_fix1))return true; 
      var q = $scope.opt.filter_fix1.search;
      if(q==''||q=='0')return true; 
      //console.log("item",item);
      //alert(item[$scope.opt.filter_fix1.map]);
      if (item[$scope.opt.filter_fix1.map].toString().toLowerCase() == q) return true;      
  }

  $scope.iFilter_search1 = function(item) {
      if(angular.isUndefined($scope.opt.filter_search1))return true; 
      var q = $scope.opt.filter_search1.search;
      if(q=='')return true; 
      //console.log("item",item);
      //alert(item[$scope.opt.filter_search1.map]);
      //if (item[$scope.opt.filter_search1.map].toString().toLowerCase().indexOf(q) >=0) return true; 
      q = q.toString().toLowerCase();	
      var c = item[$scope.opt.filter_search1.map].toString().toLowerCase().substring(0,q.length);      
      //console.log("item-"+q + "=" + c,c);
      if ( c == q ) return true; 
      
  }
  $scope.iFilter_search2 = function(item) {
      if(angular.isUndefined($scope.opt.filter_search2))return true; 
      var q = $scope.opt.filter_search2.search;
      if(q=='')return true; 
      //console.log("item",item);
      //alert(item[$scope.opt.filter_search2.map]);
      //if (item[$scope.opt.filter_search2.map].toString().toLowerCase().indexOf(q) >=0) return true; 
      q = q.toString().toLowerCase();	
      var c = item[$scope.opt.filter_search2.map].toString().toLowerCase().substring(0,q.length);      
      //console.log("item-"+q + "=" + c,c);
      if ( c == q ) return true; 
  }  
  $scope.iFilter_search3 = function(item) {
      if(angular.isUndefined($scope.opt.filter_search3))return true; 
      var q = $scope.opt.filter_search3.search;
      if(q=='')return true; 
      //console.log("item",item);
      //alert(item[$scope.opt.filter_search3.map]);
      //var c = item[$scope.opt.filter_search3.map].toString().indexOf(q);
      q = q.toString().toLowerCase();	
      var c = item[$scope.opt.filter_search3.map].toString().toLowerCase().indexOf(q);      
      if ( c >= 0 ) return true; 
  }     
  $scope.iFilter_checkbox1 = function(item) {
      if(angular.isUndefined($scope.opt.checkbox1))return true; 
      var q = $scope.opt.checkbox1.trueValue;
      if( $scope.opt.checkbox1.check=="0" ) q = $scope.opt.checkbox1.falseValue;
      
      if(q=='')return true; 
      //console.log("item",item);
      //alert(item[$scope.opt.filter_search1.map]);
      //if (item[$scope.opt.filter_search1.map].toString().toLowerCase().indexOf(q) >=0) return true; 
      q = q.toString().toLowerCase();	
      var c = item[$scope.opt.checkbox1.map].toString().toLowerCase().substring(0,q.length);      
      //console.log("item-"+q + "=" + c,c);
      if ( c == q ) return true; 
      
  }
  
  var data1 = "data 1";
  var data2 = "data 2";
  $scope.test1 = function(newVal) {
 		alert("99");
        return data2;
   
  };
  
  $scope.date_month = {
    opened : false, 
  }
  $scope.date_start = {
    opened : false, 
  } 
  $scope.date_end = {
    opened : false, 
  }   
  $scope.openDateMonth = function($event) { 
    $event.preventDefault();
    $event.stopPropagation();
    $scope.date_month.opened = true; 
  };
  $scope.openDateStart = function($event) {  
    $event.preventDefault();
    $event.stopPropagation();
    $scope.date_start.opened = true; 
  };  
  $scope.openDateEnd = function($event) {  
    $event.preventDefault();
    $event.stopPropagation();
    $scope.date_end.opened = true; 
  }; 
  
  $scope.opt.date = {
		d_month : new Date(),
		month_change : function(getData) {
			var dNow = new Date();	
			if($scope.opt.date.d_month!=""&&$scope.opt.date.d_month!=null)
				dNow =  new Date($scope.opt.date.d_month);
			var now_month = dNow.getMonth()+1;
			var now_year = dNow.getFullYear();

			var daysInMonth = new Date(now_year, now_month, 0).getDate();	
			daysInMonth = ("00" +daysInMonth).substr(-2);
			now_month = ("00" + now_month).substr(-2);	 
	
			var dStart = now_year+"-"+ now_month +"-"+"01";
			var dEnd = now_year+"-"+ now_month +"-"+daysInMonth;
	
			$scope.opt.date.d_start = new Date(dStart);
			$scope.opt.date.d_end = new Date(dEnd);
			
			//alert("d_month");
			 
			if(!getData) return;
			 
			//alert("d_month2");
			 	
			$scope.row = {};
			$scope.getData(true);
				 
		},
		d_start : new Date(),
		d_end : new Date(),
		date_start_change : function() {		 
		    var dNow = new Date($scope.opt.date.d_start);	
		    //alert("d_start");		    
		    if( dNow != "Invalid Date"){
		    	 //alert("d_start");
				 $scope.row = {};
				 $scope.getData(true);	
			}
		},
		date_end_change : function() {
			var dNow = new Date($scope.opt.date.d_end);	
			//alert("d_end");		    
		    if( dNow != "Invalid Date"){
		    	 //alert("d_end");
				 $scope.row = {};
				 $scope.getData(true);	
			}
		},
		
	} ;
  $scope.opt.date.month_change(false);  
  
  
  
  $scope.rowCol = function(row,col,index) {
  	//console.log(col.map2,angular.isUndefined(col.map2));
  	//console.log("rowCol col",col);
    //console.log("rowCol format", angular.isUndefined(col.format));
 	if( !angular.isUndefined(col.format) ) {
		//alert(col.format + " " + index);
		//console.log("rowCol index--", index);
		if( col.format == "index") return index;
	} 

  	if( angular.isUndefined(col.map2) ){
  		if( col.map.substring(0,2) == "f_") return $filter('number')(row[col.map], 2);
  		return row[col.map] ;
	}  		
  	else { //console.log("xxxx",row) ; 
  		if( col.map2.substring(0,2) == "f_") return $filter('number')(row[col.map][col.map2], 2);
  		return row[col.map][col.map2];
  	} 
  	/*  			
  	if( angular.isUndefined(col.map2) )
  		return row[col.map] ;
  	else { //console.log("xxxx",row) ; 
  		
  		return row[col.map][col.map2];
  	}  	
  	*/	
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
  
  $scope.setClick = function (iclick){
  	//if( iclick == "rowBtn")
  	if( !angular.isUndefined($scope.opt[iclick]) )
  		$scope.opt[iclick].click = 1 ;  	 
  }  

  
  $scope.chgMode = function (mode,firstRow) {
  	$scope.opt.mode = mode;
  	$scope.opt.buTableClass = (mode =='table') ? 'primary' : '';
  	$scope.opt.buFormClass = (mode =='form') ? 'primary' : '';
    $scope.opt.itemPerPage = (mode =='form') ? 1 : defaultOpt.itemPerPage;
    if (mode =='table') {
      $scope.row = $scope.row || {}; 
      console.log("chgMode row table",$scope.row);
      console.log("chgMode filterRows",$scope.filterRows);
      var idx = iAPI.arrayObjectIndexOfbyKey($scope.filterRows,$scope.row,'id');
      //alert("idx"+idx);
      idx++;
      $scope.opt.currentPage = Math.ceil(idx / $scope.opt.itemPerPage) || 1;
      //alert($scope.opt.currentPage);
    }
    else {      
      $scope.opt.unClickSave = true;	
      firstRow = firstRow || false;
      if (firstRow) $scope.opt.currentPage = $scope.opt.firstRow + 1;
    }
    $scope.chgPageTitle(mode); 
    //alert("chgMode");
    $scope.pageChanged();
    
    if (angular.isFunction($scope.opt.chgMode)){
		$scope.opt.chgMode();
	}
    
  }
  
  $scope.pageChanged = function() {
   	//alert("pageChanged");
    $scope.opt.firstRow = ($scope.opt.currentPage - 1) * $scope.opt.itemPerPage;      
    $scope.opt.lastRow = $scope.opt.currentPage * $scope.opt.itemPerPage;
    
    //alert($scope.opt.firstRow + " " + $scope.opt.lastRow );
    if( angular.isUndefined($scope.filterRows) )
    	 $scope.row = {};
   	else $scope.row = angular.copy($scope.filterRows[$scope.opt.firstRow]) || {};
    
    //alert("row"+$scope.row);
    console.log("pageChanged1",$scope.row);

    //console.log("pageChanged2",$scope.row);
  };  
  
  $scope.butFn = function(fn,idx,row)  {
  	//alert("butFn");
  	//console.log("butFn",row);
  	if (angular.isFunction(fn))
  		fn(idx,row);
  	else if(fn == "delItemSelect"){
		$scope.delItemSelect(idx,row);
	}
	
  }


  $scope.colFn = function(col)  {
  	//alert("colFn");
  	console.log("colFn",col);
  	if (angular.isFunction(col.fn)){
  		//alert("colFn");
		if( angular.isDefined(col.filterRows) )
			col.fn(col.value,$scope.filterRows);
		else
			col.fn(col.value,$scope.rows);
	}else if (angular.isFunction(col.checkAllFn)){
  		//alert("colFn");
		if( angular.isDefined(col.filterRows) )
			col.checkAllFn(col.value,$scope.filterRows);
		else
			col.checkAllFn(col.value,$scope.rows);
	}
	
  }
  

  // data operations
  $scope.getData = function (nocache,rowTmp) {
  	//ngearb 2015-04-03
  	//alert("getData nocache="+ nocache );
  	//console.log("row_group",$scope.opt.row_group);
  	//console.log("options",$scope.opt);
  	$scope.opt.unClickSave = true;
  	
    nocache = nocache || false;
    if (1 || nocache || angular.isUndefined($scope.rows) || $scope.rows == null) {
      // $scope.opt.refreshIcon = 'ion ion-looping';    // ionicon >1.5 remove animate icon 
 	  //var data = $scope.opt.row_group; 
 	  
 	  if(angular.isFunction($scope.opt.beforeGet))
	  	$scope.opt.beforeGet();
	        
	        	  
 	  var data = [];
 	  var url = $scope.opt.dataAPI;
 	  
 	  if( !angular.isUndefined($scope.opt.getAPI) )
 	  	url = $scope.opt.getAPI;
 	  	
 	  if( !angular.isUndefined($scope.opt.getAPIdata) )
 	  	data = $scope.opt.getAPIdata;	
 	  	
 	  if( url == "" ) {
 	  	$scope.rows = $scope.filterRows = [];	
 	  	$scope.row = {};
	    $scope.chgMode('table');
	    $scope.opt.currentPage = 1;
	    
 	  	return ; 	  	
 	  }
 	  
 	  if( $scope.opt.allowOp.indexOf('month') > -1 
 	  		|| $scope.opt.allowOp.indexOf('mShow') > -1 
 	  	){
	 	  if( url.indexOf("/d_start") > -1)
	 	  	url = url.replace("/d_start", "/"+iAPI.GetDay($scope.opt.date.d_start) );
	 	  
	 	  if( url.indexOf("/d_end") > -1)
	 	  	url = url.replace("/d_end", "/"+iAPI.GetDay($scope.opt.date.d_end) );	  	
	  }else{
	  	url = url.replace("/d_start","");
	  	url = url.replace("/d_end","");
	  }
 	   	  	
 	  //alert(url);
 	   	  
      iAPI.get(url,data).then(function(res) {
      	console.log("getData " + url ,res);
   		
   		var res_data = [];
   		if( angular.isUndefined(res.data.mydata)) res_data = res.data;
   		else res_data = res.data.mydata;
   			
	  	if(res_data=='""'){
	    	$scope.rows = [];
	    	//alert("666");
	      		
	    }else{
			$scope.rows = $scope.filterRows = res_data;
		}	  			
   			
   	 
			 
	    if(angular.isFunction($scope.opt.afterGet))
	        $scope.opt.afterGet($scope.rows);
	    
	    //alert("555");
	    $scope.row = {};
	    $scope.chgMode('table');	    
	    
	    $scope.opt.currentPage = 1;
	        
	    if( !angular.isUndefined($scope.opt.predicate) ) { 
	      	$scope.reverse = false;	
	       	if( !angular.isUndefined($scope.opt.reverse) ) $scope.reverse = !$scope.opt.reverse;			         
			$scope.doSort($scope.opt.predicate);
				
	    }
	    else $scope.doSort($scope.opt.cols[0].map,true);
	        
	    //$scope.pageChanged();
	    // $scope.opt.refreshIcon = 'ion ion-loop';	
	   	
	   	//if( !angular.isUndefined(rowTmp) ){
	    //	alert("888");
		//	 $scope.row = rowTmp ;
		//	 $scope.chgMode('table');
		//} 
		 
	    if(angular.isFunction($scope.opt.afterGetMode))
	       $scope.opt.afterGetMode($scope.filterRows);	 
       
   		//alert("666");
      },function(res) {
        $scope.rows = [];
        // $scope.opt.refreshIcon = 'ion ion-loop';
      });
    }
    else {
      $scope.filterRows = $scope.rows;
      $scope.chgMode('table');
      $scope.opt.currentPage = 1;
      if( !angular.isUndefined($scope.opt.predicate) ) { 
	   	$scope.reverse = false;	
	    if( !angular.isUndefined($scope.opt.reverse) ) $scope.reverse = !$scope.opt.reverse;					
	    $scope.doSort($scope.opt.predicate);
	  }
      else $scope.doSort($scope.opt.cols[0].map,true); 
      //$scope.pageChanged();
       
    }
  }
  
  $scope.doSort = function (col,r) {
	if(  $scope.opt.noPedicate )return;
	
    $scope.predicate = col;
    r = r || !$scope.reverse;
    $scope.reverse = r;

    //$scope.reverse = false;
  }  
  $scope.dbClick = function (idx,row,setClick) { 
  
  	if( !angular.isUndefined($scope.opt.dbClick) ){
  		$scope.opt.dbClick(idx,row);
  	}
  
  }

  $scope.updRow = function (idx,row,setClick) { 
    
    //alert(idx);
    //console.log("updRow",row);
        	
        	
    //if (angular.isFunction($scope.opt.beforeUpdRow1))
  	//   $scope.opt.beforeUpdRow1();
    
    
    //alert(idx);
  	//use add function
  	if(idx==-1){
		if( !angular.isUndefined($scope.opt.addFn) ){
			//console.log("parentRow",$scope.opt.parentRow);
			$scope.opt.addFn($scope.opt.parentRow);
			return ;
		}else if( !angular.isUndefined($scope.opt.addFnForm) ){
			//console.log("parentRow",$scope.opt.parentRow);
			$scope.opt.addFnForm($scope.opt.parentRow); 
		}	
	}else if( !angular.isUndefined($scope.opt.selectRow) ){
  		$scope.opt.selectRow(idx,row,$scope.rows);
  	}
  	
  	//alert("ddd");
  	
  	if($scope.opt.allowOp.indexOf('view') == -1)return;
  	if($scope.opt.allowOp.indexOf('noView') != -1 && setClick != 'editBtn' && idx!=-1 )return;
  	
  	 
  	//alert(row.id);
  	//alert(idx);
  	if(idx==-1){
		 
		
	}else{
		
	}
    $scope.opt.currentPage = idx + 1;
  	$scope.chgMode('form');
  	//alert("updRow" + idx);
  	if(idx==-1)$scope.chgPageTitle("Add");
  	else if(idx==-2){
  	  $scope.row = row;	
	  if (angular.isFunction($scope.opt.beforeUpdRow))
	  	$scope.opt.beforeUpdRow($scope.row,setClick);		
	}else{
	  if (angular.isFunction($scope.opt.beforeUpdRow))
	  	$scope.opt.beforeUpdRow($scope.row,setClick);		
	}
  }
  
  $scope.saveRow = function() {
  	
  	$scope.opt.unClickSave = false;
  	//alert("saveRow1");
  	
  	console.log("start saveRow row",$scope.row);
    if (angular.isFunction($scope.opt.beforePost)){
		if (!$scope.opt.beforePost($scope.row)){ 
			$scope.opt.unClickSave = true;
			return;
			
		}
		console.log("after beforePost row",$scope.row);
		
		
	}
    	
    //alert("saveRow2");	
     
    var url = $scope.opt.dataAPI;
    if( !angular.isUndefined($scope.opt.saveAPI) ){
    	//alert($scope.opt.saveAPI);
		url = $scope.opt.saveAPI;
	}
 			
    if ($scope.row.id){
    	if( !angular.isUndefined($scope.opt.updateAPI) ){
    		//alert($scope.opt.updateAPI);
			url = $scope.opt.updateAPI;
		}
    	url += '/'+$scope.row.id;    	
    }
    
    console.log("saveRow url",url);
    console.log("saveRow data",$scope.row);
    iAPI.post(url,$scope.row).success(function(res) {
           
      if( angular.isDefined(res.mydata)) res = res.mydata;
      	
      iAPI.showMessage("Save ok");
      $scope.opt.unClickSave = true;
      
      if ($scope.row.id) {
      	
      	console.log("saveRow update",res);
      	if (angular.isFunction($scope.opt.afterPost))
        	$scope.opt.afterPost(res);
        	
        var idx = 0;
        //alert($scope.opt.map_id);
        if( angular.isDefined($scope.opt.map_id) ){			
        	idx = iAPI.arrayObjectIndexOfbyKey($scope.rows,$scope.row,$scope.opt.map_id);
        	//alert($scope.opt.map_id + " = " + idx);
		}
        else{ 	
        	idx = iAPI.arrayObjectIndexOfbyKey($scope.rows,$scope.row,'id');
		}
        
        
       
        
        
        angular.copy(res,$scope.rows[idx]);
       
        //console.log("update scope.row1",$scope.row);        
  		//alert("888");        
        angular.copy(res,$scope.row);        
        //console.log("update scope.row2",$scope.row);       	
 		//alert("888");

        //alert("saveRow - update " + idx);
        if ( !angular.isUndefined($scope.opt.afterPostRefresh) ){
			if( $scope.opt.afterPostRefresh ){
		        //alert("666");		
				$scope.getData(true,angular.copy(res)); 
				
				//$scope.row = angular.copy(res); 
				//console.log("ddddd",$scope.row );
			}else{
				alert("ddd");
				if( angular.isDefined(res.refresh) ){
					delete res.refresh ;
					if( angular.isDefined(res.error_message) ){
						alert(res.error_message);
						delete res.error_message;
					}
					$scope.getData(true,angular.copy(res)); 
				}else{
					$scope.chgMode('table');
				}
			}				
		}else{
			//alert("5555");
			
			if( angular.isDefined(res.refresh) ){
				delete res.refresh ;
				if( angular.isDefined(res.error_message) ){
					alert(res.error_message);
					delete res.error_message;
				}
				$scope.getData(true,angular.copy(res)); 
			}else{
				$scope.chgMode('table');
			}
				
		}
		        
        
      }
      else {
      	console.log("saveRow save",res);
      	if (angular.isFunction($scope.opt.afterPost))
        	$scope.opt.afterPost(res);
        console.log("saveRow rows",$scope.rows);	 
        //$scope.rows.push(res);
        //$scope.updRow(-1);
      
        //alert("saveRow - add " + idx);
        //$scope.chgMode('table');        
        $scope.getData();  
             
      }
      //$scope.pageChanged();
      //$scope.chgMode('table');

    });
  }
  
  $scope.saveRowAll = function() {
  	console.log("saveRowAll",$scope.rows);
  	if (angular.isFunction($scope.opt.saveAllFn)){
		$scope.opt.saveAllFn($scope.rows)
		return;
	}
  	/*
    if (angular.isFunction($scope.opt.beforePost))
      if (!$scope.opt.beforePost($scope.row)) return;
    var url = $scope.opt.dataAPI;
    if ($scope.row.id) url += '/'+$scope.row.id;
    iAPI.post(url,$scope.row).success(function(res) {
    	
      if( angular.isDefined(res.mydata)) res = res.mydata;
      
      	
      iAPI.showMessage("Save ok");
      
      if ($scope.row.id) {
      	console.log("saveRow update",res);
      	if (angular.isFunction($scope.opt.afterPost))
        	$scope.opt.afterPost(res);
        	
        var idx = iAPI.arrayObjectIndexOfbyKey($scope.rows,$scope.row,'id');
        angular.copy(res,$scope.rows[idx]);
        angular.copy(res,$scope.row);        
        	
        //console.log("update scope.row",$scope.row);
      }
      else {
      	console.log("saveRow save",res);
      	if (angular.isFunction($scope.opt.afterPost))
        	$scope.opt.afterPost(res);
        $scope.rows.push(res);
        $scope.updRow(-1);
      }
      //$scope.pageChanged();
      $scope.chgMode('table');
    });
    */
  }
  
  $scope.delItemSelect = function(idx,row) {
  	console.log("delItemSelect",idx);
  	console.log("delItemSelect",$scope.rows[idx]);
  	if( $scope.rows[idx]["chk_del"] == "1" ){
  		$scope.rows[idx]["chk_del"]="0";
  		//add class
  	}
  	else{
  		$scope.rows[idx]["chk_del"]="1";
  		//add class
  		
  	}
  	//console.log("delItemSelect",$scope.rows[idx]);
  	
  }
  
  $scope.delRow = function() {
  	//ngearb 2015-04-03
  	//alert("delRow");
 
   	console.log("start delRow",$scope.row);
    if (angular.isFunction($scope.opt.beforeDelete)){
		if (!$scope.opt.beforeDelete($scope.row)){ 
			return;
			
		}
		console.log("after delRow row",$scope.row);
		
	}
	
	     
    url = $scope.opt.dataAPI;
    if( !angular.isUndefined($scope.opt.deleteAPI) ){
    	//alert($scope.opt.updateAPI);
		url = $scope.opt.deleteAPI;
	}  		
	url = url+'/'+ $scope.row.id;	
      
    iAPI.delete(url,$scope.row).success(function(res) {
    	
      if (angular.isFunction($scope.opt.afterDelete))
      	$scope.opt.afterDelete($scope.row);          	
    	
      var i = iAPI.arrayObjectIndexOfbyKey($scope.rows,$scope.row,'id');
      if (i !=-1) $scope.rows.splice(i,1);
      // to reflect in form mode we need to update filterRows
      i = iAPI.arrayObjectIndexOfbyKey($scope.filterRows,$scope.row,'id');
      if (i !=-1) $scope.filterRows.splice(i,1);
      

      
      //ngearb 2015-04-03
      //$scope.pageChanged();
      $scope.isConfirmDelete = false;
      //$scope.chgMode('form');
      $scope.getData();
      //
      
    });
  }


  $scope.confirmDelete = function(fn) {
    $scope.options = { row :$scope.row
    	, id: $scope.row.id 
    	, message1 : 'Confirm Delete this Record : ' + ( $scope.row.c_name || $scope.row.c_desc )
    };
    console.log("display",$scope.opt.display);
    if( !angular.isUndefined($scope.opt.display) ){
    	
    	if (angular.isFunction($scope.opt.display.setting))
      		$scope.opt.display.setting();
    	
		if( !angular.isUndefined($scope.opt.display.modal_title ) )
    		$scope.options.confirmTitle = $scope.opt.display.modal_title ; 
    	else $scope.options.confirmTitle = iAPI.config["pageTitle_org"] ; 
    	
    	if( !angular.isUndefined($scope.opt.display.message1 ) )
    		$scope.options.message1 = $scope.opt.display.message1;
    		
    	if( !angular.isUndefined($scope.opt.display.confirmTitle ) )
    		$scope.options.confirmTitle = $scope.opt.display.confirmTitle;
    		
    	if( !angular.isUndefined($scope.opt.display.message2 ) )
    		$scope.options.message2 = $scope.opt.display.message2;   
    		   		
    	if( !angular.isUndefined($scope.opt.display.message3 ) )
    		$scope.options.message3 = $scope.opt.display.message3;  
    		
    	if( !angular.isUndefined($scope.opt.display.isShowTextArea ) )
    		$scope.options.isShowTextArea = $scope.opt.display.isShowTextArea;      	
  		
  		
    		
	}    	
    else $scope.options.confirmTitle = iAPI.config["pageTitle_org"] ;  	
    
   
    var modalInstance = $modal.open({
      templateUrl: '../common/views/tpl.ab-confirm.html',
      controller: 'Confirm.Ctrl',
      size: 'lg',
      resolve: {
        options: function () {
          return $scope.options ;
        }
      }
    });
    modalInstance.result.then(function (item) { 
    	//alert(item.confirm);
    	if(item.confirm)
    		 if (angular.isFunction(fn)){
    		 	//console.log("confirmDelete",item);
			 	fn(item);    
			 }
    		 		
    });
  }
  

   $scope.openImportCSVform = function() {
    $scope.modalInstance = $modal.open({
      templateUrl: '../common/views/tpl.ab-import-form.html',
      controller: 'importCsvCtrl',
      size: '',
      resolve: {
        tableName: function () {
          return 'tab_name';
        }
        ,Options: function () {
          return $scope.opt;
        }
      }
    });

    // res.csvFile - csv data one record per line
    $scope.modalInstance.result.then(function (row2) {
      iAPI.post($scope.opt.importAPI,row2).success(function(res) {
      	
      	if( angular.isDefined(res.mydata)) res = res.mydata;
      	
        console.log("modalInstance",res);
        $scope.getData(true);
      });
    }, function () {
      console.log('Modal dismissed at: ' + new Date());
    });
  }

  $scope.exportCSV = function() {
    console.log($scope.filterRows);
    var tmp,csv,line;
    csv = '';
    line = '';

    // header row
    var count=0;
    
    angular.forEach($scope.filterRows[0], function(v2,k2) {
      count++;
      //console.log( Object.keys($scope.filterRows[0]).length)  ;
      if(count!=Object.keys($scope.filterRows[0]).length){
	  	line += '"' + k2.replace(/"/g, '""') + '",';
        //console.log(k2);
	  }      
    })
    csv += line + '\r\n';
	//console.log(csv);
    // data rows
    angular.forEach($scope.filterRows, function(v1,k1) {
      line = '';
      count=0;
      angular.forEach(v1, function(v2,k2) {
      	count++;
      	if(count!=Object.keys(v1).length){
          //console.log(v2)
          if (null === v2) 
            line +=',';
          else
            line += '"' + v2.toString().replace(/"/g, '""') + '",';
          }
      })
      csv += line + '\r\n';
    });
	console.log(csv);
    var hiddenElement = document.createElement('a');
    //hiddenElement.href = 'data:attachment/csv;charset=utf-8,' + encodeURI(csv);
    hiddenElement.href = 'data:attachment/csv;charset=tis-620,' + encodeURI(csv);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'download-'+moment().format('YYYY-MM-DD HH:mm:ss')+'.csv';
    hiddenElement.click();
  }



  
      

  $scope.getData();
  //console.log('abTable3Ctrl->option',$scope.opt);
  
  
  
  
}])
.controller('Confirm.Ctrl', function ($scope,$modalInstance,options) {
  $scope.options = options;  
 
  $scope.isShowOK = true ;
  
  if(!angular.isUndefined($scope.options.isShowOK))  
  	$scope.isShowOK = $scope.options.isShowOK ;  
  	
  $scope.close = function (confirm) { 
    $scope.options.confirm = confirm ;
    //$scope.options.textmessage1 = $scope.textmessage1;
    //alert($scope.options.textmessage1);
    $modalInstance.close( $scope.options);
  };
})
