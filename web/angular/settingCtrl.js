angular.module('abAPP.setting', [])

 
.controller('Member.Manage.Ctrl', ['$scope', 'iAPI', '$modal', function ($scope,iAPI,$modal) {

  $scope.activeSide(true);
  $scope.show_menu_group(iAPI.config.menu,"member");
  
 
  var ConfPageTitle = { pageTitle_org : 'Member Manage',
  	pageTitle_add_edit : 'Member Manage',
  	pageCaption_org : '',
  	pageTitle_edit : '',
    pageTitle_table : '',
  };
  iAPI.setConfPageTitle(ConfPageTitle);
  $scope.location_url(); 
  
   
  $scope.side_right = "";
  $scope.options = {	
    allowOp: 'view,add,edit,delete',
    dataAPI: '',
    getAPI:'member.iView_member_hdr/normal',
    saveAPI: 'member.iInsert_member_hdr', 
    deleteAPI: 'member.iInsert_member_hdr',
    transcludeAtTop: true,
    cols : [
      {label: 'No.', map: 'member_id', width:60, format:'index', },
      {label: 'เลขที่สมาชิก', map: 'MemCode' },
      {label: 'ชื่อ', map: 'FName' },
      {label: 'นามสกุล', map: 'LName' },      
      {label: 'สัญชาติ', map: 'nationality' },
      {label: 'เบอร์โทรศัพท์', map: 'Mobile' },
    ],
    addFnForm:function(row){  
			$scope.addItems(row);
		 },
	predicate:'c_seq', 
    reverse:false,
    map_id:'member_id',
  }
  
  $scope.options.display = {};
  
    
  $scope.addItems = function(row) { 
    $scope.row={};
    $scope.row.MemCode="";
    var BirthDay = new Date().toISOString().slice(0,10); 
    $scope.row.BirthDay = BirthDay;
 	$scope.row.age=0;
   	iAPI.post('member.iGet_last_no',{}).then(function(res) {
  		console.log("member.iGet_last_no",res.data);
        $scope.row.MemCode = res.data.doc_no;
    }) ;
    
    
  }
  $scope.options.beforeUpdRow = function(row) {
	row.id = row.member_id;

   	var c_setting = angular.fromJson(row.c_setting);
  	angular.forEach( c_setting, function(value, key) {
		this[key] = value ;	 	
	}, row);    	
	
	delete row.c_setting;
  }
			  
  $scope.options.beforePost = function(row) { 
   
  	if(!row.FName || row.FName == ""){
  		alert("Name do must input")
  		return  false ;	
  	}  	  	

  	console.log("beforePost",angular.copy(row));
  	return true ;	
  }
  
  $scope.options.afterPost = function(row){
  	console.log("afterPost",angular.copy(row));
  } 

  $scope.options.display.setting = function() { 
	$scope.options.display.message1 = "ต้องการลบสมาชิก : " + $scope.row.FName;
	$scope.options.display.confirmTitle = "ยืนยันการลบ สมาชิก";
  };      
 
  $scope.options.beforeDelete = function(row) {
  	row.e_status = "cancel" ; 
	return true;
  };  
  
  
  $scope.BirthDay_change = function(){
  	//คำนวนอายุ  	
  	var d1 = new Date($scope.row.BirthDay);
    var d2 = new Date();
    var diff = d2.getTime() - d1.getTime();
    var age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));  
    //alert(age);
  	$scope.row.age = age;
  } 
  
}])
 
.controller('Member.History.Ctrl', ['$scope', 'iAPI', '$modal', function ($scope,iAPI,$modal) {

  $scope.activeSide(true);
  $scope.show_menu_group(iAPI.config.menu,"member");
  
  
}])
 
 
//////////////////////////////////////////////////////////////////////////////////////////////

