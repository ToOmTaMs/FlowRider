<?php
 
$path = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);
if( substr($path,0,1) == '/' )  $path = substr($path,1); 
@list($dummy1,$dummy2,$dummy3,$dummy4,$resource,$params) = explode("/", $path, 6);
@list($resource,$service) = explode(".",$resource,2);

define('CONFIG_URL',$_SERVER['HTTP_HOST']."/".$dummy1);

 require_once("../src/mysql.class.php");
 require_once("../src/class.db.php");	
 require_once("./conf.inc.php");
 
 $dsn = $GLOBALS["db_server"]["db"]["dns"].':host='.$GLOBALS["db_server"]["db"]["host"].';dbname='.$GLOBALS["db_server"]["db"]["dbname"].';charset=utf8';
	$user = $GLOBALS["db_server"]["db"]["user"];
	$passwd = $GLOBALS["db_server"]["db"]["passwd"];
	 
 echo $dsn ."<br>";
 $db = new iDB($dsn,$user,$passwd);	
 
 echo "db_server<br>";
 var_dump($db);
 echo"<br><br><br>";
 
  $dsn = $GLOBALS["db_client"]["db"]["dns"].':host='.$GLOBALS["db_client"]["db"]["host"].';dbname='.$GLOBALS["db_client"]["db"]["dbname"].';charset=utf8';
	$user = $GLOBALS["db_client"]["db"]["user"];
	$passwd = $GLOBALS["db_client"]["db"]["passwd"];
	 
 echo $dsn ."<br>";
 $db = new iDB($dsn,$user,$passwd);	
 
 echo "db_client<br>";
 var_dump($db);
 echo"<br><br><br>"; 
  
  
 $db_mysql = new Mysql($GLOBALS["db_conf"]);	  
 echo "db_mysql<br>"; 
 var_dump($db_mysql);
 echo"<br><br><br>";   
 
  
?>