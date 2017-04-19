angular.module('abAPP.operation', [])
 
.controller('PoCtrl', ['$scope', 'iAPI', '$modal', '$filter', '$q', '$window', function ($scope,iAPI,$modal,$filter,$q,$window) {

  var ConfPageTitle = { pageTitle_org : 'รายการ PO',
  	pageTitle_add_edit : 'PO',
  	pageCaption_org : '',
    pageTitle_edit : 'รายละเอียด',
    pageTitle_table : '',
  };
  iAPI.setConfPageTitle(ConfPageTitle);

  $scope.content_height=$window.innerHeight - $scope.innerHeight ;
  
  $scope.options = {
    allowOp: 'view,add,edit,group1,month',
    dataAPI: '',
    getAPI: 'document.get_doc_web/'+'/PO'+'/active/create/d_start/d_end',
    saveAPI: 'document.save_doc',
    updateAPI: 'document.edit_doc',
    cols : [
      {label: 'No.', map: 'id', width:60, format:'index', },
      {label: 'วันที่สร้าง', map: 'd_create' },
      {label: 'กำหนดส่ง', map: 'd_date_send' },
      {label: 'เลขที่เอกสาร', map: 'c_doc_no' },
      {label: 'สั่งจาก', map: 'c_from_name' },  
      {label: 'ส่งที่', map: 'c_to_name' },
      //{label: 'ส่งที่', map: 'c_location_send' },
       
    ], 
    itemPerPage:$scope.itemPerPage,
    predicate:'d_create', 
    reverse:true,
    filter_group : [
    	{map: 'e_status_action_show' },
    ],
    group : [
    	{ e_status_action_show : "active_create" , c_desc : "ยังไม่อนุมัติ" },
    	{ e_status_action_show : "active_confirm" , c_desc : "อนุมัติแล้ว" },
    	{ e_status_action_show : "delete" , c_desc : "ยกเลิก" },
    ],  
	display : {
		groupLable : "สถานะ",
		groupOrderby : " ",
	},    
    addFnForm:function(row){  
			$scope.addItems(row);
		 },
	editBtn : {
		noShow:true,
	},
	viewBtn : {
		show:false,
	},
	rowBtn : {
		show:true,
	},

  }
  $scope.options.row_group = $scope.options.group[0];
  
  $scope.options.location_branch = [];  
  
  $scope.options.chgMode = function() {
  	$scope.options.allowOp = 'view,add,edit,group1,month';
  }
   
  //add options
  $scope.options.doc_type = "PO";
  $scope.options.vendor = 0 ;
  $scope.options.rows_dtl =[];
  $scope.options.rows_dtl_col ={id:'',item_id:'',item_c_code:'',item_c_name:'',c_item_vendor_name:'',uofm_id:'',uofm_c_name:'',
  	f_quantity:1,f_price:0,f_unit_price:0,f_discount_pct:0,f_discount:0,f_unit_total:0
  	,po_uofm_id:0 ,location_uofm_id:0
  	,hcode:''
  };
  $scope.options.cols_dtl_th1 = [
      {label:'No.', width:60, }, 
      //{label:'hcode', width:60, },
      {label:'รหัส', width:60, },
      {label:'ชื่อ', },
      {label:'จำนวน', width:80, align:'center', },
      //{label:'หน่วย', map: 'uofm_c_name',  },
      {label:'หน่วย', width:80, align:'center', },
      {label:'ราคา', width:80, align:'center', },
      {label:'ส่วนลด', width:140, colspan:3, align:'center', }, 
      {label:'จำนวนเงิน', width:80, align:'center',},
    ]
  $scope.options.cols_dtl1 = [
      {label:'No.', map:'id', width:60, format:'index', }, 
      //{label:'hcode', map:'hcode', width:60, },
      {label:'รหัส', map:'item_c_code', width:60, },
      //{label:'ชื่อ', map:'c_item_vendor_name',  },
      {label:'ชื่อ', map:'item_c_name',  },
      {label:'จำนวน', map:'f_quantity', type:'textbox', size:5, align:'right', valid_number:'valid-number', width:80,
      	changeFn :  function(row){ $scope.row_dtl_change(row,''); },   
      }, 
      //{label:'หน่วย', map: 'uofm_c_name',  },
      {label:'หน่วย', map:'uofm_id', type:'select', option:'uofm_option', width:100, 
      	changeFn :  function(row){ $scope.uofm_row_dtl_selete(row); },
      },
      {label:'ราคา', map:'f_price' , type:'textbox', size:5, align:'right', width:80, valid_number:'valid-number',
      	changeFn :  function(row){ $scope.row_dtl_change(row,''); }, 
      },
      {label:'ส่วนลด', map:'f_discount_pct' , type:'textbox', size:3, align:'right', width:60, valid_number:'valid-number',
      	changeFn :  function(row){ $scope.row_dtl_change(row,'discount_pct'); }, 
      },
      {label:' ', map:'c_percent', width:40, },
      //{label:'ส่วนลด', map:'f_discount', width:40, },
      {label:'ส่วนลด', map:'f_discount' , type:'textbox', size:5, align:'right', width:80, valid_number:'valid-number',
      	changeFn :  function(row){ $scope.row_dtl_change(row,''); }, 
      },
      {label:'จำนวนเงิน', map:'f_unit_total', width:80, align:'right', },  
      //{label:'จำนวนเงิน', map:'f_unit_total' , type:'textbox', size:8, align:'right', valid_number:'valid-number', readonly:true,
      //	changeFn :  function(row){ $scope.row_dtl_change(row,''); }, 
      //},
    ]
    
    $scope.options.cols_dtl_th2 = [
      {label:'No.', width:60, }, 
      //{label:'hcode', width:60, },
      {label:'รหัส', width:60, },
      {label:'ชื่อ', },
      {label:'จำนวน', width:80, align:'right',   },
      //{label:'หน่วย', map: 'uofm_c_name',  },
      {label:'หน่วย', width:80, align:'right', },
      {label:'ราคา', width:80, align:'right', },
      {label:'ส่วนลด',width:140, colspan:3, align:'center', }, 
      {label:'จำนวนเงิน', width:80, align:'right', },
    ]
    $scope.options.cols_dtl2 = [
      {label:'No.', map:'id', width:60, format:'index', },
      //{label:'hcode', map:'hcode', width:60, },
      {label:'รหัส', map:'item_c_code', width:80, },
      {label:'ชื่อ', map:'item_c_name', }, 
      {label:'จำนวน', map:'f_quantity', width:80, align:'right',},    
      {label:'หน่วย', map: 'uofm_c_name_show',width:100, align:'right', },
      {label:'ราคา', map: 'f_price',width:80, align:'right', },
      {label:'ส่วนลด', map: 'f_discount_pct',width:60, align:'right', },
      {label:' ', map: 'c_percent', width:40, },
      {label:'ส่วนลด', map: 'f_discount', width:60, },
      {label:'จำนวนเงิน', map: 'f_unit_total',width:80, align:'right', },
    ];
    
    
  $scope.options.cols_buttons1 = [
  /*
      {label:'Option', btn:'btn-danger', icon : 'ion ion-close', type:'button', width:50,
       	fn:function(idx,row){ 
			 $scope.row_add_option(idx,row);
		   },
	  },
	  */
      {label:'', btn:'btn-danger', icon : 'ion ion-close', type:'button', width:20,
       	fn:function(idx,row){ 
			 $scope.row_del(idx,row);
		   },
	  },  
    ];
      
  $scope.addItems = function(row) { 
 
   $scope.options.cols_dtl_th = angular.copy($scope.options.cols_dtl_th1);
   $scope.options.cols_dtl = angular.copy($scope.options.cols_dtl1);
   $scope.options.cols_buttons = angular.copy($scope.options.cols_buttons1); 
   
   $scope.options.disabled = false;
   $scope.options.disabledNote=false;
   
   $scope.row={};
   $scope.row.hdr={};
   $scope.row.hdr.f_doc_summary = 0 ;
   $scope.row.hdr.f_doc_discount = 0 ;
   $scope.row.hdr.f_doc_subtotal = 0 ;
   $scope.row.hdr.f_tax_pct = "";
   $scope.row.hdr.f_tax = 0 ;
   $scope.row.hdr.f_doc_total = 0 ;
   $scope.row.hdr.f_tax_chk = 'no_vat';
   $scope.row.hdr.c_note="";
   

   
   $scope.options.vendor = $scope.MODEL.vendor[0];
   $scope.change_vendor();					
   
   $scope.options.location = $scope.MODEL.location[0];
   $scope.change_location();
   
   $scope.row.hdr.i_to = $scope.Employee.location_id;
   $scope.row.hdr.c_to_name = $scope.Employee.c_location_code;   
  	
   
   $scope.row.hdr.d_date = new Date();
   $scope.row.hdr.d_date_send = new Date();
      
   	
   $scope.row.hdr.doc_type = $scope.options.doc_type;
   //$scope.row.hdr.get_last_no = $scope.row.hdr.doc_type +"-"+$scope.Employee.c_location_code+"-"+$scope.getYear+$scope.getMonth;
   $scope.row.hdr.get_last_no = $scope.row.hdr.doc_type+$scope.getYearTH+$scope.getMonth;
   $scope.row.hdr.get_last_no_size = 4;  	  
   	     
   $scope.options.rows_dtl =[];       
  
   //var c_setting = angular.fromJson($scope.MODEL.location[0].c_setting);     
   //$scope.row.hdr.c_headder_name = c_setting.c_desc ;
   //$scope.row.hdr.c_headder_address = c_setting.c_address ;
   //$scope.row.hdr.c_headder_tel = c_setting.c_tel ;
   //$scope.row.hdr.c_headder_tax_number = c_setting.c_tax_number ;
 
   
   var parameter = { c_code: $scope.row.hdr.get_last_no , size: $scope.row.hdr.get_last_no_size , update : false };  
   iAPI.post('document.get_last_no',parameter).success(function(data) {
   	    console.log("document.get_last_no",data) ;
   		data = angular.fromJson(data);
   		$scope.row.hdr.c_doc_no = data.doc_no ; ;  
   })
   
   console.log("$scope.row",$scope.row);
      
 
 
    
   //console.log($scope.row);
 	//$scope.row.hdr.c_doc_no = "xxx";
  }     

  $scope.options.afterGet = function(rows){
     

  	angular.forEach(rows, function(v,k) {
  		
  		var c_hdr_info = angular.fromJson(v.c_hdr_info);         
        v.c_location_send = c_hdr_info.c_location_send;
        
        
  		v.e_status_action_show = v.e_status_action;
  		if(v.e_status_action=='active_create'){
	        v.rowBtn = {
	          icon:'fa-pencil',  
	        };	 
		}else if(v.e_status_action=='active_confirm' || v.e_status_action=='active_complete' 
			|| v.e_status_action=='active_missing' || v.e_status_action=='active_missing_complete'
			){
	        v.rowBtn = {
	  	 			icon:'fa-search',  
	        };		 
	        v.e_status_action_show = 'active_confirm';
	        
		}else if(v.e_status_action=='delete'){
	        v.rowBtn = {
	  	 			icon:'fa-search',  
	        };	 	
  		} 
  		
  		 
  		
    })
    
    
    
    //alert("afterGet");
  	//console.log("afterGet",rows);
  }
      
  $scope.options.beforeUpdRow = function(row) { 
  
  /*
   for(var i in MODEL.vendor ){
   	if(MODEL.vendor[i].id == row.)
   }
   */
 
  	if(row.e_status_action=='active_confirm' 
  		|| row.e_status_action=='active_missing'
  		|| row.e_status_action=='active_missing_complete'
  		|| row.e_status_action=='active_complete'
  		|| row.e_status_action=='delete'
  		){
  		$scope.options.allowOp = 'view'; 
  		$scope.options.disabled = true;
  		$scope.options.disabledNote=true;
  		
  		$scope.options.cols_dtl_th = angular.copy($scope.options.cols_dtl_th2);
  		$scope.options.cols_dtl = angular.copy($scope.options.cols_dtl2);
  		$scope.options.cols_buttons = [];
  		
  	}else{
  		$scope.options.cols_dtl_th = angular.copy($scope.options.cols_dtl_th1);
		$scope.options.cols_dtl = angular.copy($scope.options.cols_dtl1);
   		$scope.options.cols_buttons = angular.copy($scope.options.cols_buttons1); 
	}
 
  	var row_tmp = angular.copy(row);
  	var row_dtl = angular.copy(row_tmp.dtls);
  	
  	
  	for(var i in row_dtl){
		var c_dtl_info = angular.fromJson(row_dtl[i].c_dtl_info);
		delete row_dtl[i].c_dtl_info;
		angular.forEach(c_dtl_info, function(value, key) {
			this[key] = value ;	 	
		}, row_dtl[i]);
		
		//ส่งให้สาขา
		//"i_add_branch":"1","c_send_to_branch_tel":"กกกกกก","i_send_to_branch":"136","c_add_option_note":"2222"
		if( !angular.isUndefined(row_dtl[i].i_add_branch) ){
			for(var key in $scope.MODEL.location_branch){
				if( $scope.MODEL.location_branch[key].id == row_dtl[i].i_send_to_branch){
					$scope.options.location_branch[i] = $scope.MODEL.location_branch[key];
					break;
				}		
			}
		} 			
				
		if(row.e_status_action=='active_confirm' 
  			|| row.e_status_action=='active_missing'
  			|| row.e_status_action=='active_missing_complete'
  			|| row.e_status_action=='active_complete'
  			|| row.e_status_action=='delete'
  			){
			row_dtl[i].disabled = true;	
			row_dtl[i].option_disabled = true;	
			
			row_dtl[i].uofm_c_name_show = row_dtl[i].uofm_c_name;
			if( parseFloat(row_dtl[i].uofm_f_factor) !='1'){
				if( !angular.isUndefined(row_dtl[i].uofm_c_name_org) )
					row_dtl[i].uofm_c_name_show += "("+parseFloat(row_dtl[i].uofm_f_factor)+row_dtl[i].uofm_c_name_org+")";
				else if( !angular.isUndefined(row_dtl[i].c_receive_uofm_name) )
					row_dtl[i].uofm_c_name_show += "("+parseFloat(row_dtl[i].uofm_f_factor)+row_dtl[i].c_receive_uofm_name+")";
				else 
					row_dtl[i].uofm_c_name_show += "("+parseFloat(row_dtl[i].uofm_f_factor)+")";
			}
		
		
		}else{
			var uofm_id = row_dtl[i].uofm_id;
			$scope.create_uofm(uofm_id);
			row_dtl[i].uofm_option = angular.copy($scope.confUofm.receive_uofm);  			
		}
		
	} 

  	delete row_tmp.dtls;
  	$scope.row = {};
  	$scope.row.hdr = row_tmp;  	

 
  	
  	var c_hdr_info = angular.fromJson($scope.row.hdr.c_hdr_info);
  	delete $scope.row.hdr.c_hdr_info;
  	
  	angular.forEach(c_hdr_info, function(value, key) {
		this[key] = value ;	 	
	}, $scope.row.hdr);
  	
  	$scope.options.rows_dtl = row_dtl;
  	
  	for(var key in $scope.MODEL.vendor){
		if( $scope.MODEL.vendor[key].id == $scope.row.hdr.i_from){
			$scope.options.vendor = $scope.MODEL.vendor[key];
			if( angular.isUndefined($scope.row.hdr.c_vendor_name) )
				$scope.row.hdr.c_vendor_name = $scope.options.vendor.c_name;
			break;
		}		
	}
 	
  	for(var key in $scope.MODEL.location){
  		//alert($scope.MODEL.location[key].id + " " + $scope.row.hdr.c_location_send_id);
		if( $scope.MODEL.location[key].id == $scope.row.hdr.c_location_send_id){
			$scope.options.location = $scope.MODEL.location[key];
			break;
		}		
	}   
   
    
   if( !angular.isUndefined($scope.row.hdr.id) ){ 
  		$scope.row.id = $scope.row.hdr.id;
  		  		
  	    if( $scope.row.hdr.e_status == "active" )
  			$scope.row.hdr.e_status = 'edit';
  	} 
	  
	//alert($scope.row.hdr.e_status_action);

  	console.log("beforeUpdRow hdr ",$scope.row);
  	console.log("beforeUpdRow dtl",$scope.options.rows_dtl);
  	
  }
   
  $scope.options.beforePost = function(row) {    	  
  	delete row.hdr.rowBtn;
   	delete row.hdr.e_status_action;   
   	delete row.hdr.e_status_action_show;   		  
   	row.dtl = $scope.options.rows_dtl;   	    	
  	return true 
  }
  $scope.uofm_row_dtl_selete = function(row) {  	
  	for(var i in row.uofm_option ){
		if( row.uofm_option[i].id == row.uofm_id ){
			row.uofm_c_name = row.uofm_option[i].c_desc ;
			row.uofm_f_factor = row.uofm_option[i].f_factor;
			break;
		}
	}
	//alert(row.uofm_c_name);
  	//console.log(row);	
  }
  
    
  $scope.row_dtl_change = function(row,c_discount_type) {
   	//alert(row);
   	//console.log("c_discount_type = " + c_discount_type,row);   
   	
   	console.log("row_dtl_change" + "  c_discount_type = " + c_discount_type,row); 
   	
   	var f_discount_pct = iAPI.tofix(row.f_discount_pct);
   	if( isNaN(f_discount_pct) ) f_discount_pct = 0 ;   	
   	if( f_discount_pct == '' )  f_discount_pct = 0 ;  	
   	
   	row.f_unit_price = (iAPI.tofix(row.f_quantity)*iAPI.tofix(row.f_price));
   	
   	if( c_discount_type == "discount_pct" && f_discount_pct == 0 ){   
		row.f_discount = 0 ;
	}else if( f_discount_pct != 0){
		row.f_discount = row.f_unit_price * (f_discount_pct / 100); 
		row.f_discount = iAPI.round(row.f_discount); 
	}	
   	row.f_unit_total = row.f_unit_price-iAPI.tofix(row.f_discount) ;
   	$scope.row_hdr_change('');
  }   
 
  $scope.row_hdr_change = function(c_discount_type) {
   	 
   	 var f_doc_summary = 0 ;
   	 for(var m in $scope.options.rows_dtl) {
   	 	var value = $scope.options.rows_dtl[m];
   	 	f_doc_summary+= iAPI.tofix(value.f_unit_total);
   	 }
   	 
   	 
	 console.log("row_hdr_change" + "  c_discount_type = " + c_discount_type,$scope.row.hdr);  
   	  
   	 var f_doc_discount_pct = iAPI.tofix($scope.row.hdr.f_doc_discount_pct);
   	 if( isNaN(f_doc_discount_pct) ) f_doc_discount_pct = 0 ;  	
   	 if( f_doc_discount_pct == '' )  f_doc_discount_pct = 0 ; 
   	 
   	 if( c_discount_type == "discount_pct" && f_doc_discount_pct == 0 ){   
		$scope.row.hdr.f_doc_discount = 0 ;
	 }else if( f_doc_discount_pct != 0){
		$scope.row.hdr.f_doc_discount = f_doc_summary * (f_doc_discount_pct / 100); 
		$scope.row.hdr.f_doc_discount = iAPI.round($scope.row.hdr.f_doc_discount); 
	 }  	 
   	 
   	 $scope.row.hdr.f_doc_summary = f_doc_summary;
   	 $scope.row.hdr.f_doc_subtotal = iAPI.tofix($scope.row.hdr.f_doc_summary) - iAPI.tofix($scope.row.hdr.f_doc_discount);
   	 
   	 if( $scope.row.hdr.f_tax_chk == 'no_vat' ){
	 	
	 	$scope.row.hdr.f_tax_pct = "";
	 	$scope.row.hdr.f_tax = "";	 	
	 	$scope.row.hdr.f_doc_total = iAPI.tofix($scope.row.hdr.f_doc_subtotal) ;
	 	
	 }else if( $scope.row.hdr.f_tax_chk == 'include' ){
	 	
	 	if( $scope.row.hdr.f_tax_pct == "" || $scope.row.hdr.f_tax_pct == "0" ) 
	 		$scope.row.hdr.f_tax_pct = $scope.MODEL.vat["vat_pct"];
	 	var f_tax_pct = iAPI.tofix($scope.row.hdr.f_tax_pct);
   	 	if( isNaN(f_tax_pct) ) f_tax_pct = 0 ;
   	 	var f_tax = iAPI.round( iAPI.tofix($scope.row.hdr.f_doc_subtotal) * f_tax_pct / (100 + f_tax_pct ) );
   	 	$scope.row.hdr.f_tax = f_tax;
   	 	
	 	$scope.row.hdr.f_doc_total = iAPI.tofix($scope.row.hdr.f_doc_subtotal) ;
	 }else if( $scope.row.hdr.f_tax_chk == 'exclude' ){
	 	
	 	if( $scope.row.hdr.f_tax_pct == "" || $scope.row.hdr.f_tax_pct == "0" ) $scope.row.hdr.f_tax_pct = $scope.MODEL.vat["vat_pct"];
	 	var f_tax_pct = iAPI.tofix($scope.row.hdr.f_tax_pct);
   	 	if( isNaN(f_tax_pct) ) f_tax_pct = 0 ;
   	 	var f_tax = iAPI.round( iAPI.tofix($scope.row.hdr.f_doc_subtotal) * f_tax_pct /100 );
	 	$scope.row.hdr.f_tax = f_tax;
	 	
   	 	$scope.row.hdr.f_doc_total = iAPI.tofix($scope.row.hdr.f_doc_subtotal) + iAPI.tofix($scope.row.hdr.f_tax) ;	 	
	 }
	 $scope.row.hdr.f_doc_total_text = iAPI.MoneyToWord($scope.row.hdr.f_doc_total);
   	 
   	 

   	 //alert($scope.row.hdr.f_doc_total);
  }  
  
  $scope.change_vendor = function() {
  	//console.log($scope.options.vendor); 
  	var c_setting = null;
  	
  	if(angular.isObject($scope.options.vendor.c_setting))
  		c_setting = $scope.options.vendor.c_setting;
  	else c_setting = angular.fromJson($scope.options.vendor.c_setting);
  	
  	//console.log(c_setting); 
  	//{"c_tel":"Tel","c_address":"Address","c_zip":"Zip","c_contact":"Contact"}
  	$scope.row.hdr.vendor_id = $scope.options.vendor.id;
  	$scope.row.hdr.c_vendor_name = $scope.options.vendor.c_name;
  	$scope.row.hdr.c_vendor_address = c_setting.c_address ;
  	$scope.row.hdr.c_vendor_tel = c_setting.c_tel ;
  	$scope.row.hdr.c_vendor_contact = c_setting.c_contact ;
  	$scope.row.hdr.c_vendor_tax_number = c_setting.tax_number ;
  	  	
  	  	
  	$scope.row.hdr.i_from = $scope.row.hdr.vendor_id;
  	$scope.row.hdr.c_from_name = $scope.options.vendor.c_name;
  	$scope.row.hdr.e_from = 'vendor';
  	
  }
  $scope.change_location = function() {
  	//console.log("change_location",$scope.options.location); 
  	if( $scope.options.location.c_setting != "" ){
	  	var c_setting = angular.fromJson($scope.options.location.c_setting);
	  	//console.log(c_setting); 
	  	//{"c_tel":"Tel","c_address":"Address","c_zip":"Zip","c_contact":"Contact"}
	  	$scope.row.hdr.c_location_tel = c_setting.c_tel ;
  	}
  	//$scope.row.hdr.i_to = $scope.options.location.id;
  	//$scope.row.hdr.c_to_name = $scope.options.location.c_name;
  	
  	$scope.row.hdr.c_location_send = $scope.options.location.c_name;
  	$scope.row.hdr.c_location_send_id = $scope.options.location.id;
  	$scope.row.hdr.c_to_name = $scope.options.location.c_name; 
  	
  	//alert($scope.row.hdr.i_to );
  }   
  $scope.change_branch = function(idx) {
  	if($scope.options.rows_dtl[idx].i_add_branch == "1"){  		
	  	//alert(idx);
	  	//console.log("change_branch",$scope.options.location_branch);		
		if( angular.isUndefined($scope.options.location_branch[idx]) ){ 
  			$scope.options.location_branch[idx] = $scope.MODEL.location_branch[0];
  		}
 	  	$scope.options.rows_dtl[idx].i_send_to_branch = $scope.options.location_branch[idx].id ; 
		$scope.options.rows_dtl[idx].c_send_to_branch = $scope.options.location_branch[idx].c_name ; 	
		
	  	if( $scope.options.location_branch[idx].c_setting != "" ){
		  	var c_setting = angular.fromJson($scope.options.location_branch[idx].c_setting); 
		  	$scope.options.rows_dtl[idx].c_send_to_branch_tel = c_setting.c_tel ;
	  	}		
			
	  	//console.log("$scope.options.rows_dtl",	$scope.options.rows_dtl );		
	}else{
		delete $scope.options.rows_dtl[idx].i_send_to_branch;
		delete $scope.options.rows_dtl[idx].c_send_to_branch;
		delete $scope.options.rows_dtl[idx].c_send_to_branch_tel;	
			
	}
	
  }
  
  
  $scope.row_add_option = function(idx,row) { 
  	//alert(idx);
  	//row.add_option = true;
  	//console.log($scope.options.rows_dtl[idx].hdr);
  	//$scope.options.rows_dtl[idx].hdr.add_option = true;
  	//$scope.options.rows_dtl.splice(idx, 1);  
  	//$scope.row_hdr_change();
  } 
     
  $scope.row_del = function(idx,row) { 
 
  	//ใช้ row ไปหา indexOf ห้ามใช้ idx เด็ดขาด
	var indexOfRow = $scope.options.rows_dtl.indexOf(row);	
	//alert("idx="+idx +" indexOfRow="+indexOfRow);	
	if(indexOfRow < 0 )indexOfRow = idx;
  	$scope.options.rows_dtl.splice(indexOfRow, 1);
  	//$scope.options.rows_dtl.splice(idx, 1);

  	$scope.row_hdr_change('');
  } 
      
  $scope.delete_msg = function() {
	//$scope.row.hdr.e_status = 'delete';	
	$scope.row.c_name = $scope.row.hdr.c_doc_no ;
	//$scope.options.display = {};
	$scope.options.display.message1 = "ต้องการลบใบสั่งซื้อเลขที่ : " + $scope.row.hdr.c_doc_no;
	$scope.options.display.confirmTitle = "ยืนยันลบใบสั่งซื้อ";
  };      
 
  $scope.delete_action = function() {
	$scope.row.hdr.e_status = 'delete';	
	
	delete $scope.row.hdr.rowBtn;
   	delete $scope.row.hdr.e_status_action;
   	
	var url = 'document.edit_doc';
	iAPI.post(url,$scope.row).success(function(res) {
		//alert(res);
		$scope.theRefashFn();
	});	
		
  }; 
   
  $scope.print_action = function() {
  	$scope.opt = {
    	report_type: "po", 
    	id: $scope.row.hdr.id,     	
    }; 
    $scope.doc_print($scope.opt);    
  }  
 
  $scope.approve_action = function() {
  
	//$scope.row.hdr.e_action = 'confirm';	
	var	data = {};
	data.hdr = {};	
	
	data.hdr.id = $scope.row.hdr.id; 	
	data.hdr.c_doc_no = $scope.row.hdr.c_doc_no;
	data.hdr.doc_type = $scope.options.doc_type;	  
	data.hdr.e_action = "confirm";

	var url = 'document.update_action_doc';
	iAPI.post(url,angular.copy(data)).success(function(res) {
		$scope.theRefashFn();
	});	
 	
  }; 
  
 
   
  $scope.setRefashFn = function(theRefashFn) {
      $scope.theRefashFn = theRefashFn;
  };    
  $scope.setSaveFn = function(theSaveFn) { 
      $scope.theSaveFn = theSaveFn;
  };       
   $scope.setDelFn = function(theDelFn) { 
      $scope.theDelFn = theDelFn;
  };
 
  $scope.add_items = function() {
  	if( angular.isUndefined($scope.row.hdr.vendor_id) ){
  		alert("Supplier do must input")
  		return ;	
  	}
  	
  	$scope.opt = { vendor_id: $scope.row.hdr.vendor_id, 
    	id: $scope.row.hdr.vendor_id, 
    	parentRow:{},
    	row_group : $scope.MODEL['all_item_group'],
    	display:{
			modal_title:'สินค้าตามผู้จัดจำหน่าย' //+' : ' + $scope.row.hdr.c_from_name ,
		},
    }; 
    var modalInstance = $modal.open({
     templateUrl: 'views/operation/po.item.insert.html',
      controller: 'Po.item.insert.Ctrl',
      size: 'lg',
      resolve: {
        options: function () {
          return $scope.opt;
        }
      }
    });
    modalInstance.result.then(function (items) { 
 		//console.log('items',items);
 		if( !angular.isUndefined(items["id"]) ){
			if( items["id"] == -1 ) return ;
		}
	
  		//console.log('$scope.options.rows_dtl',$scope.options.rows_dtl);
  		for(var m in items) {
 			var value = items[m];
			
			/*
 			var chk = false;
 			for(var i in $scope.options.rows_dtl){
				var rows_dtl = $scope.options.rows_dtl[i];
				if( rows_dtl.item_id == value.item_id){
					chk = true;
					break;
				}
			}
			if(chk){
				alert("เลือก " + value.item_c_name + " ซ้ำ");
				continue;
			}
			*/
			//alert("add_items");
	 			
 			var dtl = angular.copy( $scope.options.rows_dtl_col );
 			for(var i in dtl) {
		 		for(j in value) {
		 			if( i==j){
						dtl[i]=value[j];
						break;
					}		 				
		 		}
			}
			
			dtl.uofm_f_factor = 1;
			
			dtl.c_receive_uofm_name = value.receive_uofm_c_name;
			dtl.c_receive_uofm_f_factor = dtl.uofm_f_factor;	
			
			//dtl.location_uofm_id = value.uofm_id;
			dtl.c_location_uofm_name = value.unit_name;
			dtl.c_location_f_factor = dtl.uofm_f_factor;	
			
			dtl.c_po_uofm_name = value.unit_name;
			dtl.c_po_f_factor = dtl.uofm_f_factor;	
	 
			//alert("d");
			
			dtl.uofm_option = [];
	 
			if( !angular.isUndefined(value.c_item_info) ){
				var c_item_info = angular.fromJson(value.c_item_info);
				 				 
				if(!angular.isUndefined(c_item_info.c_uofm_f_factor))
					dtl.uofm_f_factor	= angular.copy(c_item_info.c_uofm_f_factor); 
				
				if(!angular.isUndefined(c_item_info.c_receive_uofm_f_factor))
					dtl.c_receive_uofm_f_factor	= angular.copy(c_item_info.c_receive_uofm_f_factor); 
								
				if(!angular.isUndefined(c_item_info.c_location_uofm_name))
					dtl.c_location_uofm_name	= angular.copy(c_item_info.c_location_uofm_name); 
					
				if(!angular.isUndefined(c_item_info.c_location_f_factor))
					dtl.c_location_f_factor	= angular.copy(c_item_info.c_location_f_factor); 	
					
				if(!angular.isUndefined(c_item_info.c_po_uofm_name))
					dtl.c_po_uofm_name	= angular.copy(c_item_info.c_po_uofm_name); 
					
				if(!angular.isUndefined(c_item_info.c_po_f_factor))
					dtl.c_po_f_factor	= angular.copy(c_item_info.c_po_f_factor); 	
	 						
			}		
			
			$scope.create_uofm(dtl.po_uofm_id);
  			dtl.uofm_option = angular.copy($scope.confUofm.receive_uofm);
  									
			for(var i in dtl.uofm_option){				
				if( dtl.po_uofm_id == dtl.uofm_option[i].id ){					 
					dtl.uofm_id = dtl.uofm_option[i].id ;
					dtl.uofm_c_name = dtl.uofm_option[i].c_desc;
					dtl.uofm_f_factor = dtl.uofm_option[i].f_factor;
					break;	
				}
				
			}
			 
			dtl.uofm_c_name_org = dtl.uofm_option[0].c_desc;
			 
						
			dtl.c_percent = "% =";
			dtl.f_quantity = value.f_min_order_unit ;
			dtl.f_price = value.f_min_order_amt ;			
			dtl.f_unit_price = dtl.f_quantity*dtl.f_price ;
			dtl.f_unit_total = dtl.f_unit_price ;
			dtl.f_price_to_location = value.f_price ;
			dtl.id = $scope.options.rows_dtl.length + 1  ;
			//console.log('dtl',dtl);
	 		$scope.options.rows_dtl.push(dtl);
 		}
 		$scope.row_hdr_change('');
 		//console.log('$scope.options.rows_dtl',$scope.options.rows_dtl);		 
	   	
    });
  }  
  
 
  $scope.openModal_vendor = function () {
 	
 	if($scope.options.rows_dtl.length>0 || $scope.options.disabled ) return ;
 	
  	$scope.opt = {  
    	id: 0, 
    	parentRow:{}, 
    	display:{
			modal_title:'เลือกผู้จัดจำหน่าย'
		}, 
    }; 
    
    var modalInstance = $modal.open({
      templateUrl: 'views/operation/vendor.select.html',
      controller: 'Vendor.select.Ctrl',
      size: 'lg',
      scope:$scope,
      resolve: {
        options: function () {
          return $scope.opt;
        }
      }
    });
    modalInstance.result.then(function (item) {
       //alert(item);
	   if(item==""){ 
	   }else{
	   		//console.log(item);
		    $scope.options.vendor = item[0];
		    $scope.change_vendor();
	   } 
    
    });
    
  } 
  

}]) 

.controller('Po.item.insert.Ctrl', function ($scope,$modalInstance,$modal,iAPI,options,$window) {
  
 
  $scope.rows = null;
  $scope.options = {
    allowOp: 'group1',
    dataAPI: '' ,
    transcludeAtTop: true,
    getAPI: 'product.vendor_item/'+options.vendor_id ,
    saveAPI: '',
    cols : [
      {label:'เลือก', map:'chk_add', type:'checkbox', width:40,},
      //{label:'hcode', map:'hcode', width:60, },
      {label:'รหัส', map:'item_code', width:80,},
      {label:'ชื่อ', map:'c_item_name',},
      //{label:'ชื่อ', map:'c_item_vendor_name',},
      {label:'ราคาส่งสาขา', map:'f_price', width:120, align:'right', }, 
      {label:'ราคา/หน่วยรับ', map:'f_min_order_amt', width:120, align:'right', },      
      {label:'คงเหลือ', map:'f_quantity', width:80, align:'right', },
      {label:'หน่วย', map:'unit_name', width:80,},
      {label:'หน่วย PO MM', map:'c_po_uofm_name', width:110,},
            
    ],
    editBtn : {
		noShow:true,
	},
    display:options.display,
    parentRow:options.parentRow,
    saveAllFn:function(rows){  
			$scope.saveAll(rows);
		 },
	//predicate:'c_item_vendor_name', 
	predicate:'c_item_name', 
	reverse:false,
	group: options.row_group,
    row_group : options.row_group[0],
    filter_group : [
    	{map: 'item_group_id' },
    ],
	
  }
  
  $scope.options.display.groupOrderby = " ";
  $scope.options.display.groupLable = "ประเภทสินค้า";
  
  $scope.close = function (items) {  	
    $modalInstance.close([]);
  };

  $scope.options.beforeGet = function(){
  	$scope.spinner = {active : true};
  }
  $scope.options.afterGetMode = function(rows){
    $scope.spinner = {active : false};
  }
  
  $scope.options.afterGet = function(rows){
  	//cheage to json
  	angular.forEach(rows, function(v,k) {  	 
        v.c_info = angular.fromJson(v.c_info);         
        v.c_item_vendor_name = v.c_info.c_item_vendor_name;
        
        v.c_item_info = angular.fromJson(v.c_item_info); 
        if( !angular.isUndefined(v.c_item_info.c_po_f_factor) )
	        if( parseFloat(v.c_item_info.c_po_f_factor) != 1 )
	        	v.c_po_uofm_name += "("+parseFloat(v.c_item_info.c_po_f_factor)+v.unit_name+")";
        //console.log(v.c_info);
        //alert("555");
    })
      
  	//console.log("afterGet",rows);
  }
   
  $scope.saveAll = function(items) {  
   
    if( !angular.isUndefined(items["rows"]) ) items = items["rows"];
    
    //console.log("saveRowAll",items);
         
	var data = [];
	angular.forEach(items, function(value, key) {
	 	if(value.chk_add == "1")
	 	 	this.push(value);	 	
	}, data);
	 
  	//console.log("saveRowAll data",data);
    
    $modalInstance.close(data);   
    
  }  
   
  
  
})
   
.controller('Po_inputCtrl', ['$scope', 'iAPI', '$modal', '$filter', '$q', '$window', function ($scope,iAPI,$modal,$filter,$q,$window) {

  var ConfPageTitle = { pageTitle_org : 'รับเข้าตาม PO/ใบขาด',
  	pageTitle_add_edit : ' ',
  	pageCaption_org : ' ',
  	pageTitle_edit : ' ',
    pageTitle_table : '',
  };
  iAPI.setConfPageTitle(ConfPageTitle);

  $scope.content_height=$window.innerHeight - $scope.innerHeight ;
  
  $scope.options = {
    allowOp: 'view,edit',
    dataAPI: '',
    getAPI: 'document.get_doc_web/'+'/PO'+'/active/confirm',
    saveAPI: 'document.save_doc',
    cols : [
      {label: 'No.', map: 'id', width:60, format:'index', },
      {label: 'วันที่', map: 'd_create' },
      {label: 'กำหนดส่ง', map: 'd_date_send' },
      //{label: 'เลขที่เอกสาร', map: 'c_doc_no' },
      {label: 'เลขที่เอกสาร', map: 'c_doc_no_show' },
      {label: 'สั่งจาก', map: 'c_from_name' },  
      //{label: 'ส่งที่ ', map: 'c_to_name' }, 
      {label: 'ส่งที่', map:'c_location_send' },
      //{label: 'เอกสารอ้างอิง', map: 'c_refer_c_doc_no' }, 
    ],
    itemPerPage:$scope.itemPerPage,
    predicate:'c_doc_no_show', 
    reverse:true,
    editBtn : {
    	label:" รับเข้า",
    	icon:" ",
	},
  }
  $scope.options.location_branch = []; 
  $scope.options.supplier_return = false;
  
  //add options
  $scope.options.doc_type = "IR";
  $scope.options.rows_dtl =[];
  $scope.options.rows_dtl_col ={id:'',item_id:'',item_c_code:'',item_c_name:'',uofm_id:'',uofm_c_name:'',
  	f_quantity:1,f_price:0,f_unit_price:0,f_discount_pct:0,f_discount:0,f_unit_total:0
  	,hcode:''
  };

        
  $scope.options.cols_dtl_th = [
      {label:'No.', width:60, }, 
      //{label:'hcode', width:60, },
      {label:'รหัส', width:60, },
      {label:'ชื่อ', },
      {label:'จำนวน', width:80, align:'right', },
      //{label:'หน่วย', map: 'uofm_c_name',  },
      {label:'หน่วย', width:80, align:'center', },
      {label:'ราคา', width:80, align:'center', },
      {label:'ส่วนลด', colspan:3 , width:125, align:'center', }, 
      {label:'จำนวนเงิน', width:80, align:'center', },
      {label:'รับเข้า', width:80, align:'center', }, 
    ]    
  $scope.options.cols_dtl = [
      {label:'No.', map:'id', width:60, format:'index', },
      //{label:'hcode', map:'hcode', width:60, },
      {label:'รหัส', map:'item_c_code', width:60, },
      {label:'ชื่อ', map:'item_c_name', },
      {label:'จำนวน', map:'f_quantity', width:80, align:'right',  },
      {label:'หน่วย', map: 'uofm_c_name_show', width:80, align:'center', },
      
      //{label:'ราคา', map:'f_price', width:80, },
      //{label:'ส่วนลด', map:'f_discount_pct', width:40, },
      //{label:' ', map:'c_percent', width:40, },
      //{label:'ส่วนลด', map:'f_discount', width:40, },
      //{label:'จำนวนเงิน', map:'f_unit_total', width:80, align:'right', },
      
      {label:'ราคา', map:'f_price' , type:'textbox', size:5, align:'right', width:80, valid_number:'valid-number',
      	changeFn :  function(row){ $scope.row_dtl_change(row,''); }, 
      },
      {label:'ส่วนลด', map:'f_discount_pct' , type:'textbox', size:3, align:'right', width:65, valid_number:'valid-number',
      	changeFn :  function(row){ $scope.row_dtl_change(row,'discount_pct'); }, 
      },
      {label:' ', map:'c_percent', width:40, },
      //{label:'ส่วนลด', map:'f_discount', width:40, },
      {label:'ส่วนลด', map:'f_discount' , type:'textbox', size:5, align:'right', width:80, valid_number:'valid-number',
      	changeFn :  function(row){ $scope.row_dtl_change(row,''); }, 
      },
      {label:'จำนวนเงิน', map:'f_unit_total', width:80, align:'right', },  
      
      {label:'รับเข้า', map:'f_unit_input', type:'textbox', size:8, align:'right', width:80,
      	changeFn :  function(row){ 
      			$scope.row_dtl_change(row,''); 
      		}, 
      },
    ]
      
  $scope.options.afterGet = function(rows){
     

  	  angular.forEach(rows, function(v,k) {
  	  	
  	  	var c_hdr_info = angular.fromJson(v.c_hdr_info);         
        v.c_location_send = c_hdr_info.c_location_send;
        
        
  		//alert(v.doc_type.indexOf('MISSING'));
  		if(v.doc_type.indexOf('MISSING')>-1){
			v.c_doc_no_show = v.c_refer_group_c_doc_no;
		}else{
			v.c_doc_no_show = v.c_doc_no;
		}
  		/*
  		if(v.e_status_action=='active_create'){
	        v.rowBtn = {
	          icon:'fa-pencil',  
	        };	 
		}else if(v.e_status_action=='active_confirm'){
	        v.rowBtn = {
	  	 			icon:'fa-search',  
	        };		 
		}else if(v.e_status_action=='delete'){
	        v.rowBtn = {
	  	 			icon:'fa-search',  
	        };	 	
  		} 
  		*/
    })
    //alert("afterGet");
  	//console.log("afterGet",rows);
  }
  
     
  $scope.options.beforeUpdRow = function(row) {    
  	$scope.options.missing = row.doc_type.indexOf('MISSING')>-1 ? true : false;
 	
 	$scope.options.disabled = true;
 	$scope.options.disabledNote=false;
    $scope.options.ir = {
    	show:true,
    	disabled:false,
    } 	 	
 	 
  	$scope.options.rows_hdr_temp = angular.copy(row);
	
	
  	var row_tmp = angular.copy(row);
  	var row_dtl = angular.copy(row_tmp.dtls);  	
  	
   	var c_hdr_info = angular.fromJson(row_tmp.c_hdr_info);
  	angular.forEach( c_hdr_info, function(value, key) {
		this[key] = value ;	 	
	}, row_tmp);    	
   	
  	delete row_tmp.c_hdr_info;
  	
  	$scope.options.rows_dtl_temp = angular.copy(row_tmp.dtls);    	
	delete row_tmp.dtls;   	
  	
  	$scope.options.rows_hdr_temp = angular.copy(row_tmp);  	
 	
  	for(var i in row_dtl){
		var c_dtl_info = angular.fromJson(row_dtl[i].c_dtl_info);
		delete row_dtl[i].c_dtl_info;
		angular.forEach(c_dtl_info, function(value, key) {
			this[key] = value ;	 	
		}, row_dtl[i]);
		row_dtl[i].f_unit_input = row_dtl[i].f_quantity;
		
		//row_dtl[i].disabled = true		
		//ส่งให้สาขา
		//"i_add_branch":"1","c_send_to_branch_tel":"กกกกกก","i_send_to_branch":"136","c_add_option_note":"2222"
		if( !angular.isUndefined(row_dtl[i].i_add_branch) ){

			for(var key in $scope.MODEL.location_branch){
				if( $scope.MODEL.location_branch[key].id == row_dtl[i].i_send_to_branch){
					$scope.options.location_branch[i] = $scope.MODEL.location_branch[key];
					break;
				}		
			}
		} 
		
		row_dtl[i].option_disabled = true;	
		
		row_dtl[i].uofm_c_name_show = row_dtl[i].uofm_c_name;
		if( parseFloat(row_dtl[i].uofm_f_factor) !='1'){
			if( !angular.isUndefined(row_dtl[i].uofm_c_name_org) )
				row_dtl[i].uofm_c_name_show += "("+parseFloat(row_dtl[i].uofm_f_factor)+row_dtl[i].uofm_c_name_org+")";
			else if( !angular.isUndefined(row_dtl[i].c_receive_uofm_name) )
				row_dtl[i].uofm_c_name_show += "("+parseFloat(row_dtl[i].uofm_f_factor)+row_dtl[i].c_receive_uofm_name+")";
			else 
				row_dtl[i].uofm_c_name_show += "("+parseFloat(row_dtl[i].uofm_f_factor)+")";
		}
	} 
  	
  	
  	$scope.row = {};
  	$scope.row.hdr = row_tmp;  	
  	
   	  
  	$scope.row.hdr.doc_type = $scope.options.doc_type;
	 
    if(!$scope.options.missing){
    	$scope.row.hdr.c_refer_group_c_doc_no = angular.copy(row_tmp.c_doc_no); 	
		$scope.row.hdr.i_refer_group_id = angular.copy(row_tmp.id);
	}else{
		$scope.row.hdr.missing_c_doc_no = angular.copy(row_tmp.c_doc_no);		
	}
	//console.log("iAPI",iAPI.config);
	iAPI.config["pageTitle_add_edit"]  = $scope.row.hdr.c_refer_group_c_doc_no;
	//alert(iAPI.config["pageTitle_add_edit"]);
	$scope.theChgPageFn('form');	
	
	  	
	$scope.row.hdr.d_date = new Date();
	$scope.row.hdr.d_date_send = new Date(); 
	$scope.row.hdr.d_confirm = new Date();
	

	


    $scope.row.hdr.c_type = "credit";
    $scope.c_type_change();
    $scope.row.hdr.c_credit_day = "30";
    $scope.c_credit_day_change();
    $scope.row.hdr.c_verdor_tax_doc_no = "";
  	
  	$scope.options.rows_dtl = row_dtl;
  	
	for(var key in $scope.MODEL.vendor){
		if( $scope.MODEL.vendor[key].id == $scope.row.hdr.i_from){
			$scope.options.vendor = $scope.MODEL.vendor[key];
			if( angular.isUndefined($scope.row.hdr.c_vendor_name) )
				$scope.row.hdr.c_vendor_name = $scope.options.vendor.c_name;
			break;
		}		
	}
 
  	for(var key in $scope.MODEL.location){
		if( $scope.MODEL.location[key].id == $scope.row.hdr.c_location_send_id){
			$scope.options.location = $scope.MODEL.location[key];
			break;
		}		
	}     
	
	$scope.row.hdr.f_deposit = 0.00;
	$scope.row.hdr.f_doc_deduct_deposit = $scope.row.hdr.f_doc_subtotal;
	$scope.row_hdr_change('');	
    	
  	console.log("beforeUpdRow hdr ",$scope.row);
  	console.log("beforeUpdRow dtl",$scope.options.rows_dtl);
  	
  }

  $scope.options.beforePost = function(row) { 
  
      if( row.hdr.c_verdor_tax_doc_no == '' ){   
      	alert("กรุณาใส่เลขที่บิล");
      	return false; 
      } 	
   	  
   	  if( row.hdr.e_action == 'missing_complete' ){
	  	
	  	$scope.options.insert_stock_card = false;
	  	
   	 	row.hdr.i_refer_id = row.hdr.id;
   	 	row.hdr.c_refer_c_doc_no = row.hdr.c_doc_no;
   	    
   	    row.dtl = $scope.options.rows_dtl;
   	    	
  		return true; 
	  }
   	  
   	  	  
   	  
   	  $scope.options.insert_stock_card = true;
   	  
   	  //var rows_hdr_temp = angular.copy($scope.row.hdr);
   	  var rows_hdr_temp = angular.copy($scope.options.rows_hdr_temp);
   	  var rows_dtl_temp = angular.copy($scope.options.rows_dtl_temp);
   	  //console.log("rows_hdr_temp",$scope.options.rows_hdr_temp);
   	  //$scope.options.rows_dtl_temp = angular.copy($scope.options.rows_dtl);
   	  $scope.options.rows_dtl_temp = [];
   	  
   	  var f_doc_summary = 0 ;
   	  var f_doc_summary_mis = 0 ;
   	  
   	  $scope.options.chk_missing = false;
   	  for(var m in $scope.options.rows_dtl) {
   	  	
   	  	delete $scope.options.rows_dtl[m].option_disabled ;	
   	  	delete $scope.options.rows_dtl[m].disabled ;
   	  	
   	  	//ไม่ให้รับเข้า คาไว้เฉยๆ mm ตรวจสอบแล้ว่า ส่งของครบ ให้มาปิด po เอง
   	  	//row_dtl[i].disabled = true
   	  	
   	  
   	    var f_unit_input = iAPI.tofix( angular.copy($scope.options.rows_dtl[m].f_unit_input) );
   		var f_quantity = iAPI.tofix( angular.copy($scope.options.rows_dtl[m].f_quantity) );
   	
    	delete $scope.options.rows_dtl[m].f_unit_input; 
    	delete $scope.options.rows_dtl[m].uofm_c_name_show;
    	
    	 	
		$scope.options.rows_dtl[m].f_quantity = f_unit_input;     	
		
		
   		if(f_unit_input<f_quantity){

			$scope.options.chk_missing = true;			
		
			//$scope.options.rows_dtl[m].f_unit_price = f_unit_price;	
			//$scope.options.rows_dtl[m].f_unit_total = f_unit_price;	
			
			var row_mis = angular.copy($scope.options.rows_dtl[m]);
					
			//คำนวนค่า
			var f_price = iAPI.tofix(rows_dtl_temp[m].f_price); 
			
			//alert("f_price "+f_price +"  f_quantity=" +f_quantity +"  f_unit_input=" +f_unit_input );
			
			var f_quantity_mis = f_quantity - f_unit_input;
			var f_unit_price_mis = f_quantity_mis * f_price;
			
			row_mis.f_quantity = f_quantity_mis;  
			row_mis.f_unit_price = f_unit_price_mis;  
			row_mis.f_unit_total = f_unit_price_mis;  

			//alert(row_mis.f_unit_total);

			var f_unit_price = f_unit_price_mis;

			row_mis.f_discount_pct = 0 ;
			row_mis.f_discount = 0 ;
			
			//เอาส่วนลดออกไปเลย			
			/*
			//คำนวนส่วยลด
			var f_discount_pct = iAPI.tofix(rows_dtl_temp[m].f_discount_pct);
		   	var f_discount = iAPI.tofix(rows_dtl_temp[m].f_discount);
		   	 
	 
		   	if( isNaN(f_discount_pct) ) f_discount_pct = 0 ;
		   	if( isNaN(f_discount) ) f_discount = 0 ;
		   	
		    //alert("f_discount_pct=" +f_discount_pct +"  f_discount="+f_discount);   		   		
		   	if( f_discount_pct != 0){
				f_discount = f_unit_price * (f_discount_pct / 100); 
				f_discount = iAPI.round(f_discount); 
				
				row_mis.f_discount = f_discount;
				row_mis.f_unit_total = f_unit_price - f_discount;
				
			}else if(f_discount!=0) {
			 	//เทียบ ตามสัดส่วน
			 	f_discount_pct = f_discount / f_unit_price ;
			 	f_discount = f_unit_price * (f_discount_pct / 100); 
			 	f_discount = iAPI.round(f_discount); 
			 	
			 	row_mis.f_discount = f_discount;
				row_mis.f_unit_total = f_unit_price - f_discount;
			}else{
				row_mis.f_discount = 0 ;	
				row_mis.f_discount_pct = 0 ;			
			}
			*/
 
			f_doc_summary_mis += row_mis.f_unit_total;
			//alert(f_doc_summary_mis);
			
			//แยกทำใบขาด
			$scope.options.rows_dtl_temp.push(row_mis);
			
		} 
		 	  	   	 	

   	 }   	 
   	 
   	 var rows_dtl1 = [];
   	 for(var m in $scope.options.rows_dtl) {   	 	
   	 	//หาจำนวนที่ไม่เป็น 0 เพื่อ save
   	 	if( $scope.options.rows_dtl[m].f_quantity != 0)
   	 		rows_dtl1.push($scope.options.rows_dtl[m]);
   	 }
   	 
   	 //หาตัวซ้ำก่อน
   	 var rows_dtl2 = [];
   	 for(var m in rows_dtl1) { 
   	    var row1 = rows_dtl1[m];
   	    var chk = false ;
   	 	for(var n in rows_dtl2){
			var row2 = rows_dtl2[n];
			if( row1.item_id == row2.item_id && row1.uofm_id == row2.uofm_id ){
				chk = true;
				break;
			}
		}
		if(!chk){
			rows_dtl2.push(row1);
		}
   	 }
   	 //หา item uofm ที่ซ้ำมารวมกัน
   	 for(var n in rows_dtl2){
   	 	var row2 = rows_dtl2[n];
   	 	for(var m in rows_dtl1) {
   	 		var row1 = rows_dtl1[m];
   	 		if( row1.id != row2.id && row1.item_id == row2.item_id && row1.uofm_id == row2.uofm_id ){
   	 			row2.f_quantity = iAPI.tofix(row2.f_quantity) + iAPI.tofix(row1.f_quantity) ;
   	 			row2.f_unit_price = iAPI.tofix(row2.f_unit_price) + iAPI.tofix(row1.f_unit_price) ;
   	 			row2.f_discount = iAPI.tofix(row2.f_discount) + iAPI.tofix(row1.f_discount) ;
   	 			row2.f_unit_total = iAPI.tofix(row2.f_unit_total) + iAPI.tofix(row1.f_unit_total) ;
   	 		}
   	 	}
   	 }
   	 row.dtl = rows_dtl2; 
   	 
   	 
   	   	 
   	 //return false ; 

   	 //row.dtl = $scope.options.rows_dtl;
   	 
   	 //คำนวนเงินใหม่เลย
   	 if($scope.options.chk_missing){
   	 	    	 	
   	 	 /*
   	 	 //เอาส่วนลดออกไปเลย
	   	 var f_doc_discount_pct = iAPI.tofix(rows_hdr_temp.f_doc_discount_pct);
	   	 var f_doc_discount = iAPI.tofix(rows_hdr_temp.f_doc_discount);
	   	 if( isNaN(f_doc_discount_pct) ) f_doc_discount_pct = 0 ;
	   	 if( isNaN(f_doc_discount) ) f_doc_discount = 0 ;	   	 
	   	 	   	 
	   	 if( f_doc_discount_pct != 0){
			rows_hdr_temp.f_doc_discount = f_doc_summary_mis * (f_doc_discount_pct / 100); 
			rows_hdr_temp.f_doc_discount = iAPI.round(rows_hdr_temp.f_doc_discount); 
		 }else if(f_doc_discount!=0) {
		 	//เทียบ ตามสัดส่วน
		 	f_doc_discount_pct = f_doc_discount / f_doc_summary_mis;
		 	rows_hdr_temp.f_doc_discount = f_doc_summary_mis * (f_doc_discount_pct / 100); 
		 	rows_hdr_temp.f_doc_discount = iAPI.round(rows_hdr_temp.f_doc_discount); 
		 }else{
		 	rows_hdr_temp.f_doc_discount = 0 ;
		 }
		 
		 rows_hdr_temp.f_doc_summary = f_doc_summary_mis;		 
	 	 rows_hdr_temp.f_doc_subtotal = iAPI.tofix(rows_hdr_temp.f_doc_summary) - iAPI.tofix(rows_hdr_temp.f_doc_discount) ;	
	 	 */
	 	 
	 	 
	   	 rows_hdr_temp.f_doc_summary = f_doc_summary_mis;	
	   	 rows_hdr_temp.f_doc_discount_pct = 0 ;
	   	 rows_hdr_temp.f_doc_discount = 0 ;	 
	     rows_hdr_temp.f_doc_subtotal = iAPI.tofix(rows_hdr_temp.f_doc_summary);
	     
	     
	 	if( rows_hdr_temp.f_tax_chk == 'no_vat' ){
	 	
		 	rows_hdr_temp.f_tax_pct = "";
		 	rows_hdr_temp.f_tax = "";	 	
		 	rows_hdr_temp.f_doc_total = rows_hdr_temp.f_doc_subtotal ;
		 	
		 }else if( rows_hdr_temp.f_tax_chk == 'include' ){

		 	if( rows_hdr_temp.f_tax_pct == "") rows_hdr_temp.f_tax_pct = $scope.MODEL.vat["vat_pct"];
		 	var f_tax_pct = iAPI.tofix(rows_hdr_temp.f_tax_pct);
	   	 	if( isNaN(f_tax_pct) ) f_tax_pct = 0 ;
	   	 	var f_tax = iAPI.round( rows_hdr_temp.f_doc_subtotal * f_tax_pct / (100 + f_tax_pct ) );
	   	 	rows_hdr_temp.f_tax = f_tax;
	   	 	
		 	rows_hdr_temp.f_doc_total = rows_hdr_temp.f_doc_subtotal ;
	 			 	
		 }else if( rows_hdr_temp.f_tax_chk == 'exclude' ){


		 	if( rows_hdr_temp.f_tax_pct == "") rows_hdr_temp.f_tax_pct = $scope.MODEL.vat["vat_pct"];
		 	var f_tax_pct = iAPI.tofix(rows_hdr_temp.f_tax_pct);
	   	 	if( isNaN(f_tax_pct) ) f_tax_pct = 0 ;
	   	 	var f_tax = iAPI.round( rows_hdr_temp.f_doc_subtotal * f_tax_pct /100 );
		 	rows_hdr_temp.f_tax = f_tax;
		 	
	   	 	rows_hdr_temp.f_doc_total = rows_hdr_temp.f_doc_subtotal + iAPI.tofix(rows_hdr_temp.f_tax) ;
   	 		 	
		 }	
		 rows_hdr_temp.f_doc_total_text = iAPI.MoneyToWord(rows_hdr_temp.f_doc_total);
		    	  	
	 }

     rows_hdr_temp.c_verdor_tax_doc_no = row.hdr.c_verdor_tax_doc_no ;
	 
   	 row.hdr.e_action = 'confirm';   	
   	 row.hdr.i_refer_id = rows_hdr_temp.id;
   	 row.hdr.c_refer_c_doc_no = rows_hdr_temp.c_doc_no;
   	
   	 if( !$scope.options.missing ) {
   	 	row.hdr.i_refer_group_id = rows_hdr_temp.id; 
   	 	row.hdr.c_refer_group_c_doc_no = rows_hdr_temp.c_doc_no;
   	 	
   	 	rows_hdr_temp.i_refer_group_id = rows_hdr_temp.id; 
   	 	rows_hdr_temp.c_refer_group_c_doc_no = rows_hdr_temp.c_doc_no;
   	 	
   	 }
   	
   	delete row.hdr.e_status_action;
   	delete row.hdr.c_doc_no_show;
	delete row.hdr.d_create; 
	//delete row.hdr.d_confirm;    
	delete row.hdr.d_complete;       
	delete row.hdr.missing_c_doc_no;
	
    $scope.options.rows_hdr_temp = rows_hdr_temp;
    //alert("c_doc_no="+rows_hdr_temp.c_doc_no );
   	    	   	    	
  	return true; 
  }
    

  $scope.options.afterPost = function(row){
  
  	
  	var url = '';
  	var data = {};
  	
  	var rows_dtl = angular.copy($scope.options.rows_dtl);
  	var row_hdr = angular.copy($scope.row.hdr);
  	
  	
  	//2016-09-29 เอาออกให้ไป Approve ที่ Po_completeCtrl
  	/*
  	if($scope.options.insert_stock_card){
	  	//update stock 
	  	//ir in stock
		url = 'document.insert_stock_card_to';
		data = {};
		data.id = row.id;
		iAPI.post(url,data).success(function(res) {
			//alert("รับเช้า stock เรียบร้อยแล้ว");
			
			//2015-11-09 เอา ใบ do auto ออก จะได้ไม่มีปัญหา
			//$scope.options.save_do(row_hdr,rows_dtl);	
					
		}); 		
	}
	*/
  
    var rows_dtl1 = [];
   	for(var m in $scope.options.rows_dtl) {   	 	
   	 	//หาจำนวนที่ไม่เป็น 0 เพื่อ save
   	 	if( $scope.options.rows_dtl[m].f_quantity != 0)
   	 		rows_dtl1.push($scope.options.rows_dtl[m]);
   	}
   	  	 		
    	
	var tmp_row = {}; 
	tmp_row.hdr = angular.copy($scope.options.rows_hdr_temp);
	tmp_row.dtl = angular.copy($scope.options.rows_dtl_temp); 

	console.log("afterPost",tmp_row);		
		
		   	
    //alert($scope.options.chk_missing);
   	if($scope.options.chk_missing){
   		
   		data = {};
		data.hdr = {};		
		data.hdr.id = tmp_row.hdr.id;
		data.hdr.c_doc_no = tmp_row.hdr.c_doc_no;
		data.hdr.doc_type = tmp_row.hdr.doc_type; 
		data.hdr.e_action = "missing";

		url = 'document.update_action_doc';
		iAPI.post(url,angular.copy(data)).success(function(res) {
    		$scope.theRefashFn();
    	});
    	
    	
    	
		//ออกใบขาด
		//{"c_refer_c_doc_no":"IT-MS-AR-000021","c_pin":2375,"main_refer_id":"","c_user_send":"Admin Admin","main_refer_c_doc_no":"","c_user_confirm":"Admin Admin","c_to_hcode":"53-000003","c_from_hcode":"53-000001","c_refer_id":"367"}
		
		data = {};
		data.hdr = tmp_row.hdr;		
		
   		data.hdr.i_refer_id = angular.copy(tmp_row.hdr.id); 
   	 	data.hdr.c_refer_c_doc_no = angular.copy(tmp_row.hdr.c_doc_no);	
   	 		
		data.hdr.c_doc_no = "";
		data.hdr.doc_type = "PO-MISSING";
		data.hdr.get_last_no = "PO-MS"+$scope.getYearTH+$scope.getMonth;
   		data.hdr.get_last_no_size = 4;
   		  
   		data.hdr.e_action = 'confirm'; 
   
		data.hdr.d_date = new Date();
   		data.hdr.d_date_send = new Date();
   		data.hdr.d_confirm = new Date();
   		
   	 	 
	  	var row_dtl = tmp_row.dtl;
	  	
	  	for(var i in row_dtl){
			var c_dtl_info = angular.fromJson(row_dtl[i].c_dtl_info);
			delete row_dtl[i].c_dtl_info;
			angular.forEach(c_dtl_info, function(value, key) {
				this[key] = value ;	 	
			}, row_dtl[i]);			
		} 
		data.dtl = tmp_row.dtl;
	
		delete data.hdr.e_status_action;
		delete data.hdr.c_doc_no_show;
		delete data.hdr.d_complete;
		
		console.log("missing",data);
		
		url = 'document.save_doc';
		iAPI.post(url,angular.copy(data)).success(function(res) { 
					
			$scope.row.hdr = res ;
			$scope.print_action();
						
    		$scope.theRefashFn();
    	});
		
	}else{
			
		//complete - po		
		if( !$scope.options.missing ){		
			//alert("PO" + tmp_row.hdr.c_doc_no);	
			
			data = {};
			data.hdr = {};	
			data.hdr.id = tmp_row.hdr.id;
			data.hdr.c_doc_no = tmp_row.hdr.c_doc_no;			
	   	    data.hdr.doc_type = "PO";	
			data.hdr.d_confirm = new Date();  
			data.hdr.e_action = "complete";
			data.no_new_doc = true

			url = 'document.update_action_doc';
			iAPI.post(url,angular.copy(data)).success(function(res) {
	    		$scope.theRefashFn();
	    	});			
				
		}else{			
			
			data = {};
			data.hdr = {};	 
			data.hdr.id = tmp_row.hdr.i_refer_group_id;
			data.hdr.c_doc_no = tmp_row.hdr.c_refer_group_c_doc_no;
			data.hdr.doc_type = "PO";	
			data.hdr.d_confirm = new Date();  
			data.hdr.e_action = "complete";

			url = 'document.update_action_doc';
			iAPI.post(url,angular.copy(data)).success(function(res) {
	    		
	    	});			
		 	
		 	data = {};
			data.hdr = {};	
			data.hdr.id = tmp_row.hdr.id;
			data.hdr.c_doc_no = tmp_row.hdr.c_doc_no;	
			data.hdr.doc_type = "PO-MISSING";	
			data.hdr.d_confirm = new Date();  
			data.hdr.e_action = "complete";

			url = 'document.update_action_doc';
			iAPI.post(url,angular.copy(data)).success(function(res) {
				

	    		$scope.theRefashFn();
	    	});
					 
	   	 }    	   	 

	}
     
  }
 
  $scope.options.save_do = function(row_hdr,rows_dtl){
 	 
 	var url = '';
  	var data = {};
  	
  	//var rows_dtl = $scope.options.rows_dtl;
  	//var row_hdr = $scope.row.hdr;
  	
   	var brList = []; 	
	var brList_dtl = []; 
 	//ออกใบ do ให้กับ สาขาถ้ามีการส่งของให้สาขา
 	for(var i in rows_dtl){
		//ค้นหา สาขาก่อน
		if(rows_dtl[i].i_add_branch == "1" && rows_dtl[i].f_quantity != 0){
	  		//alert(rows_dtl[i].i_send_to_branch); 
	  		var br_id = rows_dtl[i].i_send_to_branch;
	  		if( angular.isUndefined(brList[br_id]) ){ 
	  			brList[br_id] = [];
	  		}
	  		brList[br_id].push( angular.copy( rows_dtl[i] ) );
	  		//copy ข้อมูล ลง array
		} 
	}
 	//console.log(brList);
 	//ออกใบ DO ตามจำนวนสาขาที่ใส่
 	for(var i in brList){
 		data.hdr = {};	
 		data.hdr.c_doc_no = "";
		data.hdr.c_note="";
 
   		data.hdr.i_from = row_hdr.i_from;
   		data.hdr.c_from_name = row_hdr.c_from_name;
   		data.hdr.e_from = row_hdr.e_from;
   		
   		for(var key in $scope.MODEL.location_branch){
			if( $scope.MODEL.location_branch[key].id == i){
   				//alert(i + " " + $scope.MODEL.location_branch[key].c_country_code );				
				data.hdr.i_to = i ;
   				data.hdr.c_to_name = angular.copy( $scope.MODEL.location_branch[key].c_name ); 
				break;
			}		
		}
  		//console.log("auto do i_to",data.hdr.i_to );			
   		data.hdr.d_date = row_hdr.d_date;
   		data.hdr.d_date_send = row_hdr.d_date_send;
      	
   		data.hdr.doc_type = "DO";
   		data.hdr.get_last_no = "RL"+$scope.getYearTH+$scope.getMonth;
   		data.hdr.get_last_no_size = 4;  	  
   	    
   	    data.hdr.i_refer_id = row_hdr.id;
   	    data.hdr.c_refer_c_doc_no = row_hdr.c_doc_no;
   	    
   	    data.hdr.i_refer_group_id = row_hdr.id;
   	    data.hdr.c_refer_group_c_doc_no = row_hdr.c_doc_no;
   	    data.hdr.e_create_by = "PO";
   	    
   		data.dtl =[];       
   		var f_doc_summary = 0 ;
  		for(var j in brList[i]){
  			var dtl = brList[i][j];
  			//คำนวนค่าใหม่
  			//dtl.uofm_id 
  			  			
  			//dtl.uofm_id = dtl.location_uofm_id;
  			//dtl.uofm_c_name = dtl.c_location_uofm_name;
  			//f_quantity
  			if( angular.isUndefined(dtl.f_price_to_location) ) dtl.f_price_to_location = 0 ;
  			
  			dtl.ProdName = dtl.item_c_name; 
  			dtl.BarCode = dtl.item_c_code; 
  			
  			
  			dtl.f_price = dtl.f_price_to_location;  			
  			dtl.f_unit_price = dtl.f_quantity*dtl.f_price ;
			dtl.f_unit_total = dtl.f_unit_price ;
			
  			data.dtl.push( angular.copy(dtl) );
  			  			
  			//คำนวนยอดเงินด้วย ค้างไว้ก่อน
  			f_doc_summary+= iAPI.tofix(dtl.f_unit_total);
  		}
  		   	 
	   	data.hdr.f_doc_summary = f_doc_summary;
	   	data.hdr.f_doc_subtotal = f_doc_summary;;
	   	data.hdr.f_doc_total = f_doc_summary; 
		data.hdr.f_doc_total_text = iAPI.MoneyToWord(row_hdr.f_doc_total);
		
		data.hdr.chk_f_before_bal = true;
   	 
  		//console.log("auto do",angular.copy(data));
 		url="document.save_doc";
 		iAPI.post(url,angular.copy(data)).success(function(res) {
			
		});
			
 	}
 	  	
  }  
    
  $scope.po_missing = function() { 
 	var	data = {};
		
	data = {};
	data.hdr = {};	
	data.hdr.id = $scope.row.hdr.i_refer_group_id;
	data.hdr.c_doc_no = $scope.row.hdr.c_refer_group_c_doc_no;
	data.hdr.doc_type = "PO";	
	data.hdr.d_confirm = new Date();  
	data.hdr.e_action = "missing_complete";

	url = 'document.update_action_doc';
	iAPI.post(url,angular.copy(data)).success(function(res) {
	
	});			
 	
 	data = {};
	data.hdr = {};	
	data.hdr.id = $scope.row.hdr.id;
	data.hdr.c_doc_no = $scope.row.hdr.c_doc_no;	
	data.hdr.doc_type = "PO-MISSING";	
	data.hdr.d_complete = new Date();  
	data.hdr.e_action = "missing_complete";

	url = 'document.update_action_doc';
	iAPI.post(url,data).success(function(res) {
		$scope.theRefashFn();
	}); 
	    	 
  } 
              
  $scope.row_dtl_change = function(row,c_discount_type) {
 
   	 
   	console.log("row_dtl_change" + "  c_discount_type = " + c_discount_type,row); 
   	
   	 
   	var f_unit_input = iAPI.tofix( angular.copy(row.f_unit_input) );
   	var f_quantity = iAPI.tofix( angular.copy(row.f_quantity) );
   	
   	if(f_unit_input<0){
   		alert("อย่าใส่จำนวนต่ำกว่า 0");		
		row.f_unit_input=row.f_quantity ;
		return ;
	}
		
	else if(f_unit_input>f_quantity){			
		f_unit_input = f_quantity; 		
	}
		
   	var f_discount_pct = iAPI.tofix(row.f_discount_pct);
   	if( isNaN(f_discount_pct) ) f_discount_pct = 0 ;   	
   	if( f_discount_pct == '' )  f_discount_pct = 0 ;  	
   	
   	row.f_unit_price = (iAPI.tofix(f_unit_input)*iAPI.tofix(row.f_price));
   	
   	if( c_discount_type == "discount_pct" && f_discount_pct == 0 ){   
		row.f_discount = 0 ;
	}else if( f_discount_pct != 0){
		row.f_discount = row.f_unit_price * (f_discount_pct / 100); 
		row.f_discount = iAPI.round(row.f_discount); 
	}	
   	row.f_unit_total = row.f_unit_price-iAPI.tofix(row.f_discount) ;
   	$scope.row_hdr_change('');
  }   
 
  $scope.row_hdr_change = function(c_discount_type) {
   	 
   	 console.log("row_hdr_change" + "  c_discount_type = " + c_discount_type,$scope.row.hdr);  
   	 
   	 
   	 var f_doc_summary = 0 ;
   	 for(var m in $scope.options.rows_dtl) {
   	 	var value = $scope.options.rows_dtl[m];
   	 	f_doc_summary+= iAPI.tofix(value.f_unit_total);
   	 }
   	 
   	  
   	 var f_doc_discount_pct = iAPI.tofix($scope.row.hdr.f_doc_discount_pct);
   	 if( isNaN(f_doc_discount_pct) ) f_doc_discount_pct = 0 ;
   	 if( f_doc_discount_pct == '' )  f_doc_discount_pct = 0 ;
   	 
   	 if( c_discount_type == "discount_pct" && f_doc_discount_pct == 0 ){   
		$scope.row.hdr.f_doc_discount = 0 ;
	 }else if( f_doc_discount_pct != 0){
		$scope.row.hdr.f_doc_discount = f_doc_summary * (f_doc_discount_pct / 100); 
		$scope.row.hdr.f_doc_discount = iAPI.round($scope.row.hdr.f_doc_discount); 
	 }  	 
   	 
   	 $scope.row.hdr.f_doc_summary = f_doc_summary;
   	 $scope.row.hdr.f_doc_subtotal = iAPI.tofix($scope.row.hdr.f_doc_summary) - iAPI.tofix($scope.row.hdr.f_doc_discount);
   	 
   	 var f_deposit = iAPI.tofix($scope.row.hdr.f_deposit);
   	 if( isNaN(f_deposit) ) f_deposit = 0.00 ;
   	 $scope.row.hdr.f_deposit = iAPI.tofix(f_deposit);
   	 
   	 $scope.row.hdr.f_doc_deduct_deposit = $scope.row.hdr.f_doc_subtotal - f_deposit;
   	 
   	 var f_doc_subtotal = iAPI.tofix($scope.row.hdr.f_doc_deduct_deposit);
 
   	 
   	 if( $scope.row.hdr.f_tax_chk == 'no_vat' ){
	 	
	 	$scope.row.hdr.f_tax_pct = "";
	 	$scope.row.hdr.f_tax = "";	 	
	 	$scope.row.hdr.f_doc_total = f_doc_subtotal ;
	 	
	 }else if( $scope.row.hdr.f_tax_chk == 'include' ){
	 	
	 	if( $scope.row.hdr.f_tax_pct == "" || $scope.row.hdr.f_tax_pct == "0" ) $scope.row.hdr.f_tax_pct = $scope.MODEL.vat["vat_pct"];
	 	var f_tax_pct = iAPI.tofix($scope.row.hdr.f_tax_pct);
   	 	if( isNaN(f_tax_pct) ) f_tax_pct = 0 ;
   	 	var f_tax = iAPI.round( f_doc_subtotal * f_tax_pct / (100 + f_tax_pct ) );
   	 	$scope.row.hdr.f_tax = f_tax;
   	 	
	 	$scope.row.hdr.f_doc_total = f_doc_subtotal ;
	 }else if( $scope.row.hdr.f_tax_chk == 'exclude' ){
	 	
	 	if( $scope.row.hdr.f_tax_pct == "" || $scope.row.hdr.f_tax_pct == "0" ) $scope.row.hdr.f_tax_pct = $scope.MODEL.vat["vat_pct"];
	 	var f_tax_pct = iAPI.tofix($scope.row.hdr.f_tax_pct);
   	 	if( isNaN(f_tax_pct) ) f_tax_pct = 0 ;
   	 	var f_tax = iAPI.round( f_doc_subtotal * f_tax_pct /100 );
	 	$scope.row.hdr.f_tax = f_tax;
	 	
   	 	$scope.row.hdr.f_doc_total = f_doc_subtotal + iAPI.tofix($scope.row.hdr.f_tax) ;	 	
	 }
	 $scope.row.hdr.f_doc_total_text = iAPI.MoneyToWord($scope.row.hdr.f_doc_total);
   	 
   	 

   	 //alert($scope.row.hdr.f_doc_total);
  }  

  $scope.c_type_change = function() {
  	//alert($scope.row.hdr.c_type);
  	if($scope.row.hdr.c_type=="cash"){
	    $scope.row.hdr.get_last_no = "HP" +$scope.getYearTH+$scope.getMonth;
	    $scope.row.hdr.get_last_no_size = 4;  		
	}else{
		$scope.row.hdr.get_last_no = "RR" +$scope.getYearTH+$scope.getMonth;
	    $scope.row.hdr.get_last_no_size = 4;  	
	}
		    	
    var parameter = { c_code: $scope.row.hdr.get_last_no , size: $scope.row.hdr.get_last_no_size , update : false };  
    iAPI.post('document.get_last_no',parameter).success(function(data) {
   	    console.log("document.get_last_no",data) ;
   		data = angular.fromJson(data);
   		$scope.row.hdr.c_doc_no = data.doc_no ; ;  
    });      
  }    
  
  $scope.c_credit_day_change = function() {
  	if($scope.row.hdr.c_credit_day=="") $scope.row.hdr.c_credit_day = 0 ;
  	$scope.row.hdr.d_credit_day = iAPI.AddDay('',$scope.row.hdr.c_credit_day);
  }
 

    

  $scope.print_action = function() { 
	//ใบขาดส่งสินค้า
  	$scope.opt = {
    	report_type: "po_missing", 
    	id: $scope.row.hdr.id,     	
    }; 
    $scope.doc_print($scope.opt);    
  }
   
     
  $scope.setSaveFn = function(theSaveFn) { 
      $scope.theSaveFn = theSaveFn;
  }
  $scope.setRefashFn = function(theRefashFn) {
      $scope.theRefashFn = theRefashFn;
  };
  $scope.setChgPageFn = function(theChgPageFn) { 
      $scope.theChgPageFn = theChgPageFn;
  };
  

}])  

.controller('Po_completeCtrl', ['$scope', 'iAPI', '$modal', '$filter', '$q', '$window', function ($scope,iAPI,$modal,$filter,$q,$window) {

  var ConfPageTitle = { pageTitle_org : 'ประวัติการรับเข้า',
  	pageTitle_add_edit : '',
  	pageCaption_org : '',
  	pageTitle_edit : 'รายละเอียด',
    pageTitle_table : '',
  };
  iAPI.setConfPageTitle(ConfPageTitle);

  $scope.content_height=$window.innerHeight - $scope.innerHeight ;
  
  $scope.options = {
    allowOp: 'view,group1,month',
    dataAPI: '',
    getAPI: 'document.get_doc_web/'+'/IR'+'/active/complete/d_start/d_end',
    saveAPI: 'document.update_action_doc',
    cols : [
      {label: 'No.', map:'id', width:60, format:'index', },
      {label: 'วันที่รับเข้า', map:'d_create' },
      //{label: 'Date Confirm', map:'d_confirm' },
      {label: 'เลขที่เอกสาร', map:'c_doc_no' },
      {label: 'สั่งจาก', map:'c_from_name' },  
      //{label: 'ส่งที่', map:'c_to_name' }, 
      {label: 'ส่งที่', map:'c_location_send' },       
      {label: 'เอกสารอ้างอิง', map:'c_refer_group_c_doc_no' }, 
      {label: 'การจ่าย', map:'c_type_show'  },
    ],
    itemPerPage:$scope.itemPerPage,
    editBtn : {
		noShow:true,
	},
	viewBtn : {
		show:true,
	},
	predicate:'d_create', 
    reverse:true,
    filter_group : [
    	{map: 'e_status_action' },
    ],
    group : [
    	{ e_status_action : "active_confirm" , c_desc : "รออนุมัติ" },
    	{ e_status_action : "active_complete" , c_desc : "อนุมัติแล้ว" },
    	{ e_status_action : "active_missing_complete" , c_desc : "Close PO" }, 
    ],  
	display : {
		groupLable : "สถานะ",
		groupOrderby : " ",
	},
  }
  
  $scope.options.chgMode = function() {
  	$scope.options.allowOp = 'view,group1,month';
  } 
      
  $scope.options.row_group = $scope.options.group[0];

  $scope.options.doc_type_old = "IR"; 
  $scope.options.location_branch = []; 
   
  $scope.options.cols_dtl_th = [
      {label:'No.', width:60, }, 
      //{label:'hcode', width:60, },
      {label:'รหัส', width:60, },
      {label:'ชื่อ', },
      {label:'จำนวน', width:80, align:'right', },
      //{label:'หน่วย', map: 'uofm_c_name',  },
      {label:'หน่วย', width:80, align:'center', },
      {label:'ราคา', width:80, align:'center', },
      {label:'ส่วนลด', colspan:3, width:140, align:'center', }, 
      {label:'จำนวนเงิน', width:80, align:'right', },
    ]
  
  $scope.options.cols_dtl = [
      {label:'No.', map:'id', width:60, format:'index', },
      //{label:'hcode', map:'hcode', width:60, },
      {label:'รหัส', map:'item_c_code', width:60, },
      {label:'ชื่อ', map:'item_c_name', },
      {label:'จำนวน', map:'f_quantity', width:80, align:'right', },
      {label:'หน่วย', map: 'uofm_c_name_show', width:80, align:'center', },
      
      //{label:'ราคา', map:'f_price', width:80, },
      //{label:'ส่วนลด', map:'f_discount_pct', width:40, },
      //{label:' ', map:'c_percent', width:40, },
      //{label:'ส่วนลด', map:'f_discount', width:40, },
      //{label:'จำนวนเงิน', map:'f_unit_total', width:80, align:'right', },
      
      {label:'ราคา', map:'f_price' , type:'textbox', size:5, align:'right', width:80, valid_number:'valid-number',
      	changeFn :  function(row){ $scope.row_dtl_change(row,''); }, 
      },
      {label:'ส่วนลด', map:'f_discount_pct' , type:'textbox', size:3, align:'right', width:65, valid_number:'valid-number',
      	changeFn :  function(row){ $scope.row_dtl_change(row,'discount_pct'); }, 
      },
      {label:' ', map:'c_percent', width:40, },
      //{label:'ส่วนลด', map:'f_discount', width:40, },
      {label:'ส่วนลด', map:'f_discount' , type:'textbox', size:5, align:'right', width:80, valid_number:'valid-number',
      	changeFn :  function(row){ $scope.row_dtl_change(row,''); }, 
      },
      {label:'จำนวนเงิน', map:'f_unit_total', width:80, align:'right', },  
      
      
    ]
    

  $scope.options.afterGet = function(rows){
     
  	angular.forEach(rows, function(v,k) {
  		console.log("c_hdr_info"+v.id +" " + v.doc_type,v.c_hdr_info);
		var c_hdr_info = angular.fromJson(v.c_hdr_info);
		if( c_hdr_info.c_type == "credit" )
			v.c_type_show = "เงินเชื่อ";
		else if( c_hdr_info.c_type == "cash" )
			v.c_type_show = "เงินสด";
  		//v.c_hdr_info = angular.copy(c_hdr_info);  	 
  		       
        v.c_location_send = c_hdr_info.c_location_send;
        
         		
    })
  }
  
  
  $scope.options.beforeUpdRow = function(row) { 
  
  	$scope.options.saveAPI = 'document.update_action_doc';    
  	$scope.options.allowOp = 'view,group1,month,edit'; 
  	
  	
  	$scope.options.supplier_return = false; 
  	$scope.options.confirm = false; 
 
 
 	if( row.e_action=='confirm' ){
	    $scope.options.ir = {
	    	show:true,
	    	disabled:false,
	    } 		
	    $scope.options.disabled = false;
	    $scope.options.confirm = true;
	}else{
	    $scope.options.ir = {
	    	show:true,
	    	disabled:true,
	    } 		
	    $scope.options.disabled = true;
	}
 	 
 	
 	console.log("beforeUpdRow",row);
 	
  	var row_tmp = angular.copy(row);
  	var row_dtl = angular.copy(row_tmp.dtls);
  	
  	
  	for(var i in row_dtl){
		var c_dtl_info = angular.fromJson(row_dtl[i].c_dtl_info);
		delete row_dtl[i].c_dtl_info;
		angular.forEach(c_dtl_info, function(value, key) {
			this[key] = value ;	 	
		}, row_dtl[i]);
		
	 
		//ส่งให้สาขา
		//"i_add_branch":"1","c_send_to_branch_tel":"กกกกกก","i_send_to_branch":"136","c_add_option_note":"2222"
		if( !angular.isUndefined(row_dtl[i].i_add_branch) ){
			for(var key in $scope.MODEL.location_branch){
				if( $scope.MODEL.location_branch[key].id == row_dtl[i].i_send_to_branch){
					$scope.options.location_branch[i] = $scope.MODEL.location_branch[key];
					break;
				}		
			}
		} 
		
		row_dtl[i].disabled = $scope.options.disabled ;
		//row_dtl[i].disabled = true;	
		row_dtl[i].option_disabled = true;	
		
		row_dtl[i].uofm_c_name_show = row_dtl[i].uofm_c_name;
		if( parseFloat(row_dtl[i].uofm_f_factor) !='1'){
			if( !angular.isUndefined(row_dtl[i].uofm_c_name_org) )
				row_dtl[i].uofm_c_name_show += "("+parseFloat(row_dtl[i].uofm_f_factor)+row_dtl[i].uofm_c_name_org+")";
			else if( !angular.isUndefined(row_dtl[i].c_receive_uofm_name) )
				row_dtl[i].uofm_c_name_show += "("+parseFloat(row_dtl[i].uofm_f_factor)+row_dtl[i].c_receive_uofm_name+")";
			else 
				row_dtl[i].uofm_c_name_show += "("+parseFloat(row_dtl[i].uofm_f_factor)+")";
		}
		
	} 

  	delete row_tmp.dtls;
  	$scope.row = {};
  	$scope.row.hdr = row_tmp;  	

 
  	
  	var c_hdr_info = angular.fromJson($scope.row.hdr.c_hdr_info);
  	delete $scope.row.hdr.c_hdr_info;
  	
  	angular.forEach(c_hdr_info, function(value, key) {
		this[key] = value ;	 	
	}, $scope.row.hdr);
  	
  	$scope.options.rows_dtl = row_dtl;
  	
  	for(var key in $scope.MODEL.vendor){
		if( $scope.MODEL.vendor[key].id == $scope.row.hdr.i_from){
			$scope.options.vendor = $scope.MODEL.vendor[key];
			if( angular.isUndefined($scope.row.hdr.c_vendor_name) )
				$scope.row.hdr.c_vendor_name = $scope.options.vendor.c_name;
			break;
		}		
	}
 
  	for(var key in $scope.MODEL.location){
		if( $scope.MODEL.location[key].id == $scope.row.hdr.c_location_send_id){
			$scope.options.location = $scope.MODEL.location[key];
			break;
		}		
	}   
    

  	console.log("beforeUpdRow hdr ",$scope.row);
  	console.log("beforeUpdRow dtl",$scope.options.rows_dtl);
  	
  }  

  $scope.options.beforePost = function(row) {  

	if( !$scope.options.supplier_return ){
		
	    row = $scope.options.get_hdr_info(row);
								
	}else{
	   	 
   	 row.dtl = [];
  	 for(var m in $scope.options.rows_dtl) {
   	 	var value = $scope.options.rows_dtl[m];
   	 	if( value.chk_add == "1" ){
   	 		row.dtl.push(value);
   	 	}
   	 } 	 
		
	 //row.dtl = $scope.options.rows_dtl;   
	
	if( !angular.isUndefined($scope.row.hdr.f_doc_summary_old))   	
   	  	$scope.row.hdr.f_doc_summary_old = iAPI.tofix($scope.row.hdr.f_doc_summary_old);
   	if( !angular.isUndefined($scope.row.hdr.f_doc_summary_new))   	
   		$scope.row.hdr.f_doc_summary_new = iAPI.tofix($scope.row.hdr.f_doc_summary_new);


	}
	 	
	    	
  	return true 
  }
  
  $scope.options.get_hdr_info = function(row) {  
  
  		row.hdr_info = {};
	    row.hdr_info.c_verdor_tax_doc_no = row.hdr.c_verdor_tax_doc_no; 	
	    row.hdr_info.d_date_send = row.hdr.d_date_send; 
	    
	    
	    if( row.hdr.e_action=='confirm' ){
	    	
	    	
	    	row.hdr_info.f_deposit =	row.hdr.f_deposit;
	    	
		    row.hdr_update = {};
	 
		    row.hdr_update.f_doc_summary =	row.hdr.f_doc_summary;
		    row.hdr_update.f_doc_discount_pct =	row.hdr.f_doc_discount_pct;
		    row.hdr_update.f_doc_discount =	row.hdr.f_doc_discount;
		    row.hdr_update.f_doc_subtotal =	row.hdr.f_doc_subtotal;
		    row.hdr_update.f_tax_chk =	row.hdr.f_tax_chk;
		    row.hdr_update.f_tax_pct =	row.hdr.f_tax_pct;
		    row.hdr_update.f_tax =	row.hdr.f_tax;
		    row.hdr_update.f_doc_total =	row.hdr.f_doc_total;	
		    row.hdr_update.c_note =	row.hdr.c_note;	
		    
		    
		    row.dtl_info = [];
	  	    for(var m in $scope.options.rows_dtl) {
		   	  var value = $scope.options.rows_dtl[m];
		 	  row.dtl_info.push(value);
		    } 	 	   
		    		    
	    }
	    
	    return row;
  }
  
  $scope.approve_action = function() {
  
	//$scope.row.hdr.e_action = 'confirm';	
	var	data = {};
	data.hdr = {};	
	
	//alert($scope.row.hdr.id);
	
	data.hdr.id = $scope.row.hdr.id; 	
	data.hdr.c_doc_no = $scope.row.hdr.c_doc_no;
	data.hdr.doc_type = "IR";	  
	data.hdr.e_action = "complete";
	
 
	$scope.row = $scope.options.get_hdr_info($scope.row);
	
	data.hdr_info = angular.copy( $scope.row.hdr_info );
	data.hdr_update = angular.copy( $scope.row.hdr_update );	
	data.dtl_info = angular.copy( $scope.row.dtl_info );	
 

	var url = 'document.update_action_doc';
	iAPI.post(url,angular.copy(data)).success(function(res) {
		
		//alert("dddd");
		//console.log(res);
		
		url = 'document.insert_stock_card_to';
		data = {};
		data.id = $scope.row.hdr.id;
		iAPI.post(url,data).success(function(res) {
			alert("รับเช้า stock เรียบร้อยแล้ว");
			
			//2015-11-09 เอา ใบ do auto ออก จะได้ไม่มีปัญหา
			//$scope.options.save_do(row_hdr,rows_dtl);	
					
		}); 
		
		
		$scope.theRefashFn();
	});	
 	
  }; 

  $scope.row_dtl_change = function(row,c_discount_type) {
 
   	 
   	console.log("row_dtl_change" + "  c_discount_type = " + c_discount_type,row); 
   	   	 
   	var f_unit_input = iAPI.tofix( angular.copy(row.f_quantity) ); 
		
   	var f_discount_pct = iAPI.tofix(row.f_discount_pct);
   	if( isNaN(f_discount_pct) ) f_discount_pct = 0 ;   	
   	if( f_discount_pct == '' )  f_discount_pct = 0 ;  	
   	
   	row.f_unit_price = (iAPI.tofix(f_unit_input)*iAPI.tofix(row.f_price));
   	 	
   	if( c_discount_type == "discount_pct" && f_discount_pct == 0 ){   
		row.f_discount = 0 ;
	}else if( f_discount_pct != 0){
		row.f_discount = row.f_unit_price * (f_discount_pct / 100); 
		row.f_discount = iAPI.round(row.f_discount); 
	}	
   	row.f_unit_total = row.f_unit_price-iAPI.tofix(row.f_discount) ;
   	 
   	$scope.row_hdr_change('');
  }   

  $scope.row_hdr_change = function(c_discount_type) {
  	 
  	 if( $scope.options.supplier_return ){
	 	$scope.row_hdr_supplier_return_change(c_discount_type);
	 	return ;
	 }
  	 	
  	 	
   	 
   	 console.log("row_hdr_change" + "  c_discount_type = " + c_discount_type,$scope.row.hdr);  
   	 
   	 
   	 var f_doc_summary = 0 ;
   	 for(var m in $scope.options.rows_dtl) {
   	 	var value = $scope.options.rows_dtl[m];
   	 	f_doc_summary+= iAPI.tofix(value.f_unit_total);
   	 }
   	 
   	  
   	 var f_doc_discount_pct = iAPI.tofix($scope.row.hdr.f_doc_discount_pct);
   	 if( isNaN(f_doc_discount_pct) ) f_doc_discount_pct = 0 ;
   	 if( f_doc_discount_pct == '' )  f_doc_discount_pct = 0 ;
   	 
   	 if( c_discount_type == "discount_pct" && f_doc_discount_pct == 0 ){   
		$scope.row.hdr.f_doc_discount = 0 ;
	 }else if( f_doc_discount_pct != 0){
		$scope.row.hdr.f_doc_discount = f_doc_summary * (f_doc_discount_pct / 100); 
		$scope.row.hdr.f_doc_discount = iAPI.round($scope.row.hdr.f_doc_discount); 
	 }  	 
   	 
   	 $scope.row.hdr.f_doc_summary = f_doc_summary;
   	 $scope.row.hdr.f_doc_subtotal = iAPI.tofix($scope.row.hdr.f_doc_summary) - iAPI.tofix($scope.row.hdr.f_doc_discount);
   	 
   	 var f_deposit = iAPI.tofix($scope.row.hdr.f_deposit);
   	 if( isNaN(f_deposit) ) f_deposit = 0.00 ;
   	 $scope.row.hdr.f_deposit = iAPI.tofix(f_deposit);
   	 
   	 $scope.row.hdr.f_doc_deduct_deposit = $scope.row.hdr.f_doc_subtotal - f_deposit;
   	 
   	 var f_doc_subtotal = iAPI.tofix($scope.row.hdr.f_doc_deduct_deposit);
 
   	 
   	 if( $scope.row.hdr.f_tax_chk == 'no_vat' ){
	 	
	 	$scope.row.hdr.f_tax_pct = "";
	 	$scope.row.hdr.f_tax = "";	 	
	 	$scope.row.hdr.f_doc_total = f_doc_subtotal ;
	 	
	 }else if( $scope.row.hdr.f_tax_chk == 'include' ){
	 	
	 	if( $scope.row.hdr.f_tax_pct == "" || $scope.row.hdr.f_tax_pct == "0" ) $scope.row.hdr.f_tax_pct = $scope.MODEL.vat["vat_pct"];
	 	var f_tax_pct = iAPI.tofix($scope.row.hdr.f_tax_pct);
   	 	if( isNaN(f_tax_pct) ) f_tax_pct = 0 ;
   	 	var f_tax = iAPI.round( f_doc_subtotal * f_tax_pct / (100 + f_tax_pct ) );
   	 	$scope.row.hdr.f_tax = f_tax;
   	 	
	 	$scope.row.hdr.f_doc_total = f_doc_subtotal ;
	 }else if( $scope.row.hdr.f_tax_chk == 'exclude' ){
	 	
	 	if( $scope.row.hdr.f_tax_pct == "" || $scope.row.hdr.f_tax_pct == "0" ) $scope.row.hdr.f_tax_pct = $scope.MODEL.vat["vat_pct"];
	 	var f_tax_pct = iAPI.tofix($scope.row.hdr.f_tax_pct);
   	 	if( isNaN(f_tax_pct) ) f_tax_pct = 0 ;
   	 	var f_tax = iAPI.round( f_doc_subtotal * f_tax_pct /100 );
	 	$scope.row.hdr.f_tax = f_tax;
	 	
   	 	$scope.row.hdr.f_doc_total = f_doc_subtotal + iAPI.tofix($scope.row.hdr.f_tax) ;	 	
	 }
	 $scope.row.hdr.f_doc_total_text = iAPI.MoneyToWord($scope.row.hdr.f_doc_total);
   	 
   	 

   	 //alert($scope.row.hdr.f_doc_total);
  }  
    
    

  
  
      
  $scope.create_supplier_return = function() {
  	//alert("sale_create");
	
	iAPI.config["pageTitle_edit"] = "สร้างรายการคืนผู้จำหน่าย";
	$scope.theChgPageFn('form');	
	
	$scope.options.disabled = false;
    $scope.options.ir = {
    	show:true,
    	disabled:false,
    } 
 	$scope.options.supplier_return = true;    
   	$scope.options.saveAPI = 'document.save_doc';   
    
	$scope.row.hdr.c_item_refer_doc_no = angular.copy($scope.row.hdr.c_doc_no);	

	$scope.row.hdr.i_refer_id = angular.copy($scope.row.hdr.id) ;
	$scope.row.hdr.c_refer_c_doc_no = angular.copy($scope.row.hdr.c_doc_no) ;

	delete $scope.row.hdr.id ;
	delete $scope.row.id ;	 
	
	
 
	$scope.row.hdr.doc_type = "RV";
	$scope.row.hdr.get_last_no = "GR"+$scope.getYearTH+$scope.getMonth;
	$scope.row.hdr.get_last_no_size = 4;  
    var parameter = { c_code: $scope.row.hdr.get_last_no , size: $scope.row.hdr.get_last_no_size , update : false };  
    iAPI.post('document.get_last_no',parameter).success(function(data) {
   	    console.log("document.get_last_no",data) ;
   		data = angular.fromJson(data);
   		$scope.row.hdr.c_doc_no = data.doc_no ; ;  
    });    
	
	$scope.row.hdr.c_refer_date = angular.copy($scope.row.hdr.d_date); 
	$scope.row.hdr.c_return_reason = "";	
		
	$scope.row.hdr.e_status = "active" ;
	$scope.row.hdr.e_action = "create" ;
		
	$scope.row.hdr.d_date = new Date();
    //$scope.row.hdr.d_date_send = new Date();
    $scope.row.hdr.d_date_return = new Date();
    
    
    delete $scope.row.hdr.d_create;
    delete $scope.row.hdr.d_confirm;
    delete $scope.row.hdr.d_complete; 
 
    delete $scope.row.hdr.c_type_show;
   	delete $scope.row.hdr.rowBtn;
   	delete $scope.row.hdr.e_status_action;
   	
   	delete $scope.row.hdr.f_deposit;
   	delete $scope.row.hdr.f_doc_deduct_deposit;
   	
   	delete $scope.row.hdr.c_location_send;
   	delete $scope.row.hdr.c_location_tel;
   	delete $scope.row.hdr.c_location_send_id;  	
   	delete $scope.row.hdr.c_po_sign_by;  
   	delete $scope.row.hdr.c_type; 
   	delete $scope.row.hdr.d_credit_day; 
   	delete $scope.row.hdr.c_refer_date;
   	delete $scope.row.hdr.c_credit_day;
   	delete $scope.row.hdr.c_pin;
   	delete $scope.row.hdr.f_doc_total_text;
	
	$scope.row.hdr.f_doc_summary_old = angular.copy( $scope.row.hdr.f_doc_subtotal );
	/*
	if( $scope.row.hdr.f_tax_chk == "include" ){
		$scope.row.hdr.f_doc_summary_old = angular.copy( $scope.row.hdr.f_doc_subtotal ) - angular.copy( $scope.row.hdr.f_tax ) ;
	}else{
		$scope.row.hdr.f_doc_summary_old = angular.copy( $scope.row.hdr.f_doc_subtotal );
	}
	*/
	
   	$scope.row.hdr.f_doc_summary = 0 ;
   	$scope.row.hdr.f_doc_discount = 0 ;
   	$scope.row.hdr.f_doc_subtotal = 0 ;  	
   	$scope.row.hdr.f_tax = 0 ;     	
   	$scope.row.hdr.f_doc_total = 0 ;     	
	
	$scope.row.hdr.f_doc_summary_new = 0 ;
	$scope.row.hdr.f_doc_summary_def = 0 ;

	var i_from = angular.copy( $scope.row.hdr.i_from );
	var c_from_name = angular.copy( $scope.row.hdr.c_from_name );	
	var e_from = angular.copy( $scope.row.hdr.e_from );
	var i_to = angular.copy( $scope.row.hdr.i_to );    
	var c_to_name = angular.copy( $scope.row.hdr.c_to_name );  
	var e_to = angular.copy( $scope.row.hdr.e_to );
	
	$scope.row.hdr.i_from = i_to;
	$scope.row.hdr.c_from_name = c_to_name;
	$scope.row.hdr.e_from = e_to;
	$scope.row.hdr.i_to = i_from;
	$scope.row.hdr.c_to_name = c_from_name;
	$scope.row.hdr.e_to = e_from;
	
	
	  
  
    $scope.options.cols_dtl_th = [
      {label:'รับคืน', width:50, },
      {label:'No.', width:50, }, 
      //{label:'hcode', width:60, },
      {label:'รหัส', width:80, },
      {label:'ชื่อ', },
      {label:'จำนวนที่รับคืน',width:100, align:'center', },
      {label:'หน่วย',width:80, align:'center', },
      {label:'ราคา', width:100, align:'center', },
      {label:'จำนวนเงิน', width:100, align:'right', },
    ]
    	
	$scope.options.cols_dtl = [
	  {label:'รับคืน', map: 'chk_add',type:'checkbox', width:40,
	  	changeFn :  function(row){ $scope.row_dtl_supplier_return_check(row); },  
	  },
      {label:'No.', map:'id', width:50, format:'index', }, 
      //{label:'hcode', map:'hcode', width:60, },
      {label:'รหัส', map:'item_c_code', width:80, },
      {label:'ชื่อ', map:'item_c_name', }, 
      {label:'จำนวนที่รับคืน', map:'f_quantity', type:'textbox', size:5, align:'right', valid_number:'valid-number', width:60,
      	changeFn :  function(row){ $scope.row_dtl_supplier_return_change(row); },   
      }, 
      //{label:'หน่วย', map: 'uofm_c_name', width:80, },
      {label:'หน่วย', map: 'uofm_c_name_show', width:80, },
      //{label:'หน่วย', map: 'uofm_id', type:'select', option:'uofm_option', width:80, },
      {label:'ราคา', map:'f_price' , type:'textbox', size:5, align:'right', width:100, valid_number:'valid-number', 
      	changeFn :  function(row){ $scope.row_dtl_supplier_return_change(row); }, 
      },
      {label:'จำนวนเงิน', map:'f_unit_total', width:100, align:'right', },  

    ]
        
    //$scope.create_cols_buttons();    
    
    $scope.row_hdr_supplier_return_change();
    
    $scope.options.allowOp = 'view,group1,month,add';   
    
    for(var i in $scope.options.rows_dtl){
    	delete $scope.options.rows_dtl[i].disabled ;
    	delete $scope.options.rows_dtl[i].option_disabled ; 
    	
    	$scope.options.rows_dtl[i].disabled = true ; 
    	$scope.options.rows_dtl[i].chk_add = "0" ; 
	} 
	 	
   
    console.log("$scope.options.beforeUpdRow row",$scope.row);
  } 
  
  $scope.row_dtl_supplier_return_check = function(row) {
  	if( row.chk_add == "0" ) row.disabled = true;
  	else row.disabled = false;
  	
  	$scope.row_dtl_supplier_return_change(row);
  	
  }  
  
  $scope.row_dtl_supplier_return_change = function(row) {
  	//alert("555");
  	if( iAPI.tofix(row.f_quantity) <= 0 ){
  		alert("กรุณาอย่าใส่0 หรือตำกว่า 0");
   	    row.f_quantity = 1 ;		
	}   	
	
   	row.f_unit_price = (iAPI.tofix(row.f_quantity)*iAPI.tofix(row.f_price));
   	row.f_unit_total = row.f_unit_price;
   	$scope.row_hdr_supplier_return_change();
  } 
     
  $scope.row_hdr_supplier_return_change = function(c_discount_type) {
   	 
   	 console.log("row_hdr_supplier_return_change" + "  c_discount_type = " + c_discount_type,$scope.row.hdr);  
   	    	 
   	 var f_doc_summary = 0 ;
   	 for(var m in $scope.options.rows_dtl) {
   	 	var value = $scope.options.rows_dtl[m];
   	 	if( value.chk_add == "1" ) 
   	 		f_doc_summary+= iAPI.tofix(value.f_unit_total);
   	 }
   	 
   	  
   	 var f_doc_discount_pct = iAPI.tofix($scope.row.hdr.f_doc_discount_pct);
   	 if( isNaN(f_doc_discount_pct) ) f_doc_discount_pct = 0 ;
   	 if( f_doc_discount_pct == '' )  f_doc_discount_pct = 0 
   	 
   	 if( c_discount_type == "discount_pct" && f_doc_discount_pct == 0 ){   
		$scope.row.hdr.f_doc_discount = 0 ;
	 }else if( f_doc_discount_pct != 0){
		$scope.row.hdr.f_doc_discount = f_doc_summary * (f_doc_discount_pct / 100); 
		$scope.row.hdr.f_doc_discount = iAPI.round($scope.row.hdr.f_doc_discount); 
	}  	 
   	 
   	 $scope.row.hdr.f_doc_summary = f_doc_summary;
   	 $scope.row.hdr.f_doc_subtotal = iAPI.tofix($scope.row.hdr.f_doc_summary) - iAPI.tofix($scope.row.hdr.f_doc_discount);
   	 

 	 var f_doc_subtotal =  iAPI.tofix($scope.row.hdr.f_doc_subtotal);   	
     var f_doc_summary_old =  iAPI.tofix($scope.row.hdr.f_doc_summary_old);  
     var f_doc_summary_new =  f_doc_summary_old - f_doc_subtotal;
     
      	 
   	 if( $scope.row.hdr.f_tax_chk == 'no_vat' ){
	 	
	 	$scope.row.hdr.f_tax_pct = "";
	 	$scope.row.hdr.f_tax = "";	 	
	 	$scope.row.hdr.f_doc_total = f_doc_subtotal ;
	 	
	 	$scope.row.hdr.f_doc_summary_new = f_doc_summary_new;    	
     	$scope.row.hdr.f_doc_summary_def =f_doc_summary_old - f_doc_summary_new; 
	 	
	 }else if( $scope.row.hdr.f_tax_chk == 'include' ){
	 	
	 	if( $scope.row.hdr.f_tax_pct == "" || $scope.row.hdr.f_tax_pct == "0" ) 
	 		$scope.row.hdr.f_tax_pct = $scope.MODEL.vat["vat_pct"];
	 	var f_tax_pct = iAPI.tofix($scope.row.hdr.f_tax_pct);
   	 	if( isNaN(f_tax_pct) ) f_tax_pct = 0 ;
   	 	var f_tax = iAPI.round( f_doc_subtotal * f_tax_pct / (100 + f_tax_pct ) );
   	 	$scope.row.hdr.f_tax = f_tax;
   	 	
	 	$scope.row.hdr.f_doc_total = f_doc_subtotal ;
	 	
	 	$scope.row.hdr.f_doc_summary_new = f_doc_summary_old - (f_doc_subtotal - f_tax) ;
	 	$scope.row.hdr.f_doc_summary_def = f_doc_subtotal - f_tax; 
	 	
	 }else if( $scope.row.hdr.f_tax_chk == 'exclude' ){
	 	
	 	if( $scope.row.hdr.f_tax_pct == "" || $scope.row.hdr.f_tax_pct == "0" ) 
	 		$scope.row.hdr.f_tax_pct = $scope.MODEL.vat["vat_pct"];
	 	var f_tax_pct = iAPI.tofix($scope.row.hdr.f_tax_pct);
   	 	if( isNaN(f_tax_pct) ) f_tax_pct = 0 ;
   	 	var f_tax = iAPI.round( f_doc_subtotal * f_tax_pct /100 );
	 	$scope.row.hdr.f_tax = f_tax;
	 	
   	 	$scope.row.hdr.f_doc_total = f_doc_subtotal + iAPI.tofix($scope.row.hdr.f_tax) ;	 
   	 	
   	 	$scope.row.hdr.f_doc_summary_new = f_doc_summary_new;    	
     	$scope.row.hdr.f_doc_summary_def =f_doc_summary_old - f_doc_summary_new; 	
	 }
	 $scope.row.hdr.f_doc_total_text = iAPI.MoneyToWord($scope.row.hdr.f_doc_total);
   	 

   	 
   	 //$scope.row.hdr.f_doc_summary_old = iAPI.tofix($scope.row.hdr.f_doc_summary_old);
   	 //$scope.row.hdr.f_doc_summary_new = iAPI.tofix($scope.row.hdr.f_doc_summary_new);
   	 
   	 //alert($scope.row.hdr.f_doc_total);
  }  
  
  
      
  $scope.print_action = function() { 
	
	if( $scope.row.hdr.c_type == "credit" ){
	  	$scope.opt = {	  		 	
	    	report_type: "ir", 	 
	    	id: $scope.row.hdr.id,   	    	
	    }; 
	    $scope.doc_print($scope.opt);		
		
	}else if( $scope.row.hdr.c_type == "cash" ){
	  	$scope.opt = {
	    	report_type: "ir_cash",	  
	    	id: $scope.row.hdr.id,  	
	    }; 
	    $scope.doc_print($scope.opt);		
	}
   
  }    
  
  $scope.setSaveFn = function(theSaveFn) { 
      $scope.theSaveFn = theSaveFn;
  }
  $scope.setRefashFn = function(theRefashFn) {
      $scope.theRefashFn = theRefashFn;
  };
  $scope.setChgPageFn = function(theChgPageFn) { 
      $scope.theChgPageFn = theChgPageFn;
  };
  
    

}])  

 ////////////////////////////////////////////////////////////////////////////////////////////// 
.controller('Vendor.select.Ctrl', function ($scope,$modalInstance,$modal,iAPI,options) {
  
   
  $scope.rows = null;
  $scope.options = {
    allowOp: 'noSearch,search1,search3',
    dataAPI: '' ,
    transcludeAtTop: true,
    getAPI: 'db/vendor' ,
    saveAPI: '',
    cols : [
      //{label: 'เลือก', map: 'chk_add',type:'checkbox', width:70},
      {label: 'รหัส', map: 'c_code' , width:120},
      {label: 'ชื่อ', map: 'c_name'},             
    ],
    editBtn : {
		noShow:true,
	},
    display:options.display,
    parentRow:options.parentRow,
    saveAllFn:function(rows){  
			$scope.saveAll(rows);
		 },
	//predicate:'c_item_vendor_name', 
	predicate:'c_item_name', 
	reverse:false,
	filter_search1:{
			map:"c_code",
			search:"",
		},
	filter_search3:{
			map:"c_name",
			search:"",
		},
  }
 
  $scope.options.display.search1 = "ค้นหารหัส";
  $scope.options.display.search3 = "ค้นหาชื่อ";

  $scope.options.beforeGet = function(){
  	$scope.spinner = {active : true};
  }
  $scope.options.afterGetMode = function(rows){
    $scope.spinner = {active : false};
  }
    
  $scope.options.selectRow = function(idx,row,rows) {    
 	for( var i in rows)
 		rows[i].chk_add = 0;
    row.chk_add = 1;
    
   	//if(row.chk_add==1) row.chk_add = 0;
  	//else row.chk_add = 1;
  }
  
  $scope.options.dbClick = function(idx,row) {  
  	//alert("dbClick");
  	var data = [row];
  	$modalInstance.close(data);   
  }
  
  
  $scope.close = function (items) {  	
    $modalInstance.close([]);
  };


   
  $scope.saveAll = function(items) {  
   
    if( !angular.isUndefined(items["rows"]) ) items = items["rows"];
    
    //console.log("saveRowAll",items);         
	var data = [];
	angular.forEach(items, function(value, key) {
	 	if(value.chk_add == "1")
	 	 	this.push(value);	 	
	}, data);
	 
  	//console.log("saveRowAll data",data);    
    $modalInstance.close(data);   
    
  }  ;
  
})
 
//////////////////////////////////////////////////////////////////////////////////////////////  
.controller('Return_supplierCtrl', ['$scope', 'iAPI', '$modal', '$filter', '$q', '$window', function ($scope,iAPI,$modal,$filter,$q,$window) {

  var ConfPageTitle = { pageTitle_org : 'รายการคืนผู้จำหน่าย',
  	pageTitle_add_edit : '',
  	pageCaption_org : '',
  	pageTitle_edit : 'รายละเอียด',
    pageTitle_table : '',
  };
  iAPI.setConfPageTitle(ConfPageTitle);

  $scope.content_height=$window.innerHeight - $scope.innerHeight ;
  
  $scope.options = {
    allowOp: 'view,edit,group1',
    dataAPI: '',
    getAPI: 'document.get_doc_web/'+'/RV'+'/active/create',
    saveAPI: 'document.save_doc',
    updateAPI: 'document.edit_doc',
    cols : [
      {label: 'No.', map: 'id', width:60, format:'index', },
      {label: 'วันที่', map: 'd_create' },
      {label: 'วันที่ส่งคืน', map: 'd_date_send' },
      {label: 'เลขที่เอกสาร', map: 'c_doc_no' },
      {label: 'จาก', map: 'c_from_name' },  
      {label: 'คืนให้', map: 'c_to_name' }, 
    ], 
    itemPerPage:$scope.itemPerPage,
    predicate:'d_create', 
    reverse:true,
    filter_group : [
    	{map: 'e_status_action' },
    ],
    group : [
    	{ e_status_action : "active_create" , c_desc : "ยังไม่อนุมัติ" },
    	{ e_status_action : "active_complete" , c_desc : "อนุมัติแล้ว" },
    	{ e_status_action : "delete" , c_desc : "ยกเลิก" },
    ],  
    addFnForm:function(row){  
			$scope.addItems(row);
		 },
	editBtn : {
		noShow:true,
	},
	viewBtn : {
		show:false,
	},
	rowBtn : {
		show:true,
	},
	display : {
		groupLable : "สถานะ",
		groupOrderby : " ",
	},
  }
  $scope.options.row_group = $scope.options.group[0];
  
  $scope.options.chgMode = function() {
  	$scope.options.allowOp = 'view,add,edit,group1';
  }  
  
 
    
  //add options
  $scope.options.doc_type = "RV";
  $scope.options.vendor = 0 ;
  $scope.options.rows_dtl =[];
  $scope.options.rows_dtl_col ={id:'',item_id:'',item_c_code:'',item_c_name:'',uofm_id:'',uofm_c_name:''
  	,hcode:''
  };    
 
  $scope.options.cols_dtl1 = [
      {label:'No.', map:'id', width:60, format:'index', },
      //{label:'hcode', map:'hcode', width:80, },
      {label:'รหัส', map:'item_c_code', width:80, },
      {label:'ชื่อ', map:'item_c_name', },
      {label:'คงเหลือ', map:'f_quantity_org', width:80, align:'right', },
      {label:'จำนวนส่งคืน', map:'f_quantity', type:'textbox', size:8, align:'right', valid_number:'valid-number',
      	changeFn :  function(row){ $scope.row_dtl_change(row); },   
      	width:100,
      }, 
      //{label:'หน่วย', map: 'uofm_c_name', width:100, },
      {label:'หน่วย', map:'uofm_id', type:'select', option:'uofm_option', width:120, align:'center', 
      	changeFn :  function(row){ $scope.uofm_row_dtl_selete(row); },
      },
      {label:'หน่วยละ', map:'f_price', type:'textbox', size:8, align:'right', valid_number:'valid-number',
      	changeFn :  function(row){ $scope.row_dtl_change(row); },   
      	width:100,
      },
      //{label:'uofm_f_factor', map:'uofm_f_factor', width:50, },
      //{label:'uofm_id', map:'uofm_id', width:50, },
      
      {label:'จำนวนเงิน', map:'f_unit_total', width:100, align:'right', },
  ];
  $scope.options.cols_dtl2 = [
      {label:'No.', map:'id', width:60, format:'index', },
      //{label:'hcode', map:'hcode', width:80, },
      {label:'รหัส', map:'item_c_code', width:80, },
      {label:'ชื่อ', map:'item_c_name', }, 
      {label:'จำนวนส่งคืน', map:'f_quantity', width:120, align:'right', },    
      {label:'หน่วย', map: 'uofm_c_name_show', width:120, align:'right', },
      {label:'หน่วยละ', map: 'f_price', width:100, align:'right', },
      {label:'จำนวนเงิน', map: 'f_unit_total', width:100, align:'right',},
    ];
  $scope.options.cols_buttons1 = [
       {label:'', btn:'btn-danger', icon : 'ion ion-close', type:'button', width:20,
       	fn:function(idx,row){ 
			 $scope.row_del(idx,row);
		   },
	  },  
  ];
    
 
  $scope.addItems = function(row) { 
    $scope.options.disabled = false; 
    
   $scope.options.cols_dtl = angular.copy($scope.options.cols_dtl1);
   $scope.options.cols_buttons = angular.copy($scope.options.cols_buttons1); 
     
       
   $scope.row={};
   $scope.row.hdr={};
   $scope.row.hdr.f_doc_summary = 0 ;
   $scope.row.hdr.f_doc_discount = 0 ;
   $scope.row.hdr.f_doc_subtotal = 0 ;
   $scope.row.hdr.f_tax_pct = "";
   $scope.row.hdr.f_tax = 0 ;
   $scope.row.hdr.f_doc_total = 0 ;
   $scope.row.hdr.f_tax_chk = 'no_vat';
   $scope.row.hdr.c_note="";
   
   $scope.row.hdr.f_doc_summary_old = 0 ;
   $scope.row.hdr.f_doc_summary_new = 0 ;
   $scope.row.hdr.f_doc_summary_def = 0 ;
   
   $scope.options.vendor = $scope.MODEL.vendor[0];
   $scope.change_vendor();					
   
   
   $scope.row.hdr.c_item_refer_doc_no = "";
   $scope.row.hdr.c_verdor_tax_doc_no = ""; 
   
   
   $scope.row.hdr.i_from = $scope.Employee.location_id;
   $scope.row.hdr.c_from_name = $scope.Employee.c_location_code;
   
   //var c_setting = angular.fromJson($scope.MODEL.location[0].c_setting);     
   //$scope.row.hdr.c_headder_name = c_setting.c_desc ;
   //$scope.row.hdr.c_headder_address = c_setting.c_address ;
   //$scope.row.hdr.c_headder_tel = c_setting.c_tel ;
   //$scope.row.hdr.c_headder_tax_number = c_setting.c_tax_number ;
   
   
   $scope.row.hdr.d_date = new Date();
   $scope.row.hdr.d_date_send = new Date(); 
   $scope.row.hdr.d_date_return = new Date();
 	
   $scope.row.hdr.doc_type = $scope.options.doc_type;
   //$scope.row.hdr.get_last_no = $scope.row.hdr.doc_type +"-"+$scope.Employee.c_location_code+"-"+$scope.getYear+$scope.getMonth;
   $scope.row.hdr.get_last_no = "GR"+$scope.getYearTH+$scope.getMonth;
   $scope.row.hdr.get_last_no_size = 4;  	  
   	     
   $scope.options.rows_dtl =[];       
  
   
   var parameter = { c_code: $scope.row.hdr.get_last_no , size: $scope.row.hdr.get_last_no_size , update : false };  
   iAPI.post('document.get_last_no',parameter).success(function(data) {
   	    console.log("document.get_last_no",data) ;
   		data = angular.fromJson(data);
   		$scope.row.hdr.c_doc_no = data.doc_no ; ;  
   })
   
   console.log("$scope.row",$scope.row);

  }     

  $scope.options.afterGet = function(rows){
  	
  	angular.forEach(rows, function(v,k) {
  		if(v.e_status_action=='active_create'){
	        v.rowBtn = {
	          icon:'fa-pencil',  
	        };	 
		}else if(v.e_status_action=='active_complete'){
	        v.rowBtn = {
	  	 			icon:'fa-search',  
	        };		 
		}else if(v.e_status_action=='delete'){
	        v.rowBtn = {
	  	 			icon:'fa-search',  
	        };	 	
  		} 
    })
    //alert("afterGet");
  	//console.log("afterGet",rows);
  }
    
  $scope.options.beforeUpdRow = function(row) { 
  
  if(row.e_status_action=='active_complete' || row.e_status_action=='delete'){
  		$scope.options.allowOp = 'view'; 
  		$scope.options.disabled = true;
  		
  		$scope.options.cols_dtl = angular.copy($scope.options.cols_dtl2);
  		$scope.options.cols_buttons = [];
  	}else{
  		
  		$scope.options.disabled = false;
		$scope.options.cols_dtl = angular.copy($scope.options.cols_dtl1);
    	$scope.options.cols_buttons = angular.copy($scope.options.cols_buttons1); 
	}
  	
    
  	var row_tmp = angular.copy(row);
  	var row_dtl = angular.copy(row_tmp.dtls);
  	
  	for(var i in row_dtl){
		var c_dtl_info = angular.fromJson(row_dtl[i].c_dtl_info);
		delete row_dtl[i].c_dtl_info;
		angular.forEach(c_dtl_info, function(value, key) {
			this[key] = value ;	 	
		}, row_dtl[i]);

		if(row.e_status_action=='active_complete' 
  			|| row.e_status_action=='delete'
  			){
			
			row_dtl[i].uofm_c_name_show = row_dtl[i].uofm_c_name;
			if( parseFloat(row_dtl[i].uofm_f_factor) !='1'){
				if( !angular.isUndefined(row_dtl[i].uofm_c_name_org) )
					row_dtl[i].uofm_c_name_show += "("+parseFloat(row_dtl[i].uofm_f_factor)+row_dtl[i].uofm_c_name_org+")";
				else if( !angular.isUndefined(row_dtl[i].c_receive_uofm_name) )
					row_dtl[i].uofm_c_name_show += "("+parseFloat(row_dtl[i].uofm_f_factor)+row_dtl[i].c_receive_uofm_name+")";
				else 
					row_dtl[i].uofm_c_name_show += "("+parseFloat(row_dtl[i].uofm_f_factor)+")";
			}
		
		
		}else{
			var uofm_id = row_dtl[i].uofm_id;
			$scope.create_uofm(uofm_id);
			row_dtl[i].uofm_option = angular.copy($scope.confUofm.receive_uofm);  			
		}
		
			
	} 
  	
  	delete row_tmp.dtls;
  	$scope.row = {};
  	$scope.row.hdr = row_tmp;  	
  	
  	var c_hdr_info = angular.fromJson($scope.row.hdr.c_hdr_info);
  	delete $scope.row.hdr.c_hdr_info;
  	
  	angular.forEach(c_hdr_info, function(value, key) {
		this[key] = value ;	 	
	}, $scope.row.hdr);
  	
  	$scope.options.rows_dtl = row_dtl;
  	
  	for(var key in $scope.MODEL.vendor){
		if( $scope.MODEL.vendor[key].id == $scope.row.hdr.i_to){
			$scope.options.vendor = $scope.MODEL.vendor[key];
			if( angular.isUndefined($scope.row.hdr.c_vendor_name) )
				$scope.row.hdr.c_vendor_name = $scope.options.vendor.c_name;
			break;
		}		
	}
    
   
   if( !angular.isUndefined($scope.row.hdr.id) ){ 
  		$scope.row.id = $scope.row.hdr.id;
  		  		
  		if( $scope.row.hdr.e_status == "active" )
  			$scope.row.hdr.e_status = 'edit';
  	}
  	//else{
	//	$scope.row.hdr.e_status = 'active';
	//}
  	
  	console.log("beforeUpdRow hdr ",$scope.row);
  	console.log("beforeUpdRow dtl",$scope.options.rows_dtl);
  	
  }
 
  $scope.options.beforePost = function(row) {  	
   	
   	delete row.hdr.e_status_action;
   	
   	
   	if( !angular.isUndefined($scope.row.hdr.f_doc_summary_old))   	
   	  	$scope.row.hdr.f_doc_summary_old = iAPI.tofix($scope.row.hdr.f_doc_summary_old);
   	if( !angular.isUndefined($scope.row.hdr.f_doc_summary_new))   	
   		$scope.row.hdr.f_doc_summary_new = iAPI.tofix($scope.row.hdr.f_doc_summary_new);
   	 	
   	 	
   	row.dtl = $scope.options.rows_dtl;
   	    	
  	return true 
  }
    	 
  $scope.row_dtl_change = function(row) {
   	
   	var f_quantity = iAPI.tofix(row.f_quantity);
   	var f_quantity_org = iAPI.tofix(row.f_quantity_org);
    if( f_quantity > f_quantity_org ){
		alert("อย่าใส่จำนวนเงิน " + f_quantity_org );
		row.f_quantity =  angular.copy( row.f_quantity_org );
	} 
       	
   	row.f_unit_price = (iAPI.tofix(row.f_quantity)*iAPI.tofix(row.f_price));
   	row.f_unit_total = row.f_unit_price ;
   	$scope.row_hdr_change();
	
  }  
  
  $scope.row_hdr_change = function(c_discount_type) {
  	
  	
   	console.log("row_hdr_change" + "  c_discount_type = " + c_discount_type,$scope.row.hdr);  
   	
   	
   	var f_doc_summary = 0 ;
   	 for(var m in $scope.options.rows_dtl) {
   	 	var value = $scope.options.rows_dtl[m];
   	 	f_doc_summary+= iAPI.tofix(value.f_unit_total);
   	 }
   	 
   	  
   	 var f_doc_discount_pct = iAPI.tofix($scope.row.hdr.f_doc_discount_pct);
   	 if( isNaN(f_doc_discount_pct) ) f_doc_discount_pct = 0 ;
   	 if( f_doc_discount_pct == '' )  f_doc_discount_pct = 0 ;
   	 
   	 if( c_discount_type == "discount_pct" && f_doc_discount_pct == 0 ){   
		$scope.row.hdr.f_doc_discount = 0 ;
	 }else if( f_doc_discount_pct != 0){
		$scope.row.hdr.f_doc_discount = f_doc_summary * (f_doc_discount_pct / 100); 
		$scope.row.hdr.f_doc_discount = iAPI.round($scope.row.hdr.f_doc_discount); 
	}  	 
   	 
   	 $scope.row.hdr.f_doc_summary = f_doc_summary;
   	 $scope.row.hdr.f_doc_subtotal = iAPI.tofix($scope.row.hdr.f_doc_summary) - iAPI.tofix($scope.row.hdr.f_doc_discount);
   	 
  	 var f_doc_subtotal =  iAPI.tofix($scope.row.hdr.f_doc_subtotal);   	
     var f_doc_summary_old =  iAPI.tofix($scope.row.hdr.f_doc_summary_old);  
     var f_doc_summary_new =  f_doc_summary_old - f_doc_subtotal;
        	 
   	 
   	 if( $scope.row.hdr.f_tax_chk == 'no_vat' ){
	 	
	 	$scope.row.hdr.f_tax_pct = "";
	 	$scope.row.hdr.f_tax = "";	 	
	 	$scope.row.hdr.f_doc_total = f_doc_subtotal ;
	 	
	 	$scope.row.hdr.f_doc_summary_new = f_doc_summary_new;    	
     	$scope.row.hdr.f_doc_summary_def =f_doc_summary_old - f_doc_summary_new; 
	 	
	 }else if( $scope.row.hdr.f_tax_chk == 'include' ){
	 	
	 	if( $scope.row.hdr.f_tax_pct == "" || $scope.row.hdr.f_tax_pct == "0" ) 
	 		$scope.row.hdr.f_tax_pct = $scope.MODEL.vat["vat_pct"];
	 	var f_tax_pct = iAPI.tofix($scope.row.hdr.f_tax_pct);
   	 	if( isNaN(f_tax_pct) ) f_tax_pct = 0 ;
   	 	var f_tax = iAPI.round( f_doc_subtotal * f_tax_pct / (100 + f_tax_pct ) );
   	 	$scope.row.hdr.f_tax = f_tax;
   	 	
	 	$scope.row.hdr.f_doc_total = f_doc_subtotal ;
	 	
	 	$scope.row.hdr.f_doc_summary_new = f_doc_summary_old - (f_doc_subtotal - f_tax) ;
	 	$scope.row.hdr.f_doc_summary_def = f_doc_subtotal - f_tax; 
	 	
	 }else if( $scope.row.hdr.f_tax_chk == 'exclude' ){
	 	
	 	if( $scope.row.hdr.f_tax_pct == "" || $scope.row.hdr.f_tax_pct == "0" ) 
	 		$scope.row.hdr.f_tax_pct = $scope.MODEL.vat["vat_pct"];
	 	var f_tax_pct = iAPI.tofix($scope.row.hdr.f_tax_pct);
   	 	if( isNaN(f_tax_pct) ) f_tax_pct = 0 ;
   	 	var f_tax = iAPI.round( f_doc_subtotal * f_tax_pct /100 );
	 	$scope.row.hdr.f_tax = f_tax;
	 	
   	 	$scope.row.hdr.f_doc_total = f_doc_subtotal + iAPI.tofix($scope.row.hdr.f_tax) ;
   	 	
   	 	$scope.row.hdr.f_doc_summary_new = f_doc_summary_new;    	
     	$scope.row.hdr.f_doc_summary_def =f_doc_summary_old - f_doc_summary_new; 
     		 	
	 }
	 $scope.row.hdr.f_doc_total_text = iAPI.MoneyToWord($scope.row.hdr.f_doc_total);
   	 
   	 
  }  

   $scope.uofm_row_dtl_selete = function(row) {  	
  	for(var i in row.uofm_option ){
		if( row.uofm_option[i].id == row.uofm_id ){
			row.uofm_c_name = row.uofm_option[i].c_desc ;
			row.uofm_f_factor = row.uofm_option[i].f_factor;
			break;
		}
	}
  	//console.log(row);	
  }
     
  $scope.change_vendor = function() {
  	//console.log($scope.options.vendor); 
  	var c_setting = angular.fromJson($scope.options.vendor.c_setting);
  	$scope.row.hdr.vendor_id = $scope.options.vendor.id;
  	$scope.row.hdr.c_vendor_name = $scope.options.vendor.c_name;
  	$scope.row.hdr.c_vendor_address = c_setting.c_address ;
  	$scope.row.hdr.c_vendor_tel = c_setting.c_tel ;
  	$scope.row.hdr.c_vendor_contact = c_setting.c_contact ;
  	  	
  	$scope.row.hdr.i_to = $scope.row.hdr.vendor_id;
  	$scope.row.hdr.c_to_name = $scope.options.vendor.c_name;
  	$scope.row.hdr.e_to = 'vendor';
  	
  }
    

  $scope.row_del = function(idx,row) { 
  	
  	//ใช้ row ไปหา indexOf ห้ามใช้ idx เด็ดขาด
	var indexOfRow = $scope.options.rows_dtl.indexOf(row);	
	//alert("idx="+idx +" indexOfRow="+indexOfRow);	
	if(indexOfRow < 0 )indexOfRow = idx;
  	$scope.options.rows_dtl.splice(indexOfRow, 1);
  	//$scope.options.rows_dtl.splice(idx, 1);
 
  	$scope.row_hdr_change();
  }
            
  $scope.delete_msg = function() {
	//$scope.row.hdr.e_status = 'delete';	
	$scope.row.c_name = $scope.row.hdr.c_doc_no ;
	$scope.options.display = {};
	$scope.options.display.message1 = "ต้องการลบใบคืนสินค้าเลขที่ : " + $scope.row.hdr.c_doc_no;
	$scope.options.display.confirmTitle = "ยืนยันลบใบคืนสินค้า";
	
  };       
 
  $scope.delete_action = function() {
	$scope.row.hdr.e_status = 'delete';	
	
	url = 'document.edit_doc';
	iAPI.post(url,$scope.row).success(function(res) {
		$scope.theRefashFn();
	});	
		
  }; 
        
  $scope.print_action = function() {
  	$scope.opt = {
    	report_type: "ri",    
    	id: $scope.row.hdr.id, 	
    }; 
    $scope.doc_print($scope.opt);
  };   
  
  $scope.approve_action = function() {
	
	var	data = {};
	data.hdr = {};	
	
	data.hdr.id = $scope.row.hdr.id; 	
	data.hdr.c_doc_no = $scope.row.hdr.c_doc_no;
	data.hdr.doc_type = $scope.options.doc_type;	  
	data.hdr.e_action = "complete";

	url = 'document.update_action_doc';
	iAPI.post(url,data).success(function(res) {
		
		//alert($scope.row.hdr.id);
		
		//ตัด stock
		//2016-06-29
    	//แก้ไขให้ว่า ถ้า e_status != 'active' ไม่ให้ทำงาน
    	
    	console.log("update_action_doc",res);
		if( res.e_status == "active" ){
	
			//ตัด stock
		 	url = 'document.insert_stock_card';
			data = {};
			data.id = $scope.row.hdr.id;
			iAPI.post(url,data).success(function(res) {
			 	//alert("ตัด stock คืน Supplier เรียบร้อยแล้ว");
			});	
			
		}else{
			alert("ไม่สามารถ Approve และ ตัด stock ได้ เนื่องจาก เอกสาร " + res.c_doc_no + " ถูกแก้ไข กรุณาตรวจสอบและดำเนินการใหม่");
		}
		
		$scope.theRefashFn();
		
		/*    	
		url = 'document.insert_stock_card';
		data = {};
		data.id = $scope.row.hdr.id;
		iAPI.post(url,data).success(function(res) {
			//alert("ตัด stock คืน Supplier เรียบร้อยแล้ว");
		}); 
		
		$scope.theRefashFn();
		*/
		
	});			
 	 		    	 
  }; 
  
     
  $scope.setRefashFn = function(theRefashFn) {
      $scope.theRefashFn = theRefashFn;
  };    
  $scope.setSaveFn = function(theSaveFn) { 
      $scope.theSaveFn = theSaveFn;
  };       
  $scope.setDelFn = function(theDelFn) { 
      $scope.theDelFn = theDelFn;
  };
 
  $scope.add_items = function() {
    if( angular.isUndefined($scope.row.hdr.vendor_id) ){
  		alert("Supplier do must input")
  		return ;	
  	}
  	$scope.opt = { vendor_id: $scope.row.hdr.vendor_id, 
    	id: $scope.row.hdr.vendor_id, 
    	parentRow:{},
    	row_group : $scope.MODEL['all_item_group'],
    	display:{
			modal_title:'สินค้าตามผู้จัดจำหน่าย : ' + $scope.row.hdr.c_to_name,
		},
    };  	
 
    var modalInstance = $modal.open({
     templateUrl: 'views/operation/return_supplier.item.insert.html',
      controller: 'Return_supplier.item.insert.Ctrl',
      size: 'lg',
      resolve: {
        options: function () {
          return $scope.opt;
        }
      }
    });
    modalInstance.result.then(function (items) { 
        
     	//console.log('items',items);
 		if( !angular.isUndefined(items["id"]) ){
			if( items["id"] == -1 ) return ;
		}
	
  		//console.log('$scope.options.rows_dtl',$scope.options.rows_dtl);
  		for(var m in items) {
 			var value = items[m];						
	 			
 			var dtl = angular.copy( $scope.options.rows_dtl_col );
 			for(var i in dtl) {
		 		for(var j in value) {
		 			if( i==j){
						dtl[i]=value[j];
						break;
					}		 				
		 		}
			}

			dtl.uofm_f_factor = 1;
			
			dtl.c_receive_uofm_name = value.receive_uofm_c_name;
			dtl.c_receive_uofm_f_factor = dtl.uofm_f_factor;	
			
			dtl.c_po_uofm_name = value.unit_name;
			dtl.c_po_f_factor = dtl.uofm_f_factor;	
			
			dtl.uofm_option = [];
	 
			if( !angular.isUndefined(value.c_item_info) ){
				var c_item_info = angular.fromJson(value.c_item_info);				
				 
				if(!angular.isUndefined(c_item_info.c_uofm_f_factor))
					dtl.uofm_f_factor	= angular.copy(c_item_info.c_uofm_f_factor); 
				
				if(!angular.isUndefined(c_item_info.c_receive_uofm_f_factor))
					dtl.c_receive_uofm_f_factor	= angular.copy(c_item_info.c_receive_uofm_f_factor); 
					
				if(!angular.isUndefined(c_item_info.c_po_uofm_name))
					dtl.c_po_uofm_name	= angular.copy(c_item_info.c_po_uofm_name); 
					
				if(!angular.isUndefined(c_item_info.c_po_f_factor))
					dtl.c_po_f_factor	= angular.copy(c_item_info.c_po_f_factor); 	
			}							

			$scope.create_uofm(dtl.uofm_id);
  			dtl.uofm_option = angular.copy($scope.confUofm.receive_uofm);
  									
  			//alert(dtl.uofm_id);
			for(var i in dtl.uofm_option){				
				if( dtl.uofm_id == dtl.uofm_option[i].id ){					 
					//dtl.uofm_id = dtl.uofm_option[i].id ;
					dtl.uofm_c_name = dtl.uofm_option[i].c_desc;
					dtl.uofm_f_factor = dtl.uofm_option[i].f_factor;
					break;	
				}
				
			}
			
	
			
			dtl.f_quantity = 0 ;
			dtl.f_quantity_org = value.f_quantity ;
			dtl.f_price = value.f_min_order_amt ;			
			dtl.f_unit_price = dtl.f_quantity*dtl.f_price ;
			dtl.f_unit_total = dtl.f_unit_price ;			
			
			dtl.id = $scope.options.rows_dtl.length + 1  ;
			//console.log('dtl',dtl);
	 		$scope.options.rows_dtl.push(dtl);
 		}
 		$scope.row_hdr_change();
 		//console.log('$scope.options.rows_dtl',$scope.options.rows_dtl);	
 		
 		 	 
	   	
    });
  }  
    

  $scope.openModal_vendor = function () {
 	
  	$scope.opt = {  
    	id: 0, 
    	parentRow:{}, 
    	display:{
			modal_title:'เลือกผู้จัดจำหน่าย'
		}, 
    }; 
    
    var modalInstance = $modal.open({
      templateUrl: 'views/operation/vendor.select.html',
      controller: 'Vendor.select.Ctrl',
      size: 'lg',
      scope:$scope,
      resolve: {
        options: function () {
          return $scope.opt;
        }
      }
    });
    modalInstance.result.then(function (item) {
       //alert(item);
	   if(item==""){ 
	   }else{
	   		//console.log(item);
		    $scope.options.vendor = item[0];
		    $scope.change_vendor();
	   } 
    
    });
    
  } 
  	

}]) 

.controller('Return_supplier.item.insert.Ctrl', function ($scope,$modalInstance,$modal,iAPI,options) {
  $scope.rows = null;
  $scope.options = {
    allowOp: 'group1',
    dataAPI: '' ,
    transcludeAtTop: true,
    getAPI: 'product.vendor_item/'+options.vendor_id ,
    saveAPI: '',
    cols : [
      {label:'เลือก', map:'chk_add', type:'checkbox', width:40,},
      //{label:'hcode', map:'hcode', width:60, },
      {label:'รหัส', map:'item_code', width:80,},
      {label:'ชื่อ', map:'c_item_name',},
      //{label:'ชื่อ', map:'c_item_vendor_name',},
      //{label:'ราคาส่งสาขา', map:'f_price', width:120, align:'right', }, 
      {label:'ราคา/หน่วยรับ', map:'f_min_order_amt', width:120, align:'right', },      
      {label:'คงเหลือ', map:'f_quantity', width:80, align:'right', },
      {label:'หน่วย', map:'unit_name', width:80,},
      {label:'หน่วย PO MM', map:'c_po_uofm_name', width:110,},
            
    ],
    editBtn : {
		noShow:true,
	},
    display:options.display,
    parentRow:options.parentRow,
    saveAllFn:function(rows){  
			$scope.saveAll(rows);
		 },
	predicate:'item_name', 
	reverse:false,
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
    
  $scope.close = function (items) {  	
    $modalInstance.close([]);
  };

  $scope.options.afterGet = function(rows){
  	//cheage to json
  	angular.forEach(rows, function(v,k) {
  	 
        v.c_info = angular.fromJson(v.c_info);         
        v.c_item_vendor_name = v.c_info.c_item_vendor_name;
        console.log(v.c_info);
        
        v.c_item_info = angular.fromJson(v.c_item_info); 
        if( !angular.isUndefined(v.c_item_info.c_po_f_factor) )
	        if( parseFloat(v.c_item_info.c_po_f_factor) != 1 )
	        	v.c_po_uofm_name += "("+parseFloat(v.c_item_info.c_po_f_factor)+v.unit_name+")";
	        	
        //alert("555");
    })
      
  	//console.log("afterGet",rows);
  }
   
  $scope.saveAll = function(items) {  
   
    if( !angular.isUndefined(items["rows"]) ) items = items["rows"];
    
    //console.log("saveRowAll",items);
         
	var data = [];
	angular.forEach(items, function(value, key) {
	 	if(value.chk_add == "1")
	 	 	this.push(value);	 	
	}, data);
	 
  	//console.log("saveRowAll data",data);
    
    $modalInstance.close(data);   
    
  }  
  
  
})


  
////////////////////////////////////////////////////////////////////////////////////////////// 
.controller('Search.item.Ctrl', function ($scope,$modalInstance,$modal,iAPI,options) {
  
   
  $scope.rows = null;
  $scope.options = {
    allowOp: 'noSearch,search1,search2',
    dataAPI: '' ,
    transcludeAtTop: true,
    getAPI: 'product' ,
    getAPIdata : { e_ishidden:'' },
    saveAPI: '',
    cols : [
      //{label: 'เลือก', map: 'chk_add',type:'checkbox', width:70},
      {label: 'ลำดับ', map: 'c_seq' , width:60},
      {label: 'รหัส', map: 'c_code' , width:120},
      {label: 'ชื่อ', map: 'c_name'},             
    ],
    editBtn : {
		noShow:true,
	},
    display:options.display,
    parentRow:options.parentRow,
    saveAllFn:function(rows){  
			$scope.saveAll(rows);
		 }, 
	//predicate:'c_item_name', 
	predicate:'c_seq', 
	reverse:false,
	filter_search1:{
			map:"c_code",
			search:"",
		},
	filter_search2:{
			map:"c_name",
			search:"",
		},
  }
 
  $scope.options.display.search1 = "ค้นหารหัสสินค้า";
  $scope.options.display.search2 = "ค้นหาชื่อสินค้า";

  
  
  $scope.options.beforeGet = function(){
  	$scope.spinner = {active : true};
  }
  $scope.options.afterGetMode = function(rows){
  	
  	angular.forEach(rows, function(v,k) {
  		 v.c_seq = parseFloat(v.c_seq);        
    })
    
    $scope.spinner = {active : false};
  }
    
  $scope.options.selectRow = function(idx,row,rows) {    
 	for( var i in rows)
 		rows[i].chk_add = 0;
    row.chk_add = 1;
    
   	//if(row.chk_add==1) row.chk_add = 0;
  	//else row.chk_add = 1;
  }
  
  $scope.options.dbClick = function(idx,row) {  
  	//alert("dbClick");
  	var data = [row];
  	$modalInstance.close(data);   
  }
  
  
  $scope.close = function (items) {  	
    $modalInstance.close([]);
  };


   
  $scope.saveAll = function(items) {  
   
    if( !angular.isUndefined(items["rows"]) ) items = items["rows"];
    
    //console.log("saveRowAll",items);         
	var data = [];
	angular.forEach(items, function(value, key) {
	 	if(value.chk_add == "1")
	 	 	this.push(value);	 	
	}, data);
	 
  	//console.log("saveRowAll data",data);    
    $modalInstance.close(data);   
    
  }  ;
  
})

  
////////////////////////////////////////////////////////////////////////////////////////////// 
.controller('Stock_remainCtrl', ['$scope', 'iAPI', '$modal', '$filter', '$q', '$window', function ($scope,iAPI,$modal,$filter,$q,$window) {

  var ConfPageTitle = { pageTitle_org : 'สต๊อกคงเหลือ',
  	pageTitle_add_edit : '',
  	pageCaption_org : '',
  	pageTitle_edit : 'รายละเอียด',
    pageTitle_table : '',
  };
  iAPI.setConfPageTitle(ConfPageTitle);

  $scope.content_height=$window.innerHeight - $scope.innerHeight ;
  
   
  $scope.options = {
    allowOp: 'group1',
    dataAPI: '',
    getAPI: 'stock.stock_counting//1//201////0',
    //getAPI: 'stock.stock_counting//'+$scope.Employee.location_id+'//201',
    cols : [
      {label:'No.', map:'c_seq', width:60, }, 
      //{label:'hcode', map:'hcode', width:80, },
      {label:'รหัส', map:'item_c_code', width:80, },
      {label:'ชื่อ', map:'item_c_name', },
      {label:'ราคาทุน', map:'f_fifo_p_unit', align:'right', width:80, }, 
      {label:'ราคาขาย', map:'f_price', align:'right', width:80, },  
      //{label:'รอส่ง', map:'f_quantity_do', align:'right', width:80, },    
      {label:'คงเหลือ', map:'f_quantity', align:'right', width:80, },  
      {label:'หน่วย', map: 'uofm_c_name', width:100,  },
    ], 
    itemPerPage:$scope.itemPerPage,
	editBtn : {
		noShow:true,
	},
	viewBtn : {
		show:false,
	},
	predicate:'c_seq',
    reverse:false,
    filter_group : [
    	{map: 'item_group_id' },
    ],
  }
  
  iAPI.get('product.get_code/item_group').success(function(data) {
  	
  	//////////////////////////
    var row_group = [];
    var row0 = {};
	row0["id"]=row0["item_group_id"]=0;
	row0["c_code"]="";row0["c_desc"]="ทุกประเภท";
	row_group.push(row0);
	angular.forEach(data['item_group'], function(value, key) {
		row0 = value;
		this.push(row0);	 	
	}, row_group);

	$scope.options.group  = row_group;
	console.log("group item_group",$scope.options.group);
	$scope.options.row_group = $scope.options.group[0];
	
  });
   
  $scope.options.afterGet = function(rows){     
  	angular.forEach(rows, function(v,k) {
  		 v.c_seq = parseFloat(v.c_seq);
    })    
  }       
  
  $scope.setRefashFn = function(theRefashFn) {
      $scope.theRefashFn = theRefashFn;
  };    

 

}])

.controller('Stock_countingCtrl', ['$scope', 'iAPI', '$modal', '$filter', '$q', '$window', function ($scope,iAPI,$modal,$filter,$q,$window) {

  var ConfPageTitle = { pageTitle_org : 'ตรวจนับ',
  	pageTitle_add_edit : '',
  	pageCaption_org : '',
  	pageTitle_edit : 'รายละเอียด',
    pageTitle_table : '',
  };
  iAPI.setConfPageTitle(ConfPageTitle);

  $scope.content_height=$window.innerHeight - $scope.innerHeight ;
  
   
  $scope.options = {
    allowOp: 'view,add',
    dataAPI: '',
    getAPI: 'document.get_doc_web/'+'/IC'+'/active/create',
    saveAPI: 'document.save_doc',
    updateAPI: 'document.edit_doc',
    cols : [
      {label: 'No.', map: 'id', width:60, format:'index', },
      {label: 'วันที่', map: 'd_create'  }, 
      {label: 'เลขที่เอกสาร', map: 'c_doc_no'   },
      //{label: 'From', map: 'c_from_name'  },  
    ], 
    itemPerPage:$scope.itemPerPage,
    addFnForm:function(row){  
			$scope.addItems(row);
		 },
	editBtn : {
		noShow:true,
	},
	viewBtn : {
		show:true,
	},
	predicate:'d_create', 
    reverse:true,
 
  }
  
  //add options
  $scope.options.doc_type = "IC"; 
  $scope.options.rows_dtl =[];
  $scope.options.rows_dtl_col ={id:'',item_id:'',item_c_code:'',item_c_name:'',uofm_id:'',uofm_c_name:''
  	,hcode:''
  };

  $scope.options.chgMode = function() {
  	$scope.options.cols_dtl_footer = [];
  }
  
  
  $scope.addItems = function(row) { 
    $scope.spinner = {active : true};
    
    $scope.options.cols_dtl = [
      //{label:'No.', map:'id', width:60, format:'index', }, 
      //{label:'Chk.', map:'chk_add', width:60 }, 
      {label:'No.', map:'c_seq', width:60, },
      //{label:'hcode', map:'hcode', width:80, },
      {label:'รหัส', map:'item_c_code', width:80, },
      {label:'ชื่อ', map:'item_c_name', },
      {label:'ราคาทุน', map:'f_fifo_p_unit',width:80, align:'right',  }, 
      //{label:'ราคาทุน', map:'f_p_unit',width:80, align:'right',  },      
      {label:'ราคาขาย', map:'f_price',width:80, align:'right',  },      
      {label:'คงเหลือ', map:'f_quantity',width:80, align:'right',   },
      {label:'ตรวจนับ', map:'f_counting', type:'textbox', size:8,width:80, align:'right',   valid_number:'valid-number',
      	changeFn :  function(row){ $scope.row_dtl_change(row); },   
      },
      {label:'ส่วนต่าง', map: 'f_adj', width:80, align:'right'}, 
      {label:'หน่วย', map: 'uofm_c_name', width:100, },
      {label:'มูลค่าเสียหาย', map: 'f_unit_total', width:100, align:'right', },
      {label:'รวมราคาทุน', map: 'f_price_total', width:100, align:'right', },
    ];
    
    $scope.options.cols_dtl_footer = [
    	{ colspan:9, label:'รวม' }, 
    	{ hdr:'f_doc_total', align:'right' }, 
    	{ hdr:'f_fifo_total', align:'right' }, 
    ];
     
   $scope.row={};
   $scope.row.hdr={};     
   
   $scope.row.hdr.d_date = $scope.dNow;     
 	
   $scope.row.hdr.doc_type = $scope.options.doc_type;
   $scope.row.hdr.get_last_no = "IC" +"-"+$scope.Employee.c_location_code+"-"+$scope.getYear+$scope.getMonth;
   $scope.row.hdr.get_last_no_size = 4;  	  
   	     
   $scope.options.rows_dtl =[];   
   
   $scope.row.hdr.i_from = $scope.Employee.location_id;
   $scope.row.hdr.c_from_name = $scope.Employee.c_location_code;
   
   $scope.row.hdr.i_to = $scope.Employee.location_id;
   $scope.row.hdr.c_to_name = $scope.Employee.c_location_code;      
   
   var parameter = { c_code: $scope.row.hdr.get_last_no , size: $scope.row.hdr.get_last_no_size , update : false };  
   iAPI.post('document.get_last_no',parameter).success(function(data) {
   	  console.log("document.get_last_no",data) ;
   	  data = angular.fromJson(data);
   	  $scope.row.hdr.c_doc_no = data.doc_no ; ;  
   });
   
   parameter = {}; 
   //iAPI.post('stock.stock_counting//'+$scope.Employee.location_id+'//201',parameter).success(function(data) {
   //iAPI.post('stock.stock_adjust_lot_frist//'+$scope.Employee.location_id+'//201',parameter).success(function(data) {
   iAPI.post('stock.stock_adjust_fifo//'+$scope.Employee.location_id+'//201',parameter).success(function(data) {	
   	  //alert("stock_counting");
   	  console.log("stock_counting",data) ;
   	  data = angular.fromJson(data);
   	  angular.forEach(data, function(v,k) {
  		 v.c_seq = parseFloat(v.c_seq);
      })    
   	  $scope.options.rows_dtl = data;
      $scope.spinner = {active : false};
      
      $scope.row_hdr_change();
      
   },function(){
      $scope.spinner = {active : false};
   });  
   //alert("addItems");
   console.log("$scope.row",$scope.row);

  }   

  $scope.options.afterGet = function(rows){   
  	
  }
    
  $scope.options.beforeUpdRow = function(row) { 

    $scope.spinner = {active : true};
    
    $scope.options.show_add_but = false;
    
    $scope.options.cols_dtl = [
      {label:'No.', map:'id', width:60, format:'index', }, 
      //{label:'hcode', map:'hcode', width:80, },
      {label:'รหัส', map:'item_c_code', width:80, },
      {label:'ชื่อ', map:'item_c_name', },
      {label:'ราคาทุน', map:'f_fifo_p_unit', align:'right', width:80, }, 
      //{label:'ราคาทุน', map:'f_p_unit', align:'right', width:80, }, 
      {label:'ราคาขาย', map:'f_price', align:'right', width:80, },  
      {label:'ก่อนตรวจ', map:'f_quantity_org', align:'right', width:80, }, 
      {label:'ตรวจนับ', map:'f_counting', align:'right', width:80, },
      {label:'ส่วนต่าง', map:'f_adj', align:'right', width:80, },
      {label:'หน่วย', map: 'uofm_c_name', width:80, }, 
      {label:'มูลค่าเสียหาย', map: 'f_unit_total', align:'right', width:100, }, 
      {label:'รวมราคาทุน', map: 'f_price_total', align:'right', width:100, },
    ];
    
    $scope.options.cols_dtl_footer = [
    	{ colspan:9, label:'รวม' }, 
    	{ hdr:'f_doc_total', align:'right'  }, 
    	{ hdr:'f_fifo_total', align:'right' }, 
    ];
    
    
    
  	var row_tmp = angular.copy(row);
  	var row_dtl = angular.copy(row_tmp.dtls);
  	
  	for(var i in row_dtl){
  		//console.log("id="+row_dtl[i].id,row_dtl[i].c_dtl_info)
		var c_dtl_info = angular.fromJson(row_dtl[i].c_dtl_info);
		delete row_dtl[i].c_dtl_info;
		angular.forEach(c_dtl_info, function(value, key) {
			this[key] = value ;	 	
		}, row_dtl[i]);
	} 
  	
  	delete row_tmp.dtls;
  	$scope.row = {};
  	$scope.row.hdr = row_tmp;  	
  	$scope.row.id = $scope.row.hdr.id;
  	
  	var c_hdr_info = angular.fromJson($scope.row.hdr.c_hdr_info);
  	delete $scope.row.hdr.c_hdr_info;
  	
  	angular.forEach(c_hdr_info, function(value, key) {
		this[key] = value ;	 	
	}, $scope.row.hdr);
  	
  	$scope.options.rows_dtl = [];
  	$scope.options.rows_dtl2 = row_dtl;    	
  
   iAPI.post('document.get_doc/'+$scope.row.id,{}).success(function(data) {
   	  //alert("stock_counting");
   	  $scope.options.rows_dtl = $scope.options.rows_dtl2;   
      $scope.spinner = {active : false};
   
   },function(){
      $scope.spinner = {active : false};
   });  
   
  	
  	console.log("beforeUpdRow hdr ",$scope.row);
  	console.log("beforeUpdRow dtl",$scope.options.rows_dtl);
  	
  }
 
  $scope.options.beforePost = function(row) {  	
   	  

   	var f_price_total = 0 ;  
   	var f_doc_summary = 0 ;
   	var row_dtl_ia = [];
   	var row_dtl_ic = [];
   	  
   	angular.forEach($scope.options.rows_dtl, function(value, key) {
		var f_quantity = iAPI.tofix(value.f_quantity);
   		if( isNaN(f_quantity) ) f_quantity = 0 ;   
   		
   		var f_counting = iAPI.tofix(value.f_counting);
   		if( isNaN(f_counting) ) f_counting = 0 ;  
   		
   		var f_fifo_p_unit = iAPI.tofix(value.f_fifo_p_unit); 
		if( isNaN(f_fifo_p_unit) ) f_fifo_p_unit = 0 ; 	
		
		//var f_p_unit = iAPI.tofix(value.f_p_unit); 
		//if( isNaN(f_p_unit) ) f_p_unit = 0 ; 
		
		//value.f_counting = f_counting;
		value.f_fifo_p_unit = f_fifo_p_unit;
		
		delete value.unit_name;
		delete value.receive_unit_name;
		delete value.receive_uofm_c_name;		
   		delete value.location_uofm_id; 	
   		
	    
		if( f_quantity != f_counting ) {
			
			//if( f_quantity > f_counting) value.f_adj = f_quantity - f_counting  ;
			//else if( f_quantity < f_counting) value.f_adj = f_counting - f_quantity ;
 			
 			value.f_adj = f_counting - f_quantity ;
 			
 			value.f_quantity = f_counting;
 			value.f_quantity_org = f_quantity;
 			value.f_total = f_counting;
 			
 			var f_price = iAPI.tofix(value.f_price);
   			if( isNaN(f_price) ) f_price = 0 ; 
   		    
   		    var f_unit_price = f_price * value.f_adj;
   		    value.f_unit_price = f_unit_price ;
   		    value.f_unit_total = f_unit_price ;
 			
 			f_doc_summary += f_unit_price; 			
 			
 			value.f_price_total = iAPI.tofix(f_counting * f_fifo_p_unit );
 			//value.f_price_total = iAPI.tofix(f_counting * f_p_unit );
 			f_price_total += value.f_price_total;
 			
			this.push(value);		
		}else{
			//console.log( value.item_id +" "+f_quantity + " " + f_fifo_p_unit);
			value.f_price_total = iAPI.tofix( f_quantity * f_fifo_p_unit );
			//value.f_price_total = iAPI.tofix( f_quantity * f_p_unit );
			f_price_total += value.f_price_total;
			
		}
				
		delete value.c_dtl_info;
		delete value.c_info;
   		delete value.c_item_info;		
			
			
		row_dtl_ic.push(value);

	}, row_dtl_ia);
	   	  
	//alert("555");
   	//row.dtl = row_dtl_ia ; 
   	row.dtl = row_dtl_ic ; 
   	
   	row.hdr.f_doc_summary = f_doc_summary;
   	row.hdr.f_doc_subtotal = f_doc_summary;
   	row.hdr.f_doc_total = f_doc_summary;   	
   	row.hdr.f_price_total = f_price_total
   	   	
   	delete row.hdr.id;

   	
    $scope.options.rows_hdr_temp = angular.copy($scope.row.hdr);
    $scope.options.rows_dtl_temp = angular.copy(row_dtl_ia);
   	
   	
   	    	
  	return true 
  }
  $scope.options.afterPost = function(row){
  	
  	//console.log("afterPost",row);
  	var url = '';
  	var data = {};
    	
	var tmp_row = {}; 
	tmp_row.hdr = angular.copy($scope.options.rows_hdr_temp);
	tmp_row.dtl = angular.copy($scope.options.rows_dtl_temp); 
 	
	data = {};
	data.hdr = tmp_row.hdr;	
	data.hdr.doc_type = "IA";
	//data.hdr.get_last_no = "IA" +"-"+$scope.Employee.c_location_code+"-"+$scope.getYear+$scope.getMonth;
	data.hdr.get_last_no = "JU"+$scope.getYear+$scope.getMonth;
	data.hdr.get_last_no_size = 4;
	data.pos_id    = "system";
	data.c_note    = "REF:"+row.c_doc_no;
		
	data.hdr.i_refer_id = row.id;
   	data.hdr.c_refer_c_doc_no = row.c_doc_no;
   	data.hdr.i_refer_group_id = row.id;
   	data.hdr.c_refer_group_c_doc_no = row.c_doc_no; 	
	  
	data.hdr.e_action = 'create'; 
 	data.dtl = [];
 	 
  	var row_dtl = tmp_row.dtl;
  	
  	for(var i in row_dtl){
		var c_dtl_info = angular.fromJson(row_dtl[i].c_dtl_info);
		delete row_dtl[i].c_dtl_info;
		delete row_dtl[i].c_info;
		
		angular.forEach(c_dtl_info, function(value, key) {
			this[key] = value ;	 	
		}, row_dtl[i]);	
		
		delete row_dtl[i].unit_name;
		delete row_dtl[i].receive_unit_name;
		delete row_dtl[i].receive_uofm_c_name;
		delete row_dtl[i].chk_add;
		delete row_dtl[i].c_seq;
	    delete row_dtl[i].location_uofm_id;
	    delete row_dtl[i].f_price_total;
	 	
	 	row_dtl[i].c_add_option_note = "";
	 	
	 	var f_adj = iAPI.tofix(row_dtl[i].f_adj);
   		if( isNaN(f_adj) ) f_adj = 0 ;
   		
   		var f_quantity_org = iAPI.tofix(row_dtl[i].f_quantity_org);
	    var f_fifo_p_unit = iAPI.tofix(row_dtl[i].f_fifo_p_unit);
	    var f_price = iAPI.tofix(row_dtl[i].f_price);
	    	    
   		row_dtl[i].f_adj = f_adj;			
		row_dtl[i].f_quantity_org =  f_quantity_org;
		row_dtl[i].f_quantity = angular.copy(f_adj);
		row_dtl[i].f_fifo_p_unit = f_fifo_p_unit;
			
		row_dtl[i].f_price_org = angular.copy(f_price);
		row_dtl[i].f_price_p_unit = angular.copy(f_price);		
		
		
		if( f_adj > 0){
			row_dtl[i].f_price = angular.copy(f_fifo_p_unit);
			
			//row_dtl[i].f_unit_price = row_dtl[i].f_quantity * row_dtl[i].f_price;
			//row_dtl[i].f_unit_total = row_dtl[i].f_unit_price;
			
			row_dtl[i].f_unit_price = 0;
			row_dtl[i].f_unit_total = 0;			
			
		}
		
	} 
	
	data.dtl = row_dtl;

	console.log("IA",data);
	
	url = 'document.save_doc';
	iAPI.post(url,data).success(function(res) {
		
		//update stock
		url = 'document.insert_stock_card';
		data = {};
		data.id = res.id;
		iAPI.post(url,data).success(function(res) {
			//alert("ตัด stock ตรวจนับ เรียบร้อยแล้ว");
		}); 
	
	//$scope.theRefashFn();
	});
		

     
  }


  
  	 
   
  $scope.row_dtl_change = function(row) {
   	//alert("คำนวนไม่ให้เกิน");
   	var f_quantity = iAPI.tofix(row.f_quantity);
   	if( isNaN(f_quantity) ) f_quantity = 0 ;   
   		
   	var f_counting = iAPI.tofix(row.f_counting);
   	if( isNaN(f_counting) ) f_counting = 0 ; 
   	
	var f_price = iAPI.tofix(row.f_price); 
	if( isNaN(f_price) ) f_price = 0 ;   	
   		
   	var f_fifo_p_unit = iAPI.tofix(row.f_fifo_p_unit); 
	if( isNaN(f_fifo_p_unit) ) f_fifo_p_unit = 0 ; 	
   		
   	if( f_quantity != f_counting ){
		row.chk_add = 1;
				
		var f_adj = f_counting - f_quantity ;
		var f_total = f_counting;	    
	    if( isNaN(f_total) ) f_total = 0 ;
	    row.f_total = f_total;
	    row.f_adj = f_adj;
	    
	    //2015-12-21  แก้ให้ คู๖ราคาทุน
	    var f_unit_price = f_adj * f_price;
	    //var f_unit_price = f_adj * f_fifo_p_unit;
	    if( isNaN(f_unit_price) ) f_unit_price = 0 ; 
	    var f_unit_total = f_unit_price;   
	    
	    if( f_unit_price < 0 ){
	   		row.f_unit_price = f_unit_price;
	    	row.f_unit_total = f_unit_total;		
		}else{
			row.f_unit_price = 0 ;
	    	row.f_unit_total = 0 ;
		}		
		
		row.f_price_total = iAPI.tofix(f_counting * f_fifo_p_unit );
		
	}else{
		row.chk_add = 0 ;
		
		row.f_adj = f_quantity ;
		
		row.f_total = 0 ;
		row.f_unit_price = 0 ;
    	row.f_unit_total = 0 ;
    	
    	row.f_price_total = iAPI.tofix( f_quantity * f_fifo_p_unit );
    	
	}
	 $scope.row_hdr_change();
	
  }  
  
  $scope.row_hdr_change = function() {
   	 var f_doc_summary = 0 ;
   	 var f_fifo_total = 0 ;
   	 
   	 for(var m in $scope.options.rows_dtl) {
   	 	var value = $scope.options.rows_dtl[m];
   	 	f_doc_summary+= iAPI.tofix(value.f_unit_total);
   	 	f_fifo_total+= iAPI.tofix(value.f_price_total);
   	 }
   	 //alert(f_doc_summary);
   	 $scope.row.hdr.f_doc_summary = f_doc_summary;
   	 $scope.row.hdr.f_doc_subtotal = f_doc_summary;
   	 $scope.row.hdr.f_doc_total = f_doc_summary;   
   	 $scope.row.hdr.f_fifo_total = f_fifo_total;	    	    	 
  }   
    
      
  $scope.ic_print = function() {
	$scope.opt = {
    	report_type: "IC", 
    	id: $scope.row.hdr.id,     	
    }; 
    $scope.doc_print($scope.opt);    
  };   
       
  $scope.setRefashFn = function(theRefashFn) {
      $scope.theRefashFn = theRefashFn;
  };    

  $scope.print_action1 = function() {
  	$scope.opt = {
    	report_type: "rp_counting_stock", 
    	id: $scope.row.hdr.id,     	
    }; 
    $scope.doc_print($scope.opt);    
  }  
  $scope.print_action2 = function() {
  	$scope.opt = {
    	report_type: "rp_dif_stock", 
    	id: $scope.row.hdr.id,     	
    }; 
    $scope.doc_print($scope.opt);    
  } 

}]) 

.controller('Stock_counting_mainCtrl', ['$scope', 'iAPI', '$modal', '$filter', '$q', '$window', '$location', function ($scope,iAPI,$modal,$filter,$q,$window,$location) {


  
  $scope.content_height=$window.innerHeight - $scope.innerHeight ;
    
  
  $scope.options = {
    allowOp: 'view,add,edit',
    dataAPI: '',
    getAPI: 'document.get_doc_web/'+'/SC'+'/active/create',
    saveAPI: 'document.save_doc',
    updateAPI: 'document.edit_doc',
    cols : [
      {label: 'No.', map: 'id', width:60, format:'index', },
      {label: 'วันที่', map: 'd_create'  }, 
      {label: 'เลขที่เอกสาร', map: 'c_doc_no'   },
      //{label: 'From', map: 'c_from_name'  },  
    ], 
    itemPerPage:$scope.itemPerPage,
    addFnForm:function(row){  
			$scope.addItems(row);
		 },

	predicate:'d_create', 
    reverse:true,
    display:{},
    
  }
  
  $scope.options.chgMode = function() { 
  	$scope.options.allowOp = 'view,add,edit' ;
  	if( $scope.location_url == "stock_counting_main_new" ){
  		
  	}else if( $scope.location_url == "stock_counting_main_confirm" ){
  		$scope.options.allowOp = 'view,edit';
  	}else if( $scope.location_url == "stock_counting_main_print_sc_confirm" ){
  		//$scope.options.allowOp = "view,edit,group1";  		
  		$scope.options.allowOp = "view";
  	}else if( $scope.location_url == "stock_counting_main_print_sc_dif" ){
  		$scope.options.allowOp = " ";
  	}else if( $scope.location_url == "stock_counting_main_complete" ){
  		$scope.options.allowOp = "view"; 
  		
  		if( $scope.options.permission_confirm == "confirm_TC" ){ 
			$scope.options.allowOp = "view,edit"; 
		}		
		if( $scope.options.permission_confirm == "confirm_TA" ){
			$scope.options.allowOp = "view"; 
		}		
  	}
  	 
  	$scope.options.cols_dtl_footer = []; 
  }
  
  
  
  $scope.set_title = function() {
    
     $scope.options.buttons = [];
     
      $scope.options.create = false;
     	
  	 $scope.location_url = $location.url().replace("/", ""); 
  	 //alert(location_url);
  	 var ConfPageTitle = {};
  	 if( $scope.location_url == "stock_counting_main_new" ){
	 	ConfPageTitle = { pageTitle_org : 'สร้างข้อมูลตรวจนับ',
		  	pageTitle_add_edit : ' ',
		  	pageCaption_org : '',
		  	pageTitle_edit : '',
		  	pageTitle_table : '',
		  }; 
		  
	    $scope.options.getAPI = 'document.get_doc_web/'+'/SC'+'/active/create';
	    $scope.options.saveAPI = 'document.save_doc';
    	$scope.options.updateAPI = 'document.edit_doc';
    
        $scope.options.create = true;
		   
	 }else if( $scope.location_url == "stock_counting_main_confirm" ){
	 	ConfPageTitle = { pageTitle_org : 'บันทึกปริมาณที่ตรวจนับได้',
		  	pageTitle_add_edit : ' ',
		  	pageCaption_org : '',
		  	pageTitle_edit : '',
		  	pageTitle_table : '',
		  }; 
		  
		$scope.options.viewBtn = {
				show:false,
			};
		$scope.options.editBtn = {
				noShow:false,
				label:'ตรวจนับ',
				icon:' ',
			};
			
		$scope.options.allowOp = 'view,edit';
		
		$scope.options.getAPI = 'document.get_doc_web/'+'/SC'+'/active/confirm';
	    $scope.options.updateAPI = 'document.update_action_doc';
	    
	    
	 }else if( $scope.location_url == "stock_counting_main_print_sc_confirm" ){
	  	ConfPageTitle = { pageTitle_org : 'พิมพ์รายงานหลังตรวจนับ',
		  	pageTitle_add_edit : ' ',
		  	pageCaption_org : '',
		  	pageTitle_edit : '',
		  	pageTitle_table : '',
		  }; 
		$scope.options.allowOp = "view";	 		  
	  	$scope.options.getAPI = 'document.get_doc_web/'+'/SC'+'/active/complete';
	  	
	  	
	  	/*
	  	$scope.options.getAPI = 'document.get_doc_web/'+'/SC'+'/active/confirm';
	    $scope.options.allowOp = "view,edit,group1";
	  	$scope.options.filter_group = [
    		{map: 'e_status_action_show' },
    	];
    	$scope.options.group = [
    		{ e_status_action_show : "active_confirm" , c_desc : "ยังไม่อนุมัติ" },
    		{ e_status_action_show : "active_complete" , c_desc : "อนุมัติแล้ว" }, 
   		];  
   		$scope.options.display = {
			groupLable : "สถานะ",
			groupOrderby : " ",
		};
	  
    
    	$scope.options.row_group = $scope.options.group[0];
    	*/
    	 
	  	
	 }else if( $scope.location_url == "stock_counting_main_print_sc_dif" ){
	  	ConfPageTitle = { pageTitle_org : 'พิมพ์รายงานผลต่างจากการตรวจนับ',
		  	pageTitle_add_edit : ' ',
		  	pageCaption_org : '',
		  	pageTitle_edit : '',
		  	pageTitle_table : '',
		  }; 
		$scope.options.allowOp = " ";			  
		$scope.options.getAPI = 'document.get_doc_web/'+'/SC'+'/active/complete';  
	  	//$scope.options.getAPI = 'document.get_doc_web/'+'/TA'+'/active/create';
	  	
 		$scope.options.editBtn = {
				noShow:true,
		};
		
		$scope.options.buttons = [
	      {label:' Print', btn:'btn-info', icon : 'fa-print', type:'button', width:70,
	      	fn:function(idx,row){
	      	  console.log("$scope.options.buttons",row);
	          $scope.row.hdr = row;
	          $scope.print_action_sc_dif();
	        },
	      }, 
    	];
	  	
	 }else if( $scope.location_url == "stock_counting_main_complete" ){
	  	ConfPageTitle = { pageTitle_org : 'ปรับปรุงยอดสินค้าตามที่ตรวจนับ',
		  	pageTitle_add_edit : ' ',
		  	pageCaption_org : '',
		  	pageTitle_edit : '',
		  	pageTitle_table : '',
		  }; 
		$scope.options.viewBtn = {
				show:false,
			};	
		$scope.options.editBtn = {
				noShow:false,
				icon:'fa-search',
			}; 	
		
		$scope.options.updateAPI = 'document.update_action_doc';	

	    $scope.options.allowOp = "view"; 
		 	
		//$scope.options.getAPI = 'document.get_doc_web/'+'/SC'+'/active/confirm';
		
		$scope.options.getAPI = 'document.get_doc_web/'+'/TC'+'/active/create';
			
		
		$scope.options.permission_confirm = "";	
			
		iAPI.get('user.get_user').success(function(res){
			//alert(res.c_setting);
	    	var c_setting = angular.fromJson(res.c_setting);
			console.log("confirm",c_setting.confirm);
			if( angular.isUndefined(c_setting.confirm) ) c_setting.confirm = [];	    
			
			for( var i in c_setting.confirm ){
				if( c_setting.confirm[i] == "confirm_TC" ){
					
					$scope.options.permission_confirm = c_setting.confirm[i] ;
					$scope.options.allowOp = "view,edit"; 
					
					$scope.options.getAPI = 'document.get_doc_web/'+'/TC'+'/active/create';
					$scope.options.editBtn = {
						noShow:false,
						label:'Confirm',
						icon:' ',
					};  				
					break;
				}else if( c_setting.confirm[i] == "confirm_TA" ){
					
					$scope.options.permission_confirm = c_setting.confirm[i] ;
					$scope.options.allowOp = "view,edit"; 
					
					$scope.options.getAPI = 'document.get_doc_web/'+'/TA'+'/active/create';
					/*
					$scope.options.editBtn = {
							noShow:false,
							label:'Approve',
							icon:' ',
						}; 
						*/				
					break;
				} 
			} 
			
			$scope.theRefashFn(); 				
	    
		 })		
					  
		  
	 }
	 iAPI.setConfPageTitle(ConfPageTitle);
  }
  $scope.set_title(); 
  

    
  $scope.options.searchItem = {};
 
  $scope.options.cols_dtl_create = [
      {label:'No.', map:'c_seq', width:60, format:'index', },
      {label:'รหัส', map:'item_c_code', width:80, },
      {label:'ชื่อ', map:'item_c_name', },
      {label:'หน่วย', map: 'uofm_c_name', width:100, },
      
      /*
      {label:'ราคาขาย', map:'f_price_p_unit', width:80, align:'right',  },
      {label:'ราคาทุน', map:'f_fifo_p_unit', width:80, align:'right',  },
      {label:'ราคาต้นทุนมาตรฐาน', map:'f_price_207', width:80, align:'right',  },
      {label:'ราคาfifo', map:'f_price_fifo', width:80, align:'right',  },
      */
      
    ];
    
  $scope.options.cols_buttons_create = [
      {label:'', btn:'btn-danger', icon : 'ion ion-close', type:'button', width:20,
       	fn:function(idx,row){ 
			 $scope.row_del(idx,row);
		   },
	  },  
    ];

  $scope.options.cols_dtl_confirm = [
      {label:'No.', map:'c_seq', width:60, format:'index', },
      {label:'รหัส', map:'item_c_code', width:80, },
      {label:'ชื่อ', map:'item_c_name', },
      
      {label:'คงเหลือ', map:'f_quantity_org', },
      
      {label:'หน่วยใหญ่', map:'f_quantity_po' , type:'textbox', size:5, align:'right', width:80, valid_number:'valid-number',
changeFn :  function(row){ $scope.row_dtl_change1(row); }, 
},
	  {label:' ', map: 'c_po_uofm_name', width:100, },
      
      {label:'หน่วยย่อย', map:'f_quantity_location' , type:'textbox', size:5, align:'right', width:80, valid_number:'valid-number',
changeFn :  function(row){ $scope.row_dtl_change2(row); }, 
},
	  {label:' ', map: 'c_location_uofm_name', width:100, },
	  
	  /*
	  {label:'ราคาขายf_price', map:'f_price', width:80, align:'right',  },
	  {label:'ราคาขาย', map:'f_price_p_unit', width:80, align:'right',  },
      {label:'ราคาทุน', map:'f_fifo_p_unit', width:80, align:'right',  },
      {label:'ราคาต้นทุนมาตรฐาน', map:'f_price_207', width:80, align:'right',  },
      {label:'ราคาfifo', map:'f_price_fifo', width:80, align:'right',  },
      */
      
      
  ]; 
  
    $scope.options.cols_dtl_complete_th1 = [     
      {label:'No.', map:'c_seq', width:60, format:'index', },
      {label:'รหัส', map:'item_c_code', width:80, },
      {label:'ชื่อ', map:'item_c_name', },      
      {label:'คงเหลือ', map:'f_quantity_org', width:100, },      
      {label:'หน่วยใหญ่', map:'f_quantity_po' , colspan:2, align:'center' }, 
      {label:'หน่วยย่อย', map:'f_quantity_location' , colspan:2, align:'center' }, 
      
      /*
      {label:'ราคาขายf_price', map:'f_price', width:80, align:'right',  },
      {label:'ราคาขาย', map:'f_price_p_unit', width:80, align:'right',  },
      {label:'ราคาทุน', map:'f_fifo_p_unit', width:80, align:'right',  },
      {label:'ราคาต้นทุนมาตรฐาน', map:'f_price_207', width:80, align:'right',  },
      {label:'ราคาfifo', map:'f_price_fifo', width:80, align:'right',  },
      */
    ]
    
    
  $scope.options.cols_dtl_complete = [
      {label:'No.', map:'c_seq', width:60, format:'index', },
      {label:'รหัส', map:'item_c_code', width:80, },
      {label:'ชื่อ', map:'item_c_name', },      
      {label:'คงเหลือ', map:'f_quantity_org', width:100, },      
      {label:'หน่วยใหญ่', map:'f_quantity_po' , width:100, },
	  {label:' ', map: 'c_po_uofm_name', width:100, },      
      {label:'หน่วยย่อย', map:'f_quantity_location' , width:100, },
	  {label:' ', map: 'c_location_uofm_name', width:100, },
	  
	  /*
	  {label:'ราคาขายf_price', map:'f_price', width:80, align:'right',  },
	  {label:'ราคาขาย', map:'f_price_p_unit', width:80, align:'right',  },
      {label:'ราคาทุน', map:'f_fifo_p_unit', width:80, align:'right',  },
      {label:'ราคาต้นทุนมาตรฐาน', map:'f_price_207', width:80, align:'right',  },
      {label:'ราคาfifo', map:'f_price_fifo', width:80, align:'right',  },
      */
      
  ]; 
  
        
  $scope.options.cols_dtl_tc = [
      {label:'No.', map:'c_seq', width:60, format:'index', },
      {label:'รหัส', map:'item_c_code', width:80, },
      {label:'ชื่อ', map:'item_c_name', },
      
      {label:'คงเหลือ', map:'f_quantity_org', width:120,},
      {label:' ', map: 'uofm_c_name', width:100, },
   
      {label:'ยอดที่นับได้', map:'f_quantity' , type:'textbox', size:7, align:'right', width:120, valid_number:'valid-number',readonly:true,
      	changeFn :  function(row){  }, 
	  },
	  {label:' ', map: 'uofm_c_name', width:100, },
	  
	  /*
	  {label:'ราคาขายf_price', map:'f_price', width:80, align:'right',  },
	  {label:'ราคาขาย', map:'f_price_p_unit', width:80, align:'right',  },
      {label:'ราคาทุน', map:'f_fifo_p_unit', width:80, align:'right',  },
      {label:'ราคาต้นทุนมาตรฐาน', map:'f_price_207', width:80, align:'right',  },
      {label:'ราคาfifo', map:'f_price_fifo', width:80, align:'right',  },
      */
      
  ]; 

  $scope.options.cols_dtl_ta = [
      //{label:'เลือก', map:'chk_add', type:'checkbox', width:40,},
      
      {label: 'เลือกทั้งหมด', map:'chk_add', type:'checkbox', width:120, 
      	checkAll:true, value:'0',
     	checkAllFn:function(value,rows){
     		$scope.checkAll(value,rows);
        },
      
      },      
      //{label:'chk_add', map:'chk_add', width:60,  },      
      {label:'No.', map:'c_seq', width:60, format:'index', },
      {label:'รหัส', map:'item_c_code', width:80, },
      {label:'ชื่อ', map:'item_c_name', },
      
      {label:'คงเหลือ', map:'f_quantity_org', width:100, align:'right',  },
      {label:' ', map: 'uofm_c_name', width:80, },
   
      {label:'ยอดที่นับได้', map:'f_quantity' , type:'textbox', size:7, align:'right', width:100, 
      	valid_number:'valid-number', readonly:true, chk_add:'chk_add',
		changeFn :  function(row){  }, 
	  },
	  {label:' ', map: 'uofm_c_name', width:80, },
	  {label:'หมายเหตุ', map: 'c_remark', width:200, },
	   
	  /* 
	  {label:'ราคาขายf_price', map:'f_price', width:80, align:'right',  },
	  {label:'ราคาขาย', map:'f_price_p_unit', width:80, align:'right',  },
      {label:'ราคาทุน', map:'f_fifo_p_unit', width:80, align:'right',  },
      {label:'ราคาต้นทุนมาตรฐาน', map:'f_price_207', width:80, align:'right',  },
      {label:'ราคาfifo', map:'f_price_fifo', width:80, align:'right',  },
      */
       
      
  ];   
    
  $scope.options.rows_dtl =[];
  $scope.options.rows_dtl_col ={id:'',item_id:'',item_c_code:'',item_c_name:''
  	,uofm_id:'',uofm_c_name:'',hcode:''
  };

 
  $scope.checkAll = function(value,rows) {
  	angular.forEach(rows , function(v,k) {
  		if(angular.isUndefined(v.chk_edit) && angular.isUndefined(v.chk_del))  		
  		  	v.chk_add = value;	  		 	
	})
  }	
   
  
  $scope.addItems = function(row) { 
    
   $scope.options.searchItem = {};
    
   $scope.options.cols_dtl = angular.copy($scope.options.cols_dtl_create); 
   $scope.options.cols_buttons = angular.copy($scope.options.cols_buttons_create); 
        
    
   $scope.row={};
   $scope.row.hdr={};     
   
   $scope.row.hdr.d_date = $scope.dNow;      
   
   $scope.row.hdr.e_status_action = "active_create";
   $scope.options.doc_type = "SC";	
   $scope.row.hdr.doc_type = $scope.options.doc_type;
   //$scope.row.hdr.get_last_no = $scope.row.hdr.doc_type +"-"+$scope.Employee.c_location_code+"-"+$scope.getYear+$scope.getMonth;
   $scope.row.hdr.get_last_no = $scope.row.hdr.doc_type+$scope.getYearTH+$scope.getMonth;
   $scope.row.hdr.get_last_no_size = 5;  	  
   	     
   $scope.options.rows_dtl =[];   
   
   $scope.row.hdr.i_from = $scope.Employee.location_id;
   $scope.row.hdr.c_from_name = $scope.Employee.c_location_code;
   
   $scope.row.hdr.i_to = $scope.Employee.location_id;
   $scope.row.hdr.c_to_name = $scope.Employee.c_location_code;      
   
   var parameter = { c_code: $scope.row.hdr.get_last_no , size: $scope.row.hdr.get_last_no_size , update : false };  
   iAPI.post('document.get_last_no',parameter).success(function(data) {
   	  console.log("document.get_last_no",data) ;
   	  data = angular.fromJson(data);
   	  $scope.row.hdr.c_doc_no = data.doc_no ; ;  
   });
   
   
   //alert("addItems");
   console.log("$scope.row",$scope.row);

  }   
 
 
  $scope.options.rows_dtl_col ={id:'',item_id:'',item_c_code:'',item_c_name:'',uofm_id:'',uofm_c_name:''
  	,hcode:''  
  	,f_price:'',f_fifo_p_unit:''
  	,c_uofm_f_factor:''   	
  	,receive_uofm_id:'',c_receive_uofm_name:'',c_receive_uofm_f_factor:''
  	,location_uofm_id:'',c_location_uofm_name:'',c_location_f_factor:''
  	,po_uofm_id:'',c_po_uofm_name:'',c_po_f_factor:''
  };  
  
   
  $scope.setSearchItem = function(rows){
  	
 
   	parameter = {}; 
   //iAPI.post('stock.stock_counting//'+$scope.Employee.location_id+'//201',parameter).success(function(data) {
   var item1 = 	$scope.options.searchItem.item1_id;
   var item2 = 	$scope.options.searchItem.item2_id;
   if( angular.isUndefined(item1)){
   		alert("กรุณาเลือกสินค้าก่อน");
   		return;   		
   }
   if( angular.isUndefined(item2)) item2 = "";
   
   
 	$scope.spinner = {active : true};  
 	 
   //iAPI.post('stock.stock_adjust_lot_frist//'+$scope.Employee.location_id+'//201///'+item1+"/"+item2,parameter).success(function(data) {
   iAPI.post('stock.stock_adjust_fifo//'+$scope.Employee.location_id+'//201///'+item1+"/"+item2,parameter).success(function(data) { 	
   	
   	  //alert("stock_counting");
   	  console.log("stock_counting",data) ;
   	  data = angular.fromJson(data);
 
   	  $scope.options.rows_dtl = [];
    
	  var index1 = 1 ;
   	  angular.forEach(data, function(v,k) {
  		
		var dtl = angular.copy( $scope.options.rows_dtl_col );
		
 		for(var i in dtl) {
		 	for(var j in v) {
		 		if( i==j){
					dtl[i]=v[j];
					break;
				}		 				
		 	}
		} 
		
  		var c_item_info = angular.fromJson(v.c_item_info); 
 		for(var i in dtl) {
		 	for(var j in c_item_info) {
		 		if( i==j){
					dtl[i]=c_item_info[j];
					break;
				}		 				
		 	}
		} 		
		
		dtl.c_seq = angular.copy(index1);
		index1++;
		
		dtl.f_quantity_org =  v.f_quantity ; 	
  		dtl.f_quantity = 0;
  		
  		
 
	    
	    
  		//ปรับให้เหมือนกับ ปรับยอด ตามเอกสาร 20160526
  		dtl.f_price = angular.copy( iAPI.tofix(v.f_price) );				
		dtl.f_fifo_p_unit = angular.copy( iAPI.tofix(v.f_fifo_p_unit) ); 		
		
		dtl.f_price_p_unit = angular.copy( iAPI.tofix(v.f_price_p_unit) ); 
		dtl.f_price_org = angular.copy( iAPI.tofix(v.f_price_p_unit) ); 
			
		dtl.f_price_207 = angular.copy( iAPI.tofix(v.f_price_207) );
		dtl.f_price_fifo = angular.copy( iAPI.tofix(v.f_price_fifo) );
			
		
  		$scope.options.rows_dtl.push(dtl) ;
  		 
      })     
   	  
   	  
      $scope.spinner = {active : false};
      
      $scope.row_hdr_change();
      
   },function(){
      $scope.spinner = {active : false};
   });  
   
   
  }

  $scope.options.afterGet = function(rows){ 
  
     if( $scope.location_url == "stock_counting_main_print_sc_confirm" ){
	  	angular.forEach(rows, function(v,k) {
	  		if(v.e_status_action=='active_confirm'){
		        v.rowBtn = {
		          icon:'fa-pencil',  
		        };	 
			}else if(v.e_status_action=='active_complete'){
		        v.rowBtn = {
		  	 	  icon:'fa-search',  
		        };		 
			}else if(v.e_status_action=='delete'){
		        v.rowBtn = {
		  	 	  icon:'fa-search',  
		        };	 	
	  		} 
	  		v.e_status_action_show = v.e_status_action;	
	  	})	
     }		  
   
    
  }
    
  $scope.options.beforeUpdRow = function(row) { 

    //$scope.spinner = {active : true};
    
    //$scope.options.show_add_but = false;
     
        
    //alert(row.e_status_action);
    
 	var row_tmp = angular.copy(row);
  	var row_dtl = angular.copy(row_tmp.dtls);  	
  	
  	$scope.row = {};
  	$scope.row.hdr = row_tmp;  	
  	$scope.row.id = $scope.row.hdr.id;
  	
	delete row_tmp.dtls;
 
 
   	var c_hdr_info = angular.fromJson($scope.row.hdr.c_hdr_info);
  	delete $scope.row.hdr.c_hdr_info;
  	
  	angular.forEach(c_hdr_info, function(value, key) {
		this[key] = value ;	 	
	}, $scope.row.hdr);
		
	$scope.options.searchItem.item1_id = $scope.row.hdr.search_item1_id ;
	$scope.options.searchItem.item1_name = $scope.row.hdr.search_item1_name ;
	$scope.options.searchItem.item1_code = $scope.row.hdr.search_item1_code ;
	
	$scope.options.searchItem.item2_id = $scope.row.hdr.search_item2_id ;
	$scope.options.searchItem.item2_name = $scope.row.hdr.search_item2_name ;
	$scope.options.searchItem.item2_code = $scope.row.hdr.search_item2_code ;	
	
	
		
	
   	for(var i in row_dtl){
  		//console.log("id="+row_dtl[i].id,row_dtl[i].c_dtl_info)
		var c_dtl_info = angular.fromJson(row_dtl[i].c_dtl_info);
		delete row_dtl[i].c_dtl_info;
		angular.forEach(c_dtl_info, function(value, key) {
			this[key] = value ;	 	
		}, row_dtl[i]);
		
		
		//หาค่ามาตรฐานให้มันจะได้ทำงานได้ 
		//ปรับให้เหมือนกับ ปรับยอด ตามเอกสาร 20160526
  		//row_dtl[i].f_price = angular.copy( v.f_price );
		//row_dtl[i].f_fifo_p_unit = angular.copy( v.f_fifo_p_unit ); 
		
		if( angular.isUndefined(row_dtl[i].f_price_p_unit) )
			row_dtl[i].f_price_p_unit = row_dtl[i].f_price;
		
		if( angular.isUndefined(row_dtl[i].f_price_org) )
			row_dtl[i].f_price_org = row_dtl[i].f_price;	
		
		if( angular.isUndefined(row_dtl[i].f_price_207) )
			row_dtl[i].f_price_207 = row_dtl[i].f_fifo_p_unit;
		
		if( angular.isUndefined(row_dtl[i].f_price_fifo) )
			row_dtl[i].f_price_fifo = row_dtl[i].f_fifo_p_unit;	
     
     
     	row_dtl[i].f_fifo_p_unit = iAPI.tofix(row_dtl[i].f_fifo_p_unit);
	    row_dtl[i].f_price = iAPI.tofix(row_dtl[i].f_price);
	    row_dtl[i].f_price_p_unit = iAPI.tofix(row_dtl[i].f_price_p_unit);
	    row_dtl[i].f_price_org = iAPI.tofix(row_dtl[i].f_price_org);
	    row_dtl[i].f_price_207 = iAPI.tofix(row_dtl[i].f_price_207);
	    row_dtl[i].f_price_fifo = iAPI.tofix(row_dtl[i].f_price_fifo);
	    
		if( $scope.location_url == "stock_counting_main_complete" ){
			if( angular.isUndefined(row_dtl[i].chk_edit) && angular.isUndefined(row_dtl[i].chk_del) ){
				row_dtl[i].checkbox = true;
			}
			row_dtl[i].chk_add = 0 ;
		}
			
	} 
		
	$scope.options.rows_dtl = row_dtl;	   
    
  		  		
	if( $scope.location_url == "stock_counting_main_new" ){
  		$scope.options.cols_dtl = angular.copy($scope.options.cols_dtl_create); 
    	$scope.options.cols_buttons = angular.copy($scope.options.cols_buttons_create); 
    	
    	$scope.row.hdr.e_status = "edit";  		 	
	}else if( $scope.location_url == "stock_counting_main_confirm" ){
	  	
	  	$scope.options.cols_dtl = angular.copy($scope.options.cols_dtl_confirm);      
	  	$scope.options.cols_buttons = [];
	  	
	  	//หาของที่มีอยู่จริงๆ
	  	iAPI.post('stock.stock_counting_doc/'+$scope.row.hdr.id,{}).success(function(data) {
	   	    console.log("document.stock_counting_doc",data) ;
	   	    for(var i in data){
				for(var j in $scope.options.rows_dtl){
					if( data[i].item_id == $scope.options.rows_dtl[j].item_id ){
						$scope.options.rows_dtl[j].f_quantity_org = data[i].f_counting ;
						$scope.options.rows_dtl[j].f_price = data[i].f_price ;
						$scope.options.rows_dtl[j].f_fifo_p_unit = data[i].f_fifo_p_unit ;
						break;
					}
				}
			}
	   		   
	   })  
	   
	   
	}else if( $scope.location_url == "stock_counting_main_print_sc_confirm" ){
	  	
	  	//$scope.options.cols_dtl = angular.copy($scope.options.cols_dtl_confirm);  
	  	$scope.options.cols_dtl_th = angular.copy($scope.options.cols_dtl_complete_th1);
	  	$scope.options.cols_dtl = angular.copy($scope.options.cols_dtl_complete);       
	  	$scope.options.cols_buttons = [];
	  	
	  	if(row.e_status_action=='active_complete' || row.e_status_action=='delete'){
	  	
		  	$scope.options.allowOp = 'view'; 
	  		$scope.options.disabled = true;	  	
	  	} 	

  		
  		
	}else if( $scope.location_url == "stock_counting_main_print_sc_dif" ){
	  	
	  	//$scope.options.cols_dtl = angular.copy($scope.options.cols_dtl_confirm);
	  	$scope.options.cols_dtl_th = angular.copy($scope.options.cols_dtl_complete_th1);  
	  	$scope.options.cols_dtl = angular.copy($scope.options.cols_dtl_complete);     
	  	$scope.options.cols_buttons = [];
	}else if( $scope.location_url == "stock_counting_main_complete" ){
	  	
	  	if( $scope.row.hdr.doc_type == "TC" )
	  		$scope.options.cols_dtl = angular.copy($scope.options.cols_dtl_tc);      
	  	else
	  		$scope.options.cols_dtl = angular.copy($scope.options.cols_dtl_ta);	
	  	
	  	$scope.options.cols_buttons = [];
	}
	
  		

     
	
	  	
  	console.log("beforeUpdRow hdr ",$scope.row);
  	console.log("beforeUpdRow dtl",$scope.options.rows_dtl);
  	
  	
  }
 
  $scope.options.beforePost = function(row) {  	
   	
   	
   	 for(var i in $scope.options.rows_dtl){      
     	$scope.options.rows_dtl[i].f_fifo_p_unit = iAPI.tofix($scope.options.rows_dtl[i].f_fifo_p_unit);		
	 } 
	
   	
   	if( $scope.location_url == "stock_counting_main_new" ){
	   	$scope.row.hdr.search_item1_id = $scope.options.searchItem.item1_id;
	   	$scope.row.hdr.search_item1_name = $scope.options.searchItem.item1_name;
		$scope.row.hdr.search_item1_code = $scope.options.searchItem.item1_code;
		
	   	if( angular.isUndefined($scope.options.searchItem.item2_id) 
	   		|| $scope.options.searchItem.item2_id == "") {
			$scope.row.hdr.search_item2_id = "";
			$scope.row.hdr.search_item2_name = "";
			$scope.row.hdr.search_item2_code = "";
		}else{
			$scope.row.hdr.search_item2_id = $scope.options.searchItem.item2_id;
			$scope.row.hdr.search_item2_name = $scope.options.searchItem.item2_name;
			$scope.row.hdr.search_item2_code = $scope.options.searchItem.item2_code;
		}
	   	//alert(row.hdr.id); 
	   	
	   	//row.dtl = $scope.options.rows_dtl; 
	   	row.dtl = $filter('orderBy')($scope.options.rows_dtl, 'item_c_name');
	   	
	   	  	
   	}else if( $scope.location_url == "stock_counting_main_confirm" ){
		
		$scope.row.hdr.e_action = "confirm";		
		$scope.row.dtl_info = $scope.options.rows_dtl; 
		
		delete row.hdr.d_complete; 
		
		
	}else if( $scope.location_url == "stock_counting_main_print_sc_confirm" ){
		
		$scope.row.hdr.e_status = "edit";
		$scope.row.hdr.e_action = "confirm";	
		row.dtl = $scope.options.rows_dtl; 	
		//$scope.row.dtl_info = $scope.options.rows_dtl; 
		
		 
	}else if( $scope.location_url == "stock_counting_main_complete" ){
		
		$scope.row.hdr.e_action = "complete";
		
		$scope.row.dtl_info = $scope.options.rows_dtl;		
		
	}
   	
   	delete row.hdr.rowBtn;
   	delete row.hdr.e_status_action;   
   	delete row.hdr.e_status_action_show;   		  
   	  
   	$scope.options.row_hdr_temp = angular.copy($scope.row.hdr);  
   	$scope.options.row_dtl_temp = angular.copy($scope.options.rows_dtl); 
   	   	  	    	
  	return true 
  }
  $scope.options.afterPost = function(row){
  
    //alert($scope.location_url);

  	if( $scope.location_url == "stock_counting_main_confirm" ){
  		//วนลูปหา ที่เท่ากัน สร้าง TC และ ไม่เท่ากัน สร้าง TA
  		
  		 		
  		$scope.approve_action_sc_confirm();
  		  		
  		
  	}else if( $scope.location_url == "stock_counting_main_print_sc_confirm" ){	
  		
  		$scope.theRefashFn();
  		  		
  	}	
    else if( $scope.location_url == "stock_counting_main_complete" ){
  		
  		$scope.theRefashFn();   
  		
 		var tmp_row = {}; 
		tmp_row.hdr = angular.copy($scope.options.row_hdr_temp);	  	  		
  		var row_dtl = angular.copy($scope.options.row_dtl_temp); 		
  		
  		var url = '';
	  	var data = {}; 
	
	 
		data.hdr = {};
		data.hdr.id = tmp_row.hdr.i_refer_id; 	
		data.hdr.c_doc_no = tmp_row.hdr.c_refer_doc_no;
		data.hdr.doc_type = "SC";	  
		data.hdr.e_action = "complete";
		

		var url = 'document.update_action_doc';
		iAPI.post(angular.copy(url),angular.copy(data)).success(function(res) {									 
	
		});	
	
	  	
	  	
	  	delete tmp_row.hdr.search_item1_id;	
	  	delete tmp_row.hdr.search_item1_name;
	  	delete tmp_row.hdr.search_item1_code;
	  	delete tmp_row.hdr.search_item2_id;
	  	delete tmp_row.hdr.search_item2_name;
	  	delete tmp_row.hdr.search_item2_code;
	  	
	  	//f_fifo_total":817090.18,"f_price_total":817090.18,
	  	//alert(tmp_row.hdr.doc_type );
	  	
	  	
	  	//ออก IA 	 //ไม่ใช้แล้ว ไปใช้ใน approve_action_ta	
  		if(tmp_row.hdr.doc_type == "TA" ){
			
			$scope.insert_ia_by_ta(tmp_row,row_dtl);
			
		}
		else if(tmp_row.hdr.doc_type == "TC" ){
			
			data = {};
			data.hdr = angular.copy(tmp_row.hdr);	
			
			delete data.hdr.id ; 
			delete data.hdr.c_dtl_info;			
			
			data.hdr.doc_type = "IC"; 
			data.hdr.get_last_no = "IC" +"-"+$scope.Employee.c_location_code+"-"+$scope.getYear+$scope.getMonth;
			data.hdr.get_last_no_size = 4;
			data.hdr.pos_id    = "system";
			data.hdr.c_note    = "REF:"+tmp_row.hdr.c_doc_no;	
			
			
			data.hdr.i_refer_id = tmp_row.hdr.id;
		   	data.hdr.c_refer_c_doc_no = tmp_row.hdr.c_doc_no;
		   	
		   	data.hdr.i_refer_group_id = tmp_row.hdr.i_refer_id;
		   	data.hdr.c_refer_group_c_doc_no = tmp_row.hdr.c_refer_c_doc_no; 	
			  
			data.hdr.e_action = 'confirm'; 
			data.hdr.e_status = 'active'; 
		
		 	
		 	
		 	var f_doc_summary = 0 ;
		 	for( var i in row_dtl){
		 		
		 		delete row_dtl[i].receive_uofm_id;
				delete row_dtl[i].c_receive_uofm_name;
				delete row_dtl[i].c_receive_uofm_f_factor;
				delete row_dtl[i].location_uofm_id;
			    delete row_dtl[i].c_location_uofm_name;
			    delete row_dtl[i].c_location_f_factor;
			    delete row_dtl[i].po_uofm_id;
			    delete row_dtl[i].c_po_uofm_name;
			    delete row_dtl[i].c_po_f_factor;
			    delete row_dtl[i].f_quantity_location;
			    
			    
		 		f_doc_summary += row_dtl[i].f_price_total;
		 		
		 	}
		 			 	
		 	data.hdr.f_doc_summary = 0;
		 	data.hdr.f_doc_subtotal = 0;
		 	data.hdr.f_doc_total = 0;
		 	
		 	data.hdr.f_fifo_total = data.hdr.f_doc_summary;
		 	data.hdr.f_price_total = data.hdr.f_doc_summary;
		   	
		   	data.dtl = row_dtl;	
		   	
		   			   	
		 	console.log("TC",data);
		 		
			url = 'document.save_doc';
			iAPI.post(angular.copy(url),angular.copy(data)).success(function(res) {
				
				
			});
			
		}
		
		
  				
  	}
  	
  }



  $scope.approve_action_sc_confirm = function() {
  
  	var tmp_row = {}; 
	tmp_row.hdr = angular.copy($scope.row.hdr); 
	var row_dtl = angular.copy($scope.options.rows_dtl);
	
	//ลบใบเก่าออกก่อน
	if( angular.isDefined( tmp_row.hdr.ta_c_doc_no ) ){
		
		var data = {};
		data.hdr = {};	
		data.hdr.c_doc_no = tmp_row.hdr.ta_c_doc_no;
		data.hdr.e_status = 'delete';
		data.hdr.doc_type = "TA";
		var url = 'document.edit_doc';
		
		iAPI.post(angular.copy(url),angular.copy(data)).success(function(res) {
			
		});
		
	}	
	
	//ลบใบเก่าออกก่อน
	if( angular.isDefined( tmp_row.hdr.tc_c_doc_no ) ){
		
		var data = {};
		data.hdr = {};	
		data.hdr.c_doc_no = tmp_row.hdr.tc_c_doc_no;
		data.hdr.e_status = 'delete';
		data.hdr.doc_type = "TC";
		var url = 'document.edit_doc';
		iAPI.post(angular.copy(url),angular.copy(data)).success(function(res) {
			
		});
		
	}
	
	
	//$scope.row.hdr.e_action = 'confirm';
 	
 	
	
	var rows_dtl_tc = [];
  	var rows_dtl_ta = [];
  		
	
	//var tmp_row = {}; 
	//tmp_row.hdr = angular.copy($scope.options.row_hdr_temp);  		
	//var row_dtl = angular.copy($scope.options.row_dtl_temp);
	

	
	for( var i in row_dtl){
		
		var row_temp = row_dtl[i];
		
		var f_quantity_org = iAPI.tofix(row_dtl[i].f_quantity_org);
		var f_quantity = iAPI.tofix(row_dtl[i].f_quantity);
		//var f_quantity_location = iAPI.tofix(row_dtl[i].f_quantity_location);
		
		//alert(f_quantity + " " + f_quantity_org + " " + f_quantity_location);
		if( f_quantity == f_quantity_org ){
			
			//"f_counting":"1680.00","f_fifo_p_unit":23.46,"f_price_total":39412.8,"f_adj":"0.0","chk_add":"0","c_seq":1}
			row_dtl[i].f_quantity_org = angular.copy(f_quantity_org);
			row_dtl[i].f_quantity = angular.copy(f_quantity);				
			row_dtl[i].f_counting = angular.copy(f_quantity);
			
			row_dtl[i].f_adj = 0.0;
			
			var f_fifo_p_unit = iAPI.tofix(row_dtl[i].f_fifo_p_unit);
			var f_price_total = f_quantity*f_fifo_p_unit;
			var f_price = iAPI.tofix(row_dtl[i].f_price);
			
			row_dtl[i].f_price = f_price;
			
			row_dtl[i].f_fifo_p_unit = f_fifo_p_unit;				
			row_dtl[i].f_price_total = f_price_total;
			
			row_dtl[i].f_unit_price = 0;
			row_dtl[i].f_unit_total = 0;
			
			
			rows_dtl_tc.push(row_dtl[i]);
			
			
		}else{
			//,"f_counting":"1374","f_fifo_p_unit":14.81,"f_adj":-26,"f_total":1374,"c_add_option_note":"","f_price_org":0,"f_price_p_unit":0}
			//2016-05-27 แก้ตามเอกสาร 20160526
			row_dtl[i].c_add_option_note = "";
			
			var f_adj = f_quantity - f_quantity_org ;
			if( isNaN(f_adj) ) f_adj = 0 ;
    
    		row_dtl[i].f_quantity_org =  f_quantity_org;
			row_dtl[i].f_quantity = angular.copy(f_quantity);
			row_dtl[i].f_counting = angular.copy(f_quantity);
			row_dtl[i].f_total = angular.copy(f_quantity);	
			row_dtl[i].f_adj = f_adj;	
				
			
				
			var f_fifo_p_unit = iAPI.tofix(row_dtl[i].f_fifo_p_unit);
    		//var f_price = iAPI.tofix(row_dtl[i].f_price);
    		var f_price = f_fifo_p_unit ;				
    		
    		//ราคาขาย
    		var f_price_p_unit = iAPI.tofix(row_dtl[i].f_price_p_unit);        
    		if( isNaN(f_price_p_unit) ) f_price_p_unit = iAPI.tofix(f_price);    
    		
		    //ราคา fifo
		    var f_price_fifo = iAPI.tofix(row_dtl[i].f_price_fifo); 
		    if( isNaN(f_price_fifo) ) f_price_fifo = iAPI.tofix(row_dtl[i].f_fifo_p_unit);    
		    //ราคาทุนมาตรฐาน
		    var f_price_207 = iAPI.tofix(row_dtl[i].f_price_207);
		    if( isNaN(f_price_207) ) f_price_207 = iAPI.tofix(row_dtl[i].f_fifo_p_unit); 
 				
				
			row_dtl[i].f_fifo_p_unit = f_fifo_p_unit;
				
			row_dtl[i].f_price_org = angular.copy(f_price_p_unit);
			row_dtl[i].f_price_p_unit = angular.copy(f_price_p_unit);

			row_dtl[i].f_price_fifo = angular.copy(f_price_fifo);
			row_dtl[i].f_price_207 = angular.copy(f_price_207);			
			
	
			//row_dtl[i].f_unit_price = row_dtl[i].f_quantity * row_dtl[i].f_price;
			//row_dtl[i].f_unit_total = row_dtl[i].f_unit_price;		

        
        	var f_unit_price = 0 ;
        	f_unit_price = f_quantity * f_price ;
        	/*
		    if( f_adj == 0 ){    	
		    	//คอลัมภ์ “ราคาทุน” ต้องแสดงเป็นราคาต้นทุนแบบ FIFO  
		    	row_dtl[i].f_fifo_p_unit = f_price_fifo;
				f_unit_price = 0;
				row_dtl[i].f_price = f_price_fifo;
				
			}else if( f_adj > 0 ){
				//คอลัมภ์ “ราคาทุน” จะต้องเปลี่ยนไปดึง “ราคาต้นทุนมาตรฐาน” 
				row.f_fifo_p_unit = f_price_207;		
				f_unit_price = f_quantity * f_price_207;
				row_dtl[i].f_price = f_price_207;
			}else if( f_adj < 0 ){
				//คอลัมภ์ “ราคาทุน” ไม่ต้องเปลี่ยน ยังคงเป็นต้นทุนแบบ FIFO 
				row.f_fifo_p_unit = f_price_fifo;
				f_unit_price = f_quantity * f_price_p_unit;
				row_dtl[i].f_price = f_price_p_unit;
			}
			*/
		 
	    
		    if( isNaN(f_unit_price) ) f_unit_price = 0 ; 
		    var f_unit_total = f_unit_price;   

			row_dtl[i].f_unit_price = f_unit_price;
			row_dtl[i].f_unit_total = f_unit_total;	
				
	    
			/*
			if( f_adj > 0){
				row_dtl[i].f_price = angular.copy(f_fifo_p_unit);
				
				row_dtl[i].f_unit_price = 0;
				row_dtl[i].f_unit_total = 0;			
				
			}
			*/
			
			rows_dtl_ta.push(row_dtl[i]);
					
		}
	}
	 
	console.log("rows_dtl_ta",rows_dtl_ta);
	console.log("rows_dtl_tc",rows_dtl_tc);

	
	
	if( rows_dtl_ta.length != 0 && rows_dtl_tc.length != 0){	
		$scope.sc_insert_ta_tc(tmp_row,rows_dtl_ta,rows_dtl_tc);
	}else if( rows_dtl_ta.length != 0 ){		
	 	$scope.sc_insert_ta(tmp_row,rows_dtl_ta,false); 					
	}else if( rows_dtl_tc.length != 0 ){
		$scope.sc_insert_tc(tmp_row,rows_dtl_tc,false);  		 
	}		
	
	 
 	
  }; 
  
  
  $scope.approve_action_ta_check_complete = function() {

  	var chk_complete = false ;
  	for(var i in $scope.options.rows_dtl){
  	  if($scope.options.rows_dtl[i].chk_add == 1){
	  	chk_complete = true;
	  	break;
	  }
  	}
  	if(!chk_complete){
		alert("กรุณาเลือกรายการที่ต้องการปรับยอด");		
	}
	return chk_complete;
  }
    
  
  
  $scope.approve_action_ta = function(approve_action) {
  	
  	if( !$scope.approve_action_ta_check_complete() ) return ;
  	

  	
  	var url = '';
	var data = {}; 
  	var row_dtl = [];
  	
  	var chk_complete = 0 ;
  	
  	
  	for(var i in $scope.options.rows_dtl){      
     	$scope.options.rows_dtl[i].f_fifo_p_unit = iAPI.tofix($scope.options.rows_dtl[i].f_fifo_p_unit);	
     	
     	var chk_add = angular.copy($scope.options.rows_dtl[i].chk_add);
     	delete $scope.options.rows_dtl[i].chk_add;

     	if( $scope.options.rows_dtl[i].chk_edit == 1 || $scope.options.rows_dtl[i].chk_del == 1 ){
     		chk_complete++;
     	}
     	else if( chk_add == 1 ){
     		
     		delete $scope.options.rows_dtl[i].checkbox;
     		
     		if( approve_action == "add" ){
	     		var row = angular.copy($scope.options.rows_dtl[i]);
	     		row_dtl.push(row);
	     		
	     		$scope.options.rows_dtl[i].c_remark = "อนุมัติเมื่อ " + $scope.dNow ;
	     		$scope.options.rows_dtl[i].chk_edit = 1 ;				
				
			}else if( approve_action == "del" ){
				
				$scope.options.rows_dtl[i].c_remark = "ลบเมื่อ " + $scope.dNow ;
	     		$scope.options.rows_dtl[i].chk_del = 1 ;
			}
     		
     		chk_complete++;
     	}	
	 } 
	 
	 console.log("$scope.options.rows_dtl ใบ TA",$scope.options.rows_dtl);
	 console.log("row_dtl ใบ IA",row_dtl);
	
	
	 
	 $scope.row.dtl_info = $scope.options.rows_dtl;		
	
	 
	 delete $scope.row.hdr.rowBtn;
   	 delete $scope.row.hdr.e_status_action;   
   	 delete $scope.row.hdr.e_status_action_show;   		
   	
   	
	 $scope.options.row_hdr_temp = angular.copy($scope.row.hdr);  
	 
	 
	 var tmp_row = {}; 
	 tmp_row.hdr = angular.copy($scope.options.row_hdr_temp);	 		
  	
  	
  	 if( chk_complete == $scope.options.rows_dtl.length){
	 		  
	 	 //update complete 	  
	 	 $scope.row.hdr.e_action = "complete"; 
		 
	 }else{
	 	//update confirm 
	 	$scope.row.hdr.e_action = "confirm";
	 }
	 
	 
	 //กรณี ใบนี้เรียบร้อแล้ว	
	 data.hdr = {};
	 data.hdr.id = tmp_row.hdr.i_refer_id; 	
	 data.hdr.c_doc_no = tmp_row.hdr.c_refer_doc_no;
	 data.hdr.doc_type = "SC";	  
	 data.hdr.e_action = "complete";
		
 
	 url = 'document.update_action_doc';
	 iAPI.post(angular.copy(url),angular.copy(data)).success(function(res) {									 
			 
	 });
	 	
 	 data.hdr = {};
	 data.hdr.id = tmp_row.hdr.id; 	
	 data.hdr.c_doc_no = tmp_row.hdr.c_doc_no;
	 data.hdr.doc_type = "TA";	  
	 data.hdr.e_action = $scope.row.hdr.e_action;
	 data.dtl_info = $scope.options.rows_dtl;


	 url = 'document.update_action_doc';
	 iAPI.post(angular.copy(url),angular.copy(data)).success(function(res) {									 
		 
	 });
	 
	  	
	 delete tmp_row.hdr.search_item1_id;	
	 delete tmp_row.hdr.search_item1_name;
	 delete tmp_row.hdr.search_item1_code;
	 delete tmp_row.hdr.search_item2_id;
	 delete tmp_row.hdr.search_item2_name;
	 delete tmp_row.hdr.search_item2_code;
	  	
	 //สร้างใบ IA 	
	 if( row_dtl.length != 0 ) 
	 	$scope.insert_ia_by_ta(tmp_row,row_dtl);
	 
	 
	 $scope.theRefashFn();
	 
  }
	 
  $scope.insert_ia_by_ta = function(tmp_row,row_dtl) {
	 
	 var url = "";
	 var data = {};
	 	 
	 if( row_dtl.length != 0 ){
		 	
	 	data = {};
		data.hdr = angular.copy(tmp_row.hdr);	
		
		delete data.hdr.id ; 
		delete data.hdr.c_dtl_info;			
		
		data.hdr.doc_type = "IA";
		//data.hdr.get_last_no = "IA" +"-"+$scope.Employee.c_location_code+"-"+$scope.getYear+$scope.getMonth;
		data.hdr.get_last_no = "JU"+$scope.getYear+$scope.getMonth;
		data.hdr.get_last_no_size = 4;
		data.hdr.pos_id    = "system";
		data.hdr.c_note    = "REF:"+tmp_row.hdr.c_doc_no;	
		
		
		data.hdr.i_refer_id = tmp_row.hdr.id;
	   	data.hdr.c_refer_c_doc_no = tmp_row.hdr.c_doc_no;
	   	
	   	data.hdr.i_refer_group_id = tmp_row.hdr.i_refer_id;
	   	data.hdr.c_refer_group_c_doc_no = tmp_row.hdr.c_refer_c_doc_no; 	
		  
		data.hdr.e_action = 'confirm'; 
		data.hdr.e_status = 'active'; 

	    
	    var f_doc_summary = 0 ;
	    
	    
		for( var i in row_dtl){
			
			//2016-05-27 แก้ตามเอกสาร 20160526			
			
			var row_temp = row_dtl[i];
			
			var f_quantity_org = iAPI.tofix(row_dtl[i].f_quantity_org);
			var f_quantity = iAPI.tofix(row_dtl[i].f_quantity);  			

			var f_adj = f_quantity - f_quantity_org ;
			if( isNaN(f_adj) ) f_adj = 0 ;
			
			row_dtl[i].f_quantity_org =  f_quantity_org;
			row_dtl[i].f_quantity = angular.copy(f_adj);
			row_dtl[i].f_counting = angular.copy(f_quantity);
			row_dtl[i].f_total = angular.copy(f_quantity);					

			row_dtl[i].f_adj = f_adj;	
			
							
			
			var f_fifo_p_unit = iAPI.tofix(row_dtl[i].f_fifo_p_unit);
			//var f_price = iAPI.tofix(row_dtl[i].f_price);
			var f_price = f_fifo_p_unit;

	        //ราคาขาย
		    var f_price_p_unit = iAPI.tofix(row_dtl[i].f_price_p_unit); 
		    if( isNaN(f_price_p_unit) ) f_price_p_unit = f_price;    
		    //ราคา fifo
		    var f_price_fifo = iAPI.tofix(row_dtl[i].f_price_fifo); 
		    if( isNaN(f_price_fifo) ) f_price_fifo = f_fifo_p_unit;    
		    //ราคาทุนมาตรฐาน
		    var f_price_207 = iAPI.tofix(row_dtl[i].f_price_207);
		    if( isNaN(f_price_207) ) f_price_207 = f_fifo_p_unit; 
	  
				
			row_dtl[i].f_fifo_p_unit = f_fifo_p_unit;

			row_dtl[i].f_price_org = angular.copy(f_price_p_unit);
			row_dtl[i].f_price_p_unit = angular.copy(f_price_p_unit);
							
			row_dtl[i].f_price_fifo = angular.copy(f_price_fifo);
			row_dtl[i].f_price_207 = angular.copy(f_price_207);

		 
			

		
				
			//2016-08-01
			//3.1	เมื่อมีการปรับลดสินค้า จากการปรับยอด เดิมสูตรมูลค่าความเสียหายจะเป็น ราคาขาย * จำนวนที่ปรับ = มูลค่าความเสียหาย
		    //3.2	สูตรแบบใหม่คือ ราคาทุน * จำนวนที่ปรับ = มูลค่าความเสียหาย
		    
		    /*
		    if( f_adj == 0 ){    	
		    	//คอลัมภ์ “ราคาทุน” ต้องแสดงเป็นราคาต้นทุนแบบ FIFO  
		    	row_dtl[i].f_fifo_p_unit = f_price_fifo;
		    	row_dtl[i].f_price = f_price_fifo;
				f_unit_price = 0;	
				
			}else if( f_adj > 0 ){
				//คอลัมภ์ “ราคาทุน” จะต้องเปลี่ยนไปดึง “ราคาต้นทุนมาตรฐาน” 
				row_dtl[i].f_fifo_p_unit = f_price_207;	
				row_dtl[i].f_price = f_price_207;	
				f_unit_price = f_adj * f_price_207;				
			}else if( f_adj < 0 ){
				//คอลัมภ์ “ราคาทุน” ไม่ต้องเปลี่ยน ยังคงเป็นต้นทุนแบบ FIFO 
				row_dtl[i].f_fifo_p_unit = f_price_fifo;
				row_dtl[i].f_price = f_price_p_unit;
				f_unit_price = f_adj * f_price_p_unit;				
			}
			*/
			
	        var f_unit_price = 0 ;
				
				
		    if( f_adj == 0 ){    	
		    	//คอลัมภ์ “ราคาทุน” ต้องแสดงเป็นราคาต้นทุนแบบ FIFO  				
				row_dtl[i].f_price = f_fifo_p_unit; 
				f_unit_price = 0; 
			}else if( f_adj > 0 ){
				//ราคาทุน * จำนวนที่ปรับ = มูลค่าความเสียหาย
				row_dtl[i].f_price = f_fifo_p_unit; 
				f_unit_price = f_adj * f_fifo_p_unit ;	
			}else if( f_adj < 0 ){
				//ราคาทุน * จำนวนที่ปรับ = มูลค่าความเสียหาย				
				row_dtl[i].f_price = f_fifo_p_unit; 
				f_unit_price = f_adj * f_fifo_p_unit;
			}
	
				
			if( isNaN(f_unit_price) ) f_unit_price = 0 ; 
	   		var f_unit_total = f_unit_price;   
	   		
	   		row_dtl[i].f_unit_price = f_unit_price;
			row_dtl[i].f_unit_total = f_unit_total;	
			

			/*
			row_dtl[i].f_unit_price = row_dtl[i].f_quantity * row_dtl[i].f_price;
			row_dtl[i].f_unit_total = row_dtl[i].f_unit_price;		


			if( f_adj > 0){
				row_dtl[i].f_price = angular.copy(f_fifo_p_unit);
				
				row_dtl[i].f_unit_price = 0;
				row_dtl[i].f_unit_total = 0;			
				
			}
			*/
			
			f_doc_summary += row_dtl[i].f_unit_total;
			
			 
			delete row_dtl[i].receive_uofm_id;
			delete row_dtl[i].c_receive_uofm_name;
			delete row_dtl[i].c_receive_uofm_f_factor;
			delete row_dtl[i].location_uofm_id;
		    delete row_dtl[i].c_location_uofm_name;
		    delete row_dtl[i].c_location_f_factor;
		    delete row_dtl[i].po_uofm_id;
		    delete row_dtl[i].c_po_uofm_name;
		    delete row_dtl[i].c_po_f_factor;
		    delete row_dtl[i].f_quantity_location;

	  			
		}
		f_doc_summary = iAPI.tofix(f_doc_summary);
		
		
	 	data.hdr.f_doc_summary = f_doc_summary;
	 	data.hdr.f_doc_subtotal = data.hdr.f_doc_summary;
	 	data.hdr.f_doc_total = data.hdr.f_doc_summary;
	   	
	   	//data.hdr.f_fifo_total = data.hdr.f_doc_summary;
	 	//data.hdr.f_price_total = data.hdr.f_doc_summary;
	 	
	   	//f_fifo_total":817090.18,"f_price_total":817090.18,
	   	
	   	
	   	data.dtl = row_dtl;	
	   			   	
	 	console.log("TA",data);
	 		
		url = 'document.save_doc';
		iAPI.post(angular.copy(url),angular.copy(data)).success(function(res) {
			//update stock
			url = 'document.insert_stock_card';
			data = {};
			data.id = res.id;
			iAPI.post(angular.copy(url),angular.copy(data)).success(function(res) {
				alert("ตัด stock ตรวจนับ เรียบร้อยแล้ว");
			}); 				
			
			$scope.print_action_ia(res.id);
		});
		
			
	}	
	
  }
  
  	  
  $scope.sc_action_confirm = function(tmp_row,res,ta_tc) {
  	
	var data = {};
	data.hdr = {};
	data.hdr.id = tmp_row.hdr.id; 	
	data.hdr.c_doc_no = tmp_row.hdr.c_doc_no;
	data.hdr.doc_type = "SC";	  
	data.hdr.e_action = "confirm";
	
	data.hdr_info = {};
	if(ta_tc="ta" ) data.hdr_info.ta_c_doc_no = res.c_doc_no;
	else data.hdr_info.tc_c_doc_no = res.c_doc_no;

	var url = 'document.update_action_doc';
	iAPI.post(angular.copy(url),angular.copy(data)).success(function(res) {									 
		$scope.theRefashFn();		
	});			
			
  }

  $scope.sc_insert_ta = function(tmp_row,rows_dtl_ta,noInsert) {
 		
 		
 		var data = {};
		data.hdr = angular.copy(tmp_row.hdr);	
		
		delete data.hdr.id ;
		delete data.hdr.d_confirm ;
		delete data.hdr.c_dtl_info;
		
		
		data.hdr.doc_type = "TA";
		data.hdr.pos_id    = "system";
		data.hdr.c_note    = "REF:"+tmp_row.hdr.c_doc_no;			
		
		data.hdr.i_refer_id = tmp_row.hdr.id;
	   	data.hdr.c_refer_c_doc_no = tmp_row.hdr.c_doc_no;
	   	data.hdr.i_refer_group_id = tmp_row.hdr.id;
	   	data.hdr.c_refer_group_c_doc_no = tmp_row.hdr.c_doc_no; 	
		  
		data.hdr.e_action = 'create'; 
		data.hdr.e_status = 'active'; 
							
	 	data.dtl = rows_dtl_ta;		
	 	
	 	var f_doc_summary = 0 ;
	 	for( var i in data.dtl){
	 		f_doc_summary += data.dtl[i].f_unit_total;
	 	}
	 	data.hdr.f_doc_summary = f_doc_summary;
	 	data.hdr.f_doc_subtotal = data.hdr.f_doc_summary;
	 	data.hdr.f_doc_total = data.hdr.f_doc_summary;
	 		   	
	 	console.log("TA",data); 	
	 	
	 	if( angular.isDefined( tmp_row.hdr.ta_c_doc_no ) ){
	 		data.hdr.c_doc_no = tmp_row.hdr.ta_c_doc_no;
	 	}else{
			data.hdr.get_last_no = "TA"+$scope.getYearTH+$scope.getMonth;
			data.hdr.get_last_no_size = 4;
		}
		
		if(noInsert) return data;
		
		var url = 'document.save_doc';
		iAPI.post(angular.copy(url),angular.copy(data)).success(function(res) {
			
			$scope.sc_action_confirm(tmp_row,res,"ta");			 
			
		});  	
  }  
  
  $scope.sc_insert_tc = function(tmp_row,rows_dtl_tc,noInsert) {
  	
    	var data = {};
		data.hdr = angular.copy(tmp_row.hdr);
		
		delete data.hdr.id ;
		delete data.hdr.d_confirm ;
		
		
		data.hdr.doc_type = "TC";
		data.hdr.pos_id    = "system";
		data.hdr.c_note    = "REF:"+tmp_row.hdr.c_doc_no;			
		
		data.hdr.i_refer_id = tmp_row.hdr.id;
	   	data.hdr.c_refer_c_doc_no = tmp_row.hdr.c_doc_no;
	   	data.hdr.i_refer_group_id = tmp_row.hdr.id;
	   	data.hdr.c_refer_group_c_doc_no = tmp_row.hdr.c_doc_no; 	
		  
		data.hdr.e_action = 'create'; 
		data.hdr.e_status = 'active'; 
					
	 	data.dtl = rows_dtl_tc;		
	 		 	
	 	var f_doc_summary = 0 ;
	 	for( var i in data.dtl){
	 		f_doc_summary += data.dtl[i].f_price_total;
	 	}
	 	data.hdr.f_doc_summary = 0;
	 	data.hdr.f_doc_subtotal = 0;
	 	data.hdr.f_doc_total = 0;
	 	
	 	data.hdr.f_fifo_total = data.hdr.f_doc_summary;
	 	data.hdr.f_price_total = data.hdr.f_doc_summary;
	   	
	 	console.log("TC",data);
	 	
	 	if( angular.isDefined( tmp_row.hdr.tc_c_doc_no ) ){
	 		data.hdr.c_doc_no = tmp_row.hdr.tc_c_doc_no;
	 	}else{
			data.hdr.get_last_no = "TC"+$scope.getYearTH+$scope.getMonth;
			data.hdr.get_last_no_size = 4;
		}
		
		if(noInsert) return data;
		
		var url = 'document.save_doc';
		iAPI.post(angular.copy(url),angular.copy(data)).success(function(res) {
			
			$scope.sc_action_confirm(tmp_row,res,"tc");			 
			
		});  	
	 	
    	
  }
  
  $scope.sc_insert_ta_tc = function(tmp_row,rows_dtl_ta,rows_dtl_tc) {
    	
    	
    	var data_ta = $scope.sc_insert_ta(tmp_row,rows_dtl_ta,true);   
    	var url = 'document.save_doc';
		iAPI.post(angular.copy(url),angular.copy(data_ta)).success(function(res) {
			
			$scope.sc_ta_c_doc_no = res.c_doc_no;
			
			var data_tc = $scope.sc_insert_tc(tmp_row,rows_dtl_tc,true);
			var url = 'document.save_doc';
			iAPI.post(angular.copy(url),angular.copy(data_tc)).success(function(res) {
				
				$scope.sc_tc_c_doc_no = res.c_doc_no;
				
				var data = {};
				data.hdr = {};
				data.hdr.id = tmp_row.hdr.id; 	
				data.hdr.c_doc_no = tmp_row.hdr.c_doc_no;
				data.hdr.doc_type = "SC";	  
				data.hdr.e_action = "confirm";
				
				data.hdr_info = {};
				data.hdr_info.ta_c_doc_no = $scope.sc_ta_c_doc_no;
				data.hdr_info.tc_c_doc_no = $scope.sc_tc_c_doc_no;

				var url = 'document.update_action_doc';
				iAPI.post(angular.copy(url),angular.copy(data)).success(function(res) {									 
					$scope.theRefashFn();		
				});	
	
	
			});	
			
			
		}); 
		
    	
  }

  $scope.row_dtl_change1 = function(row) {
   	 
   	 row.f_quantity_location = row.f_quantity_po * row.c_po_f_factor ;
   	 row.f_quantity = row.f_quantity_location;
   	 //alert(row.f_quantity);
	 $scope.row_hdr_change();
	
  }  
 
  $scope.row_dtl_change2 = function(row) {
   	 
   	 row.f_quantity = row.f_quantity_location;
	 $scope.row_hdr_change();	
  } 
   
  $scope.row_hdr_change = function() {
   	 
   	 	    	    	 
  }   
    
  $scope.row_del = function(idx,row) {
 
 	//ใช้ row ไปหา indexOf ห้ามใช้ idx เด็ดขาด
	var indexOfRow = $scope.options.rows_dtl.indexOf(row);	
	//alert("idx="+idx +" indexOfRow="+indexOfRow);	
	if(indexOfRow < 0 )indexOfRow = idx;
  	$scope.options.rows_dtl.splice(indexOfRow, 1);
  	//$scope.options.rows_dtl.splice(idx, 1);
  
  }

  $scope.delete_msg = function() {
	//$scope.row.hdr.e_status = 'delete';	
	$scope.row.c_name = $scope.row.hdr.c_doc_no ;
	//$scope.options.display = {};
	$scope.options.display.message1 = "ต้องการลบรายการการปรับปรุงยอดสินค้าใน : " + $scope.row.hdr.c_doc_no;
	$scope.options.display.confirmTitle = "ยืนยันลบรายการการปรับปรุงยอดสินค้า";
  };      
 
  $scope.delete_action_ta = function() {
  	//alert("Delete");
  	  	 
  	$scope.approve_action_ta('del');
  		
  }; 
      
  $scope.setDelFn = function(theDelFn) { 
      $scope.theDelFn = theDelFn;
  };
  
    
       
  $scope.setRefashFn = function(theRefashFn) {
      $scope.theRefashFn = theRefashFn;
  };    


  $scope.colFn = function(col)  {
  	//alert("colFn");
  	console.log("colFn",col);
  	if (angular.isFunction(col.fn)){
		col.fn(col.value,$scope.options.rows_dtl);
	}else if (angular.isFunction(col.checkAllFn)){
  		col.checkAllFn(col.value,$scope.options.rows_dtl);
	}
	
  }
  
  
  $scope.print_action_sc = function() {
  	$scope.opt = {
    	report_type: "sc", 
    	id: $scope.row.hdr.id,     	
    }; 
    $scope.doc_print($scope.opt);    
  } 
  $scope.print_action_sc_confirm = function() {
  	$scope.opt = {
    	report_type: "sc_confirm", 
    	id: $scope.row.hdr.id,     	
    }; 
    $scope.doc_print($scope.opt);    
  }   
  $scope.print_action_sc_dif = function() {
  	$scope.opt = {
    	report_type: "sc_dif", 
    	id: $scope.row.hdr.id,     	
    }; 
    $scope.doc_print($scope.opt);    
  } 
  $scope.print_action_ia = function(id) {
  	$scope.opt = {   	
    	report_type: "ia",  
    	id: id,  	
    }; 
    $scope.doc_print($scope.opt);     
  }; 
  
   
  $scope.openModal_item = function (textName) {
 	
  	$scope.opt = {  
    	id: 0, 
    	parentRow:{}, 
    	display:{
			modal_title:'เลือกสินค้า'
		},
		target:textName,
    }; 
    
    var modalInstance = $modal.open({
      templateUrl: 'views/operation/search.item.Ctrl.html',
      controller: 'Search.item.Ctrl',
      size: 'lg',
      scope:$scope,
      resolve: {
        options: function () {
          return $scope.opt;
        }
      }
    });
    modalInstance.result.then(function (item) {
       //alert(item);
	   if(item==""){
	   		//delete $scope.options.searchItem[$scope.opt.target+"_name"];
	   		//delete $scope.options.searchItem[$scope.opt.target+"_code"];
	   		//delete $scope.options.searchItem[$scope.opt.target+"_id"];
	   }else{
		   $scope.options.searchItem[$scope.opt.target+"_name"]=  item[0].c_code+" : "+item[0].c_name;
		   $scope.options.searchItem[$scope.opt.target+"_code"]=  item[0].c_code;
		   $scope.options.searchItem[$scope.opt.target+"_id"]=  item[0].id;
	   } 
    
    });
    
  }
  
  	

}]) 

.controller('Stock_adjustCtrl', ['$scope', 'iAPI', '$modal', '$filter', '$q', '$window', function ($scope,iAPI,$modal,$filter,$q,$window) {

    var ConfPageTitle = { pageTitle_org : 'ปรับยอด',
  	pageTitle_add_edit : '',
  	pageCaption_org : '',
  	pageTitle_edit : 'รายละเอียด',
    pageTitle_table : '',
  };
  iAPI.setConfPageTitle(ConfPageTitle);

  $scope.content_height=$window.innerHeight - $scope.innerHeight ;
  
  $scope.options = {
    //allowOp: 'view,add,month',
    allowOp: 'view,add',
    dataAPI: '',
    getAPI: 'document.get_doc_web/'+'/IA'+'/active/create/d_start/d_end',
    saveAPI: 'document.save_doc',
    updateAPI: 'document.edit_doc',
    cols : [
      {label: 'No.', map: 'id', width:60, format:'index', }, 
      {label: 'วันที่', map: 'd_create' }, 
      {label: 'เลขที่เอกสาร', map: 'c_doc_no' },
      {label: 'เอกสารอ้างอิง', map: 'c_refer_c_doc_no' },  
      //{label: 'From', map: 'c_from_name' }, 
    ],     
    itemPerPage:$scope.itemPerPage,
    addFnForm:function(row){  
			$scope.addItems(row);
		 },
	editBtn : {
		noShow:true,
	},
	viewBtn : {
		show:true,
	},
	predicate:'d_create', 
    reverse:true,
  
  }
  
  //add options
  $scope.options.doc_type = "IA"; 
  $scope.options.rows_dtl =[];
  $scope.options.rows_dtl_col ={id:'',item_id:'',item_c_code:'',item_c_name:'',uofm_id:'',uofm_c_name:''
  	,hcode:''
  };  
  

  $scope.addItems = function(row) { 
 
   $scope.options.show_add_but = true;
   $scope.options.disabled = false;   
 
   $scope.options.cols_dtl = [
      {label:'No.', map:'id', width:60, format:'index', },  
      //{label:'hcode', map:'hcode', width:80, },
      {label:'รหัส', map:'item_c_code', width:80, },
      {label:'ชื่อ', map:'item_c_name', },      
      {label:'ราคาขาย', map:'f_price_p_unit', width:80, align:'right',  },
      {label:'ราคาทุน', map:'f_fifo_p_unit', width:80, align:'right',  },
      {label:'ก่อนปรับ', map:'f_quantity', width:80, align:'right', },
      {label:'ปรับยอด', map:'f_adj', type:'textbox', size:8, width:80, align:'right', valid_number:'valid-number',
      	changeFn :  function(row){ $scope.row_dtl_change(row); },   
      }, 
      {label:'คงเหลือ ', map:'f_total', width:80, align:'right', },
      {label:'หน่วย', map: 'uofm_c_name', width:80, },
      {label:'รวมมูลค่าเสียหาย', map: 'f_unit_total', width:120, align:'right', },
    ];
 
   $scope.options.cols_buttons = [
       {label:'', btn:'btn-danger', icon : 'ion ion-close', type:'button', width:20,
       	fn:function(idx,row){ 
			 $scope.row_del(idx,row);
		   },
	  },  
    ];
 
   $scope.row={};
   $scope.row.hdr={};  
   
   $scope.row.hdr.d_date = $scope.dNow;   
 	
   $scope.row.hdr.doc_type = $scope.options.doc_type;
   //$scope.row.hdr.get_last_no = $scope.row.hdr.doc_type +"-"+$scope.Employee.c_location_code+"-"+$scope.getYear+$scope.getMonth;
   $scope.row.hdr.get_last_no = "JU"+$scope.getYear+$scope.getMonth;
   $scope.row.hdr.get_last_no_size = 4;  	  
   	     
   	     
   $scope.options.rows_dtl =[];   
   
   $scope.row.hdr.i_from = $scope.Employee.location_id;
   $scope.row.hdr.c_from_name = $scope.Employee.c_location_code;
   
   $scope.row.hdr.i_to = $scope.Employee.location_id;
   $scope.row.hdr.c_to_name = $scope.Employee.c_location_code;      
   
   var parameter = { c_code: $scope.row.hdr.get_last_no , size: $scope.row.hdr.get_last_no_size , update : false };  
   iAPI.post('document.get_last_no',parameter).success(function(data) {
   	  console.log("document.get_last_no",data) ;
   	  data = angular.fromJson(data);
   	  $scope.row.hdr.c_doc_no = data.doc_no ; ;  
   });
    

  }    
  
  $scope.options.beforeUpdRow = function(row) { 
  
  $scope.options.cols_dtl = [
      {label:'No.', map:'id', width:60, format:'index', }, 
      //{label:'hcode', map:'hcode', width:80, }, 
      {label:'รหัส', map:'item_c_code', width:80, },
      {label:'ชื่อ', map:'item_c_name', },
      //{label:'หน่วยละ', map:'f_price', width:80, align:'right',  },
      {label:'ราคาขาย', map:'f_price_p_unit', width:80, align:'right',  },
      {label:'ราคาทุน', map:'f_fifo_p_unit', width:80, align:'right',  },
      {label:'ก่อนปรับ', map:'f_quantity_org', width:80, align:'right', },
      {label:'ปรับยอด', map:'f_adj', width:80, align:'right', },
 	  {label:'คงเหลือ', map:'f_total', width:80, align:'right', },
      {label:'หน่วย', map: 'uofm_c_name', width:80, },
      {label:'มูลค่าเสียหาย', map: 'f_unit_total', width:120, align:'right', },
    ];
    $scope.options.cols_buttons = [];
    
  	var row_tmp = angular.copy(row);
  	var row_dtl = angular.copy(row_tmp.dtls);
  	
  	for(var i in row_dtl){
		var c_dtl_info = angular.fromJson(row_dtl[i].c_dtl_info);
		delete row_dtl[i].c_dtl_info;
		angular.forEach(c_dtl_info, function(value, key) {
			this[key] = value ;	 	
		}, row_dtl[i]);
		
		row_dtl[i].option_disabled = true;
	} 
  	
  	delete row_tmp.dtls;
  	$scope.row = {};
  	$scope.row.hdr = row_tmp;  
  	$scope.row.id = $scope.row.hdr.id;	
  	
  	var c_hdr_info = angular.fromJson($scope.row.hdr.c_hdr_info);
  	delete $scope.row.hdr.c_hdr_info;
  	
  	angular.forEach(c_hdr_info, function(value, key) {
		this[key] = value ;	 	
	}, $scope.row.hdr);
  	
  	$scope.options.rows_dtl = row_dtl;  
  	
  	$scope.options.show_add_but = false;
  	$scope.options.disabled = true; 
  	
  	console.log("beforeUpdRow hdr ",$scope.row);
  	console.log("beforeUpdRow dtl",$scope.options.rows_dtl);
  	
  }
 
  $scope.options.beforePost = function(row) {  	
  
      if(!$scope.row.hdr.c_note) {
	 	alert("กรุณาใส่เหตุผล");
	 	return false;
	  }  
   	     	  
   	  var f_doc_summary = 0 ;   	   	  
   	  var row_dtl = []; 
   	  angular.forEach($scope.options.rows_dtl, function(value, key) {
		var f_adj = iAPI.tofix(value.f_adj);
   		if( isNaN(f_adj) ) f_adj = 0 ;
   		
   		delete value.option_disabled ;   
   		
   		value.f_adj = f_adj;			
	    value.f_quantity = f_adj; 
	    
	    var f_price = iAPI.tofix(value.f_price);
	    var f_fifo_p_unit = iAPI.tofix(value.f_fifo_p_unit);
	    
	    //value.f_price_org = angular.copy(f_price);
	    value.f_fifo_p_unit = f_fifo_p_unit;
	    
	    if( f_adj > 0){
			value.f_price = f_fifo_p_unit;
			value.f_unit_price = 0 ;
		    value.f_unit_total = 0 ;
		    	
		    /*	
			var f_unit_price = f_adj * f_fifo_p_unit;
			if( isNaN(f_unit_price) ) f_unit_price = 0 ;
			var f_unit_total = f_unit_price;   
			
			if( f_unit_price < 0 ){
		   		value.f_unit_price = f_unit_price;
		    	value.f_unit_total = f_unit_total;		
			}else{
				value.f_unit_price = 0 ;
		    	value.f_unit_total = 0 ;
			}
			*/
	
		}	    
	    /*
	    {"hcode":"08-000128","item_c_name":"MASK กระดาษ 3 ชั้น แบบคล้องหู","item_c_code":"T2055","item_group_id":"4","uofm_c_name":"กล่อง","unit_name":"กล่อง","receive_unit_name":"กล่อง","receive_uofm_c_name":"กล่อง","f_counting":"70","f_fifo_p_unit":"41.13","f_price_total":2879.1,"f_adj":1,"chk_add":1,"c_seq":387,"location_uofm_id":"4","f_total":70}
	    
	    {"item_c_code":"T2055","item_c_name":"MASK กระดาษ 3 ชั้น แบบคล้องหู","uofm_c_name":"กล่อง","hcode":"08-000128","f_fifo_p_unit":"41.13","f_adj":"1","f_total":69,"c_add_option_note":""}
	    */	    
	    f_doc_summary+= iAPI.tofix(value.f_unit_total);	    
	        
		this.push(value);			 

	 }, row_dtl);
	 	 
	 
	 if(row_dtl.length == 0 ) {
	 	alert("กรุณาเลือกสินค้า");
	 	return false;
	 }  	
	 
	 $scope.row.hdr.f_doc_summary = f_doc_summary;
   	 $scope.row.hdr.f_doc_subtotal = f_doc_summary;
   	 $scope.row.hdr.f_doc_total = f_doc_summary;   
	 
   	 row.dtl = row_dtl ; 
   	 
   	 $scope.options.rows_hdr_temp = angular.copy($scope.row.hdr);
   	 $scope.options.rows_dtl_temp = angular.copy(row_dtl);  	 
   	    	
  	 return true 
  }
  $scope.options.afterPost = function(row){
  	
  	//console.log("afterPost",row);
  	var url = '';
  	var data = {};    	
 		
	//update stock
	url = 'document.insert_stock_card';
	data = {};
	data.id = row.id;
	iAPI.post(url,data).success(function(res) {
		//alert("ตัด stock ปรับยอด เรียบร้อยแล้ว");
	}); 
	     
  }

 
  $scope.row_del = function(idx,row) {
  	//alert(idx);
  	//if( !angular.isUndefined(row) ) $scope.row = row;
  	//console.log("row_del",$scope.options.rows_dtl[idx]);
  	
  	//ใช้ row ไปหา indexOf ห้ามใช้ idx เด็ดขาด
	var indexOfRow = $scope.options.rows_dtl.indexOf(row);	
	//alert("idx="+idx +" indexOfRow="+indexOfRow);	
	if(indexOfRow < 0 )indexOfRow = idx;
  	$scope.options.rows_dtl.splice(indexOfRow, 1);
  	//$scope.options.rows_dtl.splice(idx, 1);


 
  
  }    
  $scope.row_dtl_change = function(row) {
   	//alert("คำนวนไม่ให้เกิน");
   	var f_price = iAPI.tofix(row.f_price);
   	var f_quantity = iAPI.tofix(row.f_quantity);
   	var f_adj = iAPI.tofix(row.f_adj);
    var f_total = f_quantity + f_adj;
    
    if( isNaN(f_total) ) f_total = 0 ;
    row.f_total = f_total;
    
    var f_unit_price = f_adj * f_price;
    //alert(f_unit_price );
    if( isNaN(f_unit_price) ) f_unit_price = 0 ; 
    var f_unit_total = f_unit_price;   
    
    //alert(f_unit_price + " " + f_unit_total);   
    if( f_unit_price < 0 ){
   		row.f_unit_price = f_unit_price;
    	row.f_unit_total = f_unit_total;		
	}else{
		row.f_unit_price = 0 ;
    	row.f_unit_total = 0 ;
	}
    $scope.row_hdr_change(); 
	
  }  
  $scope.row_hdr_change = function() {
   	 var f_doc_summary = 0 ;
   	 for(var m in $scope.options.rows_dtl) {
   	 	var value = $scope.options.rows_dtl[m];
   	 	f_doc_summary+= iAPI.tofix(value.f_unit_total);
   	 }

   	 $scope.row.hdr.f_doc_summary = f_doc_summary;
   	 $scope.row.hdr.f_doc_subtotal = f_doc_summary;
   	 $scope.row.hdr.f_doc_total = f_doc_summary;
   	 
   	    	 
  }  
    

  $scope.print_action = function() {
  	$scope.opt = {   	
    	report_type: "ia",  
    	id: $scope.row.hdr.id,  	
    }; 
    $scope.doc_print($scope.opt);     
  }; 
    
    
       
  $scope.setRefashFn = function(theRefashFn) {
      $scope.theRefashFn = theRefashFn;
  };  
 
  $scope.add_items = function() {
 
  	
  	$scope.opt = { location_id: $scope.Employee.location_id,
    	id: $scope.Employee.location_id, 
    	parentRow:{},
    	row_group : $scope.MODEL['all_item_group'],
    	display:{
			modal_title:'รายการสินค้า',
		},
    }; 
    var modalInstance = $modal.open({
     templateUrl: 'views/operation/stock.item.location.adjust.html',
      controller: 'Stock.item.location.adjust.Ctrl',
      size: 'lg',
      resolve: {
        options: function () {
          return $scope.opt;
        }
      }
    });
    modalInstance.result.then(function (items) { 
 		//console.log('items',items);
  		//console.log('$scope.options.rows_dtl',$scope.options.rows_dtl);
  		for(var m in items) {
 			var value = items[m];
 			
 			var chk = false;
 			for(var i in $scope.options.rows_dtl){
				var rows_dtl = $scope.options.rows_dtl[i];
				if( rows_dtl.item_id == value.item_id){
					chk = true;
					break;
				}
			}
			if(chk){
				alert("มีการปรับยอดสินค้า " + value.item_c_name + " แล้ว");
				continue;
			}
 			
 			
 			var dtl = angular.copy( $scope.options.rows_dtl_col );
 			for(var i in dtl) {
		 		for(var j in value) {
		 			if( i==j){
						dtl[i]=value[j];
						break;
					}		 				
		 		}
			}
			dtl.f_price = angular.copy( value.f_price );
				
			dtl.f_fifo_p_unit = angular.copy( value.f_fifo_p_unit ); 
			dtl.f_price_p_unit = angular.copy( value.f_price ); 
			dtl.f_price_org = angular.copy( value.f_price ); 
			
			dtl.f_quantity = angular.copy( value.f_quantity );
			dtl.f_quantity_org = angular.copy( value.f_quantity );
			dtl.f_adj = 0 ;
			dtl.f_total = angular.copy( value.f_quantity );
			dtl.id = $scope.options.rows_dtl.length + 1  ;
			
			dtl.c_add_option_note = "";
			dtl.f_unit_total = 0 ;
			
			//console.log('dtl',dtl);
	 		$scope.options.rows_dtl.push(dtl);
 		}
 		$scope.row_hdr_change();
 		//console.log('$scope.options.rows_dtl',$scope.options.rows_dtl);		 
	   	
    });
  }     
	

}]) 
.controller('Stock_adjust_mainCtrl', ['$scope', 'iAPI', '$modal', '$filter', '$q', '$window', function ($scope,iAPI,$modal,$filter,$q,$window) {

    var ConfPageTitle = { pageTitle_org : 'ปรับยอด',
  	pageTitle_add_edit : '',
  	pageCaption_org : '',
  	pageTitle_edit : 'รายละเอียด',
    pageTitle_table : '',
  };
  iAPI.setConfPageTitle(ConfPageTitle);

  $scope.content_height=$window.innerHeight - $scope.innerHeight ;
  
  $scope.options = {
    //allowOp: 'view,add,month',
    allowOp: 'view,add,group1',
    dataAPI: '',
    getAPI: 'document.get_doc_web/'+'/IA'+'/active/create/d_start/d_end',
    saveAPI: 'document.save_doc',
    updateAPI: 'document.edit_doc',
    cols : [
      {label: 'No.', map: 'id', width:60, format:'index', }, 
      {label: 'วันที่', map: 'd_create' }, 
      {label: 'เลขที่เอกสาร', map: 'c_doc_no' },
      {label: 'เอกสารอ้างอิง', map: 'c_refer_c_doc_no' },  
      //{label: 'From', map: 'c_from_name' }, 
    ],     
    itemPerPage:$scope.itemPerPage,
    addFnForm:function(row){  
			$scope.addItems(row);
		 },
	editBtn : {
		noShow:true,
	},
	viewBtn : {
		show:true,
	},
	predicate:'d_create', 
    reverse:true,
    filter_group : [
    	{map: 'e_status_action_show' },
    ],
    group : [
    	{ e_status_action_show : "active_create" , c_desc : "ยังไม่อนุมัติ" },
    	{ e_status_action_show : "active_confirm" , c_desc : "อนุมัติแล้ว" }, 
    	{ e_status_action_show : "delete" , c_desc : "ยกเลิก" },
    ],
    display : {
		groupLable : "สถานะ",
		groupOrderby : " ",
	},  
  }
  
  $scope.options.row_group = $scope.options.group[0];
    
  //add options
  $scope.options.doc_type = "IA"; 
  $scope.options.rows_dtl =[];
  $scope.options.rows_dtl_col ={id:'',item_id:'',item_c_code:'',item_c_name:'',uofm_id:'',uofm_c_name:''
  	,hcode:''
  };  
  
  
  $scope.set_title = function() { 
  
  
  	iAPI.get('user.get_user').success(function(res){
			//alert(res.c_setting);
	    	var c_setting = angular.fromJson(res.c_setting);
			console.log("confirm",c_setting.confirm);
			if( angular.isUndefined(c_setting.confirm) ) c_setting.confirm = [];	    
			
			for( var i in c_setting.confirm ){
				if( c_setting.confirm[i] == "confirm_TA" ){
					
					$scope.options.confirm_TA = true;
					$scope.options.allowOp = 'view,group1';
					
										
					break;
				}
			} 
			
			$scope.theRefashFn(); 				
	    
	})		
		 
  }		 
  $scope.set_title(); 		 

  $scope.options.afterGet = function(rows){
     
  	angular.forEach(rows, function(v,k) {  		
  		v.e_status_action_show = v.e_status_action;
  		  		
    })
  }  

   $scope.options.cols_dtl_add = [
      {label:'No.', map:'id', width:60, format:'index', },  
      //{label:'hcode', map:'hcode', width:80, },
      {label:'รหัส', map:'item_c_code', width:80, },
      {label:'ชื่อ', map:'item_c_name', },      
      //{label:'หน่วยละ', map:'f_price', width:80, align:'right',  },
      {label:'ราคาขาย', map:'f_price_p_unit', width:80, align:'right',  },
      //{label:'ราคาทุน', map:'f_fifo_p_unit', width:80, align:'right',  },
      {label:'ราคาทุน', map:'f_fifo_p_unit', type:'textbox', size:8, width:80, align:'right', valid_number:'valid-number', 
      	readonly:true, 
      	changeFn :  function(row){ $scope.row_dtl_change(row); },
      }, 
      //{label:'ราคาต้นทุนมาตรฐาน', map:'f_price_207', width:80, align:'right',  },
      //{label:'ราคาfifo', map:'f_price_fifo', width:80, align:'right',  },
      
      {label:'ก่อนปรับ', map:'f_quantity_org', width:80, align:'right', },
      {label:'ปรับยอด', map:'f_adj', type:'textbox', size:8, width:80, align:'right', valid_number:'valid-number',
      	changeFn :  function(row){ $scope.row_dtl_change(row); },   
      }, 
      {label:'คงเหลือ ', map:'f_total', width:80, align:'right', },
      {label:'หน่วย', map: 'uofm_c_name', width:80, },
      {label:'รวมมูลค่าเสียหาย', map: 'f_unit_total', width:120, align:'right', },
    ];

   $scope.options.cols_dtl_edit = [
      {label:'No.', map:'id', width:60, format:'index', },  
      //{label:'hcode', map:'hcode', width:80, },
      {label:'รหัส', map:'item_c_code', width:80, },
      {label:'ชื่อ', map:'item_c_name', },      
      //{label:'หน่วยละ', map:'f_price', width:80, align:'right',  },
      {label:'ราคาขาย', map:'f_price_p_unit', width:80, align:'right',  },
      //{label:'ราคาทุน', map:'f_fifo_p_unit', width:80, align:'right',  },
      {label:'ราคาทุน', map:'f_fifo_p_unit', type:'textbox', size:8, width:80, align:'right', valid_number:'valid-number', 
      	readonly:true, 
      	changeFn :  function(row){ $scope.row_dtl_change(row); },
      },
      //{label:'ราคาต้นทุนมาตรฐาน', map:'f_price_207', width:80, align:'right',  },
      //{label:'ราคาfifo', map:'f_price_fifo', width:80, align:'right',  },
      
      {label:'ก่อนปรับ', map:'f_quantity_org', width:80, align:'right', },
      {label:'ปรับยอด', map:'f_adj', type:'textbox', size:8, width:80, align:'right', valid_number:'valid-number',
      	changeFn :  function(row){ $scope.row_dtl_change(row); },   
      }, 
      {label:'คงเหลือ ', map:'f_total', width:80, align:'right', },
      {label:'หน่วย', map: 'uofm_c_name', width:80, },
      {label:'รวมมูลค่าเสียหาย', map: 'f_unit_total', width:120, align:'right', },
    ];
    
  $scope.options.cols_dtl_view = [
      {label:'No.', map:'id', width:60, format:'index', }, 
      //{label:'hcode', map:'hcode', width:80, }, 
      {label:'รหัส', map:'item_c_code', width:80, },
      {label:'ชื่อ', map:'item_c_name', },
      //{label:'หน่วยละ', map:'f_price', width:80, align:'right',  },
      {label:'ราคาขาย', map:'f_price_p_unit', width:80, align:'right',  },
      {label:'ราคาทุน', map:'f_fifo_p_unit', width:80, align:'right',  },
      //{label:'ราคาต้นทุนมาตรฐาน', map:'f_price_207', width:80, align:'right',  },
      //{label:'ราคาfifo', map:'f_price_fifo', width:80, align:'right',  },
      
      {label:'ก่อนปรับ', map:'f_quantity_org', width:80, align:'right', },
      {label:'ปรับยอด', map:'f_adj', width:80, align:'right', },
 	  {label:'คงเหลือ', map:'f_total', width:80, align:'right', },
      {label:'หน่วย', map: 'uofm_c_name', width:80, },
      {label:'มูลค่าเสียหาย', map: 'f_unit_total', width:120, align:'right', },
    ];


  $scope.addItems = function(row) { 
 
   $scope.options.show_add_but = true;
   $scope.options.disabled = false;   
 
   $scope.options.cols_dtl = angular.copy($scope.options.cols_dtl_add);
 
   $scope.options.cols_buttons = [
       {label:'', btn:'btn-danger', icon : 'ion ion-close', type:'button', width:20,
       	fn:function(idx,row){ 
			 $scope.row_del(idx,row);
		   },
	  },  
    ];
 
   $scope.row={};
   $scope.row.hdr={};  
   
   $scope.row.hdr.d_date = $scope.dNow;   
 	
   $scope.row.hdr.doc_type = $scope.options.doc_type;
   //$scope.row.hdr.get_last_no = $scope.row.hdr.doc_type +"-"+$scope.Employee.c_location_code+"-"+$scope.getYear+$scope.getMonth;
   $scope.row.hdr.get_last_no = "JU"+$scope.getYear+$scope.getMonth;
   $scope.row.hdr.get_last_no_size = 4;  	  
   	     
   	     
   $scope.options.rows_dtl =[];   
   
   $scope.row.hdr.i_from = $scope.Employee.location_id;
   $scope.row.hdr.c_from_name = $scope.Employee.c_location_code;
   
   $scope.row.hdr.i_to = $scope.Employee.location_id;
   $scope.row.hdr.c_to_name = $scope.Employee.c_location_code;      
   
   var parameter = { c_code: $scope.row.hdr.get_last_no , size: $scope.row.hdr.get_last_no_size , update : false };  
   iAPI.post('document.get_last_no',parameter).success(function(data) {
   	  console.log("document.get_last_no",data) ;
   	  data = angular.fromJson(data);
   	  $scope.row.hdr.c_doc_no = data.doc_no ; ;  
   });
    

  }    
  
  $scope.options.beforeUpdRow = function(row) { 
  
    $scope.options.cols_dtl = angular.copy($scope.options.cols_dtl_view);
    $scope.options.cols_buttons = [];
    
    if($scope.options.confirm_TA){
    	if( row.e_status_action == "active_create" )
    		$scope.options.cols_dtl = angular.copy($scope.options.cols_dtl_edit);
	}
    	
    
  	var row_tmp = angular.copy(row);
  	var row_dtl = angular.copy(row_tmp.dtls);
  	
  	for(var i in row_dtl){
		var c_dtl_info = angular.fromJson(row_dtl[i].c_dtl_info);
		delete row_dtl[i].c_dtl_info;
		angular.forEach(c_dtl_info, function(value, key) {
			this[key] = value ;	 	
		}, row_dtl[i]);
		
		row_dtl[i].option_disabled = true;
	} 
  	
  	delete row_tmp.dtls;
  	$scope.row = {};
  	$scope.row.hdr = row_tmp;  
  	$scope.row.id = $scope.row.hdr.id;	
  	
  	var c_hdr_info = angular.fromJson($scope.row.hdr.c_hdr_info);
  	delete $scope.row.hdr.c_hdr_info;
  	
  	angular.forEach(c_hdr_info, function(value, key) {
		this[key] = value ;	 	
	}, $scope.row.hdr);
  	
  	$scope.options.rows_dtl = row_dtl;  
  	
  	$scope.options.show_add_but = false;
  	$scope.options.disabled = true; 
  	
  	console.log("beforeUpdRow hdr ",$scope.row);
  	console.log("beforeUpdRow dtl",$scope.options.rows_dtl);
  	
  }
 
  $scope.options.beforePost = function(row) {  	
  
      if(!$scope.row.hdr.c_note) {
	 	alert("กรุณาใส่เหตุผล");
	 	return false;
	  }  
   	     	  
   	  var f_doc_summary = 0 ;   	   	  
   	  var row_dtl = []; 
   	  
   	  
   	  angular.forEach($scope.options.rows_dtl, function(value, key) {
		var f_adj = iAPI.tofix(value.f_adj);
   		if( isNaN(f_adj) ) f_adj = 0 ;
   		
   		delete value.option_disabled ;   
   		
   		value.f_adj = f_adj;			
	    value.f_quantity = f_adj; 
	    
	    var f_fifo_p_unit = iAPI.tofix(value.f_fifo_p_unit);
	    if( isNaN(f_fifo_p_unit) ) f_fifo_p_unit = 0 ; 	    
	    
	    var f_price_p_unit = iAPI.tofix(value.f_price_p_unit);
	    if( isNaN(f_price_p_unit) ) f_price_p_unit = 0 ; 
	    
	    var f_price_org = iAPI.tofix(value.f_price_org);
	    if( isNaN(f_price_org) ) f_price_org = f_price_p_unit;
	    
	    //ราคา fifo
	    var f_price_fifo = iAPI.tofix(value.f_price_fifo); 
	    if( isNaN(f_price_fifo) ) f_price_fifo = f_fifo_p_unit;    
	    //ราคาทุนมาตรฐาน
	    var f_price_207 = iAPI.tofix(value.f_price_207);
	    if( isNaN(f_price_207) ) f_price_207 = f_fifo_p_unit; 
	    
	                    	
	    //value.f_price_org = angular.copy(f_price);
	    
	    //2016-05-27 แก้ตามเอกสาร 20160526
	    value.f_fifo_p_unit = f_fifo_p_unit;
	    
	    value.f_price_p_unit = f_price_p_unit;
	    value.f_price_fifo = f_price_fifo;
	    value.f_price_207 = f_price_207;
	    value.f_price_org = f_price_org;
	    	    
	    //delete value.readonly ;
	    
	    f_doc_summary+= iAPI.tofix(value.f_unit_total);	    
	        
		this.push(value);	
		
		
	    
	    /*
	    if( f_adj > 0){
			value.f_price = f_fifo_p_unit;
			value.f_unit_price = 0 ;
		    value.f_unit_total = 0 ;
		    	
		    
			//var f_unit_price = f_adj * f_fifo_p_unit;
			//if( isNaN(f_unit_price) ) f_unit_price = 0 ;
			//var f_unit_total = f_unit_price;   
			
			//if( f_unit_price < 0 ){
		   	//	value.f_unit_price = f_unit_price;
		    //	value.f_unit_total = f_unit_total;		
			//}else{
			//	value.f_unit_price = 0 ;
		    //	value.f_unit_total = 0 ;
			//}
		}
		*/
	
	
	    //2016-04-22 
	    /*
	    if( f_adj > 0){
			value.f_price = f_fifo_p_unit;
	
		}else{
			value.f_price = f_price_p_unit;			
		}	   
		*/
		
		
	    /*
	    {"hcode":"08-000128","item_c_name":"MASK กระดาษ 3 ชั้น แบบคล้องหู","item_c_code":"T2055","item_group_id":"4","uofm_c_name":"กล่อง","unit_name":"กล่อง","receive_unit_name":"กล่อง","receive_uofm_c_name":"กล่อง","f_counting":"70","f_fifo_p_unit":"41.13","f_price_total":2879.1,"f_adj":1,"chk_add":1,"c_seq":387,"location_uofm_id":"4","f_total":70}
	    
	    {"item_c_code":"T2055","item_c_name":"MASK กระดาษ 3 ชั้น แบบคล้องหู","uofm_c_name":"กล่อง","hcode":"08-000128","f_fifo_p_unit":"41.13","f_adj":"1","f_total":69,"c_add_option_note":""}
	    */	    
	    
	   		 

	 }, row_dtl);
	 	 
	 
	 if(row_dtl.length == 0 ) {
	 	alert("กรุณาเลือกสินค้า");
	 	return false;
	 }  	
	 
	 f_doc_summary = iAPI.tofix(f_doc_summary);
	 
	 $scope.row.hdr.f_doc_summary = f_doc_summary;
   	 $scope.row.hdr.f_doc_subtotal = f_doc_summary;
   	 $scope.row.hdr.f_doc_total = f_doc_summary;   
	 
   	 $scope.row.dtl = row_dtl ; 
   	 
   	 $scope.options.rows_hdr_temp = angular.copy($scope.row.hdr);
   	 $scope.options.rows_dtl_temp = angular.copy(row_dtl);  	 
   	    	
  	 return true 
  }
  $scope.options.afterPost = function(row){
  		     
  }
  $scope.approve_action = function(){
  	
 	//$scope.row.hdr.e_action = 'confirm';	
	var	data = {};
	data.hdr = {};	
	
	data.hdr.id = $scope.row.hdr.id; 	
	data.hdr.c_doc_no = $scope.row.hdr.c_doc_no;
	data.hdr.doc_type = $scope.options.doc_type;	  
	data.hdr.e_action = "confirm";
	
	
	$scope.options.beforePost(data);	
	
	data.hdr.f_doc_summary = $scope.row.hdr.f_doc_summary ;
   	data.hdr.f_doc_subtotal = $scope.row.hdr.f_doc_subtotal ;
   	data.hdr.f_doc_total = $scope.row.hdr.f_doc_total ;  
   	 
	
	data.dtl_info = $scope.options.rows_dtl;

	url = 'document.update_action_doc';
	iAPI.post(url,angular.copy(data)).success(function(res) {
		
		//2016-06-29
    	//แก้ไขให้ว่า ถ้า e_status != 'active' ไม่ให้ทำงาน
		console.log("update_action_doc",res);
		if( res.e_status == "active" ){
	
			$scope.print_action();
			
			//ตัด stock
		 	url = 'document.insert_stock_card';
			data = {};
			data.id = $scope.row.hdr.id;
			iAPI.post(url,data).success(function(res) {
			 	//alert("ตัด stock ปรับยอด เรียบร้อยแล้ว");
			});	
			
		}else{
			alert("ไม่สามารถ Approve และ ตัด stock ได้ เนื่องจาก เอกสาร " + res.c_doc_no + " ถูกแก้ไข กรุณาตรวจสอบและดำเนินการใหม่");
		}		
		
		$scope.theRefashFn();
		
		
		/*
		$scope.print_action();		
		
		//update stock
		url = 'document.insert_stock_card';
		data = {};
		data.id = $scope.row.id;
		iAPI.post(url,angular.copy(data)).success(function(res) {
			//alert("ตัด stock ปรับยอด เรียบร้อยแล้ว");
		});  		
		
		$scope.theRefashFn();
		*/
	});	 	
  	 

  	
  }
 
  $scope.row_del = function(idx,row) {  	
  	//ใช้ row ไปหา indexOf ห้ามใช้ idx เด็ดขาด
	var indexOfRow = $scope.options.rows_dtl.indexOf(row);	
	//alert("idx="+idx +" indexOfRow="+indexOfRow);	
	if(indexOfRow < 0 )indexOfRow = idx;
  	$scope.options.rows_dtl.splice(indexOfRow, 1);
  	//$scope.options.rows_dtl.splice(idx, 1);
  }    
  
  
  
  $scope.row_dtl_change = function(row) {
   	//alert("คำนวนไม่ให้เกิน");
   	
   	var f_quantity = iAPI.tofix(row.f_quantity_org);
   	var f_adj = iAPI.tofix(row.f_adj);
   	if( isNaN(f_adj) ) f_adj = 0 ; 
   	
    var f_total = f_quantity + f_adj;    
    if( isNaN(f_total) ) f_total = 0 ;
    row.f_total = f_total;
    
    var f_unit_price = 0 ;
    
    //2016-05-27 แก้ตามเอกสาร 20160526
    //ราคาขาย
    var f_price_p_unit = iAPI.tofix(row.f_price_p_unit);        
      
    //ราคา fifo
    var f_price_fifo = iAPI.tofix(row.f_price_fifo); 
    if( isNaN(f_price_fifo) ) f_price_fifo = iAPI.tofix(row.f_fifo_p_unit);    
    //ราคาทุนมาตรฐาน
    var f_price_207 = iAPI.tofix(row.f_price_207);
    if( isNaN(f_price_207) ) f_price_207 = iAPI.tofix(row.f_fifo_p_unit); 
	
	var f_fifo_p_unit = iAPI.tofix(row.f_fifo_p_unit);
	
    
    var chk_readonly = true;              
         

	
	//2016-08-01
	//3.1	เมื่อมีการปรับลดสินค้า จากการปรับยอด เดิมสูตรมูลค่าความเสียหายจะเป็น ราคาขาย * จำนวนที่ปรับ = มูลค่าความเสียหาย
    //3.2	สูตรแบบใหม่คือ ราคาทุน * จำนวนที่ปรับ = มูลค่าความเสียหาย
 
     /*     
    if( f_adj == 0 ){    	
    	//คอลัมภ์ “ราคาทุน” ต้องแสดงเป็นราคาต้นทุนแบบ FIFO  
    	row.f_fifo_p_unit = f_price_fifo;
		f_unit_price = 0;
		row.f_price = f_price_fifo;
		row.readonly = true;
	}else if( f_adj > 0 ){
		//คอลัมภ์ “ราคาทุน” จะต้องเปลี่ยนไปดึง “ราคาต้นทุนมาตรฐาน” 
		row.f_fifo_p_unit = f_price_207;		
		f_unit_price = f_adj * f_price_207;
		row.f_price = f_price_207;	
		row.readonly = false;
	}else if( f_adj < 0 ){
		//คอลัมภ์ “ราคาทุน” ไม่ต้องเปลี่ยน ยังคงเป็นต้นทุนแบบ FIFO 
		row.f_fifo_p_unit = f_price_fifo;
		f_unit_price = f_adj * f_price_p_unit;
		row.f_price = f_price_p_unit;
		row.readonly = true;
	}
	*/
	        
    if( f_adj == 0 ){    	
    	//คอลัมภ์ “ราคาทุน” ต้องแสดงเป็นราคาต้นทุนแบบ FIFO  
    	//row.f_fifo_p_unit = f_price_fifo;
		f_unit_price = 0;
		row.f_price = f_fifo_p_unit;
		row.readonly = true;
	}else if( f_adj > 0 ){
		//ราคาทุน * จำนวนที่ปรับ = มูลค่าความเสียหาย
		//row.f_fifo_p_unit = f_price_fifo;		
		f_unit_price = f_adj * f_fifo_p_unit;
		row.f_price = f_fifo_p_unit;	
		row.readonly = false;
	}else if( f_adj < 0 ){
		//ราคาทุน * จำนวนที่ปรับ = มูลค่าความเสียหาย
		//row.f_fifo_p_unit = f_price_fifo;
		f_unit_price = f_adj * f_fifo_p_unit;
		row.f_price = f_fifo_p_unit;
		row.readonly = true;
	}
	
	//console.log("cols_dtl",$scope.options.cols_dtl ) ;
	
	/* 
	angular.forEach($scope.options.cols_dtl, function(v,k) {
		//console.log("cols_dtl v",v ) ;
  		if( v.map == 'f_fifo_p_unit' && v.type == 'textbox') {
			v.readonly =  chk_readonly;	
		} 
    })
    */
    
     
	
   
    //alert(f_unit_price );
    if( isNaN(f_unit_price) ) f_unit_price = 0 ; 
    var f_unit_total = f_unit_price;   
    
    row.f_unit_price = f_unit_price;
    row.f_unit_total = f_unit_total;	
       
	    
    	
    //alert(f_unit_price + " " + f_unit_total);   
    //2016-05-27 แก้ตามเอกสาร 20160526
    /*
    if( f_unit_price < 0 ){
   		row.f_unit_price = f_unit_price;
    	row.f_unit_total = f_unit_total;		
	}else{
		row.f_unit_price = 0 ;
    	row.f_unit_total = 0 ;
	}
	*/
    $scope.row_hdr_change(); 
	
  } 
  
  
  //2016-04-22
  /* 
  $scope.row_dtl_change = function(row) {
   	//alert("คำนวนไม่ให้เกิน");
   	
   	var f_quantity = iAPI.tofix(row.f_quantity_org);
   	var f_adj = iAPI.tofix(row.f_adj);
   	if( isNaN(f_adj) ) f_adj = 0 ; 
   	
    var f_total = f_quantity + f_adj;
    
    if( isNaN(f_total) ) f_total = 0 ;
    row.f_total = f_total;
    

    var f_price_p_unit = iAPI.tofix(row.f_price_p_unit);
    if( isNaN(f_price_p_unit) ) f_price_p_unit = 0 ; 
    	
    var f_fifo_p_unit = iAPI.tofix(row.f_fifo_p_unit);
	if( isNaN(f_fifo_p_unit) ) f_fifo_p_unit = 0 ; 
			
   
    var f_unit_price = 0;
    if( f_adj < 0 ){
    	 
    	//ติดลบคูณราคาขาย    	
	    f_unit_price = f_adj * f_price_p_unit;
	    if( isNaN(f_unit_price) ) f_unit_price = 0 ; 
	        			
	}else{
		//บวกเพิ่ม คูณราคาทุน
		f_unit_price = f_adj * f_fifo_p_unit;
	    if( isNaN(f_unit_price) ) f_unit_price = 0 ; 		
    	
	}
	// alert("f_price_p_unit="+f_price_p_unit + " f_fifo_p_unit="+f_fifo_p_unit 
	// 	+ " f_adj="+f_adj + " f_unit_price="+f_unit_price  );  
	 
	 
	//alert(f_unit_price );
	var f_unit_total = f_unit_price;      	
    	
   	row.f_unit_price = f_unit_price;
    row.f_unit_total = f_unit_total;
	
    $scope.row_hdr_change(); 
	
  }  
  */
  
  
  
  $scope.row_hdr_change = function() {
   	 var f_doc_summary = 0 ;
   	 for(var m in $scope.options.rows_dtl) {
   	 	var value = $scope.options.rows_dtl[m];
   	 	f_doc_summary+= iAPI.tofix(value.f_unit_total);
   	 }
		
	 f_doc_summary = iAPI.tofix(f_doc_summary);	
	 
   	 $scope.row.hdr.f_doc_summary = f_doc_summary;
   	 $scope.row.hdr.f_doc_subtotal = f_doc_summary;
   	 $scope.row.hdr.f_doc_total = f_doc_summary;
   	 
   	    	 
  }  

  $scope.delete_msg = function() {
	//$scope.row.hdr.e_status = 'delete';	
	$scope.row.c_name = $scope.row.hdr.c_doc_no ;
	//$scope.options.display = {};
	$scope.options.display.message1 = "ต้องการลบใบปรับยอดเลขที่ : " + $scope.row.hdr.c_doc_no;
	$scope.options.display.confirmTitle = "ยืนยันลบปรับยอด";
  };      
 
  $scope.delete_action = function() {
  	 
	$scope.row.hdr.e_status = 'delete';	
	
	delete $scope.row.hdr.rowBtn;
   	delete $scope.row.hdr.e_status_action;
   	
	var url = 'document.edit_doc';
	iAPI.post(url,$scope.row).success(function(res) {
		//alert(res);
		$scope.theRefashFn();
	});
	 	
		
  }; 
      
  $scope.setDelFn = function(theDelFn) { 
      $scope.theDelFn = theDelFn;
  };
  
  
  $scope.print_action = function() {
  	$scope.opt = {   	
    	report_type: "ia",  
    	id: $scope.row.hdr.id,  	
    }; 
    $scope.doc_print($scope.opt);     
  }; 
    

    
       
  $scope.setRefashFn = function(theRefashFn) {
      $scope.theRefashFn = theRefashFn;
  };  
 
  $scope.add_items = function() {
 
  	
  	$scope.opt = { location_id: $scope.Employee.location_id,
    	id: $scope.Employee.location_id, 
    	parentRow:{},
    	row_group : $scope.MODEL['all_item_group'],
    	display:{
			modal_title:'รายการสินค้า',
		},
    }; 
    var modalInstance = $modal.open({
     templateUrl: 'views/operation/stock.item.location.adjust.html',
      controller: 'Stock.item.location.adjust.Ctrl',
      size: 'lg',
      resolve: {
        options: function () {
          return $scope.opt;
        }
      }
    });
    modalInstance.result.then(function (items) { 
 		//console.log('items',items);
  		//console.log('$scope.options.rows_dtl',$scope.options.rows_dtl);
  		for(var m in items) {
 			var value = items[m];
 			
 			var chk = false;
 			for(var i in $scope.options.rows_dtl){
				var rows_dtl = $scope.options.rows_dtl[i];
				if( rows_dtl.item_id == value.item_id){
					chk = true;
					break;
				}
			}
			if(chk){
				alert("มีการปรับยอดสินค้า " + value.item_c_name + " แล้ว");
				continue;
			}
 			
 			
 			var dtl = angular.copy( $scope.options.rows_dtl_col );
 			for(var i in dtl) {
		 		for(var j in value) {
		 			if( i==j){
						dtl[i]=value[j];
						break;
					}		 				
		 		}
			}
			dtl.f_price = angular.copy( value.f_price );
				
			dtl.f_fifo_p_unit = angular.copy( value.f_fifo_p_unit ); 
			dtl.f_price_p_unit = angular.copy( value.f_price_p_unit ); 
			dtl.f_price_org = angular.copy( value.f_price_p_unit ); 
			
			dtl.f_price_207 = angular.copy( value.f_price_207 );
			dtl.f_price_fifo = angular.copy( value.f_price_fifo );
			 
			
			dtl.f_quantity = angular.copy( value.f_quantity );
			dtl.f_quantity_org = angular.copy( value.f_quantity );
			dtl.f_adj = 0 ;
			dtl.f_total = angular.copy( value.f_quantity );
			dtl.id = $scope.options.rows_dtl.length + 1  ;
			
			dtl.c_add_option_note = "";
			dtl.f_unit_total = 0 ;
			
			dtl.readonly = true;
		 
			
			//console.log('dtl',dtl);
	 		$scope.options.rows_dtl.push(dtl);
 		}
 		$scope.row_hdr_change();
 		//console.log('$scope.options.rows_dtl',$scope.options.rows_dtl);		 
	   	
    });
  }     
	

}]) 


//////////////////////////////////////////////////////////////////////////////////////////////
.controller('Stock.item.location.Ctrl', function ($scope,$modalInstance,$modal,iAPI,options) {
  $scope.rows = null;
  $scope.options = {
    allowOp: 'group1',
    dataAPI: '' ,
    transcludeAtTop: true,
    getAPI: 'stock.stock_counting//'+options.location_id ,
    saveAPI: '',
    cols : [
      {label:'เลือก', map:'chk_add',type:'checkbox', width:40},
      {label: 'ลำดับ', map: 'c_seq', width:60, align:'right',},
      //{label:'H-Code', map:'hcode'},
      {label:'รหัส', map:'item_c_code', width:80, },
      {label:'ชื่อ', map:'item_c_name'},
      {label:'ราคาขาย', map:'f_price', width:80, align:'right'},
      {label:'ราคาทุนต่อหน่วย', map:'f_fifo_p_unit', width:120, align:'right'},      
      {label:'คงเหลือ', map:'f_quantity', width:80, align:'right'},
      {label:'หน่วย', map:'uofm_c_name', width:80, },
      //{label: 'location_uofm_id', map: 'location_uofm_id'},
    ], 
    editBtn : {
		noShow:true,
	},
    display:options.display,
    parentRow:options.parentRow,
    saveAllFn:function(rows){  
			$scope.saveAll(rows);
		 },
	predicate:'c_seq',
	reverse:false,
	group: options.row_group,
    row_group : options.row_group[0],
    filter_group : [
    	{map: 'item_group_id' },
    ],
  }

  $scope.options.display.groupOrderby = " ";
  $scope.options.display.groupLable = "ประเภทสินค้า";
  
  $scope.close = function (items) {  	
    $modalInstance.close([]);
  };
 
  $scope.options.afterGet = function(rows){     

  	angular.forEach(rows, function(v,k) {
  		 v.c_seq = parseFloat(v.c_seq);
    })
    
  }
   
  $scope.saveAll = function(items) {  
   
    if( !angular.isUndefined(items["rows"]) ) items = items["rows"];
    
    //console.log("saveRowAll",items);
         
	var data = [];
	angular.forEach(items, function(value, key) {
	 	if(value.chk_add == "1")
	 	 	this.push(value);	 	
	}, data);
	 
  	//console.log("saveRowAll data",data);
    
    $modalInstance.close(data);   
    
  }  
   
  
  
})

.controller('Stock.item.branch.Ctrl', function ($scope,$modalInstance,$modal,iAPI,options) {
  $scope.rows = null;
  $scope.options = {
    allowOp: 'group1',
    dataAPI: '' ,
    transcludeAtTop: true,
    getAPI: 'stock.stock_counting_branch//'+options.location_id +'//204/'+options.br_location_id,
    saveAPI: '',
    cols : [
      {label:'เลือก', map:'chk_add',type:'checkbox', width:40},
      {label: 'ลำดับ', map: 'c_seq', width:60, align:'right',},
      //{label:'H-Code', map:'hcode'},
      {label:'รหัส', map:'item_c_code', width:80, },
      {label:'ชื่อ', map:'item_c_name'},
      {label:'ราคาขาย', map:'f_price', width:80, align:'right'},
      {label:'คงเหลือ', map:'f_quantity', width:80, align:'right'},
      {label:'หน่วย', map:'uofm_c_name', width:80, },
    ],    
    editBtn : {
		noShow:true,
	},
    display:options.display,
    parentRow:options.parentRow,
    saveAllFn:function(rows){  
			$scope.saveAll(rows);
		 },
	predicate:'c_seq',
	reverse:false,
	group: options.row_group,
    row_group : options.row_group[0],
    filter_group : [
    	{map: 'item_group_id' },
    ],
  }
 
  $scope.options.display.groupOrderby = " ";
  $scope.options.display.groupLable = "ประเภทสินค้า";
  
  $scope.close = function (items) {  	
    $modalInstance.close([]);
  };
 
  $scope.options.afterGet = function(rows){     

  	angular.forEach(rows, function(v,k) {
  		 v.c_seq = parseFloat(v.c_seq);
    })
    
  }
   
  $scope.saveAll = function(items) {  
   
    if( !angular.isUndefined(items["rows"]) ) items = items["rows"];
    
    //console.log("saveRowAll",items);
         
	var data = [];
	angular.forEach(items, function(value, key) {
	 	if(value.chk_add == "1")
	 	 	this.push(value);	 	
	}, data);
	 
  	//console.log("saveRowAll data",data);
    
    $modalInstance.close(data);   
    
  }  
   
  
  
})
 
.controller('Stock.item.location.lastsend.Ctrl', function ($scope,$modalInstance,$modal,iAPI,options) {
  $scope.rows = null;
  $scope.options = {
    allowOp: 'group1',
    dataAPI: '' ,
    transcludeAtTop: true,
    getAPI: 'stock.stock_counting_last_send//'+options.location_id +'//204/'+options.br_location_id,
    //getAPI: 'stock.stock_counting//'+options.location_id ,
    saveAPI: '',
    cols : [
      {label:'เลือก', map:'chk_add',type:'checkbox', width:40},
      {label: 'ลำดับ', map: 'c_seq', width:60, align:'right',},
      //{label:'H-CODE', map:'hcode', width:80, },
      {label:'รหัส', map:'item_c_code', width:80, },
      {label:'ชื่อ', map:'item_c_name'},
      //{label:'ราคาขาย', map:'f_price', width:80, align:'right'},
      {label:'ราคาส่งสาขา', map:'f_price_to_location', width:100, align:'right'},      
      {label:'จน. ส่งครั้งก่อน', map:'f_last_send', width:120, align:'right', },  
      {label:'หน่วย', map:'uofm_name_last_send', width:100, align:'right', },         
      //{label:'ในระบบ', map:'f_quantity_org', width:100, align:'right', },
      //{label:'รอส่ง', map:'f_quantity_do', width:100, align:'right', },
      {label:'คงเหลือ', map:'f_quantity', width:100, align:'right', },
      {label:'หน่วย', map: 'uofm_c_name', width:80, },
      //{label:'จำนวน/แพ็ค', map: 'f_AmountPerPack', width:90, },
    ],      
    editBtn : {
		noShow:true,
	},
    display:options.display,
    parentRow:options.parentRow,
    saveAllFn:function(rows){  
			$scope.saveAll(rows);
		 },
	predicate:'c_seq',
	reverse:false,
	group: options.row_group,
    row_group : options.row_group[0],
    filter_group : [
    	{map: 'item_group_id' },
    ],
  }
  
  
  
  
  $scope.options.display.groupOrderby = " ";
  $scope.options.display.groupLable = "ประเภทสินค้า";
  
  $scope.close = function (items) {  	
    $modalInstance.close([]);
  };
  $scope.options.beforeGet = function(){
  	$scope.spinner = {active : true};
  }
  $scope.options.afterGetMode = function(rows){
    $scope.spinner = {active : false};
  }
  
  $scope.options.afterGet = function(rows){     

  	angular.forEach(rows, function(v,k) {
  		 v.c_seq = parseFloat(v.c_seq);
  		  
  		 //var c_item_info = angular.fromJson(v.c_item_info);         
         //v.f_AmountPerPack = c_item_info.f_AmountPerPack;
        
    })
    
    $scope.spinner = {active : false};
    
  }
   
  $scope.saveAll = function(items) {  
   
    if( !angular.isUndefined(items["rows"]) ) items = items["rows"];
    
    //console.log("saveRowAll",items);
         
	var data = [];
	angular.forEach(items, function(value, key) {
	 	if(value.chk_add == "1")
	 	 	this.push(value);	 	
	}, data);
	 
  	//console.log("saveRowAll data",data);
    
    $modalInstance.close(data);   
    
  }  
   
  
  
})

.controller('Stock.item.branch.cal.Ctrl', function ($scope,$modalInstance,$modal,iAPI,options) {
  $scope.rows = null;
  $scope.options = {
    allowOp: 'group1,ext,noSearch',
    dataAPI: '' ,
    transcludeAtTop: true,
    getAPI: '',
    saveAPI: '',
    cols : [
    
     //{label:'No.', map:'id', width:60 }, 
      {label: 'เลือก', map: 'chk_add',type:'checkbox', width:40,
      	changeFn :  function(row){ $scope.row_dtl_change(row); }, 
      },
      //{label:'H-CODE', map:'hcode', width:80, },
      {label:'รหัส', map:'item_c_code', width:80, },
      {label:'ชื่อ', map:'item_c_name', },
      //{label:'ในระบบ', map:'f_quantity_org', align:'right', width:100, },
      //{label:'รอส่ง', map:'f_quantity_do', align:'right', width:100, },
      {label:'คงเหลือ', map:'f_quantity_org2', align:'right', width:100, },
      {label:'จำนวนแนะนำ', map:'item_cal', width:120, align:'right', },
      
      {label:'จำนวนส่ง', map:'f_quantity' , type:'textbox', size:8, align:'right', width:100,
      	changeFn :  function(row){ $scope.row_dtl_change(row); }, 
      },   
      {label:'หน่วย', map: 'unit_name', width:100,  },
      
      //{label:'หน่วย', map: 'uofm_id',  },   
      //{label:'หน่วย', map:'uofm_id', type:'select', option:'uofm_option', width:80, 
      //	changeFn :  function(row){ $scope.uofm_row_dtl_selete(row); },
      //},      
      //{label:'ราคา', map:'f_price' , type:'textbox', size:8, align:'right', width:80, 
      //	changeFn :  function(row){ $scope.row_dtl_change(row); }, 
      //},
	  //{label:'จำนวนเงิน', map:'f_unit_total' , type:'textbox', size:8, align:'right', width:80, 
      //	changeFn :  function(row){ $scope.row_dtl_change(row); }, 
      //},
            
    ],
    editBtn : {
		noShow:true,
	},
    display:options.display,
    parentRow:options.parentRow,
    saveAllFn:function(rows){  
			$scope.saveAll(rows);
		 },
	predicate:'c_seq',
	reverse:false,
	group: options.row_group,
    row_group : options.row_group[0],
    filter_group : [
    	{map: 'item_group_id' },
    ],
    ext : {
		butTxt:"คำนวน",
		icon:"fa-calculator",
 	
    	row1:{},	
    	label1:"ย้อนหลัง",
		selectItem1:[
			{ c_name:"1 เดือน" , c_value:"-1"},
			{ c_name:"2 เดือน" , c_value:"-2"},
			{ c_name:"3 เดือน" , c_value:"-3"},
			{ c_name:"4 เดือน" , c_value:"-4"},
			{ c_name:"5 เดือน" , c_value:"-5"},
			{ c_name:"6 เดือน" , c_value:"-6"},
		],	
		
		row2:{},	
		label2:"การใช้",
		/*
		selectItem2:[
			{ c_name:"1 เดือน" , c_value:"1"},
			{ c_name:"1.5 เดือน" , c_value:"1.5"},
			{ c_name:"2 เดือน" , c_value:"2"},
			{ c_name:"2.5 เดือน" , c_value:"2.5"},
			{ c_name:"3 เดือน" , c_value:"3"}, 
		],		
		*/
			
	},
	 
  }
  $scope.options.ext.row1 = $scope.options.ext.selectItem1[2];
  //$scope.options.ext.row2 = $scope.options.ext.selectItem2[0];
  
  $scope.options.ext.fn = function () {
  	
  	$scope.spinner = {active : true};
  	
  	$scope.options.ext.row2.c_value = 1;
  	
	$scope.options.getAPI = 'stock.stock_counting_branch_cal//'+options.location_id +'//204/'+options.br_location_id+'//'+$scope.options.ext.row2.c_value;
 
	//alert($scope.options.ext.row1.c_value);
	
	var dEnd = iAPI.AddDay((new Date()),0);
	var dStart = iAPI.AddMonth((new Date()),$scope.options.ext.row1.c_value);
	$scope.options.getAPI += '/'+dStart+'/'+dEnd+'/'+ Math.abs($scope.options.ext.row1.c_value);
	
	//alert($scope.options.getAPI);
	console.log("cal stock",$scope.options.getAPI);
	
	$scope.theRefashFn();	  	
  }  
  
  $scope.options.afterGetMode = function(rows){
    $scope.spinner = {active : false};
  }
  
  
  $scope.setRefashFn = function(theRefashFn) {
      $scope.theRefashFn = theRefashFn;
  }; 
  
  $scope.options.display.groupOrderby = " ";
  $scope.options.display.groupLable = "ประเภทสินค้า";
  
  $scope.close = function (items) {  	
    $modalInstance.close([]);
  };
 
  $scope.options.afterGet = function(rows){     

  	angular.forEach(rows, function(v,k) {
  		
  		v.c_seq = parseFloat(v.c_seq);
    })
    
  }
   
  $scope.saveAll = function(items) {  
   
    if( !angular.isUndefined(items["rows"]) ) items = items["rows"];
    
    //console.log("saveRowAll",items);
         
	var data = [];
	angular.forEach(items, function(value, key) {
	 	if(value.chk_add == "1")
	 	 	this.push(value);	 	
	}, data);
	 
  	//console.log("saveRowAll data",data);
    
    $modalInstance.close(data);   
    
  }  
   
  
  
})

.controller('Stock.item.location.adjust.Ctrl', function ($scope,$modalInstance,$modal,iAPI,options) {
  $scope.rows = null;
  $scope.options = {
    allowOp: 'group1',
    dataAPI: '' ,
    transcludeAtTop: true,
    //getAPI: 'stock.stock_adjust_lot_frist//'+options.location_id+'//201' ,     
    getAPI: 'stock.stock_adjust_fifo//'+options.location_id+'//201' ,   
    saveAPI: '',
    cols : [
      {label:'เลือก', map:'chk_add',type:'checkbox', width:40},
      {label: 'ลำดับ', map: 'c_seq', width:60, align:'right',},
      //{label:'H-Code', map:'hcode'},
      {label:'รหัส', map:'item_c_code', width:80, },
      {label:'ชื่อ', map:'item_c_name'},
      //{label:'ราคาขาย', map:'f_price', width:80, align:'right'},
      {label:'ราคาขาย', map:'f_price_p_unit', width:80, align:'right'},      
      {label:'ราคาทุนต่อหน่วย', map:'f_fifo_p_unit', width:120, align:'right'}, 
      {label:'ราคาต้นทุนมาตรฐาน', map:'f_price_207', width:120, align:'right'},     
      {label:'คงเหลือ', map:'f_quantity', width:80, align:'right'},
      {label:'หน่วย', map:'uofm_c_name', width:80, },
      //{label: 'location_uofm_id', map: 'location_uofm_id'},
    ], 
    editBtn : {
		noShow:true,
	},
    display:options.display,
    parentRow:options.parentRow,
    saveAllFn:function(rows){  
			$scope.saveAll(rows);
		 },
	predicate:'c_seq',
	reverse:false,
	group: options.row_group,
    row_group : options.row_group[0],
    filter_group : [
    	{map: 'item_group_id' },
    ],
  }

  $scope.options.display.groupOrderby = " ";
  $scope.options.display.groupLable = "ประเภทสินค้า";
  
  $scope.close = function (items) {  	
    $modalInstance.close([]);
  };
 
  $scope.options.afterGet = function(rows){     

  	angular.forEach(rows, function(v,k) {
  		 v.c_seq = parseFloat(v.c_seq);
    })
    
  }
   
  $scope.saveAll = function(items) {  
   
    if( !angular.isUndefined(items["rows"]) ) items = items["rows"];
    
    //console.log("saveRowAll",items);
         
	var data = [];
	angular.forEach(items, function(value, key) {
	 	if(value.chk_add == "1")
	 	 	this.push(value);	 	
	}, data);
	 
  	//console.log("saveRowAll data",data);
    
    $modalInstance.close(data);   
    
  }  
   
  
  
}) 

////////////////////////////////////////////////////////////////////////////////////////////// 
.controller('DoCtrl', ['$scope', 'iAPI', '$modal', '$filter', '$q', '$window', '$location', function ($scope,iAPI,$modal,$filter,$q,$window,$location) {

  var ConfPageTitle = { pageTitle_org : 'รายการส่งของให้สาขา',
  	pageTitle_add_edit : ' ',
  	pageCaption_org : '',
  	pageTitle_edit : 'รายละเอียด',
    pageTitle_table : '',
  };
  iAPI.setConfPageTitle(ConfPageTitle);

  $scope.content_height=$window.innerHeight - $scope.innerHeight ;
  
  $scope.options = {
    allowOp: 'view,add,edit,group1,month',
    dataAPI: '',
    getAPI: 'document.get_doc_web/'+'/DO'+'/active/create/d_start/d_end',
    //getAPI: 'document.get_doc_web/'+'/DO'+'/active/create/',
    saveAPI: 'document.save_doc',
    updateAPI: 'document.edit_doc',
    cols : [
      {label: 'No.', map: 'id', width:60, format:'index', },
      {label: 'วันที่สร้าง', map: 'd_date' },
      {label: 'กำหนดส่ง', map: 'd_date_send' },
      {label: 'เลขที่เอกสาร.', map: 'c_doc_no' },
      {label: 'สั่งจาก', map: 'c_from_name' },  
      {label: 'ส่งที่', map: 'c_to_name' }, 
      //{label: 'เอกสารอ้างอิง', map: 'c_refer_c_doc_no' , hide:true }, 
      {label: 'เอกสารอ้างอิง', map: 'c_refer_group_c_doc_no' , hide:true }, 
      
    ], 
    itemPerPage:$scope.itemPerPage,
    predicate:'c_doc_no', 
    reverse:true,
    addFnForm:function(row){  
			$scope.addItems(row);
		 },
	filter_group : [
    	{map: 'e_status_action' , map2: 'e_status_action2' },
    ],
	group : [
    	{ e_status_action : "active_create" , c_desc : "ยังไม่อนุมัติ" },
    	{ e_status_action : "active_confirm" , c_desc : "อนุมัติแล้ว" },
    	{ e_status_action : "active_complete" , e_status_action2 : "active_missing" , c_desc : "สาขารับแล้ว" },
    	//{ e_status_action : "active_missing" ,  c_desc : "สาขารับแล้ว2" },
    	{ e_status_action : "delete" , c_desc : "ยกเลิก" },
    ],
    display : {
		groupLable : "สถานะ",
		groupOrderby : " ",
	}, 
	editBtn : {
		noShow:true,
	},
	viewBtn : {
		show:false,
	},
	rowBtn : {
		show:true,
	},
  }

  $scope.options.row_group = $scope.options.group[0];
    
  $scope.options.location_branch = [];
  
  $scope.options.chgMode = function() {
  	$scope.options.allowOp = 'view,add,edit,group1,month';
  }
  
  
  //add options
  $scope.options.doc_type = "DO"; 
  $scope.options.rows_dtl =[];
  $scope.options.rows_dtl_col ={id:'',item_id:'',item_c_code:'',item_c_name:'',uofm_id:'',uofm_c_name:'',
  	f_quantity:1,f_price:0,f_unit_price:0,f_discount_pct:0,f_discount:0,f_unit_total:0,
  	location_uofm_id:0, hcode:0,
  };
  
    
  $scope.options.cols_dtl1 = [
      {label:'No.', map:'id', width:60, format:'index', }, 
      //{label:'H-CODE', map:'hcode', width:80,  },
      {label:'รหัส', map:'item_c_code', width:80,  },
      {label:'ชื่อ', map:'item_c_name', },
      {label:'จำนวนที่เบิกได้', map:'f_quantity_org', align:'right', width:120, },
      {label:'หน่วย', map:'uofm_c_name_org', width:70, },
      
      {label:'จำนวน', map:'f_quantity', type:'textbox', size:8, align:'right', width:80, 
      	changeFn :  function(row){ $scope.row_dtl_change(row); },   
      }, 
      //{label:'หน่วย', map: 'uofm_c_name', width:80,   },
      //{label:'ตัวคูณ', map: 'uofm_f_factor', width:60,   },
      
      {label:'หน่วย', map:'uofm_id', type:'select', option:'uofm_option', width:80, readonly:true,
      	changeFn :  function(row){ $scope.uofm_row_dtl_selete(row); },
      },
      {label:'จำนวน/แพ็ค', map:'f_AmountPerPack', width:88, align:'right', },
      
      //{label:'ราคาส่งสาขา', map:'f_price_to_location' , type:'textbox', size:8, align:'right', width:80, 
      //	changeFn :  function(row){ $scope.uofm_row_dtl_selete(row); }, 
      //},
      
      {label:'ราคา', map:'f_price' , type:'textbox', size:8, align:'right', width:80, readonly:true,
      	changeFn :  function(row){ $scope.row_dtl_change(row); }, 
      },
      {label:'จำนวนเงิน', map:'f_unit_total' , type:'textbox', size:8, align:'right', width:80, readonly:true,
      	changeFn :  function(row){ $scope.row_dtl_change(row); }, 
      },
    ]

  $scope.options.cols_dtl2 = [
      {label:'No.', map:'id', width:60, format:'index', }, 
      //{label:'H-CODE', map:'hcode', width:80,  },
      {label:'รหัส', map:'item_c_code', width:80,  },
      {label:'ชื่อ', map:'item_c_name', }, 
      {label:'จำนวน', map:'f_quantity', align:'right', width:120, },
      {label:'หน่วย', map:'uofm_c_name_show', align:'right', width:120, },
      {label:'จำนวน/แพ็ค', map:'f_AmountPerPack', width:90, align:'right', },
      {label:'ราคา', map:'f_price', align:'right', width:120, },
      {label:'จำนวนเงิน', map:'f_unit_total', align:'right', width:120, },
      
    ]
    
    
  $scope.options.cols_buttons1 = [
      {label:'', btn:'btn-danger', icon : 'ion ion-close', type:'button', width:20,
       	fn:function(idx,row){ 
			 $scope.row_del(idx,row);
		   },
	  },  
    ];
    
  $scope.options.afterGet = function(rows){
     

  	angular.forEach(rows, function(v,k) {
  		if(v.e_status_action=='active_create'){
	        v.rowBtn = {
	          icon:'fa-pencil',  
	        };	 
		}else if(v.e_status_action=='active_confirm'){
	        v.rowBtn = {
	  	 	  icon:'fa-search',  
	        };		 
	    }else if(v.e_status_action=='active_missing'){
	        v.rowBtn = {
	  	 	  icon:'fa-search',  
	        };	
		}else if(v.e_status_action=='active_complete'){
	        v.rowBtn = {
	  	 	  icon:'fa-search',  
	        };		 
		}else if(v.e_status_action=='delete'){
	        v.rowBtn = {
	  	 	  icon:'fa-search',  
	        };	 	
  		} 
  		
  		//if( v.c_doc_no == v.c_refer_c_doc_no )
		//	v.hide = true;
			
    })
    //alert("afterGet");
  	//console.log("afterGet",rows);
  }
  
  $scope.options.afterGetMode = function(rows){
  	var searchObject = $location.search();
  	//alert(searchObject);
  	//console.log("searchObject",searchObject);
  	if( !angular.isUndefined(searchObject.id) ){		
  		for(var i in rows){
  			//console.log("afterGet",rows[i].id + " "+searchObject.id);
			if( rows[i].id==searchObject.id){
				//alert(searchObject.id + " "+i);				
				$scope.theUpdFn(-2,rows[i]);
				break;
			}
		}				
	}
  }
  
  
  $scope.addItems = function(row) { 
   
   $scope.options.disabled = false;
   $scope.options.disabledNote=false;
   
   $scope.options.cols_dtl = angular.copy($scope.options.cols_dtl1);   
   $scope.options.cols_buttons = angular.copy($scope.options.cols_buttons1); 

   
   $scope.row={};
   $scope.row.hdr={};
   $scope.row.hdr.f_doc_summary = 0 ;
   $scope.row.hdr.f_doc_subtotal = 0 ;
   $scope.row.hdr.f_doc_total = 0 ;
   $scope.row.hdr.c_note="";
 
   $scope.row.hdr.i_from = $scope.Employee.location_id;
   $scope.row.hdr.c_from_name = $scope.Employee.c_location_code;
   
   $scope.options.location = $scope.MODEL.location_branch[0];
   $scope.change_location();
   
   $scope.row.hdr.d_date = new Date();
   $scope.row.hdr.d_date_send = new Date();
     
 	
   $scope.row.hdr.doc_type = $scope.options.doc_type;
   $scope.row.hdr.get_last_no = "RL"+$scope.getYearTH+$scope.getMonth;
   $scope.row.hdr.get_last_no_size = 4;  	  
   	     
   $scope.options.rows_dtl =[];       
  
   
   var parameter = { c_code: $scope.row.hdr.get_last_no , size: $scope.row.hdr.get_last_no_size , update : false };  
   iAPI.post('document.get_last_no',parameter).success(function(data) {
   	    console.log("document.get_last_no",data) ;
   		data = angular.fromJson(data);
   		$scope.row.hdr.c_doc_no = data.doc_no ; ;  
   })
   
   console.log("$scope.row",$scope.row);

   //console.log($scope.row);
 	//$scope.row.hdr.c_doc_no = "xxx";
  }  
  
  $scope.options.beforeUpdRow = function(row) { 

 
  	if(row.e_status_action=='active_confirm' 
  		|| row.e_status_action=='delete'
  		|| row.e_status_action=='active_complete' 
  		|| row.e_status_action=='active_missing' 
  		){
  		$scope.options.allowOp = 'view'; 
  		$scope.options.disabled = true;
  		$scope.options.disabledNote=true;
  		
  		$scope.options.cols_dtl = angular.copy($scope.options.cols_dtl2);
  		$scope.options.cols_buttons = []; 
  	}else{
  		$scope.options.cols_dtl = angular.copy($scope.options.cols_dtl1);
		$scope.options.cols_buttons = angular.copy($scope.options.cols_buttons1); 
	}
  	
  	//console.log("beforeUpdRow11",row);
  	  
   	var row_tmp = angular.copy(row);
  	var row_dtl = angular.copy(row_tmp.dtls);

  	
  	delete row_tmp.dtls;
  	$scope.row = {};
  	$scope.row.hdr = row_tmp;  	
  	
  	var c_hdr_info = angular.fromJson($scope.row.hdr.c_hdr_info);
  	delete $scope.row.hdr.c_hdr_info;
  	
  	angular.forEach(c_hdr_info, function(value, key) {
		this[key] = value ;	 	
	}, $scope.row.hdr);
  	
  		
 
  	for(var key in $scope.MODEL.location_branch){
		if( $scope.MODEL.location_branch[key].id == $scope.row.hdr.i_to){
			$scope.options.location = $scope.MODEL.location_branch[key];
			break;
		}		
	}   
   if( !angular.isUndefined($scope.row.hdr.e_create_by) ){ 
   		/*
   		if($scope.row.hdr.e_create_by=="PO"){
			$scope.options.disabled = true;
			$scope.options.allowOp = 'view';
		}
		*/
   }else{
   		$scope.row.hdr.e_create_by = "";
   }
		   
   for(var i in row_dtl){
		var c_dtl_info = angular.fromJson(row_dtl[i].c_dtl_info);
		delete row_dtl[i].c_dtl_info;
		angular.forEach(c_dtl_info, function(value, key) {
			this[key] = value ;	 	
		}, row_dtl[i]);
		
		//ส่งให้สาขา
		//"i_add_branch":"1","c_send_to_branch_tel":"กกกกกก","i_send_to_branch":"136","c_add_option_note":"2222"
		if( !angular.isUndefined(row_dtl[i].i_add_branch) ){
			for(var key in $scope.MODEL.location_branch){
				if( $scope.MODEL.location_branch[key].id == row_dtl[i].i_send_to_branch){
					$scope.options.location_branch[i] = $scope.MODEL.location_branch[key];
					break;
				}		
			}
		} 
		//if(row.e_status_action=='active_confirm' || row.e_status_action=='delete'){
		//if($scope.row.hdr.e_create_by=="PO"){
		//	row_dtl[i].disabled = true;	
		//	row_dtl[i].option_disabled = true;	
		//}
		//console.log(row.e_status_action);
		
		if(row.e_status_action=='active_confirm' 
			|| row.e_status_action=='delete'
			|| row.e_status_action=='active_complete'
			|| row.e_status_action=='active_missing'
			) {
			row_dtl[i].disabled = true;	
			row_dtl[i].option_disabled = true;	
			
			console.log(row_dtl[i].uofm_c_name);
			
			row_dtl[i].uofm_c_name_show = row_dtl[i].uofm_c_name;
			if( parseFloat(row_dtl[i].uofm_f_factor) !='1'){
				if( !angular.isUndefined(row_dtl[i].uofm_c_name_org) )
					row_dtl[i].uofm_c_name_show += "("+parseFloat(row_dtl[i].uofm_f_factor)+row_dtl[i].uofm_c_name_org+")";
				else if( !angular.isUndefined(row_dtl[i].c_receive_uofm_name) )
					row_dtl[i].uofm_c_name_show += "("+parseFloat(row_dtl[i].uofm_f_factor)+row_dtl[i].c_receive_uofm_name+")";
				else 
					row_dtl[i].uofm_c_name_show += "("+parseFloat(row_dtl[i].uofm_f_factor)+")";
			}
		
		}else{
			var uofm_id = row_dtl[i].uofm_id;
			$scope.create_uofm(uofm_id);
			row_dtl[i].uofm_option = angular.copy($scope.confUofm.receive_uofm);  			
		}
		
		
				
   } 
   
   
   $scope.options.rows_dtl = row_dtl;  
	
   if( !angular.isUndefined($scope.row.hdr.id) ){ 
  		$scope.row.id = $scope.row.hdr.id;
  		  		
  		if( $scope.row.hdr.e_status == "active" )
  			$scope.row.hdr.e_status = 'edit';
  	}
  	
   if(row.e_status_action=='active_create'){

	   iAPI.post('stock.stock_counting_doc/'+$scope.row.hdr.id,{}).success(function(data) {
	   	    //console.log("document.stock_counting_doc",data) ;
	   	    for(var i in data){
				for(var j in $scope.options.rows_dtl){
					if( data[i].item_id == $scope.options.rows_dtl[j].item_id ){
						$scope.options.rows_dtl[j].f_quantity_org = data[i].f_quantity ;
						break;
					}
				}
			}
	   		   
	   })    	
   	
   }	
 	
  	
  	console.log("beforeUpdRow hdr ",$scope.row);
  	console.log("beforeUpdRow dtl",$scope.options.rows_dtl);
  	
  }
  
  $scope.options.beforePost = function(row) {  	
 
    for(var i in $scope.options.rows_dtl){
    	
    	var irow = $scope.options.rows_dtl[i];
    	
	  	//คำนวนรายการด้วย
	  	var f_quantity_org = iAPI.tofix(irow.f_quantity_org);
	   	var f_quantity = iAPI.tofix(irow.f_quantity) ;
	   	var uofm_f_factor = iAPI.tofix(irow.uofm_f_factor) ;
	    
	   	if( ( f_quantity * uofm_f_factor )  > f_quantity_org ){
	   		var msg = irow.item_c_name + "จำนวน " + f_quantity + " " + irow.uofm_c_name ;
	   		if( uofm_f_factor != 1)
	   			msg += " ("+ f_quantity * uofm_f_factor + irow.uofm_c_name_org +")"
			 msg += "ไม่พอที่เบิก";
			 msg += "\r\n จำนวนที่เหลือ " + irow.f_quantity_org + irow.uofm_c_name_org ;
			 alert(msg);
			 
	   	    return false		
		}
	}
  	
  	
  	
 	delete row.hdr.hide;
 	delete row.hdr.rowBtn;
   	delete row.hdr.e_status_action;
   	  
    for(var i in $scope.options.rows_dtl){
 		delete $scope.options.rows_dtl[i].disabled;
 		delete $scope.options.rows_dtl[i].option_disabled; 		
 		delete $scope.options.rows_dtl[i].rowBtn;
 		delete $scope.options.rows_dtl[i].hide;
    }      	  
   	row.dtl = $scope.options.rows_dtl;
   	
   	
  	return true ;
  }

  $scope.uofm_row_dtl_selete = function(row) {  
    
 		
  	for(var i in row.uofm_option ){
		if( row.uofm_option[i].id == row.uofm_id ){
			row.uofm_c_name = row.uofm_option[i].c_desc ;
			row.uofm_f_factor = row.uofm_option[i].f_factor;  
			row.PerUnit = row.uofm_option[i].f_factor;  
			row.f_price = row.PerUnit * row.f_price_to_location;
			
			$scope.row_dtl_change(row);
			
			break;
		}
	}
	//alert(row.uofm_c_name);
  	console.log(row);	
  }
  $scope.options.afterPost = function(row){
  	//if( row.c_doc_no == row.c_refer_c_doc_no )
	//	row.hide = true;
			
  }
     
  $scope.row_dtl_change = function(row) {
   	
   	var irow = angular.copy(row);
   	
   	//คำนวนรายการด้วย
   	var f_quantity_org = iAPI.tofix(irow.f_quantity_org);
   	var f_quantity = iAPI.tofix(irow.f_quantity) ;
   	var uofm_f_factor = iAPI.tofix(irow.uofm_f_factor) ;
    
   	if( ( f_quantity * uofm_f_factor )  > f_quantity_org ){
   		var msg = irow.item_c_name + "จำนวน " + f_quantity + " " + irow.uofm_c_name ;
   		if( uofm_f_factor != 1)
   			msg += " ("+ f_quantity * uofm_f_factor + irow.uofm_c_name_org +")"
		 msg += "ไม่พอที่เบิก";
		 msg += "\r\n จำนวนที่เหลือ " + irow.f_quantity_org + irow.uofm_c_name_org ;
		 alert(msg);
		 
   	    row.f_quantity = 1 ;		
	}
   	  	
   	row.f_unit_price = (iAPI.tofix(row.f_quantity)*iAPI.tofix(row.f_price));
   	row.f_unit_total = iAPI.tofix(row.f_unit_price) ;
   	
   	row.BuyPrice = iAPI.tofix(row.f_price);
   	
   	$scope.row_hdr_change();
  }   
 
  $scope.row_hdr_change = function() {
   	 
   	 var f_doc_summary = 0 ;
   	 for(var m in $scope.options.rows_dtl) {
   	 	var value = $scope.options.rows_dtl[m];
   	 	f_doc_summary+= iAPI.tofix(value.f_unit_total);
   	 }
   	 
   	 $scope.row.hdr.f_doc_summary = f_doc_summary;
   	 $scope.row.hdr.f_doc_subtotal = f_doc_summary;;
   	 $scope.row.hdr.f_doc_total = f_doc_summary; 
	 $scope.row.hdr.f_doc_total_text = iAPI.MoneyToWord($scope.row.hdr.f_doc_total);
   	 
   	 //alert($scope.row.hdr.f_doc_total);
  }  
  
  $scope.change_location = function() {
  	if( $scope.options.location.c_setting != "" ){
	  	var c_setting = angular.fromJson($scope.options.location.c_setting);
	  	$scope.row.hdr.c_to_address = c_setting.c_address ;
  	}
  	$scope.row.hdr.i_to = $scope.options.location.id; 
  	$scope.row.hdr.c_to_name = $scope.options.location.c_name; 
  }   
  $scope.change_branch = function(idx) {
  	if($scope.options.rows_dtl[idx].i_add_branch == "1"){
  		if( angular.isUndefined($scope.options.location_branch[idx]) ){ 
  			$scope.options.location_branch[idx] = $scope.MODEL.location_branch[0];
  		}
	  	//alert(idx);
	  	//console.log("change_branch",$scope.options.location_branch);
	  	if( $scope.options.location_branch[idx].c_setting != "" ){
		  	var c_setting = angular.fromJson($scope.options.location_branch[idx].c_setting); 
		  	$scope.options.rows_dtl[idx].c_send_to_branch_tel = c_setting.c_tel ;
	  	}
	  	$scope.options.rows_dtl[idx].i_send_to_branch = $scope.options.location_branch[idx].id ; 

	  	//console.log("$scope.options.rows_dtl",	$scope.options.rows_dtl );		
	}else{
		delete $scope.options.rows_dtl[idx].c_send_to_branch_tel;
		delete $scope.options.rows_dtl[idx].i_send_to_branch;
	}

  	
  }  
     
  $scope.row_del = function(idx,row) { 
  
    //ใช้ row ไปหา indexOf ห้ามใช้ idx เด็ดขาด
	var indexOfRow = $scope.options.rows_dtl.indexOf(row);
	//alert("idx="+idx +" indexOfRow="+indexOfRow);	
	if(indexOfRow < 0 )indexOfRow = idx;
  	$scope.options.rows_dtl.splice(indexOfRow, 1);
  	//$scope.options.rows_dtl.splice(idx, 1);

  	$scope.row_hdr_change();
  }

  $scope.delete_msg = function() {
	//$scope.row.hdr.e_status = 'delete';	
	$scope.row.c_name = $scope.row.hdr.c_doc_no ;
	//$scope.options.display = {};
	$scope.options.display.message1 = "ต้องการลบใบส่งของเลขที่ : " + $scope.row.hdr.c_doc_no;
	$scope.options.display.confirmTitle = "ยืนยันลบใบส่งของ";
  };      
 
  $scope.delete_action = function() {
	$scope.row.hdr.e_status = 'delete';	
	
	delete $scope.row.hdr.rowBtn;
   	delete $scope.row.hdr.e_status_action;
	
	url = 'document.edit_doc';
	iAPI.post(url,$scope.row).success(function(res) {
		$scope.theRefashFn();
	});	
		
  }; 
       

  
      
  $scope.print_action = function() {
	//$scope.printDiv('DO-print', 'full-table-content');
	$scope.opt = {
    	report_type: "do", 
    	id: $scope.row.hdr.id, 
    }; 
    $scope.doc_print($scope.opt);    
  };   
  
  $scope.approve_action = function() {

 
	//$scope.row.hdr.e_action = 'confirm';	
	var	data = {};
	data.hdr = {};	
	
	data.hdr.id = $scope.row.hdr.id;  	
	data.hdr.c_doc_no = $scope.row.hdr.c_doc_no;
	data.hdr.doc_type = $scope.options.doc_type;	  
	data.hdr.e_action = "confirm";

	url = 'document.update_action_doc';
	iAPI.post(url,data).success(function(res) {

		/*
		//ถ้าเป็นใบส่งของ จาก sup ไม่ให้ตัด stock
		if($scope.row.hdr.e_create_by!="PO"){			
			//update stock
			url = 'document.insert_stock_card';
			data = {};
			data.id = $scope.row.hdr.id;
			iAPI.post(url,data).success(function(res) {
				//
				alert("ตัด stock");
			}); 				
		}
		*/
				
		$scope.theRefashFn();
	});			
 	 		    	 
  }; 
  
  
  $scope.setUpdFn = function(theUpdFn) {
      $scope.theUpdFn = theUpdFn;
  };   
  $scope.setRefashFn = function(theRefashFn) {
      $scope.theRefashFn = theRefashFn;
  };    
  $scope.setSaveFn = function(theSaveFn) { 
      $scope.theSaveFn = theSaveFn;
  };       
  $scope.setDelFn = function(theDelFn) { 
      $scope.theDelFn = theDelFn;
  };
 
  $scope.add_items = function() {
 
  	//console.log("all_item_group",$scope.MODEL['all_item_group']);
  	
  	
  	$scope.opt = { location_id: $scope.Employee.location_id,
    	id: $scope.Employee.location_id, 
    	br_location_id: $scope.options.location.id,
    	parentRow:{},
    	row_group : $scope.MODEL['all_item_group'],
    	display:{
			modal_title:'รายการสินค้าที่ '+$scope.Employee.c_location_code,
		},
    }; 
    var modalInstance = $modal.open({
      templateUrl: 'views/operation/stock.item.location.lastsend.html',
      controller: 'Stock.item.location.lastsend.Ctrl',
      size: 'lg',
      resolve: {
        options: function () {
          return $scope.opt;
        }
      }
    });
    modalInstance.result.then(function (items) { 
 		//console.log('items',items);
  		//console.log('$scope.options.rows_dtl',$scope.options.rows_dtl);
  		for(var m in items) {
 			var value = items[m];
 			var dtl = angular.copy( $scope.options.rows_dtl_col );
 			for(var i in dtl) {
		 		for(var j in value) {
		 			if( i==j){
						dtl[i]=value[j];
						break;
					}		 				
		 		}
			}
			
			//alert(dtl.location_uofm_id);
 
			dtl.uofm_f_factor = 1;			 
			
			dtl.c_location_uofm_name = value.unit_name;
			dtl.c_location_f_factor = dtl.uofm_f_factor;			
			
			dtl.uofm_option = [];
				 		
			if( !angular.isUndefined(value.c_item_info) ){
				var c_item_info = angular.fromJson(value.c_item_info);

				if(!angular.isUndefined(c_item_info.c_uofm_f_factor))
					dtl.uofm_f_factor	= angular.copy(c_item_info.c_uofm_f_factor); 
				
				if(!angular.isUndefined(c_item_info.c_location_uofm_name))
					dtl.c_location_uofm_name	= angular.copy(c_item_info.c_location_uofm_name); 
					
				if(!angular.isUndefined(c_item_info.c_location_f_factor))
					dtl.c_location_f_factor	= angular.copy(c_item_info.c_location_f_factor); 
				
				if(!angular.isUndefined(c_item_info.f_AmountPerPack))
					dtl.f_AmountPerPack	= angular.copy(c_item_info.f_AmountPerPack);	
					
						
					
			}		
			
			$scope.create_uofm(dtl.location_uofm_id);
  			dtl.uofm_option = angular.copy($scope.confUofm.receive_uofm);
  									
			for(var i in dtl.uofm_option){				
				if( dtl.location_uofm_id == dtl.uofm_option[i].id ){					 
					dtl.uofm_id = dtl.uofm_option[i].id ;
					dtl.uofm_c_name = dtl.uofm_option[i].c_desc;
					dtl.uofm_f_factor = dtl.uofm_option[i].f_factor;
					dtl.PerUnit = dtl.uofm_option[i].f_factor;
					break;	
				}
				
			}
					
			dtl.f_price_to_location = value.f_price_to_location;
			dtl.f_price = angular.copy( value.f_price_to_location )  * angular.copy( dtl.PerUnit );
			dtl.BuyPrice = angular.copy( dtl.f_price );			
			
			dtl.ProdName = value.item_c_name;
			dtl.BarCode = value.item_c_code;
			
				 
			dtl.f_quantity_org = angular.copy( value.f_quantity );
			dtl.uofm_c_name_org = angular.copy( value.unit_name );
			//dtl.f_quantity_uofm_c_name_org = dtl.f_quantity_org +" "+dtl.uofm_c_name_org;
			
			//dtl.f_quantity = 1 ; 
			var f_quantity = parseFloat( angular.copy(value.f_last_send) );
			if( f_quantity == 0 ) dtl.f_quantity = 1 ;
			else if( dtl.f_quantity_org < f_quantity ) dtl.f_quantity = dtl.f_quantity_org;
			else dtl.f_quantity = f_quantity;
			
			dtl.f_unit_price = (iAPI.tofix(dtl.f_quantity)*iAPI.tofix(dtl.f_price));
   			dtl.f_unit_total = dtl.f_unit_price ;   	
			dtl.id = $scope.options.rows_dtl.length + 1  ;
			//console.log('dtl',dtl);
			
			if( dtl.f_quantity_org <= 0 ){
				alert(value.item_c_name + " ไม่พอที่เบิก \r\n จำนวนที่เหลือ " + dtl.f_quantity_org + " " + dtl.uofm_c_name_org );
				continue;
			}
	 		$scope.options.rows_dtl.push(dtl);
 		}
 		$scope.row_hdr_change();
 		//console.log('$scope.options.rows_dtl',$scope.options.rows_dtl);		 
	   	
    });
  }  
  
  $scope.add_history = function() {
 
    var row_group =[];
    for(var i in $scope.MODEL['item_group']){
		if($scope.MODEL['item_group'][i].c_cal_stock == "1")
			row_group.push($scope.MODEL['item_group'][i]);
	}

  	$scope.opt = { location_id: $scope.Employee.location_id,
    	id: $scope.Employee.location_id, 
    	br_location_id: $scope.options.location.id,
    	parentRow:{},
    	//row_group : $scope.MODEL['all_item_group'],
    	row_group : row_group,
    	display:{
			modal_title:'ประวัติการใช้ยา/สินค้าของ '+$scope.options.location.c_name,
		},
    }; 
    var modalInstance = $modal.open({
      templateUrl: 'views/operation/stock.item.branch.cal.html',
      controller: 'Stock.item.branch.cal.Ctrl',    	
      //templateUrl: 'views/operation/do.advice.html',
      //controller: 'Do.advice.Ctrl',
      size: 'lg',
      resolve: {
        options: function () {
          return $scope.opt;
        }
      }
    });
    modalInstance.result.then(function (items) { 
 		//console.log('items',items);
  		//console.log('$scope.options.rows_dtl',$scope.options.rows_dtl);
  		for(var m in items) {
 			var value = items[m];
 			var dtl = angular.copy( $scope.options.rows_dtl_col );
 			for(var i in dtl) {
		 		for(var j in value) {
		 			if( i==j){
						dtl[i]=value[j];
						break;
					}		 				
		 		}
			}
			
			//alert(dtl.location_uofm_id);
 			
 			dtl.location_uofm_id = value.uofm_id;
 			
			dtl.uofm_f_factor = 1;			 
			
			dtl.c_location_uofm_name = value.unit_name;
			dtl.c_location_f_factor = dtl.uofm_f_factor;			
			
			dtl.uofm_option = [];
				 		
			if( !angular.isUndefined(value.c_item_info) ){
				var c_item_info = angular.fromJson(value.c_item_info);

				if(!angular.isUndefined(c_item_info.c_uofm_f_factor))
					dtl.uofm_f_factor	= angular.copy(c_item_info.c_uofm_f_factor); 
				
				if(!angular.isUndefined(c_item_info.c_location_uofm_name))
					dtl.c_location_uofm_name	= angular.copy(c_item_info.c_location_uofm_name); 
					
				if(!angular.isUndefined(c_item_info.c_location_f_factor))
					dtl.c_location_f_factor	= angular.copy(c_item_info.c_location_f_factor); 
					
				if(!angular.isUndefined(c_item_info.f_AmountPerPack))
					dtl.f_AmountPerPack	= angular.copy(c_item_info.f_AmountPerPack);	
					
			}		
			
			$scope.create_uofm(dtl.location_uofm_id);
  			dtl.uofm_option = angular.copy($scope.confUofm.receive_uofm);
  									
			for(var i in dtl.uofm_option){				
				if( dtl.location_uofm_id == dtl.uofm_option[i].id ){					 
					dtl.uofm_id = dtl.uofm_option[i].id ;
					dtl.uofm_c_name = dtl.uofm_option[i].c_desc;
					dtl.uofm_f_factor = dtl.uofm_option[i].f_factor;
					dtl.PerUnit = dtl.uofm_option[i].f_factor;
					break;	
				}
				
			}
					
			
			dtl.ProdName = value.item_c_name;
			dtl.BarCode = value.item_c_code;
			
			dtl.BuyPrice = angular.copy( value.f_price );
			
			
			dtl.f_price = angular.copy( value.f_price );	 
			dtl.f_quantity_org = angular.copy( value.f_quantity_org2 );
			dtl.uofm_c_name_org = angular.copy( value.unit_name );
			//dtl.f_quantity_uofm_c_name_org = dtl.f_quantity_org +" "+dtl.uofm_c_name_org;
			dtl.f_quantity = value.f_quantity ; 
			dtl.f_unit_price = (iAPI.tofix(dtl.f_quantity)*iAPI.tofix(dtl.f_price));
   			dtl.f_unit_total = dtl.f_unit_price ;   	
			dtl.id = $scope.options.rows_dtl.length + 1  ;
			//console.log('dtl',dtl);
			
			if( dtl.f_quantity_org <= 0 ){
				alert(value.item_c_name + " ไม่พอที่เบิก \r\n จำนวนที่เหลือ " + dtl.f_quantity_org + " " + dtl.uofm_c_name_org );
				continue;
			}
	 		$scope.options.rows_dtl.push(dtl);
 		}
 		$scope.row_hdr_change();
 		//console.log('$scope.options.rows_dtl',$scope.options.rows_dtl);		 
	   	
    });
  }  
  
   

}]) 

////////////////////////////////////////////////////////////////////////////////////////////// 
.controller('Ri_sendCtrl', ['$scope', 'iAPI', '$modal', '$filter', '$q', '$window', '$location',  function ($scope,iAPI,$modal,$filter,$q,$window,$location) {

  var ConfPageTitle = { pageTitle_org : 'สาขาขอเบิกยาและวัสดุฯ',
  	pageTitle_add_edit : '',
  	pageCaption_org : '',
  	pageTitle_edit : 'รายละเอียด',
    pageTitle_table : '',
    
  };
  iAPI.setConfPageTitle(ConfPageTitle);

  $scope.content_height=$window.innerHeight - $scope.innerHeight ;
  
  $scope.options = {
    allowOp: 'view,group1,group2',
    dataAPI: '',
    getAPI: 'document.get_doc_web_to/'+'/RI'+'/active/receive',
    saveAPI: 'document.save_doc',
    cols : [
      {label: 'No.', map: 'id', width:60, format:'index', },
      {label: 'วันที่ขอเบิก', map: 'd_create' }, 
      {label: 'เลขที่เอกสาร', map: 'c_doc_no' },
      {label: 'ขอเบิกจาก', map: 'c_from_name' }, 
      {label: 'ออกใบส่งของเลขที่', map: 'create_do_c_doc_no' }, 
    ],
    itemPerPage:$scope.itemPerPage,
	
	predicate:'d_create', 
    reverse:true,
    group : [
    	{ e_status_action : "active_confirm" , c_desc : "สาขาร้องขอ" },
    	{ e_status_action : "active_complete" , c_desc : "ออกใบส่งของแล้ว" },
    	{ e_status_action : "delete" , c_desc : "ยกเลิก" },
    ],
	filter_group : [
    	{map: 'e_status_action' },
    ],
    display : {
		groupLable : "สถานะ",
		groupOrderby : " ",
	},
	filter_group2 : [
    	{map: 'i_from' },
    ],
	display2 : {
		groupLable : "สาขา",
		groupOrderby : "c_desc",
	},
	
	
  }
 
   $scope.options.row_group = $scope.options.group[0];
   
   iAPI.get('product.get_code/location_branch').success(function(data) {
  	//console.log('product.get_code/item_group',data);
  	
  	for(var i in data['location_branch'])
  		data['location_branch'][i]["i_from"] = data['location_branch'][i]["id"];
  		
  	var row0 = {};
  	row0["id"]=row0["location_id"]=row0["i_from"]=0;
  	row0["c_code"]="";row0["c_desc"]=" ทุกสาขา";
  	data['location_branch'].splice(0,0,row0);

	$scope.options.group2  = data['location_branch'];
	console.log("group location_branch",$scope.options.group);
	$scope.options.row_group2 = $scope.options.group2[0];
   });
   
   
   
   $scope.options.cols_dtl = [
      {label:'No.', map:'id', width:60, format:'index',},
      {label:'H-CODE', map:'hcode', width:80, },
      {label:'รหัส', map:'BarCode', width:80, },
      {label:'ชื่อ', map:'item_c_name', },
      {label:'จำนวน', map:'f_quantity', width:100, align:'right', },
      {label:'หน่วย', map: 'UnitName', width:120, },
    ] 
  $scope.options.afterGet = function(rows) {
  	
  	angular.forEach(rows, function(v,k) {
  		//console.log("c_hdr_info"+v.id +" " + v.doc_type,v.c_hdr_info);
		var c_hdr_info = angular.fromJson(v.c_hdr_info);
		if( !angular.isUndefined(c_hdr_info.create_do_c_doc_no) ) 
			v.create_do_c_doc_no = c_hdr_info.create_do_c_doc_no;
		else v.create_do_c_doc_no = "";			
		   		
    })
    
    
  	console.log("afterGet",rows);
  }  
  
  $scope.options.beforeUpdRow = function(row) {    
 	 
  	var row_tmp = angular.copy(row);
  	var row_dtl = angular.copy(row_tmp.dtls);
  	
  	for(var i in row_dtl){
		var c_dtl_info = angular.fromJson(row_dtl[i].c_dtl_info);
		delete row_dtl[i].c_dtl_info;
		angular.forEach(c_dtl_info, function(value, key) {
			this[key] = value ;	 	
		}, row_dtl[i]);
		row_dtl[i].f_unit_input = row_dtl[i].f_quantity;
	} 
  	
  	delete row_tmp.dtls;
  	$scope.row = {};
  	$scope.row.hdr = row_tmp;  	
  	   
  	var c_hdr_info = angular.fromJson($scope.row.hdr.c_hdr_info);
  	delete $scope.row.hdr.c_hdr_info;
  	
  	angular.forEach(c_hdr_info, function(value, key) {
		this[key] = value ;	 	
	}, $scope.row.hdr);
  	
  	$scope.options.rows_dtl = row_dtl;  	   
    	
  	console.log("beforeUpdRow hdr ",$scope.row);
  	console.log("beforeUpdRow dtl",$scope.options.rows_dtl);
  	
  } 
 
  $scope.print_action = function() {
  	$scope.opt = {
    	report_type: "ri_send", 
    	id: $scope.row.hdr.id,     	
    }; 
    $scope.doc_print($scope.opt);    
  } 
  
  $scope.create_new_order = function() {
  	  	
  	var row_hdr = angular.copy($scope.row.hdr);
	var rows_dtl = angular.copy($scope.options.rows_dtl);
	$scope.options.save_do(row_hdr,rows_dtl);
	  	
  }
  $scope.options.save_do = function(row_hdr,rows_dtl){
  		
	//alert("sale_create");
	//var row_hdr = angular.copy($scope.row.hdr);
	//var rows_dtl = angular.copy($scope.options.rows_dtl);
	
	var url = '';
  	var data = {};
	
	data.hdr = {};	
 	data.hdr.c_doc_no = "";
	data.hdr.c_note="";
		
	data.hdr.i_refer_id = row_hdr.id;
   	data.hdr.c_refer_c_doc_no = row_hdr.c_doc_no;
   	    
   	data.hdr.i_refer_group_id = row_hdr.id;
   	data.hdr.c_refer_group_c_doc_no = row_hdr.c_doc_no;
   	data.hdr.e_create_by = "RI";
   		  
	data.hdr.e_status = "active" ;
	data.hdr.e_action = "create" ;
	
	data.hdr.i_from = row_hdr.i_to ;
	data.hdr.c_from_name = row_hdr.c_to_name ;
	data.hdr.i_to = row_hdr.i_from ;
	data.hdr.c_to_name = row_hdr.c_from_name ;
	
	data.hdr.d_date = new Date();
    data.hdr.d_date_send = new Date();
     
    data.hdr.doc_type = "DO";
    data.hdr.get_last_no = "RL"+$scope.getYearTH+$scope.getMonth;
    data.hdr.get_last_no_size = 4;  
   
    //คำนวนเงินด้วย
    data.dtl =[];       
	var f_doc_summary = 0 ;
	for(var j in rows_dtl ){
		var dtl = rows_dtl[j];
 		
		dtl.ProdName = dtl.item_c_name; 
		dtl.item_c_code = dtl.BarCode; 
		
		dtl.f_price = dtl.BuyPrice; // = dtl.f_price_to_location;  			
		dtl.f_unit_price = dtl.f_quantity*dtl.f_price ;
		dtl.f_unit_total = dtl.f_unit_price ;
		
		//ไปไล่หาเอาชื่อหน่วยออกมา		
		dtl.uofm_c_name	= dtl.UnitName;
		dtl.uofm_f_factor = dtl.PerUnit;	
		
		dtl.c_location_uofm_name = dtl.UnitName;
		dtl.c_location_f_factor = dtl.PerUnit;
		dtl.uofm_f_factor = dtl.PerUnit;
				
		dtl.location_uofm_id = dtl.uofm_id;
		dtl.uofm_option = [{"id":dtl.uofm_id,"c_name":dtl.UnitName,"c_desc":dtl.UnitName,"f_factor":dtl.PerUnit}];				
		data.dtl.push( angular.copy(dtl) );
		  			
		//คำนวนยอดเงินด้วย ค้างไว้ก่อน
		f_doc_summary+= iAPI.tofix(dtl.f_unit_total);
		

		 
		
	}
	   	 
   	data.hdr.f_doc_summary = f_doc_summary;
   	data.hdr.f_doc_subtotal = f_doc_summary;;
   	data.hdr.f_doc_total = f_doc_summary; 
	data.hdr.f_doc_total_text = iAPI.MoneyToWord(row_hdr.f_doc_total);
	
	data.hdr.chk_f_before_bal = true;
       
    //console.log("auto do",angular.copy(data));
 	url="document.save_doc";
 	iAPI.post(url,angular.copy(data)).success(function(res) {
			
		
		var	data = {};
		data.hdr = {};	
		
		data.hdr.id = $scope.row.hdr.id; 	   
		data.hdr.e_action = "complete";
		
		data.hdr_info = {};
		data.hdr_info.create_do_id = res.id;
		data.hdr_info.create_do_c_doc_no = res.c_doc_no;		

		url = 'document.update_action_doc';
		iAPI.post(url,angular.copy(data)).success(function(res) {
						
			$scope.theRefashFn();
			

		});	
		
		//alert("สร้างใบส่งของเลขที่ " + res.c_doc_no + " เรียบร้อยแล้ว");
		$location.url('/do?id='+res.id);	
			
	});
		
		
  };
  
  $scope.setRefashFn = function(theRefashFn) {
      $scope.theRefashFn = theRefashFn;
  }; 


}])  

////////////////////////////////////////////////////////////////////////////////////////////// 
.controller('Ro_sendCtrl', ['$scope', 'iAPI', '$modal', '$filter', '$q', '$window', function ($scope,iAPI,$modal,$filter,$q,$window) {

  var ConfPageTitle = { pageTitle_org : 'รายการคืนจากสาขา',
  	pageTitle_add_edit : '',
  	pageCaption_org : '',
  	pageTitle_edit : 'รับคืน',
    pageTitle_table : '',
  };
  iAPI.setConfPageTitle(ConfPageTitle);

  $scope.content_height=$window.innerHeight - $scope.innerHeight ;
  
  $scope.options = {
    allowOp: 'view,group1,group2',
    dataAPI: '',
    getAPI: 'document.get_doc_web_to/'+'/RO'+'/active/receive',
    saveAPI: 'document.save_doc',
    cols : [
      {label: 'No.', map: 'id', width:60, format:'index',},
      {label: 'วันที่สร้าง', map: 'd_create' }, 
      {label: 'เลขที่เอกสาร', map: 'c_doc_no' },
      {label: 'ส่งจากสาขา', map: 'c_from_name' }, 
      //{label: 'ส่งจากสาขา', map: 'i_from' }, 
      {label: 'เอกสารอ้างอิง', map: 'c_refer_c_doc_no' }, 
    ],
    itemPerPage:$scope.itemPerPage,
    editBtn : {
		noShow:true,
	},
	viewBtn : {
		show:false,
	},
	rowBtn : {
		show:true,
	},
    predicate:'d_create', 
    reverse:true,
    group : [
    	{ e_status_action : "active_confirm" , c_desc : "ยังไม่รับคืน" },
    	{ e_status_action : "active_complete" , c_desc : "รับคืนแล้ว" },
    ],
	filter_group : [
    	{map: 'e_status_action'},
    ],
    display : {
		groupLable : "สถานะ",
		groupOrderby : " ",
	},
	filter_group2 : [
    	{map: 'i_from' },
    ],
	display2 : {
		groupLable : "สาขา",
		groupOrderby : "c_desc",
	},
	
  }
   $scope.options.row_group = $scope.options.group[0];
   
   iAPI.get('product.get_code/location_branch').success(function(data) {
  	//console.log('product.get_code/item_group',data);
  	
  	for(var i in data['location_branch'])
  		data['location_branch'][i]["i_from"] = data['location_branch'][i]["id"];
  		
  	var row0 = {};
  	row0["id"]=row0["location_id"]=row0["i_from"]=0;
  	row0["c_code"]="";row0["c_desc"]=" ทุกสาขา";
  	data['location_branch'].splice(0,0,row0);

	$scope.options.group2  = data['location_branch'];
	console.log("group location_branch",$scope.options.group);
	$scope.options.row_group2 = $scope.options.group2[0];
   });
   
   
  //add options
  $scope.options.doc_type = "IR";
    
  $scope.options.cols_dtl = [
      {label:'No.', map:'id', width:60, format:'index',},
      {label:'H-CODE', map:'hcode', width:80, },
      {label:'รหัส', map:'item_c_code', width:80, },
      {label:'ชื่อ', map:'item_c_name', },
      {label:'ราคาทุน', map:'f_price', width:100, align:'right',  },
      {label:'จำนวน', map:'f_quantity', width:100, align:'right', },
      {label:'หน่วย', map: 'uofm_c_name', width:120, },
    ] 
    
  $scope.options.afterGet = function(rows){
  	angular.forEach(rows, function(v,k) { 
  		if(v.e_status_action=='active_confirm'){
	        v.rowBtn = {
	          icon:' ',
	          label:'รับคืน'  
	        };	 
		}else if(v.e_status_action=='active_complete'){
	        v.rowBtn = {
	  	 	  icon:'fa-search',  
	        };		 
		}
    })
  }  

  $scope.options.beforeUpdRow = function(row) {  
     
 	 
  	var row_tmp = angular.copy(row);
  	var row_dtl = angular.copy(row_tmp.dtls);
  	
  	for(var i in row_dtl){
		var c_dtl_info = angular.fromJson(row_dtl[i].c_dtl_info);
		delete row_dtl[i].c_dtl_info;
		angular.forEach(c_dtl_info, function(value, key) {
			this[key] = value ;	 	
		}, row_dtl[i]);
		row_dtl[i].f_unit_input = row_dtl[i].f_quantity;		
		row_dtl[i].item_c_code  = row_dtl[i].BarCode;
	} 
  	
  	$scope.options.rows_dtl_temp = angular.copy(row_dtl);
  	delete row_tmp.dtls;
  	$scope.row = {};
  	$scope.row.hdr = row_tmp;  	
  	
  	//$scope.row.hdr.get_last_no = "RR" +$scope.getYearTH+$scope.getMonth;
	//$scope.row.hdr.get_last_no_size = 4; 
	    
  	$scope.row.hdr.doc_type = $scope.options.doc_type;
    $scope.row.hdr.get_last_no = "IR" +$scope.getYearTH+$scope.getMonth;
    $scope.row.hdr.get_last_no_size = 4;  	
   

   
   
  	var c_hdr_info = angular.fromJson($scope.row.hdr.c_hdr_info);
  	delete $scope.row.hdr.c_hdr_info;
  	
  	angular.forEach(c_hdr_info, function(value, key) {
		this[key] = value ;	 	
	}, $scope.row.hdr);
  	
  	//ปรับให้มันดึงราคาทุนมาใหม่เลย
  	
  	
  	$scope.options.rows_dtl = row_dtl;
  	
  	
  	if($scope.row.hdr.e_status_action=='active_confirm'){
		
	   var parameter = { c_code: $scope.row.hdr.get_last_no , size: $scope.row.hdr.get_last_no_size , update : false };  
	   iAPI.post('document.get_last_no',parameter).success(function(data) {
	   	    console.log("document.get_last_no",data) ;
	   		data = angular.fromJson(data);
	   		$scope.row.hdr.c_doc_no_input = data.doc_no ;   
	   })		
	   
	   $scope.options.branch_check = "";
	   iAPI.post('document.branch_check/'+$scope.row.hdr.i_from,{}).success(function(data) {
	   	    console.log("document.branch_check",data) ;
	   	    $scope.row.hdr.branch_check = data; 
	   	    if( $scope.row.hdr.branch_check == "0"){
				$scope.options.branch_check = "สาขา"+$scope.row.hdr.c_from_name+"ยังไม่เปิด ไม่สามารถรับคืนได้";				
				alert($scope.options.branch_check);
			}
	   	    	
	   	     
	   })	 
	   
	   	
	   //alert($scope.row.hdr.id)	;
	   iAPI.post('stock.stock_counting_doc_input/'+$scope.row.hdr.id,{}).success(function(data) {
	   	    console.log("document.stock_counting_doc",data) ;
	   	    var f_doc_summary = 0 ;
	   	    
	   	    for(var i in data){
				for(var j in $scope.options.rows_dtl){
					if( data[i].item_id == $scope.options.rows_dtl[j].item_id ){
						$scope.options.rows_dtl[j].f_quantity_org = data[i].f_quantity ;
						
						//เอาราคาทุนของ lot แรกมาใช้งาน
						$scope.options.rows_dtl[j].f_fifo_p_unit = data[i].f_fifo_p_unit ;
						$scope.options.rows_dtl[j].f_price = data[i].f_fifo_p_unit ;
						
						var f_price = iAPI.tofix($scope.options.rows_dtl[j].f_price);
						var f_quantity = iAPI.tofix($scope.options.rows_dtl[j].f_quantity);
						var f_unit_price = f_price * f_quantity;
						
						$scope.options.rows_dtl[j].f_unit_price = f_unit_price ;
						$scope.options.rows_dtl[j].f_unit_total = f_unit_price ;						
						
						$scope.options.rows_dtl[j].item_c_code = data[i].item_c_code ; 
						
						f_doc_summary += f_unit_price;
						
						break;
					}
				}
			}
			
			$scope.row.hdr.f_doc_summary = f_doc_summary;
			$scope.row.hdr.f_doc_subtotal = f_doc_summary;
			$scope.row.hdr.f_doc_total = f_doc_summary;
			
			
			$scope.options.rows_dtl_temp = angular.copy($scope.options.rows_dtl);
			
		  	console.log("beforeUpdRow hdr ",$scope.row);
		  	console.log("beforeUpdRow dtl",$scope.options.rows_dtl);	
		  			
	   		   
	   })    	
   	
    }
       	
  }

  $scope.options.beforePost = function(row) {  	
 	
 	 //2016-01-07 แก้ไขให้ ตัด stock สาขาก่อนค่อยมารับเข้า
 	 //$scope.options.insert_stock_card = true;
 	 if(!$scope.options.insert_stock_card)return ;
     
     
     delete row.hdr.rowBtn;
   	 delete row.hdr.e_status_action;
   	 delete row.hdr.c_doc_no_input;

	 delete row.hdr.d_create ;
   	    
   	 row.hdr.d_date = new Date();
   	 row.hdr.d_date_send = row.hdr.d_date;   
   	 row.hdr.d_confirm = row.hdr.d_date;  
   	 row.hdr.d_complete = row.hdr.d_date; 
   	    
   	 
   	 for(var m in $scope.options.rows_dtl) { 
   	    delete $scope.options.rows_dtl[m].butDelete;   	    
    	delete $scope.options.rows_dtl[m].f_unit_input;     
   	 }   	 
   	 
   	 row.dtl = $scope.options.rows_dtl;
   	  
   	 var rows_hdr_temp = angular.copy($scope.row.hdr);
 	 rows_hdr_temp.c_refer_c_doc_no=rows_hdr_temp.c_doc_no;	   	 	
 	 rows_hdr_temp.i_refer_id = rows_hdr_temp.id;		  
   	 rows_hdr_temp.i_refer_group_id = rows_hdr_temp.id;
   	 rows_hdr_temp.c_refer_group_c_doc_no = rows_hdr_temp.c_doc_no;	  

     $scope.options.rows_hdr_temp = rows_hdr_temp;
     //$scope.options.rows_dtl_temp = [];
     //alert("c_doc_no="+rows_hdr_temp.c_doc_no );
   	 
   	 
   	 row.hdr.e_action = 'create';
	 //row.hdr.e_action = 'complete';
   	 row.hdr.i_refer_id = row.hdr.id;
   	 row.hdr.c_refer_c_doc_no = row.hdr.c_doc_no;
   	 row.hdr.i_refer_group_id = row.hdr.id; 
   	 row.hdr.c_refer_group_c_doc_no = row.hdr.c_doc_no;   	 
   	    	
  	 return true; 
  }
    
  $scope.options.afterPost = function(row){
  	
  	var url = '';
  	var data = {};
  	  	 	
  	console.log("afterPost row",row);		
			
			
  	if($scope.options.insert_stock_card){
	  	//update stock
	  	//รับเข้า
		url = 'document.insert_stock_card_to';
		data = {};
		data.id = row.id;
		iAPI.post(url,angular.copy(data)).success(function(res) {
			//alert("รับคืน stock จากสาขา เรียบร้อยแล้ว");
		}); 	
		
		//2016-01-07 แก้ไขให้ ตัด stock สาขาก่อนค่อยมารับเข้า
		//ตัดstock จากสาขา เขียนเป็น api ตัดการกับ db  	
		//url = 'document.branch_insert_stock_card';
		//data = {};
		//data.id = row.i_refer_id;
		//iAPI.post(url,angular.copy(data)).success(function(res) {
		//	//alert("ตัด stock ที่สาขา เรียบร้อยแล้ว");
		//}); 		
			
	}
  	
  	
    	
	var tmp_row = {}; 
	tmp_row.hdr = angular.copy($scope.options.rows_hdr_temp);
	tmp_row.dtl = angular.copy($scope.options.rows_dtl_temp); 

	console.log("afterPost tmp_row",tmp_row);		
			
	data = {};
	data.hdr = {};	
	data.hdr.id = tmp_row.hdr.id;
	data.hdr.c_doc_no = tmp_row.hdr.c_doc_no;			
    data.hdr.doc_type = "RO";	 
	data.hdr.complete = new Date();  
	data.hdr.e_action = "complete";
	data.no_new_doc = true;
	
	for(var m in tmp_row.dtl) { 
   	    delete $scope.options.rows_dtl[m].butDelete;   	    
   	 }    	 
	data.dtl_info = tmp_row.dtl;
	
	data.hdr_info = {};
	data.hdr_info.c_doc_no_input = row.c_doc_no;
	data.hdr_info.i_c_doc_no_input = row.id;
	
	console.log("afterPost data",data);
	
	url = 'document.update_action_doc';
	iAPI.post(url,angular.copy(data)).success(function(res) {
		$scope.theRefashFn();
	});			

	alert("รับคืนสินค้าจากสาขาเรียบร้อยแล้ว");
	
	$scope.spinner = {active : false};    
  }

  $scope.create_new_order = function(){
  	
    	
  	//2016-03-07 แก้ไขให้กดได้ครั้งเดียว
  	$scope.spinner = {active : true};
  	

 	//2016-01-07 แก้ไขให้ ตัด stock สาขาก่อนค่อยมารับเข้า 
    $scope.options.insert_stock_card = false;
 
  	var url = '';
  	var data = {};
 	//ตัดstock จากสาขา เขียนเป็น api ตัดการกับ db  	
	url = 'document.branch_insert_stock_card';
	data = {};
	data.id = $scope.row.hdr.id;
	iAPI.post(url,angular.copy(data)).success(function(res) {
		
		console.log('document.branch_insert_stock_card',res);
		if(res['result'] == '1' ){
			$scope.options.insert_stock_card = true;
			$scope.theSaveFn();
		
			alert("ตัด stock ที่สาขา เรียบร้อยแล้ว");
		}else{
						
			alert($scope.row.hdr.c_doc_no + " ได้รับเข้าไปก่อนหน้านี้แล้ว");
			$scope.spinner = {active : false}; 
			$scope.theRefashFn();
		}
		 
		
		
		
	}); 
		  		
  	alert("กำลังทำการตัด stock ที่สาขาอยู่ ถ้านานแล้วยังไม่ตัดที่สาขาให้ปิดเปิดโปรแกรมใหม่");  	  		
 
  	
  	//$scope.theSaveFn();
  }
  
  
  $scope.setSaveFn = function(theSaveFn) { 
      $scope.theSaveFn = theSaveFn;
  }  
  $scope.setRefashFn = function(theRefashFn) {
      $scope.theRefashFn = theRefashFn;
  };
   

}])  
 
////////////////////////////////////////////////////////////////////////////////////////////// 
.controller('BoCtrl', ['$scope', 'iAPI', '$modal', '$filter', '$q', '$window', function ($scope,iAPI,$modal,$filter,$q,$window) {

  var ConfPageTitle = { pageTitle_org : 'รายการซื้อสินค้าเองของสาขา',
  	pageTitle_add_edit : '',
  	pageCaption_org : '',
  	pageTitle_edit : 'รายละเอียด',
    pageTitle_table : '',
  };
  iAPI.setConfPageTitle(ConfPageTitle);

  $scope.content_height=$window.innerHeight - $scope.innerHeight ;
  
  $scope.options = {
    allowOp: 'view,group1',
    dataAPI: '',
    getAPI: 'document.get_doc/'+'/BO'+'/active/receive',
    saveAPI: 'document.save_doc',
    cols : [
      {label: 'No.', map: 'id', width:60, format:'index',},
      {label: 'วันที่สร้าง', map: 'd_create' }, 
      {label: 'เลขที่เอกสาร', map: 'c_doc_no' },
      {label: 'ส่งจากสาขา', map: 'c_from_name' },    
    ],
    itemPerPage:$scope.itemPerPage,
	predicate:'d_create', 
    reverse:true,
        filter_group : [
    	{map: 'i_from' },
    ],
    display : {
		groupLable : "สาขา",
		groupOrderby : "c_desc",
	},
	editBtn : {
		noShow:true,
	},
	viewBtn : {
		show:true,
	},
  }

  iAPI.get('product.get_code/location_branch').success(function(data) {
  	//console.log('product.get_code/item_group',data);
  	
  	for(var i in data['location_branch'])
  		data['location_branch'][i]["i_from"] = data['location_branch'][i]["id"];
  		
  	var row0 = {};
  	row0["id"]=row0["location_id"]=row0["i_from"]=0;
  	row0["c_code"]="";row0["c_desc"]=" ทุกสาขา";
  	data['location_branch'].splice(0,0,row0);

	$scope.options.group  = data['location_branch'];
	console.log("group location_branch",$scope.options.group);
	$scope.options.row_group = $scope.options.group[0];
  });
   
  $scope.options.cols_dtl = [
      {label:'No.', map:'id', width:60, format:'index',},
      {label:'H-CODE', map:'hcode', width:80, },
      {label:'รหัส', map:'BarCode', width:80, },
      {label:'ชื่อ', map:'item_c_name', },
      {label:'จำนวน', map:'f_quantity', width:100, align:'right', },
      {label:'หน่วย', map: 'uofm_c_name', width:120, },
    ] 
    
  $scope.options.beforeUpdRow = function(row) { 
    
 	 
  	var row_tmp = angular.copy(row);
  	var row_dtl = angular.copy(row_tmp.dtls);
  	
  	for(var i in row_dtl){
		var c_dtl_info = angular.fromJson(row_dtl[i].c_dtl_info);
		delete row_dtl[i].c_dtl_info;
		angular.forEach(c_dtl_info, function(value, key) {
			this[key] = value ;	 	
		}, row_dtl[i]);
		row_dtl[i].f_unit_input = row_dtl[i].f_quantity;
	} 
  	
  	delete row_tmp.dtls;
  	$scope.row = {};
  	$scope.row.hdr = row_tmp;  	
  	
  	var c_hdr_info = angular.fromJson($scope.row.hdr.c_hdr_info);
  	delete $scope.row.hdr.c_hdr_info;
  	
  	angular.forEach(c_hdr_info, function(value, key) {
		this[key] = value ;	 	
	}, $scope.row.hdr);
  	
  	$scope.options.rows_dtl = row_dtl;  	   
    	
  	console.log("beforeUpdRow hdr ",$scope.row);
  	console.log("beforeUpdRow dtl",$scope.options.rows_dtl);
  	
  }    

}]) 
  
////////////////////////////////////////////////////////////////////////////////////////////// 
.controller('SaleorderCtrl', ['$scope', 'iAPI', '$modal', '$filter', '$q', '$window', '$location', function ($scope,iAPI,$modal,$filter,$q,$window,$location) {

   
  $scope.set_title = function() {
  	 $scope.location_url = $location.url().replace("/", ""); 
  	 //alert(location_url);
  	 var ConfPageTitle = {};
  	 if( $scope.location_url == "saleorder_cash" ){
	 	ConfPageTitle = { pageTitle_org : 'ขายสินค้าลูกค้าทั่วไป',
		  	pageTitle_add_edit : ' ',
		  	pageCaption_org : '',
		  	pageTitle_edit : '',
		  	pageTitle_table : 'เงินสด',
		  }; 
		  
		  $scope.options.filter_fix1.search = "cash";
	 }else if( $scope.location_url == "saleorder_credit" ){
	 	ConfPageTitle = { pageTitle_org : 'ขายสินค้าลูกค้าทั่วไป',
		  	pageTitle_add_edit : ' ',
		  	pageCaption_org : '',
		  	pageTitle_edit : '',
		  	pageTitle_table : 'เงินเชื่อ',
		  };
		$scope.options.filter_fix1.search = "credit";
	 }else{
	 	ConfPageTitle = { pageTitle_org : 'ขายสินค้าลูกค้าทั่วไป',
		  	pageTitle_add_edit : ' ',
		  	pageCaption_org : '',
		  	pageTitle_edit : ' ',
		  	pageTitle_table : '',
		  };
		  
	 }
	 iAPI.setConfPageTitle(ConfPageTitle);
  }
  
  

  $scope.content_height=$window.innerHeight - $scope.innerHeight ;
  
  $scope.options = {
    allowOp: 'view,add,edit,group1,month',
    dataAPI: '',
    getAPI: 'document.get_doc_web/'+'/SALE'+'/active/create/d_start/d_end',
    saveAPI: 'document.save_doc',
    updateAPI: 'document.edit_doc',
    cols : [
      {label: 'No.', map: 'id', width:60, format:'index',},
      {label: 'วันที่', map: 'd_create' },
      {label: 'เลขที่เอกสาร', map: 'c_doc_no' },   
      {label: 'ขายให้', map: 'c_to_name' }, 
      {label: 'การจ่าย', map:'c_type_show'  },
    ], 
    itemPerPage:$scope.itemPerPage,
    predicate:'d_create', 
    reverse:true,
    filter_group : [
    	{map: 'e_status_action' },
    ],
    group : [
    	{ e_status_action : "active_create" , c_desc : "ยังไม่อนุมัติ" , c_seq:1 },
    	{ e_status_action : "active_confirm" , c_desc : "อนุมัติแล้ว" , c_seq:2 },
    	{ e_status_action : "delete" , c_desc : "ยกเลิก" , c_seq:3 },
    ],  
    addFnForm:function(row){  
			$scope.addItems(row);
		 },
	editBtn : {
		noShow:true,
	},
	viewBtn : {
		show:false,
	},
	rowBtn : {
		show:true,
	},
	display : {
		groupLable : "สถานะ",
		groupOrderby : " ",
	},
	filter_fix1 : {
		search : "",
		map : "c_type",
	}
  }
  $scope.options.row_group = $scope.options.group[0]; 
  
  $scope.set_title();
  
  
  $scope.options.chgMode = function() {
  	$scope.options.allowOp = 'view,add,edit,group1,month';
  }
  $scope.options.sale_return = false; 
  $scope.options.doc_type = "SALE"; 
        
  //add options
 
  $scope.options.rows_dtl =[];
  $scope.options.rows_dtl_col ={id:'',item_id:'',item_c_code:'',item_c_name:'',uofm_id:'',uofm_c_name:'',location_uofm_id:'',
  	f_quantity:1,f_price:0,f_unit_price:0,f_discount_pct:0,f_discount:0,f_unit_total:0
  	,hcode:''
  };
  
  $scope.options.cols_dtl_th1 = [
      {label:'No.', width:50, }, 
      //{label:'hcode', width:60, },
      {label:'รหัส', width:60, },
      {label:'ชื่อ', },
      {label:'คงเหลือ', width:80, align:'right', },
      {label:'จำนวน/แพ็ค', width:88, align:'right', },      
      {label:'จำนวน', width:80, align:'right', },
      //{label:'หน่วย', map: 'uofm_c_name',  },
      {label:'หน่วย', width:80, align:'center', },
      {label:'ราคา', width:70, align:'right', },
      {label:'ส่วนลด', width:160, align:'center', colspan:3,  }, 
      {label:'จำนวนเงิน', width:80, align:'right', },
    ]
    
 
    
    
  $scope.options.cols_dtl1 = [
      {label:'No.', map:'id', width:50, format:'index', }, 
      //{label:'hcode', map:'hcode', width:60, },
      {label:'รหัส', map:'item_c_code', width:60, },
      {label:'ชื่อ', map:'item_c_name', },
      {label:'จำนวนคงเหลือ', map:'f_quantity_org', width:110, align:'right',  },
      {label:'จำนวน/แพ็ค', map:'f_AmountPerPack', width:88, align:'right', },      
      {label:'จำนวน', map:'f_quantity', type:'textbox', size:5, align:'right', valid_number:'valid-number', width:60,
      	changeFn :  function(row){ $scope.row_dtl_change(row,''); },   
      }, 
      //{label:'หน่วย', map: 'uofm_c_name', width:80, align:'center', },
      {label:'หน่วย', map:'uofm_id', type:'select', option:'uofm_option', width:80, readonly:true,
      	changeFn :  function(row){ $scope.uofm_row_dtl_selete(row); },
      },
      //{label:'หน่วย', map: 'uofm_id', type:'select', option:'uofm_option', width:80, },
      {label:'ราคา', map:'f_price' , type:'textbox', size:5, align:'right', width:70, valid_number:'valid-number', 
      	changeFn :  function(row){ $scope.row_dtl_change(row,''); }, 
      },
      {label:'ส่วนลด', map:'f_discount_pct' , type:'textbox', size:3, align:'right', width:60, valid_number:'valid-number',
      	changeFn :  function(row){ $scope.row_dtl_change(row,'discount_pct'); }, 
      },
      {label:' ', map:'c_percent', width:40, },
      //{label:'ส่วนลด', map:'f_discount', width:40, },
      {label:'ส่วนลด', map:'f_discount' , type:'textbox', size:8, align:'right', width:60, valid_number:'valid-number',
      	changeFn :  function(row){ $scope.row_dtl_change(row,''); }, 
      },
      {label:'จำนวนเงิน', map:'f_unit_total', width:80, align:'right', },  
      //{label:'จำนวนเงิน', map:'f_unit_total' , type:'textbox', size:8, align:'right', valid_number:'valid-number', readonly:true,
      //	changeFn :  function(row){ $scope.row_dtl_change(row,''); }, 
      //},
    ]

  $scope.options.cols_dtl2 = [
      {label:'No.', map:'id', width:50, format:'index', }, 
      //{label:'hcode', map:'hcode', width:60, },
      {label:'รหัส', map:'item_c_code', width:60, },
      {label:'ชื่อ', map:'item_c_name', },
      {label:'จำนวนคงเหลือ', map:'f_quantity_org', width:110, align:'right',  },
      {label:'จำนวน/แพ็ค', map:'f_AmountPerPack', width:88, align:'right', },     
      {label:'จำนวน', map:'f_quantity', width:60, align:'right', },  
      //{label:'หน่วย', map: 'uofm_c_name', width:80, align:'center', },
      {label:'หน่วย', map: 'uofm_c_name_show', width:80, align:'center', },      
      {label:'ราคา', map:'f_price', width:70, align:'right', }, 
	  {label:'ส่วนลด', map:'f_discount_pct', width:60, align:'right', }, 	
      {label:' ', map:'c_percent', width:40, },
	  {label:'ส่วนลด', map:'f_discount', width:60, align:'right', },	
      {label:'จำนวนเงิน', map:'f_unit_total', width:80, align:'right', },  

    ]
    
        
  $scope.create_cols_buttons = function() { 
	  $scope.options.cols_buttons = [
	      {label:'', btn:'btn-danger', icon : 'ion ion-close', type:'button', width:20,
	       	fn:function(idx,row){ 
				 $scope.row_del(idx,row);
			   },
		  },  
	    ];
  }    
  
  $scope.addItems = function(row) { 
   
  
   $scope.options.sale_return = false; 
   
   $scope.options.cols_dtl_th = angular.copy($scope.options.cols_dtl_th1);
   $scope.options.cols_dtl = angular.copy($scope.options.cols_dtl1);
   $scope.create_cols_buttons();
   
   $scope.options.disabled = false;
 
   $scope.row={};
   $scope.row.hdr={};
   $scope.row.hdr.f_doc_summary = 0 ;
   $scope.row.hdr.f_doc_discount = 0 ;
   $scope.row.hdr.f_doc_subtotal = 0 ;
   $scope.row.hdr.f_tax_pct = "";
   $scope.row.hdr.f_tax = 0 ;
   $scope.row.hdr.f_doc_total = 0 ;
   $scope.row.hdr.f_tax_chk = 'no_vat';
   $scope.row.hdr.c_note="";
   $scope.row.hdr.doc_type = "SALE";


   $scope.row.hdr.i_from = $scope.Employee.location_id;
   $scope.row.hdr.c_from_name = $scope.Employee.c_location_code;
      
   $scope.options.customer = $scope.MODEL.customer[0];
   $scope.change_customer();					
      
   $scope.row.hdr.d_date = new Date();
   $scope.row.hdr.d_date_send = new Date();
    	
   $scope.row.hdr.doc_type = $scope.options.doc_type;
   	     
   $scope.options.rows_dtl =[];  
   
   //var c_setting = angular.fromJson($scope.MODEL.location[0].c_setting);     
   //$scope.row.hdr.c_headder_name = c_setting.c_desc ;
   //$scope.row.hdr.c_headder_address = c_setting.c_address ;
   //$scope.row.hdr.c_headder_tel = c_setting.c_tel ;
   //$scope.row.hdr.c_headder_tax_number = c_setting.c_tax_number ;
   
    //{"c_tel":"086-375-7163","c_address":"59/58 ถ. แจ้งวัฒนะ ต.คลองเกลือ  อ. ปาเกร็ด  จ.นนทบุรี  11120","c_tax_number":"012345678910","c_desc":"บริษัท เฟเชียล เอสเธดิค จำกัด"}
   
    
   if( $scope.location_url == "saleorder_cash" ) $scope.row.hdr.c_type = "cash";
   else if( $scope.location_url == "saleorder_credit" ) $scope.row.hdr.c_type = "credit";
   else $scope.row.hdr.c_type = "cash";
      
   $scope.c_type_change();
   
    
    
   console.log("$scope.row",$scope.row);
    
   //console.log($scope.row);
 	//$scope.row.hdr.c_doc_no = "xxx";
  }  
   
  $scope.options.afterGet = function(rows){
  	
  	angular.forEach(rows, function(v,k) {
  		if(v.e_status_action=='active_create'){
	        v.rowBtn = {
	          icon:'fa-pencil',  
	        };	 
		}else if(v.e_status_action=='active_confirm'){
	        v.rowBtn = {
	  	 			icon:'fa-search',  
	        };		 
		}else if(v.e_status_action=='delete'){
	        v.rowBtn = {
	  	 			icon:'fa-search',  
	        };	 	
  		} 
  		
  		var c_hdr_info = angular.fromJson(v.c_hdr_info);
  		//alert(c_hdr_info.c_type);
  		//console.log(c_hdr_info)
  		if( angular.isDefined(c_hdr_info.c_type) )
  			v.c_type = c_hdr_info.c_type;
  			
		if( v.c_type == "credit" )
			v.c_type_show = "เงินเชื่อ";
		else if( v.c_type == "cash" )
			v.c_type_show = "เงินสด";
		else{
			v.c_type = "";
			v.c_type_show = "";
		}
			
			
    })
    //alert("afterGet");
  	//console.log("afterGet",rows);
  }

  $scope.options.beforeUpdRow = function(row) { 
  
  /*
   for(var i in MODEL.vendor ){
   	if(MODEL.vendor[i].id == row.)
   }
   */
    iAPI.config["pageTitle_edit"] = "แก้ไข";
    
 
    $scope.options.sale_return = false; 
   
    $scope.options.cols_dtl_th = angular.copy($scope.options.cols_dtl_th1);
    $scope.options.cols_dtl = angular.copy($scope.options.cols_dtl1);
 
    if(row.e_status_action=='active_create'){   
    
    	$scope.options.cols_dtl_th = angular.copy($scope.options.cols_dtl_th1);
    	$scope.options.cols_dtl = angular.copy($scope.options.cols_dtl1);
    	
   	 	$scope.create_cols_buttons();
    }else if(row.e_status_action=='active_confirm' || row.e_status_action=='delete'){
  		$scope.options.allowOp = 'view'; 
  		$scope.options.disabled = true;
  		 		
  		
  		$scope.options.cols_dtl_th = angular.copy($scope.options.cols_dtl_th1);
    	$scope.options.cols_dtl = angular.copy($scope.options.cols_dtl2);
    	
    	$scope.options.cols_buttons = [];
  		
    }else{
		$scope.options.cols_dtl_th = angular.copy($scope.options.cols_dtl_th1);
    	$scope.options.cols_dtl = angular.copy($scope.options.cols_dtl1);
    	
    	$scope.options.cols_buttons = [];
	}
 
  	var row_tmp = angular.copy(row);
  	var row_dtl = angular.copy(row_tmp.dtls);
  	
  	
  	for(var i in row_dtl){
		var c_dtl_info = angular.fromJson(row_dtl[i].c_dtl_info);
		delete row_dtl[i].c_dtl_info;
		angular.forEach(c_dtl_info, function(value, key) {
			this[key] = value ;	 	
		}, row_dtl[i]);
		
		//ส่งให้สาขา
		//"i_add_branch":"1","c_send_to_branch_tel":"กกกกกก","i_send_to_branch":"136","c_add_option_note":"2222"
		if( !angular.isUndefined(row_dtl[i].i_add_branch) ){
			for(var key in $scope.MODEL.location_branch){
				if( $scope.MODEL.location_branch[key].id == row_dtl[i].i_send_to_branch){
					$scope.options.location_branch[i] = $scope.MODEL.location_branch[key];
					break;
				}		
			}
		} 
		
		if(row.e_status_action=='active_confirm' || row.e_status_action=='delete') {
			row_dtl[i].disabled = true;	
			row_dtl[i].option_disabled = true;	
			
			row_dtl[i].uofm_c_name_show = row_dtl[i].uofm_c_name;
			if( parseFloat(row_dtl[i].uofm_f_factor) !='1'){
				if( !angular.isUndefined(row_dtl[i].uofm_c_name_org) )
					row_dtl[i].uofm_c_name_show += "("+parseFloat(row_dtl[i].uofm_f_factor)+row_dtl[i].uofm_c_name_org+")";
				else if( !angular.isUndefined(row_dtl[i].c_receive_uofm_name) )
					row_dtl[i].uofm_c_name_show += "("+parseFloat(row_dtl[i].uofm_f_factor)+row_dtl[i].c_receive_uofm_name+")";
				else 
					row_dtl[i].uofm_c_name_show += "("+parseFloat(row_dtl[i].uofm_f_factor)+")";
			}
			
		}else{
			var uofm_id = row_dtl[i].uofm_id;
			$scope.create_uofm(uofm_id);
			row_dtl[i].uofm_option = angular.copy($scope.confUofm.receive_uofm);  			
		}
		
	} 

  	delete row_tmp.dtls;
  	$scope.row = {};
  	$scope.row.hdr = row_tmp;  	

 
  	
  	var c_hdr_info = angular.fromJson($scope.row.hdr.c_hdr_info);
  	delete $scope.row.hdr.c_hdr_info;
  	
  	angular.forEach(c_hdr_info, function(value, key) {
		this[key] = value ;	 	
	}, $scope.row.hdr);
  	
  	$scope.options.rows_dtl = row_dtl;
  	
  	for(var key in $scope.MODEL.customer){
		if( $scope.MODEL.customer[key].id == $scope.row.hdr.i_to){
			$scope.options.customer = $scope.MODEL.customer[key];
			if( angular.isUndefined($scope.row.hdr.c_customer_name) )
				$scope.row.hdr.c_customer_name = $scope.options.customer.c_name;
			break;
		}		
	} 

  	 
	
	   
    
   if( !angular.isUndefined($scope.row.hdr.id) ){ 
  		$scope.row.id = $scope.row.hdr.id;
  		  		
  	    if( $scope.row.hdr.e_status == "active" )
  			$scope.row.hdr.e_status = 'edit';
  	} 
	  
	//alert($scope.row.hdr.e_status_action);

    if(row.e_status_action=='active_create'){

	   iAPI.post('stock.stock_counting_doc/'+$scope.row.hdr.id,{}).success(function(data) {
	   	    //console.log("document.stock_counting_doc",data) ;
	   	    for(var i in data){
				for(var j in $scope.options.rows_dtl){
					if( data[i].item_id == $scope.options.rows_dtl[j].item_id ){
						$scope.options.rows_dtl[j].f_quantity_org = data[i].f_quantity ;
						break;
					}
				}
			}
	   		   
	   })    	
   	
     }
   
   
  	console.log("beforeUpdRow hdr ",$scope.row);
  	console.log("beforeUpdRow dtl",$scope.options.rows_dtl);
  	
  }
  
     
  
  $scope.options.beforePost = function(row) {  	
   	    	    
   	    
   	  for(var i in $scope.options.rows_dtl){
   	  	var row_dtl = $scope.options.rows_dtl[i];
	  	if( iAPI.tofix(row_dtl.f_quantity) > iAPI.tofix(row_dtl.f_quantity_org) ){
			alert(row_dtl.item_c_name + " ไม่พอที่ขาย \r\n จำนวนที่เหลือ " + row_dtl.f_quantity_org );
   	    	row_dtl.f_quantity = row_dtl.f_quantity_org ;	
   	    	return false;	
		}
	
	  }
	 
   	  
   	  delete row.hdr.c_type_show;
   	  delete row.hdr.rowBtn;
   	  delete row.hdr.e_status_action;
   	  
   	  if( $scope.options.sale_return == true ){
   	  	row.dtl = [];
   	  	
	  	for(var i in $scope.options.rows_dtl){
	  		
	  		var chk_add = angular.copy( $scope.options.rows_dtl[i].chk_add );
	  			 
	    	if( chk_add == "1" ){
	    		
	    		//alert(chk_add);
		    	delete $scope.options.rows_dtl[i].disabled ;
		    	delete $scope.options.rows_dtl[i].option_disabled ; 
		    	delete $scope.options.rows_dtl[i].chk_add ; 	    		
	    		
	    		delete $scope.options.rows_dtl[i].uofm_c_name_show ;
	    		
	    		
	    		row.dtl.push($scope.options.rows_dtl[i]);	    		
	    	}
	    	
		} 
		
	  }else{
	  	for(var i in $scope.options.rows_dtl){
	    	delete $scope.options.rows_dtl[i].disabled ;
	    	delete $scope.options.rows_dtl[i].option_disabled ; 
	    	delete $scope.options.rows_dtl[i].uofm_c_name_show ;
	    	
		}
		row.dtl = $scope.options.rows_dtl;
	  } 
   	  
	 
   	 
   	  if( !angular.isUndefined($scope.row.hdr.f_doc_summary_old))   	
   	  	$scope.row.hdr.f_doc_summary_old = iAPI.tofix($scope.row.hdr.f_doc_summary_old);
   	  if( !angular.isUndefined($scope.row.hdr.f_doc_summary_new))   	
   	 	$scope.row.hdr.f_doc_summary_new = iAPI.tofix($scope.row.hdr.f_doc_summary_new);
   	 
   	 
   	 
  	  return true 
  }

  $scope.options.afterPost = function(row){
  	//alert("55");
  	//console.log(row);
  	
  	var c_hdr_info = angular.fromJson(row.c_hdr_info);
	if( c_hdr_info.c_type == "credit" )
		row.c_type_show = "เงินเชื่อ";
	else if( c_hdr_info.c_type == "cash" )
		row.c_type_show = "เงินสด";
	
  }
  
  $scope.uofm_row_dtl_selete = function(row) {  
    
 		
  	for(var i in row.uofm_option ){
		if( row.uofm_option[i].id == row.uofm_id ){
			row.uofm_c_name = row.uofm_option[i].c_desc ;
			row.uofm_f_factor = row.uofm_option[i].f_factor;  
			row.PerUnit = row.uofm_option[i].f_factor;  
			break;
		}
	}
	//alert(row.uofm_c_name);
  	//console.log(row);	
  }
      
  $scope.row_dtl_change = function(row,c_discount_type) {
  	
  	if($scope.options.sale_return){
		$scope.row_dtl_sale_return_change(row);
		return;
	}
  	
  	if( iAPI.tofix(row.f_quantity) <= 0 ){
  		alert("กรุณาอย่าใส่0 หรือตำกว่า 0");
   	    row.f_quantity = 1 ;		
	}
	
    if( iAPI.tofix(row.f_quantity) > iAPI.tofix(row.f_quantity_org) ){
		alert(row.item_c_name + " ไม่พอที่ขาย \r\n จำนวนที่เหลือ " + row.f_quantity_org );
   	    row.f_quantity = 1 ;		
	}
	
   	//alert(row);
   	console.log("row_dtl_change" + "  c_discount_type = " + c_discount_type,row); 
   	  
   	var f_discount_pct = iAPI.tofix(row.f_discount_pct);
   	if( isNaN(f_discount_pct) ) f_discount_pct = 0 ;  
   	if( f_discount_pct == '' )  f_discount_pct = 0 ;  	
   	
   	row.f_unit_price = (iAPI.tofix(row.f_quantity)*iAPI.tofix(row.f_price));
   	if( c_discount_type == "discount_pct" && f_discount_pct == 0 ){   
		row.f_discount = 0 ;
	}else if( f_discount_pct != 0){
		row.f_discount = row.f_unit_price * (f_discount_pct / 100); 
		row.f_discount = iAPI.round(row.f_discount); 
	}	
   	row.f_unit_total = row.f_unit_price-iAPI.tofix(row.f_discount) ;
   	$scope.row_hdr_change();
  }   
 
  $scope.row_hdr_change = function(c_discount_type) {
  	  	
  	 if($scope.options.sale_return){
		$scope.row_hdr_sale_return_change(c_discount_type);
		return;
	 }
	
	 console.log("row_hdr_change" + "  c_discount_type = " + c_discount_type,$scope.row.hdr);
   	 
   	 var f_doc_summary = 0 ;
   	 for(var m in $scope.options.rows_dtl) {
   	 	var value = $scope.options.rows_dtl[m];
		f_doc_summary+= iAPI.tofix(value.f_unit_total);
		
   	 }
   	 
   	  
   	 var f_doc_discount_pct = iAPI.tofix($scope.row.hdr.f_doc_discount_pct);
   	 if( isNaN(f_doc_discount_pct) ) f_doc_discount_pct = 0 ;
   	 if( f_doc_discount_pct == '' )  f_doc_discount_pct = 0 ;
   	 
   	 //alert(f_doc_discount_pct);
   	 if( c_discount_type == "discount_pct" && f_doc_discount_pct == 0 ){   
		$scope.row.hdr.f_doc_discount = 0 ;
	 }else if( f_doc_discount_pct != 0){
		$scope.row.hdr.f_doc_discount = f_doc_summary * (f_doc_discount_pct / 100); 
		$scope.row.hdr.f_doc_discount = iAPI.round($scope.row.hdr.f_doc_discount); 
	 }else{
	 	$scope.row.hdr.f_doc_discount = 0.00 ;
	 } 	 
   	 
   	 $scope.row.hdr.f_doc_summary = f_doc_summary;
   	 $scope.row.hdr.f_doc_subtotal = iAPI.tofix($scope.row.hdr.f_doc_summary) - iAPI.tofix($scope.row.hdr.f_doc_discount);
   	 
   	 if( $scope.row.hdr.f_tax_chk == 'no_vat' ){
	 	
	 	$scope.row.hdr.f_tax_pct = "";
	 	$scope.row.hdr.f_tax = "";	 	
	 	$scope.row.hdr.f_doc_total = iAPI.tofix($scope.row.hdr.f_doc_subtotal) ;
	 	
	 }else if( $scope.row.hdr.f_tax_chk == 'include' ){

	 	if( $scope.row.hdr.f_tax_pct == "" || $scope.row.hdr.f_tax_pct == "0" ) $scope.row.hdr.f_tax_pct = $scope.MODEL.vat["vat_pct"];
	 	var f_tax_pct = iAPI.tofix($scope.row.hdr.f_tax_pct);
   	 	if( isNaN(f_tax_pct) ) f_tax_pct = 0 ;
   	 	var f_tax = iAPI.round( iAPI.tofix($scope.row.hdr.f_doc_subtotal) * f_tax_pct / (100 + f_tax_pct ) );
   	 	$scope.row.hdr.f_tax = f_tax;
   	 	
	 	$scope.row.hdr.f_doc_total = iAPI.tofix($scope.row.hdr.f_doc_subtotal) ;
	 }else if( $scope.row.hdr.f_tax_chk == 'exclude' ){
	 	
	 	if( $scope.row.hdr.f_tax_pct == "" || $scope.row.hdr.f_tax_pct == "0" ) $scope.row.hdr.f_tax_pct = $scope.MODEL.vat["vat_pct"];
	 	var f_tax_pct = iAPI.tofix($scope.row.hdr.f_tax_pct);
   	 	if( isNaN(f_tax_pct) ) f_tax_pct = 0 ;
   	 	var f_tax = iAPI.round( iAPI.tofix($scope.row.hdr.f_doc_subtotal) * f_tax_pct /100 );
	 	$scope.row.hdr.f_tax = f_tax;
	 	
   	 	$scope.row.hdr.f_doc_total = iAPI.tofix($scope.row.hdr.f_doc_subtotal) + iAPI.tofix($scope.row.hdr.f_tax) ;	 	
	 }
	 $scope.row.hdr.f_doc_total_text = iAPI.MoneyToWord($scope.row.hdr.f_doc_total);
   	 
   	 

   	 //alert($scope.row.hdr.f_doc_total);
  }  
  
   
  $scope.change_customer = function() {
  	//console.log("change_customer",$scope.options.customer); 
  	var c_setting = angular.fromJson($scope.options.customer.c_setting);
  	console.log(c_setting); 
  	//{"c_tel":"Tel","c_address":"Address","c_zip":"Zip","c_contact":"Contact"}
  	$scope.row.hdr.customer_id = $scope.options.customer.id;
  	$scope.row.hdr.c_customer_name = $scope.options.customer.c_name ;
  	$scope.row.hdr.c_customer_address = c_setting.c_address ;
  	$scope.row.hdr.c_customer_tel = c_setting.c_tel ;
  	$scope.row.hdr.c_customer_taxnumber = c_setting.c_tax_number ;  	
  	$scope.row.hdr.c_customer_price_level = c_setting.price_level ; 
  	
  	$scope.row.hdr.f_doc_discount_pct = c_setting.f_discount_pct ; 
  	  	
  	$scope.row.hdr.i_to = $scope.row.hdr.customer_id;
  	$scope.row.hdr.c_to_name = $scope.options.customer.c_name;
  	$scope.row.hdr.e_to = 'customer';
  	
  }

  $scope.c_type_change = function() {
  	if($scope.row.hdr.c_type=="cash"){
	    $scope.row.hdr.get_last_no = "HS" +$scope.getYearTH+$scope.getMonth;
	    $scope.row.hdr.get_last_no_size = 4;  		
	}else{
		$scope.row.hdr.get_last_no = "IV" +$scope.getYearTH+$scope.getMonth;
	    $scope.row.hdr.get_last_no_size = 4;  	
	}
		    	
    var parameter = { c_code: $scope.row.hdr.get_last_no , size: $scope.row.hdr.get_last_no_size , update : false };  
    iAPI.post('document.get_last_no',parameter).success(function(data) {
   	    console.log("document.get_last_no",data) ;
   		data = angular.fromJson(data);
   		$scope.row.hdr.c_doc_no = data.doc_no ; ;  
    });      
  } 
   
  $scope.row_del = function(idx,row) { 
  	 
	var indexOfRow = $scope.options.rows_dtl.indexOf(row);	
	//alert("idx="+idx +" indexOfRow="+indexOfRow);	
	if(indexOfRow < 0 )indexOfRow = idx;
  	$scope.options.rows_dtl.splice(indexOfRow, 1);
  	//$scope.options.rows_dtl.splice(idx, 1);
 
  	$scope.row_hdr_change();
  }      

  $scope.delete_msg = function() {
	//$scope.row.hdr.e_status = 'delete';	
	$scope.row.c_name = $scope.row.hdr.c_doc_no ;
	$scope.options.display = {};
	$scope.options.display.message1 = "ต้องการลบใบ Sale Order เลขที่ : " + $scope.row.hdr.c_doc_no;
	$scope.options.display.confirmTitle = "ยืนยันลบใบ Sale Order";
  };      
 
  $scope.delete_action = function() {
	$scope.row.hdr.e_status = 'delete';	
	
	url = 'document.edit_doc';
	iAPI.post(url,$scope.row).success(function(res) {
		$scope.theRefashFn();
	});	
		
  }; 
       
 
  
      
  $scope.print_action = function() {
  	$scope.opt = {  
    	report_type: "sale_order", 
    	id: $scope.row.hdr.id,     	
    }; 
    $scope.doc_print($scope.opt);     
  };   
  
  $scope.approve_action = function() {

	  for(var i in $scope.options.rows_dtl){
   	  	var row_dtl = $scope.options.rows_dtl[i];
	  	if( iAPI.tofix(row_dtl.f_quantity) > iAPI.tofix(row_dtl.f_quantity_org) ){
			alert(row_dtl.item_c_name + " ไม่พอที่ขาย \r\n จำนวนที่เหลือ " + row_dtl.f_quantity_org );
   	    	row_dtl.f_quantity = row_dtl.f_quantity_org ;	
   	    	return false;	
		}
	
	 }
	
	//$scope.row.hdr.e_action = 'confirm';	
	var	data = {};
	data.hdr = {};	
	
	data.hdr.id = $scope.row.hdr.id; 	
	data.hdr.c_doc_no = $scope.row.hdr.c_doc_no;
	data.hdr.doc_type = $scope.options.doc_type;	  
	data.hdr.e_action = "confirm";

	url = 'document.update_action_doc';
	iAPI.post(url,angular.copy(data)).success(function(res) {
		
		//2016-06-29
    	//แก้ไขให้ว่า ถ้า e_status != 'active' ไม่ให้ทำงาน
		console.log("update_action_doc",res);
		if( res.e_status == "active" ){
	
			//ตัด stock
		 	url = 'document.insert_stock_card';
			data = {};
			data.id = $scope.row.hdr.id;
			iAPI.post(url,data).success(function(res) {
			 	//alert("ตัด stock ขายลูกค้าทั่วไป เรียบร้อยแล้ว");
			});	
			
		}else{
			alert("ไม่สามารถ Approve และ ตัด stock ได้ เนื่องจาก เอกสาร " + res.c_doc_no + " ถูกแก้ไข กรุณาตรวจสอบและดำเนินการใหม่");
		}		
		
		$scope.theRefashFn();
		
		/*
		//ตัด stock
	 	url = 'document.insert_stock_card';
		data = {};
		data.id = $scope.row.hdr.id;
		iAPI.post(url,data).success(function(res) {
		 	//alert("ตัด stock ขายลูกค้าทั่วไป เรียบร้อยแล้ว");
		});	
		$scope.theRefashFn();	
		*/
			
			
	});		
	 
 	
 		    	 
  }; 
  

  $scope.create_new_order = function() {
	//alert("sale_create");
	
	$scope.options.cols_dtl_th = angular.copy($scope.options.cols_dtl_th1);
    $scope.options.cols_dtl = angular.copy($scope.options.cols_dtl1);
    
	$scope.create_cols_buttons();
	
	iAPI.config["pageTitle_edit"] = "สร้าง";
		 
	$scope.options.disabled = false;
	delete $scope.row.hdr.id ;
	delete $scope.row.id ;
	
	$scope.row.hdr.i_refer_group_id = 0 ;
	$scope.row.hdr.c_refer_group_c_doc_no = "" ;
	$scope.row.hdr.i_refer_id = 0 ;
	$scope.row.hdr.c_refer_c_doc_no = "" ;
	
	$scope.row.hdr.e_status = "active" ;
	$scope.row.hdr.e_action = "create" ;
		
	$scope.row.hdr.d_date = new Date();
    $scope.row.hdr.d_date_send = new Date();
    
    delete $scope.row.hdr.d_create;
    delete $scope.row.hdr.d_confirm;
    delete $scope.row.hdr.d_complete; 
 
    delete $scope.row.hdr.c_type_show;
   	delete $scope.row.hdr.rowBtn;
   	delete $scope.row.hdr.e_status_action;
   	  
 
    $scope.c_type_change();   
 
    $scope.row_hdr_change();
    
    $scope.options.allowOp = 'view,add';   
   
    for(var i in $scope.options.rows_dtl){
    	delete $scope.options.rows_dtl[i].disabled ;
    	delete $scope.options.rows_dtl[i].option_disabled ; 
 		
 		var uofm_id = $scope.options.rows_dtl[i].uofm_id;
		$scope.create_uofm(uofm_id);
		$scope.options.rows_dtl[i].uofm_option = angular.copy($scope.confUofm.receive_uofm);    
    	
	} 


	
    console.log("$scope.options.beforeUpdRow row",$scope.row);
   
		
  };
  
  $scope.create_sale_return = function() {
  	//alert("sale_create");
	
	iAPI.config["pageTitle_edit"] = "สร้างใบลดหนี้/รับคืน";
	$scope.theChgPageFn('form');	
	
	$scope.options.disabled = false;

	
	$scope.row.hdr.i_refer_group_id = angular.copy($scope.row.hdr.id) ;
	$scope.row.hdr.c_refer_group_c_doc_no = angular.copy($scope.row.hdr.c_doc_no) ;
	$scope.row.hdr.i_refer_id = angular.copy($scope.row.hdr.id) ;
	$scope.row.hdr.c_refer_c_doc_no = angular.copy($scope.row.hdr.c_doc_no) ;

	delete $scope.row.hdr.id ;
	delete $scope.row.id ;	 
	
	
	$scope.options.sale_return = true; 
	
 
	$scope.row.hdr.doc_type = "SALE-RETURN";
	$scope.row.hdr.get_last_no = "SR" +$scope.getYearTH+$scope.getMonth;
	$scope.row.hdr.get_last_no_size = 4;  
    var parameter = { c_code: $scope.row.hdr.get_last_no , size: $scope.row.hdr.get_last_no_size , update : false };  
    iAPI.post('document.get_last_no',parameter).success(function(data) {
   	    console.log("document.get_last_no",data) ;
   		data = angular.fromJson(data);
   		$scope.row.hdr.c_doc_no = data.doc_no ; ;  
    });    
	
	$scope.row.hdr.c_refer_date = angular.copy($scope.row.hdr.d_date); 
	$scope.row.hdr.c_return_reason = "";	
		
	$scope.row.hdr.e_status = "active" ;
	$scope.row.hdr.e_action = "create" ;
		
	$scope.row.hdr.d_date = new Date();
    $scope.row.hdr.d_date_send = new Date();
    
    delete $scope.row.hdr.d_create;
    delete $scope.row.hdr.d_confirm;
    delete $scope.row.hdr.d_complete; 
 
    delete $scope.row.hdr.c_type_show;
   	delete $scope.row.hdr.rowBtn;
   	delete $scope.row.hdr.e_status_action;

	if( $scope.row.hdr.f_tax_chk == "include" ){
		$scope.row.hdr.f_doc_summary_old = angular.copy( $scope.row.hdr.f_doc_subtotal ) - angular.copy( $scope.row.hdr.f_tax ) ;
	}else{
		$scope.row.hdr.f_doc_summary_old = angular.copy( $scope.row.hdr.f_doc_subtotal );
	}
	
	$scope.row.hdr.f_doc_summary_new = 0 ;
	$scope.row.hdr.f_doc_summary_def = 0 ;

    
  
    $scope.options.cols_dtl_th = [
      {label:'รับคืน', width:50, },
      {label:'No.', width:50, }, 
      //{label:'hcode', width:60, },
      {label:'รหัส', width:80, },
      {label:'ชื่อ', },
      {label:'จำนวนที่รับคืน',width:100, align:'center', },
      {label:'หน่วย',width:80, align:'center', },
      {label:'ราคา', width:100, align:'center', },
      {label:'จำนวนเงิน', width:100, align:'right', },
    ]
    	
	$scope.options.cols_dtl = [
	  {label:'รับคืน', map: 'chk_add',type:'checkbox', width:40,
	  	changeFn :  function(row){ $scope.row_dtl_sale_return_check(row); },  
	  },
      {label:'No.', map:'id', width:50, format:'index', }, 
      //{label:'hcode', map:'hcode', width:60, },
      {label:'รหัส', map:'item_c_code', width:80, },
      {label:'ชื่อ', map:'item_c_name', }, 
      {label:'จำนวนที่รับคืน', map:'f_quantity', type:'textbox', size:5, align:'right', valid_number:'valid-number', width:60,
      	changeFn :  function(row){ $scope.row_dtl_sale_return_change(row); },   
      }, 
      //{label:'หน่วย', map: 'uofm_c_name', width:80, },
      {label:'หน่วย', map: 'uofm_c_name_show', width:80, },
      //{label:'หน่วย', map: 'uofm_id', type:'select', option:'uofm_option', width:80, },
      {label:'ราคา', map:'f_price' , type:'textbox', size:5, align:'right', width:100, valid_number:'valid-number', 
      	changeFn :  function(row){ $scope.row_dtl_sale_return_change(row); }, 
      },
      {label:'จำนวนเงิน', map:'f_unit_total', width:100, align:'right', },  

    ]
        
    //$scope.create_cols_buttons();    
    
    $scope.row_hdr_change();
    
    $scope.options.allowOp = 'view,add';   
    
    for(var i in $scope.options.rows_dtl){
    	delete $scope.options.rows_dtl[i].disabled ;
    	delete $scope.options.rows_dtl[i].option_disabled ; 
    	
    	$scope.options.rows_dtl[i].disabled = true ; 
    	$scope.options.rows_dtl[i].chk_add = "0" ; 
	} 
	 	
   
    console.log("$scope.options.beforeUpdRow row",$scope.row);
  } 
  
  $scope.row_dtl_sale_return_check = function(row) {
  	if( row.chk_add == "0" ) row.disabled = true;
  	else row.disabled = false;
  	
  	$scope.row_dtl_sale_return_change(row);
  	
  }  
  
  $scope.row_dtl_sale_return_change = function(row) {
  	//alert("555");
  	if( iAPI.tofix(row.f_quantity) <= 0 ){
  		alert("กรุณาอย่าใส่0 หรือตำกว่า 0");
   	    row.f_quantity = 1 ;		
	}   	
	
   	row.f_unit_price = (iAPI.tofix(row.f_quantity)*iAPI.tofix(row.f_price));
   	row.f_unit_total = row.f_unit_price;
   	$scope.row_hdr_sale_return_change();
  }   
 
  $scope.row_hdr_sale_return_change = function(c_discount_type) {
   	 
   	 console.log("row_hdr_sale_return_change" + "  c_discount_type = " + c_discount_type,$scope.row.hdr);  
   	    	 
   	 var f_doc_summary = 0 ;
   	 for(var m in $scope.options.rows_dtl) {
   	 	var value = $scope.options.rows_dtl[m];
   	 	if( value.chk_add == "1" ) f_doc_summary+= iAPI.tofix(value.f_unit_total);
   	 }
   	 
   	  
   	 var f_doc_discount_pct = iAPI.tofix($scope.row.hdr.f_doc_discount_pct);
   	 if( isNaN(f_doc_discount_pct) ) f_doc_discount_pct = 0 ;
   	 if( f_doc_discount_pct == '' )  f_doc_discount_pct = 0 
   	 
   	 if( c_discount_type == "discount_pct" && f_doc_discount_pct == 0 ){   
		$scope.row.hdr.f_doc_discount = 0 ;
	 }else if( f_doc_discount_pct != 0){
		$scope.row.hdr.f_doc_discount = f_doc_summary * (f_doc_discount_pct / 100); 
		$scope.row.hdr.f_doc_discount = iAPI.round($scope.row.hdr.f_doc_discount); 
	}  	 
   	 
   	 $scope.row.hdr.f_doc_summary = f_doc_summary;
   	 $scope.row.hdr.f_doc_subtotal = iAPI.tofix($scope.row.hdr.f_doc_summary) - iAPI.tofix($scope.row.hdr.f_doc_discount);
   	 
     var f_doc_subtotal =  iAPI.tofix($scope.row.hdr.f_doc_subtotal);   	
     var f_doc_summary_old =  iAPI.tofix($scope.row.hdr.f_doc_summary_old);  
     var f_doc_summary_new =  f_doc_summary_old - f_doc_subtotal;
        	 
  

   	 if( $scope.row.hdr.f_tax_chk == 'no_vat' ){
	 	
	 	$scope.row.hdr.f_tax_pct = "";
	 	$scope.row.hdr.f_tax = "";	 	
	 	$scope.row.hdr.f_doc_total = f_doc_subtotal ;
	 	
	 	$scope.row.hdr.f_doc_summary_new = f_doc_summary_new;    	
     	$scope.row.hdr.f_doc_summary_def =f_doc_summary_old - f_doc_summary_new; 
	 	
	 	
	 }else if( $scope.row.hdr.f_tax_chk == 'include' ){
	 	
	 	if( $scope.row.hdr.f_tax_pct == "" || $scope.row.hdr.f_tax_pct == "0" ) 
	 		$scope.row.hdr.f_tax_pct = $scope.MODEL.vat["vat_pct"];
	 		
	 		
	 	var f_tax_pct = iAPI.tofix($scope.row.hdr.f_tax_pct);
   	 	if( isNaN(f_tax_pct) ) f_tax_pct = 0 ;
   	 	var f_tax = iAPI.round( f_doc_subtotal * f_tax_pct / (100 + f_tax_pct ) );
   	 	$scope.row.hdr.f_tax = f_tax;
   	 	
	 	$scope.row.hdr.f_doc_total = f_doc_subtotal ;
	 	
	 	$scope.row.hdr.f_doc_summary_new = f_doc_summary_old - (f_doc_subtotal - f_tax) ;
	 	$scope.row.hdr.f_doc_summary_def = f_doc_subtotal - f_tax; 
	 	
	 	
	 }else if( $scope.row.hdr.f_tax_chk == 'exclude' ){
	 	
	 	if( $scope.row.hdr.f_tax_pct == "" || $scope.row.hdr.f_tax_pct == "0" ) 
	 		$scope.row.hdr.f_tax_pct = $scope.MODEL.vat["vat_pct"];
	 	var f_tax_pct = iAPI.tofix($scope.row.hdr.f_tax_pct);
   	 	if( isNaN(f_tax_pct) ) f_tax_pct = 0 ;
   	 	var f_tax = iAPI.round( f_doc_subtotal * f_tax_pct /100 );
	 	$scope.row.hdr.f_tax = f_tax;
	 	
   	 	$scope.row.hdr.f_doc_total = f_doc_subtotal + iAPI.tofix($scope.row.hdr.f_tax) ;
   	 	
   	 	$scope.row.hdr.f_doc_summary_new = f_doc_summary_new;    	
     	$scope.row.hdr.f_doc_summary_def =f_doc_summary_old - f_doc_summary_new; 	 	
	 } 
	 $scope.row.hdr.f_doc_total_text = iAPI.MoneyToWord($scope.row.hdr.f_doc_total);
   	 

   	 
   	 //$scope.row.hdr.f_doc_summary_old = iAPI.tofix($scope.row.hdr.f_doc_summary_old);
   	 //$scope.row.hdr.f_doc_summary_new = iAPI.tofix($scope.row.hdr.f_doc_summary_new);
   	 
   	 //alert($scope.row.hdr.f_doc_total);
  }  
  
   
 
   
  $scope.setRefashFn = function(theRefashFn) {
      $scope.theRefashFn = theRefashFn;
  };    
  $scope.setSaveFn = function(theSaveFn) { 
      $scope.theSaveFn = theSaveFn;
  };       
   $scope.setDelFn = function(theDelFn) { 
      $scope.theDelFn = theDelFn;
  };
  $scope.setChgPageFn = function(theChgPageFn) { 
      $scope.theChgPageFn = theChgPageFn;
  };
 
  $scope.add_items = function() {
  	
  	$scope.opt = { location_id: $scope.Employee.location_id,
    	id: $scope.Employee.location_id, 
    	price_level: $scope.row.hdr.c_customer_price_level , 
    	parentRow:{},
    	row_group : $scope.MODEL['all_item_group'],
    	display:{
			modal_title:'รายการสินค้า',
		},
    };  
    var modalInstance = $modal.open({
     templateUrl: 'views/operation/saleorder.item.html',
      controller: 'Saleorder.item.Ctrl',
      size: 'lg',
      resolve: {
        options: function () {
          return $scope.opt;
        }
      }
    });
    modalInstance.result.then(function (items) { 
    
     		//console.log('items',items);
 		if( !angular.isUndefined(items["id"]) ){
			if( items["id"] == -1 ) return ;
		}
	
  	 		
 		//console.log('items',items);
  		//console.log('$scope.options.rows_dtl',$scope.options.rows_dtl);
  		for(var m in items) {
 			var value = items[m];
 			
 			var chk = false;
 			for(var i in $scope.options.rows_dtl){
				var rows_dtl = $scope.options.rows_dtl[i];
				if( rows_dtl.item_id == value.item_id){
					chk = true;
					break;
				}
			}
			if(chk){
				alert("เลือก " + value.item_c_name + " ซ้ำ");
				continue;
			}
 			
 			
 			
 			var dtl = angular.copy( $scope.options.rows_dtl_col );
 			for(var i in dtl) {
		 		for(var j in value) {
		 			if( i==j){
						dtl[i]=value[j];
						break;
					}		 				
		 		}
			}	
			dtl.f_quantity_org = value.f_quantity; 
			dtl.c_percent = "% =";
			dtl.f_quantity = 1 ;
			dtl.f_price = value.f_price ;
			dtl.f_unit_price = dtl.f_quantity*dtl.f_price ;
			dtl.f_unit_total = dtl.f_unit_price ;
			  
			dtl.id = $scope.options.rows_dtl.length + 1  ;
			 
			dtl.uofm_c_name_org = angular.copy( dtl.uofm_c_name );			
			dtl.uofm_f_factor = 1;					
			dtl.uofm_option = [];				
			
			//alert(dtl.uofm_c_name_org);
			
			if( !angular.isUndefined(value.c_item_info) ){
				var c_item_info = angular.fromJson(value.c_item_info);
			
				if(!angular.isUndefined(c_item_info.c_uofm_f_factor))
					dtl.uofm_f_factor	= angular.copy(c_item_info.c_uofm_f_factor); 
					
				if(!angular.isUndefined(c_item_info.f_AmountPerPack))
					dtl.f_AmountPerPack	= angular.copy(c_item_info.f_AmountPerPack);	

				if(!angular.isUndefined(c_item_info.c_location_uofm_name))
					dtl.c_location_uofm_name	= angular.copy(c_item_info.c_location_uofm_name); 
					
				if(!angular.isUndefined(c_item_info.c_location_f_factor))
					dtl.c_location_f_factor	= angular.copy(c_item_info.c_location_f_factor); 
									
			}	

			$scope.create_uofm(dtl.location_uofm_id);
  			dtl.uofm_option = angular.copy($scope.confUofm.receive_uofm);  			
			
			for(var i in dtl.uofm_option){				
				if( dtl.location_uofm_id == dtl.uofm_option[i].id ){					 
					dtl.uofm_id = dtl.uofm_option[i].id ;
					dtl.uofm_c_name = dtl.uofm_option[i].c_desc;
					dtl.uofm_f_factor = dtl.uofm_option[i].f_factor;
					dtl.PerUnit = dtl.uofm_option[i].f_factor;
					break;	
				}
				
			}


			//console.log('dtl',dtl);
	 		$scope.options.rows_dtl.push(dtl);
 		}
 		$scope.row_hdr_change();
 		//console.log('$scope.options.rows_dtl',$scope.options.rows_dtl);		 
	   	
    });
  }  
 
  
    
  $scope.open_customer = function () {
   	
   	if( $scope.options.disabled || $scope.options.sale_return ) return ;
   	
    $scope.opt = { 
    	rows: $scope.MODEL['customer'] ,
    	display:{
			modal_title:'เพิ่ม / เลือกลูกค้า'
		},    
    
    };

    var modalInstance = $modal.open({
      templateUrl: 'views/operation/saleorder.customer.html',
      controller: 'Saleorder.customer.Ctrl',
      size: 'lg',
      scope:$scope,
      resolve: {
        options: function () {
          return $scope.opt;
        }
      }
    });
    modalInstance.result.then(function (item) {
    	
      //alert("5555");
      //console.log("open_customer",item);    	
      $scope.MODEL['customer'] = item.rows;   
      //$scope.MODEL['customer'] = rows;        	
      delete item.rows;
      
      if (item.id !=-1){
      	$scope.options.customer = item;
	  	$scope.change_customer();
	  			
      	/*
      	for(var i in $scope.MODEL['customer'] ){
      		//console.log($scope.MODEL['customer'][i]);
			if( $scope.MODEL['customer'][i].id == item.id ){
				$scope.options.customer = $scope.MODEL['customer'][i];
	  			$scope.change_customer();
	  			console.log("return item",$scope.MODEL['customer'][i]);
	  			//alert("5555");
	  			break;
			}
		}
		*/
      	 
	  }
	  
      
    });
  } 

 

}]) 
 
.controller('Saleorder.customer.Ctrl', function ($scope,$modalInstance,$modal,options) {
  $scope.rows = options.rows;
  console.log("Saleorder.customer scope.rows",$scope.rows);
  $scope.options = {
    //allowOp: 'view,update,add,noSearch,search1,search2',
    allowOp: 'view,edit,add,noSearch,search1,search3,noView',
    dataAPI: 'db/customer', 
    cols : [
      {label: 'id', map: 'id', width:60, format:'index',},
      {label: 'รหัส', map: 'c_code', width:120},
      {label: 'ชื่อ', map: 'c_name' },
    ],
    display:options.display,
    predicate:'c_name',  
    reverse:false,
    filter_search1:{
			map:"c_code",
			search:"",
		},
	filter_search3:{
			map:"c_name",
			search:"",
		},
  }  
  //console.log($scope.options);
  $scope.options.display.search1 = "ค้นหารหัส";
  $scope.options.display.search3 = "ค้นหาชื่อ"; 

  $scope.options.beforeGet = function(){
  	$scope.spinner = {active : true};
  }
  $scope.options.afterGetMode = function(rows){
    $scope.spinner = {active : false};
  }
       
  $scope.options.beforeUpdRow = function(row) {     
 	  
  	var c_setting = angular.fromJson(row.c_setting);
  	delete row.c_setting;
  	
  	angular.forEach(c_setting, function(value, key) {
		this[key] = value ;	 	
	}, row); 
  }
  
  
  $scope.options.beforePost = function(row) {
  	if(!row.c_code){
  		alert("Code do must input")
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
 
 	delete row.chk_add;
   	delete row.c_address;  
  	delete row.c_tel;  	
  	delete row.c_tax_number;
  	 	
  	row.c_setting = angular.toJson(c_setting); ;  	
  	
  	return true 
  }
  
 
 
  $scope.options.selectRow = function(idx,row,rows) {    
 	for( var i in rows)
 		rows[i].chk_add = 0;
    row.chk_add = 1;
    
   	//if(row.chk_add==1) row.chk_add = 0;
  	//else row.chk_add = 1;
  }
  
  $scope.options.dbClick = function(idx,row) {  
  	$scope.close(row,$scope.rows);  	
  }
  
  $scope.close = function (item,rows) {
  	//console.log(item);
  	//console.log(rows);
  	  	
   	if( angular.isUndefined(item["rows"]) ) {
   		item["rows"] = rows;    	
   	}
  	  	
  	//console.log("$scope.close",item);
  	/*
  	  	
    var c_setting = {};
  	c_setting.c_address = angular.copy(item.c_address);
  	c_setting.c_tel = angular.copy(item.c_tel);
  	c_setting.c_tax_number = angular.copy(item.c_tax_number);
  	
  	item.c_setting = angular.toJson(c_setting);  
  	
   	//delete item.c_address;  
  	//delete item.c_tel;  	
  	//delete item.c_tax_number;
  	 	
*/
  	  		
    $modalInstance.close(item);
  };
  

   
  $scope.saveAll = function(items) {  
   
    if( !angular.isUndefined(items["rows"]) ) items = items["rows"];
    //alert("99");	
    for( var i in items){
		if(items[i].chk_add == "1"){
			/*			
			if( !angular.isUndefined(items[i].c_setting) ){
				
				//alert("888");
				//$scope.theSaveFn();
								
			  	var c_setting = {};
			  	c_setting.c_address = $scope.row.c_address;
			  	c_setting.c_tel = $scope.row.c_tel;
			  	c_setting.c_tax_number = $scope.row.c_tax_number; 	 	
			  	items[i].c_setting = angular.toJson(c_setting);  	
			  	alert("88");				
			  	
			}
			*/			
						
			$scope.close(items[i],items);
			return ;
		}
	}	
	$scope.close({id:-1,rows:rows}); 
    
  }  ;
  
  $scope.setSaveFn = function(theSaveFn) { 
      $scope.theSaveFn = theSaveFn;
  }; 
  
     
  
})

.controller('Saleorder.item.Ctrl', function ($scope,$modalInstance,$modal,iAPI,options) {
  $scope.rows = null;
  //alert(options.price_level);
  if( angular.isUndefined(options.price_level) ) options.price_level = "201";
  
  $scope.options = {
    allowOp: 'group1',
    dataAPI: '' ,
    transcludeAtTop: true,
    
    //2016-03-03
    //getAPI: 'stock.stock_counting//'+options.location_id +"//201//01" ,
    getAPI: 'stock.stock_counting//'+options.location_id +"//"+options.price_level+"//01" ,
    
    saveAPI: '',
    cols : [
      {label: 'เลือก', map: 'chk_add',type:'checkbox', width:40},
      {label: 'ลำดับ', map: 'c_seq', width:60, align:'right',},
      //{label: 'hcode', map: 'hcode'},
      {label: 'รหัส', map: 'item_c_code', width:80, },
      {label: 'ชื่อ', map: 'item_c_name',},
      {label: 'ราคา', map: 'f_price', width:80, align:'right',},
      //{label: 'ในระบบ', map: 'f_quantity_org', width:80, align:'right',},
      //{label: 'รอส่ง', map: 'f_quantity_do', width:80, align:'right',},
      {label: 'คงเหลือ', map: 'f_quantity', width:80, align:'right',},
      {label: 'หน่วย', map: 'uofm_c_name', width:80, },      
      //{label: 'location_uofm_id', map: 'location_uofm_id', width:80, align:'right',},      
    ],
    editBtn : {
		noShow:true,
	},
    display:options.display,
    parentRow:options.parentRow,
    saveAllFn:function(rows){  
			$scope.saveAll(rows);
		 },
	predicate:'c_seq',
	reverse:false,
  	group: options.row_group,
    row_group : options.row_group[0],
    filter_group : [
    	{map: 'item_group_id' },
    ],
	
  }
  //$scope.options.display.groupDisabled = true;
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
  		 v.c_seq = parseFloat(v.c_seq);
    })
    
  }
   
  $scope.close = function (items) {  	
    $modalInstance.close([]);
  };
 
  $scope.saveAll = function(items) {  
   
    if( !angular.isUndefined(items["rows"]) ) items = items["rows"];
    
    //console.log("saveRowAll",items);
         
	var data = [];
	angular.forEach(items, function(value, key) {
	 	if(value.chk_add == "1")
	 	 	this.push(value);	 	
	}, data);
	 
  	//console.log("saveRowAll data",data);
    
    $modalInstance.close(data);   
    
  }  
   
  
  
})

.controller('Saleorder_returnCtrl', ['$scope', 'iAPI', '$modal', '$filter', '$q', '$window', function ($scope,iAPI,$modal,$filter,$q,$window) {

  var ConfPageTitle = { pageTitle_org : 'ลดหนี้/รับคืนสินค้าลูกค้าทั่วไป ',
  	pageTitle_add_edit : 'รายละเอียด',
  	pageCaption_org : '',
  	pageTitle_edit : ' ',
    pageTitle_table : '',
  };
  iAPI.setConfPageTitle(ConfPageTitle);

  $scope.content_height=$window.innerHeight - $scope.innerHeight ;
  
  $scope.options = {
    allowOp: 'view,edit,group1',
    dataAPI: '',
    getAPI: 'document.get_doc_web/'+'/SALE-RETURN'+'/active/create',
    saveAPI: 'document.save_doc',
    updateAPI: 'document.edit_doc',
    cols : [
      {label: 'No.', map: 'id', width:60, format:'index',},
      {label: 'วันที่', map: 'd_create' },
      {label: 'เลขที่เอกสาร', map: 'c_doc_no' },   
      {label: 'ขายให้', map: 'c_to_name' }, 
      {label: 'อ้างถึงใบกำกับ', map:'c_refer_c_doc_no'  },
    ], 
    itemPerPage:$scope.itemPerPage,
    predicate:'d_create', 
    reverse:true,
    filter_group : [
    	{map: 'e_status_action' },
    ],
    group : [
    	{ e_status_action : "active_create" , c_desc : "ยังไม่อนุมัติ" , c_seq:1 },
    	{ e_status_action : "active_confirm" , c_desc : "อนุมัติแล้ว" , c_seq:2 },
    	{ e_status_action : "delete" , c_desc : "ยกเลิก" , c_seq:3 },
    ],  
    addFnForm:function(row){  
			$scope.addItems(row);
		 },
	editBtn : {
		noShow:true,
	},
	viewBtn : {
		show:false,
	},
	rowBtn : {
		show:true,
	},
	display : {
		groupLable : "สถานะ",
		groupOrderby : " ",
	},
  }
  $scope.options.row_group = $scope.options.group[0]; 
  
  $scope.options.chgMode = function() {
  	$scope.options.allowOp = 'view,edit,group1';
  }
  
        
  //add options
  $scope.options.doc_type = "SALE-RETURN"; 
  $scope.options.rows_dtl =[];
  $scope.options.rows_dtl_col ={id:'',item_id:'',item_c_code:'',item_c_name:'',uofm_id:'',uofm_c_name:'',
  	f_quantity:1,f_price:0,f_unit_price:0,f_discount_pct:0,f_discount:0,f_unit_total:0
  	,hcode:''
  };
  
  
    $scope.options.cols_dtl_th = [
      {label:'No.', width:50, }, 
      //{label:'hcode', width:60, },
      {label:'รหัส', width:60, },
      {label:'ชื่อ', },
      {label:'จำนวนที่รับคืน', width:100, align:'center', },
      {label:'หน่วย', width:100, align:'center', },
      {label:'ราคา', width:100, align:'center', },
      {label:'จำนวนเงิน', width:100, align:'right', },
    ]
    	
	$scope.options.cols_dtl = [
      {label:'No.', map:'id', width:50, format:'index', }, 
      //{label:'hcode', map:'hcode', width:60, },
      {label:'รหัส', map:'item_c_code', width:60, },
      {label:'ชื่อ', map:'item_c_name', }, 
      {label:'จำนวนที่รับคืน', map:'f_quantity', type:'textbox', size:5, align:'right', valid_number:'valid-number', width:60,
      	changeFn :  function(row){ $scope.row_dtl_change(row); },   
      }, 
      {label:'หน่วย', map: 'uofm_c_name_show', width:100, },
      //{label:'หน่วย', map: 'uofm_c_name', width:100, },
      //{label:'หน่วย', map: 'uofm_id', type:'select', option:'uofm_option', width:80, },
      {label:'ราคา', map:'f_price' , type:'textbox', size:5, align:'right', width:100, valid_number:'valid-number', 
      	changeFn :  function(row){ $scope.row_dtl_change(row); }, 
      },
      {label:'จำนวนเงิน', map:'f_unit_total', width:100, align:'right', },  

    ]
    
  $scope.create_cols_buttons = function() { 
	  $scope.options.cols_buttons = [
	      {label:'', btn:'btn-danger', icon : 'ion ion-close', type:'button', width:20,
	       	fn:function(idx,row){ 
				 $scope.row_del(idx,row);
			   },
		  },  
	    ];
  }    
  
  $scope.addItems = function(row) { 
 
   $scope.create_cols_buttons();
    
  }  
   
  $scope.options.afterGet = function(rows){
  	
  	angular.forEach(rows, function(v,k) {
  		if(v.e_status_action=='active_create'){
	        v.rowBtn = {
	          icon:'fa-pencil',  
	        };	 
		}else if(v.e_status_action=='active_confirm'){
	        v.rowBtn = {
	  	 			icon:'fa-search',  
	        };		 
		}else if(v.e_status_action=='delete'){
	        v.rowBtn = {
	  	 			icon:'fa-search',  
	        };	 	
  		} 
 			
    })
    //alert("afterGet");
  	//console.log("afterGet",rows);
  }

  $scope.options.beforeUpdRow = function(row) { 
  
	$scope.create_cols_buttons();
 
  	if(row.e_status_action=='active_confirm' || row.e_status_action=='delete'){
  		$scope.options.allowOp = 'view'; 
  		$scope.options.disabled = true;
  		
  		$scope.options.cols_buttons = [];    
    
  	}
 
  	var row_tmp = angular.copy(row);
  	var row_dtl = angular.copy(row_tmp.dtls);
  	
  	
  	for(var i in row_dtl){
		var c_dtl_info = angular.fromJson(row_dtl[i].c_dtl_info);
		delete row_dtl[i].c_dtl_info;
		angular.forEach(c_dtl_info, function(value, key) {
			this[key] = value ;	 	
		}, row_dtl[i]);
		
		//ส่งให้สาขา
		//"i_add_branch":"1","c_send_to_branch_tel":"กกกกกก","i_send_to_branch":"136","c_add_option_note":"2222"
		if( !angular.isUndefined(row_dtl[i].i_add_branch) ){
			for(var key in $scope.MODEL.location_branch){
				if( $scope.MODEL.location_branch[key].id == row_dtl[i].i_send_to_branch){
					$scope.options.location_branch[i] = $scope.MODEL.location_branch[key];
					break;
				}		
			}
		} 
		
		if(row.e_status_action=='active_confirm' || row.e_status_action=='delete') {
			row_dtl[i].disabled = true;	
			row_dtl[i].option_disabled = true;	
		}
		
		row_dtl[i].uofm_c_name_show = row_dtl[i].uofm_c_name;
		if( parseFloat(row_dtl[i].uofm_f_factor) !='1'){
			if( !angular.isUndefined(row_dtl[i].uofm_c_name_org) )
				row_dtl[i].uofm_c_name_show += "("+parseFloat(row_dtl[i].uofm_f_factor)+row_dtl[i].uofm_c_name_org+")";
			else if( !angular.isUndefined(row_dtl[i].c_receive_uofm_name) )
				row_dtl[i].uofm_c_name_show += "("+parseFloat(row_dtl[i].uofm_f_factor)+row_dtl[i].c_receive_uofm_name+")";
			else 
				row_dtl[i].uofm_c_name_show += "("+parseFloat(row_dtl[i].uofm_f_factor)+")";
		}
		
	} 
	
	
			
		
		

  	delete row_tmp.dtls;
  	$scope.row = {};
  	$scope.row.hdr = row_tmp;  	

  	
  	var c_hdr_info = angular.fromJson($scope.row.hdr.c_hdr_info);
  	delete $scope.row.hdr.c_hdr_info;
  	
  	angular.forEach(c_hdr_info, function(value, key) {
		this[key] = value ;	 	
	}, $scope.row.hdr);
  	
  	$scope.options.rows_dtl = row_dtl;
  	
  	for(var key in $scope.MODEL.customer){
		if( $scope.MODEL.customer[key].id == $scope.row.hdr.i_to){
			$scope.options.customer = $scope.MODEL.customer[key];
			if( angular.isUndefined($scope.row.hdr.c_customer_name) )
				$scope.row.hdr.c_customer_name = $scope.options.customer.c_name;
			break;
		}		
	} 
   
    
   if( !angular.isUndefined($scope.row.hdr.id) ){ 
  		$scope.row.id = $scope.row.hdr.id;
  		  		
  	    if( $scope.row.hdr.e_status == "active" )
  			$scope.row.hdr.e_status = 'edit';
  	} 
	  
  
  	console.log("beforeUpdRow hdr ",$scope.row);
  	console.log("beforeUpdRow dtl",$scope.options.rows_dtl);
  	
  }
  
     
  
  $scope.options.beforePost = function(row) {  	
   	  
   	  if( !angular.isUndefined($scope.row.hdr.f_doc_summary_old))   	
   	  	$scope.row.hdr.f_doc_summary_old = iAPI.tofix($scope.row.hdr.f_doc_summary_old);
   	  if( !angular.isUndefined($scope.row.hdr.f_doc_summary_new))   	
   	 	$scope.row.hdr.f_doc_summary_new = iAPI.tofix($scope.row.hdr.f_doc_summary_new);
   	     	  
   	  delete row.hdr.c_type_show;
   	  delete row.hdr.rowBtn;
   	  delete row.hdr.e_status_action;
   	  
   	  for(var i in $scope.options.rows_dtl){
   	  	delete $scope.options.rows_dtl[i].uofm_c_name_show ;
   	  }
   	  
   	  row.dtl = $scope.options.rows_dtl;
   	    	
  	  return true 
  }

  $scope.options.afterPost = function(row){
	
  }
  
  $scope.row_dtl_change = function(row) {
  	//alert("555");
  	if( iAPI.tofix(row.f_quantity) < 0 ){
  		alert("กรุณาอย่าใส่ตำกว่า 0");
   	    row.f_quantity = 1 ;		
	}   	
   	row.f_unit_price = (iAPI.tofix(row.f_quantity)*iAPI.tofix(row.f_price));
   	row.f_unit_total = row.f_unit_price;
   	$scope.row_hdr_change();
  }   
 
 

  $scope.row_hdr_change = function(c_discount_type) {
   	 
   	 var f_doc_summary = 0 ;
   	 for(var m in $scope.options.rows_dtl) {
   	 	var value = $scope.options.rows_dtl[m];
   	 	f_doc_summary+= iAPI.tofix(value.f_unit_total);
   	 }
   	 
   	  
   	 var f_doc_discount_pct = iAPI.tofix($scope.row.hdr.f_doc_discount_pct);
   	 if( isNaN(f_doc_discount_pct) ) f_doc_discount_pct = 0 ;
   	 if( f_doc_discount_pct == '' )  f_doc_discount_pct = 0 ;
   	 
   	 if( c_discount_type == "discount_pct" && f_doc_discount_pct == 0 ){   
		$scope.row.hdr.f_doc_discount = 0 ;
	 }else if( f_doc_discount_pct != 0){
		$scope.row.hdr.f_doc_discount = f_doc_summary * (f_doc_discount_pct / 100); 
		$scope.row.hdr.f_doc_discount = iAPI.round($scope.row.hdr.f_doc_discount); 
	}  	 
   	 
   	 $scope.row.hdr.f_doc_summary = f_doc_summary;
   	 $scope.row.hdr.f_doc_subtotal = iAPI.tofix($scope.row.hdr.f_doc_summary) - iAPI.tofix($scope.row.hdr.f_doc_discount);
   	 
   	 var f_doc_subtotal =  iAPI.tofix($scope.row.hdr.f_doc_subtotal);   	
     var f_doc_summary_old =  iAPI.tofix($scope.row.hdr.f_doc_summary_old);  
     var f_doc_summary_new =  f_doc_summary_old - f_doc_subtotal;
     
     
   	    
        	 
    	 
   	 if( $scope.row.hdr.f_tax_chk == 'no_vat' ){
	 	
	 	$scope.row.hdr.f_tax_pct = "";
	 	$scope.row.hdr.f_tax = "";	 	
	 	$scope.row.hdr.f_doc_total = f_doc_subtotal ;
	 	
	 	$scope.row.hdr.f_doc_summary_new = f_doc_summary_new;    	
     	$scope.row.hdr.f_doc_summary_def =f_doc_summary_old - f_doc_summary_new; 
	 	
	 }else if( $scope.row.hdr.f_tax_chk == 'include' ){
	 	
	 	if( $scope.row.hdr.f_tax_pct == "" || $scope.row.hdr.f_tax_pct == "0" ) 
	 		$scope.row.hdr.f_tax_pct = $scope.MODEL.vat["vat_pct"];
	 	var f_tax_pct = iAPI.tofix($scope.row.hdr.f_tax_pct);
   	 	if( isNaN(f_tax_pct) ) f_tax_pct = 0 ;
   	 	var f_tax = iAPI.round( f_doc_subtotal * f_tax_pct / (100 + f_tax_pct ) );
   	 	$scope.row.hdr.f_tax = f_tax;
   	 	
	 	$scope.row.hdr.f_doc_total = f_doc_subtotal ;
	 	
	 	$scope.row.hdr.f_doc_summary_new = f_doc_summary_old - (f_doc_subtotal - f_tax) ;
	 	$scope.row.hdr.f_doc_summary_def = f_doc_subtotal - f_tax; 
	 	
	 }else if( $scope.row.hdr.f_tax_chk == 'exclude' ){
	 	
   	
	 	if( $scope.row.hdr.f_tax_pct == "" || $scope.row.hdr.f_tax_pct == "0" ) 
	 		$scope.row.hdr.f_tax_pct = $scope.MODEL.vat["vat_pct"];
	 	var f_tax_pct = iAPI.tofix($scope.row.hdr.f_tax_pct);
   	 	if( isNaN(f_tax_pct) ) f_tax_pct = 0 ;
   	 	var f_tax = iAPI.round( f_doc_subtotal * f_tax_pct /100 );
	 	$scope.row.hdr.f_tax = f_tax;
	 	
   	 	$scope.row.hdr.f_doc_total = f_doc_subtotal + iAPI.tofix($scope.row.hdr.f_tax) ;
   	 	
   	 		 	
	 	$scope.row.hdr.f_doc_summary_new = f_doc_summary_new;    	
     	$scope.row.hdr.f_doc_summary_def =f_doc_summary_old - f_doc_summary_new;    	 	
   	 	
	 }
	 $scope.row.hdr.f_doc_total_text = iAPI.MoneyToWord($scope.row.hdr.f_doc_total);
  
   	 //alert($scope.row.hdr.f_doc_total);
  }  
 
   
  $scope.change_customer = function() {
  	//console.log("change_customer",$scope.options.customer); 
  	var c_setting = angular.fromJson($scope.options.customer.c_setting);
  	console.log(c_setting); 
  	//{"c_tel":"Tel","c_address":"Address","c_zip":"Zip","c_contact":"Contact"}
  	$scope.row.hdr.customer_id = $scope.options.customer.id;
  	$scope.row.hdr.c_customer_address = c_setting.c_address ;
  	$scope.row.hdr.c_customer_tel = c_setting.c_tel ;
  	$scope.row.hdr.c_customer_taxnumber = c_setting.c_tax_number ;  	
  	$scope.row.hdr.c_customer_price_level = c_setting.price_level ; 
  	  	
  	$scope.row.hdr.i_to = $scope.row.hdr.customer_id;
  	$scope.row.hdr.c_to_name = $scope.options.customer.c_name;
  	$scope.row.hdr.e_to = 'customer';
  	
  }
 
   
  $scope.row_del = function(idx,row) { 
  	//ใช้ row ไปหา indexOf ห้ามใช้ idx เด็ดขาด
	var indexOfRow = $scope.options.rows_dtl.indexOf(row);
	//alert("idx="+idx +" indexOfRow="+indexOfRow);	
	if(indexOfRow < 0 )indexOfRow = idx;
  	$scope.options.rows_dtl.splice(indexOfRow, 1);
  	//$scope.options.rows_dtl.splice(idx, 1);

  	$scope.row_hdr_change();
  }      

  $scope.delete_msg = function() {
	//$scope.row.hdr.e_status = 'delete';	
	$scope.row.c_name = $scope.row.hdr.c_doc_no ;
	$scope.options.display = {};
	$scope.options.display.message1 = "ต้องการลบใบลดหนี้/รับคืนสินค้า เลขที่ : " + $scope.row.hdr.c_doc_no;
	$scope.options.display.confirmTitle = "ยืนยันลบใบลดหนี้/รับคืนสินค้า";
  };      
 
  $scope.delete_action = function() {
	$scope.row.hdr.e_status = 'delete';	
	
	url = 'document.edit_doc';
	iAPI.post(url,$scope.row).success(function(res) {
		$scope.theRefashFn();
	});	
		
  }; 
       
 
  
      
  $scope.print_action = function() {
  	$scope.opt = {  
    	report_type: "sale_return", 
    	id: $scope.row.hdr.id,     	
    }; 
    $scope.doc_print($scope.opt);     
  };   
  
  $scope.approve_action = function() {
 
	
	//$scope.row.hdr.e_action = 'confirm';	
	var	data = {};
	data.hdr = {};	
	
	data.hdr.id = $scope.row.hdr.id;	
	data.hdr.c_doc_no = $scope.row.hdr.c_doc_no;
	data.hdr.doc_type = $scope.options.doc_type;	  
	data.hdr.e_action = "confirm";

	url = 'document.update_action_doc';
	iAPI.post(url,angular.copy(data)).success(function(res) {
		
		//2016-06-29
    	//แก้ไขให้ว่า ถ้า e_status != 'active' ไม่ให้ทำงาน
		console.log("update_action_doc",res);
		if( res.e_status == "active" ){
	
			//ตัด stock
		 	url = 'document.insert_stock_card';
			data = {};
			data.id = $scope.row.hdr.id;
			iAPI.post(url,data).success(function(res) {
			 	//alert("ตัด stock ขายลูกค้าทั่วไป เรียบร้อยแล้ว");
			});	
			
		}else{
			alert("ไม่สามารถ Approve และ ตัด stock ได้ เนื่องจาก เอกสาร " + res.c_doc_no + " ถูกแก้ไข กรุณาตรวจสอบและดำเนินการใหม่");
		}		
		
		$scope.theRefashFn();
		
		 
	});		
	 
	/* 
	//ตัด stock
 	url = 'document.insert_stock_card';
	data = {};
	data.id = $scope.row.hdr.id;
	iAPI.post(url,data).success(function(res) {
	 	//alert("ตัด stock ขายลูกค้าทั่วไป เรียบร้อยแล้ว");
	}); 
	*/
 	
 		    	 
  }; 
  
 
    
   
  $scope.setRefashFn = function(theRefashFn) {
      $scope.theRefashFn = theRefashFn;
  };    
  $scope.setSaveFn = function(theSaveFn) { 
      $scope.theSaveFn = theSaveFn;
  };       
   $scope.setDelFn = function(theDelFn) { 
      $scope.theDelFn = theDelFn;
  };
 
  $scope.add_items = function() {
  	
  	$scope.opt = { location_id: $scope.Employee.location_id,
    	id: $scope.Employee.location_id, 
    	price_level: $scope.row.hdr.c_customer_price_level , 
    	parentRow:{},
    	row_group : $scope.MODEL['all_item_group'],
    	display:{
			modal_title:'รายการสินค้า',
		},
    };  
    var modalInstance = $modal.open({
     templateUrl: 'views/operation/saleorder.item.html',
      controller: 'Saleorder.item.Ctrl',
      size: 'lg',
      resolve: {
        options: function () {
          return $scope.opt;
        }
      }
    });
    modalInstance.result.then(function (items) { 
    
     		//console.log('items',items);
 		if( !angular.isUndefined(items["id"]) ){
			if( items["id"] == -1 ) return ;
		}
	
  	 		
 		//console.log('items',items);
  		//console.log('$scope.options.rows_dtl',$scope.options.rows_dtl);
  		for(var m in items) {
 			var value = items[m];
 			
 			var chk = false;
 			for(var i in $scope.options.rows_dtl){
				var rows_dtl = $scope.options.rows_dtl[i];
				if( rows_dtl.item_id == value.item_id){
					chk = true;
					break;
				}
			}
			if(chk){
				alert("เลือก " + value.item_c_name + " ซ้ำ");
				continue;
			}
 			
 			
 			
 			var dtl = angular.copy( $scope.options.rows_dtl_col );
 			for(var i in dtl) {
		 		for(var j in value) {
		 			if( i==j){
						dtl[i]=value[j];
						break;
					}		 				
		 		}
			}	
			dtl.f_quantity_org = value.f_quantity; 
			dtl.c_percent = "% =";
			dtl.f_quantity = 1 ;
			dtl.f_price = value.f_price ;
			dtl.f_unit_price = dtl.f_quantity*dtl.f_price ;
			dtl.f_unit_total = dtl.f_unit_price ;
			  
			dtl.id = $scope.options.rows_dtl.length + 1  ;
			//console.log('dtl',dtl);
	 		$scope.options.rows_dtl.push(dtl);
 		}
 		$scope.row_hdr_change();
 		//console.log('$scope.options.rows_dtl',$scope.options.rows_dtl);		 
	   	
    });
  }  
  
 
  
      
  $scope.open_customer = function () {
   	
   	if( $scope.options.disabled || $scope.row.hdr.id > 0 ) return;
   	
    $scope.opt = { 
    	rows: $scope.MODEL['customer'] ,
    	display:{
			modal_title:'เพิ่ม / เลือกลูกค้า'
		},    
    
    };

    var modalInstance = $modal.open({
      templateUrl: 'views/operation/saleorder.customer.html',
      controller: 'Saleorder.customer.Ctrl',
      size: 'lg',
      scope:$scope,
      resolve: {
        options: function () {
          return $scope.opt;
        }
      }
    });
    modalInstance.result.then(function (item) {
    	
      //alert("5555");
      //console.log("open_customer",item);    	
      $scope.MODEL['customer'] = item.rows;   
      //$scope.MODEL['customer'] = rows;        	
      delete item.rows;
      
      if (item.id !=-1){
      	$scope.options.customer = item;
	  	$scope.change_customer();
	  			
      	/*
      	for(var i in $scope.MODEL['customer'] ){
      		//console.log($scope.MODEL['customer'][i]);
			if( $scope.MODEL['customer'][i].id == item.id ){
				$scope.options.customer = $scope.MODEL['customer'][i];
	  			$scope.change_customer();
	  			console.log("return item",$scope.MODEL['customer'][i]);
	  			//alert("5555");
	  			break;
			}
		}
		*/
      	 
	  }
	  
      
    });
  } 
  
  

}]) 

////////////////////////////////////////////////////////////////////////////////////////////// 
.controller('Eo_settingCtrl', ['$scope', 'iAPI', '$modal', '$filter', '$q', '$window', function ($scope,iAPI,$modal,$filter,$q,$window) {

  var ConfPageTitle = { pageTitle_org : 'การกำหนดวงเงิน',
  	pageTitle_add_edit : ' ',
  	pageCaption_org : '',
  	pageTitle_edit : ' ',
    pageTitle_table : '',
  };
  iAPI.setConfPageTitle(ConfPageTitle);
  
  $scope.options = {
    allowOp: 'view,add,edit,group3',
    dataAPI: '',
    getAPI: 'user.get_all_benefit',
    saveAPI: 'user.save_all_benefit',
    cols : [
      {label: 'id', map: 'id', width:60, format:'index', }, 
      {label: 'เดือน', map: 'd_month_show' }, 
      //{label: 'เดือน', map: 'd_date' },  
    ],
    itemPerPage:12,
    addFnForm:function(row){  
		$scope.addItems(row);
	},	
	filter_group : [
    	{map: 'd_year' },
    ],
    //group : [
    //	{ d_year : "2016" , c_desc : "2559" , c_seq:1 }, 
    //],  
	display : {
		groupLable : "ปี",
		groupOrderby : " ",
	}, 
  }
 
  $scope.options.cols_dtl_th = [
      {label:'No.', width:60, },
      {label:'ฝ่าย', width:150, },   
      {label:'ชื่อ', },
      {label:'วงเงิน', width:100, align:'right', },
      {label:'จำนวนเงินที่ใช้', width:150, align:'right', },
    ];
  $scope.options.cols_dtl = [
      {label:'No.', map:'id', width:60, format:'index', },  
      {label:'ฝ่าย', map:'emp_group', width:150, },
      {label:'ชื่อ', map:'c_user_name', }, 
      {label:'วงเงิน', map:'f_benefit', type:'textbox', size:5, align:'right', valid_number:'valid-number', width:100, },    
      {label:'จำนวนเงินที่ใช้', map: 'f_used',width:150, align:'right', },
    ];

   $scope.options.chgMode = function() {
      $scope.options.allowOp = 'view,add,edit,group3';
   }
  
   $scope.options.getGroup = function() {    
	   iAPI.post('user.get_all_benefit_year',{}).success(function(data) {
	   	    console.log("user.get_all_benefit_year",data) ;
	   		//data = angular.fromJson(data);
	   		$scope.options.group = [];
	   		var chk = 0 ;
	   		for( var i=data.d_year_min ; i<=data.d_year_max ;i++ ){
	   			var row = { d_year : i , c_desc : parseInt(i)+543 , c_seq:i	};
	   			$scope.options.group.push(row);
	   			
	   			if(i==$scope.getFullYear){
					$scope.options.row_group = $scope.options.group[ $scope.options.group.length-1 ];
				}	   				
			}
	   		   
	   })
   }
   $scope.options.getGroup();
   
   $scope.options.afterGet = function(rows) {
  	
  	 
  	angular.forEach(rows, function(v,k) {	  
		v.d_month_show = $scope.getMonthTHname[v.i_month].monthTH + " " + (parseInt(v.d_year)+543) ;		
    })
    
  	console.log("afterGet",rows);
  	 
  }  
  
      
  $scope.addItems = function(row) { 
  
   $scope.row={};
   $scope.row.hdr={};
   //$scope.row.hdr.d_date = new Date();
   
   $scope.options.rows_dtl =[];       
   
   $scope.options.emp_group = $scope.MODEL.all_emp_group[0];
       
   iAPI.post('user.get_user_benefit',{}).success(function(data) {
   	    console.log("user.get_user_benefit",data) ;
   		data = angular.fromJson(data);
   		//alert(data.d_date);
   		var d_date1 = new Date(data.d_date);
   		$scope.row.hdr.d_date = d_date1; 
   		$scope.row.hdr.d_month_show = $scope.getMonthTHname[d_date1.getMonth()+1].monthTH 
   			+ " " + (d_date1.getFullYear()+543)  ;
   		 
   		$scope.options.rows_dtl = data.dtl ;  
   })
   
   console.log("$scope.row",$scope.row);
       
  }    

  $scope.options.beforeUpdRow = function(row) { 

   //$scope.getMonth = "02" ;
 
   var d_date = row.d_date;
   
   var d_date_now = new Date();
   var d_date_chk = d_date_now.getFullYear()+"-"+("00"+(d_date_now.getMonth()+1)).substr(-2)+"-01";
   $scope.options.chk_date = "select date " +  d_date +" and date now "+ d_date_chk;     
   //alert(d_date +" "+ d_date_chk);
   if( d_date < d_date_chk )
   		$scope.options.allowOp = 'view';
    

 
   $scope.row={};
   $scope.row.hdr={};
   
   $scope.options.rows_dtl =[];  
   
   var d_date1 = new Date(row.d_date);
   $scope.row.hdr.d_month_show = $scope.getMonthTHname[d_date1.getMonth()+1].monthTH 
   			+ " " + (d_date1.getFullYear()+543)  ;
   			     
   
   $scope.options.emp_group = $scope.MODEL.all_emp_group[0];
       
   iAPI.post('user.get_user_benefit/'+d_date,{}).success(function(data) {
   	    console.log("user.get_user_benefit",data) ;
   		data = angular.fromJson(data);
   		//alert(data.d_date);
   		$scope.row.hdr.d_date = new Date(data.d_date); 
   		$scope.options.rows_dtl = data.dtl ;  
   })
   
  } 
     
  $scope.options.beforePost = function(row) { 
     $scope.row.dtl=$scope.options.rows_dtl;
     return true;
  }  
      

      
  $scope.options.month_change = function() {  
     return true;
  }  
 
  $scope.options.iFilter_group = function(item) { 
          
    var q = $scope.options.emp_group["c_code"].toString().toLowerCase();
    if(q==''||q=='0')return true; 
    
    q = $scope.options.emp_group["c_desc"].toString().toLowerCase();
	var c = item["emp_group"].toString().toLowerCase();
	//console.log("iFilter_group",c+" "+q)
	if ( c == q) return true;
	    
    return false;
  }
  
    
 

}])  

.controller('Eo_createCtrl', ['$scope', 'iAPI', '$modal', '$filter', '$q', '$window', '$location', function ($scope,iAPI,$modal,$filter,$q,$window,$location) {

  $scope.set_title = function() {
  	 $scope.location_url = $location.url().replace("/", ""); 
  	 //alert(location_url);
  	 var ConfPageTitle = {};
  	 if( $scope.location_url == "eo_create" ){
	 	ConfPageTitle = { pageTitle_org : 'รายการเบิกยาสวัสดิการ',
		  	pageTitle_add_edit : ' ',
		  	pageCaption_org : '',
		  	pageTitle_edit : ' ',
		    pageTitle_table : '',
		  }; 
		
		$scope.options.action = 'create'  ;
		$scope.options.getAPI = 'document.get_doc_web/'+'/EO'+'/active/create/d_start/d_end' ;
		$scope.options.group = [
	    	{ e_status_action : "active_create" , e_status_action2: 'active_confirm' , c_desc : "รออนุมัติ" , c_seq:1 },
    		//{ e_status_action : "active_confirm" , c_desc : "รออนุมัติ" , c_seq:1 },
    		{ e_status_action : "active_complete" , c_desc : "อนุมัติแล้ว" , c_seq:2 },
    		{ e_status_action : "delete" , c_desc : "ยกเลิก" , c_seq:3 },
    	];
    	
		  
	 }else if( $scope.location_url == "eo_complete" ){
	 	ConfPageTitle = { pageTitle_org : 'อนุมัติสวัสดิการ',
		  	pageTitle_add_edit : ' ',
		  	pageCaption_org : '',
		  	pageTitle_edit : ' ',
		    pageTitle_table : '',
		  };
		
		$scope.options.action = 'complete'  ;  
		$scope.options.getAPI = 'document.get_doc_web/'+'/EO'+'/active/confirm/d_start/d_end' ;
		$scope.options.group = [
	    	{ e_status_action : "active_confirm" , c_desc : "รออนุมัติ" , c_seq:2 },
	    	{ e_status_action : "active_complete" , c_desc : "อนุมัติแล้ว" , c_seq:2 },
    	];
    	
	 }else{
	 	ConfPageTitle = { pageTitle_org : 'รายการเบิกยาสวัสดิการ',
		  	pageTitle_add_edit : ' ',
		  	pageCaption_org : '',
		  	pageTitle_edit : ' ',
		    pageTitle_table : '',
		  };
		$scope.options.action = 'create'  ;
		$scope.options.getAPI = 'document.get_doc_web/'+'/EO'+'/active/create/d_start/d_end' ;  
		$scope.options.group = [
	    	{ e_status_action : "active_create" , e_status_action2: 'active_confirm' , c_desc : "รออนุมัติ" , c_seq:1 },
    		//{ e_status_action : "active_confirm" , c_desc : "รออนุมัติ" , c_seq:1 },
    		{ e_status_action : "active_complete" , c_desc : "อนุมัติแล้ว" , c_seq:2 },
    		{ e_status_action : "delete" , c_desc : "ยกเลิก" , c_seq:3 },
    	];
	 }
	 
	 iAPI.setConfPageTitle(ConfPageTitle);
  }
  
  	
 

  $scope.content_height=$window.innerHeight - $scope.innerHeight ;
  
  $scope.options = {
    allowOp: 'view,add,edit,group1,month',
    dataAPI: '',
    getAPI: 'document.get_doc_web/'+'/EO'+'/active/create/d_start/d_end',
    saveAPI: 'document.save_doc',
    updateAPI: 'document.edit_doc',
    cols : [
      {label: 'No.', map: 'id', width:60, format:'index', },
      {label: 'วันที่สร้าง', map: 'd_date', },
      {label: 'เลขที่เอกสาร', map: 'c_doc_no', },
      {label: 'ฝ่าย', map: 'emp_group', },
      {label: 'พนักงาน', map: 'c_to_name', },
      {label: 'รวมจำนวนเงิน', map: 'f_doc_total', align:'right',  },
      {label: 'การยืนยัน', map: 'e_action_show', },
      
    ], 
    itemPerPage:$scope.itemPerPage,
    predicate:'c_doc_no', 
    reverse:true,
    itemPerPage:$scope.itemPerPage,
    predicate:'d_create', 
    reverse:true,
    filter_group : [
    	{map: 'e_status_action' , map2: 'e_status_action2' },
    ],
    group : [
    	{ e_status_action : "active_create" , e_status_action2: 'active_confirm' , c_desc : "รออนุมัติ" , c_seq:1 },
    	//{ e_status_action : "active_confirm" , c_desc : "รออนุมัติ" , c_seq:1 },
    	{ e_status_action : "active_complete" , c_desc : "อนุมัติแล้ว" , c_seq:2 },
    	{ e_status_action : "delete" , c_desc : "ยกเลิก" , c_seq:3 },
    ],  
    addFnForm:function(row){  
			$scope.addItems(row);
		 },
	editBtn : {
		noShow:true,
	},
	viewBtn : {
		show:false,
	},
	rowBtn : {
		show:true,
	},
	display : {
		groupLable : "สถานะ",
		groupOrderby : " ",
	},
	filter_fix1 : {
		search : "",
		map : "c_type",
	},
	actionBtn : {
		show:true,
		text:"ยืนยันการเบิก",
		btnClass:"success",
		btnIcon:"check ",
	},
  }

  
  $scope.set_title();
  $scope.options.row_group = $scope.options.group[0];
   
  $scope.options.chgMode = function() {
  	if( $scope.location_url == "eo_create" ){
  		$scope.options.allowOp = 'view,add,edit,group1,month';
  	}else if( $scope.location_url == "eo_complete" ){
  		$scope.options.allowOp = 'view,group1,month';
  	}
  	
  }
   
 //add options
  $scope.options.doc_type = "EO";
  $scope.options.vendor = 0 ;
  $scope.options.rows_dtl =[];
  $scope.options.rows_dtl_col ={id:'',item_id:'',item_c_code:'',item_c_name:'',uofm_id:'',uofm_c_name:'',
  	f_quantity:1,f_price:0,f_unit_price:0,f_discount_pct:0,f_discount:0,f_unit_total:0
  	,location_uofm_id:0
  	,hcode:''
  };
    
  $scope.options.cols_dtl = [
      {label:'No.', map:'id', width:50, format:'index', }, 
      //{label:'hcode', map:'hcode', width:60, },
      {label:'รหัส', map:'item_c_code', width:60, },
      {label:'ชื่อ', map:'item_c_name', },
      {label:'คงเหลือ', map:'f_quantity_org', width:80, align:'right',  },
      {label:'จำนวน', map:'f_quantity', type:'textbox', size:5, align:'right', valid_number:'valid-number', width:60,
      	changeFn :  function(row){ $scope.row_dtl_change(row); },   
      }, 
      {label:'หน่วย', map: 'uofm_c_name', width:80, },
      //{label:'หน่วย', map: 'uofm_id', type:'select', option:'uofm_option', width:80, },
      //{label:'ราคาขาย', map:'f_price' , type:'textbox', size:5, align:'right', width:70, valid_number:'valid-number', 
      //	changeFn :  function(row){ $scope.row_dtl_change(row); }, 
      //},
      {label:'ราคาขาย', map:'f_price', width:80, align:'right', }, 
      {label:'รวม', map:'f_unit_total', width:80, align:'right', },   
      
    ]
    
  $scope.create_cols_buttons = function() { 
	  $scope.options.cols_buttons = [
	      {label:'', btn:'btn-danger', icon : 'ion ion-close', type:'button', width:20,
	       	fn:function(idx,row){ 
				 $scope.row_del(idx,row);
			   },
		  },  
	    ];
  }    
  
  


  $scope.addItems = function(row) { 
     
     $scope.options.allowOp = 'view';
     $scope.options.id_old = 0;
     
     var d_date = new Date(); 
     $scope.row={};
     $scope.row.hdr={};
     $scope.row.hdr.d_date = d_date ; 
     $scope.row.hdr.f_doc_summary = "0.00";

     $scope.row.hdr.i_from = $scope.Employee.location_id;
     $scope.row.hdr.c_from_name = $scope.Employee.c_location_code;
   
     $scope.create_cols_buttons();
     
     $scope.row.hdr.month_th_name = $scope.getMonthTHname[(d_date.getMonth()+1)].monthTH;
     $scope.row.hdr.year_th_name = d_date.getFullYear()+543 ; 
   
     //alert($scope.getMonthTHname[parseInt($scope.getMonth)].monthTH);       
    	
     $scope.row.hdr.doc_type = $scope.options.doc_type;
    
     //$scope.options.emp_group = $scope.MODEL.all_emp_group[0];
     
     for( var i in $scope.MODEL.emp_group ){
	 	if( $scope.MODEL.emp_group[i].c_desc == $scope.Employee.emp_group ){
     		$scope.row.hdr.get_last_no_size = 5;			
     		$scope.row.hdr.get_last_no = $scope.MODEL.emp_group[i].c_code+"-"+$scope.getYearTH;	
     		
     		$scope.options.emp_group = $scope.MODEL.emp_group[i];
         
		     var parameter = { c_code: $scope.row.hdr.get_last_no , size: $scope.row.hdr.get_last_no_size , update : false };  
		     iAPI.post('document.get_last_no',parameter).success(function(data) {
		   	    console.log("document.get_last_no",data) ;
		   		data = angular.fromJson(data);
		   		$scope.row.hdr.c_doc_no = data.doc_no ; ;  
		     })
         				
			break;
		}
	 }
     	  
   	     
     $scope.options.rows_dtl =[];   
     
     $scope.options.disabled=false;
     $scope.options.disabledNote=false;
     $scope.options.disabledDate=false;
     

   
  }
 
  $scope.options.afterGet = function(rows) {
  	
  	$scope.options.actionBtn.show = false;
  	
  	angular.forEach(rows, function(v,k) {
  		//console.log("c_hdr_info"+v.id +" " + v.doc_type,v.c_hdr_info);
		var c_hdr_info = angular.fromJson(v.c_hdr_info);
		if( !angular.isUndefined(c_hdr_info.emp_group) ) 
			v.emp_group = c_hdr_info.emp_group;
		else v.emp_group = "";
		
		if(v.e_action == "create"){	 
			$scope.options.actionBtn.show = true;
			v.e_action_show = "ยังไม่ยืนยันใบเบิก";
		}else if(v.e_action == "confirm"){	 
			v.e_action_show = "ยืนยันใบเบิกแล้ว";
		}
		else {	 
			v.e_action_show = "";
		}
    })
    
    
  	console.log("afterGet",rows);
  }  
   
  
  $scope.options.beforeUpdRow = function(row) { 

    iAPI.config["pageTitle_edit"] = "แก้ไข";
    
    $scope.options.id_old = angular.copy(row.id);
    
    $scope.create_cols_buttons();
    
    $scope.options.disabledDate=false;
    
  	if( //( row.e_status_action=='active_confirm' && $scope.location_url == "eo_create" )
  	 	row.e_status_action=='active_complete'
  		|| row.e_status_action=='delete'
  		){
  		$scope.options.allowOp = 'view'; 
  		$scope.options.disabled=true;
  		$scope.options.disabledNote=true;
  		$scope.options.disabledDate=true;
  		
  		$scope.options.cols_buttons = [];   
    
  	}else if( row.e_status_action=='active_confirm' && $scope.location_url == "eo_complete" ){
  		
  		$scope.options.allowOp = 'view'; 
		$scope.options.disabledDate=true;
		
		//คำนวนว่า เกินยอดหรือไม่
	}
 
  	var row_tmp = angular.copy(row);
  	var row_dtl = angular.copy(row_tmp.dtls);
  	
  	
  	for(var i in row_dtl){
		var c_dtl_info = angular.fromJson(row_dtl[i].c_dtl_info);
		delete row_dtl[i].c_dtl_info;
		angular.forEach(c_dtl_info, function(value, key) {
			this[key] = value ;	 	
		}, row_dtl[i]);
				
		if( //( row.e_status_action=='active_confirm' && $scope.location_url == "eo_create" )
			 row.e_status_action=='active_complete' 
			|| row.e_status_action=='delete' 			
			) {
			row_dtl[i].disabled = true;	
			row_dtl[i].option_disabled = true;	
		}
		
	} 

  	delete row_tmp.dtls;
  	$scope.row = {};
  	$scope.row.hdr = row_tmp;  	

 
  	
  	var c_hdr_info = angular.fromJson($scope.row.hdr.c_hdr_info);
  	delete $scope.row.hdr.c_hdr_info;
  	
  	angular.forEach(c_hdr_info, function(value, key) {
		this[key] = value ;	 	
	}, $scope.row.hdr);
  	
  	$scope.options.rows_dtl = row_dtl;

	for(var i in $scope.options.rows_dtl){
		$scope.options.rows_dtl[i].f_quantity_old = $scope.options.rows_dtl[i].f_quantity;
	}
 
    
   if( !angular.isUndefined($scope.row.hdr.id) ){ 
  		$scope.row.id = $scope.row.hdr.id;
  		  		
  	    if( $scope.row.hdr.e_status == "active" )
  			$scope.row.hdr.e_status = 'edit';
  	} 
	  
	//alert($scope.row.hdr.e_status_action);
	
	if( row.e_status_action=='active_confirm' && $scope.location_url == "eo_complete" ){
	
		var d_date = $scope.getFullYear+"-"+$scope.getMonth+"-"+"01";  
		//alert(d_date);
		//คำนวนว่า เกินยอดหรือไม่
		iAPI.post('user.get_user_benefit/'+d_date+"//"+ $scope.row.hdr.emp_id,{}).success(function(data) {
   	    	console.log("user.get_user_benefit",data) ;
   			data = angular.fromJson(data);
   			//alert(data.d_date);
   			$scope.row.hdr.d_emp_date = new Date(data.d_date); 
   			$scope.row.hdr.f_benefit = data.dtl[0].f_benefit ;  
   			$scope.row.hdr.f_used = data.dtl[0].f_used ; 
   		})
    		
	}
	
	

    if(row.e_status_action=='active_create' 
    	|| row.e_status_action=='active_confirm' 
    	){

	   iAPI.post('stock.stock_counting_doc/'+$scope.row.hdr.id,{}).success(function(data) {
	   	    //console.log("document.stock_counting_doc",data) ;
	   	    for(var i in data){
				for(var j in $scope.options.rows_dtl){
					if( data[i].item_id == $scope.options.rows_dtl[j].item_id ){
						$scope.options.rows_dtl[j].f_quantity_org = data[i].f_quantity ;
						break;
					}
				}
			}
	   		   
	   })    	
   	
     }
   
   
  	console.log("beforeUpdRow hdr ",$scope.row);
  	console.log("beforeUpdRow dtl",$scope.options.rows_dtl);
  	
  }
  
  
  $scope.options.beforePost = function(row) {  	
   	    	    
   	  if($scope.row.hdr.c_doc_no || $scope.row.hdr.c_doc_no==""){   	    
   	    alert("ไม่มีเลขที่ใบเบิก");
   	   	return ;
   	  }
   	    	    
   	  delete $scope.row.hdr.e_action_show ;
   	    	    
   	  var f_doc_summary = 0 ;  
   	  for(var i in $scope.options.rows_dtl){
   	  	var row_dtl = $scope.options.rows_dtl[i];
	  	if( iAPI.tofix(row_dtl.f_quantity) > iAPI.tofix(row_dtl.f_quantity_org) ){
			alert(row_dtl.item_c_name + " ไม่พอที่เบิก \r\n จำนวนที่เหลือ " + row_dtl.f_quantity_org );
   	    	row_dtl.f_quantity = row_dtl.f_quantity_org ;	
   	    	return false;	
		}
	
	    f_doc_summary+= iAPI.tofix(row_dtl.f_unit_total);
	     
	  }
  	 
   	 var f_benefit = iAPI.tofix($scope.row.hdr.f_benefit);
  	 var f_used = iAPI.tofix($scope.row.hdr.f_used);  	 
  	 f_used+=f_doc_summary;
  	 if(f_benefit<f_used){
	 	alert("จำนวนยอดเงินที่เบิกได้ไม่เพียงพอ");
	 	 	
	 	
	 	return false;	 	
	 }
	 
   	  
   	  delete row.hdr.c_type_show;
   	  delete row.hdr.rowBtn;
   	  delete row.hdr.e_status_action;
   	  
   	  for(var i in $scope.options.rows_dtl){
    	delete $scope.options.rows_dtl[i].disabled ;
    	delete $scope.options.rows_dtl[i].option_disabled ; 
    	delete $scope.options.rows_dtl[i].f_quantity_old ;
	  } 
	
   	  row.dtl = $scope.options.rows_dtl;
   	    	 
  	  return true 
  }
      
  $scope.options.afterPost = function(row){
    
	var c_hdr_info = angular.fromJson(row.c_hdr_info);
	if( !angular.isUndefined(c_hdr_info.emp_group) ) 
		row.emp_group = c_hdr_info.emp_group;
	else row.emp_group = "";	
    
    
    if( $scope.options.id_old != 0 ){
		var url = 'document.edit_doc_eo';
		var data = {};
		data.id_new = row.id;
		data.id_old = $scope.options.id_old;
		iAPI.post(url,angular.copy(data)).success(function(res) {
		 	//alert("ตัด stock ขายลูกค้าทั่วไป เรียบร้อยแล้ว");
		});
	}    
    
  }	     



  $scope.row_dtl_change = function(row) {
  	 
  	
  	if( iAPI.tofix(row.f_quantity) <= 0 ){
  		alert("กรุณาอย่าใส่0 หรือตำกว่า 0");
   	    row.f_quantity = 1 ;		
	}
	
    if( iAPI.tofix(row.f_quantity) > iAPI.tofix(row.f_quantity_org) ){
		alert(row.item_c_name + " ไม่พอที่ขาย \r\n จำนวนที่เหลือ " + row.f_quantity_org );
   	    row.f_quantity = 1 ;		
	}
 	
   	row.f_unit_price = (iAPI.tofix(row.f_quantity)*iAPI.tofix(row.f_price)); 	
   	row.f_unit_total = row.f_unit_price ;
   	
   	$scope.row_hdr_change(row);
  }   
 
  $scope.row_hdr_change = function(row) {
  	   	 
   	 var f_doc_summary = 0 ;
   	 for(var m in $scope.options.rows_dtl) {
   	 	var value = $scope.options.rows_dtl[m];
   	 	f_doc_summary+= iAPI.tofix(value.f_unit_total);
   	 }
   	 
   	 var f_benefit = iAPI.tofix($scope.row.hdr.f_benefit);
  	 var f_used = iAPI.tofix($scope.row.hdr.f_used);  	 
  	 f_used+=f_doc_summary;
  	 if(f_benefit<f_used){
	 	alert("จำนวนยอดเงินที่เบิกได้ไม่เพียงพอ");
	 	
	 	if( angular.isDefined(row) ){
		 	row.f_quantity = row.f_quantity_old ;
		 	row.f_unit_price = (iAPI.tofix(row.f_quantity)*iAPI.tofix(row.f_price)); 	
	   		row.f_unit_total = row.f_unit_price ;			
		}

	 	return ;
	 }
   
  	 
   	 $scope.row.hdr.f_doc_summary = f_doc_summary;
   	 $scope.row.hdr.f_doc_subtotal =  f_doc_summary;
   	 
   	 $scope.row.hdr.f_used_amount = f_used ;
   	 
	 $scope.row.hdr.f_tax_pct = "";
	 $scope.row.hdr.f_tax = "";	 	
	 $scope.row.hdr.f_doc_total = iAPI.tofix($scope.row.hdr.f_doc_subtotal) ;
	 //alert($scope.row.hdr.f_doc_total);
	 $scope.row.hdr.f_doc_total_text = iAPI.MoneyToWord($scope.row.hdr.f_doc_total);
   	 
  }  
  
  $scope.options.actionBtn.action =  function() {
 	
 	var id_list = [];
 	angular.forEach($scope.rows, function(v,k) {
		if( v.e_action == "create" ){
			id_list.push(v.id);
		}
    })
    
    var url = 'document.confirm_doc_eo';
	var data = {};
	data.id_list = id_list;	
	iAPI.post(url,angular.copy(data)).success(function(res) {
		$scope.theRefashFn();
	});
 		
  }  
  
  $scope.change_employee = function() {
 
  	$scope.row.hdr.emp_id = $scope.options.employee.emp_id;
  	$scope.row.hdr.c_emp_name = $scope.options.employee.c_user_name;
  	$scope.row.hdr.f_benefit = $scope.options.employee.f_benefit;
  	$scope.row.hdr.f_used = $scope.options.employee.f_used; 
  	$scope.row.hdr.emp_group = $scope.options.employee.emp_group; 
  	$scope.row.hdr.d_emp_date = $scope.options.employee.d_date;
  	  	
  	//alert( $scope.options.employee.d_date);
  	$scope.row.hdr.i_to = $scope.row.hdr.emp_id;
  	$scope.row.hdr.c_to_name = $scope.options.employee.c_user_name;
  	$scope.row.hdr.e_to = 'employee';
  	
  }
  
  $scope.row_del = function(idx,row) { 
  	//ใช้ row ไปหา indexOf ห้ามใช้ idx เด็ดขาด
	var indexOfRow = $scope.options.rows_dtl.indexOf(row);	
	//alert("idx="+idx +" indexOfRow="+indexOfRow);	
	if(indexOfRow < 0 )indexOfRow = idx;
  	$scope.options.rows_dtl.splice(indexOfRow, 1);
  	//$scope.options.rows_dtl.splice(idx, 1);

 
  	$scope.row_hdr_change();
  }     

  $scope.delete_msg = function() {
	//$scope.row.hdr.e_status = 'delete';	
	$scope.row.c_name = $scope.row.hdr.c_doc_no ;
	$scope.options.display = {};
	$scope.options.display.message1 = "ต้องการลบใบเบิกสวัสดิการพนักงานส่วนกลาง เลขที่ : " + $scope.row.hdr.c_doc_no;
	$scope.options.display.confirmTitle = "ยืนยันลบใบเบิกสวัสดิการพนักงานส่วนกลาง";
  };      
 
  $scope.delete_action = function() {
	$scope.row.hdr.e_status = 'delete';	
	
	url = 'document.edit_doc';
	iAPI.post(url,$scope.row).success(function(res) {
		$scope.theRefashFn();
	});	
		
  }; 
         
      
  $scope.print_action = function() {
  	$scope.opt = {  
    	report_type: "eo", 
    	id: $scope.row.hdr.id,     	
    }; 
    $scope.doc_print($scope.opt);     
  };   
  
  $scope.approve_action = function() {

   	 var f_doc_summary = 0 ;  
   	 for(var i in $scope.options.rows_dtl){
   	   var row_dtl = $scope.options.rows_dtl[i];
	   if( iAPI.tofix(row_dtl.f_quantity) > iAPI.tofix(row_dtl.f_quantity_org) ){
		alert(row_dtl.item_c_name + " ไม่พอที่เบิก \r\n จำนวนที่เหลือ " + row_dtl.f_quantity_org );
   	   	row_dtl.f_quantity = row_dtl.f_quantity_org ;	
   	   	return false;	
	   }
	
	   f_doc_summary+= iAPI.tofix(row_dtl.f_unit_total);
	     
	 }
  	 
   	 var f_benefit = iAPI.tofix($scope.row.hdr.f_benefit);
  	 var f_used = iAPI.tofix($scope.row.hdr.f_used);  	 
  	 f_used+=f_doc_summary;
  	 if(f_benefit<f_used){
	 	alert("จำนวนยอดเงินที่เบิกได้ไม่เพียงพอ")
	 	return false;
	 }
	
	var	data = {};
	data.hdr = {};	
	 	
	data.hdr.id = $scope.row.hdr.id;
	data.hdr.c_doc_no = $scope.row.hdr.c_doc_no;
	data.hdr.doc_type = $scope.options.doc_type;	  
	data.hdr.e_action = "confirm";

	url = 'document.update_action_doc';
	iAPI.post(url,angular.copy(data)).success(function(res) {
		$scope.theRefashFn();
	});		

		    	 
  }; 
  
  $scope.complete_action = function() {

   	 var f_doc_summary = 0 ;  
   	 for(var i in $scope.options.rows_dtl){
   	   var row_dtl = $scope.options.rows_dtl[i];
	   if( iAPI.tofix(row_dtl.f_quantity) > iAPI.tofix(row_dtl.f_quantity_org) ){
		alert(row_dtl.item_c_name + " ไม่พอที่เบิก \r\n จำนวนที่เหลือ " + row_dtl.f_quantity_org );
   	   	row_dtl.f_quantity = row_dtl.f_quantity_org ;	
   	   	return false;	
	   }
	
	   f_doc_summary+= iAPI.tofix(row_dtl.f_unit_total);
	     
	 }
  	 
   	 var f_benefit = iAPI.tofix($scope.row.hdr.f_benefit);
  	 var f_used = iAPI.tofix($scope.row.hdr.f_used);  	 
  	 f_used+=f_doc_summary;
  	 if(f_benefit<f_used){
	 	alert("จำนวนยอดเงินที่เบิกได้ไม่เพียงพอ")
	 	return false;
	 }
	
	var	data = {};
	data.hdr = {};	
	
	data.hdr.id = $scope.row.hdr.id; 	
	data.hdr.c_doc_no = $scope.row.hdr.c_doc_no;
	data.hdr.doc_type = $scope.options.doc_type;	  
	data.hdr.e_action = "complete";
	
	 
	
	data.hdr_update = {};
	data.hdr_update.f_doc_summary = $scope.row.hdr.f_doc_summary;
	data.hdr_update.f_doc_subtotal = $scope.row.hdr.f_doc_subtotal;
	data.hdr_update.f_doc_total = $scope.row.hdr.f_doc_total;
	
	data.c_hdr_info = {};
	data.c_hdr_info.f_doc_total_text = $scope.row.hdr.f_doc_total_text;
	data.c_hdr_info.f_used_amount = f_used ;
	
	 
    for(var i in $scope.options.rows_dtl){
    	delete $scope.options.rows_dtl[i].disabled ;
    	delete $scope.options.rows_dtl[i].option_disabled ; 
	} 
	
   	data.dtl_info = $scope.options.rows_dtl;
   	  
   	  
	url = 'document.update_action_doc';
	iAPI.post(url,angular.copy(data)).success(function(res) {
		$scope.theRefashFn();
	});		
	
	//ตัด stock
 	url = 'document.insert_stock_card';
	data = {};
	data.id = $scope.row.hdr.id;
	iAPI.post(url,angular.copy(data)).success(function(res) {
	 	//alert("ตัด stock ขายลูกค้าทั่วไป เรียบร้อยแล้ว");
	});
	
	//ตัดยอดเงิน	
	url = 'user.update_benefit';
	data = {};
	data.emp_id = $scope.row.hdr.emp_id;
	data.f_benefit = f_benefit;
	data.f_used = f_used;
	//data.d_date = $scope.row.hdr.d_emp_date;
	data.d_date = $scope.getYear+"-"+$scope.getMonth+"-"+"01";  
  
	iAPI.post(url,angular.copy(data)).success(function(res) {
	 	alert("update สวัสดิการเรียบร้อยแล้ว เรียบร้อยแล้ว");
	});
	

	
		    	 
  }; 
   
  $scope.setRefashFn = function(theRefashFn) {
      $scope.theRefashFn = theRefashFn;
  };    
  $scope.setSaveFn = function(theSaveFn) { 
      $scope.theSaveFn = theSaveFn;
  };       
   $scope.setDelFn = function(theDelFn) { 
      $scope.theDelFn = theDelFn;
  };

  $scope.add_items = function() {
  	
  	if( angular.isUndefined($scope.row.hdr.emp_id) ){
  		alert("Employee do must input")
  		return ;	
  	}
  	
  	$scope.opt = { location_id: $scope.Employee.location_id,
    	id: $scope.Employee.location_id, 
    	parentRow:{},
    	row_group : $scope.MODEL['all_item_group'],
    	display:{
			modal_title:'รายการสินค้า',
		},
    };  
    var modalInstance = $modal.open({
     templateUrl: 'views/operation/eo.item.html',
      controller: 'EO.item.Ctrl',
      size: 'lg',
      resolve: {
        options: function () {
          return $scope.opt;
        }
      }
    });
    modalInstance.result.then(function (items) { 
    
     		//console.log('items',items);
 		if( !angular.isUndefined(items["id"]) ){
			if( items["id"] == -1 ) return ;
		}
	
  	 		
 		//console.log('items',items);
  		//console.log('$scope.options.rows_dtl',$scope.options.rows_dtl);
  		for(var m in items) {
 			var value = items[m];
 			
 			var chk = false;
 			for(var i in $scope.options.rows_dtl){
				var rows_dtl = $scope.options.rows_dtl[i];
				if( rows_dtl.item_id == value.item_id){
					chk = true;
					break;
				}
			}
			if(chk){
				alert("เลือก " + value.item_c_name + " ซ้ำ");
				continue;
			}
 			 			
 			var dtl = angular.copy( $scope.options.rows_dtl_col );
 			for(var i in dtl) {
		 		for(var j in value) {
		 			if( i==j){
						dtl[i]=value[j];
						break;
					}		 				
		 		}
			}	
			dtl.f_quantity_org = value.f_quantity; 
			dtl.f_quantity = 0 ;
			dtl.f_quantity_old = 0 ;
			dtl.f_price = value.f_price ;
			dtl.f_unit_price = dtl.f_quantity*dtl.f_price ;
			dtl.f_unit_total = dtl.f_unit_price ;
			  
			dtl.id = $scope.options.rows_dtl.length + 1  ;
			//console.log('dtl',dtl);
	 		$scope.options.rows_dtl.push(dtl);
 		}
 		$scope.row_hdr_change();
 		//console.log('$scope.options.rows_dtl',$scope.options.rows_dtl);		 
	   	
    });
  }  
  
    
  
 
  $scope.openModal_employee = function () {
 	
 	//if($scope.options.rows_dtl.length>0 || $scope.options.disabled ) return ;
 	
  	$scope.opt = {  
    	id: 0, 
    	parentRow:{},
    	d_date: iAPI.GetDay($scope.row.d_date), 
    	display:{
			modal_title:'เลือกพนักงาน'
		}, 
    }; 
    
    var modalInstance = $modal.open({
      templateUrl: 'views/operation/employee.select.html',
      controller: 'Employee.select.Ctrl',
      size: 'lg',
      scope:$scope,
      resolve: {
        options: function () {
          return $scope.opt;
        }
      }
    });
    modalInstance.result.then(function (item) {
       //alert(item);
	   if(item==""){ 
	   }else{
	   		console.log("employee",item);
	   		
	   		/*
	   		console.log("rows",$scope.rows);
	   		for( var i in $scope.rows){
				if( $scope.rows[i].i_to == item[0].emp_id ){
					alert( item[0].c_user_name+"ได้สร้างใบเบิกไปแล้ว");
					
					$scope.options.allowOp = 'view';
					return false;
				}
			}
			*/
	   	  
	   		
		    $scope.options.employee = item[0];
		    $scope.change_employee();
		    
		    $scope.options.allowOp = 'view,add';
		    
		    /*
		    if( $scope.options.employee.emp_code == "" ){
		    	alert("ไม่สามารถสร้างเลขที่ใบเบิกได้ เนื่องจากไม่มีรหัสย่อการสร้าง");
		    	$scope.row.hdr.c_doc_no = "";
				return ;
			}
		     $scope.row.hdr.get_last_no = $scope.options.employee.emp_code+"-"+$scope.getYearTH;
		     
		     var parameter = { c_code: $scope.row.hdr.get_last_no , size: $scope.row.hdr.get_last_no_size , update : false };  
		     iAPI.post('document.get_last_no',parameter).success(function(data) {
		   	    console.log("document.get_last_no",data) ;
		   		data = angular.fromJson(data);
		   		$scope.row.hdr.c_doc_no = data.doc_no ; ;  
		     })
		     */
     
     		var f_benefit = iAPI.tofix($scope.row.hdr.f_benefit);
		  	var f_used = iAPI.tofix($scope.row.hdr.f_used);   
		  	if(f_benefit<=f_used){
		  		
		  	   $scope.options.allowOp = 'view';
		  	   	
			   alert("จำนวนยอดเงินที่เบิกได้ไม่เพียงพอ")
			   return false;
			}
	 
	   } 
    
    });
    
  } 
  
  	
}]) 

.controller('Eo_completeCtrl', ['$scope', 'iAPI', '$modal', '$filter', '$q', '$window', function ($scope,iAPI,$modal,$filter,$q,$window) {

  var ConfPageTitle = { pageTitle_org : ' ใบสรุปยอดเบิกยาสวัสดิการ',
  	pageTitle_add_edit : ' ',
  	pageCaption_org : '',
  	pageTitle_edit : ' ',
    pageTitle_table : '',
  };
  iAPI.setConfPageTitle(ConfPageTitle);
  
  $scope.options = {
    allowOp: 'view,add,edit,group1,mShow',
    dataAPI: '',
    getAPI: 'document.get_doc_web/'+'/EOS'+'/active/create/d_start/d_end',
    saveAPI: 'document.save_doc',
    updateAPI: 'document.edit_doc', 
    cols1 : [
      {label: 'No.', map: 'id', width:60, format:'index', },
      {label: 'วันที่สร้าง', map: 'd_create' },
      {label: 'เลขที่ใบสรุป', map: 'c_doc_no' },
      {label: 'วันที่ขอเบิก', map: 'd_date_send' },
      {label: 'ฝ่าย', map: 'emp_group' },
      {label: 'จำนวนเงิน', map: 'f_doc_total' },
    ],
    cols2 : [
      {label: 'No.', map: 'id', width:60, format:'index', },
      {label: 'วันที่สร้าง', map: 'd_create' },
      {label: 'เลขที่ใบสรุป', map: 'c_doc_no' },
      {label: 'วันที่ขอเบิก', map: 'd_date_send' },
      {label: 'ฝ่าย', map: 'emp_group' },
      {label: 'วันที่อนุมัติ', map: 'd_complete' },      
      {label: 'เลขที่ใบส่งของ', map: 'c_doc_no_send' },	      
      {label: 'จำนวนเงิน', map: 'f_doc_total' },
    ],	 	
    itemPerPage:$scope.itemPerPage,
    addFnForm:function(row){  
		$scope.addItems(row);
	},	
 	filter_group : [
    	{map: 'e_status_action'  },
    ],
    group : [
    	{ e_status_action : "active_create" , c_desc : "รออนุมัติ" , c_seq:1 },  
    	{ e_status_action : "active_complete" , c_desc : "อนุมัติแล้ว" , c_seq:2 },
    	//{ e_status_action : "delete" , c_desc : "ยกเลิก" , c_seq:3 },
    ],  
	display : {
		groupLable : "สถานะ",
		groupOrderby : " ",
	},
   	
  }
  $scope.options.cols = $scope.options.cols1;
  $scope.options.row_group = $scope.options.group[0];

  $scope.options.chgMode = function() {
  	
  	//var chk_MM = false;
  	
  	
  	
  	/*
  	for( var i in $scope.MODEL['emp_group'] ){
		if( $scope.Employee.emp_group == $scope.MODEL['emp_group'].c_desc 
			&& $scope.MODEL['emp_group'].c_code == "MM"  ){
				chk_MM = true;
				break;
			}
	}
	*/
	//alert(chk_MM);
  	//if( $scope.Employee.emp_group == "MM" ) 
  	//if( chk_MM )	
  	
  	//alert( $scope.Employee.emp_group_code );
  	if( $scope.Employee.emp_group_code == "MM" ) 
  		$scope.options.allowOp = 'view,add,edit,group1,mShow';
  	else $scope.options.allowOp = 'view,group1,mShow';
   	     
   	//$scope.options.allowOp = 'view,add,edit,group1,mShow';     
  }
 
  $scope.options.cols_dtl = [
      {label:'No.', map:'id', width:50, format:'index', }, 
      //{label:'hcode', map:'hcode', width:60, },
      {label:'รหัส', map:'item_c_code', width:60, },
      {label:'ชื่อ', map:'item_c_name', },
      //{label:'คงเหลือ', map:'f_quantity_org', width:80, align:'right',  },
      {label:'จำนวน', map:'f_quantity', width:80, align:'right',  },
      //{label:'จำนวน', map:'f_quantity', type:'textbox', size:5, align:'right', valid_number:'valid-number', width:60,
      //	changeFn :  function(row){ $scope.row_dtl_change(row); },   
      //}, 
      {label:'หน่วย', map: 'uofm_c_name', width:80, },
      //{label:'หน่วย', map: 'uofm_id', type:'select', option:'uofm_option', width:80, },
      //{label:'ราคาขาย', map:'f_price' , type:'textbox', size:5, align:'right', width:70, valid_number:'valid-number', 
      //	changeFn :  function(row){ $scope.row_dtl_change(row); }, 
      //},
      {label:'ราคาขาย', map:'f_price', width:80, align:'right', }, 
      {label:'รวม', map:'f_unit_total', width:80, align:'right', },  
    ]

  $scope.options.display.groupChange = function(row){
  	 //alert(row.e_status_action);
  	 if(row.e_status_action=='active_create'){
	 	$scope.options.cols = $scope.options.cols1;
	 }else if(row.e_status_action=='active_complete'){
	 	$scope.options.cols = $scope.options.cols2;	
	 }
  }
 
 
  $scope.options.doc_type = "EOS";
   
  
  
  $scope.addItems = function(row) { 
  
   
   $scope.options.insert_chk = false;
     
   $scope.row={};
   $scope.row.hdr={};
   $scope.row.hdr.f_doc_summary = 0 ; 
   $scope.row.hdr.f_doc_subtotal = 0 ; 
   $scope.row.hdr.f_doc_total = 0 ; 
   $scope.row.hdr.c_note="";
      
   $scope.row.hdr.d_date = $scope.dNow;
   $scope.row.hdr.d_date_send = $scope.dNow;
   
   $scope.row.hdr.i_from = $scope.Employee.location_id;
   $scope.row.hdr.c_from_name = $scope.Employee.c_location_code;
   $scope.row.hdr.i_to = $scope.Employee.location_id;
   $scope.row.hdr.c_to_name = $scope.Employee.c_location_code;     
       
   $scope.row.hdr.doc_type = $scope.options.doc_type;
   $scope.row.hdr.get_last_no = "EOS-"+$scope.getYearTH;
   $scope.row.hdr.get_last_no_size = 5; 
   $scope.row.hdr.get_last_no_substring = 4 ; 	  
 
   $scope.row.hdr.month_th_name = $scope.getMonthTHname[parseInt($scope.getMonth)].monthTH;
   $scope.row.hdr.year_th_name = $scope.getFullYearTH; 
     
       	     
   $scope.options.rows_dtl =[];       
     
   var parameter = { c_code: $scope.row.hdr.get_last_no , size: $scope.row.hdr.get_last_no_size , update : false };  
   iAPI.post('document.get_last_no',parameter).success(function(data) {
   	    console.log("document.get_last_no",data) ;
   		data = angular.fromJson(data);
   		$scope.row.hdr.c_doc_no = data.doc_no.substring(4, 12); 
   })
   
   console.log("$scope.row",$scope.row);
 
 	$scope.open_eo();
  }     
  
        
  $scope.options.afterGet = function(rows) {
  	
  	angular.forEach(rows, function(v,k) {
  		console.log("c_hdr_info"+v.id +" " + v.doc_type,v.c_hdr_info);
		var c_hdr_info = angular.fromJson(v.c_hdr_info);
		if( !angular.isUndefined(c_hdr_info.emp_group) ) 
			v.emp_group = c_hdr_info.emp_group;
		else v.emp_group = "";	
		
		if( !angular.isUndefined(c_hdr_info.c_doc_no_send) ) 
			v.c_doc_no_send = c_hdr_info.c_doc_no_send;
		else v.c_doc_no_send = "";	
 
		
		
    })
    
  	console.log("afterGet",rows);
  }     

  $scope.options.beforeUpdRow = function(row) { 
 
 	/*
 	var chk_MM = false;
  	for( var i in $scope.MODEL['emp_group'] ){
		if( $scope.Employee.emp_group == $scope.MODEL['emp_group'].c_desc 
			&& $scope.MODEL['emp_group'].c_code == "MM"  ){
				chk_MM = true;
				break;
			}
	}
	 
    if( chk_MM ) 
    */
    
    //alert( $scope.Employee.emp_group_code );
  	if( $scope.Employee.emp_group_code == "MM" ) 
    	$scope.options.MM = true;
    else  $scope.options.MM = false;
    
    //$scope.options.MM = true;
 	
 	$scope.options.allowOp = 'view';  	
  	console.log("row_dtl",row);
  	var row_tmp = angular.copy(row);
  	var row_dtl = angular.copy(row_tmp.dtls);
  	row_tmp.c_note = "";
  	
  	var url = 'document.get_doc_eo'+'/'+row_tmp.id;
	iAPI.post(url,{}).success(function(res) {
		//alert("9999");		
		var rows_dtl = $scope.fill_data(res);		 
		$scope.options.rows_dtl = rows_dtl;
	 	console.log("rows_dtl",rows_dtl);		 
	});	
	
  	delete row_tmp.dtls;
  	$scope.row = {};
  	$scope.row.hdr = row_tmp;  	
  	
  	var c_hdr_info = angular.fromJson($scope.row.hdr.c_hdr_info);
  	delete $scope.row.hdr.c_hdr_info;  	
  	angular.forEach(c_hdr_info, function(value, key) {
		this[key] = value ;	 	
	}, $scope.row.hdr);
  	
  	/*
  	for(var i in row_dtl){
		var c_dtl_info = angular.fromJson(row_dtl[i].c_dtl_info);
		delete row_dtl[i].c_dtl_info;
		angular.forEach(c_dtl_info, function(value, key) {
			this[key] = value ;	 	
		}, row_dtl[i]);
	} 
		
  	$scope.options.rows_dtl = row_dtl; 
  	*/
  	
  	//console.log("row_dtl",row_dtl);
  	 
   //alert($scope.row.hdr.e_status_action);
   if( $scope.row.hdr.e_status_action == 'active_create' ){
   	
   	  var parameter = { c_code: "EOC-"+$scope.getYearTH , size: 5 , update: false };  
   	  iAPI.post('document.get_last_no',parameter).success(function(data) {
   	    console.log("document.get_last_no",data) ;
   		data = angular.fromJson(data);
   		$scope.row.hdr.c_doc_no_send = data.doc_no.substring(4, 12); 
   	  })   	
   	
   } else{
   	  $scope.options.disabledNote = true;
   } 
   
 	     
  } 

       
  $scope.options.beforePost = function(row) { 
     
     if(!$scope.options.insert_chk){
	 	$scope.create_action('create');
     	return false;
	 }
	
	 //$scope.row.hdr.f_doc_total = (iAPI.tofix($scope.row.hdr.f_doc_summary)) ; 
	
     row.dtl = $scope.options.rows_dtl;
     
     
     if($scope.options.insert_chk){
  		for( var i in $scope.rows_all ){
			var doc_hdr_id = $scope.rows_all[i].id;
			var tmp_row = {
				tax_code : $scope.rows_all[i].id,
				c_text : $scope.rows_all[i].c_doc_no,
			};
			
			row.dtl.push(tmp_row);
		}   	
     }    
     
     
      
     return true;
  }  

  $scope.options.afterPost = function(row){
    
    if($scope.options.insert_chk){
		
		// ทำใบขอเบิกให้รับเรียบร้อย
		for( var i in $scope.rows_all ){
			var doc_hdr_id = $scope.rows_all[i].id;
			
			var	data = {};
			data.hdr = {};	
			
			data.hdr.id = $scope.rows_all[i].id;	
			data.hdr.c_doc_no = $scope.rows_all[i].c_doc_no;
			data.hdr.doc_type = $scope.rows_all[i].doc_type;	  
			data.hdr.e_action = "confirm";

			var url = 'document.update_action_doc';
			iAPI.post(url,angular.copy(data)).success(function(res) {
				 
			});	
				
		}
		
	}
	
	var c_hdr_info = angular.fromJson(row.c_hdr_info);
	if( !angular.isUndefined(c_hdr_info.emp_group) ) 
		row.emp_group = c_hdr_info.emp_group;
	else row.emp_group = "";	
    
  }	   
 


  $scope.create_action = function(create_approve) {
	
 
	var url = '';
	var data = {};
	
    var tmp_hdr=[];
 	for(var j in $scope.rows_all){
 		var tmp = {
 			id : $scope.rows_all[j].id, 
			c_doc_no : $scope.rows_all[j].c_doc_no,			
		}
 		tmp_hdr.push(tmp);
 	}
 	url = 'document.chk_doc_eo';
 	data = {};
 	data.doc_hdr = tmp_hdr;
 	data.doc_hdr_id = (angular.isUndefined($scope.row.hdr.id))? 0 : $scope.row.hdr.id;
 	//alert(data.doc_hdr_id );
 	console.log('document.chk_doc_eo data',data);
 	iAPI.post(url,angular.copy(data)).success(function(res) {
 		console.log('document.chk_doc_eo',res);
 		if( res.chk == "0" ){
 			var message = "";
			for(var i in res.doc_hdr){
				message+="ใบเบิกนี้ "+ res.doc_hdr[i].c_doc_no+" อยู่ในเลขที่ใบสรุป "+res.doc_hdr[i].ref_c_doc_no+"\r\n";
			}
			alert(message);
			$scope.options.allowOp = 'view'; 
		}
		else {
			
			if( create_approve == 'create' ){
				//alert("create_approve " + create_approve );
				$scope.options.insert_chk = true;
				$scope.theSaveFn();
			}				
			else $scope.approve_action_done();
		}
 	}); 	
 
  }  
  
  $scope.approve_action = function(){
  	  $scope.create_action('approve') ;
  }
  
  //$scope.approve_action_done = function() {		
  $scope.approve_action_done = function() {		
  
 	var url = '';
	var data = {};
	 
	var parameter = { c_code: "EOC-"+$scope.getYearTH , size: 5 };  
	iAPI.post('document.get_last_no',parameter).success(function(res) {
	   	console.log("document.get_last_no",res) ;
	   	res = angular.fromJson(res);
	
	    data = {};
	    data.hdr = {};		   	
	   	
	   	data.hdr_info = {};
	   	data.hdr_info.c_doc_no_send = res.doc_no.substring(4, 12); 
	   		
	 	
	    data.hdr.id = $scope.row.hdr.id;
		//data.hdr.c_doc_no = $scope.row.hdr.c_doc_no;
		data.hdr.doc_type = $scope.row.hdr.doc_type;	  
		data.hdr.e_action = "complete";

		url = 'document.update_action_doc';
		iAPI.post(url,angular.copy(data)).success(function(res) {
			   	  
			//2016-06-29
	    	//แก้ไขให้ว่า ถ้า e_status != 'active' ไม่ให้ทำงาน
			console.log("update_action_doc",res);
			if( res.e_status == "active" ){
			
						
				url = 'document.insert_stock_card';
				data = {};
				data.id = $scope.row.hdr.id;
				iAPI.post(url,angular.copy(data)).success(function(res) {
					//alert("ตัด stock เบิกเรียบร้อยแล้ว");					
				}); 
				
				
				for(var i in $scope.rows_all){
					console.log("rows_all[i]",$scope.rows_all[i]);
					var f_benefit = iAPI.tofix($scope.rows_all[i].f_benefit);
		  	 		var f_used = iAPI.tofix($scope.rows_all[i].f_used);  	 
		  	 		f_used+=$scope.rows_all[i].f_doc_summary;				
					
					data = {};
					data.hdr = {};	
					 	
					data.hdr.id = $scope.rows_all[i].id; 	
					data.hdr.doc_type = $scope.rows_all[i].doc_type;  
					data.hdr.e_action = "complete";
					
					data.c_hdr_info = {};
					data.c_hdr_info.f_used_amount = f_used ;
			
			
					url = 'document.update_action_doc';
					iAPI.post(url,angular.copy(data)).success(function(res) {
						//alert("ตัด stock เรียบร้อยแล้ว");
					});	
					  	 
					//ตัดยอดของแต่ละคน		
					//alert(f_benefit+" "+f_used);
					url = 'user.update_benefit';
					data = {};
					data.emp_id = $scope.rows_all[i].i_to;
					data.f_benefit = f_benefit;
					data.f_used = f_used;
					data.d_date = $scope.getYear+"-"+$scope.getMonth+"-"+"01";  
				  
					iAPI.post(url,angular.copy(data)).success(function(res) {
					 	//alert("update สวัสดิการเรียบร้อยแล้ว เรียบร้อยแล้ว");
					});
					
					
				}
				$scope.print_action2();
			
			}else{
				alert("ไม่สามารถ Approve และ ตัด stock ได้ เนื่องจาก เอกสาร " + res.c_doc_no + " ถูกแก้ไข กรุณาตรวจสอบและดำเนินการใหม่");
			}			
			
			//alert("approve_action");

			$scope.theRefashFn();
					
		});		
		
		
     });	
		    	 
  };        

  $scope.print_action = function() {
  	$scope.opt = {  
    	report_type: "eo_approve", 
    	id: $scope.row.hdr.id,     	
    }; 
    $scope.doc_print($scope.opt);     
  };   
 
  $scope.print_action2 = function() {
  	$scope.opt = {  
    	report_type: "eo_send", 
    	id: $scope.row.hdr.id,     	
    }; 
    $scope.doc_print($scope.opt);     
  };
  
  
  $scope.setRefashFn = function(theRefashFn) {
      $scope.theRefashFn = theRefashFn;
  };
  $scope.setSaveFn = function(theSaveFn) { 
      $scope.theSaveFn = theSaveFn;
  };
  
  $scope.fill_data = function (dtl) {
  	
  	$scope.options.showApprov = false;
  	
  	var rows_emp = [];
  	
    //console.log("dtl",dtl);
    var rows_dtl = [];
    
    $scope.row.hdr.f_doc_summary = 0 ;
    
	for(var j in dtl){
		
		var c_hdr_info = angular.fromJson(dtl[j].c_hdr_info);
		delete dtl[j].c_hdr_info;
		angular.forEach(c_hdr_info, function(value, key) {
			this[key] = value ;	 	
		}, dtl[j]);		
		
		//////////////////////////////////////////////////
		//หา list ของคนก่อน
		var chk_emp = false;
		for(var i in rows_emp){
			if( dtl[j].i_to == rows_emp[i].emp_id ){
				chk_emp = true;
				break;
			}
		}
		if( !chk_emp ){
			var row_emp = {
				emp_id : dtl[j].i_to,
				emp_name : dtl[j].c_to_name,
				f_item_emp_price : 0.00,
			}
			rows_emp.push(row_emp);
		}
		
		
		
		//////////////////////////////////////////////////
		var row_dtl = dtl[j].dtls;
		
		//vadidate ว่า ยอด 1 คน ต้องไม่เกินวงเงิน มองเป็นคนๆ
		
		var f_item_emp_price = 0 ;
		
		for(var i in row_dtl){
			var c_dtl_info = angular.fromJson(row_dtl[i].c_dtl_info);
			delete row_dtl[i].c_dtl_info;
			angular.forEach(c_dtl_info, function(value, key) {
				this[key] = value ;	 	
			}, row_dtl[i]);
			
			//rows_dtl.push(row_dtl[i]);
			
			//คำนวนเงิน
			f_item_emp_price += iAPI.tofix(row_dtl[i].f_unit_total);			
			
			//รวมรายการเข้ด้วยกัน
			var chk_item = false;
			for( var m in rows_dtl){
				
				if( rows_dtl[m].item_id == row_dtl[i].item_id ){
					chk_item = true;
					
					rows_dtl[m].f_quantity = iAPI.tofix(rows_dtl[m].f_quantity) + iAPI.tofix(row_dtl[i].f_quantity);
					rows_dtl[m].f_unit_price = iAPI.tofix(row_dtl[i].f_price)*rows_dtl[m].f_quantity;
					rows_dtl[m].f_unit_total = rows_dtl[m].f_unit_price ;
					
					$scope.row.hdr.f_doc_summary = iAPI.tofix($scope.row.hdr.f_doc_summary) 
						+ iAPI.tofix( iAPI.tofix(row_dtl[i].f_price)*iAPI.tofix(row_dtl[i].f_quantity)) ; 
					
				}
			}
			if(!chk_item){
				delete row_dtl[i].id;
				delete row_dtl[i].doc_hdr_id;
				delete row_dtl[i].c_doc_no;
				
				row_dtl[i].f_quantity = iAPI.tofix(row_dtl[i].f_quantity);
				
				 
				$scope.row.hdr.f_doc_summary = iAPI.tofix($scope.row.hdr.f_doc_summary) + iAPI.tofix(row_dtl[i].f_unit_total) ; 
										
				rows_dtl.push(row_dtl[i]);
			}
			
				
		}	
		
		if($scope.row.hdr.c_note=="")$scope.row.hdr.c_note = dtl[j].c_doc_no;	
		else $scope.row.hdr.c_note += ", "+dtl[j].c_doc_no;		
		
		for(var i in rows_emp){
			if( dtl[j].i_to == rows_emp[i].emp_id ){
				rows_emp[i].f_item_emp_price += f_item_emp_price;
				break;
			}
		}
		
		//alert($scope.row.hdr.f_doc_summary);
			
		$scope.row.hdr.f_doc_subtotal = iAPI.tofix($scope.row.hdr.f_doc_summary) ; 
		$scope.row.hdr.f_doc_total = iAPI.tofix($scope.row.hdr.f_doc_summary); 

				
	}

 	$scope.rows_all = angular.copy(dtl);
 	$scope.rows_emp = angular.copy(rows_emp);
 	console.log("rows_all",$scope.rows_all);
 	console.log("rows_emp",$scope.rows_emp);
 	
 	//ส่งข้อมูลไป varidate 2 อย่าง จำนวนเงินของแต่ละคน กับ จำนวนใบที่ขอเบิก
 	//$scope.rows_all จำนวนใบที่ขอเบิก
 	//$scope.rows_emp จำนวนเงินของแต่ละคนที่ขอเบิก
 	 
 	
 	var url = 'user.check_user_benefit';
 	var data = {};
	data.emp = $scope.rows_emp;
	data.d_date = $scope.getYear+"-"+$scope.getMonth+"-"+"01";  
	console.log("check_user_benefit data",data);
	
	iAPI.post(url,angular.copy(data)).success(function(res) {
		//alert(res);
		console.log("check_user_benefit",res);
		if( res.chk == 0 ){
			var message = '';
			for(var i in res.emp){
				message+=res.emp[i].emp_name + " วงเงินไม่พอเบิก วงเงินที่เหลือ " + res.emp[i].f_used_remain + " บาท" 
					+ " ยอดเงินที่ใช้ครั้งนี้ " +  res.emp[i].f_item_emp_price + " บาท" + "\r\n";
			}
			alert(message);
			$scope.options.allowOp = 'view'; 
			$scope.options.showApprov = false;			 
		}else{			
			$scope.options.showApprov = true;
		}
	});			
 	 	
 	
	return rows_dtl;  	 	
 }  
  
  $scope.open_eo = function () {
   	   	
   $scope.opt = {  
    	id: 0, 
    	parentRow:{},
    	d_date: iAPI.GetDay($scope.row.d_date), 
    	display:{
			modal_title:'เลือกใบเบิกสวัสดิการ'
		}, 
    }; 
    
    var modalInstance = $modal.open({
      templateUrl: 'views/operation/eo.select.html',
      controller: 'Eo.select.Ctrl',
      size: 'lg',
      scope:$scope,
      resolve: {
        options: function () {
          return $scope.opt;
        }
      }
    });
    modalInstance.result.then(function (item) {
       //alert(item);
	   if(item==""){ 
	   }else{
	   		console.log("item_row",item);
	   		
	   		$scope.row.hdr.emp_group = item.hdr.emp_group;
	   		$scope.row.hdr.d_date_send = item.hdr.d_date;
	   		
	   		
	   		var rows_dtl = $scope.fill_data(item.dtl);
	 		console.log("rows_dtl -- ",rows_dtl);	   		 	    
 	    	$scope.options.rows_dtl = rows_dtl;

	   } 
	       
    });
    
    
  }      
 
  	 

}])  

.controller('EO.item.Ctrl', function ($scope,$modalInstance,$modal,iAPI,options) {
  $scope.rows = null;
  $scope.options = {
    allowOp: 'group1',
    dataAPI: '' ,
    transcludeAtTop: true,
    getAPI: 'stock.stock_counting//'+options.location_id +"//201//01/eo/0" ,
    saveAPI: '',
    cols : [
      {label: 'เลือก', map: 'chk_add',type:'checkbox', width:40},
      {label: 'ลำดับ', map: 'c_seq', width:60, align:'right',},
      //{label: 'hcode', map: 'hcode'},
      {label: 'รหัส', map: 'item_c_code', width:80, },
      {label: 'ชื่อ', map: 'item_c_name',},
      {label: 'ราคา', map: 'f_price', width:80, align:'right',},
      //{label: 'รอส่ง', map: 'f_quantity_do', width:80, align:'right',},
      {label: 'คงเหลือ', map: 'f_quantity', width:80, align:'right',},
      {label: 'หน่วย', map: 'uofm_c_name', width:80, },            
    ],
    editBtn : {
		noShow:true,
	},
    display:options.display,
    parentRow:options.parentRow,
    saveAllFn:function(rows){  
			$scope.saveAll(rows);
		 },
	predicate:'c_seq',
	reverse:false,
  	group: options.row_group,
    row_group : options.row_group[0],
    filter_group : [
    	{map: 'item_group_id' },
    ],
	
  }
  //$scope.options.display.groupDisabled = true;
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
  		 v.c_seq = parseFloat(v.c_seq);
    })
    
  }
   
  $scope.close = function (items) {  	
    $modalInstance.close([]);
  };
 
  $scope.saveAll = function(items) {  
   
    if( !angular.isUndefined(items["rows"]) ) items = items["rows"];
    
    //console.log("saveRowAll",items);
         
	var data = [];
	angular.forEach(items, function(value, key) {
	 	if(value.chk_add == "1")
	 	 	this.push(value);	 	
	}, data);
	 
  	//console.log("saveRowAll data",data);
    
    $modalInstance.close(data);   
    
  }  
   
  
  
})

.controller('Eo.select.Ctrl', function ($scope,$modalInstance,$modal,iAPI,options) {
   
  $scope.rows = null;
  $scope.options = {
    allowOp: 'group1,group2,noSearch',
    dataAPI: '' ,
    transcludeAtTop: true,
    //getAPI: 'document.get_doc_web/'+'/EO'+'/active/active_create',
    getAPI: 'document.get_doc_web/'+'/EO'+'/active/active_confirm',    
    saveAPI: '',
    cols : [
      //{label:'No.', map:'id', width:60, format:'index', },
      {label:'เลือก', map: 'chk_add',type:'checkbox', width:100},
      //{label:'ฝ่าย', map:'emp_group', width:120, },  
      {label:'วันที่ใบเบิก', map:'d_create', width:250,},  
      {label:'เลขที่ใบเบิก', map:'c_doc_no', width:200,}, 
      {label:'ผู้ขอเบิก', map:'c_emp_name', width:400, }, 
      
      {label:'รวมจำนวนเงิน', map:'f_doc_total',width:200, align:'right', }, 
      {label:'', map:'', width:100,}, 
      //{label:'จำนวนใบเบิก', map:'countDoc', },       
    ],
    editBtn : {
		noShow:true,
	},
	predicate:'d_create', 
    reverse:false,
    display:options.display,
    parentRow:options.parentRow,
    saveAllFn:function(rows){  
			$scope.saveAll(rows);
		 },
	filter_group : [
    	{map: 'emp_group' , mapSelect: 'c_desc' },
    ],

    //group : [
    //	{ d_year : "2016" , c_desc : "2559" , c_seq:1 }, 
    //],  
    
    filter_group2 : [
    	{map: 'd_date' , mapSelect: 'c_desc' },
    ],   
	display2:{
		groupLable:'วันที่',
		groupOrderby:' ',
	}  		 
  }
  $scope.options.display.groupLable = "ฝ่าย";
  $scope.options.display.groupOrderby = " ";	
  
  $scope.options.display.groupChange = function(row){
  	$scope.options.group2 = row.d_date_list;
  	$scope.options.row_group2 = $scope.options.group2[0];
  }
 

        
  $scope.options.afterGet = function(rows){
 
 	$scope.group = {};
 	$scope.group.emp_group = [];
 	
 	
 	
   	angular.forEach(rows, function(v,k) {
  		//console.log("c_info" + v.item_id ,v.c_info);
  		var c_hdr_info = angular.fromJson(v.c_hdr_info);
  		if( !angular.isUndefined(c_hdr_info.emp_group) ) 
  			v.emp_group = c_hdr_info.emp_group;
  		else v.emp_group = '';
  		
  		if( !angular.isUndefined(c_hdr_info.c_emp_name) ) 
  			v.c_emp_name = c_hdr_info.c_emp_name;
  		else v.c_emp_name = '';
  		
  		v.chk_add = 0;
  		//console.log("c_info11",v);  		
  		
  		//ค้นหาวันที่ และ ฝ่าย
  		var chk_group = false;
  		var chk_index = 0 ;
  		for( var i in $scope.group.emp_group){
			if( $scope.group.emp_group[i].emp_group == v.emp_group ){
				chk_group = true;
				chk_index = i ;
				break;
			}				
		}
		if(!chk_group){
			var row1 = {
				emp_group : v.emp_group,
				c_desc : v.emp_group,
				d_date_list :[
					{d_date:v.d_date, c_desc : v.d_date} 
				],
			} 
			$scope.group.emp_group.push(row1);
		}else{
			
			var d_date_list = $scope.group.emp_group[chk_index].d_date_list;
			var chk_date = false;
			for( var i in d_date_list ){
				if( d_date_list[i].d_date == v.d_date ){
					chk_date = true;
					break;
				}
			}	
			if(!chk_date){
				var row2 = {
					d_date : v.d_date,
					c_desc : v.d_date,
				}
				$scope.group.emp_group[chk_index].d_date_list.push(row2);
			}	
		}
    })
    
    console.log("emp_group",$scope.group.emp_group);
    
    $scope.options.group = $scope.group.emp_group;
    $scope.options.group2 = $scope.group.emp_group[0].d_date_list;
    
    $scope.options.row_group = $scope.options.group[0];
    $scope.options.row_group2 = $scope.options.group2[0];
    
  }
  
  $scope.close = function (items) {  	
    $modalInstance.close([]);
  };
   
  $scope.retrunItem = function(items) { 
  
  	var data = {};
  	data.hdr = items[0];
  	data.dtl = []; 
  	
  	for( var i in items)
  		data.dtl.push(items[i]); 
  	
  	console.log("saveRowAll data",data);
  	$modalInstance.close(data); 
  }
   
  $scope.saveAll = function(items) {  
   
    if( !angular.isUndefined(items["rows"]) ) items = items["rows"];
    
    //console.log("saveRowAll",items);         
	var data = [];
	angular.forEach(items, function(value, key) {
	 	if(value.chk_add == "1")
	 	 	this.push(value);	 	
	}, data);
	
	$scope.retrunItem(data);
  	//console.log("saveRowAll data",data);    
    //$modalInstance.close(data);   
    
  }  
  
})

.controller('Eo.select_old.Ctrl', function ($scope,$modalInstance,$modal,iAPI,options) {
  
   
  $scope.rows = null;
  $scope.options = {
    allowOp: 'group1',
    dataAPI: '' ,
    transcludeAtTop: true,
    getAPI: 'document.get_doc_web/'+'/EO'+'/active/active_create',
    saveAPI: '',
    cols : [
      //{label:'No.', map:'id', width:60, format:'index', },
      {label:'เลือก', map: 'chk_item_id',type:'checkbox', width:70},
      {label:'ฝ่าย', map:'emp_group', width:100, },  
      {label:'วันที่ใบเบิก', map:'d_date', },  
      {label:'เลขที่ใบเบิก', map:'d_date', }, 
      {label:'รวมจำนวนเงิน', map:'d_date', }, 
      //{label:'จำนวนใบเบิก', map:'countDoc', },       
    ],
    editBtn : {
		noShow:true,
	},
    display:options.display,
    parentRow:options.parentRow,
    saveAllFn:function(rows){  
			$scope.saveAll(rows);
		 },
	filter_group : [
    	{map: 'emp_group' , mapSelect: 'c_desc' },
    ],
    //group : [
    //	{ d_year : "2016" , c_desc : "2559" , c_seq:1 }, 
    //],  
	  		 
  }
  $scope.options.display.groupLable = "ฝ่าย";
  $scope.options.display.groupOrderby = " ";	
  $scope.options.group = $scope.MODEL['emp_group'];
 
  //$scope.options.row_group = $scope.options.group[0];
  $scope.rows_all = []; 
  
        
  $scope.options.afterGet = function(rows){
  	//console.log("afterGet",rows);
	//alert("555");
	
	$scope.rows_all = angular.copy(rows);
	
	$scope.rows = [];
	
	var count = 0;
	
	for(var i in $scope.rows_all){
		var chk = false ;
		var chk_date=$scope.rows_all[i].d_date;
		
		var emp_group = "";
		var c_hdr_info = angular.fromJson($scope.rows_all[i].c_hdr_info);
		if( !angular.isUndefined(c_hdr_info.emp_group) ) 
			emp_group = c_hdr_info.emp_group; 
				
		for(var j in $scope.rows){		
			if( chk_date == $scope.rows[j].d_date 
				&& emp_group == $scope.rows[j].emp_group				
				){
				chk=true;
				break;
			}
		}
		//alert(chk);
		if(!chk){		
			var countDoc = 0;
			for(var j in $scope.rows_all){
				
			var emp_group2 = "";
			c_hdr_info = angular.fromJson($scope.rows_all[j].c_hdr_info);
			if( !angular.isUndefined(c_hdr_info.emp_group) ) 
				emp_group2 = c_hdr_info.emp_group; 				
				
				if( chk_date == $scope.rows_all[j].d_date 
				&& emp_group == emp_group2				
				) countDoc++;
			}
			
			var row = {
				id:count,
				emp_group:emp_group,
				d_date:chk_date,
				countDoc:countDoc,
			}
			count++;
			$scope.rows.push(angular.copy(row));
		}
	} 
	

  }
    
  $scope.options.selectRow = function(idx,row,rows) {    
 	for( var i in rows)
 		rows[i].chk_add = 0;
    row.chk_add = 1;
    
  }
  
  $scope.options.dbClick = function(idx,row) {  
  	//alert("dbClick");
  	var data = [row];
  	
  	$scope.retrunItem(data);
  	//$modalInstance.close(data);   
  }
  
  
  $scope.close = function (items) {  	
    $modalInstance.close([]);
  };

  $scope.retrunItem = function(items) { 
  
  	var data = {};
  	data.hdr = items[0];
  	data.dtl = [];
  	for(var i in $scope.rows_all){
  		var chk_date=$scope.rows_all[i].d_date;
		
		var emp_group = "";
		var c_hdr_info = angular.fromJson($scope.rows_all[i].c_hdr_info);
		if( !angular.isUndefined(c_hdr_info.emp_group) ) 
			emp_group = c_hdr_info.emp_group; 
			
		if( chk_date == items[0].d_date && emp_group == items[0].emp_group )
			data.dtl.push($scope.rows_all[i]);	
  	}
  	
  	
  	$modalInstance.close(data); 
  }
   
  $scope.saveAll = function(items) {  
   
    if( !angular.isUndefined(items["rows"]) ) items = items["rows"];
    
    //console.log("saveRowAll",items);         
	var data = [];
	angular.forEach(items, function(value, key) {
	 	if(value.chk_add == "1")
	 	 	this.push(value);	 	
	}, data);
	
	$scope.retrunItem(data);
  	//console.log("saveRowAll data",data);    
    //$modalInstance.close(data);   
    
  }  ;
  
})


.controller('Employee.select.Ctrl', function ($scope,$modalInstance,$modal,iAPI,options) {
  
   
  $scope.rows = null;
  $scope.options = {
    allowOp: '',
    dataAPI: '' ,
    transcludeAtTop: true,
    getAPI: 'user.get_user_benefit/'+options.d_date+'/'+$scope.Employee.emp_group_code,
    saveAPI: '',
    cols : [
      {label:'No.', map:'id', width:60, format:'index', },
      {label:'ฝ่าย', map:'emp_group', width:100, },  
      {label:'ชื่อ', map:'c_user_name', },
      {label:'วงเงิน', map:'f_benefit', width:100, align:'right', },
      {label:'จำนวนเงินที่ใช้', map: 'f_used', width:150, align:'right', },        
    ],
    editBtn : {
		noShow:true,
	},
    display:options.display,
    parentRow:options.parentRow,
    saveAllFn:function(rows){  
			$scope.saveAll(rows);
		 },
  }
      
  $scope.options.afterGet = function(rows){
  	//console.log(rows);
    $scope.rows = rows.dtl;

  }
    
  $scope.options.selectRow = function(idx,row,rows) {    
 	for( var i in rows)
 		rows[i].chk_add = 0;
    row.chk_add = 1;
    
  }
  
  $scope.options.dbClick = function(idx,row) {  
  	//alert("dbClick");
  	var data = [row];
  	
  	var row = data[0];
  	var f_benefit = iAPI.tofix(row.f_benefit);
	var f_used = iAPI.tofix(row.f_used);   
	if(f_benefit<=f_used){
	   alert("จำนวนยอดเงินที่เบิกได้ไม่เพียงพอ")
	   return false;
	}
			
			
  	$modalInstance.close(data);   
  }
  
  
  $scope.close = function (items) {  	
    $modalInstance.close([]);
  };


   
  $scope.saveAll = function(items) {  
   
    if( !angular.isUndefined(items["rows"]) ) items = items["rows"];
    
    //console.log("saveRowAll",items);         
	var data = [];
	angular.forEach(items, function(value, key) {
	 	if(value.chk_add == "1")
	 	 	this.push(value);	 	
	}, data);
	 
	var row = data[0];
  	var f_benefit = iAPI.tofix(row.f_benefit);
	var f_used = iAPI.tofix(row.f_used);   
	if(f_benefit<=f_used){
	   alert("จำนวนยอดเงินที่เบิกได้ไม่เพียงพอ")
	   return false;
	}
	 
  	//console.log("saveRowAll data",data);    
    $modalInstance.close(data);   
    
  }  ;
  
})













