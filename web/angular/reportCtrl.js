 angular.module('abAPP.report', [])
 
.controller('Report.Ctrl', ['$scope', 'iAPI', '$modal', '$filter', '$q', '$window', '$location', 
  function ($scope,iAPI,$modal,$filter,$q,$window,$location) {
  	
  	$scope.location_url();
  	
  $scope.activeSide(true);
  $scope.show_menu_group(iAPI.config.menu,"report");
 
 
   	
   console.log('Member_reportCtrl');
   $scope.options = {
   	report : null ,
   	reportOpt : { 
		pdate1 : new Date(),
		pdate2 : new Date(),
		br_id : 0,
	   },
   };
   

   $scope.get_option = function() {
      $scope.options.MODEL = {} ; 
 
    $scope.options.rp_stock = {};
 
    
    iAPI.get('smart_card/report_con/iView_branch').success(function(data) {
      
      if( angular.isDefined(data.mydata)) data = data.mydata;
        
        
      var row0 = {};
      row0["br_id"]=0;
      row0["BranchCode"]="";row0["BranchName"]="ทั้งหมด";
      data.splice(0,0,row0);
            

        $scope.options.MODEL['location_branch'] = data;
        $scope.options.location_branch_from = $scope.options.MODEL['location_branch'][0];
        $scope.change_location_branch_from();
     
        
      console.log('iView_branch',$scope.options.MODEL['location_branch'] );         
                 
        
    });
    
   }

   $scope.set_title = function() { 
   
    var url = 'smart_card/report_con/iView_report';      
    iAPI.get(url).success(function(data) {
      if( angular.isDefined(data.mydata)) data = data.mydata;
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
      iAPI.post('smart_card/report_con/jasper_stop',{}).success(function(data) {
           iAPI.post('smart_card/report_con/jasper_start',{}).success(function(data) {
              alert("Report Stop / Start Done");
           });
      })
        
   }

    $scope.change_report = function() {
     //$scope.options.reportOpt.dStart = new Date();
     //$scope.options.reportOpt.dEnd = new Date();      
   }
 
  
   $scope.change_location_branch_from = function() {  
      //$scope.options.reportOpt.location_from_br_id = $scope.options.location_branch_from.br_id; 
      console.log($scope.options.location_branch_from);
      $scope.options.reportOpt.br_id = $scope.options.location_branch_from.br_id; 
   }
 
      
   $scope.get_date = function(d_date) {
      //var d_date = $scope.options.reportOpt[c_type[key]]; 
    var getMonth = ("00"+(d_date.getMonth()+1)).substr(-2);
        var getDate = ("00"+(d_date.getDate())).substr(-2);
        return d_date.getFullYear()+"-"+getMonth+"-"+getDate;
   }
   
    $scope.get_reset = function() {
      $scope.options.reportOpt.pdate1 = new Date();
      $scope.options.reportOpt.pdate2 = new Date(); 
      
      $scope.options.rp_stock = {};      
   
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
    //  opt["noPrint"] = $scope.options.rp_stock["noPrint"]; 
    return opt;
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
    if( c_type[key]=="pdate1" || c_type[key]=="pdate2"  ){
        opt[c_type[key]] = $scope.get_date( $scope.options.reportOpt[c_type[key]] );
    }else{
      opt[c_type[key]] = $scope.options.reportOpt[c_type[key]];
    }
   }     
   
      
     var url = iAPI.conf.baseUrl+"smart_card/report_con/get_report";
     if( report_output == "excel" )
      url = iAPI.conf.baseUrl+"smart_card/report_con/get_report_excel";
     else if( report_output == "csv" )
      url = iAPI.conf.baseUrl+"smart_card/report_con/get_report_csv";
     
   
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
   
     
   }
   
  
}]) 

















