angular.module('abAPP.exMember', [])
 
.controller('Member_list.Ctrl', ['$scope', 'iAPI', '$modal', function ($scope,iAPI,$modal) {
  var ConfPageTitle = { pageTitle_org : 'รายชื่อเปิดบัตรใหม่',
  	pageTitle_add_edit : 'รายชื่อเปิดบัตรใหม่',
  	pageCaption_org : '',
  	pageTitle_edit : '',
    pageTitle_table : '',
  };
  iAPI.setConfPageTitle(ConfPageTitle);
  $scope.location_url();
  
  	 
  $scope.options = {	
    allowOp: 'view',
    dataAPI: '',
    getAPI:'smart_card/exclusive_member_con/iView_Exclusive_member_customer_print/normal/Create/MainCard/Create', 
    transcludeAtTop: true,
    cols : [
      {label: 'ลำดับ', map: 'id', width:60, format:'index',align:'center',  },      
      {label: 'รหัสบัตร', map: 'ExMemCus_code' },
      {label: 'ชื่อบัตร', map: 'ExMemCus_name' },
      {label: 'สาขาที่ซื้อ', map: 'br_name' },
      {label: 'วันที่ซื้อบัตร', map: 'd_create_card' }, 
      {label: 'ลูกค้า', map: 'MemCus_Name' },
      {label: 'สาขาที่จัดส่ง', map: 'c_send' },
      {label: 'รูป', map: 'MemCus_Pic', type:"img", height:"90", width:"60",align:'center',  },
    ],
    editBtn : {
		icon:"fa-search",
	},
    addFnForm:function(row){  
			$scope.addItems(row);
		 },
	predicate:'d_create_card', 
    reverse:false,
    disabled:true,
    activateText:"พิมพ์รายละเอียด",
  }
  
  $scope.options.display = {};
  
    
  $scope.addItems = function(row) { 
     $scope.row={};
  }
  
  

  $scope.options.afterGet = function(rows){
  
  	//console.log("afterGet",rows);
  
  	angular.forEach(rows, function(v,k) {     
     	v.MemCus_Name = v.MemCus_pname+" "+v.MemCus_fname+" "+v.MemCus_lname;
     	if( v.no_pic == '1') v.MemCus_Pic = IMAGE_NO_PIC;
		else if( v.c_pic != "" ) v.MemCus_Pic = IMAGE_FOLDER+v.c_pic;			 
    })
     
    
/*
    var f0 = ["MemCus_DN","MemCus_Branch","MemCus_fname","MemCus_lname"
    ,"MemCus_address","MemCus_district","MemCus_city","MemCus_state","MemCus_zip"
    ,"MemCus_hmphone","MemCus_mobilephone","c_send","d_printcard" 
    ];
  	angular.forEach(rows, function(v,k) {
        
        var dtl = v.dtl;
        for( var i in dtl){
			for(var j in f0){
				if(angular.isDefined(dtl[i][f0[j]])) v[f0[j]] = dtl[i][f0[j]];
			}
			v.MemCus_Name = dtl[i].MemCus_pname+" "+dtl[i].MemCus_fname+" "+dtl[i].MemCus_lname;
			//v.MemCus_Pic = IMAGE_FOLDER+dtl[i].MemCus_Pic;
			v.MemCus_Pic = IMAGE_FOLDER+dtl[i].c_pic;
			break;
		}
    })
    */
    
    //console.log("rows",rows);
    
  }
  $scope.options.beforeUpdRow = function(row) { 
  	var row_hdr = angular.copy(row);
  	
  	$scope.row = {};
  	$scope.row.hdr = row_hdr;  
    
  }
  
  
  $scope.options.beforePost = function(row) { 
   
  
  	return true ;	
  }
  
  $scope.activate_action = function() {
  	
  	var row = angular.copy( $scope.row.hdr ); 
  	var hdr = { 
  		ExMemCus_hdr_id : row.ExMemCus_hdr_id,
  		UserNum : $scope.ABuser.data.UserNum ,
  		log_action : "Member_list",
	}
  	var dtl = [
  	  { 
  		ExMemCus_dtl_id : row.ExMemCus_dtl_id,
  		MemCus_id : row.MemCus_id,
  		e_action : "Print",
  		d_printcard : true,
  		NoSavePic : false,
	  }
	];
  	   	 
   	iAPI.post('smart_card/exclusive_member_con/iInsert_Exclusive_member_customer'
   		,{"hdr":hdr,"dtl":dtl}
   	).success(function(data) {
   	    console.log("iInsert_Exclusive_member_customer",data) ;
   	    //Refash
   	    //$scope.exportFileMember(row);  
    	 	   
   	    $scope.theRefashFn();
   	    
   	    var url_report = BASE_URL+BASE_API+'smart_card/exclusive_member_con/iCSV/'+row.ExMemCus_dtl_id;
  		$scope.url_report = url_report ;
  		console.log("download",url_report);
        
        //alert(url_report);
    })
    
    
  }

  $scope.setRefashFn = function(theRefashFn) {
      $scope.theRefashFn = theRefashFn;
  };      
 
  
  

    
}])
 
