angular.module('abAPP.controllers', [])

// we can place global here, RootCtrl is parent controller of every controllers
// beware of name conflict
.controller('RootCtrl', ['$scope', 'iAPI','abAPI', '$interval','$location', '$filter', 'flowFactory', '$timeout', '$route', '$modal'
  , function ($scope,iAPI,abAPI,$interval,$location,$filter,flowFactory,$timeout,$route,$modal) {
  console.log('RootCtrl');  
  
  $scope.ABuser = iAPI.ABuser;  
  $scope.menu   = iAPI.getConf('menu');  
  
  console.log('RootCtrl ABuser' ,$scope.ABuser   );


  
  //$scope.menu = iAPI.config.menu;
  //console.log('RootCtrl menu' ,$scope.menu  );
    
  //delete iAPI.config.menu;  
  //delete $scope.menu;
  
  
  $scope.bgColors = [ "navy", "light-blue", "aqua", "red", "green", "yellow", "purple", "blue", "maroon"];

  // $scope.MODEL = iAPI.MODEL;
  $scope.MODEL = {};
  $scope.MODEL['test'] = '134';
  iAPI.initProduct($scope.MODEL,true,$scope);
  

  $scope.$route = $route;
  $scope.getPageTitle = function() { return iAPI.getConf('pageTitle'); }
  $scope.getPageCaption = function() { return iAPI.getConf('pageCaption'); }

  $scope.itemPerPage = 11;
  $scope.innerHeight = 160;
  
  var d_date = new Date();
  $scope.getFullYear = d_date.getFullYear() ;
  $scope.getFullYearTH = d_date.getFullYear()+543 ;
  $scope.getYear = (d_date.getFullYear()+"").substring(2,4);
  $scope.getYearTH = ((d_date.getFullYear()+543)+"").substring(2,4);
  $scope.getMonth = ("00"+(d_date.getMonth()+1)).substr(-2);
  $scope.getDate = ("00"+(d_date.getDate())).substr(-2);
  $scope.dNow = d_date.getFullYear()+"-"+$scope.getMonth+"-"+$scope.getDate;
  $scope.d_dNow = d_date;
  
  $scope.isSide = false;
  $scope.activeSide = function(isSide) {
    //$scope.isSide = !$scope.isSide;
    $scope.isSide = isSide;
    //alert($scope.isActive);
  }  
  
  $scope.getMonthTHname = [
  	{ monthName:"",monthTH:""},
  	{ monthName:"JANUARY",monthTH:"มกราคม"},
  	{ monthName:"FEBRUARY",monthTH:"กุมภาพันธ์"},
  	{ monthName:"MARCH",monthTH:"มีนาคม"},
  	{ monthName:"APRIL",monthTH:"เมษายน"},
  	{ monthName:"MAY",monthTH:"พฤษภาคม"},
  	{ monthName:"JUNE",monthTH:"มิถุนายน"},
  	{ monthName:"JULY",monthTH:"กรกฎาคม"},
  	{ monthName:"AUGUST",monthTH:"สิงหาคม"},
  	{ monthName:"SEPTEMBER",monthTH:"กันยายน"},
  	{ monthName:"OCTOBER",monthTH:"ตุลาคม"},
  	{ monthName:"NOVEMBER",monthTH:"พฤศจิกายน"},
  	{ monthName:"DECEMBER",monthTH:"ธันวาคม"},
  ]
  	
  	//for( i in iAPI.config.menu)
  $scope.show_menu_group = function (menu,group){
  	for( var i in menu){
  		if(menu[i].group==group) menu[i].hidden = false;
  		else  menu[i].hidden = true;
		
	}
	//console.log("menu",iAPI.config.menu);
  } 
	    		
	    		
  $scope.show_menu = function (menu,permission,chk_menu,chk_admin){
  	/*
  	if( chk_menu === null ){
		chk_menu={};	
		chk_menu.location_url = $location.url().replace("/", ""); 	
		chk_menu.chk_menu_url_true = false;
		chk_menu.chk_menu_once = false;
		chk_menu.get_menu_url = "";
	}
	*/
	
	var url = menu.url.replace('#','');	
	if( url == "signout") return;	
	
	if( url == "profile"){
		if(chk_menu.location_url==url) chk_menu.get_menu_url = url;
		return;	 
	}
	
	if(chk_admin){
		menu.hidden = false;
	}else if( permission.indexOf(url) == -1 ){
		menu.hidden = true;
	}else{
		menu.hidden = false;
		if( chk_menu.location_url == url ) chk_menu.chk_menu_url_true = true;
		if( !chk_menu.chk_menu_once ){
			//alert(url+" " +url.length +" " +  url.substring(url.length -5, url.length)  );		
			if( url.substring(url.length -5, url.length) != "_main"){
				chk_menu.get_menu_url = url ;
				chk_menu.chk_menu_once = true;
				//alert("2"+chk_menu.get_menu_url);
			}				
		}		
		
	}	
	
	if( !angular.isUndefined(menu.submenu) )		
		for( i in menu.submenu)
			$scope.show_menu(menu.submenu[i],permission,chk_menu,chk_admin); 
  }
  
  $scope.get_permission = function (menu,permission) { 
		if( menu.emp_role.indexOf("STAFF") != -1 )
    		permission.push( menu.url.replace("#", ""));
    	
		if( !angular.isUndefined(menu.submenu) )		
			for( i in menu.submenu)
				$scope.get_permission(menu.submenu[i],permission);     	
		    			
  	return permission;
  } 
  
  $scope.get_profile = function () {  	
 
 	console.log("$scope.ABuser.data",$scope.ABuser.data);
 	var permission = [];
 	
 	/*
    if( $scope.ABuser.data.emp_role == "ADMIN" ){
    		   	
    	for( i in iAPI.config.menu)
    		$scope.show_menu(iAPI.config.menu[i],permission,false,true);
    	 
    }else {
		 
		for( i in iAPI.config.menu)
		 	$scope.get_permission(iAPI.config.menu[i],permission);   
	
	    console.log('RootCtrl permission' ,permission );
	
	     
    	var chk_menu={};	
		chk_menu.location_url = $location.url().replace("/", ""); 	
		chk_menu.chk_menu_url_true = false;
		chk_menu.chk_menu_once = false;
		chk_menu.get_menu_url = "";
		
    	for( i in iAPI.config.menu){
    		
    		console.log('RootCtrl url' ,iAPI.config.menu[i].url );
    		    			
    			
			$scope.show_menu(iAPI.config.menu[i],permission,chk_menu);
			
		}
    		    	
    	console.log("chk_menu",chk_menu);
    	if(!chk_menu.chk_menu_url_true) $location.url(chk_menu.get_menu_url);
		
	}
	*/
	

   	$scope.menu = iAPI.config.menu;
	console.log('RootCtrl menu' ,$scope.menu  );
	    	    		    
	 
   	
  }	
  
  $scope.get_profile();
  
  
  $scope.location_url = function () {      
  
  	iAPI.chkUser();	
 
    var FRuser = JSON.parse(localStorage.FRuser);
  	var location_url = $location.url().replace("/", ""); 
  	FRuser.location_url = location_url;
    var json_FRuser = JSON.stringify(FRuser);
    localStorage.FRuser = json_FRuser; 	
  }	
  	
  $scope.tf1 = function (item,model) {
    console.log(item,model);
    return true;
  }
  
  //ทำเป็น treeview
  $scope.$on('onRepeatLastMenu', function(scope, element, attrs){
  	
     //work your magic     
     $(".sidebar .treeview").tree();
     //alert("555999");
     
     //$scope.menu[0].hidden = true;
     
     //ดูว่า login แล้ว ให้มันซ่อน จาก list user
     
  });
  
  $scope.toBR = function(text){ 
  	if( angular.isUndefined(text) ) return text;  	
  	var text1 = angular.copy(text);
  	var i = 0 ;
  	while ( text1.indexOf("\n") > -1 )  {
  		//alert(i + " " + text1.indexOf("\n") + " " + text1 );
    	text1 = text1.replace("\n", "<br>"); 
    	//alert(i + " " + text1.indexOf("\n") + " " + text1 );
   	 	i++;
	}
	//alert(i + " "+ text1 );
  	return text1;
  }
  $scope.printDiv = function(topic, divName, divName2) { 
    var printElement = document.getElementById(divName);  
    var printContents = printElement.innerHTML;
    var originalContents = document.body.innerHTML; 
    var pageHeight = printElement.offsetHeight;
 

    if(angular.isDefined(divName2)){ 
      printContents +=  document.getElementById(divName2).innerHTML;
      pageHeight += document.getElementById(divName2).offsetHeight;
    }
 
    var popupWin = window.open('', '_blank', 'width='+printElement.offsetWidth+',height='+pageHeight+',scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
    popupWin.window.focus();
    popupWin.document.write('<!DOCTYPE html><html><head>' +
        '<meta charset="utf-8">' +
        '<link rel="stylesheet" type="text/css" href="../common/css/bootstrap.min.css" />' +         
        '<link rel="stylesheet" type="text/css" href="./css/report.css" />' + 
        //'</head><body onload="window.print();window.close();">'+
        '</head><body>'+
        '<div class="reward-body">' + printContents + '</div></body></html>'
        );
    popupWin.document.close();

//'<link rel="stylesheet" type="text/css" href="./lib/ionic/css/ionic.css" />' +
//'<link rel="stylesheet" type="text/css" href="./css/style.css" />' +
//'<link rel="stylesheet" type="text/css" href="./lib/bootstrap/css/bootstrap.css" />' +
    return true;
  } 

  $scope.minDate =  new Date();
  $scope.convertDate =  function(d_date) {
   	 return d_date.substring(6,10)+"-"+d_date.substring(3,5)+"-"+d_date.substring(0,2);
  }
	  
  $scope.date1 = {
    opened : false, 
  }
  $scope.date2 = {
    opened : false, 
  } 
  $scope.date3 = {
    opened : false, 
  } 
  $scope.date4 = {
    opened : false, 
  } 
  $scope.openDate1 = function($event) {  
    $event.preventDefault();
    $event.stopPropagation();
    $scope.date1.opened = true; 
  };
  $scope.openDate2 = function($event) {  
    $event.preventDefault();
    $event.stopPropagation();
    $scope.date2.opened = true; 
  };
  $scope.openDate3 = function($event) {  
    $event.preventDefault();
    $event.stopPropagation();
    $scope.date3.opened = true; 
  };  
  $scope.openDate4 = function($event) {  
    $event.preventDefault();
    $event.stopPropagation();
    $scope.date4.opened = true; 
  };
  
  
  $scope.rowCol = function(row,col,index) {
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
  }  

  $scope.rowHdr = function(row,col) {
  	if( angular.isUndefined(col.hdr2) ){
  		if( col.hdr.substring(0,2) == "f_") return $filter('number')(row[col.hdr], 2);
  		return row[col.hdr] ;
	}  		
  	else { //console.log("xxxx",row) ; 
  		if( col.hdr2.substring(0,2) == "f_") return $filter('number')(row[col.hdr][col.hdr2], 2);
  		return row[col.hdr][col.hdr2];
  	}  		
  }  
 
  $scope.chkTextError = function (text1) {        
    for( i=0 ;i<text1.length;i++){
		var codeA = text1[i].charCodeAt();
		if( codeA == 160){		
			text1 = text1.replace(text1[i]," ");
			//alert("-"+codeA);
		}
	}
    return text1;
  }

  
    
  $scope.doc_print = function(opt) {
 
    var modalInstance = $modal.open({
      templateUrl: 'views/report/operation.printout.html',
      controller: 'Operation.PrintOut.Ctrl',
      size: 'lg',
      resolve: {
        options: function () {
          return opt;
        }
      }
    });
    modalInstance.result.then(function () {  		
	   	
    });
    
  };   
  
  
  
  $scope.confUofm = {};
  $scope.create_uofm = function(uofm_id) {
 	
  	var receive_uofm = [];
  	for( var i in $scope.MODEL.receive_uofm ){
		if( $scope.MODEL.receive_uofm[i].c_seq == uofm_id ){
			var data = {
				id:$scope.MODEL.receive_uofm[i].id,
				c_desc:$scope.MODEL.receive_uofm[i].c_desc,
				c_desc_show:$scope.MODEL.receive_uofm[i].c_desc, 
				c_name:$scope.MODEL.receive_uofm[i].c_desc,
				f_factor:$scope.MODEL.receive_uofm[i].f_factor,
				
			}			
			if(data.f_factor != 1){
				data.c_desc_show += "("+data.f_factor+receive_uofm[0].c_desc+")"; 
			}			
			receive_uofm.push( angular.copy(data) );	
			
			if( $scope.confUofm.receive_uofm_show == "" )
				$scope.confUofm.receive_uofm_show = data.c_desc_show ;
			else $scope.confUofm.receive_uofm_show += ","+data.c_desc_show ;
					
		}			
	}
	
	if( receive_uofm.length == 0 ){
	
		var main_uofm_id = 0 ;
		for( i in $scope.MODEL.receive_uofm ){ 
			if( $scope.MODEL.receive_uofm[i].id == uofm_id ){
				var main_uofm_id = $scope.MODEL.receive_uofm[i].c_seq;
				break;
			}
		}
		
		if(main_uofm_id != 0){
			//alert(main_uofm_id);	
			return $scope.create_uofm(main_uofm_id); 
		}
	}

	$scope.confUofm.receive_uofm = angular.copy(receive_uofm);
  	return angular.copy(receive_uofm);
  }

  
  $scope.confirmDelete = function(display,fn) {
    var options = { };
    
    
    if( !angular.isUndefined(display) ){
     	console.log("display",display);   	
    	if (angular.isFunction(display.setting))
      		display.setting();
    	
		if( !angular.isUndefined(display.modal_title ) )
    		options.confirmTitle = display.modal_title ; 
    	else options.confirmTitle = iAPI.config["pageTitle_org"] ; 
    	
    	if( !angular.isUndefined(display.message1 ) )
    		options.message1 = display.message1;
    		
    	if( !angular.isUndefined(display.confirmTitle ) )
    		options.confirmTitle = display.confirmTitle;
    		
    	if( !angular.isUndefined(display.message2 ) )
    		options.message2 = display.message2;   
    		   		
    	if( !angular.isUndefined(display.message3 ) )
    		options.message3 = display.message3;  
    		
    	if( !angular.isUndefined(display.isShowTextArea ) )
    		options.isShowTextArea = display.isShowTextArea;      	
  		    		
	}    	
    else options.confirmTitle = iAPI.config["pageTitle_org"] ;  	
    
   
    var modalInstance = $modal.open({
      templateUrl: '../common/views/tpl.ab-confirm.html',
      controller: 'Operation.Confirm.Ctrl',
      size: 'lg',
      resolve: {
        options: function () {
          return options ;
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
  
  $scope.exportFileCSV1 = function(rows,filename) {
        var processRow = function (row) {
            var finalVal = '';
            for (var j = 0; j < row.length; j++) {
                var innerValue = row[j] === null ? '' : row[j].toString();
                if (row[j] instanceof Date) {
                    innerValue = row[j].toLocaleString();
                };
                var result = innerValue.replace(/"/g, '""');
                if (result.search(/("|,|\n)/g) >= 0)
                    result = '"' + result + '"';
                if (j > 0)
                    finalVal += ',';
                finalVal += result;
            }
            return finalVal + '\n';
        };

        var csvFile = '';
        for (var i = 0; i < rows.length; i++) {
            csvFile += processRow(rows[i]);
        }

        var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
        if (navigator.msSaveBlob) { // IE 10+
            navigator.msSaveBlob(blob, filename);
        } else {
            var link = document.createElement("a");
            if (link.download !== undefined) { // feature detection
                // Browsers that support HTML5 download attribute
                var url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", filename);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
    }
    
    
  $scope.exportFileCSV = function(filterRows,fileName) {
  	  	
    console.log("exportFileCSV",filterRows);
    var tmp,csv,line;
    csv = '';
    line = '';

    // header row
    var count=0;
    
    angular.forEach(filterRows[0], function(v2,k2) {
      count++;
      //console.log( "length "  + count , Object.keys(filterRows[0]).length)  ;
      if(count!=Object.keys(filterRows[0]).length){
      	line += '"' + k2.replace(/"/g, '""') + '",';
        //console.log(k2);
	  }      
    })
    csv += line + '\r\n';
	//console.log(csv);
    // data rows
    angular.forEach(filterRows, function(v1,k1) {
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
	console.log("exportFileCSV",csv);
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    //hiddenElement.href = 'data:attachment/csv;charset=utf-8,' + encodeURI(csv);
    //hiddenElement.href = 'data:attachment/csv;charset=tis-620,' + encodeURI(csv);
    //hiddenElement.href = 'data:attachment/csv;charset=windows-874,' + encodeURI(csv);
    //hiddenElement.href = 'data:attachment/csv;charset=windows-874,' + encodeURI(csv);
    
    hiddenElement.target = '_blank';
    if( angular.isUndefined(fileName) ) hiddenElement.download = 'download-'+moment().format('YYYY-MM-DD HH:mm:ss')+'.csv';
    else hiddenElement.download = fileName ;
    
    hiddenElement.click();
  }   
      
  $scope.exportFileMember = function(row) {
  	    
  //console.log("row",row);
   	   	 
   var f0 = {
   	    "e_card" : "บัตร", 
   		"ExMemCus_code" : "รหัสบัตร", "ExMemCus_name" : "ชื่อบัตร",
   		"MemCus_fname" : "ชื่อ", "MemCus_lname" : "นามสกุล", "MemCus_birthdate" : "วันเกิด",
   		"MemCus_citizenid" : "รหัสบัตรประชาชน","MemCus_Passport" : "Passport",
   		"MemCus_address" : "ที่อยู่","MemCus_district" : "ตำบล","MemCus_city" : "อำเภอ",
   		"MemCus_state" : "จังหวัด","MemCus_zip" : "รหัสไปรษณีย์",
   		"MemCus_mobilephone" : "เบอร์มือถือ","MemCus_hmphone" : "เบอร์บ้าน",
   		"MemCus_gender" : "เพศ",
   		"c_pic" : "รูปภาพ",  
   		 
   		 		
   } 	
   if(  angular.isDefined(row["e_card"]) ){
   	 if(row["e_card"]=="WildCard") row["e_card"] = "บัตรเสริม" ;
   	 else row["e_card"] = "บัตรหลัก" ;   	 
   }
   if(  angular.isDefined(row["MemCus_gender"]) ){
   	 if(row["MemCus_gender"]=="1") row["MemCus_gender"] = "ชาย" ;
   	 else row["MemCus_gender"] = "หญิง" ;   	 
   }
   if(  angular.isDefined(row["MemCus_birthdate"]) ){
   	 if(row["MemCus_birthdate"]=="0000-00-00") row["MemCus_birthdate"] = "" ;
   }  
   
   var filterRow = {};   	 
   for( var i in f0 ){
       if( angular.isDefined(row[i]) ){
       	 var col = f0[i];      	 
       	 var tmp = row[i].replace("\r\n", " ")+" ";
       	 //col = windows874.encode(col) ;
       	 //tmp = windows874.decode(tmp) ;
       	 filterRow[col] = tmp; 	   	
	   }
   }  	   	 
   filterRow["index"] = 1 ;
      
   console.log(filterRow);
   var filterRows = [];
   filterRows.push(filterRow); 
   $scope.exportFileCSV(filterRows,"Print-"+moment().format('YYYY-MM-DD HH:mm:ss')+'.csv');
     
    
  }
  
    
}])

  
////////////////////////////////////////////////////////////////////////////////////////////// 

.controller('Operation.PrintOut.Ctrl', function ($scope,$modalInstance,$modal,iAPI,options,$window) {
  $scope.content_height=$window.innerHeight - 130;
  console.log("PrintOut options",options);
  
  
  $scope.getUrl = function () {  
  
    var report_output = options["report_output"];
    delete options["report_output"];
    
    var url = "";
    if( angular.isDefined(options["report_url"]) ){
		url = options["report_url"];
	}else{
	     var url = iAPI.conf.baseUrl+"report.get_report";
	     if( report_output == "excel" )
	     	url = iAPI.conf.baseUrl+"report.get_report_excel";
	     else if( report_output == "csv" )
	     	url = iAPI.conf.baseUrl+"report.get_report_csv";
	     
      
	  	for( key in options )
	  		url += "/"+key+"/"+options[key];		
	}
    //alert(report_output);  


  	
  	console.log("PrintOut url",url);
  	//alert(url);
  	$scope.url_report_show = url; 
  	$scope.url_report = url;
  
  };
  $scope.getUrl();   
   
  $scope.close = function () {  	
    $modalInstance.close();
  };
   
  
})
.controller('Operation.Confirm.Ctrl', function ($scope,$modalInstance,options) {
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

.controller('SignoutCtrl', ['$scope','APPconf', function ($scope,APPconf) {
  // delete localStorage and redirect to /
  //localStorage.ABuser = "";
  //window.location.href =APPconf.homeUrl;
  localStorage.removeItem("FRuser");
  //localStorage.removeItem("ASuser");
  window.location.href ="login.html";
}])

.controller('DashboardCtrl', ['$scope', 'iAPI', '$modal', function ($scope,iAPI,$modal) {
  console.log('DashboardCtrl');
  iAPI.setPageTitle('dashboard');

  // check if 'no shop' open modal to setup shop cannot dismiss
  iAPI.get('shop').success(function(res){
    $scope.MODEL.company = res;
    //$scope.openModal(!$scope.MODEL.company.id);
  })

  $scope.openModal = function (newShop) {
    $scope.opt = { MODEL: $scope.MODEL };
    var modalInstance = $modal.open({
      templateUrl: 'views/company.new.html',
      controller: 'Company.new.Ctrl',
      backdrop: (newShop ? 'static' : true),
      keyboard: false,
      size: 'lg',
      resolve: {
        options: function () {
          return $scope.opt;
        }
      }
    });
    modalInstance.result.then(function (item) {
    });
  }

  $scope.go = function (url) {
    console.log(iAPI.config.menu);
  }

}])


 
   