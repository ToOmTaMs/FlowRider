<?php
/*
*/

 
require_once("../lib/password.php"); 
//require_once("../src/class.db.php");	
require_once("../src/mysql.class.php");
require_once("../lib/Curl.php");	

 
/*


require_once("../../common/imodule.class.php");
require_once("../../common/mysql.class.php");

require_once("../../common/appberry.inc.php");
*/

abstract class Api_core
{
  protected static $httpMethods = array("GET", "POST", "HEAD",
    "PUT", "OPTIONS", "DELETE", "TRACE", "CONNECT");

  public $service_name;
  protected $params,$current_user,$current_m_info,$current_app
  ,$now,$today,$yesterday,$tomorrow
  ,$http_token,$header

  ,$q_params,$tab_name
  ,$whereX
  ,$select
  ,$no_send_ok
  ,$return_result 
  ,$orderby
  ,$limit
  ,$th
  
  ,$id = "" 
  
  ,$imodule   
  ,$ABuser  
  ,$db
  ,$app_id =""  
  ,$u_token
  ,$u_info
  ,$u_company_id , $u_location_id
  ,$magic_word =""
  ,$load_db_client = false 
  
  ,$and_e_status,$and_company_id,$and_location_id
  ,$and_a_e_status,$and_a_company_id,$and_a_location_id
  ,$where_company_id,$where_location_id
  ,$count_exit = 0  
  ,$auth
  
  ;

  public function i_init($params) {
    $this->params   = $params;
    $this->now      = date("Y-m-d H:i:s");
    $this->today    = date("Y-m-d");
    $this->yesterday= date('Y-m-d', strtotime('-1 day'));
    $this->tomorrow = date('Y-m-d', strtotime('+1 day'));
    
 	$this->db = new Mysql($GLOBALS["db_conf"]);	
    //$this->db       = @new Mysql();
    //$this->imodule  = @new Imodule();
    //$this->app_id   = str_replace("'","",$GLOBALS["conf"]["AB_APP_ID"]);  
    //$this->ABuser   = new ABuser($GLOBALS["conf"]["AB_APP_ID"]);
    
 
    
    
    $this->th   = false;
    $this->whereX   = "1=1";
    $this->select   = "*";
    $this->orderby   = "";
    $this->limit   = "";
    
    $this->no_send_ok   = false;

    $this->id       = isset($this->params[0]) ? $this->params[0] : "";

	//echo $this->id ."xx"; 
    if (is_numeric($this->id) && $this->id ==0) $this->id = "";
    if (empty($_POST)) $this->get_request_data();
    $this->headers = apache_request_headers();

    foreach ($this->headers as $k1 =>$v1) {
      $this->headers[strtolower($k1)] = $v1;
    }

    $this->http_token           = isset($this->headers["token"]) ? $this->headers["token"] : "";
    $this->q_params["limit"]    = isset($_GET["limit"]) ? "limit ".$_GET["limit"] : "";
    $this->q_params["sort"]     = isset($_GET["sort"]) ? "order by ".$_GET["sort"] : "";
    $this->service_name         = isset($GLOBALS["service"]) ? $GLOBALS["service"] : "";
    
      
    
  }

  		
  public function __construct(array $params) {
  	
    $this->i_init($params);
    
    if($this->load_db_client){
		
	}
    else{
    	//$this->set_db_server();
     	//$this->check_auth();   	
    }
  }
  
    
  public function set_db_client(){
 
	$dsn = $GLOBALS["db_client"]["db"]["dns"].':host='.$GLOBALS["db_client"]["db"]["host"].';dbname='.$GLOBALS["db_client"]["db"]["dbname"].';charset=utf8';
	$user = $GLOBALS["db_client"]["db"]["user"];
	$passwd = $GLOBALS["db_client"]["db"]["passwd"];
	 
	$this->db = new iDB($dsn,$user,$passwd);	
	$this->tab_name  = $GLOBALS["db_client"]["tab_prefix"].$GLOBALS["tab_name"];
	$this->magic_word = $GLOBALS["db_server"]["magic_word"];
	
	$conf["dsn"] = $dsn;
	$conf["user"] = $user;	
	$conf["passwd"] = $passwd;		
	
	return $conf ;
		
  }	
  	