.controller('Member_wildcards.Ctrl', ['$scope', 'iAPI', '$modal', function ($scope,iAPI,$modal) {
  var ConfPageTitle = { pageTitle_org : 'รายชื่อพิมพ์บัตรเสริม',
  	pageTitle_add_edit : 'รายชื่อพิมพ์บัตรเสริม',
  	pageCaption_org : '',
  	pageTitle_edit : '',
    pageTitle_table : '',
  };
  iAPI.setConfPageTitle(ConfPageTitle);
  $scope.location_url(); 
  	 
  $scope.options = {	
    allowOp: 'view',
    dataAPI: '',
    getAPI:'smart_card/exclusive_member_con/iView_Exclusive_member_customer_print/normal/Create/WildCard/Create',
    saveAPI: 'user/users_con/iInsert_User_Group', 
    deleteAPI: 'user/users_con/iInsert_User_Group',
    transcludeAtTop: true,
    cols : [
      {label: 'No.', map: 'id', width:60, format:'index', },      
      {label: 'รหัสบัตร', map: 'ExMemCus_code' },
      {label: 'ชื่อบัตร', map: 'ExMemCus_name' },
      {label: 'สาขาที่ออก', map: 'br_name' },
      {label: 'วันที่ออกบัตร', map: 'd_create_card' },  
      {label: 'ลูกค้า', map: 'MemCus_Name' },
      {label: 'สาขาที่จัดส่ง', map: 'c_send' },
      {label: 'รูป', map: 'MemCus_Pic', type:"img", height:"90", width:"60", },
    ],
    editBtn : {
		icon:"fa-search",
	},
    addFnForm:function(row){  
			$scope.addItems(row);
		 },
	predicate:'d_create_card', 
    reverse:false,
    disabled:true,    
    activateText:"พิมพ์รายละเอียด",
  }
  
  $scope.options.display = {};
  
    
  $scope.addItems = function(row) { 
     $scope.row={};
  }
  
  

  $scope.options.afterGet = function(rows){
  	
  	var tmp_rows = angular.copy(rows);
  	$scope.rows = [];
  	
  	angular.forEach(tmp_rows, function(v,k) {     
     	v.MemCus_Name = v.MemCus_pname+" "+v.MemCus_fname+" "+v.MemCus_lname;
     	if( v.no_pic == '1') v.MemCus_Pic = IMAGE_NO_PIC;
		else if( v.c_pic != "" ) v.MemCus_Pic = IMAGE_FOLDER+v.c_pic;	
		 		
		if( v.i_send_br_id != 0 || v.c_send != "" ){
			$scope.rows.push(v);
		}			 
    })
      
  	
    
  }
  $scope.options.beforeUpdRow = function(row) { 
  	var row_hdr = angular.copy(row);
  	
  	$scope.row = {};
  	$scope.row.hdr = row_hdr;  
    
  }
  
  
  $scope.options.beforePost = function(row) { 
   
  
  	return true ;	
  }
  
  $scope.activate_action = function() {
  	
  	var row = $scope.row.hdr; 
  	var hdr = { 
  		ExMemCus_hdr_id : row.ExMemCus_hdr_id,
  		UserNum : $scope.ABuser.data.UserNum ,
  		log_action : "Member_wildcards",
	}
  	var dtl = [
  	  { 
  		ExMemCus_dtl_id : row.ExMemCus_dtl_id,
  		MemCus_id : row.MemCus_id,
  		e_action : "Print",
  		d_printcard : true,
  		NoSavePic : false,
	  }
	];
  	   	 
   	iAPI.post('smart_card/exclusive_member_con/iInsert_Exclusive_member_customer'
   		,{"hdr":hdr,"dtl":dtl}
   	).success(function(data) {
   	    console.log("iInsert_Exclusive_member_customer",data) ;
   	    //Refash
   	    var url_report = BASE_URL+BASE_API+'smart_card/exclusive_member_con/iCSV/'+row.ExMemCus_dtl_id;
  		$scope.url_report = url_report ;
  		console.log("download",url_report);
   	    //$scope.exportFileMember(row);  
   	    
   	    
   	    $scope.theRefashFn();
   	    
   	    
 
    })
    
    
  }

  $scope.setRefashFn = function(theRefashFn) {
      $scope.theRefashFn = theRefashFn;
  };  
      
 
 
 
  

    
}])