.controller('Agent.Manage.Ctrl', ['$scope', 'iAPI', '$modal', function ($scope,iAPI,$modal) {
	
  $scope.activeSide(true);
  $scope.show_menu_group(iAPI.config.menu,"agent");	
  
  
  var ConfPageTitle = { pageTitle_org : 'Agent Manage',
  	pageTitle_add_edit : 'Agent Manage',
  	pageCaption_org : '',
  	pageTitle_edit : '',
    pageTitle_table : '',
  };
  iAPI.setConfPageTitle(ConfPageTitle);
  $scope.location_url(); 
   
  
  $scope.side_right = "";
  $scope.options = {	
    allowOp: 'view,add,edit,delete',
    dataAPI: '',
    getAPI:'flow.iView_agent/normal',
    saveAPI: 'flow.iInsert_agent', 
    deleteAPI: 'flow.iInsert_agent',
    transcludeAtTop: true,
    cols : [
      {label: 'No.', map: 'agent_id', width:60, format:'index', },
      {label: 'ชื่อ', map: 'lng1_c_name' },
      {label: 'เบอร์โทรศัพท์', map: 'c_mobile' },      
      {label: 'ราคา/ชั่วโมง', map: 'i_price' },
      {label: 'จำนวนชั่วโมงขั้นต่ำ', map: 'i_hour' },
      {label: 'จำนวนเดือนหมดอายุ', map: 'i_month' },
    ],
    addFnForm:function(row){  
			$scope.addItems(row);
		 },
	predicate:'c_seq', 
    reverse:false,
    map_id:'agent_id',
  }
  
  $scope.options.display = {};
  
    
  $scope.addItems = function(row) { 
     $scope.row={};
     $scope.row.c_seq='';
  }
  $scope.options.beforeUpdRow = function(row) {
	row.id = row.agent_id;
  }
			  
  $scope.options.beforePost = function(row) { 
   
  	if(!row.lng1_c_name || row.lng1_c_name == ""){
  		alert("Name do must input")
  		return  false ;	
  	}  	  	

  	console.log("beforePost",angular.copy(row));
  	return true ;	
  }
  
  $scope.options.afterPost = function(row){
  	console.log("afterPost",angular.copy(row));
  } 

  $scope.options.display.setting = function() { 
	$scope.options.display.message1 = "ต้องการลบ lane : " + $scope.row.lng1_c_name;
	$scope.options.display.confirmTitle = "ยืนยันการลบ lane";
  };      
 
  $scope.options.beforeDelete = function(row) {
  	row.e_status = "cancel" ; 
	return true;
  }; 
 
  

    
}])
  
 
.controller('Agent.History.Ctrl', ['$scope', 'iAPI', '$modal', function ($scope,iAPI,$modal) {

  $scope.activeSide(true);
  $scope.show_menu_group(iAPI.config.menu,"agent");
  
  
}])
 
 
 
//////////////////////////////////////////////////////////////////////////////////////////////

.controller('Conf.Ctrl', ['$scope', 'iAPI', '$modal', function ($scope,iAPI,$modal) {

  $scope.activeSide(true);
  $scope.show_menu_group(iAPI.config.menu,"setting");
  
 	$scope.options = {
 		
	}
	
	$scope.options.conf = [
		{label: 'หัวใบเสร็จ', map: '', }, 
		{label: 'ชื่อร้าน', map: 'restaurant_name', }, 
		{label: 'ใบเสร็จรับเงินบรรทัดที่ 1', map: 'receipt_line1', }, 
		{label: 'ใบเสร็จรับเงินบรรทัดที่ 2', map: 'receipt_line2', }, 
		{label: 'ใบเสร็จรับเงินบรรทัดที่ 3', map: 'receipt_line3', }, 
		{label: 'Receipt 1', map: 'restaurant_name', }, 
		{label: 'Receipt 2', map: 'restaurant_name', }, 
		{label: 'Receipt 3', map: 'restaurant_name', },
		{label: 'ท้ายใบเสร็จ', map: '', },  
		{label: 'ข้อความท้ายใบเสร็จ', map: 'restaurant_name', }, 
		{label: 'ชื่อร้าน', map: 'restaurant_name', }, 
	];
	
	$scope.activeSide(true);
	  
	  
}])