  public function set_db_server(){
 
	$dsn = $GLOBALS["db_server"]["db"]["dns"].':host='.$GLOBALS["db_server"]["db"]["host"].';dbname='.$GLOBALS["db_server"]["db"]["dbname"].';charset=utf8';
	$user = $GLOBALS["db_server"]["db"]["user"];
	$passwd = $GLOBALS["db_server"]["db"]["passwd"];
	 
	//echo $dsn ;
	$this->db = new iDB($dsn,$user,$passwd);	
	$this->tab_name  = $GLOBALS["db_server"]["tab_prefix"].$GLOBALS["tab_name"];
	$this->magic_word = $GLOBALS["db_server"]["magic_word"];

	$conf["dsn"] = $dsn;
	$conf["user"] = $user;	
	$conf["passwd"] = $passwd;		
	
	return $conf ;
			
  }	
  

  
   // check if correct token is set
  // Do not use $_REQUEST or variable order, since it depend on php.ini
  protected function check_auth () {
    global $resource,$method;
    //public api, no auth required. Class.method format (First letter is capital)
        $noAuthApi = array (
    	"Test.test1",    
    );
    
    if(isset($GLOBALS["publicUri"]))  
    	$noAuthApi = $GLOBALS["publicUri"];
    	
    	
    if ($this->service_name =="")
      $tmp = $resource.".".$method;
    else
      $tmp = $resource.".".$this->service_name;
    if (in_array($tmp, $noAuthApi)) return true;

    //-- start here
    $res = 0;
    $token = ($this->http_token !="")
      ? $this->http_token
      : "";
    if ($token =="") {
      $token = isset($_GET["token"])
        ? $_GET["token"]
        : "";
    }
    if ($token =="") $res = 1;
    else {
    	
    	//$this->set_db_server();
    	
    	/*
        // get current_user from appberry
        $this->ABuser->set_token($token);
        $ret = $this->ABuser->me();
        if ($ret["info"]["http_code"] =="200") {
            $this->current_user = json_decode($ret["body"],true);
            // $this->employee_erc = $this->db->i_get_row("select * from a_employee where user_id=".$this->current_user['id']);
            // $this->current_user["c_data"] = json_decode($this->current_user["c_data"],true);
        }
        else {
            $tmp = json_decode($ret["body"],true);
            $this->send_fail($tmp["err_msg"],true);
        }
        */
    }

    if (! $res) return (! $res);
    $this->send_fail(L("Auth. Fail 66 code %s",$res),true);
  }

 
  protected function get_request_data() {
   
    if (!empty($_POST)) return;
    if ($this->header["Content-type"] =="application/x-www-form-urlencoded") {
            // form data
      parse_str(file_get_contents("php://input"),$_POST);
    }
    else {   	 
            // request payload data
      $tmp =file_get_contents("php://input");
      //$_POST =json_decode($tmp,true,512,0);
      $_POST_tmp =json_decode($tmp,true);
      $_POST = $_POST_tmp;
      
      /*
      var_dump($_POST_tmp);
      
      //$_POST = $this->check_object();
      
      if(is_array($_POST_tmp)) $_POST = $_POST_tmp;
      else if(is_object($_POST_tmp)){ 
      
      //var_dump($_POST_tmp);
      	foreach ($_POST_tmp as $k1 =>$v1)  {
			//echo "d".is_array($v1)."d";
			//var_dump($v1);
			//if(is_object($_POST_tmp))
			
			$_POST[$k1] = $v1;
		}
      		
   	  }else $_POST = $_POST_tmp;
   	  */
    
      
    }
  }
  

  
   function check_object($object) {
   	$this->count_exit++;
   	if($this->count_exit>=1000) $this->send_ok("1");
   	
   	
   	 if(is_object($object) || is_array($object)){
   	 	$array = array();
   	 	foreach ($object as $k1 =>$v1)  {
   	 		$array[$k1] = $this->check_object($v1);
   	 		return $array;
   	 	}
   	 }else{
   	 	echo $object;
	 	return $object;
	 }
   	
   }
  
  ////////////////////////////////////////////////////////



  protected function allowedHttpMethods() {

    $myMethods = array();
    $r = new ReflectionClass($this);
    foreach ($r->getMethods(ReflectionMethod::IS_PUBLIC) as $rm) {
      $myMethods[] = strtoupper($rm->name);
    }
    return array_intersect(self::$httpMethods, $myMethods);

  }
  

  public function __call($method, $arguments) {
    header("HTTP/1.1 405 Method Not Allowed", true, 405);
    header("Allow: " . join($this->allowedHttpMethods(), ", "));
  }