.controller('Member_joincards.Ctrl', ['$scope', 'iAPI', '$modal', function ($scope,iAPI,$modal) {
  var ConfPageTitle = { pageTitle_org : 'รายชื่อการ Join บัตร',
  	pageTitle_add_edit : 'รายชื่อการ Join บัตร',
  	pageCaption_org : '',
  	pageTitle_edit : '',
    pageTitle_table : '',
  };
  iAPI.setConfPageTitle(ConfPageTitle);
  $scope.location_url(); 
  	 
  $scope.options = {	
    allowOp: 'view',
    dataAPI: '',
    getAPI:'smart_card/exclusive_member_con/iView_Exclusive_member_customer_print/normal/Create/WildCard/Create',
    saveAPI: 'user/users_con/iInsert_User_Group', 
    deleteAPI: 'user/users_con/iInsert_User_Group',
    transcludeAtTop: true,
    cols : [
      {label: 'No.', map: 'id', width:60, format:'index', },      
      {label: 'รหัสบัตร', map: 'ExMemCus_code' },
      {label: 'ชื่อบัตร', map: 'ExMemCus_name' },
      {label: 'สาขาที่ออก', map: 'br_name' },
      {label: 'วันที่ออกบัตร', map: 'd_create_card' }, 
      {label: 'ผู้ซื้อ', map: 'MemCus_Name' },
      {label: 'รูป', map: 'MemCus_Pic', type:"img", height:"90", width:"60", },
    ],
    editBtn : {
		icon:" ",
		label:"Comfirm"
	},
    addFnForm:function(row){  
			$scope.addItems(row);
		 },
	predicate:'d_create_card', 
    reverse:false,
    disabled:true,
    activateText:"ยืนยัน",
  }
  
  $scope.options.display = {};
  
    
  $scope.addItems = function(row) { 
     $scope.row={};
  }
  
  

  $scope.options.afterGet = function(rows){
  	
  	var tmp_rows = angular.copy(rows);
  	$scope.rows = [];
  	
  	angular.forEach(tmp_rows, function(v,k) {     
     	v.MemCus_Name = v.MemCus_pname+" "+v.MemCus_fname+" "+v.MemCus_lname;
     	if( v.no_pic == '1') v.MemCus_Pic = IMAGE_NO_PIC;
		else if( v.c_pic != "" ) v.MemCus_Pic = IMAGE_FOLDER+v.c_pic;	
		 	
		 		
		if( v.i_send_br_id == 0 && v.c_send == "" ){
			$scope.rows.push(v);
		}			 
    })
        	
    
  }
  $scope.options.beforeUpdRow = function(row) { 
  	var row_hdr = angular.copy(row);
  	
  	$scope.row = {};
  	$scope.row.hdr = row_hdr;  
    
  }
  
  
  $scope.options.beforePost = function(row) { 
   
  
  	return true ;	
  }
  
  $scope.activate_action = function() {
  	
  	var row = $scope.row.hdr; 
  	var hdr = { 
  		ExMemCus_hdr_id : row.ExMemCus_hdr_id,
  		UserNum : $scope.ABuser.data.UserNum ,
  		log_action : "Member_joincards",
	}
  	var dtl = [
  	  { 
  		ExMemCus_dtl_id : row.ExMemCus_dtl_id,
  		MemCus_id : row.MemCus_id,
  		e_action : "Print",
  		d_printcard : true,
  		NoSavePic : false,
	  }
	];
  	   	 
   	iAPI.post('smart_card/exclusive_member_con/iInsert_Exclusive_member_customer'
   		,{"hdr":hdr,"dtl":dtl}
   	).success(function(data) {
   	    console.log("iInsert_Exclusive_member_customer",data) ;
   	    //Refash
   	    $scope.theRefashFn();
 
    })
    
    
  }

  $scope.setRefashFn = function(theRefashFn) {
      $scope.theRefashFn = theRefashFn;
  };  

      
 
 
 
  

    
}])

