<?php
// mysql.class.php
// 2013-10-06
// minimal mysql class for thaiadpoint.tap10 project
class Mysql
{
    public      $conf,$resource_id;
    private     $magic_word = "5678";
    public      $last_insert_id,$lastId,$query;
    public 		$check_connect = false;


	public function i_query($sql) { return $this->iQuery($sql); }
	public function i_get_field($sql) { return $this->iGetField($sql); }
	public function i_get_row($sql) { return $this->iGetRow($sql); }
	public function i_get_rows($sql) { return $this->iGetRows($sql); }
	public function i_insert($table,$fld,$isDebug=false) { return $this->iInsert($table,$fld,$isDebug); }
	public function i_update($table,$fld,$identifier,$isDebug=false) { return $this->iUpdate($table,$fld,$identifier,$isDebug); }
	
	public function iSelectFld($sql) { return $this->iGetField($sql); }
	public function iSelectRow($sql) { return $this->iGetRow($sql); }
	public function iSelect($sql) { return $this->iGetRows($sql); }
	
	
	
    public function __construct($conf) {
        if (is_array($conf)){ 
        	$this->conf =$conf;
        	//var_dump($this->conf);
        }
        else {  // default setting
            $this->conf = $GLOBALS["db_conf"];
        }
        
        // connect db if need
        //var_dump($this->conf); 
        
        //2015-07-10 ngearb connect more server use mysql_pconnect
        /*
        if($this->conf['host']=="localhost")
        	$this->resource_id =@mysql_connect($this->conf['host']
                                        , $this->conf['db_user']
                                        , $this->conf['db_passwd']
                                        , TRUE);
        else
        	$this->resource_id =@mysql_pconnect($this->conf['host']
                                        , $this->conf['db_user']
                                        , $this->conf['db_passwd']
                                        , TRUE);
        */        

/*        
มีข้อแตกต่างกันอยู่ 2 หลัก คือ
1.mysql_pconnect จะตรวจสอบก่อนทำการเชื่อมต่อฐานข้อมูลก่อนว่ามีการเชิ่อมต่อเดิมอยู่หรือไม่ ถ้ามีก็การเชื่อมต่อเดิมอยู่แล้วจะใช้การการเชื่อมต่อเดิมนั้นแทนโดยไม่ต้องเชื่อมต่อใหม่ทุกครั้งเหมือน mysql_connect 
2. การเชิ่อมต่อไปยัง SQL server ด้วย mysql_pconnect จะไม่ปิดลงหลักจากสคริปสิ้นสุดการทำงานแล้ว แต่การเชิ่อมต่อนั้นจะยังคงเปิดไว้ใช้ต่อไป การปิดการเชื่อมต่อด้วย คำสั่ง mysql_close() 
จะใช้ไม่ได้กับการเชื่อมต่อแบบ mysql_pconnect แต่การเชื่อมต่อแบบ mysql_pconnect 
จะปิดลงเมื่อมีการปิดบราวเซอร์นั้นๆ ลง

หมายเหตุ 
- การเชื่อมต่อแบบ mysql_pconnect ทำให้ไม่จำเป็นที่จะต้องเชื่อมต่อกับ SQL server ทุกครั้ง แต่ข้อเสียคือถ้ามีผู้ใช้จำนวนมาก อาจส่งผลต่อการเชื่อมต่อกับ SQL server ได้
*/


		$host = $this->conf['host'];
		if( isset($this->conf['port']) )  $host .= ":". $this->conf['port'];
		//echo "host $host ";
        $this->resource_id =@mysql_pconnect( $host //$this->conf['host'] //.":3306"
                                        , $this->conf['user']
                                        , $this->conf['passwd']
                                        , TRUE);
        //var_dump($this->resource_id); 
		$chk = @mysql_select_db($this->conf['dbname'],$this->resource_id);    
        //var_dump($chk);
        if ( !$chk ){
			//echo "Unable to connect to the database";
			$this->check_connect = false;
		}else{
			@mysql_query("SET NAMES UTF8"); 
			//2015-07-10 ngearb set tis620_thai_ci
			//@mysql_query("SET NAMES 'utf8' COLLATE 'tis620_thai_ci'",$this->resource_id); 
			$this->check_connect = true;
			
		} 
		
		
    }
    
    

    public function i_select_db($db_name) {
        mysql_select_db($db_name,$this->resource_id);
    }
    
    function i_die($err_no="",$err_msg="") {
        $err_no     =mysql_errno();
        $err_msg    =mysql_error();
        //echo "<h1>ERROR</h1><p>$err_no ::<br>$err_msg"."<p>SQL=<br>".$this->query;
        header("HTTP/1.1 400");
        header('Content-type: application/json');

        $res["success"]     =false;
        $res["error"]["code"]   ="DB-".$err_no;
        $res["error"]["msg"]    =$err_msg;
        $res["error"]["sql"]    =$this->query;

        echo json_encode($res);
        exit;
    }

    public function iGetField($query) {
        $rx =$this->iQuery($query);
        $fx =@mysql_fetch_array($rx);
        return $fx[0];
    }

    public function iGetRow($query) {
        $rx =$this->iQuery($query);
        return @mysql_fetch_assoc($rx);
    }

    public function iGetRows($query) {
    	//echo $query;
        $a  = array();
        $rx = $this->iQuery($query);
        while ($fx =mysql_fetch_assoc($rx)) {
            array_push($a, $fx);
        }
        return $a;
    }

