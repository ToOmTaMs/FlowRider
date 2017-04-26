<?php
// copy this file to your api location named it as config.inc.php
// modify as you need

// Start of config settings here
// -----------------------------
  
/*
เครื่องพัฒนา //fr หรือ 192.168.1.225

PHP : 2.5.6
Mysql : 5  user : root password :
Database : fr_flow

Foder พัฒนา : //192.168.1.225/www/fr_flow

Api พัฒนา : http://192.168.1.225/fr_flow/api/v1/index.php/ 
 

Login User : 5555
Password : 555

*/
/*
foreach ($_SERVER as $k => $v) {
 echo "\$_SERVER['$k']=$v"."\r\n";	
}
*/
 
  $confs['publicUri'] = array (
    "User.login",
    "User.password",   
    "User.test",    
    "Report.test",
    "Report.get_report",
    "Report.get_report_csv",
    "Report.get_report_excel",
    "Report.get_report_test", 
    "Company.iChk_Token_Location", 
    "Item.test",       
  );
    

  $confs['192.168.1.225/fr_flow-master-2'] = array (
  	"db_client" => array (
	    "db" => array(
	      "dns"      => "mysql",
	      "host"      => "192.168.1.225",
	      "dbname"   => "DBfr_flow", 
	      "user"   => "root",
	      "passwd" => "",
	      "charset"   => "utf8",   
	      "port"   => 3306,          
	      ),
	    "cloudUrl" =>'', 
	    "tab_prefix" =>'a_',  
	    "magic_word"=> "1q2s3e4r5t",    
	  ),
  	"db_server" => array (
	    "db" => array(
	      "dns"      => "mysql",
	      "host"      => "192.168.1.225",
	      "dbname"   => "", 
	      "user"   => "root",
	      "passwd" => "",
	      "charset"   => "utf8",   
	      "port"   => 3306,    
	      ),       
	    "tab_prefix" =>'a_',  
	    "magic_word"=> "1q2s3e4r5t",
      
  	),
  
  );
   
  $confs['192.168.1.225/fr_flow'] = array (
  	"db_client" => array (
	    "db" => array(
	      "dns"      => "mysql",
	      "host"      => "192.168.1.225",
	      "dbname"   => "DBfr_flow", 
	      "user"   => "root",
	      "passwd" => "",
	      "charset"   => "utf8",   
	      "port"   => 3306,          
	      ),
	    "cloudUrl" =>'', 
	    "tab_prefix" =>'a_',  
	    "magic_word"=> "1q2s3e4r5t",    
	  ),
  	"db_server" => array (
	    "db" => array(
	      "dns"      => "mysql",
	      "host"      => "192.168.1.225",
	      "dbname"   => "", 
	      "user"   => "root",
	      "passwd" => "",
	      "charset"   => "utf8",   
	      "port"   => 3306,    
	      ),       
	    "tab_prefix" =>'a_',  
	    "magic_word"=> "1q2s3e4r5t",
      
  	),
  
  );
  
  $confs['win7-pc:90/fr_flow'] = array (
  	"db_client" => array (
	    "db" => array(
	      "dns"      => "mysql",
	      "host"      => "localhost",
	      "dbname"   => "DBfr_flow", 
	      "user"   => "root",
	      "passwd" => "",
	      "charset"   => "utf8",   
	      "port"   => 3306,          
	      ),
	    "cloudUrl" =>'', 
	    "tab_prefix" =>'a_',  
	    "magic_word"=> "1q2s3e4r5t",    
	  ),
  	"db_server" => array (
	    "db" => array(
	      "dns"      => "mysql",
	      "host"      => "localhost",
	      "dbname"   => "", 
	      "user"   => "root",
	      "passwd" => "",
	      "charset"   => "utf8",   
	      "port"   => 3306,    
	      ),       
	    "tab_prefix" =>'a_',  
	    "magic_word"=> "1q2s3e4r5t",
      
  	),
  
  );
        
   
// End of config settings
// ----------------------
 //$rUrl = $_SERVER['HTTP_HOST'].substr($_SERVER['REQUEST_URI'],0,strpos($_SERVER['REQUEST_URI'],'/api')); 
 //define('BASE_URL','http://'.$rUrl."/");
 //echo CONFIG_URL ;

  if (!array_key_exists(CONFIG_URL, $confs)) {
    echo "Auth. fail : unregister domain";
    exit;
  }
  
  
  $publicUri    = $confs['publicUri']; 
  $app    	= array();  
 
  $db_conf = $confs[CONFIG_URL]['db_client']['db']; 
  $db_client = $confs[CONFIG_URL]['db_client'];
  $db_server = $confs[CONFIG_URL]['db_server'];
  
  
  
?>