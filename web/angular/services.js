angular.module('abAPP.services', [])

// use iAPI to share any resource between controller

.factory('iAPI', ['abAPIcore','$http','APPconf','$filter','toaster','$location'
	, function (abAPIcore,$http,APPconf,$filter,toaster,$location) {
	var iAPI = new abAPIcore(APPconf);

	iAPI.flowOptions = {
		target: APPconf['imgHost'],
    // target: 'http://localhost/2014/9hosts/alpo/user-data/',
    permanentErrors: [404, 500, 501],
    maxChunkRetries: 1,
    singleFile: true,
    chunkRetryInterval: 5000,
    simultaneousUploads: 4,
    headers: {
    	token: ''	// will set after we got token from signin
   	  }
	}

	// expose some to outside world
	iAPI.config = APPconf;
	iAPI.toaster = toaster;

	iAPI.showError = function(msg) {
		iAPI.toaster.pop('error', 'Error:', msg , null, 'trustedHtml');
	}
	iAPI.showMessage = function(msg,msg2,msgType) {
		msgType = msgType || 'success';
		msg2 = msg2 || '';
		iAPI.toaster.pop(msgType, msg , msg2, null, 'trustedHtml');
	}

	// if we comment this fn out, it will use abAPI.fn()
	iAPI.fn = function (a) {
		console.log('in iAPI fn(): ' + a);
	}

	iAPI.setConf = function(v,s) { APPconf[v] = s; }
	iAPI.getConf = function(v) { return APPconf[v] || ''; }

    iAPI.setPageTitle = function (url,titlex,caption) {
      var m = APPconf['menu'];
      var n = $filter('filter')(m,{url:'#' + url});
      // if (0 === n.length) ; // search in submenu
      iAPI.setConf('pageTitle',titlex || n[0].title || url);
      iAPI.setConf('pageCaption',caption || n[0].caption || '');
  	}
  
    iAPI.setConfPageTitle = function (ConfPageTitle) {      
    
     
    	for(key in ConfPageTitle)
    		iAPI.setConf(key,ConfPageTitle[key]);
    		
        if( angular.isUndefined(APPconf['pageCaption_org']) )
        	iAPI.setConf("pageCaption_org",' ');
        else if( APPconf['pageCaption_org'] == '' )
        	iAPI.setConf("pageCaption_org",' ');
        
        //if( angular.isUndefined(APPconf['pageTitle_org']) )
        //	iAPI.setConf("pageTitle_org",' ');
        	
    	//if( angular.isUndefined(APPconf['pageTitle_org']) )
    	//	iAPI.setPageTitle('x',APPconf["pageTitle_org"],APPconf["pageCaption_org"] || ' ');
    }
    
    
	iAPI.fullImgUrl = function (name) {
		// name: host/<user-id>/<user-id>-<filename>
		return APPconf['imgHost'] + iAPI.ABuser.data.id + '/' + iAPI.ABuser.data.id + '-' +  name;
	}

	// -------- start rangy api
	/*
	iAPI.initProduct = function (listName) {
		iAPI.get('product.get_code/'+listName).success(function(data) {
		  	var row0 = [];
		  	row0["id"]=row0["item_group_id"]=0;
		  	row0["c_code"]="";row0["c_desc"]="All Group";
		  	data['item_group'].splice(0,0,row0);

			$scope.options.group  = data['item_group'];
			console.log("group item_group",$scope.options.group);
			$scope.options.row_group = $scope.options.group[0];
		});
	}
	*/
	iAPI.getMODEL = function (MODEL,name) {
		 
	}
	
	iAPI.initProduct = function (MODEL,force,scope) {
		force = force || false;
		if (force || !angular.isObject(MODEL['product'])) {
 	    	MODEL['product'] = [];
		}
	}

	// -------- end rangy api

  iAPI.chkUser = function () {
  	   var FRuser = localStorage.getItem('FRuser');
  	   if (FRuser == null || FRuser == "" || angular.isUndefined(FRuser) ){
  	     localStorage.removeItem("FRuser");
         window.location.href = iAPI.config.loginUrl; //"login.html";
       }	
  }

  iAPI.init = function () {
  
	   iAPI.chkUser();	
         
 	   if (! angular.isObject(iAPI.ABuser)){
			//iAPI.ABuser = angular.fromJson(localStorage.FRuser);
			var FRuser = JSON.parse(localStorage.FRuser);
			//iAPI.ABuser = JSON.parse(localStorage.FRuser);
			iAPI.ABuser = [];
			iAPI.ABuser.data = FRuser ;
			iAPI.ABuser.token = FRuser.token
	   }	
	   
	   $http.defaults.headers.common['token'] = iAPI.ABuser.token;
	   iAPI.flowOptions.headers.token = iAPI.ABuser.token;
	   
	   console.log("FRuser",iAPI.ABuser);    
		      
      /* 
	  if (! angular.isObject(iAPI.ABuser)) {	 
	  	if (localStorage.ABuser !='') {
		    iAPI.ABuser = angular.fromJson(localStorage.ABuser);
		    if( iAPI.ABuser == null || iAPI.ABuser == "" ){ 
		    	localStorage.ABuser = "";
      			window.location.href =iAPI.config.homeUrl;
      		}
	        iAPI.ABuser.data = angular.fromJson(iAPI.ABuser.user_data);
	  	}
	  }	 
	  if (angular.isObject(iAPI.ABuser)) {
	  	  if( iAPI.ABuser.token == null || iAPI.ABuser.token == "" ){ 
		    	localStorage.ABuser = "";
      			window.location.href =iAPI.config.homeUrl;
      		}
      		
		  $http.defaults.headers.common['token'] = iAPI.ABuser.token;
		  iAPI.flowOptions.headers.token = iAPI.ABuser.token;
		}
	  */	
	 
  }
  iAPI.init();

  iAPI.report = function () {
  	
  	
  	
  }
  	
  	
  	
  iAPI.MoneyToWord = function(money) {
    var result = '';
    var minus = '';

    if (money < 0) {
        minus = 'ติดลบ';
        money = money * -1;
    }

    money = parseFloat(Math.round(money * 100) / 100).toFixed(2);

    if (money == '0.00') {
        result = 'ศูนย์บาทถ้วน';
        return result;
    }

    var numbers = ['', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า'];
    var positions = ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน'];

    var digit = money.length;
    var inputs = [];

    if (digit <= 15) {
        if (digit > 9) {
            inputs[0] = money.substr(0, digit - 9);
            inputs[1] = money.substr(inputs[0].length, 6);
        } else {
            inputs[0] = '00';
            inputs[1] = money.substr(0, money.length - 3);
        }
        inputs[2] = money.substr(money.indexOf('.') + 1, 2);
    } else {
        result = 'Error: ไม่สามารถรองรับจำนวนเงินที่เกินหลักแสนล้าน';
        return result;
    }

    for (i = 0; i < 3; i ++) {
        var input = inputs[i];

        if (input != '0' && input != '00') {
            var digit = input.length;

            for (j = 0; j < digit; j ++) {
                var s = input.substr(j, 1);
                var number = numbers[s];
                var position = '';

                if (number != '') {
                    position = positions[digit - (j + 1)];
                }

                if ((digit - j) == 2) {
                    if (s == '1') {
                        number = '';
                    } else if (s == '2') {
                        number = 'ยี่';
                    }
                } else if ((digit - j) == 1 && (digit != 1)) {
                    var pre_s = '0';
                    if (j > 0) {
                        pre_s = input.substr(j - 1, 1);
                    }

                    if (i == 0) {
                        if (pre_s != '0') {
                            if (s == '1') {
                                number = 'เอ็ด';
                            }
                        }
                    } else {
                        if (s == '1') {
                            number = 'เอ็ด';
                        }
                    }
                }

                result = result + number + position;
            }
        }

        if (i == 0) {
            if (input != '00') {
                result = result + 'ล้าน';
            }
        } else if (i == 1) {
            if (input != '0' && input != '00') {
                result = result + 'บาท';
                if (inputs[2] == '00') {
                    result = result + 'ถ้วน';
                }
            }
        } else {
            if (input != '00') {
                result = result + 'สตางค์';
            }
        }
    }

    return minus + result;
  }

  iAPI.strPad = function (i,l,s){
	var o = i.toString();
	if (!s) { s = '0'; }
	while (o.length < l) {
		o = s + o;
	}
	return o;
  };

  iAPI.round = function (num){
  	 return +(Math.round(num + "e+2")  + "e-2"); 
  };
  iAPI.tofix = function (num){
  	var num_temp = 0;
	if(num != '' && typeof num == 'string') {
		num_temp = (parseFloat(num.replace(/,/g,"")));
	}
	else {
		num_temp = num;
	}	 
	return iAPI.round(num);
	//return (parseFloat(num_temp).toFixed(2));	
  };
  iAPI.addCommas = function (nStr) {
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
  };

  iAPI.addCommas00 = function (nStr) {
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '.00' ;
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
  };
  
  iAPI.GetDay =  function(strDate){
  	var sdate = new Date();	
	
	if(strDate!=""&&strDate!=null){
		sdate =  new Date(strDate);
	}

	mkDay=sdate.getDate() ;
	mkYear=sdate.getFullYear(); 
	mkMonth=sdate.getMonth()+1;   

    mkDay=new String(mkDay);  	
    mkMonth=new String(mkMonth);  
	
	mkMonth = ("00" + mkMonth).substr(-2);	 
	mkDay = ("00" + mkDay).substr(-2);	
	
	return mkYear+"-"+mkMonth+"-"+mkDay; 	
		
  }

  iAPI.AddDay =  function(strDate,intNum){
	var sdate = new Date();		
	if(strDate!=""&&strDate!=null){
		sdate =  new Date(strDate);
	}

	sdate.setDate(sdate.getDate()+parseInt(intNum));
	mkDay=sdate.getDate() ;
	mkYear=sdate.getFullYear(); 
	mkMonth=sdate.getMonth()+1;  
	
    mkDay=new String(mkDay);  	
    mkMonth=new String(mkMonth);  
	
	mkMonth = ("00" + mkMonth).substr(-2);	 
	mkDay = ("00" + mkDay).substr(-2);	 	
	
	return mkYear+"-"+mkMonth+"-"+mkDay; // แสดงผลลัพธ์ในรูปแบบ ปี/เดือน/วัน 	
  }

  iAPI.AddYear =  function(strDate,intNum){
	// Addyear function (format YYYY-MM-DD)	
 	var sdate = new Date();		
	if(strDate!=""&&strDate!=null){
		sdate =  new Date(strDate);
	}
 
	sdate.setFullYear(sdate.getFullYear()+parseInt(intNum));	
	mkDay=sdate.getDate() ;
	mkYear=sdate.getFullYear(); 
	mkMonth=sdate.getMonth()+1;  
	
    mkDay=new String(mkDay);  	
    mkMonth=new String(mkMonth);  
	
	mkMonth = ("00" + mkMonth).substr(-2);	 
	mkDay = ("00" + mkDay).substr(-2);	 	
	
	return mkYear+"-"+mkMonth+"-"+mkDay; // แสดงผลลัพธ์ในรูปแบบ ปี/เดือน/วัน 
	
  }

  iAPI.AddMonth =  function(strDate,intNum){
	// AddMonth function (format YYYY-MM-DD)
	var sdate = new Date();		
	if(strDate!=""&&strDate!=null){
		sdate =  new Date(strDate);
	}

	sdate.setMonth(sdate.getMonth()+parseInt(intNum));	
	mkDay=sdate.getDate() ;
	mkYear=sdate.getFullYear(); 
	mkMonth=sdate.getMonth()+1;  
	
    mkDay=new String(mkDay);  	
    mkMonth=new String(mkMonth);  
	
	mkMonth = ("00" + mkMonth).substr(-2);	 
	mkDay = ("00" + mkDay).substr(-2);	 	
	
	return mkYear+"-"+mkMonth+"-"+mkDay; // แสดงผลลัพธ์ในรูปแบบ ปี/เดือน/วัน 
  }


  iAPI.iSelectDistinct =  function( dt, keyfield){
	var list =  [] ;
	var newTable = [] ;
	var couse_item = [] ;
	var list_count = 0 ;
	if( dt != null && dt.length > 0 ){
		for( row1 in dt){
 			var value1 = dt[row1][keyfield];
			var in_array = list.indexOf(value1);
			 
			if( list_count > 0 && in_array == -1 ){ 
				couse_item[value1] = 0 ;
				newTable[value1] = dt[row1] ;
				list.push(value1) ;					
				list_count++ ;				
			}else if(list_count ==0){  
				couse_item[value1] = 0 ;
				newTable[value1] = dt[row1] ;
				list.push(value1) ; 
				list_count++ ;				
			}			
			couse_item[value1]++;			
		}				
	}else{
		//newTable = {} ;
	}
	for(id in couse_item){
		newTable[id]["couse_item"] = couse_item[id];
	}		
	return newTable ;
  }



   iAPI.iSort =  function( result_array, key_sort){   
	 var iKey = [] ;
		 
	 if( result_array.length ==0)
	   return  result_array ;
			
	 for(var id in result_array) 
	 	iKey[id] = result_array[id][key_sort];	 
 	
 	 iKey.sort(function(a, b){return a-b});	
		
	 var result_sort = [] ;	 
	 for(var id1 in iKey) {
	 	for(var id2 in result_array) {
	 		if( iKey[id1] == result_array[id2][key_sort]){
				result_sort.push( result_array[id2] ) ; 
				delete result_array[id2];
				break;
			}
	 		
	 	} 
	 }	  		
		 
	 return result_sort ;
		
		
  }
  
  iAPI.iSort_desc =  function( result_array, key_sort){   
  	 var iKey = [] ;
		 
	 if( result_array.length ==0)
	   return  result_array ;
			
	 for(var id in result_array) 
	 	iKey[id] = result_array[id][key_sort];	 
 	
 	 iKey.sort(function(a, b){return b-a});
		
	 var result_sort = [] ;	 
	 for(var id1 in iKey) {
	 	for(var id2 in result_array) {
	 		if( iKey[id1] == result_array[id2][key_sort]){
				result_sort.push( result_array[id2] ) ; 
				delete result_array[id2];
				break;
			}
	 		
	 	} 
	 }	  		
		 
	 return result_sort ;
	 
  }
		 
	
	
  return iAPI;
}])