    // use i_die() for dev purpose, in production we will suppress all errors
    public function iQuery($query) {
        $this->query =$query;
        $rx =@mysql_query($this->query,$this->resource_id); // or $this->i_die();
        //$rx =@mysql_query($this->query,$this->resource_id) or $this->i_die();
        return $rx;
    }
    
	
    public function iInsert($table,$fld,$isDebug=false) {
        $i =0;
        $keys = array();
        $vals = array();
        foreach ($fld as $k1 =>$v1) {  
        
        	/* //use for mysql 4
        	if(substr($k1,0,2)=="c_") { 
        		//echo $k1 . " " ; var_dump($v1);
        		$v1 = iconv("utf-8","tis-620",$v1);
        	}*/
        	
            $keys[$i] = $this->PMA_backquote($this->PMA_sqlAddSlashes($k1));     
            $vals[$i] = "'" . $this->PMA_sqlAddSlashes($v1) . "'";
            $i++;
        }
        return $this->i_insert_key_value($table,$keys,$vals,$isDebug);
    }
    public function i_insert_key_value($table, $keys, $values ,$isDebug=false) {
    	$sql = "INSERT INTO ".$this->PMA_backquote($table)." (".implode(', ', $keys).") VALUES (".implode(', ', $values).")";
    	if( $isDebug )  echo $sql;
    	  
        $res =$this->i_query($sql);
        //echo "INSERT INTO ".$this->PMA_backquote($table)." (".implode(', ', $keys).") VALUES (".implode(', ', $values).")";
        $this->lastId = $this->last_insert_id = @mysql_insert_id($this->resource_id);
        return $res;
    }

    public function iUpdate($table,$fld,$where_clause,$isDebug=false) {
        $i =0;
        $query_values = array();
        foreach ($fld as $k1 =>$v1) {
        	
        	/* //use for mysql 4
        	if(substr($k1,0,2)=="c_"){
        		//echo $k1 . " " ; var_dump($v1);
        		$v1 = iconv("utf-8","tis-620",$v1);
        	}*/
            $query_values[$i] = $this->PMA_backquote($this->PMA_sqlAddSlashes($k1))
                              . "="
                              . "'" . $this->PMA_sqlAddSlashes($v1) . "'";
            $i++;
        }
        
        $sql = 'UPDATE ' . $this->PMA_backquote($table)
                . ' SET ' . implode(', ', $query_values) . ' WHERE ' . $where_clause;
                
        if( $isDebug )  echo $sql;
               
        return $this->i_query($sql);
    }

    public function i_delete($table,$where_clause) {
        return $this->i_query("DELETE FROM ".$this->PMA_backquote($table).' WHERE '.$where_clause);
    }
	
	
	///////////////////////////////////////////////////////////////////
	
    // function borrow from phpMyAdmin
    function PMA_backquote($a_name, $do_it = true)
    {
        if (is_array($a_name)) {
            foreach ($a_name as &$data) {
                $data = PMA_backquote($data, $do_it);
            }
            return $a_name;
        }

        if (! $do_it) {
            global $PMA_SQPdata_forbidden_word;

            if (! in_array(strtoupper($a_name), $PMA_SQPdata_forbidden_word)) {
                return $a_name;
            }
        }

        // '0' is also empty for php :-(
        if (strlen($a_name) && $a_name !== '*') {
            return '`' . str_replace('`', '``', $a_name) . '`';
        } else {
            return $a_name;
        }
    } // end of the 'PMA_backquote()' function

    function PMA_sqlAddSlashes($a_string = '', $is_like = false, $crlf = false, $php_code = false)
    {
        if ($is_like) {
            $a_string = str_replace('\\', '\\\\\\\\', $a_string);
        } else {
            $a_string = str_replace('\\', '\\\\', $a_string);
        }

        if ($crlf) {
            $a_string = strtr(
                $a_string,
                array("\n" => '\n', "\r" => '\r', "\t" => '\t')
            );
        }

        if ($php_code) {
            $a_string = str_replace('\'', '\\\'', $a_string);
        } else {
            $a_string = str_replace('\'', '\'\'', $a_string);
        }

        return $a_string;
    } // end of the 'PMA_sqlAddSlashes()' function


	///////////////////////////////////////////////////////////////////

    public function iconv($v1){
		$v1 = iconv("utf-8","tis-620",$v1);
		return $v1;
	}
	 public function iconv2utf8($v1){
		$v1 = iconv("tis-620","utf-8",$v1);
		return $v1;
	}
	
	
    public function i_password($txt) {
        return md5($this->magic_word.$txt);
    }
    public function i_delete_token($token) {
        $this->i_query("delete from ab_token where c_token='$token'");
    }
    public function i_create_token($txt,$user_id,$email,$app_id) {
        //delete all token of this user
        //create new token for this session
        $this->i_query("delete from ab_token where user_id='$user_id' and c_app_id='$app_id'");
        $d1     = date("Y-m-d H:i:s");
        $f1["user_id"]  = $user_id;
        $f1["c_email"]  = $email;
        $f1["c_app_id"] = $app_id;
        $f1["c_token"]  = md5($this->magic_word.$d1.$txt);
        $f1["d_create"] = date("Y-m-d H:i:s");
        $f1["d_expire"] = date('Y-m-d H:i:s', strtotime('+1 hour'));
        $this->iInsert("ab_token",$f1);
        return $f1["c_token"];
    }
    
    
    
}