.controller('Lanes.Ctrl', ['$scope', 'iAPI', '$modal', function ($scope,iAPI,$modal) {
	
  $scope.activeSide(true);
  $scope.show_menu_group(iAPI.config.menu,"setting");	
  
  
  var ConfPageTitle = { pageTitle_org : 'Lanes',
  	pageTitle_add_edit : 'Lanes',
  	pageCaption_org : '',
  	pageTitle_edit : '',
    pageTitle_table : '',
  };
  iAPI.setConfPageTitle(ConfPageTitle);
  $scope.location_url(); 
   
  
  $scope.side_right = "";
  $scope.options = {	
    allowOp: 'view,add,edit,delete',
    dataAPI: '',
    getAPI:'flow.iView_lanes/normal',
    saveAPI: 'flow.iInsert_lanes', 
    deleteAPI: 'flow.iInsert_lanes',
    transcludeAtTop: true,
    cols : [
      {label: 'No.', map: 'lane_id', width:60, format:'index', },
      {label: 'ชื่อ (ภาษา1)', map: 'lng1_c_name' },
      {label: 'ชื่อ (ภาษา2)', map: 'lng2_c_name' },      
      {label: 'จำนวนผู่เล่น', map: 'i_user' },
    ],
    addFnForm:function(row){  
			$scope.addItems(row);
		 },
	predicate:'c_seq', 
    reverse:false,
    map_id:'lane_id',
  }
  
  $scope.options.display = {};
  
    
  $scope.addItems = function(row) { 
     $scope.row={};
     $scope.row.c_seq='';
  }
  $scope.options.beforeUpdRow = function(row) {
	row.id = row.lane_id;
  }
			  
  $scope.options.beforePost = function(row) { 
   
  	if(!row.lng1_c_name || row.lng1_c_name == ""){
  		alert("Name do must input")
  		return  false ;	
  	}  	  	

  	console.log("beforePost",angular.copy(row));
  	return true ;	
  }
  
  $scope.options.afterPost = function(row){
  	console.log("afterPost",angular.copy(row));
  } 

  $scope.options.display.setting = function() { 
	$scope.options.display.message1 = "ต้องการลบ lane : " + $scope.row.lng1_c_name;
	$scope.options.display.confirmTitle = "ยืนยันการลบ lane";
  };      
 
  $scope.options.beforeDelete = function(row) {
  	row.e_status = "cancel" ; 
	return true;
  }; 
 
  

    
}])
 
.controller('Menu.Ctrl', ['$scope', 'iAPI', '$modal', function ($scope,iAPI,$modal) {
	 
  $scope.activeSide(true);
  $scope.show_menu_group(iAPI.config.menu,"setting");	
	
  var ConfPageTitle = { pageTitle_org : 'Menu',
  	pageTitle_add_edit : 'Menu',
  	pageCaption_org : '',
  	pageTitle_edit : '',
    pageTitle_table : '',
  };
  iAPI.setConfPageTitle(ConfPageTitle);
  $scope.location_url(); 
  
  
  $scope.side_right = "";
  $scope.options = {	
    allowOp: 'view,add,edit,delete',
    dataAPI: '',
    getAPI:'fr.iView_menu/normal',
    saveAPI: 'fr.iInsert_menu', 
    deleteAPI: 'fr.iInsert_menu',
    transcludeAtTop: true,
    cols : [
      {label: 'No.', map: 'menu_id', width:60, format:'index', },
      {label: 'ชื่อ (ภาษา1)', map: 'lng1_c_name' },
      {label: 'ชื่อ (ภาษา2)', map: 'lng2_c_name' },  
    ],
    addFnForm:function(row){  
			$scope.addItems(row);
		 },
	predicate:'c_seq', 
    reverse:false,
    map_id:'menu_id',
  }
  
  $scope.options.display = {};
  
    
  $scope.addItems = function(row) { 
     $scope.row={};
     $scope.row.c_seq='';
  }
  $scope.options.beforeUpdRow = function(row) {
	row.id = row.menu_id;
  }
			  
  $scope.options.beforePost = function(row) { 
   
  	if(!row.lng1_c_name || row.lng1_c_name == ""){
  		alert("Name do must input")
  		return  false ;	
  	}  	  	

  	console.log("beforePost",angular.copy(row));
  	return true ;	
  }
  
  $scope.options.afterPost = function(row){
  	console.log("afterPost",angular.copy(row)); 
  } 

  $scope.options.display.setting = function() { 
	$scope.options.display.message1 = "ต้องการลบ Menu : " + $scope.row.lng1_c_name;
	$scope.options.display.confirmTitle = "ยืนยันการลบ Menu";
  };      
 
  $scope.options.beforeDelete = function(row) {
  	row.e_status = "cancel" ; 
	return true;
  }; 
 
  

    
}])
 
