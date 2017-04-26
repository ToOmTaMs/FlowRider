 angular.module('abAPP.report', [])
 
.controller('Report.Ctrl', ['$scope', 'iAPI', '$modal', '$filter', '$q', '$window', '$location', 
  function ($scope,iAPI,$modal,$filter,$q,$window,$location) {
  	
  $scope.location_url();
  	
  $scope.activeSide(true);
  $scope.show_menu_group(iAPI.config.menu,"report");
 
  $scope.i_location_url = $location.url().replace("/", "").replace("report_",""); 
  //alert($scope.i_location_url);
 
   	
   console.log('Report.reportCtrl');
   $scope.options = {
   	report : null ,
   	reportOpt : { 
		pdate1 : iAPI.dNow,
		pdate2 : iAPI.dNow,
		member_id : 0,
		agent_id : 0,
	   },
   };
   

   $scope.get_option = function() {
    $scope.options.MODEL = {} ; 
    $scope.options.rp_stock = {};
 
     
    iAPI.get('member.iView_member_hdr/normal').success(function(data) {
   
      //console.log("member.iView_member_hdr/normal",data) ;   
 
      var row0 = {};
      row0["member_id"]=0;
      row0["MemCode"]="";row0["FLName"]="ทั้งหมด";
      data.splice(0,0,row0);            

        $scope.options.MODEL['memberList'] = data;
        $scope.options.memberList = $scope.options.MODEL['memberList'][0];
        $scope.change_memberList();     
        
      console.log('member.iView_member_hdr/normal',$scope.options.MODEL['memberList'] );               
        
    });
    
    iAPI.get('flow.iView_agent/normal').success(function(data) {
   
      //console.log("flow.iView_agent/normal",data) ;   
 
      var row0 = {};
      row0["agent_id"]=0;
      row0["lng1_c_name"]="ทั้งหมด";
      data.splice(0,0,row0);            

        $scope.options.MODEL['agentList'] = data;
        $scope.options.agentList = $scope.options.MODEL['agentList'][0];
        $scope.change_agentList();     
        
      console.log('flow.iView_agent/normal',$scope.options.MODEL['agentList'] );               
        
    });    
   
   }
   

   $scope.set_title = function() { 
   
    var url = 'report.iView_report/'+$scope.i_location_url;      
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

      
   }
 
  
   $scope.change_memberList = function() {  
      console.log($scope.options.memberList);
      $scope.options.reportOpt.member_id = $scope.options.memberList.member_id; 
   }
   $scope.change_agentList = function() {  
      console.log($scope.options.agentList);
      $scope.options.reportOpt.agent_id = $scope.options.agentList.agent_id; 
   } 
      
   $scope.get_date = function(d_date) {
   	//console.log("get_date",d_date);
   	   var d_date = new Date(d_date);
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
   
   	if( angular.isDefined($scope.options.report.php_fn) )
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
      
  
      
     var url = iAPI.conf.baseUrl+"report.get_report";
     if( report_output == "excel" )
      url = iAPI.conf.baseUrl+"report.get_report_excel";
     else if( report_output == "csv" )
      url = iAPI.conf.baseUrl+"report.get_report_csv";
     
   
   //////////////////////////////////////////////////////////////

     for( key in opt )
       url += "/"+key+"/"+opt[key];
      
     console.log("option",opt); 
     console.log("url",url);
      
     opt["report_output"] = report_output; 
     opt["report_url"] = url
      
           
     $scope.url_report_show = url;      
     //alert($scope.url_report);
       
     if( report_output == "pdf" ){
    	$scope.doc_print(opt);
   	 }else{
    	$scope.url_report = url;   
     }
     
   
     
   }
   
  
}]) 

















