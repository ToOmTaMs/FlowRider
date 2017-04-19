<?php
// index.inc.php
// common index for api
// http[s]://pr1-9net.rhcloud.com/api/<project-name>/<version>/
// Ex.  https://pr1-9net.rhcloud.com/api/wallet/v0
//      https://pr1-9net.rhcloud.com/api/rangy/v1
header("Access-Control-Allow-Origin: *");

header("Access-Control-Allow-Methods", "*");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, token");

// assume autoloader available and configured
// error_reporting(~E_ALL);
error_reporting(E_ALL);
date_default_timezone_set("Asia/Bangkok");      // will set again after get app record

$path = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);

if( substr($path,0,1) == '/' )  $path = substr($path,1); 

//echo $path;

//$path = trim($path, "/");
@list($dummy1,$dummy2,$dummy3,$dummy4,$resource,$params) = explode("/", $path, 6);
//echo $dummy1 ." " . $dummy2 . " " .$dummy3 . " " .$dummy4 . " " . $resource . " " . $params . " " ;
//echo $dummy1 ;
@list($resource,$service) = explode(".",$resource,2);
//echo $resource ." " . $service;
define('BASE_URL','http://'.$_SERVER['HTTP_HOST']."/".$dummy1);
define('CONFIG_URL',$_SERVER['HTTP_HOST']."/".$dummy1);

$resource = ucfirst(strtolower($resource));
$method = strtolower($_SERVER["REQUEST_METHOD"]);
$params = !empty($params) ? explode("/", $params) : array();

//if($method=="options") exit;

require_once("./conf.inc.php");
require_once("../src/class.api.core.php");
require_once("./class.resource.php");		// application resource class
require_once("../i18n/i18n.php");

define('APP_ROOT','../../');
define ('USER_DATA_FOLDER',APP_ROOT.'user-data/');

$i18n->set_locale("th");

// No fallback, So you need to pre-define the resource file
$tab_name	= strtolower($resource);
$fname		= $tab_name.".php";

//echo "$tab_name";


if (file_exists($fname)) {
	include_once($fname);
	//echo $fname ;
}

//echo "class $resource";
if (class_exists($resource)) {
    try {    	 
         
        $resource = new $resource($params);   
        //var_dump($resource);   
        //echo "class $resource"; 
 
		if ($resource->service_name !="") {
	      if (method_exists($resource, $resource->service_name)) {
	        $resource->{$resource->service_name}();
	      }
	      else {
	        $resource->send_fail(L("No Service %s",$resource->service_name));
	      }
	    }
      $resource->{$method}();
    }
    catch (Exception $e) {
        header("HTTP/1.1 500 Internal Server Error");
    }
}
else {
	echo "File Not Found";
    //header("HTTP/1.1 404 File Not Found");
}