.controller('Item.Ctrl', ['$scope', 'iAPI', '$modal', function ($scope,iAPI,$modal) {
 
  $scope.activeSide(true);
  $scope.show_menu_group(iAPI.config.menu,"setting");	
	
  var ConfPageTitle = { pageTitle_org : 'Item',
  	pageTitle_add_edit : 'Item',
  	pageCaption_org : '',
  	pageTitle_edit : '',
    pageTitle_table : '',
  };
  iAPI.setConfPageTitle(ConfPageTitle);
  $scope.location_url(); 
  
    
  $scope.side_right = "";
  $scope.options = {	
    allowOp: 'view,add,edit,delete,group1',
    dataAPI: '',
    getAPI:'fr.iView_item/0/normal',
    saveAPI: 'fr.iInsert_item', 
    deleteAPI: 'fr.iInsert_item',
    transcludeAtTop: true,
    cols : [
      {label: 'No.', map: 'item_id', width:60, format:'index', },
      {label: 'ชื่อ (ภาษา1)', map: 'lng1_c_name' },
      {label: 'ราคา', map: 'price' },  
    ],
    addFnForm:function(row){  
			$scope.addItems(row);
		 },
	predicate:'c_seq', 
    reverse:false,
	display : {
      groupLable : 'Menu',
      groupOrderby : ' ',
    },	 
    filter_group : [
    	{map: 'menu_id' },
    ],
    map_id:'item_id',
  }
  
  iAPI.get('fr.iView_menu/normal').success(function(data) {

	//if( angular.isDefined(data.mydata)) data = data.mydata;
	console.log("iView_menu",data);
 
 	$scope.MODEL["menu_group"] = [];
	var row_group = [];
    row0 = {};
	row0["id"]=row0["menu_id"]=0;
	row0["c_code"]="";row0["c_name"]="ทุกฝ่าย";
	row_group.push(row0);
  	angular.forEach(data, function(value, key) {
  		row0 = value;
  		row0["id"]=row0["menu_id"];
  		row0["c_code"]="";
  		row0["c_name"] = value["lng1_c_name"] ;
    	this.push(row0);	 	
    	$scope.MODEL["menu_group"].push(row0);	
	}, row_group);
	$scope.options.group  = row_group;
	console.log("group emp_group",$scope.options.group);
	$scope.options.row_group = $scope.options.group[0];			

   });
  
    
  $scope.addItems = function(row) { 
     $scope.row={};
     $scope.row.c_seq='';
  }
  $scope.options.beforeUpdRow = function(row) {
	row.id = row.item_id;
  }
			  
  $scope.options.beforePost = function(row) { 
   
  	if(!row.lng1_c_name || row.lng1_c_name == ""){
  		alert("Name do must input")
  		return  false ;	
  	}  	  	

  	console.log("beforePost",angular.copy(row));
  	return true ;	
  }
  
  $scope.options.afterPost = function(row){
  	console.log("afterPost",angular.copy(row));
  } 

  $scope.options.display.setting = function() { 
	$scope.options.display.message1 = "ต้องการลบรายการ : " + $scope.row.lng1_c_name;
	$scope.options.display.confirmTitle = "ยืนยันการลบรายการ";
  };      
 
  $scope.options.beforeDelete = function(row) {
  	row.e_status = "cancel" ; 
	return true;
  }; 
 
  

    
}])
  

 
//////////////////////////////////////////////////////////////////////////////////////////////

