<?php
 
 


// application resource class we code all helper here
class Resource extends Api_core {
	
 
  protected function check_auth () {
    global $resource,$method;
           
    $GLOBALS['app']['token'] = $this->http_token;
      
    
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
      
    //echo $tmp ;     
    //echo in_array($tmp, $noAuthApi); 
     
    if (in_array($tmp, $noAuthApi)) return true;
     
    //return true ;

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
    	//$this->verifyToken($token);	   	 
    	 
		$this->auth = array();
 
    }
 
    if (! $res) return (! $res); 
    $this->send_fail(L("Auth. Fail 77 code %s",$res),true);
  }

  	
  
  
 			
	////////////////////////////////////////////////////////////////////////////////////
 
  
	public function table_cols($tab) {  
		$sql = "SHOW COLUMNS FROM {$tab}";
	    $col_table = $this->db->iGetRows($sql);
	    $cols = array();
	    foreach($col_table as $id=>$col)
	       	array_push($cols,$col["Field"]);
	    return 	$cols;   	
	}
  
	function getPK($tab){
		$sql = " SHOW KEYS FROM $tab WHERE Key_name = 'PRIMARY' ";
		$key = $this->db->iGetRow($sql);
		$PK = $key["Column_name"];
		return $PK ;
	}
  		
  	function genRow($dr){
 		if( $dr == null ){
			echo "No row <br><br>";
			return ;
		}
 		
 		echo "<table border='1' >";

		echo "<tr>";
		foreach( $dr as $j => $col ){
			echo "<td>".$j."</td>";
		}
		echo "</tr>";
 		
 		echo "<tr>";
		foreach( $dr as $j => $col ){
			$col = iconv("tis-620","utf-8",$col); 
			echo "<td>".$col."</td>";
		}
		echo "</tr>";
			
			
 		echo "</table>";		
		return  ;
 		
 	}
 	 	
 	function genTable($dt){
		
		if( count($dt) == 0 ){
			echo "No table <br><br>";
			return ;
		}
		
		echo "<table border='1' >";
		
 
 
		$count = 0;
		foreach( $dt as $i => $dr ){
			if($count==0){
				echo "<tr>";
				foreach( $dr as $j => $col ){
					echo "<td>".$j."</td>";
				}
				echo "</tr>";
			}
			
			echo "<tr>";
			foreach( $dr as $j => $col ){
				//$col = iconv("tis-620","utf-8",$col); 
				echo "<td>".$col."</td>";
			}
			echo "</tr>";
			
			$count++;
		} 
		
		echo "</table>";		
		return  ;
	}
	
	
			
	////////////////////////////////////////////////////////////////////////////////////

  	public function iGet_conf() {   	
  		$id = $_POST['id'] ;
  		$c_name = $_POST['c_name'] ;
		$row = $this->get_conf($c_name,$id) ;	
		$this->send_ok($row);
	}
 	public function iViewAll_conf() { 
 		$sql = " select * from conf order by c_name  " ;
		$rows = $this->db->iGetRows($sql) ;	
		
		$list=null;
		foreach($rows as $i=>$r1){
			if($r1["c_name"]=="") continue;
			$list[$r1["c_name"]]=$r1;
		}			
			
		$this->send_ok($list);
 	} 	
 		
 	public function iView_conf() { 
 		$sql = " select * from conf order by c_name  " ;
		$rows = $this->db->iGetRows($sql) ;	
		$this->send_ok($rows);
 	} 	
 	 	
 	function get_conf($c_name,$id="")
	{ 
		//ไปอ่านจาก conf
		$sql = " select * from conf order where id!=0 " ;
  		if($id!="")
  			$sql .= " and id = '$id' ";
  		else if($c_name!="")
  			$sql .= " and c_name = '$c_name' ";
		$row = $this->db->iGetRow($sql) ;
		return $row ;			
	}	
	
	public function iInsert_conf() {
		$id = $this->insert_conf($_POST);
		
		unset($_POST['c_name']); 
		$_POST['id']=$id;
		$this->iGet_conf();
	}
			
	function insert_conf($post) {
		
		$id = $post['id'] ;		
		$f0 = array('c_name','c_value','c_display','lng1','lng2','lng3','remark');
		foreach( $f0 as $i1=>$f1)
			if(isset($post[$f1]) ) $ht1[$f1] = $post[$f1]; 	
			
		if( $id == 0 ){			
			$this->db->iInsert("conf",$ht1);
			$id = $this->db->lastId ; 
		}		
		else {		   
		   $this->db->iUpdate("conf",$ht1," id = '$id' ");
		}
		
		return $id;				
	}
	
	public function iInsert_conf_all() {
		
		$conf_list = $_POST['conf_list'] ;		
		foreach ($conf_list as $i1 => $r1 )
		{
			$id = $this->insert_conf($r1) ;
			$conf_list[$i1]["id"] = $id;
		}
		
		$this->send_ok($conf_list);
	}
	
			
	////////////////////////////////////////////////////////////////////////////////////

 
   function getLastNo($c_type,$c_code,$size,$update){
   	  
   	 	if($update === '')$update=true;  
   	 	if($update === 'true')$update=true; 
   	 	if($update === 'false')$update=false; 
   	    if($size=="")$size=4; 

		$sql="select i_run_no from lastno where and c_type='$c_type' ";
	   	$last_no = $this->db->i_get_field($sql);
	   	//echo $sql ;
	   	if( $last_no == ""){
	   		if($update){ 
	   			$sql = "INSERT into lastno(c_type,i_run_no) VALUES('$c_type',1)";
	   			$this->db->i_query($sql);
	   		}	   		
			$last_no = 1;
		}else{
			$last_no++;
			 
			if($update){
				$sql = "UPDATE lastno set i_run_no = '$last_no' where c_type='$c_type'";
				$this->DB->i_query($sql); 			
			}						
		}
		
		$last_no = str_pad($last_no, $size, "0", STR_PAD_LEFT);
		$doc["c_type"] = $c_type;		
		$doc["c_code"] = $c_code;
		$doc["last_no"] = $last_no;
		$doc["doc_no"] = $c_code.$last_no;
		return $doc;
   }	
	
   public function iGet_last_no() {
   	//var_dump($_POST);
   	if( isset($_POST["c_type"]) )
   		$c_type = $_POST["c_type"];
   	else $c_type = isset($this->params[0]) ? $this->params[0] : "";
 
    if( isset($_POST["c_code"]) )
   		$c_code = $_POST["c_code"];
   	else $c_code = isset($this->params[1]) ? $this->params[1] : "";
   	  	
   	if( isset($_POST["size"]) )
   		$size = $_POST["size"];
   	else $size = isset($this->params[2]) ? $this->params[2] : 4;
   	
   	if( isset($_POST["update"]) )
   		$update = $_POST["update"];
   	else $update = isset($this->params[3]) ? $this->params[3] : true;

    $doc = $this->getLastNo($c_type,$c_code,$size,$update);
	$this->send_ok($doc); 
   }

			
	////////////////////////////////////////////////////////////////////////////////////
	
	
	
}
?>