.controller('Member_verify.Ctrl', ['$scope', 'iAPI', '$modal', function ($scope,iAPI,$modal) {
  var ConfPageTitle = { pageTitle_org : 'การ Verify บัตร',
  	pageTitle_add_edit : 'การ Verify บัตร',
  	pageCaption_org : '',
  	pageTitle_edit : '',
    pageTitle_table : '',
  };
  iAPI.setConfPageTitle(ConfPageTitle);
  $scope.location_url(); 
  	 
  $scope.options = {	
    allowOp: 'view',
    dataAPI: '',
    getAPI:'smart_card/exclusive_member_con/iView_Exclusive_member_customer_print/normal/Create/-/Print',
    saveAPI: 'user/users_con/iInsert_User_Group', 
    deleteAPI: 'user/users_con/iInsert_User_Group',
    transcludeAtTop: true,
    cols : [
      {label: 'No.', map: 'id', width:60, format:'index', },  
      {label: 'รหัสบัตร', map: 'ExMemCus_code' },
      {label: 'ชื่อบัตร', map: 'ExMemCus_name' },
      {label: 'สาขาที่ซื้อ', map: 'br_name' },
      {label: 'วันที่ซื้อบัตร', map: 'd_create_card' }, 
      {label: 'วันที่ Verify', map: 'd_verify' },
      {label: 'ลูกค้า', map: 'MemCus_Name' },
      {label: 'รูป', map: 'MemCus_Pic', type:"img", height:"90", width:"60", },
    ],
    editBtn : {
		icon:"fa-search",
	},
    addFnForm:function(row){  
			$scope.addItems(row);
		 },
	predicate:'d_create_card', 
    reverse:false,
    disabled:true, 
    
  }
  
  $scope.options.display = {};
  $scope.options.uuidFocus = false;
    
  $scope.addItems = function(row) { 
     $scope.row={};
  }
  
  

  $scope.options.afterGet = function(rows){
  	
  	var tmp_rows = angular.copy(rows);
  	$scope.rows = [];
  	
  	angular.forEach(tmp_rows, function(v,k) {     
     	v.MemCus_Name = v.MemCus_pname+" "+v.MemCus_fname+" "+v.MemCus_lname;
		if( v.no_pic == '1') v.MemCus_Pic = IMAGE_NO_PIC;
		else if( v.c_pic != "" ) v.MemCus_Pic = IMAGE_FOLDER+v.c_pic;		
		//$scope.rows.push(v); 		
		if( v.i_send_br_id != 0 || v.c_send != "" ){
			 $scope.rows.push(v);
		}			 
    })
        	
    $scope.options.uuidFocus = false;
    
    
  }
  $scope.options.beforeUpdRow = function(row) { 
  	var row_hdr = angular.copy(row);
  	
  	$scope.row = {};
  	$scope.row.hdr = row_hdr;  
    
  }
  
  
  $scope.options.beforePost = function(row) { 
   
  
  	return true ;	
  }
  
  $scope.activate_action = function() {
  	
  	var row = $scope.row.hdr; 
  	var hdr = { 
  		ExMemCus_hdr_id : row.ExMemCus_hdr_id,
  		UserNum : $scope.ABuser.data.UserNum ,
  		log_action : "Member_verify",
  		
	}
  	var dtl = [
  	  { 
  		ExMemCus_dtl_id : row.ExMemCus_dtl_id,
  		MemCus_id : row.MemCus_id,
  		e_action : "Verify",
  		d_verify : true,
  		UUID : row.UUID,
  		NoSavePic : false,
	  }
	];
  	   	 
   	iAPI.post('smart_card/exclusive_member_con/iInsert_Exclusive_member_customer'
   		,{"hdr":hdr,"dtl":dtl}
   	).success(function(data) {
   	    console.log("iInsert_Exclusive_member_customer",data) ;
   	    //Refash
   	    $scope.theRefashFn();
 
    })
    
    
  }

  $scope.setRefashFn = function(theRefashFn) {
      $scope.theRefashFn = theRefashFn;
  };  

      
}])

.controller('Member_status.Ctrl', ['$scope', 'iAPI', '$modal', function ($scope,iAPI,$modal) {
  var ConfPageTitle = { pageTitle_org : 'สถานะบัตร',
  	pageTitle_add_edit : 'สถานะบัตร',
  	pageCaption_org : '',
  	pageTitle_edit : '',
    pageTitle_table : '',
  };
  iAPI.setConfPageTitle(ConfPageTitle);
  $scope.location_url(); 
  	 
  $scope.options = {	
    allowOp: 'view,group1',
    dataAPI: '',
    getAPI:'smart_card/exclusive_member_con/iView_Exclusive_member_customer_print/normal/Create/-/-', 
    transcludeAtTop: true,
    cols : [
      {label: 'No.', map: 'id', width:60, format:'index', },   
      {label: 'รหัสบัตร', map: 'ExMemCus_code' },
      {label: 'ชื่อบัตร', map: 'ExMemCus_name' },
      {label: 'สาขาที่ซื้อ', map: 'br_name' },
      {label: 'วันที่ซื้อบัตร', map: 'd_create_card' },
      {label: 'ลูกค้า', map: 'MemCus_Name' },
      {label: 'วันที่ Verify', map: 'd_verify' },      
      {label: 'วันที่พิมพ์', map: 'd_printcard' },
      {label: 'รูป', map: 'MemCus_Pic', type:"img", height:"90", width:"60", },
    ],
    editBtn : {
		icon:"fa-search",
	},
    addFnForm:function(row){  
			$scope.addItems(row);
		 },
	predicate:'d_create_card', 
    reverse:false,
    disabled:true,
    
    display : {
      groupLable : 'สถานะ',
      groupOrderby : ' ',
    },	 
    filter_group : [
    	{map: 'e_action_show' },
    ],
    group : [
    	{c_desc: 'บัตรที่ยังไม่ได้พิมพ์' , e_action_show: 'Create' },
    	{c_desc: 'บัตรที่มีการพิมพ์แล้ว' , e_action_show: 'Print' },
    	{c_desc: 'บัตรที่มีVerifyแล้ว' , e_action_show: 'Verify' },
    ],
    
    
  }
  $scope.options.row_group = $scope.options.group[0];	
  
	
  $scope.options.display = {};
  
    
  $scope.addItems = function(row) { 
     $scope.row={};
  }
  
  

  $scope.options.afterGet = function(rows){
  
  	angular.forEach(rows, function(v,k) {     
     	v.MemCus_Name = v.MemCus_pname+" "+v.MemCus_fname+" "+v.MemCus_lname;
		if( v.no_pic == '1') v.MemCus_Pic = IMAGE_NO_PIC;
		else if( v.c_pic != "" ) v.MemCus_Pic = IMAGE_FOLDER+v.c_pic;			
		if( v.e_action == "Create")
			v.e_action_show = "Create";
		else if( v.e_action == "Print") 
			v.e_action_show = "Print";   
		else v.e_action_show = "Verify";  
		
	})
  
   	console.log("afterGet",rows);    
    
  }
  $scope.options.beforeUpdRow = function(row) { 
  	var row_hdr = angular.copy(row);
  	
  	$scope.row = {};
  	$scope.row.hdr = row_hdr;  
    
  }
  
  
  $scope.options.beforePost = function(row) { 
   
  
  	return true ;	
  }
  
  $scope.activate_action = function() {
  	
  	var url_report = BASE_URL+BASE_API+'smart_card/exclusive_member_con/iCSV/'+$scope.row.hdr.ExMemCus_dtl_id;
  	$scope.url_report = url_report ;
  	console.log("download",url_report);
  	//var row = angular.copy( $scope.row.hdr ); 
    //$scope.exportFileMember(row);
    	
  }
  
  $scope.setRefashFn = function(theRefashFn) {
      $scope.theRefashFn = theRefashFn;
  };      
 
   
 
    
}])


