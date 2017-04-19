 angular.module('abAPP.report', [])
 
 .controller('Report01Ctrl', ['$scope', 'iAPI', '$modal', '$filter', '$q', '$window', '$location', function ($scope,iAPI,$modal,$filter,$q,$window,$location) {

  var ConfPageTitle = { pageTitle_org : ' ',
  	pageTitle_add_edit : ' ',
  	pageCaption_org : ' ',
  	pageTitle_edit : ' ',
    pageTitle_table : ' ',
  };
  iAPI.setConfPageTitle(ConfPageTitle);
  
   	
   $scope.content_height=$window.innerHeight - 200 ;
   
   $scope.options = {
   	report : null ,
   	reportOpt : {
		dStart : new Date(),
		dEnd : new Date(),
		pdate : new Date(),
	},
   };
   
   $scope.get_option = function() {
   	  $scope.options.MODEL = {}	; 
 
 	  $scope.options.rp_stock = {};
 

	  iAPI.get('product.get_code/vendor').success(function(data) {
	  	
	  	var vendor = iAPI.iSort(data['vendor'],'id');
	  	data['vendor'] = angular.copy( vendor );
	  	
	  	
	  	var row0 = {};
	  	row0["id"]=row0["vendor_id"]=0;
	  	row0["c_code"]="";row0["c_name"]="ทุกประเภท";
	  	data['vendor'].splice(0,0,row0);
	  	
	  	//console.log('product.get_code/item_group',data['item_group']);        
        $scope.options.MODEL['vendor'] = data['vendor'];
        $scope.options.vendor = $scope.options.MODEL['vendor'][0];
        $scope.change_vendor();
                
        $scope.options.MODEL['vendor_select'] = angular.copy( data['vendor'] );
        $scope.options.MODEL['vendor_select'][0]['c_name']="เลือก";
                
        $scope.options.vendor_from = $scope.options.MODEL['vendor_select'][0];
        $scope.change_vendor_from();
        $scope.options.vendor_to = $scope.options.MODEL['vendor_select'][0];
        $scope.change_vendor_to();
        
        
	  });
	
	  iAPI.get('product.get_code/item_group').success(function(data) {
	  	
	  	//console.log('product.get_code/item_group',data['item_group']);        
        $scope.options.MODEL['item_group'] = angular.copy(data['item_group']);
        
        $scope.options.item_group1 = $scope.options.MODEL['item_group'][0];
        $scope.options.item_group2 = $scope.options.MODEL['item_group'][0];
        
 	  	var row0 = {};
	  	row0["id"]=row0["item_group_id"]=0;
	  	row0["c_code"]="";row0["c_desc"]="ทุกประเภท";
	  	data['item_group'].splice(0,0,row0);       
        $scope.options.MODEL['all_item_group'] = data['item_group'];   
             
        $scope.options.item_group = $scope.options.MODEL['all_item_group'][0];
        $scope.change_item_group();
        
	  });
	
	  iAPI.get('product.get_code/product').success(function(data) {
	  	
	  	console.log('product.get_code/product',data['product']);        
        $scope.options.MODEL['product'] = angular.copy(data['product']);
        $scope.options.product = $scope.options.MODEL['product'][0];
        $scope.change_product();
        
        var row0 = {};
	  	row0["id"]=row0["item_id"]=0;
	  	row0["c_code"]="";row0["c_name"]="ทุกรายการ";
	  	data['product'].splice(0,0,row0);
	  	
        $scope.options.MODEL['product_all'] = angular.copy(data['product']);
        $scope.options.product_all = $scope.options.MODEL['product_all'][0];
        $scope.change_product_all();
        	  	
	  });
	  
	  iAPI.get('product.get_code/customer').success(function(data) {
	  	
	  	
	  	var row0 = {};
	  	row0["id"]=row0["customer_id"]=0;
	  	row0["c_code"]="";row0["c_name"]="ทุกรายการ";
	  	data['customer'].splice(0,0,row0);
	  	
	  	console.log('product.get_code/customer',data['customer']);        
        $scope.options.MODEL['customer'] = data['customer'];
        
        $scope.options.customer = $scope.options.MODEL['customer'][0];
        $scope.change_customer();
        
        
        $scope.options.MODEL['customer_select'] = angular.copy( data['customer'] );
        $scope.options.MODEL['customer_select'][0]['c_name']="เลือก";   
                
        $scope.options.customer_from = $scope.options.MODEL['customer_select'][0];
        $scope.change_customer_from();
        $scope.options.customer_to = $scope.options.MODEL['customer_select'][0];
        $scope.change_customer_to();
        
	  });
	  
	  iAPI.get('product.get_code/location_branch').success(function(data) {
	  	 
	  	var location_branch = iAPI.iSort(data['location_branch'],'id');
	  	data['location_branch'] = angular.copy( location_branch );
	  	
	  	//console.log(location_branch);
	  	
	  	var row0 = {};
	  	row0["id"]=row0["location_id"]=0;
	  	row0["c_code"]="";row0["c_name"]="เลือก";
	  	data['location_branch'].splice(0,0,row0);
	  	
	  	
	  	console.log('product.get_code/location_branch',data['location_branch']);        
        $scope.options.MODEL['location_branch'] = data['location_branch'];
        $scope.options.location_branch_from = $scope.options.MODEL['location_branch'][0];
        $scope.change_location_branch_from();
        $scope.options.location_branch_to = $scope.options.MODEL['location_branch'][0];
        $scope.change_location_branch_to();
        
	  });
	  
   }
 


    $scope.set_title = function() { 
          	
	  	$scope.location_url = $location.url().replace("/", ""); 
	  	 
	  	
	  	var url = 'report'; 
	  	if( $scope.location_url == "stock_counting_main_report" ){
	 
	   		 url = 'report/rp_counting_stock'; 			   
		} 
		 
	   iAPI.get(url).success(function(data) {
	   	 console.log("report",data) ; 
	   	 $scope.options.reports = data;
	   	 $scope.options.report = $scope.options.reports[0];
	   	 $scope.change_report();
	   	 $scope.get_option();
	   }) 	 
		 
   }	 
   $scope.set_title();	    
				
   //$scope.options.reportOpt.dStart = new Date();
   //$scope.options.reportOpt.dEnd = new Date();  
     
   
   $scope.stop_start_report = function() {
      iAPI.post('report.jasper_stop',{}).success(function(data) {
   	       iAPI.post('report.jasper_start',{}).success(function(data) {
   	       		alert("Report Stop / Start Done");
   	       });
      })
      	
   }
   
   
   $scope.change_report = function() {
     //$scope.options.reportOpt.dStart = new Date();
     //$scope.options.reportOpt.dEnd = new Date();    	
   }
   $scope.change_vendor = function() {   
      $scope.options.reportOpt.sub_id = $scope.options.vendor.id;    	
   }    
   $scope.change_vendor_from = function() {   
      $scope.options.reportOpt.sub_from = $scope.options.vendor_from.id;    
   } 
   $scope.change_vendor_to = function() {   
      $scope.options.reportOpt.sub_to = $scope.options.vendor_to.id;    
   } 
   $scope.change_item_group = function() {   
  	  $scope.options.reportOpt.cate_id = $scope.options.item_group.id; 
   } 
   $scope.change_product = function() {  
  	  $scope.options.reportOpt.item_id = $scope.options.product.id; 
   } 
   $scope.change_product_all = function() {  
  	  $scope.options.reportOpt.item_all_id = $scope.options.product_all.id; 
   }
   $scope.change_customer = function() {  
  	  $scope.options.reportOpt.cus_id = $scope.options.customer.id; 
  	  $scope.options.reportOpt.cus_from = $scope.options.customer.id; 
   }
   $scope.change_customer_from = function() {  
  	  $scope.options.reportOpt.cus_from = $scope.options.customer_from.id; 
   } 
   $scope.change_customer_to = function() {  
  	  $scope.options.reportOpt.cus_to = $scope.options.customer_to.id; 
   } 
   $scope.change_location_branch_from = function() {  
  	  $scope.options.reportOpt.location_branch_id = $scope.options.location_branch_from.id; 
  	  $scope.options.reportOpt.location_from = $scope.options.location_branch_from.id; 
   }
   $scope.change_location_branch_to = function() {  
  	  $scope.options.reportOpt.location_to = $scope.options.location_branch_to.id; 
   } 
			
   $scope.get_date = function(d_date) {
   		//var d_date = $scope.options.reportOpt[c_type[key]]; 
		var getMonth = ("00"+(d_date.getMonth()+1)).substr(-2);
       	var getDate = ("00"+(d_date.getDate())).substr(-2);
       	return d_date.getFullYear()+"-"+getMonth+"-"+getDate;
   }
   $scope.get_option_chk = function(opt,chk_item) {
   	
   		//console.log(chk_item);
	   	for( var i in chk_item){
			opt[chk_item[i]] = "0";
			if( angular.isDefined($scope.options.rp_stock[chk_item[i]]) )
		 		opt[chk_item[i]] = $scope.options.rp_stock[chk_item[i]]; 
		}
		
	   	//opt["noPrint"] = 0;
		//if( angular.isDefined($scope.options.rp_stock["noPrint"]) 
		//	opt["noPrint"] = $scope.options.rp_stock["noPrint"]; 
	 	return opt;
   }   
   $scope.get_option_report3 = function(opt_send) {
   	
   		var opt = {};
	   	opt["c_code_start"] = 0;
 		opt["c_code_end"] = 0;
	 	opt["cate_id_start"] = 0;
	 	opt["cate_id_end"] = 0;
	  
	  	if( angular.isDefined($scope.options.rp_stock["item1_code"]) 
	  		|| angular.isDefined($scope.options.rp_stock["item2_code"])  ){
	  			
	  		if( angular.isDefined($scope.options.rp_stock["item1_code"]) ){
				opt["c_code_start"] = $scope.options.rp_stock["item1_code"];
				
				if( angular.isDefined($scope.options.rp_stock["item2_code"]) )
	  				opt["c_code_end"] = $scope.options.rp_stock["item2_code"];
	  			else opt["c_code_end"] = opt["c_code_start"];	
	  			
			}else if( angular.isDefined($scope.options.rp_stock["item2_code"]) ){
				
				opt["c_code_start"] = $scope.options.rp_stock["item2_code"];
				opt["c_code_end"] = opt["c_code_start"];		  			
	  			
			}	  				  			  			
			
		}else{			
			//opt["cate_id_start"] = $scope.options.item_group1.id;
			//opt["cate_id_end"] = $scope.options.item_group2.id;	
			opt["cate_id_start"] = $scope.options.item_group1.c_seq;
			opt["cate_id_end"] = $scope.options.item_group2.c_seq;			 
		}	 				
		
		for(var i in opt)
	 		if(opt[i]===0) delete opt[i];
	 		else opt_send[i]=opt[i];	
	 		
   	  return opt_send;
   }
 
    $scope.get_option_report2 = function(opt_send) {
   	
   		var opt = {};
	   	opt["c_code_start"] = 0;
 		opt["c_code_end"] = 0;
	 	opt["cate_id_start"] = 0;
	 	opt["cate_id_end"] = 0;
	  
	  	if( angular.isDefined($scope.options.rp_stock["item1_id"]) 
	  		|| angular.isDefined($scope.options.rp_stock["item2_id"])  ){
	  			
	  		if( angular.isDefined($scope.options.rp_stock["item1_id"]) ){
				opt["c_code_start"] = $scope.options.rp_stock["item1_id"];
				
				if( angular.isDefined($scope.options.rp_stock["item2_id"]) )
	  				opt["c_code_end"] = $scope.options.rp_stock["item2_id"];
	  			else opt["c_code_end"] = opt["c_code_start"];	
	  			
			}else if( angular.isDefined($scope.options.rp_stock["item2_id"]) ){
				
				opt["c_code_start"] = $scope.options.rp_stock["item2_id"];
				opt["c_code_end"] = opt["c_code_start"];		  			
	  			
			}	  				  			  			
			
		}else{			
			//opt["cate_id_start"] = $scope.options.item_group1.id;
			//opt["cate_id_end"] = $scope.options.item_group2.id;	
			opt["cate_id_start"] = $scope.options.item_group1.c_seq;
			opt["cate_id_end"] = $scope.options.item_group2.c_seq;		 
		}	 				
		
		//for(var i in opt)
	 	//	if(opt[i]===0) delete opt[i];
	 	//	else opt_send[i]=opt[i];
	 	
	 	for(var i in opt) opt_send[i]=opt[i];
	 		
   	  return opt_send;
   }
   
     
   $scope.get_option_report = function(opt_send) {
   	
   		var opt = {};
	   	opt["item_id_start"] = 0;
 		opt["item_id_end"] = 0;
	 	opt["cate_id_start"] = 0;
	 	opt["cate_id_end"] = 0;
	  
	  	if( angular.isDefined($scope.options.rp_stock["item1_id"]) 
	  		|| angular.isDefined($scope.options.rp_stock["item2_id"])  ){
	  			
	  		if( angular.isDefined($scope.options.rp_stock["item1_id"]) ){
				opt["item_id_start"] = $scope.options.rp_stock["item1_id"];
				
				if( angular.isDefined($scope.options.rp_stock["item2_id"]) )
	  				opt["item_id_end"] = $scope.options.rp_stock["item2_id"];
	  			else opt["item_id_end"] = opt["item_id_start"];	
	  			
			}else if( angular.isDefined($scope.options.rp_stock["item2_id"]) ){
				
				opt["item_id_start"] = $scope.options.rp_stock["item2_id"];
				opt["item_id_end"] = opt["item_id_start"];		  			
	  			
			}	  				  			  			
			
		}else{			
			//opt["cate_id_start"] = $scope.options.item_group1.id;
			//opt["cate_id_end"] = $scope.options.item_group2.id;		
			opt["cate_id_start"] = $scope.options.item_group1.c_seq;
			opt["cate_id_end"] = $scope.options.item_group2.c_seq;		 
		}	 		
		
		for(var i in opt)
	 		if(opt[i]===0) delete opt[i];
	 		else{ 	 		
	 			opt_send[i.substring(5)]=  i.substring(0,4) + opt[i];		
	 		}
		
   	  return opt_send;
   }
   
      				
   $scope.get_report = function(report_output) {
   	   	
   	 console.log("options.report",$scope.options.report);
    	 
   	 var opt = {
	 	report_type : $scope.options.report.report_type,
	 }
	 
	 if($scope.options.report.php_fn != "" )
	 	opt["php_fn"] = $scope.options.report.php_fn;
	 	
	 
	 var c_type = $scope.options.report.c_type.split(",");
	 for( key in c_type ){
	 	if( c_type[key]=="dStart" || c_type[key]=="dEnd" || c_type[key]=="pdate" ){
  			opt[c_type[key]] = $scope.get_date( $scope.options.reportOpt[c_type[key]] );
		}else if( c_type[key]=="item_all_id" ){
			opt["item_id"] = $scope.options.reportOpt[c_type[key]];
		}else{
			opt[c_type[key]] = $scope.options.reportOpt[c_type[key]];
		}
	 }   	 
	 
	   	
     var url = iAPI.conf.baseUrl+"report.get_report";
     if( report_output == "excel" )
     	url = iAPI.conf.baseUrl+"report.get_report_excel";
     else if( report_output == "csv" )
     	url = iAPI.conf.baseUrl+"report.get_report_csv";
     
     if( $scope.options.report.c_type.indexOf('rp_outstanding_stock') > -1){
	  
	  	opt["pdate"] = $scope.get_date( $scope.options.reportOpt.pdate );
	 	
	 	opt = $scope.get_option_report2(opt);	   
       
	 	delete opt['rp_outstanding_stock'];
	 } else if( $scope.options.report.c_type.indexOf('rp_history_stock') > -1){
	  
	  	opt["dStart"] = $scope.get_date( $scope.options.reportOpt.dStart );
	 	opt["dEnd"] = $scope.get_date( $scope.options.reportOpt.dEnd );
	 	
	 	opt = $scope.get_option_report(opt);	 		
	 	opt = $scope.get_option_chk(opt,['transection']);
	 	       
	 	delete opt['rp_history_stock'];
	 	
	 	if( $scope.options.rp_stock.rp_history_detail_stock == "1"){
			opt["report_type"] = "rp_history_detail_stock" ;
			opt["php_fn"] = "rp_history_detail_stock" ;
		}
	 		
	 	
	 	
	 } else if( $scope.options.report.c_type.indexOf('rp_stockcard') > -1){
	  
	  	opt["dStart"] = $scope.get_date( $scope.options.reportOpt.dStart );
	 	opt["dEnd"] = $scope.get_date( $scope.options.reportOpt.dEnd );
	 	
	 	opt = $scope.get_option_report(opt);
	 	opt = $scope.get_option_chk(opt,['transection','balance']);
	 		 		 	       
	 	delete opt['rp_stockcard'];
	 } else if( $scope.options.report.c_type.indexOf('rp_prepare_stock') > -1){
	  
	  	opt["dStart"] = $scope.get_date( $scope.options.reportOpt.dStart );
	 	opt["dEnd"] = $scope.get_date( $scope.options.reportOpt.dEnd );
	 	
	 	opt["c_code_start"] = 0;
 		opt["c_code_end"] = 0;
	 	opt["num_start"] = 0;
	 	opt["num_end"] = 0;
	 	
	  	//alert($scope.options.rp_stock["num_start"]);
	  	if( angular.isDefined($scope.options.rp_stock["num_start"]) 
	  		|| angular.isDefined($scope.options.rp_stock["num_end"])  ){
	  			
	  		/*	
	  		if( angular.isDefined($scope.options.rp_stock["num_start"]) ){
				opt["num_start"] = $scope.options.rp_stock["num_start"];
				
				if( angular.isDefined($scope.options.rp_stock["num_end"]) ){
					opt["num_end"] = $scope.options.rp_stock["num_end"];
					if( opt["num_end"] == "" ) opt["num_start"];
				}	  				
	  			else opt["num_end"] = opt["num_start"];	
	  			
			}else if( angular.isDefined($scope.options.rp_stock["num_end"]) ){
				
				opt["num_start"] = $scope.options.rp_stock["num_end"];
				opt["num_end"] = opt["num_start"];		  
					  			
			}	
			*/
			if( angular.isDefined($scope.options.rp_stock["num_start"]) )
				opt["num_start"] = $scope.options.rp_stock["num_start"];
				
			if( angular.isDefined($scope.options.rp_stock["num_end"]) )
				opt["num_end"] = $scope.options.rp_stock["num_end"];
					
			
			if(opt["num_start"]=="")opt["num_start"]="0";
			if(opt["num_end"]=="")opt["num_end"]="0";	 				  			  			
			
		}
		
		if( opt["num_start"]=="0" && opt["num_end"]=="0"){			
			
			if( angular.isDefined($scope.options.rp_stock["item1_id"]) ){
				opt["c_code_start"] = $scope.options.rp_stock["item1_id"];
				
				if( angular.isDefined($scope.options.rp_stock["item2_id"]) )
	  				opt["c_code_end"] = $scope.options.rp_stock["item2_id"];
	  			else opt["c_code_end"] = opt["c_code_start"];	
	  			
			}else if( angular.isDefined($scope.options.rp_stock["item2_id"]) ){
				
				opt["c_code_start"] = $scope.options.rp_stock["item2_id"];
				opt["c_code_end"] = opt["c_code_start"];	
			}	  									 
		}	
		
		if(opt["c_code_start"]=="")opt["c_code_start"]="0";
		if(opt["c_code_end"]=="")opt["c_code_end"]="0";	
		
	 	if(opt["num_start"]=="")opt["num_start"]="0";
		if(opt["num_end"]=="")opt["num_end"]="0";	 		 	       
		
		
	 	delete opt['rp_prepare_stock'];
	 } else if( $scope.options.report.c_type.indexOf('rp_do_customer') > -1){
	 	
	 	opt["dStart"] = $scope.get_date( $scope.options.reportOpt.dStart );
	 	opt["dEnd"] = $scope.get_date( $scope.options.reportOpt.dEnd );
	 		 
	 	opt["location_from"] = $scope.options.reportOpt.location_from;
		opt["location_to"] = $scope.options.reportOpt.location_to;
		 	 
	 	delete opt['rp_do_customer'];
	 	 	
	 	
	 	if( $scope.options.rp_stock.rp_detail_do_customer == "1"){
			
			opt["report_type"] = "rp_detail_do_customer" ;
			
		 	opt["cate_id_start"] = 0;
		 	opt["cate_id_end"] = 0;
		 	
		 	if( angular.isDefined($scope.options.item_group1) )
		 		opt["cate_id_start"] = $scope.options.item_group1.c_seq;
				//opt["cate_id_start"] = $scope.options.item_group1.id;
				
			if( angular.isDefined($scope.options.item_group2) )
				opt["cate_id_end"] = $scope.options.item_group2.c_seq;
				//opt["cate_id_end"] = $scope.options.item_group2.id;
				
		}
	 		
	 		
	 	
	 } else if( $scope.options.report.c_type.indexOf('rp_do_by_customer') > -1){
	 	
	 	opt["dStart"] = $scope.get_date( $scope.options.reportOpt.dStart );
	 	opt["dEnd"] = $scope.get_date( $scope.options.reportOpt.dEnd );
	 		 
	 	opt["location_from"] = $scope.options.reportOpt.location_from;
		opt["location_to"] = $scope.options.reportOpt.location_to;
		 	 
	 	delete opt['rp_do_by_customer'];
	 	 	
	 	
	 	if( $scope.options.rp_stock.rp_detail_do_customer == "1"){
			
			opt["report_type"] = "rp_detail_do_customer" ;
			
		 	opt["cate_id_start"] = 0;
		 	opt["cate_id_end"] = 0;
		 	
		 	if( angular.isDefined($scope.options.item_group1) )
				opt["cate_id_start"] = $scope.options.item_group1.c_seq;
				//opt["cate_id_start"] = $scope.options.item_group1.id;
				
			if( angular.isDefined($scope.options.item_group2) )
				opt["cate_id_end"] = $scope.options.item_group2.c_seq;
				//opt["cate_id_end"] = $scope.options.item_group2.id;
			
		}
	 		
	 		
	 		
	 	
	 } else if( $scope.options.report.c_type.indexOf('rp_all_price') > -1){
	 	
	 	opt["pdate"] = $scope.get_date( $scope.options.reportOpt.pdate );	   
	 	
	 	opt["cate_id_start"] = 0;
	 	opt["cate_id_end"] = 0;
	 	
	 	if( angular.isDefined($scope.options.item_group1) )
			opt["cate_id_start"] = $scope.options.item_group1.c_seq;
			//opt["cate_id_start"] = $scope.options.item_group1.id;
			
		if( angular.isDefined($scope.options.item_group2) )
			opt["cate_id_end"] = $scope.options.item_group2.c_seq;
			//opt["cate_id_end"] = $scope.options.item_group2.id;
	 	
       
	 	delete opt['rp_all_price'];
	 	
	 } else if( $scope.options.report.c_type.indexOf('rp_counting_stock') > -1){
	 	opt["dStart"] = $scope.get_date( $scope.options.reportOpt.dStart );
	 	opt["dEnd"] = $scope.get_date( $scope.options.reportOpt.dEnd );
	 	
	 	opt["c_code_start"] = "0";
 		opt["c_code_end"] = "0";
 					
 		if( angular.isDefined($scope.options.rp_stock["item1_code"]) ){
			opt["c_code_start"] = $scope.options.rp_stock["item1_code"];
				
			if( angular.isDefined($scope.options.rp_stock["item2_code"]) )
	  			opt["c_code_end"] = $scope.options.rp_stock["item2_code"];
	  		else opt["c_code_end"] = opt["c_code_start"];	
	  			
		}else if( angular.isDefined($scope.options.rp_stock["item2_code"]) ){
				
			opt["c_code_start"] = $scope.options.rp_stock["item2_code"];
			opt["c_code_end"] = opt["c_code_start"];	
		} 					
 
 		/*
 		if( angular.isDefined($scope.options.rp_stock["item1_id"]) ){
			opt["c_code_start"] = $scope.options.rp_stock["item1_id"];
				
			if( angular.isDefined($scope.options.rp_stock["item2_id"]) )
	  			opt["c_code_end"] = $scope.options.rp_stock["item2_id"];
	  		else opt["c_code_end"] = opt["c_code_start"];	
	  			
		}else if( angular.isDefined($scope.options.rp_stock["item2_id"]) ){
				
			opt["c_code_start"] = $scope.options.rp_stock["item2_id"];
			opt["c_code_end"] = opt["c_code_start"];	
		}	
		*/
 										
 			 
	 	delete opt['rp_counting_stock'];
	 	
	 } else if( $scope.options.report.c_type.indexOf('rp_test') > -1){
	 	
	 	opt["dStart"] = $scope.get_date( $scope.options.reportOpt.dStart );
	 	opt["dEnd"] = $scope.get_date( $scope.options.reportOpt.dStart );
	 	opt["pDate"] = $scope.get_date( $scope.options.reportOpt.dStart );
	 	opt["pDate"] = "0";
	 	opt["id_start"] = "0";
	 	opt["id_end"] = "0";
	 	opt["num_start"] = "0";
	 	opt["num_end"] = "0";
	 	
	 	delete opt['rp_test'];
	 	
	 }
	 else if( $scope.options.report.c_type.indexOf('rp_sale_cash') > -1 ){
	 		 	
	 	opt = $scope.get_option_chk(opt,['rp_sale_detail_cash']);
	 	if( $scope.options.rp_stock.rp_sale_detail_cash == "1")
	 		opt["report_type"] = "rp_sale_detail_cash" ;	
	 		
	 	delete opt['rp_sale_cash'];
	 	delete opt['rp_sale_detail_cash'];
	 	
	 }	 
	 else if($scope.options.report.c_type.indexOf('rp_sale_credit') > -1  ){
	 		 	
	 	opt = $scope.get_option_chk(opt,['rp_sale_detail_credit']); 
	 	if( $scope.options.rp_stock.rp_sale_detail_credit == "1")
	 		opt["report_type"] = "rp_sale_detail_credit" ;
	 		
	 	delete opt['rp_sale_credit'];
	 	delete opt['rp_sale_detail_credit'];
	 	
	 }
	 else if( $scope.options.report.c_type.indexOf('rp_ir_cash') > -1 ){
	 		 	
	 	opt = $scope.get_option_chk(opt,['rp_ir_cash_detail']);
	 	if( $scope.options.rp_stock.rp_ir_cash_detail == "1")
	 		opt["report_type"] = "rp_ir_cash_detail" ;	
	 		
	 	delete opt['rp_ir_cash'];
	 	delete opt['rp_ir_cash_detail'];
	 	
	 }	 
	 else if($scope.options.report.c_type.indexOf('rp_ir_by_supplier') > -1  ){
	 		 	
	 	opt = $scope.get_option_chk(opt,['rp_ir_by_supplier_detail']); 
	 	if( $scope.options.rp_stock.rp_ir_by_supplier_detail == "1")
	 		opt["report_type"] = "rp_ir_by_supplier_detail" ;
	 		
	 	delete opt['rp_ir_by_supplier'];
	 	delete opt['rp_ir_by_supplier_detail'];
	 	
	 }
	 else if($scope.options.report.c_type.indexOf('rp_return_to_mm') > -1  ){
	 		 	
	 	opt = $scope.get_option_chk(opt,['return_to_mm_yes','return_to_mm_no']);  	 		
	 	delete opt['rp_return_to_mm']; 	 	
	 }
	 
	 
	 
	 //////////////////////////////////////////////////////////////

  	 for( key in opt )
		url += "/"+key+"/"+opt[key];
  		
  	 console.log("option",opt); 
  	 console.log("url",url);
  	  
  	 opt["report_output"] = report_output; 
  	  
  	 $scope.url_report_show = url;   	 	
  	 //alert($scope.url_report);
  	 	 
  	 if( report_output == "pdf" ){
	 	$scope.doc_print(opt);
	 }else{
	 	$scope.url_report = url;   
	 }
	 
	 
  	 // 	 
   }

   $scope.get_reset = function() {
   	  $scope.options.reportOpt.pdate = new Date();
   	  $scope.options.reportOpt.dStart = new Date();
   	  $scope.options.reportOpt.dEnd = new Date();
   	  
   	  $scope.options.rp_stock = {};      
 
   	  
   	  $scope.options.item_group1 = $scope.options.MODEL['item_group'][0];
      $scope.options.item_group2 = $scope.options.MODEL['item_group'][0];
        
   }
   
   
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
      templateUrl: 'views/report/report.item.Ctrl.html',
      controller: 'Report.item.Ctrl',
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
	   		//delete $scope.options.rp_stock[$scope.opt.target+"_name"];
	   		//delete $scope.options.rp_stock[$scope.opt.target+"_code"];
	   		//delete $scope.options.rp_stock[$scope.opt.target+"_id"];
	   }else{
		   $scope.options.rp_stock[$scope.opt.target+"_name"]=  item[0].c_code+" : "+item[0].c_name;
		   $scope.options.rp_stock[$scope.opt.target+"_code"]=  item[0].c_code;
		   $scope.options.rp_stock[$scope.opt.target+"_id"]=  item[0].id;
	   } 
    
    });
    
  }
  
  
  
  
}]) 


////////////////////////////////////////////////////////////////////////////////////////////// 

.controller('Report.item.Ctrl', function ($scope,$modalInstance,$modal,iAPI,options) {
  
   
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
















