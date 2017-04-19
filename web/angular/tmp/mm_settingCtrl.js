angular.module('abAPP.setting', [])

 

.controller('LocationCtrl', ['$scope', 'iAPI', '$modal', function ($scope,iAPI,$modal) {

  var ConfPageTitle = { pageTitle_org : 'สาขา',
  	pageTitle_add_edit : ' ',
  	pageCaption_org : '',
  	pageTitle_edit : ' ',
    pageTitle_table : '',
  };
  iAPI.setConfPageTitle(ConfPageTitle);
  
  $scope.options = {
    allowOp: 'view',
    dataAPI: 'location',
    importAPI: 'location.import',
    cols : [
      {label: 'No.', map: 'id', width:60, format:'index', },
      {label: 'location-id', map: 'id', width:100, },
      {label: 'H-CODE', map: 'c_pin', width:100, },
      {label: 'ชื่อย่อ', map: 'c_country_code', width:100, },
      {label: 'ชื่อ', map: 'c_name' },
      //{label: 'Date Create', map: 'd_create' , width:150}
    ],
    importFlds : [
     	{col: 'c_pin', data: '53-00001' },
    	{col: 'c_name', data: 'location one' },
    ],
    buttons : [
      // {label:' Price', btn:'btn-danger', icon : 'fa-usd', type:'button', width:60,
      // 	fn:function(idx,row){
      //     $scope.price_list(row);
		    // },
      // },
      {label:' Get Token', btn:'btn-primary', icon : 'fa-university', type:'button', width:70,
      	fn:function(idx,row){
          $scope.row = row;
          $scope.get_fix_token();
        },
      }, 
    ],
    csv:'file/location.csv',
    itemPerPage:$scope.itemPerPage,
    predicate:'c_name',
    reverse:false,
    editBtn : {
		noShow:true,
	},
	viewBtn : {
		show:true,
	},
	text_show:true,
	
  }
  
   
   
  $scope.options.beforeUpdRow = function(row) {     
 	
 	$scope.options.disabled = true;
 	 
  	var row_tmp = angular.copy(row); 	
  	$scope.row = {};
  	$scope.row = row_tmp;  	
   
  	var c_setting = angular.fromJson($scope.row.c_setting);
  	delete $scope.row.c_setting;
  	
  	angular.forEach(c_setting, function(value, key) {
		this[key] = value ;	 	
	}, $scope.row);


   	  	
  }
  
  
  $scope.options.beforePost = function(row) {
  	if(!row.c_pin){
  		alert("H-CODE do must input")
  		return  false ;	
  	}
  	if(!row.c_name){
  		alert("Name do must input")
  		return  false ;	
  	}
  	
  	var c_setting = {};
  	c_setting.c_address = row.c_address;
  	c_setting.c_tel = row.c_tel;
  	c_setting.c_tax_number = row.c_tax_number;
  	c_setting.c_desc = row.c_desc;
  	
  	delete $scope.row.c_address;  
  	delete $scope.row.c_tel;  	
  	delete $scope.row.c_tax_number;
  	delete $scope.row.c_desc;
  	$scope.row.c_setting = angular.toJson(c_setting);   	
  	
  	return true 
  }
  
  $scope.formFlds = [
      {label: 'H-CODE', map: 'c_pin' }, 		
      {label: 'Name', map: 'c_name' }, 
  ]
    
    
     
  $scope.stock = function(row) {
  	if( !angular.isUndefined(row) ) $scope.row = row;
  	
    $scope.opt = { MODEL: $scope.MODEL, location_id: $scope.row.id, 
    	id: $scope.row.id, 
    	display:{
			modal_title:'Item @Branch',
		},
		row_group : $scope.MODEL['all_item_group'],
    }; 
    var modalInstance = $modal.open({
      templateUrl: 'views/setting/location.stock.html',
      controller: 'Location.stock.Ctrl',
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
  
  $scope.price_list = function(row) {
  	if( !angular.isUndefined(row) ) $scope.row = row;  
  
    $scope.opt = { MODEL: $scope.MODEL, location_id: $scope.row.id, 
        id: $scope.row.id,      	
    	display:{
			modal_title:'Price @Branch',
		}, 
		row_group : $scope.MODEL['all_item_group'],
    };
    var modalInstance = $modal.open({
      templateUrl: 'views/setting/location.price.html',
      controller: 'Location.price.Ctrl',
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
  
  $scope.get_fix_token = function() {  	
    iAPI.post('location.branch_user_token/'+$scope.row.id ).success(function(data) {
 		console.log("branch_user_token",data);
 		
    	$scope.opt = { confirmTitle: iAPI.config["pageTitle_org"]+ " : " + $scope.row.c_name + " " + "Token Code"  	
	    	, row :$scope.row
	    	, id: $scope.row.id 
	    	, message2 : 'Token Code : ' + data["c_token"]
	    	, isShowOK: false 
	    };
	    var modalInstance = $modal.open({
	      templateUrl: '../common/views/tpl.ab-confirm.html',
	      controller: 'Confirm.Ctrl',
	      size: 'lg',
	      resolve: {
	        options: function () {
	          return $scope.opt;
	        }
	      }
	    });
    
    })    
  }
  
  
  
  

}])
.controller('Location.stock.Ctrl', function ($scope,$modalInstance,$modal,options) {
  $scope.rows = null;
  $scope.MODEL = options.MODEL;
  $scope.options = {
    allowOp: 'group1',
    dataAPI: 'stock/'+'/'+ options.location_id ,
    importAPI: 'stock.import',
    transcludeAtTop: true,
    cols : [
      {label: 'Item Code', map: 'item_code'},
      {label: 'Item Name', map: 'item_name'},
      //{map: 'i_min' },
      //{map: 'i_max'},
      {label: 'Available', map: 'i_available'}
    ],
    display:options.display,
    group: options.row_group,
    row_group : options.row_group[0],
    filter_group : [
    	{map: 'item_group_id' },
    ],
    predicate:'item_name', 
    reverse:false,
  }
  $scope.close = function (item) {
    $modalInstance.close(item);
  };
})
.controller('Location.price.Ctrl', function ($scope,$modalInstance,$modal,iAPI,options) {
  $scope.rows = null;
  $scope.MODEL = options.MODEL;
  $scope.options = {
    allowOp: 'group1,saveall',
    dataAPI: '',
    getAPI: 'product.price_list/'+'/'+options.location_id ,
    importAPI: 'stock.import',
    transcludeAtTop: true,
    cols : [
      {label: 'Item Code', map: 'item_code'},
      {label: 'Item Name', map: 'item_name'},
      {label: 'Quantity', map: 'f_quantity'},
      {label: 'Unit', map: 'uofm_name'},
      {label: 'Price', map: 'f_price', type:'textbox'},
    ],
    display:options.display,
    group: options.row_group,
    row_group : options.row_group[0],
    filter_group : [
    	{map: 'item_group_id' },
    ],
    saveAllFn:function(rows){  
		$scope.saveAll(rows);
	},
	predicate:'item_name', 
	reverse:false,
  }
  $scope.close = function (item) {
    $modalInstance.close(item);
  };
  $scope.options.afterGet = function(rows){
  	//cheage to json
  	angular.forEach(rows, function(v,k) {
         v.f_quantity_old = v.f_quantity;
         v.f_price_old = v.f_price;
    })
      
  	//console.log("afterGet",rows);
  }  
  $scope.saveAll = function(items) {  
    if( !angular.isUndefined(items["rows"]) ) items = items["rows"];
    //console.log("saveRowAll",items); 
    
    var data = [];
	angular.forEach(items, function(value, key) {	
		if(value.f_quantity != value.f_quantity_old || value.f_price != value.f_price_old) 	
	 	this.push(value);	 	
	}, data);
	 
  	console.log("saveRowAll data",data);  
    
    var url = "product.price_list_location_update/"+"/"+options.location_id; 
    iAPI.post(url,{'price_list':data}).success(function(res) {
    	//message ok
    	//return back
    	iAPI.showMessage("Save ok");
    	$modalInstance.close(items);
    });  
     
    
  }
  
  
})
.controller('Location_mmCtrl', ['$scope', 'iAPI', '$modal', function ($scope,iAPI,$modal) {

  var ConfPageTitle = { pageTitle_org : 'สถานที่ส่งของ',
  	pageTitle_add_edit : ' ',
  	pageCaption_org : '',
  	pageTitle_edit : '',
    pageTitle_table : '',
  };
  iAPI.setConfPageTitle(ConfPageTitle);
  
  $scope.options = {
    allowOp: 'view,add,edit',
    dataAPI: 'location',
    getAPI: 'location.hq',
    importAPI: 'location.import',
    cols : [
      {label: 'No.', map: 'id', width:60, format:'index', },
      //{label: 'H-CODE', map: 'c_pin', width:100,  },
      {label: 'ชื่อย่อ', map: 'c_country_code', width:100, },
      {label: 'ชื่อ', map: 'c_name' },
      //{label: 'Date Create', map: 'd_create' , width:150}
    ],
    itemPerPage:$scope.itemPerPage,
    predicate:'c_name',
    reverse:false,
    addFnForm:function(row){  
		$scope.addItems(row);
	},
  }
  
  $scope.addItems = function(row) {  
  
    var parameter = { c_code: "00-" , size: 6 , update : false };  
    iAPI.post('document.get_last_no',parameter).success(function(data) {
   	    console.log("document.get_last_no",data) ;
   		data = angular.fromJson(data);
   		$scope.row.c_pin = data.doc_no ; ;  
    })
  } 
   
  $scope.options.beforeUpdRow = function(row) {     
 	 
  	var row_tmp = angular.copy(row); 	
  	$scope.row = {};
  	$scope.row = row_tmp;  	
   
  	var c_setting = angular.fromJson($scope.row.c_setting);
  	delete $scope.row.c_setting;
  	
  	angular.forEach(c_setting, function(value, key) {
		this[key] = value ;	 	
	}, $scope.row);
	  	
  }
  
  
  $scope.options.beforePost = function(row) {
  	//if(!row.c_pin){
  	//	alert("H-CODE do must input")
  	//	return  false ;	
  	//}
  	
  	if(!row.c_name){
  		alert("Name do must input")
  		return  false ;	
  	}
  	
  	var c_setting = {};
  	c_setting.c_address = row.c_address;
  	c_setting.c_tel = row.c_tel;
  	c_setting.c_tax_number = row.c_tax_number;
  	c_setting.c_desc = row.c_desc;
  	
  	delete $scope.row.c_address;  
  	delete $scope.row.c_tel;  	
  	delete $scope.row.c_tax_number;
  	delete $scope.row.c_desc;
  	
  	$scope.row.c_setting = angular.toJson(c_setting);   	
  	
  	return true 
  }
 
  $scope.options.afterPost = function(row){
  	iAPI.getMODEL($scope.MODEL,'location');  	  	
  } 
  

}])

//////////////////////////////////////////////////////////////////////////////////////////////
.controller('PricelistCtrl', ['$scope', 'iAPI', '$modal','$filter', function ($scope,iAPI,$modal,$filter) {
  
  var ConfPageTitle = { pageTitle_org : 'ราคาสินค้า',
  	pageTitle_add_edit : '',
  	pageCaption_org : '',
  	pageTitle_edit : ' ',
    pageTitle_table : '',
  };
  iAPI.setConfPageTitle(ConfPageTitle);
  
  $scope.options = {
    allowOp: 'view',
    dataAPI: '',
    importAPI: '',
    editBtn : {
		noShow:true,
	},
    getAPI: 'product.price_level',    
    cols : [
      {label: 'รหัส', map: 'c_code'},
      {label: 'ชื่อ', map: 'c_desc'},
    ],
    buttons : [
      {label:' Price', btn:'btn-warning', icon : 'fa-usd', type:'button', width:60,
      	fn:function(idx,row){
          $scope.price_list(row);
		  },
	  },
    ], 
    itemPerPage:$scope.itemPerPage,
    predicate:'c_code', 
    reverse:false,
  }
 
 
  $scope.price_list = function(row) {
  	if( !angular.isUndefined(row) ) $scope.row = row;  
 
  $scope.opt = { 
      MODEL: $scope.MODEL, 
      location_id: $scope.MODEL['location_hq'], 
      id: $scope.MODEL['location_hq'],  
      price_level : row.id,    	
    	display:{
        	groupLable : 'ประเภทสินค้า',
			modal_title:'ราคาสินค้า > '+row.c_desc,
		}, 
		row_group : $scope.MODEL['all_item_group'],
    };
    var modalInstance = $modal.open({
      templateUrl: 'views/setting/pricelist.price.html',
      controller: 'Pricelist.price.Ctrl',
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
  
   
   
}])
.controller('Pricelist.price.Ctrl', function ($scope,$modalInstance,$modal,iAPI,options) {
  $scope.rows = null;
  $scope.MODEL = options.MODEL;
  $scope.options = {
    allowOp: 'group1,saveall',
    dataAPI: '',
    getAPI: 'product.price_list/'+'/'+options.location_id+"/"+options.price_level,
    importAPI: 'stock.import',
    transcludeAtTop: true,
    editBtn : {
		noShow:true,
	},
    cols : [
      {label: 'รหัสสินค้า', map: 'item_code'},
      {label: 'ชื่อสินค้า', map: 'item_name'},
      //{label: 'Quantity', map: 'f_quantity'},
      {label: 'หน่วย', map: 'uofm_name'},
      {label: 'ราคา', map: 'f_price', type:'textbox'},
    ],
    buttons : [
      {label:' Save', btn:'btn-primary', icon : '', type:'button', width:60,
        fn:function(idx,row){
          console.log(row)
          $scope.saveAll([row]);
      },
    }],
    display:options.display,
    group: options.row_group,
    row_group : options.row_group[0],
    filter_group : [
    	{map: 'item_group_id' },
    ],
    saveAllFn:function(rows){  
		$scope.saveAll(rows);
	},
	predicate:'item_name', 
	reverse:false,
  }
  
  $scope.options.beforeGet = function(){
  	$scope.spinner = {active : true};
  }
  $scope.options.afterGetMode = function(rows){
    $scope.spinner = {active : false};
  }
  
  
  $scope.close = function (item) {
    $modalInstance.close(item);
  };
  $scope.options.afterGet = function(rows){
  	//cheage to json
  	angular.forEach(rows, function(v,k) {
         v.f_quantity_old = v.f_quantity;
         v.f_price_old = v.f_price;
    })
      
  	//console.log("afterGet",rows);
  }
 
  $scope.saveAll = function(items) {  
    if( !angular.isUndefined(items["rows"]) ) items = items["rows"];
    //console.log("saveRowAll",items); 
    
    var data = [];
    angular.forEach(items, function(value, key) {	
		  if(value.f_quantity != value.f_quantity_old || value.f_price != value.f_price_old) 	
	 	 this.push(value);	 	
    }, data);
	 
  	console.log("saveRowAll data",data);  
    
    var url = "product.price_list_location_update/"+"/"+options.location_id; 
    iAPI.post(url,{'price_list':data}).success(function(res) {
    	//message ok
    	//return back
    	iAPI.showMessage("Save ok");
    	$modalInstance.close(items);
    });  
     
    
  }
  
  
})

//////////////////////////////////////////////////////////////////////////////////////////////
.controller('ProductCtrl', ['$scope', 'iAPI', '$modal', '$filter', '$q', '$window', function ($scope,iAPI,$modal,$filter,$q,$window) {
  
  var ConfPageTitle = { pageTitle_org : 'รายการสินค้า',
  	pageTitle_add_edit : 'สินค้า',
  	pageCaption_org : '',
  	pageTitle_edit : '',
    pageTitle_table : '',

  };
  iAPI.setConfPageTitle(ConfPageTitle);
     
  //iAPI.setPageTitle('x',iAPI.config["pageTitle_org"],iAPI.config["pageCaption_org"]);
  
  //iAPI.initProduct($scope.MODEL,true);
  //console.log($scope.MODEL);
   
  $scope.content_height=$window.innerHeight - $scope.innerHeight ; 

  $scope.flowOptions = iAPI.flowOptions;
  $scope.flowOptions.singleFile = false;
  $scope.obj = {};      // for flow object attach back to controller scope

  // $scope.uploadOk =function($file,$message) {
  //   console.log('uploadok',$file,$message)
  // }
  $scope.uploadOk =function(file,msg) {
    console.log('uploadok',file,msg)
  }

  $scope.options = {
    display : { groupLable : 'ประเภทสินค้า' , groupOrderby: ' '  }, 
    allowOp: 'view,edit,add,group1,checkbox1',
    dataAPI: 'product',
    importAPI: 'product.import',
    cols : [
      {label: 'No.', map: 'c_seq', width:60, },
      //{label: 'id', map: 'id', width:130 },
      //{label: 'c_seq', map: 'c_seq', width:130 },
      {label: 'H-CODE', map: 'hcode', width:130 },
      {label: 'รหัส', map: 'c_code', width:130 },
      {label: 'ชื่อ', map: 'c_name' },
      {label: 'สถานะ', map: 'c_hidden', width:130 },
      //{label: 'Desc', map: 'c_desc' },      
      //{label: 'd_create', map: 'd_create'}
      
    ],
    buttons : [
   //    {label:' Price', btn:'btn-danger', icon : 'fa-usd', type:'button', width:60,
   //    	fn:function(idx,row){ 
			// $scope.price_list(row);
		 //  },
	  //}, 
	  //{label:' Location', btn:'btn-danger', icon : 'fa-university', type:'button', width:70,
      //	fn:function(idx,row){ 
	  //	$scope.stock(row);
	  //  },
	  //}, 
    ],
    newRow: {
      //c_desc: 'desc default', //สร้าง default คำ
      _all_location: true
    },
    itemPerPage:$scope.itemPerPage,
    
    filter_group : [
    	{map: 'item_group_id' },
    ],
    importFlds : [
    	{col: 'c_code', data: 'product code' },
    	{col: 'c_name', data: 'product name' },
    	{col: 'c_desc', data: 'desc' },
    	{col: 'c_long_desc', data: 'long desc' },
    	{col: 'uofm_id', data: 'uofm name' },
    	{col: 'item_group_id', data: 'group name' },
    	{col: 'f_price', data: '100' },
    ],
    csv:'file/product.csv',
    predicate:'c_seq',    
    reverse:false,
    addFnForm:function(row){  
		$scope.addItems(row);
	},  
	afterPostRefresh:true,
    //group : $scope.MODEL['all_item_group'],
    //row_group : $scope.MODEL['all_item_group'][0],

	checkbox1:{ check:'0', trueValue:'', falseValue:'0', label:'Hidden', map:'chk_hidden' }, 
  }
  
   

    
  $scope.formFlds = [
      {label: 'Name', map: 'c_name' },
      {label: 'Description', map: 'c_desc' },
      //{label: 'Long_desc', map:'c_long_desc'},
      {label: 'Code (leave it blank for auto-gen code)', map: 'c_code'},
      {label: 'UPC', map: 'c_upc'}
    ]   


   
  iAPI.get('product.get_code/item_group').success(function(data) {
  	//console.log('product.get_code/item_group',data);
  	var row0 = {};
  	row0["id"]=row0["item_group_id"]=0;
  	row0["c_code"]="";row0["c_desc"]="All Group";
  	data['item_group'].splice(0,0,row0);

	$scope.options.group  = data['item_group'];
	console.log("group item_group",$scope.options.group);
	$scope.options.row_group = $scope.options.group[0];
   });

  /*
  iAPI.get('product.get_code/price_level').success(function(data) {
	$scope.price_level  = data['price_level'];
	angular.forEach($scope.price_level, function(v,k) {
         v.uofm_id = 0;
         v.f_quantity = 1;
         v.f_price = 0;
         v.price_level = v.id;
    })
   });
   */
       
  $scope.addItems = function(row) { 
 
   $scope.row={}; 
   
   $scope.row.f_perunit = 1;
   $scope.row.f_CostPrice_ReceiveUnit = 0;
   $scope.row.f_CostPrice_SendUnit = 0; 
   
   $scope.row.f_SalePrice = 0;
   $scope.row.c_seq = 1;
      
   $scope.options.item_group = $scope.MODEL['item_group'][0];
   $scope.options.uofm = $scope.MODEL['uofm'][0];
   $scope.options.receive_uofm = $scope.MODEL['uofm'][0];
 
   $scope.row.c_emp_benefit = 0;	
   $scope.row.f_AmountPerPack = 0;
   
   $scope.change_item_group();
   $scope.change_uofm();
   $scope.change_receive_uofm();
   
   $scope.options.location_uofm = $scope.options.receive_uofm_list[0];  
   $scope.change_location_uofm();
   
   $scope.options.po_uofm = $scope.options.receive_uofm_list[0];  
   $scope.change_po_uofm();
 
   $scope.price_level = angular.copy($scope.MODEL['price_level']);
   
   //get hcode 
   var parameter = { c_code: "Product" , update : false };  
   iAPI.post('product.center_get_hcode_product',parameter).success(function(data) {
   	    console.log("product.center_get_hcode_product",data) ;
   		data = angular.fromJson(data);
   		$scope.row.hcode = data.doc_no ; ;  
   });
   
   console.log("$scope.row",$scope.row);
    
  }    
   // you can tranform or provide code-table into rows here 
  $scope.options.afterGet = function(rows){     

  	angular.forEach(rows, function(v,k) {
  		 v.c_seq = parseFloat(v.c_seq);
  		 
  		 if( v.e_ishidden == "1" ){ 
  		 	v.c_hidden = "Hidden";
  		 	v.chk_hidden = "1";
  		 }
  		 else{
  		 	v.c_hidden = "" ;
  		 	v.chk_hidden = "0";  		 	
  		 }
  		 
  		 /*
  		 var c_info = angular.fromJson(v.c_info); 		
  		 if( c_info.isHidden == "1" ){ 
  		 	v.c_hidden = "Hidden";
  		 	v.chk_hidden = "1";
  		 }
  		 else{
  		 	v.c_hidden = "" ;
  		 	v.chk_hidden = "0";
  		 	
  		 }
  		 */
    })
    
   }
    
 

  // default value for new row here
  $scope.options.beforeUpdRow = function(row) {


  	/*
    if (!row.id) {	
      angular.copy($scope.options.newRow,row);
      row.item_type     = $scope.row.item_type || $scope.MODEL['item_type'][0].c_code;
      row.item_group_id = $scope.row.item_group_id || $scope.MODEL['item_group'][0].id;
      row.uofm_id       = $scope.row.uofm_id || $scope.MODEL['uofm'][0].id;
    }
    row.c_img_url_list = angular.fromJson(row.c_img_url_list || '[]');
    */
    
    var row_tmp = angular.copy(row);
    $scope.row = row_tmp;
    var c_info = angular.fromJson($scope.row.c_info);
    console.log("c_info",c_info);
    angular.forEach(c_info, function(value, key) {
		this[key] = value ;	 	
	}, $scope.row);
	
	//$scope.row.c_seq_org = angular.copy($scope.row.c_seq);
	
	if(!$scope.row.c_emp_benefit)$scope.row.c_emp_benefit = 0;
	  
	for( key in $scope.MODEL.item_group){
		if( $scope.MODEL.item_group[key].id == $scope.row.item_group_id){
			$scope.options.item_group = $scope.MODEL.item_group[key];
			break;
		}		
	}
	for( key in $scope.MODEL.uofm){
		if( $scope.MODEL.uofm[key].id == $scope.row.uofm_id){
			$scope.options.uofm = $scope.MODEL.uofm[key];
			break;
		}		
	}
	
	//var location_uofm_id = angular.copy($scope.row.location_uofm_id);
	//var po_uofm_id = angular.copy($scope.row.po_uofm_id);
	
	$scope.create_uofm($scope.row.uofm_id);
  	$scope.row.receive_uofm = angular.copy($scope.confUofm.receive_uofm);
  	$scope.row.receive_uofm_show = angular.copy($scope.confUofm.receive_uofm_show); 
	
	$scope.options.receive_uofm_list = angular.copy($scope.row.receive_uofm);
		
	//$scope.row.location_uofm_id = location_uofm_id;
	//$scope.row.po_uofm_id = po_uofm_id;
	

	//$scope.options.receive_uofm_list = angular.copy($scope.row.receive_uofm);
	//alert($scope.row.location_uofm_id);
	for( key in $scope.options.receive_uofm_list){
		if( $scope.options.receive_uofm_list[key].id == $scope.row.location_uofm_id){			
			$scope.options.location_uofm = $scope.options.receive_uofm_list[key];
			
			$scope.row.c_location_uofm_name = $scope.options.location_uofm.c_desc;  	
		  	$scope.row.c_location_f_factor = $scope.options.location_uofm.f_factor; 
		  				
			break;
		}		
	}
	//alert($scope.row.po_uofm_id);
	for( key in $scope.options.receive_uofm_list){
		if( $scope.options.receive_uofm_list[key].id == $scope.row.po_uofm_id){
			$scope.options.po_uofm = $scope.options.receive_uofm_list[key];
			
			$scope.row.c_po_uofm_name = $scope.options.po_uofm.c_desc;  	
  			$scope.row.c_po_f_factor = $scope.options.po_uofm.f_factor;    	
  	
			break;
		}		
	}
	
	

  	
  	
	//วิ่งไปหา ผังราคา
	//alert('product.price_list/'+$scope.row.id+'/1');
	iAPI.get('product.price_list/'+$scope.row.id+'/1').success(function(data) {
	  	console.log('product.price_list/'+$scope.row.id,data);
	  	$scope.price_level = data;
   });
	
  }

  // validate here return false to stop proceeding
  $scope.options.beforePost = function(row) {
  	
  	if(!row.c_code){
  		alert("กรุณากรอกรหัส")
  		return  false ;	
  	}
  	
  	if (!row.id) {	
 	  	//check barcode ซ้ำด้วย
 	  	for(k in $scope.rows){
			var v = $scope.rows[k];
			if( v.c_code == row.c_code ){
				alert("รหัสซ้ำ !!")
	  			return  false ;				
			}
		}
	   
    }
    
    
  	if(!row.c_name){
  		alert("กรุณากรอกชื่อ")
  		return  false ;	
  	}
  	
  	$scope.row.c_name = $scope.chkTextError(angular.copy(row.c_name));

    // if(!row.hcode){
    //   alert("กรุณากรอก H-CODE")
    //   return  false ; 
    // }

    if(!row.item_group_id){
      alert("กรุณาเลือกประเภทสินค้า")
      return  false ; 
    }

    if(!row.receive_uofm_id){
      alert("กรุณาเลือกหน่วยรับ")
      return  false ; 
    }

    if(!row.uofm_id){
      alert("กรุณาเลือกหน่วยจ่าย")
      return  false ; 
    }
  	
  	// if(!row.c_code){
  	// 	alert("BarCode do must input")
  	// 	return  false ;	
  	// }  	

	angular.forEach($scope.price_level, function(v,k) {
		if(v.price_level=='202') $scope.row.f_SalePrice = v.f_price ; 
		//if(v.price_level=='204') $scope.row.f_CostPrice_SendUnit = v.f_price ; 
		if(v.price_level=='204') $scope.row.f_CostPrice_ReceiveUnit = v.f_price ; 
		
	})
  	
   	if (!row.id ){ 
 	   		
		angular.forEach($scope.price_level, function(v,k) {
			v.uofm_id       = row.uofm_id || $scope.MODEL['uofm'][0].id;
		})
		angular.forEach($scope.location_branch, function(v,k) {
			v.uofm_id       = row.uofm_id || $scope.MODEL['uofm'][0].id;
		})			
		$scope.row.price_level = $scope.price_level;
		$scope.row.location_branch = $scope.location_branch;
		
		//fix ราคาของสาขา 205
		
		$scope.row.item_type='Sales-Inventory';
		
		if( $scope.row.c_seq_org != $scope.row.c_seq)
			$scope.options.afterPostRefresh = true;
		else $scope.options.afterPostRefresh = false;
		
	}else{
		$scope.row.price_level = $scope.price_level;
	}
	//console.log("price_level",$scope.price_level);
	//console.log("location_branch",$scope.location_branch);
    //return false ;
   
   	delete $scope.row.receive_uofm ;
   	delete $scope.row.receive_uofm_show ;
   	
   	delete $scope.row.c_hidden ;
   	delete $scope.row.chk_hidden;
   	delete $scope.row.isHidden;
  	//$scope.row.receive_uofm_show = angular.copy($scope.confUofm.receive_uofm_show); 
  	
  	//alert($scope.row.item_group_id );
  	if(!$scope.row.c_emp_benefit)$scope.row.c_emp_benefit = 0;
    
    //alert($scope.row.c_location_uofm_name)  ; 
    
    console.log("beforePost",row);
    
    return true;
  }
  
  $scope.options.afterPost = function(row){
  	
  	if( row.e_ishidden == "1" ){ 
	 	row.c_hidden = "Hidden";
	 	row.chk_hidden = "1";
	 }
	 else{
	 	row.c_hidden = "" ;
	 	row.chk_hidden = "0";  		 	
	 }
  		 
  	 /*	 
  	 var c_info = angular.fromJson(row.c_info); 		
	 if( c_info.isHidden == "1" ){ 
	 	row.c_hidden = "Hidden";
	 	row.chk_hidden = "1";
	 }
	 else{
	 	row.c_hidden = "" ;
	 	row.chk_hidden = "0";
	 	
	 }
	 */
  		
  }
  
  $scope.change_item_group = function() {
  	$scope.row.item_group_id = $scope.options.item_group.id;
  	//$scope.row.c_item_group_name = $scope.options.item_group.c_desc;  	  	
  }
  
  $scope.change_uofm = function() {
  	$scope.row.uofm_id = $scope.options.uofm.id;
  	$scope.row.c_uofm_name = $scope.options.uofm.c_desc; 
  	$scope.row.c_uofm_f_factor = $scope.options.uofm.f_factor; 
  	
  	$scope.row.receive_uofm_id = $scope.options.uofm.id;
  	$scope.row.c_receive_uofm_name = $scope.options.uofm.c_desc;
  	$scope.row.c_receive_uofm_f_factor = $scope.options.uofm.f_factor; 
  	
  	$scope.row.receive_uofm = [];
  	$scope.row.receive_uofm_show = "";
  	
  	$scope.create_uofm($scope.row.uofm_id);
  	$scope.row.receive_uofm = angular.copy($scope.confUofm.receive_uofm);
  	$scope.row.receive_uofm_show = angular.copy($scope.confUofm.receive_uofm_show); 
	
	$scope.options.receive_uofm_list = angular.copy($scope.row.receive_uofm);
	
	$scope.options.location_uofm = $scope.options.receive_uofm_list[0]; 
	$scope.change_location_uofm(); 
	
	$scope.options.po_uofm = $scope.options.receive_uofm_list[0]; 
	$scope.change_po_uofm(); 
	 
  	 	  	
  } 
  $scope.change_receive_uofm = function() {
  	//$scope.row.receive_uofm_id = $scope.options.uofm.id;
  	//$scope.row.c_receive_uofm_name = $scope.options.uofm.c_desc; 	
  	//$scope.row.c_receive_uofm_f_factor = $scope.options.uofm.f_factor;   	
  } 
   
  $scope.change_location_uofm = function() {
  	$scope.row.location_uofm_id = $scope.options.location_uofm.id;
  	$scope.row.c_location_uofm_name = $scope.options.location_uofm.c_desc;  	
  	$scope.row.c_location_f_factor = $scope.options.location_uofm.f_factor; 
  	//alert($scope.row.c_location_uofm_name)  ; 	
  }
  $scope.change_po_uofm = function() {
  	$scope.row.po_uofm_id = $scope.options.po_uofm.id;
  	$scope.row.c_po_uofm_name = $scope.options.po_uofm.c_desc;  	
  	$scope.row.c_po_f_factor = $scope.options.po_uofm.f_factor;    	
  } 
  ///////////////////////////////////////////////////////////
  
  

  $scope.openModal = function (tabName) {
  	console.log(tabName,$scope.MODEL[tabName]);
    $scope.opt = { rows: $scope.MODEL[tabName]};
    if('item_matrix'==tabName){
    	$scope.opt.unq_matrix = $scope.MODEL["unq_matrix"];    	
    }else if('item_group'==tabName){
    	 $scope.opt.display={
		 	modal_title: "Group",
		 }
    }else if('uofm'==tabName){
    	 $scope.opt.display={
		 	modal_title: "Unit",
		 }
    }
    var modalInstance = $modal.open({
      templateUrl: 'views/setting/product.'+tabName+'.html',
      controller: 'Product.'+tabName+'.Ctrl',
      size: 'lg',
      scope:$scope,
      resolve: {
        options: function () {
          return $scope.opt;
        }
      }
    });
    modalInstance.result.then(function (item) {
      if (item.id !=-1)
        $scope.row[tabName+'_id'] = item.id;
        
      $scope.MODEL[tabName] = item.rows;
      if('item_group'==tabName){
	  	var row0 = [];
  		row0["id"]=row0["item_group_id"]=0;
  		row0["c_code"]="";row0["c_desc"]="All";
  		item.rows.splice(0,0,row0);
  	
		$scope.options.group  = item.rows;
		$scope.options.row_group = $scope.options.group[0];
	  }
         
    });
  }

  $scope.price_list = function(row) {
  	if( !angular.isUndefined(row) ) $scope.row = row;
  
  	/*
    var row_group = [];
    var row0 = [];
  	row0["id"]=row0["price_level"]=0;
  	row0["c_code"]="";row0["c_desc"]="All List";
    row_group.push(row0);
	angular.forEach($scope.MODEL['price_level'], function(value, key) {	 	
	    row0 = value;
	    row0["price_level"]=value["id"];
	 	this.push(row0);	 	
	}, row_group);
	*/
 
  	//console.log('price_list group',data);  	
  	//console.log('price_list group',$scope.MODEL);
  	//console.log('price_list group',$scope.MODEL['all_price_level']);   
	
    $scope.opt = { MODEL: $scope.MODEL, id: $scope.row.id, 
        item_id: $scope.row.id,      	
    	display:{
			modal_title:'Price @Branch',
		}, 
		row_group : $scope.MODEL['all_price_level'],  
    };
    var modalInstance = $modal.open({
      templateUrl: 'views/settng/product.price.html',
      controller: 'Product.price.Ctrl',
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

  $scope.stock = function(row) {  	
  	if( !angular.isUndefined(row) ) $scope.row = row;
  	
    $scope.opt = { MODEL: $scope.MODEL, id: $scope.row.id,  
    	item_id: $scope.row.id,  
    	display:{
			modal_title:'Stock @Branch',
		},
    };
    var modalInstance = $modal.open({
      templateUrl: 'views/setting/product.stock.html',
      controller: 'Product.stock.Ctrl',
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


  $scope.setting = function(rows){
  
	  if($window.innerWidth<992){
	    $scope.smallScreen = true;
	  }
	   
	 //$scope.options.group = $scope.MODEL['all_item_group'];
     //$scope.options.row_group = $scope.MODEL['all_item_group'][0];
    
  }
   
  $scope.setting();
  
  
      
    
    
  
}])


//////////////////////////////////////////////////////////////////////////////////////////////
.controller('Product.price.Ctrl', function ($scope,$modalInstance,$modal,iAPI,options) {
  $scope.rows = null;
  $scope.MODEL = options.MODEL; 
  options.display.groupLable = "List";
  $scope.options = {
    allowOp: 'view,edit,delete,add,import,export,group1',
    dataAPI: '',
    getAPI: 'product.price_list/'+options.item_id+"/"+$scope.MODEL['location_hq'] ,
    saveAPI: 'product.price_list_post/'+options.item_id,
    importAPI: 'product.price_list_import/'+ options.item_id +'/',
    transcludeAtTop: true,
    cols : [
      //{label: 'id', map: 'id'},
      //{label: 'location', map: 'location_id'},
      {label: 'Location', map: 'location_name'},
      //{label: 'd_start', map: 'd_start' },      
      {label: 'List', map: 'price_level_name'},
      {label: 'Quantity', map: 'f_quantity'},
      //{label: 'uofm_id', map: 'uofm_id'},
      {label: 'Unit', map: 'uofm_name'},
      {label: 'Price', map: 'f_price'}
    ],
    formFlds : [
      {label: 'Date start', map: 'd_start' },
      {label: 'Quantity', map: 'f_quantity', type:'number'},
      {label: 'Price', map: 'f_price', type:'number'}
    ],
    importFlds : [
    	{col: 'item_id', data: '15' },
    	{col: 'location_id', data: '12' },
    	{col: 'uofm_id', data: '11' },
    	{col: 'f_quantity', data: '1' },
    	{col: 'f_price', data: '100' },
    ],
    csv:'file/price.csv',
    display:options.display,
    group: options.row_group,
    row_group : options.row_group[0],
    filter_group : [
    	{map: 'price_level' },
    ],
    
  }
   
   
  $scope.close = function (item) {
    $modalInstance.close(item);
  };
  $scope.options.beforePost = function(row) {
  	//console.log(row);
  	//return false ;
  	
    row['currency_code'] = 'THB';
    console.log(row);
    return true;
  }
})
.controller('Product.stock.Ctrl', function ($scope,$modalInstance,$modal,options) {
  $scope.rows = null;
  $scope.MODEL = options.MODEL;
  $scope.options = {
    allowOp: 'export',
    dataAPI: 'stock/'+ options.item_id +'/',
    importAPI: 'stock.import',
    transcludeAtTop: true,
    cols : [
      //{label: 'id', map: 'id'},
      //{label: 'location', map: 'location_id'},
      //{map: 'i_min' },
      //{map: 'i_max'},
      {label: 'No.', map: 'id', width:60, format:'index', },
      //{label: 'location-id', map: 'id', width:80, },
      {label: 'H-CODE', map: 'location_hcode', width:100, },
      {label: 'ชื่อย่อ', map: 'location_code', width:100, },
      {label: 'ชื่อ', map: 'location_name' },
      {label: 'จำนวนคงเหลือ', map: 'i_available', width:120},
       
    ],
    display:options.display,
  }
  $scope.close = function (item) {
    $modalInstance.close(item);
  };
})
.controller('Product.item_matrix.Ctrl', function ($scope,$modalInstance,$modal,options) {
  $scope.rows = options.rows;
  $scope.unq_matrix = options.unq_matrix ;
  $scope.options = {
    allowOp: 'view,update,delete,add,import,export',
    dataAPI: 'db/item_matrix',
    importAPI: 'db/item_matrix.import',
    transcludeAtTop: true,
    cols : [
      //{label: 'id', map: 'id'},
      {label: 'Matrix Dimension', map: 'matrix_dimension'},
      {label: 'Code', map: 'c_code'},
      {label: 'Name', map: 'c_desc' },
      //{label: 'd_create', map: 'd_create'}
    ],
    formFlds : [
      {label: 'Matrix', map: 'matrix_dimension'},
      {label: 'Code', map: 'c_code'},
      {label: 'Desc', map: 'c_desc' },
    ],
    /*
    importFlds : [
    	{col: 'c_code', data: 'G001' },
    	{col: 'c_desc', data: 'Group1' }, 
    ],
    */
    //csv:'file/item_group.csv',
  }
  $scope.close = function (item) {
    $modalInstance.close(item);
  };
})



//////////////////////////////////////////////////////////////////////////////////////////////
.controller('Product.item_group.Ctrl', function ($scope,$modalInstance,$modal,options) {
  $scope.rows = options.rows;
  $scope.options = {
    allowOp: 'view,edit,delete',
    dataAPI: 'db/item_group',
    importAPI: 'db/item_group.import',
    transcludeAtTop: true,
    cols : [
      {label: 'No.', map: 'id'},
      {label: 'รหัส', map: 'c_code'},
      {label: 'ชื่อ', map: 'c_desc' },
      //{label: 'd_create', map: 'd_create'}
    ],
    formFlds : [
      {label: 'รหัส', map: 'c_code'},
      {label: 'ชื่อ', map: 'c_desc' },
    ],
    importFlds : [
    	{col: 'c_code', data: 'G001' },
    	{col: 'c_desc', data: 'Group1' }, 
    ],
    csv:'file/item_group.csv',
    display:options.display, 
    predicate:'id', 
    reverse:false,
  }
  $scope.close = function (item) {
    $modalInstance.close(item);
  };
})
.controller('Product.uofm.Ctrl', function ($scope,$modalInstance,$modal,options) {
  $scope.rows = options.rows;
  console.log("scope.rows",$scope.rows);
  $scope.options = {
    allowOp: 'view,edit,add',
    dataAPI: 'db/uofm',
    importAPI: 'db/uofm.import',
    cols : [
      {label: 'No.', map: 'id', width:60, format:'index', },
      {label: 'รหัส', map: 'c_code'},
      {label: 'ชื่อ', map: 'c_desc' },
      {label: 'Per Unit', map: 'f_factor' },
      //{label: 'd_create', map: 'd_create'}
    ],
    /*
    formFlds : [
      {label: 'รหัส', map: 'c_code'},
      {label: 'ช์่อ', map: 'c_desc' },
      {label: 'Per Unit', map: 'f_factor' },
    ],
    */
    importFlds : [
    	{col: 'c_code', data: '001' },
    	{col: 'c_desc', data: 'unit 1' },
    	{col: 'f_factor', data: '1' },
    ],
    csv:'file/uofm.csv',
    display:options.display,
    predicate:'c_desc', 
    reverse:false,
    addFnForm:function(row){  
			$scope.addItems(row);
		 },
  }
  
  $scope.addItems = function(row) { 

   $scope.row = {};
   $scope.row.f_factor=1;
  }

  $scope.delete_msg = function() { 
  
	$scope.row.c_name = $scope.row.c_desc ;
	$scope.options.display = {};
	$scope.options.display.message1 = "ต้องการซ่อนหน่วย : " + $scope.row.c_desc;
	$scope.options.display.confirmTitle = "ยืนยันการซ่วนหน่วย";
  };      
 
  $scope.delete_action = function() {
	
	url = 'db/uofm/'+$scope.row.id;
	iAPI.delete(url,$scope.row).success(function(res) {
		$scope.theRefashFn();
	});	
		
  }; 
  $scope.setDelFn = function(theDelFn) { 
      $scope.theDelFn = theDelFn;
  }; 
  $scope.setRefashFn = function(theRefashFn) {
      $scope.theRefashFn = theRefashFn;
  };
    
  $scope.close = function (item,rows) {
  	//console.log(item);
    $modalInstance.close(item);
  };
})

.controller('Item_groupCtrl', ['$scope', 'iAPI', '$modal', function ($scope,iAPI,$modal) {
  var ConfPageTitle = { pageTitle_org : 'ประเภทสินค้า',
  	pageTitle_add_edit : 'ประเภทสินค้า',
  	pageCaption_org : '',
  	pageTitle_edit : '',
    pageTitle_table : '',
  };
  iAPI.setConfPageTitle(ConfPageTitle);
  
  	 
  $scope.options = {	
    allowOp: 'view,add,edit',
    dataAPI: 'db/item_group',
    importAPI: 'db/item_group.import',
    transcludeAtTop: true,
    cols : [
      {label: 'No.', map: 'id', width:60, format:'index', },
      {label: 'รหัส', map: 'c_code', width:130},
      {label: 'ชื่อ', map: 'c_desc' },
      //{label: 'd_create', map: 'd_create'}
    ],
    /*
    formFlds : [
      {label: 'รหัส', map: 'c_code'},
      {label: 'ชื่อ', map: 'c_desc' },
    ],
    */
    importFlds : [
    	{col: 'c_code', data: 'G001' },
    	{col: 'c_desc', data: 'Group1' }, 
    ],
    csv:'file/item_group.csv',
    itemPerPage:$scope.itemPerPage,
    predicate:'c_code', 
    reverse:false,
    addFnForm:function(row){  
			$scope.addItems(row);
		 },
  }
  
  $scope.addItems = function(row) { 
     
    $scope.row={};
    $scope.row.c_branch_add_stock = "1" ;
    $scope.row.c_cal_stock = "2" ;
    
    $scope.tmp_row = {};
   
  }
  
  $scope.options.beforeUpdRow = function(row) { 
  	$scope.tmp_row = angular.copy(row);  
  }
  
  $scope.options.afterPost = function(row){
  	
  	//console.log("tmp_row",$scope.tmp_row);
  	if( angular.isUndefined($scope.tmp_row.id) ) return;  		
  	
  	if( $scope.tmp_row.c_branch_add_stock == row.c_branch_add_stock ) return;
  	
  	//alert("666");
  	//update ทุกอันที่ที่เป็นหมวด
  	//alert($scope.tmp_row.c_branch_add_stock + " " + row.c_branch_add_stock );
  	
  	
  	var url = 'product.item_group_branch_add_stock';
	var	data = {};
	data.item_group_id = row.id;
	data.c_branch_add_stock = row.c_branch_add_stock ;
	data.c_branch_add_stock_old = $scope.tmp_row.c_branch_add_stock ;
	iAPI.post(url,data).success(function(res) {
					
	}); 		
		
  }
  
}])
.controller('UofmCtrl', ['$scope', 'iAPI', '$modal', function ($scope,iAPI,$modal) {
  var ConfPageTitle = { pageTitle_org : 'หน่วย',
  	pageTitle_add_edit : 'หน่วย',
  	pageCaption_org : '',
  	pageTitle_edit : '',
    pageTitle_table : '',
  };
  iAPI.setConfPageTitle(ConfPageTitle);
   
   $scope.options = {	
    allowOp: 'view,edit,add',
    dataAPI: 'db/uofm',
    importAPI: 'db/uofm.import',
    getAPI:'product.get_uofm',
    cols : [
      {label: 'No.', map: 'c_seq', width:60, format:'index', },
      {label: 'รหัส', map: 'c_code', width:130},
      {label: 'ชื่อ', map: 'c_desc' }, 
      {label: 'ตัวคูณ', map: 'f_factor_show', width:100 },
      //{label: 'c_seq', map: 'c_seq'}
    ],
 
    importFlds : [
    	{col: 'c_code', data: '001' },
    	{col: 'c_desc', data: 'unit 1' },
    	{col: 'f_factor', data: '1' },
    ],
    csv:'file/uofm.csv',
    itemPerPage:$scope.itemPerPage, 
    addFnForm:function(row){  
			$scope.addItems(row);
		 },
	editBtn : {
		icon:' ',
		label:'Edit',
		click:0,  
	},
	viewBtn : {
		show:false,
	},
	rowBtn : {
		show:true,
		click:0,
	},
	predicate:'c_seq', 
	noPedicate:true, 
	reverse:true,
	afterPostRefresh:true,
  }


 $scope.options.chgMode = function() {
  	$scope.options.editBtn.click = 0;
  	$scope.options.rowBtn.click = 0;
  }
  
  $scope.addItems = function(row) { 
   $scope.row = {};
   $scope.row.f_factor=1;
   $scope.row.i_parent=0;	
  }
    
  $scope.options.afterGet = function(rows){
  	angular.forEach(rows, function(v,k) { 
  		v.c_seq = parseInt(v.c_seq);
  		if(v.i_parent=='0'){
	        v.rowBtn = {
	          icon:' ',
	          label:'Add',  
	        };	
	        v.f_factor_show = ""; 
		}else{
			v.space = "c_desc"; 
			v.rowBtn = {
	          noShow:true,  
	        };
	        v.f_factor_show = v.f_factor + " " + v.c_factor_name ;
		}
    })
  }
   
  $scope.options.beforeUpdRow = function(row,setClick) { 
	iAPI.config["pageTitle_edit"] = "แก้ไข";
	
	if( setClick == "rowBtn" ){
		if(row.i_parent=='0'){
			iAPI.config["pageTitle_edit"] = "เพิ่ม";
			
	  		var i_parent = angular.copy(row.id);
			$scope.row = {};
	   		$scope.row.f_factor=1;
	   		$scope.row.i_parent=i_parent;	   		
	   		$scope.row.c_factor_name = angular.copy(row.c_desc);
	   		row = $scope.row;
		}
	} 
  	
  } 
   
  $scope.options.beforePost = function(row) {  	
  
   	  if(!row.c_desc){
  		alert("กรุณากรอกชื่อหน่วย")
  		return  false ;	
  	  } 
  	  /*
  	  //2015-11-25 เอาเรื่องซื่อซ้ำออก
   	  for( i in $scope.rows){
   	  	//alert( $scope.rows[i].c_desc + " " + row.c_desc  + " | " + $scope.rows[i].i_parent + " " + row.i_parent )
	  	if( $scope.rows[i].c_desc == row.c_desc 
	  			&& $scope.rows[i].i_parent == row.i_parent 
	  			&& row.i_parent != 0
	  			&& $scope.rows[i].id != row.id ){
			alert("ชื่อซ้ำ !!!");
			return false;
		}
	  }    
	  */
	  
	  
      delete row.rowBtn;
   	  delete row.space;
   	  delete row.f_factor_show;
   	  delete row.c_seq;
   	     	     	  
   	  return true;
  }

  $scope.options.afterPost = function(row){
  	
  	if(row.i_parent=='0'){
        row.rowBtn = {
          icon:' ',
          label:'Add',  
        };	
        row.f_factor_show = ""; 
	}else{
		row.space = "c_desc"; 
		row.rowBtn = {
          noShow:true,  
        };
        row.f_factor_show = row.f_factor + " " + row.c_factor_name ;
	}
	
	iAPI.getMODEL($scope.MODEL,'uofm'); 
	iAPI.getMODEL($scope.MODEL,'receive_uofm'); 
	 
	  
  }
  
    
  $scope.delete_msg = function() { 
  
	$scope.row.c_name = $scope.row.c_desc ;
	$scope.options.display = {};
	$scope.options.display.message1 = "ต้องการซ่อนหน่วย : " + $scope.row.c_desc;
	$scope.options.display.confirmTitle = "ยืนยันการซ่วนหน่วย";
  };      
 
  $scope.delete_action = function() {
	
	url = 'db/uofm/'+$scope.row.id;
	iAPI.delete(url,$scope.row).success(function(res) {
		$scope.theRefashFn();
	});	
		
  }; 

  $scope.setDelFn = function(theDelFn) { 
      $scope.theDelFn = theDelFn;
  }; 
  $scope.setRefashFn = function(theRefashFn) {
      $scope.theRefashFn = theRefashFn;
  };
  
}])




//////////////////////////////////////////////////////////////////////////////////////////////
.controller('SupplierCtrl', ['$scope', 'iAPI', '$modal', '$filter', '$q', '$window', function ($scope,iAPI,$modal,$filter,$q,$window) {
  var ConfPageTitle = { pageTitle_org : 'รายการผู้จัดจำหน่าย',
  	pageTitle_add_edit : 'ผู้จัดจำหน่าย',
  	pageCaption_org : '',
  	pageTitle_edit : ' ',
    pageTitle_table : '',
  };
  iAPI.setConfPageTitle(ConfPageTitle);
   
  $scope.options = {	
    allowOp: 'view,edit,add',
    dataAPI: 'db/vendor',
    cols : [
      {label: 'No.', map: 'id', width:60, format:'index', },
      {label: 'รหัส', map: 'c_code', width:130},
      {label: 'ชื่อ', map: 'c_name' },    
      {label: 'ที่อยู่', map: 'c_setting' , map2:'c_address' },   
      {label: 'ผู้ติดต่อ', map: 'c_setting' , map2:'c_contact' },
      {label: 'เบอร์โทร', map: 'c_setting' , map2:'c_tel' },
    ],    
    importFlds : [
    	{col: 'c_code', data: 'SP001' },
    	{col: 'c_name', data: 'Supplier1' },   
    ],
    csv:'file/supplier.csv',
    itemPerPage:$scope.itemPerPage,
    predicate:'c_code', 
    reverse:false,
    buttons : [
    	// { label: ' Price', btn:'btn-danger', icon : 'fa-usd',
    	//   fn:function(idx,row){
     //      $scope.items(row);
     //    },
     //  }, 
    ],
    addFnForm:function(row){  
			$scope.addItems(row);
		 }, 
  }

  $scope.addItems = function(row) { 
  
   $scope.row={};
   $scope.row.c_setting={};
   $scope.row.c_setting.c_address="";
   $scope.row.c_setting.c_zip="";
   $scope.row.c_setting.c_contact="";
   $scope.row.c_setting.tax_number="";
   $scope.row.c_setting.c_location_name="";
   $scope.row.c_setting.c_location_mm="0";
   
  }  
  
  
  $scope.options.afterGet = function(rows){
  	//cheage to json
  	angular.forEach(rows, function(v,k) {
  		//console.log(k,v.c_setting);
        v.c_setting = angular.fromJson(v.c_setting);
    })
      
  	//console.log("afterGet",rows);
  }
  $scope.options.afterPost = function(row){
  	//cheage to json
  	//console.log("afterPost888",row);
    row.c_setting = angular.fromJson(row.c_setting);      
  	//console.log("afterPost",row);
  	
  	iAPI.getMODEL($scope.MODEL,'vendor'); 
  }

    
    // validate here return false to stop proceeding
  $scope.options.beforePost = function(row) {
  	
  	if(!row.c_name){
  		alert("Name do must input")
  		return  false ;	
  	}	
  	$scope.row.c_name = $scope.chkTextError(angular.copy(row.c_name));
  	
  	 

  	if( row.c_setting.c_address != ""){
  		$scope.row.c_setting.c_address = $scope.chkTextError(angular.copy(row.c_setting.c_address)); 
	}
  	
  	$scope.row.c_setting = angular.toJson(row.c_setting, false);
    //console.log("beforePost",$scope.row);
  	return true;
  }
  
  /*
 $scope.formFlds = [
      {label: 'รหัส', map: 'c_code'},
      {label: 'ชื่อ', map: 'c_name' },  
      {label: 'ที่อยู่', map: 'c_setting' , map2:'c_address', type: 'textarea', row: 5 },
      {label: 'รหัสไปรษณีย์', map: 'c_setting' , map2:'c_zip' },
      {label: 'ผู้ติดต่อ', map: 'c_setting' , map2:'c_contact' },
      {label: 'เบอร์โทร', map: 'c_setting' , map2:'c_tel' },
      {label: 'เลขประจำตัวผู้เสียภาษี', map: 'c_setting' , map2:'tax_number' },
  ]
  */
 
  $scope.delete_msg = function() { 
  
	$scope.row.c_name = $scope.row.c_name ;
	$scope.options.display = {};
	$scope.options.display.message1 = "ต้องการซ่อนผู้จัดจำหน่วย : " + $scope.row.c_name;
	$scope.options.display.confirmTitle = "ยืนยันการซ่วนผู้จัดจำหน่วย";
  };      
 
  $scope.delete_action = function() {
	
	url = 'db/vendor/'+$scope.row.id;
	iAPI.delete(url,$scope.row).success(function(res) {
		$scope.theRefashFn();
	});	
		
  }; 
  $scope.setDelFn = function(theDelFn) { 
      $scope.theDelFn = theDelFn;
  }; 
  $scope.setRefashFn = function(theRefashFn) {
      $scope.theRefashFn = theRefashFn;
  };
     
  $scope.items = function(row) {
  	if( !angular.isUndefined(row) ) $scope.row = row;
  	 
    $scope.opt = { vendor_id: $scope.row.id, 
    	id: $scope.row.id, 
    	parentRow:$scope.row,
    	display:{
			modal_title:'สินค้าตามผู้จัดจำหน่าย',
		},
		group:$scope.MODEL['all_item_group'],
		row_group:$scope.MODEL['all_item_group'][0],
    }; 
    var modalInstance = $modal.open({
      templateUrl: 'views/setting/supplier.item.html',
      controller: 'Supplier.item.Ctrl',
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
  
}])
.controller('Supplier.item.Ctrl', function ($scope,$modalInstance,$modal,iAPI,options) {
  $scope.rows = null;
  $scope.options = {
    allowOp: 'saveall,group1',
    dataAPI: '' ,
    transcludeAtTop: true,
    getAPI: 'product.vendor_item/'+options.vendor_id ,
    saveAPI: '',
    cols : [
      {label: 'รหัส', map: 'item_code'},
      {label: 'ชื่อ', map: 'item_name'},
      {label: 'หน่วย', map: 'unit_name'},
      {label: 'ราคา/หน่วยรับ', map: 'f_min_order_amt', type:'textbox'}, 
      {label: 'จำนวนสั่งขั้นต่ำ', map: 'f_min_order_unit', type:'textbox'},  
      //{label: 'จำนวนสั่งสูงสุด', map: 'f_max_order_amt', type:'textbox'},               
      {label:' ลบ', btn:'btn-danger', icon : 'ion-close', type:'button',
    	  fn : 'delItemSelect',
    	  /*	
    	  fn:function(idx,row){ 
			$scope.delItemFn(row);
		  },
		  */
		}, 
	  //{label: 'chk_del', map: 'chk_del'},    
       
    ],
    editBtn : {
		noShow:true,
	},
	filter_group : [
    	{map: 'item_group_id' },
    ],
    predicate:'item_name', 
    reverse:false,
    
    display:options.display,
    parentRow:options.parentRow, 
    addFn:function(row){  
			$scope.addItems(row);
		 },
	saveAllFn:function(rows){  
			$scope.saveAll(rows);
		 },
		 
	group:options.group, 
	row_group:options.row_group, 
 
  }
  $scope.options.display.groupLable = "ประเภทสินค้า";
  

  $scope.close = function (item) {
    $modalInstance.close(item);
  };
  
  $scope.saveAll = function(items) {  
    if( !angular.isUndefined(items["rows"]) ) items = items["rows"];
    //console.log("saveRowAll",items); 
    
    var data = [];
	angular.forEach(items, function(value, key) {	 	
	 	this.push(value);	 	
	}, data);
	 
  	console.log("saveRowAll data",data);  
    
    var url = "product.vendor_item_update"; 
    iAPI.post(url,{'items':data}).success(function(res) {
    	
    });  
    $modalInstance.close(items);
    
  }
  
 
      
  $scope.delItemFn = function(row) {  
  	//alert( row.id );
  	$scope.delItems[row.id]=row;
  	
  };
     
  $scope.setRefashFn = function(theRefashFn) {
      $scope.theRefashFn = theRefashFn;
  };
  
  $scope.addItems = function(row) { 
    $scope.opt = { vendor_id: row.id, 
    	id: row.id, 
    	parentRow:$scope.options.parentRow,
    	row_group : $scope.MODEL['all_item_group'],
    	display:{
			modal_title:'สินค้าตามผู้จัดจำหน่าย',
		},
    }; 
    var modalInstance = $modal.open({
      templateUrl: 'views/setting/supplier.item.add.html',
      controller: 'Supplier.item.add.Ctrl',
      size: 'lg',
      resolve: {
        options: function () {
          return $scope.opt;
        }
      }
    });
    modalInstance.result.then(function (items) {
    	$scope.theRefashFn();
    });
  } 
  
  //$scope.getData();
  
})
.controller('Supplier.item.add.Ctrl', function ($scope,$modalInstance,$modal,iAPI,options) {
  $scope.rows = null;
  $scope.options = {
    allowOp: 'group1',
    dataAPI: '' ,
    transcludeAtTop: true,
    getAPI: 'product.vendor_item_add_product_list/'+options.vendor_id ,
    saveAPI: '',
    cols : [
      {label: 'เลือก', map: 'chk_item_id',type:'checkbox', width:70},      
      {label: 'ลำดับ', map: 'c_seq'},
      {label: 'รหัส', map: 'item_code'},
      {label: 'ชื่อ', map: 'item_name'},
      //{label: 'ชุดของหน่วย', map: 'receive_uofm_show'},
      {label: 'หน่วย PO MM', map: 'c_po_uofm_name'},
            
    ],
    predicate:'c_seq', 
    reverse:false,
    editBtn : {
		noShow:true,
	},
    display:options.display,
    parentRow:options.parentRow,
    saveAllFn:function(rows){  
			$scope.saveAll(rows);
		 },
	group: options.row_group,
    row_group : options.row_group[0],
    filter_group : [
    	{map: 'item_group_id' },
    ],
  }

  $scope.options.display.groupOrderby = " ";
  $scope.options.display.groupLable = "ประเภทสินค้า";

  $scope.options.beforeGet = function(){
  	$scope.spinner = {active : true};
  }
  $scope.options.afterGetMode = function(rows){
    $scope.spinner = {active : false};
  }
  
  $scope.options.afterGet = function(rows){
     
  	angular.forEach(rows, function(v,k) {
  		//console.log("c_info" + v.item_id ,v.c_info);
  		var c_info = angular.fromJson(v.c_info);
  		console.log("c_info11",v);
  		
  		v.main_uofm_id = v.uofm_id;
  		//v.uofm_id = v.po_uofm_id;
  		
  		/*
  		if( !angular.isUndefined(c_info.receive_uofm_show)){
			v.receive_uofm_show = c_info.receive_uofm_show;
			v.receive_uofm = c_info.receive_uofm;			
		}  			
  		else{
			v.receive_uofm_show = c_info.c_po_uofm_name ;
			v.receive_uofm = [{id:v.po_uofm_id,
				c_desc:c_info.c_po_uofm_name,
				c_desc_show:c_info.c_po_uofm_name,
				f_factor:c_info.c_po_f_factor}];
			//console.log("receive_uofm_show",v.receive_uofm_show);
		}
		*/
		
		v.c_po_uofm_name = c_info.c_uofm_name ;
		if( !angular.isUndefined(c_info.c_po_uofm_name)){
			if(parseFloat(c_info.c_po_f_factor) != 1) 
				v.c_po_uofm_name = c_info.c_po_uofm_name+"("+parseFloat(c_info.c_po_f_factor)+ c_info.c_uofm_name+")" ;
			else
				v.c_po_uofm_name = c_info.c_po_uofm_name ;
		}
				
  		v.c_seq = parseFloat(v.c_seq);
  		     
    })
    //alert("afterGet");
  	//console.log("afterGet",rows);
  }
    
  
  $scope.close = function (items) {  	
    $modalInstance.close(items);
  };
 
  $scope.saveAll = function(items) {  
    if( !angular.isUndefined(items["rows"]) ) items = items["rows"];
    //console.log("saveRowAll",items);
    
    //ตรวจสอบด้วยว่า มันมีสินค้าซ้ำหรือเเปล่า
         
	var data = [];
	angular.forEach(items, function(v, k) {
	 	if(v.chk_item_id == "1"){ 

	 		
	 		v.main_uofm_id = v.uofm_id;
	 		v.uofm_id = v.po_uofm_id ;	 
	 		
	 		for( i in v.receive_uofm){
	 			if(v.receive_uofm[i].id == v.uofm_id){
					v.receive_unit = v.receive_uofm[i]; 
					break;
				}
			}
			
	 		delete v.receive_uofm;
	 		delete v.receive_uofm_show;		
	 		delete v.receive_unit;	
			
			this.push(v);
	 	}
	}, data);
	 
  	console.log("saveRowAll data",data);
       
  
    var url = "product.vendor_item_update"; 
    iAPI.post(url,{'items':data}).success(function(res) {
    	$modalInstance.close(items);
    });  
        
  }  
   
  
  
})

.controller('Supplier_itemlistCtrl', ['$scope', 'iAPI', '$modal', '$filter', '$q', '$window', function ($scope,iAPI,$modal,$filter,$q,$window) {
  var ConfPageTitle = { pageTitle_org : 'สินค้าตามผู้จัดจำหน่าย ',
  	pageTitle_add_edit : 'แก้ไขสินค้า',
  	pageCaption_org : '',
  	pageTitle_edit : ' ',
    pageTitle_table : '',
  };
  iAPI.setConfPageTitle(ConfPageTitle);
   
  $scope.options = {	
    allowOp: 'view,edit,add,group1',
    dataAPI: 'db/vendor', 
    getAPI: 'product.vendor_item' ,
    saveAPI: 'product.vendor_item_update',
    updateAPI: 'product.vendor_item_update',
    cols : [
      {label: 'No.', map: 'id', width:60, format:'index', },
      {label: 'กลุ่ม', map: 'item_group_name', width:130,},
      {label: 'รหัส', map: 'item_code' , width:100,},
      {label: 'ชื่อ', map: 'item_name'}, 
      {label: 'ชื่อเฉพาะ', map: 'c_info' , map2: 'c_item_vendor_name'}, 
      {label: 'ราคา/หน่วย PO MM', map: 'f_min_order_amt', align:'right' , width:150,}, 
      //{label: 'หน่วยรับ',  map: 'receive_uofm_show'},       
      {label: 'หน่วย PO MM', map: 'c_po_uofm_show', width:120,}, 
      //{label: 'vendor_id', map: 'vendor_id', width:100,}, 
      
    ],    
    itemPerPage:$scope.itemPerPage,
    display : {
      groupLable : 'ผู้จัดจำหน่าย',
      groupOrderby : 'c_desc',
    },
    buttons : [ 
      // { label: ' ', btn:'btn-danger', icon : 'fa-minus-circle', fn : 'delItemSelect', 
      // },
    ],
    predicate:'c_name', 
    reverse:false,
    filter_group : [
    	{map: 'vendor_id'  },
    ],
    addFn:function(row){  
			$scope.addItems($scope.options.group);
		 },
	  
  }
  
  
  iAPI.get('db/vendor?orderby=c_name').success(function(data) {
  	for( i in data){
		data[i].c_desc = data[i].c_name;
		data[i].vendor_id = data[i].id;
	}
  	
	$scope.options.group  = data;
	console.log("group item_group",$scope.options.group);
	$scope.options.row_group = $scope.options.group[0];
   });
     
  $scope.options.afterGet = function(rows){ 
  	angular.forEach(rows, function(v,k) {
  		 //v.vendor_id = parseInt(v.vendor_id);  
  		 //alert(v.c_info);
  		 console.log("v.c_info" + v.id ,v.c_info);
         v.c_info = angular.fromJson( angular.copy(v.c_info) );
         //console.log(k+"v.c_info->"+v.id,v.c_info);
         
         console.log(k+"v.c_item_info->"+v.id,v.c_item_info);
         var c_item_info = angular.fromJson( angular.copy(v.c_item_info) );
         
         if( !angular.isUndefined(v.c_info.c_po_uofm_name)){
		 	v.c_po_uofm_show = v.c_info.c_po_uofm_name;
		 }else  if( !angular.isUndefined(c_item_info.c_po_uofm_name)){
		 	v.c_po_uofm_show = c_item_info.c_po_uofm_name+"("+parseFloat(c_item_info.c_po_f_factor)+ c_item_info.c_uofm_name+")" ;		 	
		 }else{
		 	v.c_po_uofm_show = v.c_po_uofm_name;
		 }
          
         	
        // if( !angular.isUndefined(v.c_info.receive_unit.c_desc_show))
         //	alert("66");   
         	      	

         
         
         
    })
  }
  
  $scope.options.beforeUpdRow = function(row) { 
 
  	if( !angular.isUndefined(row.c_info.main_uofm_id)){
  		  
  	}else if( !angular.isUndefined(row.c_info.receive_uofm)){  		
  		if( !angular.isUndefined(row.c_info.receive_unit))  
  			row.c_info.main_uofm_id = row.c_info.receive_unit.id;  
  		else
  			row.c_info.main_uofm_id = row.c_info.receive_uofm[0].id;   	 
	}else{
		row.c_info.main_uofm_id = row.uofm_id;   	 
	}
 
  	$scope.create_uofm(row.c_info.main_uofm_id);
  	row.c_info.receive_uofm = angular.copy($scope.confUofm.receive_uofm);
  	row.c_info.receive_uofm_show = angular.copy($scope.confUofm.receive_uofm_show);       
    
    row.main_uofm_id = row.c_info.main_uofm_id;
    
    if( !angular.isUndefined(row.c_info.receive_unit))  
  		row.receive_unit = row.c_info.receive_unit; 
  			
  	for(i in row.c_info.receive_uofm ){ 
  		//alert( row.c_info.receive_uofm[i].id +" "+ row.uofm_id);
		if( row.c_info.receive_uofm[i].id == row.uofm_id){
			row.receive_unit = row.c_info.receive_uofm[i];
			break;
		}
	}
	
	
  }
  
  
  // validate here return false to stop proceeding
  $scope.options.beforePost = function(row) {
  	
  	if(!row.c_info.c_item_vendor_name){
  		alert("ชื่อเฉพาะต้องใส่")
  		return  false ;	
  	}    
    $scope.row.c_info.c_item_vendor_name = $scope.chkTextError(angular.copy(row.c_info.c_item_vendor_name));
	
	if( angular.isUndefined(row.receive_unit.id) ) {
		alert("กรุณาเลือกหน่วยด้วย");
		return false;
	}
	row.main_uofm_id = row.c_info.main_uofm_id;
  	row.uofm_id = row.receive_unit.id;  
  	
  	row.c_po_uofm_name = row.receive_unit.c_desc_show;
  	 
  	delete row.receive_unit ;
  	delete row.c_info.receive_uofm ;
  	delete row.c_info.receive_uofm_show ;	 
  	
  	$scope.options.updateAPI = 'product.vendor_item_update' + '/' + $scope.options.row_group.vendor_id ;
  	//$scope.row.c_info = angular.toJson(row.c_info, false);
  	//row.c_info = angular.toJson(row.c_info, false);
   	return true;
  }

  $scope.options.afterPost = function(row){ 
    row.c_info = angular.fromJson(row.c_info);  
    
    row.c_po_uofm_name = row.c_info.c_po_uofm_name;
    
     row.c_info = angular.fromJson( angular.copy(row.c_info) );
     console.log("row.c_info",row.c_info);
     
     var c_item_info = angular.fromJson( angular.copy(row.c_item_info) );
     
     if( !angular.isUndefined(row.c_info.c_po_uofm_name)){
	 	row.c_po_uofm_show = row.c_info.c_po_uofm_name;
	 }else  if( !angular.isUndefined(c_item_info.c_po_uofm_name)){
	 	row.c_po_uofm_show = c_item_info.c_po_uofm_name+"("+parseFloat(c_item_info.c_po_f_factor)+ c_item_info.c_uofm_name+")" ;		 	
	 }else{
	 	row.c_po_uofm_show = row.c_po_uofm_name;
	 }
    
    /*
 	if( !angular.isUndefined(row.c_info.receive_uofm_show)){
		row.receive_uofm_show = row.c_info.receive_uofm_show;
		row.receive_uofm = row.c_info.receive_uofm;
	}  			
	else{
		row.receive_uofm_show = row.uofm_c_name ;
		row.receive_uofm = [{id:row.uofm_id,c_desc:row.uofm_c_name,c_name:row.uofm_c_name}];
	}
	*/
    
  }
 
  $scope.delete_msg = function() { 
	$scope.row.c_name = $scope.row.c_info.c_item_name ;
	$scope.options.display = {};
	$scope.options.display.message1 = "ต้องการลบสินค้า : " + $scope.row.c_info.c_item_name;
	$scope.options.display.confirmTitle = "ยืนยันการลบสินค้า";
  };      
 
  $scope.delete_action = function() {
	
	url = 'product.vendor_item_delete/'+$scope.row.id;
	iAPI.post(url,$scope.row).success(function(res) {
		$scope.theRefashFn();
	});	
		
  }; 
     

  $scope.setRefashFn = function(theRefashFn) {
      $scope.theRefashFn = theRefashFn;
  };
  $scope.setDelFn = function(theDelFn) { 
      $scope.theDelFn = theDelFn;
  };
    
  $scope.addItems = function(row) { 
    $scope.opt = { vendor_id: $scope.options.row_group.id, 
    	id: $scope.options.row_group.id, 
    	parentRow:$scope.options.row_group,
    	row_group : $scope.MODEL['all_item_group'],
    	display:{
			modal_title:'สินค้าตามผู้จัดจำหน่าย',
		},
    }; 
    var modalInstance = $modal.open({
      templateUrl: 'views/setting/supplier.item.add.html',
      controller: 'Supplier.item.add.Ctrl',
      size: 'lg',
      resolve: {
        options: function () {
          return $scope.opt;
        }
      }
    });
    modalInstance.result.then(function (items) {
    	$scope.theRefashFn();
    });
  } 
  
}])


//////////////////////////////////////////////////////////////////////////////////////////////
.controller('CustomerCtrl', ['$scope', 'iAPI', '$modal', function ($scope,iAPI,$modal) {
  var ConfPageTitle = { pageTitle_org : 'ลูกค้าทั่วไป',
  	pageTitle_add_edit : 'ลูกค้า',
  	pageCaption_org : '',
  	pageTitle_edit : '',
    pageTitle_table : '',
  };
  iAPI.setConfPageTitle(ConfPageTitle);
   
  $scope.options = {	
    allowOp: 'view,edit,add',
    dataAPI: 'db/customer', 
    cols : [
      {label: 'No.', map: 'id', width:60, format:'index', },
      {label: 'ชื่อ', map: 'c_name' },
      {label: 'เบอร์โทร', map: 'c_tel' },
      {label: 'เลขที่บัตรประชาชน/เลขที่นิติบุคคล', map: 'c_tax_number' },
      {label: 'ผังราคา', map: 'price_level_show' },
    ],
    itemPerPage:$scope.itemPerPage,
    predicate:'c_name', 
    reverse:false,
    addFnForm:function(row){  
			$scope.addItems(row);
		 }, 
  }
  
  $scope.addItems = function(row) { 

   $scope.row={};
   $scope.row.c_address="";
   $scope.row.c_tel="";
   $scope.row.c_tax_number="";
   $scope.row.c_location_name="";
   $scope.row.price_level="201"; 
   $scope.row.f_discount_pct="0"; 
      
      
  }  
  
   
  $scope.options.beforeUpdRow = function(row) {     
 	 
  	var row_tmp = angular.copy(row); 	
  	$scope.row = {};
  	$scope.row = row_tmp;  	
   
  	var c_setting = angular.fromJson($scope.row.c_setting);
  	delete $scope.row.c_setting;
  	
  	angular.forEach(c_setting, function(value, key) {
		this[key] = value ;	 	
	}, $scope.row);
	  	
  }
  
  
  $scope.options.beforePost = function(row) {
  	// if(!row.c_code){
  	// 	alert("Code do must input")
  	// 	return  false ;	
  	// }
  	if(!row.c_name){
  		alert("กรุณากรอกชื่อ")
  		return  false ;	
  	}
  	
  	
  	$scope.row.c_name = $scope.chkTextError(angular.copy(row.c_name));
  	row.c_address = $scope.chkTextError(angular.copy(row.c_address));
  	
  	
  	var c_setting = {};
  	c_setting.c_address = row.c_address;
  	c_setting.c_tel = row.c_tel;
  	c_setting.c_tax_number = row.c_tax_number;
  	c_setting.c_location_name = row.c_location_name;
  	c_setting.c_location_mm = row.c_location_mm;
  	c_setting.price_level = row.price_level;
  	c_setting.f_discount_pct = row.f_discount_pct;
  	
  	//c_setting.c_id_card = row.c_id_card;

  	delete $scope.row.c_address;  
  	delete $scope.row.c_tel;  	
  	delete $scope.row.c_tax_number;
    delete $scope.row.c_id_card;
    delete $scope.row.price_level;
    delete $scope.row.price_level_show;
    
    
    delete $scope.row.c_location_name;
    delete $scope.row.c_location_mm;
    delete $scope.row.f_discount_pct;
    
    
  	$scope.row.c_setting = angular.toJson(c_setting); ;  	
  	
  	return true 
  }

  $scope.options.afterGet = function(rows) {
    angular.forEach(rows, function(v,k) {
      v.c_setting = angular.fromJson(v.c_setting);
      v.c_tel = v.c_setting.c_tel;
      v.c_tax_number = v.c_setting.c_tax_number;
      v.c_location_name = v.c_setting.c_location_name;
      v.price_level = v.c_setting.price_level;
      v.f_discount_pct = v.c_setting.f_discount_pct;
      
      for( var i in $scope.MODEL.price_level){
	  	if( $scope.MODEL.price_level[i].id == v.price_level){
	  		v.price_level_show = $scope.MODEL.price_level[i].c_desc;
			break;
		}
	  }
      
    })
  }
  $scope.options.afterPost = function(row){
  	//alert("afterPost");
  	row.c_setting = angular.fromJson(row.c_setting);
  	row.c_tel = row.c_setting.c_tel;
  	row.c_tax_number = row.c_setting.c_tax_number;
  	row.c_location_name = row.c_setting.c_location_name;
  	row.price_level = row.c_setting.price_level;
  	row.f_discount_pct = row.c_setting.f_discount_pct;
  	
  	for( var i in $scope.MODEL.price_level){
	  	if( $scope.MODEL.price_level[i].id == row.price_level){
	  		row.price_level_show = $scope.MODEL.price_level[i].c_desc;
			break;
		}
	  }
	  
  }
   
  
  
}])

//////////////////////////////////////////////////////////////////////////////////////////////
.controller('UserCtrl', ['$scope', 'iAPI', '$modal', function ($scope,iAPI,$modal) {
  var ConfPageTitle = { pageTitle_org : 'รายชื่อผู้ใช้',
  	pageTitle_add_edit : ' ',
  	pageCaption_org : '',
  	pageTitle_edit : ' ',
    pageTitle_table : '',
  };
  iAPI.setConfPageTitle(ConfPageTitle);
   
  $scope.options = {	
    allowOp: 'view,edit,delete,add,group1',
    dataAPI: 'user',
    importAPI: 'user.import',
    cols : [
      {label: 'No.', map: 'id', width:60, format:'index', },
      {label: 'ฝ่าย', map: 'emp_group', width:150 },
      {label: 'User Name', map: 'c_email', width:130},
      {label: 'ชื่อ', map: 'c_fname' },
      {label: 'นามสกุล', map: 'c_lname' }, 
      {label: 'เบอร์โทร', map: 'c_setting' , map2:'c_tel' },
    ],
    importFlds : [
    	{col: 'c_email', data: 'test@mail.com' },
    	{col: 'c_fname', data: 'fname' },
    	{col: 'c_lname', data: 'lname' },
    ],
    csv:'file/user.csv',
    itemPerPage:$scope.itemPerPage,
    predicate:'c_email',
    reverse:false,
    addFnForm:function(row){  
			$scope.addItems(row);
		 },
	display : {
      groupLable : 'ฝ่าย',
      groupOrderby : ' ',
    },	 
    filter_group : [
    	{map: 'emp_group' },
    ],
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
  iAPI.get('product.get_code/emp_group').success(function(data) {

	var row_group = [];
    row0 = {};
	row0["id"]=row0["emp_group_id"]=0;
	row0["c_code"]="";row0["c_desc"]="ทุกฝ่าย";
	row0["emp_group"] = '' ;
	row_group.push(row0);
  	angular.forEach(data['emp_group'], function(value, key) {
  		row0 = value;
  		row0["emp_group"] = value["c_desc"] ;
    	this.push(row0);	 	
	}, row_group);
	$scope.options.group  = row_group;
	console.log("group emp_group",$scope.options.group);
	$scope.options.row_group = $scope.options.group[0];			
				
    $scope.show_menu();
    
    $scope.show_confirm();
   });
   
     
  iAPI.get('user.get_user_all').success(function(data) {
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
   $scope.row.c_email=""; 
   $scope.row.c_fname=""; 
   $scope.row.c_lname=""; 
   $scope.row.emp_group="IT"; 
   $scope.row.emp_role="STAFF"; 
   $scope.row.c_setting={};  
   
   for( i in $scope.options.menu) $scope.options.menu[i].chk_add = 0;
   for( i in $scope.options.confirm) $scope.options.confirm[i].chk_add = 0;
   		
  }

  $scope.options.afterGet = function(rows){
  	angular.forEach(rows, function(v,k) {
         v.c_setting = angular.fromJson(v.c_setting);
    })
  }

  $scope.options.beforeUpdRow = function(row) {  

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
	
	
	
  }  
    // validate here return false to stop proceeding
  $scope.options.beforePost = function(row) { 
   
  	if(!row.c_email || row.c_email == ""){
  		alert("User Name do must input")
  		return  false ;	
  	}  
  	
  	if(!row.c_fname || row.c_fname == ""){
  		alert("Frist Name do must input")
  		return  false ;	
  	}

  	if( !row.id){
	 	//ถ้าเป็น add ให้ check ชื่อซ้ำด้วย
	  	for( i in $scope.options.user_all){
			if( row.c_email == $scope.options.user_all[i].c_email ){
				alert("User Name ซ้ำกัน");
				return  false ;	
			}
		}		
		
		if(!row.c_passwd || row.c_passwd == ""){
  			alert("Password do must input")
  			return  false ;	
  		}
		
	}
	
	
	//return  false ;
	
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
    
    
    //return false;
    
  	return true;
  } 
  $scope.options.afterPost = function(row){
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
	
  }
  
  $scope.options.display.setting = function() { 
	$scope.options.display.message1 = "ต้องการลบพนักงาน : " + $scope.row.c_fname + " " + $scope.row.c_lname;
	$scope.options.display.confirmTitle = "ยืนยันการลบพนักงาน";
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
  
  	 
  $scope.options = {	
   allowOp: 'view,add,edit,delete', 
    dataAPI: 'db/code',
    getAPI:'product.get_code/emp_group/1',
    transcludeAtTop: true,
    cols : [
      //{label: 'No.', map: 'c_seq', width:60, format:'index', },
      {label: 'No.', map: 'c_seq', width:60,   },
      {label: 'ชื่อ', map: 'c_desc' },
      {label: 'รหัสย่อ', map: 'c_code' },
      //{label: 'd_create', map: 'd_create'}
    ],
    addFnForm:function(row){  
			$scope.addItems(row);
		 },
	predicate:'c_seq', 
    reverse:false,
  }
  
  $scope.options.display = {};
  
  $scope.options.afterGet = function(rows){     

  	angular.forEach(rows, function(v,k) {
  		 v.c_seq = parseFloat(v.c_seq);
    })
    
   }
    
  $scope.addItems = function(row) { 
     
    $scope.row={};
    $scope.row.c_group = "emp_group" ;
    $scope.row.company_id = $scope.Employee.company_id ;
   
  }
  
  $scope.options.beforePost = function(row) { 
   
  	if(!row.c_desc || row.c_desc == ""){
  		alert("Name do must input")
  		return  false ;	
  	} 
  	if(!row.c_code || row.c_code == ""){
  		alert("Code do must input")
  		return  false ;	
  	}     	
  	
  	//Dup Code
  	for(var i in $scope.rows){
  		//console.log("Dup Code",  row.c_code + " " +  $scope.rows[i]["c_code"] + " " + row.c_code + " " + $scope.rows[i]["id"] )
		if( row.c_code == $scope.rows[i]["c_code"] 
			&& row.id != $scope.rows[i]["id"] ){
			alert("รหัสย่อซ้ำ");
			return false;
		}
	}
  	
  	
  	//row.c_code = row.c_desc;
  	return true ;	
  }
  
  $scope.options.afterPost = function(row){
  	iAPI.getMODEL($scope.MODEL,'emp_group');  	  	
  } 

  $scope.options.display.setting = function() { 
	$scope.options.display.message1 = "ต้องการลบฝ่าย : " + $scope.row.c_desc;
	$scope.options.display.confirmTitle = "ยืนยันการลบฝ่าย";
  };      
 
  $scope.options.afterDelete = function(row) {
    console.log("afterDelete",row);
	var url = 'user.del_user_group';
	var data = {};
	data.emp_group = row.c_desc;
	iAPI.post(url,angular.copy(data)).success(function(res) {
		//alert("5555");		 
	});
 
  }; 

  
    
    
}])

//////////////////////////////////////////////////////////////////////////////////////////////
.controller('ProfileCtrl', ['$scope', 'iAPI', '$modal', function ($scope,iAPI,$modal) {
  
   $scope.saveRow = function() { 
      
      //$scope.row.c_setting = angular.toJson($scope.row.c_setting);  
      //alert($scope.row.c_setting);
      //console.log($scope.row.c_setting);
  
      iAPI.post('user/'+$scope.user_id,$scope.row).success(function(data) {
	   	    alert("บันทึกค่าเรียบร้อยแล้ว");
	   	    $scope.get_profile(); 	     
	   	    	   	    
	   	    iAPI.ABuser.data.c_fname = $scope.row.c_fname ;  
	   	    iAPI.ABuser.data.c_lname = $scope.row.c_lname ;  
	   	    $scope.ABuser = iAPI.ABuser; 
	   	    
	   	    var ABuser = angular.copy(iAPI.ABuser);
	   	    ABuser.user_data = JSON.stringify(ABuser.data);
	   	    delete ABuser.data; 
	   	    localStorage.ABuser = JSON.stringify(ABuser);
	   	  
	   	  	//$scope.row.c_setting = angular.fromJson($scope.row.c_setting);
	   	  
	   	  
	   })
   } 
   
   $scope.beforeUpdRow = function() { 
   
	   iAPI.get('user.get_user').success(function(res){
	      //$scope.row = res; 
		  $scope.user_id = res.user_id;
		  $scope.row = {};
	      $scope.row.c_email = res.c_email;
	      $scope.row.c_fname = res.c_fname;
	      $scope.row.c_lname = res.c_lname;
	      
	      //var c_setting = angular.fromJson(res.c_setting);
	       
	      //$scope.row.c_setting = {};
	      //$scope.row.c_setting.c_tel = res.c_setting.c_tel;
	     
	   })
       
   } 
   
   $scope.beforeUpdRow();
    
}])



/*
  //เปลี่ยนภาษา
  $scope.selectLang = function(lang){
    localStorage.RGLang = $scope.RGLang = lang; 
    $translate.use($scope.RGLang);
    $state.go('help');
    localStorage.RGFirstOpen=false; 

  }
  */
  
  
  
//////////////////////////////////////////////////////////////////////////////////////////////  
.controller('Company.new.Ctrl', function ($scope,iAPI,$modalInstance,options) {
  $scope.row = options.MODEL.company;
  $scope.MODEL = options.MODEL;

  $scope.init = function() {
    $scope.step = 1;
    $scope.title = "Setting up new shop";
    iAPI.get('seller.demo_list').success(function(res) {
      $scope.MODEL.demo_list = res;
    })
  }
  if (!$scope.row.id) $scope.init();
  else {
    $scope.step = 0;
    $scope.title = 'MOTD';
  }

  $scope.close = function (logout) {
    $modalInstance.close(logout);
    if (logout) {
      localStorage.ABuser = "";
      window.location.href =iAPI.config.homeUrl;
    }
  };
})