.controller('Member_manage.Ctrl', ['$scope', 'iAPI', '$modal', function ($scope,iAPI,$modal) {
  var ConfPageTitle = { pageTitle_org : 'จัดการข้อมูลบัตร',
  	pageTitle_add_edit : 'จัดการข้อมูลบัตร',
  	pageCaption_org : '',
  	pageTitle_edit : '',
    pageTitle_table : '',
  };
  iAPI.setConfPageTitle(ConfPageTitle);
  $scope.location_url();
  
  	 
  $scope.options = {	
    allowOp: 'view',
    dataAPI: '',
    getAPI:'smart_card/exclusive_member_con/iSearch_with_ExCode_CityID', 
    transcludeAtTop: true,
    cols : [
      {label: 'No.', map: 'id', width:60, format:'index', },   
      {label: 'รหัสบัตร', map: 'ExMemCus_code' },
      {label: 'ชื่อบัตร', map: 'ExMemCus_name' },
      {label: 'สาขาที่ซื้อ', map: 'br_name' },
      {label: 'วันที่ซื้อบัตร', map: 'd_activate' },
      {label: 'เจ้าของบัตร', map: 'MainCard_Name' },
      {label: 'รหัสบัตรประชาชนเจ้าของ', map: 'MainCard_citizenid' },
      {label: 'ผู้ถือบัตรร่วม', map: 'WildCard_Name' },
      {label: 'รหัสบัตรประชาชนร่วม', map: 'WildCard_citizenid' },
      {label: 'รูป', map: 'MemCus_Pic', type:"img", height:"90", width:"60", },
    ],
    editBtn : {
		noShow:true,
	},
    noShowRow_header:true,
    noShowRow_group:true,
  }
  
  $scope.options.disabled = true;
  $scope.options.display = {};
  
  $scope.options.Member_manage = true;
  $scope.options.Member_manage_return = false;
	$scope.options.buttons = [
	  {label:' Delete', btn:'btn-danger', icon:'ion ion-close', type:'button', width:20, 
	   	fn:function(idx,row){        	
			 $scope.row_del(idx,row);
		   },
	  },  
	];     
  
  $scope.rows = [];

  $scope.options.beforeUpdRow = function(row) { 
  	var row_hdr = angular.copy(row);
  	
  	$scope.row = {};
  	$scope.row.hdr = row_hdr;  
     
    $scope.options.Member_manage_return = true;
  }
  
      
  $scope.get_member = function() { 
    	   	 
   	iAPI.post('smart_card/exclusive_member_con/iSearch_with_ExCode_CityID'
   		,{
   			"ExMemCus_code":$scope.options.ExMemCus_code,
   			"MemCus_citizenid":$scope.options.MemCus_citizenid,  
   			"UUID":$scope.options.UUID,  		
   		}
   	).success(function(data) {   	    
   	    if( angular.isDefined(data.mydata)) data = data.mydata;
   	    console.log("iSearch_with_ExCode_CityID",data) ;
   	    
   	    angular.forEach(data, function(v,k) {     
     		v.MainCard_Name = v.MainCard_pname+" "+v.MainCard_fname+" "+v.MainCard_lname;

			if( v.no_pic == '1') v.MemCus_Pic = IMAGE_NO_PIC;
		else if( v.c_pic != "" ) v.MemCus_Pic = IMAGE_FOLDER+v.c_pic;
			if(v.e_card=="MainCard"){
				v.option_hide = true;	
				v.WildCard_Name = "เจ้าของบัตร";	 
      			v.WildCard_citizenid = "";   							
			}
			else{
				v.option_hide = false;
     			v.WildCard_Name = v.MemCus_pname+" "+v.MemCus_fname+" "+v.MemCus_lname;
     			v.WildCard_citizenid = v.MemCus_citizenid;   	
			}
    	})
    
    
   	    $scope.rows = data;
 
    })
  
  }
 
  


  $scope.row_del_action = function() { 

	var indexOfRow = $scope.indexOfRow;	 
	  
  	var row_dtl = $scope.rows[indexOfRow];
  	var hdr = { 
  		ExMemCus_hdr_id : row_dtl.ExMemCus_hdr_id,
  		UserNum : $scope.ABuser.data.UserNum ,
  		log_action : "Member_manage",
  		
	}
  	var dtl = [
  	  { 
  		ExMemCus_dtl_id : row_dtl.ExMemCus_dtl_id,
  		MemCus_id : row_dtl.MemCus_id,
  		e_status_mem : "delete", 
	  }
	];
  	   	 
   	iAPI.post('smart_card/exclusive_member_con/iInsert_Exclusive_member_customer'
   		,{"hdr":hdr,"dtl":dtl}
   	).success(function(data) {
   	    console.log("iInsert_Exclusive_member_customer",data) ;
   	    //Refash
   	    //$scope.rows.splice(indexOfRow, 1); 
 		$scope.get_member();
    })
    
      	 
  }
  
    
  $scope.row_del = function(idx,row) { 
 
  	//ใช้ row ไปหา indexOf ห้ามใช้ idx เด็ดขาด
	var indexOfRow = $scope.rows.indexOf(row);	
	if(indexOfRow < 0 )indexOfRow = idx;
	$scope.indexOfRow = indexOfRow;
	
	var row_dtl = $scope.rows[indexOfRow];
	
	var display = {
		message1 : "ต้องการลบบัตร "+ row_dtl.ExMemCus_code + " ของ "+row_dtl.MemCus_Name,
	};
	$scope.confirmDelete(display,$scope.row_del_action);

  }
  

  $scope.get_return = function() {
  	
  	$scope.options.Member_manage_return = false;
	$scope.theChgModeFn('table');	
  }

  $scope.setChgModeFn = function(theChgModeFn) { 
      $scope.theChgModeFn = theChgModeFn;
  }; 
  

    
}])