  ////////////////////////////////////////////////////////
  
  	
  public function get_next_prev() {
    if ($this->id =='') $this->send_fail(L('id is required'));
    $row['next'] = $this->db->i_get_field("select id from {$this->tab_name}
      where {$this->whereX} and id >{$this->id} order by id limit 0,1");
    $row['prev'] = $this->db->i_get_field("select id from {$this->tab_name}
      where {$this->whereX} and id <{$this->id} order by id desc limit 0,1");
    $this->send_ok($row);
  }

  // default GET/POST/PUT/DELETE
  public function get() { 
 
    //$this->get_with_key("id");
  }
  public function get_with_key($key_column ="id") {
    $tab_name   = $this->tab_name;
	 
	
	if($this->orderby != '' ) $this->q_params["sort"] = "order by ".$this->orderby;
	if($this->limit != '') $this->q_params["limit"] = "limit ".$this->limit;
 
    if ($this->id !='') {
      $sql ="select {$this->select} from $tab_name where {$this->whereX} and $key_column='{$this->id}'" 
        . " " .$this->q_params["sort"]
        . " " .$this->q_params["limit"];
	  //echo $sql;	
      $row = $this->db->i_get_row($sql);
      if($this->return_result) return $row;
      //echo $sql;	
      //$row["sql"] = $sql;	  
      $this->send_ok($row);
    }
    else {
      $sql ="select {$this->select} from $tab_name where {$this->whereX}"
        . " " .$this->q_params["sort"]
        . " " .$this->q_params["limit"];
      //echo $sql;
      $rows = $this->db->i_get_rows($sql);
      if($this->return_result) return $rows; 
      
      $this->send_ok($rows);
    }
  }

    // create, no key from client
  public function post() {
    $this->post_with_key("id");
  }

    // create, no key from client
  public function post_with_key($key_column ="id") {
    $tab_name   = $this->tab_name;
    $id         = $this->id;
    $res        = false;

    //remove _ single underscore POST var,
    $fld        = array();
    foreach($_POST as $k1 =>$v1) {
      if (substr($k1,0,1) !="_")
        $fld[$k1] =$v1;
    }

    if (isset($id) && $id ==0) {
      unset($id);
      unset($fld[$key_column]);
    }

    if (isset($id)) {
      $res = $this->db->i_update($tab_name,$fld,"{$this->whereX} and $key_column='$id'");
    }
    else {
      $res    = $this->db->i_insert($tab_name,$fld);
      $id     = $this->db->last_insert_id;
    }

    // we cannot just select and send out, we MUST call get(). service that need special get will work
    if ($res) {
      $this->id = $id;
      $this->get();
    }
    else {
      header("HTTP/1.1 400 Bad Request");
      exit;
    }
  }

    // update, client send key to server
    // we can use post with key(GET), but populate PUT data into $_POST
  public function put() {
    $this->post_with_key("id");
  }

  public function delete_with_key($key_column ="id") {
    $rx = $this->db->i_query("delete from {$this->tab_name} where {$this->whereX} and $key_column='{$this->id}'");
    $i = mysql_affected_rows();
    if ($i ==0) $this->send_fail(L("No record deleted"));
    $this->send_ok($i);
  }
  public function delete() {
    $this->delete_with_key('id');
  }

   
  ////////////////////////////////////////////////////////


	public function iCreateToken($txt,$uuid="",$user_agent="",$user_data="")
	{
		$encryption_key = '9net';
		$d1 = date("Y-m-d H:i:s");
		$token = md5($encryption_key.$d1.$txt);
		
		$ip_address = $_SERVER['REMOTE_ADDR']; 
		$uuid = "";
		
		//if($user_agent=="")
		//	$user_agent	= get_browser() ;
			//$user_agent = $this->agent->is_mobile(); //$this->agent->browser().' '.$this->agent->version();
			//$user_agent	= $this->agent->browser().' '.$this->agent->version() . ' ' . $this->agent->platform();  
				
		$ht1["c_token"]  = $token;
        $ht1["d_create"] =date("Y-m-d H:i:s");
        $ht1["d_expire"] =date('Y-m-d H:i:s', strtotime('+1 day'));
        $ht1["c_user_data"] =$user_data;
        $ht1["ip_address"] =$ip_address;
        $ht1["user_agent"] =$user_agent;
        $ht1["uuid"] =$uuid;
        $this->db->iInsert("a_token",$ht1); 	
		
		return $token;
		
	}

	public function iDeleteToken($token) {
        $this->db->iQuery("delete from a_token where c_token='$token'");
    }
 
	  

	public function iHash($in,$opt =PASSWORD_BCRYPT) {
		//$out = password_hash ($this->magic_word.$in,$opt );
		$out =  md5($this->magic_word.$in);	 
		return $out;	 
	}
	public function iVerifyHash($in,$hash) {
		$out =  md5($this->magic_word.$in);	 
		if( $out == $hash ) return true; 
		return false;
		//return password_verify($this->magic_word.$in,$hash);
	}


	
		
  ////////////////////////////////////////////////////////
   
    //protected $iconv_chk ;
    //protected $iconv_count ;
   
    // tis620 to utf8
	protected function js_thai_encode($data)  {  
	  // fix all thai elements  
	    if (is_array($data))  {  
	        foreach($data as $key => $value) {  
	            if (is_array($data[$key])) {  
	                $data[$key] = $this->js_thai_encode($data[$key]);  
	            }  
	            else {   
					//$data[$key] = iconv("utf-8" , "utf-8" ,$value);   
					//$data[$key] = iconv("tis-620","utf-8" ,$value);   
					//$data[$key] = iconv("utf-8" , "tis-620" ,$value);  
				    //$data[$key] = iconv("tis-620","tis-620",$value); 
				    //if( $key == "c_info" ) echo $value . "<br>" ;
				    //echo "before[" . $value . "]";
				    $data[$key] = iconv("tis-620","utf-8" ,$value);
				    //echo "after[" . $value . "]";
				    
				    /*
				    //debug
				    try{
				    	
				    	if( $key == "c_name"){
				    		$data[$key] = iconv("tis-620","utf-8" ,$value);
				    		echo "before[" . $data[$key] . "]";
							//$this->iconv_count++;
				    		//$this->iconv_chk[$this->iconv_count][$key][0] = $value . "-";
				    		//$this->iconv_chk[$this->iconv_count][$key][1] = $data[$key] . "*";
							
						}else{
							$data[$key] = iconv("tis-620","utf-8" ,$value);
						}
										    	
					}catch(Exception $e) {
    					echo 'Caught exception: ',  $e->getMessage(), "\n";
    					echo $value;
					}
					*/
						
					    
				     				     
				    //echo "after[" . $value . "]";
	            }  
	        }  
	    }  
	    else  {  
	       //echo "before[" . $data . "]";
	       $data =iconv("tis-620","utf-8",$data); 
	       //echo "after[" . $data . "]";	       
	    }  
	    return $data; 		
	}	
	
  
  	private function log_usage($ok =1) {
  	
  	}  
  
  	public function sendNow($data,$code=200,$ext="") {
  		
  		if( $code==200) if($this->no_send_ok)return;
  		
  		$this->log_usage(1);
  		
		header("Access-Control-Allow-Origin: *");		
		header("HTTP/1.1 $code $ext");
		header('Content-type: application/json; charset=utf-8');

		if ($code !=200 && !is_array($data)) {
			$tmp['msg'] = $data;			
			$data = $tmp;
		}
		
		if($this->th)
			$data = $this->js_thai_encode($data);

		echo json_encode($data);
		exit;
	}

	public function sendOk($data) {
		$this->sendNow($data,200);
	}

	public function send_ok($data) {
		$this->sendNow($data,200);
	}	

	public function send_ok_th($data) {
		$this->th = true;
		$this->sendNow($data,200);
	}
		
	public function sendFail($data,$code="400",$ext="") {
		$this->sendNow($data,$code,$ext);
	}
	
	public function send_fail($data,$code="400",$ext="") {
		$this->sendNow($data,$code,$ext);
	}
	
	  
 
  
 
  //send file
  public function array2csv(array &$array,array &$array2 =null)
  {
    if (count($array) == 0) {
     return null;
    }
    ob_start();
    $df = fopen("php://output", 'w');
    fputcsv($df, array_keys(reset($array)));
    if ($array2 !=null)
      fputcsv($df, array_keys($array2));
    foreach ($array as $row) {
      fputcsv($df, $row);
    }
    fclose($df);
    return ob_get_clean();
  }
  public function send_csv($s,$filename='',$a2=null) {
    if ($filename =='') 
    	$filename ="export-".date("YmdHis").".csv";
    $this->send_file($this->array2csv($s,$a2),$filename);
  }
  public function send_file($s,$filename) {
    $now = gmdate("D, d M Y H:i:s");
    header("Expires: Tue, 03 Jul 2001 06:00:00 GMT");
    header("Cache-Control: max-age=0, no-cache, must-revalidate, proxy-revalidate");
    header("Last-Modified: {$now} GMT");

    // force download
    // header("Content-Type: application/force-download");
    // header("Content-Type: application/octet-stream");
    // header("Content-Type: application/download");

    // disposition / encoding on response body
    header("Content-Disposition: attachment;filename={$filename}");
    header("Content-Transfer-Encoding: binary");
    echo $s;
    exit;
  }





}


if( !function_exists('apache_request_headers') ) {
///
function apache_request_headers() {
  $arh = array();
  $rx_http = '/\AHTTP_/';
  foreach($_SERVER as $key => $val) {
    if( preg_match($rx_http, $key) ) {
      $arh_key = preg_replace($rx_http, '', $key);
      $rx_matches = array();
      // do some nasty string manipulations to restore the original letter case
      // this should work in most cases
      $rx_matches = explode('_', $arh_key);
      if( count($rx_matches) > 0 and strlen($arh_key) > 2 ) {
        foreach($rx_matches as $ak_key => $ak_val) $rx_matches[$ak_key] = ucfirst($ak_val);
        $arh_key = implode('-', $rx_matches);
      }
      $arh[$arh_key] = $val;
    }
  }
  // print_r($arh);
  return( $arh );
}
///
}