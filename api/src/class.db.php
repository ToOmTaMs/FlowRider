<?php
// class.db.php
// 2015-06-22
// db PDO style
// extends from PDO class, so you can use all PDO method
 

class iDB extends PDO {
	
	public $dsn = "" ;
	 
	public function __construct($dsn ="", $user ="", $passwd ="") {
		if ($dsn ==="") {
			// $dsn = "sqlite:".APP_DB_FOLDER."tap10.sqlite3";
      $dsn = 'mysql:host=192.168.1.224;dbname=1-fr-client;charset=utf8;port=3306;';
      $user = 'root';
      $passwd = '';
		}
		
	//$connection = new PDO('mysql:host='.$host.';dbname='.$database.';charset=utf8', $user, $password, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES 'utf8'"));
				
		parent::__construct($dsn,$user,$passwd);
		
		$this->exec("set names utf8");
 
 		$this->dsn = $dsn;
 		//echo $dsn;
		return $this;
	}
	
	public $lastId = 0;

	public function iQuery($sql,$params=null,$rawSql=false) {
	 if (isset($params)) {
      	$stmt = $this->prepare($sql);
        if (!$stmt) {
        	//var_dump($this::errorInfo());
        	exit;        	
        }
        $res = $stmt->execute($params);
        if (!$res) {
          //var_dump($this::errorInfo());
          var_dump($stmt->errorInfo());
          exit;         
        }
        return $stmt;
     } else {
     	$stmt = $this->query($sql);
     	if (!$stmt) { 
         	//var_dump($stmt->errorInfo());
        	//exit;        	
        }
     	return $stmt; 
        //return $this->query($sql);
     }		
	}

	public function iGetField($sql,$params=null,$rawSql=false) {
		$stmt = $this->iQuery($sql,$params,$rawSql);
		$row = $stmt->fetch(PDO::FETCH_NUM);
	    if ($row) {
	        return $row[0];
	    } else {
	        return false;
	    }
	}

	// remember $params is array with integer index, not an assoc array
	public function iGetRow($sql,$params=null,$rawSql=false) {
		$stmt = $this->iQuery($sql,$params,$rawSql);
		//echo $sql;
		return $stmt->fetch(PDO::FETCH_ASSOC);
	}
	public function iGetRows($sql,$params=null,$rawSql=false) {
		//echo $sql;
		$stmt = $this->iQuery($sql,$params,$rawSql);
		return $stmt->fetchAll(PDO::FETCH_ASSOC);
	}
  public function iInsert($table, array $data,$sqlOnly = false,$isDebug=false)
  {
  	$data1 = $data;
  	foreach ($data1 as $k1 =>$v1) {
  		if ($k1[0] ==='_') unset($data[$k1]);
  		$indexOf = strpos($k1,'.');
  		if( $indexOf > 0 ){
  			//echo ">".$k1.strpos($k1,'.')."<";
  			$k2 = substr($k1,$indexOf+1);
  			//echo ">".$k2."<";
			unset($data[$k1]);
			$data[$k2] = $v1;
		}  		
  	}
  	$sql = 'INSERT INTO ' . $table . ' (' . implode(', ', array_keys($data)) . ')' 
  			   .' VALUES (' . implode(', ', array_fill(0, count($data), '?')) . ')';
	if ($sqlOnly) return $sql;
	//echo $sql;
	
	 
	//var_dump($data);
	if($isDebug){
		$vaule = implode("', '", array_values($data));
		$vaule = " '".substr($vaule,0,strlen($vaule))."' ";
		$sql1 = "INSERT INTO " . $table . " (" . implode(", ", array_keys($data)) . ")" 
	  			   ." VALUES ( " . $vaule . " )";
		echo $sql1;
	}
	
	
	$stmt = $this->iQuery($sql,array_values($data),true);
	$this->lastId = $this->lastInsertId();
    return $stmt;
  }
  public function iUpdate($table, array $data, array $identifier,$sqlOnly = false,$isDebug=false)
  {
  	$data1 = $data;
  	foreach ($data1 as $k1 =>$v1) {
  		if ($k1[0] ==='_') unset($data[$k1]);
  		$indexOf = strpos($k1,'.');
  		if( $indexOf > 0 ){
  			//echo ">".$k1.strpos($k1,'.')."<";
  			$k2 = substr($k1,$indexOf+1);
  			//echo ">".$k2."<";
			unset($data[$k1]);
			$data[$k2] = $v1;
		}  		
  	}
  	
    $set = array();
    foreach ($data as $columnName => $value) {
      $set[] = $columnName . ' = ?';
    }
    $params = array_merge(array_values($data), array_values($identifier));

    $sql  = 'UPDATE ' . $table . ' SET ' . implode(', ', $set)
            . ' WHERE ' . implode(' = ? AND ', array_keys($identifier))
            . ' = ?';
	if ($sqlOnly) return $sql;  
	  
 	
	//var_dump($data);
	foreach ($data as $columnName => $value) {
      $set1[] = $columnName . " = '$value' ";
    }
    foreach ($identifier as $columnName => $value) {
      $where1[] = $columnName . " = '$value' AND";
    }
     
	if($isDebug){
		$vaule = implode("', '", $where1);
		$vaule =  substr($vaule,0,strlen($vaule)-3);
		$sql1 = 'UPDATE ' . $table . ' SET ' . implode(', ', $set1)
	  			   . ' WHERE ' . $vaule   ;			
		echo $sql1;
	}
		
    return $this->iQuery($sql, $params, true);
  }	
  public function iDelete($table,array $identifier) {
  	$sql  = 'DELETE FROM ' . $table 
            . ' WHERE ' . implode(' = ? AND ', array_keys($identifier))
            . ' = ?';
    return $this->iQuery($sql, array_values($identifier), true);
  }

  // for compatible with old version
	public function i_query($sql,$params=null) { return $this->iQuery($sql,$params); }
	public function i_get_field($sql,$params=null) { return $this->iGetField($sql,$params); }
	public function i_get_row($sql,$params=null) { return $this->iGetRow($sql,$params); }
	public function i_get_rows($sql,$params=null) { return $this->iGetRows($sql,$params); }
	
	public function i_insert($table,$fld,$isDebug=false) { return $this->iInsert($table,$fld,$isDebug); }
	public function i_update($table,$fld,$identifier,$isDebug=false) { return $this->iUpdate($table,$fld,$identifier,$isDebug); }
	
	public function iSelectFld($sql,$params=null) { return $this->iGetField($sql,$params); }
	public function iSelectRow($sql,$params=null) { return $this->iGetRow($sql,$params); }
	public function iSelect($sql,$params=null) { return $this->iGetRows($sql,$params); }
	
		
}