.controller('Member_manage_old.Ctrl', ['$scope', 'iAPI', '$modal', function ($scope,iAPI,$modal) {
  
  iAPI.setPageTitle('','จัดการข้อมูลบัตร','');
  $scope.location_url(); 
  
  
  	  
   
  $scope.options = {  	
  	tableBg : "bg-aqua",
  	classTable : "table  table-condensed dataTable",
  	
  	
  }
  $scope.row = {
  	hdr : {
		ExMemCus_code : "",
		MemCus_citizenid : "",
	}
  }
   
  
  $scope.options.cols_dtl = [
      {label: 'No.', map: 'id', width:60, format:'index', },      
      {label: 'รหัสบัตร', map: 'ExMemCus_code' },
      {label: 'ชื่อ', map: 'ExMemCus_name' },
      {label: 'วันที่สร้าง', map: 'd_activate' }, 
      {label: 'เจ้าของบัตร', map: 'MainCard_Name' },
      {label: 'รหัสบัตรประชาชนเจ้าของ', map: 'MainCard_citizenid' },
      {label: 'ผู้ถือบัตรร่วม', map: 'MemCus_Name' },
      {label: 'รหัสบัตรประชาชนร่วม', map: 'MemCus_citizenid' },
      {label: 'รูป', map: 'MemCus_Pic', type:"img", height:"90", width:"60", },
  ]
   $scope.options.cols_buttons = [
      {label:' Delete', btn:'btn-danger', icon:'ion ion-close', type:'button', width:20, 
       	fn:function(idx,row){        	
			 $scope.row_del(idx,row);
		   },
	  },  
    ]; 
  

  
  $scope.get_member = function() { 
    	   	 
   	iAPI.post('smart_card/exclusive_member_con/iSearch_with_ExCode_CityID'
   		,{
   			"ExMemCus_code":$scope.row.hdr.ExMemCus_code,
   			"MemCus_citizenid":$scope.row.hdr.MemCus_citizenid,   		
   		}
   	).success(function(data) {   	    
   	    if( angular.isDefined(data.mydata)) data = data.mydata;
   	    //console.log("iSearch_with_ExCode_CityID",data) ;
   	    
   	    angular.forEach(data, function(v,k) {     
     		v.MainCard_Name = v.MainCard_pname+" "+v.MainCard_fname+" "+v.MainCard_lname;


			if( v.no_pic == '1') v.MemCus_Pic = IMAGE_NO_PIC;
		else if( v.c_pic != "" ) v.MemCus_Pic = IMAGE_FOLDER+v.c_pic;
			if(v.e_card=="MainCard"){
				v.option_hide = true;	
				v.MemCus_Name = "เจ้าของบัตร";	 
      			v.MemCus_citizenid = "";   							
			}
			else{
				v.option_hide = false;
     			v.MemCus_Name = v.MemCus_pname+" "+v.MemCus_fname+" "+v.MemCus_lname;
			}
    	})
    
    
   	    $scope.rows_dtl = data;
 
    })
  
  }


  $scope.row_del_action = function() { 

	var indexOfRow = $scope.indexOfRow;	 
	  
  	var row_dtl = $scope.rows_dtl[indexOfRow];
  	var hdr = { 
  		ExMemCus_hdr_id : row_dtl.ExMemCus_hdr_id,
  		UserNum : $scope.ABuser.data.UserNum ,
  		log_action : "Member_manage",
  		
	}
  	var dtl = [
  	  { 
  		ExMemCus_dtl_id : row_dtl.ExMemCus_dtl_id,
  		MemCus_id : row_dtl.MemCus_id,
  		e_status_mem : "delete", 
	  }
	];
  	   	 
   	iAPI.post('smart_card/exclusive_member_con/iInsert_Exclusive_member_customer'
   		,{"hdr":hdr,"dtl":dtl}
   	).success(function(data) {
   	    console.log("iInsert_Exclusive_member_customer",data) ;
   	    //Refash
   	    //$scope.rows_dtl.splice(indexOfRow, 1); 
 		$scope.get_member();
    })
    
      	 
  }
  
    
  $scope.row_del = function(idx,row) { 
 
  	//ใช้ row ไปหา indexOf ห้ามใช้ idx เด็ดขาด
	var indexOfRow = $scope.rows_dtl.indexOf(row);	
	if(indexOfRow < 0 )indexOfRow = idx;
	$scope.indexOfRow = indexOfRow;
	
	var row_dtl = $scope.rows_dtl[indexOfRow];
	
	var display = {
		message1 : "ต้องการลบบัตร "+ row_dtl.ExMemCus_code + " ของ "+row_dtl.MemCus_Name,
	};
	$scope.confirmDelete(display,$scope.row_del_action);

  }
  
   
  
    
}])