.controller('User.Ctrl', ['$scope', 'iAPI', '$modal', function ($scope,iAPI,$modal) {
  var ConfPageTitle = { pageTitle_org : 'รายชื่อผู้ใช้',
  	pageTitle_add_edit : ' ',
  	pageCaption_org : '',
  	pageTitle_edit : ' ',
    pageTitle_table : '',
  };
  iAPI.setConfPageTitle(ConfPageTitle);
  $scope.location_url(); 
   
  $scope.options = {
  	allowOp: 'view,add,edit,delete,group1', 
    dataAPI: '',
    getAPI:'user/users_con/ViewUser/normal',
    saveAPI: 'user/users_con/iInsertUser', 
    deleteAPI: 'user/users_con/iInsertUser',    
    cols : [
      {label: 'ลำดับ', map: 'UserNum', width:60, format:'index', },
      {label: 'แผนก', map: 'usergroup', width:150 },
      {label: 'แผนก', map: 'emp_role', width:150 },
      {label: 'ชื่อ', map: 'FName' },
      {label: 'นามสกุล', map: 'LName' },  
      {label: 'User Name', map: 'UserName', width:130},
      
    ],
    itemPerPage:$scope.itemPerPage,
    predicate:'UserName',
    reverse:false,
    addFnForm:function(row){  
			$scope.addItems(row);
		 },
	display : {
      groupLable : 'ฝ่าย',
      groupOrderby : ' ',
    },	 
    filter_group : [
    	{map: 'usergroup' },
    ],
    map_id : "UserNum",
  }
   
  
  $scope.formFlds = [
      {label: 'User Name', map: 'c_email'},
      {label: 'Name', map: 'c_fname' },
      {label: 'Last Name', map: 'c_lname' },
      //{label: 'Tel', map: 'c_setting' , map2:'c_tel' },
  ]
  
  //iAPI.get('user.get_menu').success(function(data) {
  //	$scope.options.menu  = data;
  // }); 
  iAPI.get('user/users_con/iView_User_Group/normal').success(function(data) {

	if( angular.isDefined(data.mydata)) data = data.mydata;
	//console.log("iView_User_Group",data);
 
 	$scope.MODEL["emp_group"] = [];
	var row_group = [];
    row0 = {};
	row0["id"]=row0["usergroup_id"]=0;
	row0["c_code"]="";row0["c_name"]="ทุกฝ่าย";
	row0["usergroup"] = '' ;
	row_group.push(row0);
  	angular.forEach(data, function(value, key) {
  		row0 = value;
  		row0["usergroup"] = value["c_name"] ;
    	this.push(row0);	 	
    	$scope.MODEL["emp_group"].push(row0);	
	}, row_group);
	$scope.options.group  = row_group;
	console.log("group emp_group",$scope.options.group);
	$scope.options.row_group = $scope.options.group[0];			
	 			 
    //$scope.show_menu();
    
    //$scope.show_confirm();
   });
   
    
   
  iAPI.get('user/users_con/ViewUser').success(function(data) {
  	if( angular.isDefined(data.mydata)) data = data.mydata;
	$scope.options.user_all  = data;
  });


  
  $scope.show_menu = function (){  
	
     $scope.options.menu = []; 
  	 for( i in $scope.menu)
   		$scope.show_menu_add($scope.menu[i],0,0);  	
  }
  
  $scope.show_menu_add = function (menu,c_seq,parent){
  	
  	var url = menu.url.replace('#','');	
	if( url == "signout") return;
	if( url == "profile") return;
	
	var row = {};
	row.chk_add = 0;
	row.c_code = url;	
	row.icon = menu.icon;
	row.c_space = "";
	row.parent = parent
	for( i=0;i<c_seq;i++)
		row.c_space += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";		
	row.c_desc = menu.title; 
	row.menu_id = $scope.options.menu.length;	
	row.submenu = !angular.isUndefined(menu.submenu); 
	
	$scope.options.menu.push(row);

	if( !angular.isUndefined(menu.submenu) ){
		//if( c_seq == 0)
			parent =  $scope.options.menu.length-1;
			
		c_seq++;	
		for( i in menu.submenu)
			$scope.show_menu_add(menu.submenu[i],c_seq,parent); 
	}	
					
	
  }
  
  
  
  
  $scope.menu_change = function(row) { 
  	if(row.parent==0)return;
  	
  	var chk = false;
  	for(var i in $scope.options.menu){
		if($scope.options.menu[i].parent==row.parent 
			//&& $scope.options.menu[i].menu_id != row.menu_id
			&& $scope.options.menu[i].chk_add == 1
			)
			chk = true;
	}
	if( chk )$scope.options.menu[row.parent].chk_add = 1;
	else $scope.options.menu[row.parent].chk_add = 0;
  	
  	$scope.menu_change($scope.options.menu[row.parent]);
  	
  }
	    		

  $scope.show_confirm = function (){ 
  	$scope.options.confirm = []; 
  	
  	var row = {};
  	row.chk_add = 0;
  	row.c_code = "confirm_TC" ;
  	row.c_desc = "ยืนยันการตรวจนับ"; 
  	
  	$scope.options.confirm.push(row);
  	
  	row = {};
  	row.chk_add = 0;
  	row.c_code = "confirm_TA" ;
  	row.c_desc = "ยืนยันผลต่างจากการตรวจนับ"; 
  	$scope.options.confirm.push(row);
  	  	
  }
  
  $scope.confirm_change = function(row) { 
   	
  }
	 	    		
  
  
  $scope.addItems = function(row) { 
 
   $scope.row={};
   $scope.row.UserName=""; 
   $scope.row.FName=""; 
   $scope.row.LName=""; 
   $scope.row.Password=""; 
   $scope.row.usergroup_id=$scope.options.group[0].id; 
   $scope.row.emp_role="STAFF"; 
   //$scope.row.c_setting={};  
   
   //for( i in $scope.options.menu) $scope.options.menu[i].chk_add = 0;
   //for( i in $scope.options.confirm) $scope.options.confirm[i].chk_add = 0;
   		
  }

  $scope.options.afterGet = function(rows){
  	/*
  	angular.forEach(rows, function(v,k) {
         v.c_setting = angular.fromJson(v.c_setting);
    })
    */
  }

  $scope.options.beforeUpdRow = function(row) {  
  	row.Password=""; 
	row.id = row.UserNum;
/*
	if( !angular.isUndefined(row.c_setting.permission)){
		for( i in $scope.options.menu){
			//alert($scope.options.menu[i].c_code + " " + row.c_setting.permission.indexOf($scope.options.menu[i].c_code ));
			//console.log( $scope.options.menu[i].c_code + " " + row.c_setting.permission.indexOf($scope.options.menu[i].c_code ) );
			if( row.c_setting.permission.indexOf($scope.options.menu[i].c_code) != -1 )
				$scope.options.menu[i].chk_add = 1;
			else $scope.options.menu[i].chk_add = 0;
			
		}		
		
	}else{
		for( i in $scope.options.menu) $scope.options.menu[i].chk_add = 0;
	}

	if( !angular.isUndefined(row.c_setting.confirm)){
		for( i in $scope.options.confirm){
			if( row.c_setting.confirm.indexOf($scope.options.confirm[i].c_code) != -1 )
				$scope.options.confirm[i].chk_add = 1;
			else $scope.options.confirm[i].chk_add = 0;			
		}				
	}else{
		for( i in $scope.options.confirm) $scope.options.confirm[i].chk_add = 0;
	}
	*/
	
	
	
  }  
    // validate here return false to stop proceeding
  $scope.options.beforePost = function(row) { 
   
  	if(!row.UserName || row.UserName == ""){
  		alert("User Name do must input")
  		return  false ;	
  	}  
  	
  	if(!row.FName || row.FName == ""){
  		alert("Frist Name do must input")
  		return  false ;	
  	}

  	if( !row.UserNum){
	 	//ถ้าเป็น add ให้ check ชื่อซ้ำด้วย
	  	for( i in $scope.options.user_all){
			if( row.UserName == $scope.options.user_all[i].UserName ){
				alert("User Name ซ้ำกัน");
				return  false ;	
			}
		}		
		
		if(!row.Password || row.Password == ""){
  			alert("Password do must input")
  			return  false ;	
  		}

		if(!row.usergroup_id){
        alert("Group do must input")
        return  false ; 
      }
	}
	
 
	if(row.usergroup_id == 2)
  		row.emp_role="ADMIN"
  	else 
  		row.emp_role="STAFF"
  		
  	for( var i in $scope.options.group ){ 
		if( $scope.options.group[i].id == row.usergroup_id ){
			row.usergroup = $scope.options.group[i].c_name; 
			//alert(row.usergroup);
			break;
		}
	}   		
  		
  		
	row.user = angular.copy(row);
  	console.log("beforePost",angular.copy(row));
  	
	//return  false ;
	/*
	console.log("beforePost c_setting",$scope.row.c_setting);	
	row.c_setting.permission = [];
	for( i in $scope.options.menu){
		if( $scope.options.menu[i].chk_add == "1" ){
			row.c_setting.permission.push($scope.options.menu[i].c_code);
		}
	}
	
	row.c_setting.confirm = [];
	for( i in $scope.options.confirm){
		if( $scope.options.confirm[i].chk_add == "1" ){
			row.c_setting.confirm.push($scope.options.confirm[i].c_code);
		}
	}
	
 	console.log("beforePost c_setting",$scope.row.c_setting);	
  	$scope.row.c_setting = angular.toJson(row.c_setting);
    console.log("beforePost c_setting",$scope.row.c_setting);
    //console.log("beforePost e",row);
    */
    
    
    //return false;
    
  	return true;
  } 
  $scope.options.afterPost = function(row){
  	  
  	console.log("afterPost",angular.copy(row));
  	delete row.user;
  	
  	/*
    row.c_setting = angular.fromJson(row.c_setting); 
    
    if(row.id == iAPI.ABuser.user_id){
		$scope.get_profile(); 
		
		iAPI.ABuser.data.c_fname = row.c_fname ;  
	   	iAPI.ABuser.data.c_lname = row.c_lname ;  
	   	$scope.ABuser = iAPI.ABuser
	   	    
	   	var ABuser = angular.copy(iAPI.ABuser);
	   	ABuser.user_data = JSON.stringify(ABuser.data);
	   	delete ABuser.data; 
	   	localStorage.ABuser = JSON.stringify(ABuser);
	   	    
	}
	*/
	
  }
  
  $scope.options.display.setting = function() { 
	$scope.options.display.message1 = "ต้องการลบพนักงาน : " + $scope.row.FName + " " + $scope.row.LName;
	$scope.options.display.confirmTitle = "ยืนยันการลบพนักงาน";
  };      
 
  $scope.options.beforeDelete = function(row) {
  	row.IsHidden = 1 ;
	row.user = angular.copy(row);
	return true;
  }; 
     
    
}])