.controller('Member_prepaid.Ctrl', ['$scope', 'iAPI', '$modal', function ($scope,iAPI,$modal) {
  
  iAPI.setPageTitle('','การเติมเงินส่วนแถม','');
  $scope.location_url(); 
  
    $scope.options = {  	
  	tableBg : "bg-aqua",
  	classTable : "table  table-condensed dataTable",
  	
  	
  }
  $scope.row = {
  	hdr : {
		ExMemCus_code : "",
		MemCus_citizenid : "",
	}
  }
 
  
  $scope.options.cols_dtl = [
      {label: 'No.', map: 'id', width:60, format:'index', },      
      {label: 'รหัสบัตร', map: 'ExMemCus_code' },
      {label: 'ชื่อบัตร', map: 'ExMemCus_name' },
      {label: 'สาขาที่ซื้อ', map: 'br_name' },
      {label: 'วันที่ซื้อบัตร', map: 'd_create_card' },
      {label: 'ลูกค้า', map: 'MemCus_Name' },
      {label: 'รหัสบัตรประชาชน', map: 'MemCus_citizenid' },
      {label: 'มูลค่าบัตร', map: 'm_use_price',}, 
      {label: 'วงเงินส่วนแถม', map: 'm_free_price',},   
      {label: 'จำนวนเงิน', map: 'm_free_price_add', type:"textbox", width:"80", align:"right"},   
      {label: 'รูป', map: 'MemCus_Pic', type:"img", height:"90", width:"60", },
  ]
  $scope.options.cols_buttons = [];
   $scope.options.cols_buttons1 = [
      {label:' ตกลง', btn:'btn-primary', icon : 'fa fa-check', type:'button', width:20, 
       	fn:function(idx,row){        	
			 $scope.row_add(idx,row);
		   },
	  },  
    ]; 
 

  
   
  $scope.clear_action = function() { 
   $scope.isImport = false; 
   $scope.rows_dtl = [];
   $scope.row.hdr.ExMemCus_code = "";
   $scope.csv = "";
  }
  
  $scope.TemplateCSV = "./TemplateCSV/import_prepaid.csv";
  
  $scope.clear_action();
  
    $scope.fileChanged = function() { 
    
    var reader = new FileReader();

    // A handler for the load event (just defining it, not executing it right now)
    reader.onload = function(e) {
      $scope.$apply(function() {
      	  //alert(reader.result);
          //$scope.row2 = reader.result;
          var res = reader.result.split("\r\n");
          $scope.rows_dtl = [];
          
          var row = {};
          var row_dtl = [];
          var col = {};
          for(var i in res){
          	var res2 = res[i].split(","); 
          	
		  	if( i == 0 ){
		  		for(var j in res2) col[j] = res2[j];		  		
		  		continue;
			}else{
				for(var j in res2) row[col[j]] = res2[j];
				row_dtl.push(row);
				
				$scope.get_member(row.ExMemCus_code,row.m_free_price_add) ;
			}
		  }
          console.log("fileChanged",row_dtl);
          //ส่งข้อมูลไปหา 
          
          $scope.isImport = true;
          $scope.options.cols_buttons = [];
          
          //$scope.row2 = row_dtl;
          
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
  
  
  $scope.get_member = function(ExMemCus_code,m_free_price_add) { 
  
    $scope.options.cols_buttons = [];
    if( angular.isUndefined(ExMemCus_code)){
		ExMemCus_code = $scope.row.hdr.ExMemCus_code;
		$scope.rows_dtl = [];
		$scope.options.cols_buttons = $scope.options.cols_buttons1;	
			
	}else{

	}
	if( angular.isUndefined(m_free_price_add)) m_free_price_add = 0;		
     	   	 
   	iAPI.post('smart_card/exclusive_member_con/iSearch_with_ExCode_CityID'
   		,{
   			"ExMemCus_code":ExMemCus_code,
   			"limit":1,
   			//"MemCus_citizenid":$scope.row.hdr.MemCus_citizenid,   		
   		}
   	).success(function(data) {   	    
   	    if( angular.isDefined(data.mydata)) data = data.mydata;
   	    //console.log("iSearch_with_ExCode_CityID",data) ;
   	    
   	    angular.forEach(data, function(v,k) {     
     		v.MemCus_Name = v.MemCus_pname+" "+v.MemCus_fname+" "+v.MemCus_lname;
			if( v.no_pic == '1') v.MemCus_Pic = IMAGE_NO_PIC;
			else if( v.c_pic != "" ) v.MemCus_Pic = IMAGE_FOLDER+v.c_pic;	
			v.m_free_price_add	= m_free_price_add ;
			
			 
			
			$scope.rows_dtl.push(v);
			
    	})
    
     
 
    })
  
  }
  
  $scope.import_action = function() {
  	var rows_dtl = angular.copy( $scope.rows_dtl );
  	$scope.rows_dtl = [];
   	for( var i in rows_dtl ){
		var row_dtl = angular.copy( rows_dtl[i] );
		$scope.get_action(row_dtl);
	}
   	alert("เติมเงินเรียบร้อยแล้ว");
   	
   	$scope.isImport = false; 
   		 
  } 

  $scope.get_action = function(row_dtl) { 
    	  	  
   	 console.log("get_action",row_dtl);
  	 var hdr = { 
  		ExMemCus_hdr_id : row_dtl.ExMemCus_hdr_id,
  		ExMemCus_dtl_id : row_dtl.ExMemCus_dtl_id,
  		MemCus_id : row_dtl.MemCus_id,
  		br_id : 0,
  		e_use_free : 'free',
      e_use_prepaid : 'prepaid',
  		m_prv : parseFloat(row_dtl.m_free_price),
  		m_use : parseFloat(row_dtl.m_free_price_add) ,
  		m_remain : parseFloat(row_dtl.m_free_price) + parseFloat(row_dtl.m_free_price_add) ,  		
  		UserNum : $scope.ABuser.data.UserNum ,
  		log_action : "Member_prepaid",
  		
		}
  	 console.log("hdr",hdr) ;
  	 iAPI.post('smart_card/exclusive_member_con/iInsert_Exclusive_member_customer_use'
   		,{"hdr":hdr}
     ).success(function(data) {
   	    console.log("iInsert_Exclusive_member_customer_use",data) ;
   	    //Refash
   	    //$scope.rows_dtl.splice(indexOfRow, 1); 
   	       	    
 		$scope.get_member(row_dtl.ExMemCus_code);	
 		
 		$scope.isImport = false; 
 	 
     })
     
  }
  
  
  $scope.row_add_action = function() { 

	var indexOfRow = $scope.indexOfRow;	 
	var row_dtl = angular.copy( $scope.rows_dtl[indexOfRow] );
	$scope.rows_dtl = [];	
    $scope.get_action(row_dtl);
   	alert("เติมเงินเรียบร้อยแล้ว");
         	 
  }
  
    
  $scope.row_add = function(idx,row) { 
 
  	//ใช้ row ไปหา indexOf ห้ามใช้ idx เด็ดขาด
	var indexOfRow = $scope.rows_dtl.indexOf(row);	
	if(indexOfRow < 0 )indexOfRow = idx;
	$scope.indexOfRow = indexOfRow;
	
	var row_dtl = $scope.rows_dtl[indexOfRow];
	
	var display = {
		message1 : "ต้องการเติมเงิน "+ row_dtl.ExMemCus_code + " ของ "+row_dtl.MemCus_Name + " จำนวน " + row_dtl.m_free_price_add + " บาท" ,
	};
	$scope.confirmDelete(display,$scope.row_add_action);

  }
  
   
    
}])