.controller('User_groupCtrl', ['$scope', 'iAPI', '$modal', function ($scope,iAPI,$modal) {
  var ConfPageTitle = { pageTitle_org : 'ฝ่าย',
  	pageTitle_add_edit : 'ฝ่าย',
  	pageCaption_org : '',
  	pageTitle_edit : '',
    pageTitle_table : '',
  };
  iAPI.setConfPageTitle(ConfPageTitle);
  $scope.location_url(); 
  
  	 
  $scope.options = {	
   // allowOp: 'view,add,edit,delete',
    allowOp: 'view,delete',
    dataAPI: '',
    getAPI:'user/users_con/iView_User_Group/normal',
    saveAPI: 'user/users_con/iInsert_User_Group', 
    deleteAPI: 'user/users_con/iInsert_User_Group',
    transcludeAtTop: true,
    cols : [
      {label: 'No.', map: 'id', width:60, format:'index', },
      {label: 'ชื่อ', map: 'c_name' },
    ],
    addFnForm:function(row){  
			$scope.addItems(row);
		 },
	predicate:'c_seq', 
    reverse:false,
  }
  
  $scope.options.display = {};
  
    
  $scope.addItems = function(row) { 
     $scope.row={};
  }
  
  $scope.options.beforePost = function(row) { 
   
  	if(!row.c_name || row.c_name == ""){
  		alert("Name do must input")
  		return  false ;	
  	}  	  	
  	row.userGroup = angular.copy(row);
  	console.log("beforePost",angular.copy(row));
  	return true ;	
  }
  
  $scope.options.afterPost = function(row){
  	//sif( angular.isUndefined(res.data.mydata)) res_data = res.data;
  	console.log("afterPost",angular.copy(row));
  	delete row.userGroup;
  } 

  $scope.options.display.setting = function() { 
	$scope.options.display.message1 = "ต้องการลบฝ่าย : " + $scope.row.c_name;
	$scope.options.display.confirmTitle = "ยืนยันการลบฝ่าย";
  };      
 
  $scope.options.beforeDelete = function(row) {
  	row.IsHidden = 1 ;
	row.userGroup = angular.copy(row);
	return true;
  }; 
 
  

    
}])
 