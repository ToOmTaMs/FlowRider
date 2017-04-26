<?php
 

 
class Member extends Resource
{ 	
 	private $col_member_hdr, $col_member_point  ;
 	
 	
	public function __construct($params) {
 		parent::__construct($params);
		
		$this->col_member_hdr = array('MemCode','FName','LName','NickName','Address',
			'Mobile','Email','BirthDay','Gender','e_status','d_expire',
			'e_new_old','d_register',
			//'c_setting'
			);
		
		$this->col_member_point = array('m_point','PayNum','PrtBillNum','e_payment_status' );
		
	}
	
	public function iInsert_member_group()  {
		$row= $this->insert_member_group_type($_POST,"Group");
		$this->send_ok($row);
	}
	
	public function iInsert_member_type()  {
		$row= $this->insert_member_group_type($_POST,"Type");
		$this->send_ok($row);
	}
	
	function insert_member_group_type($member,$type="Group",$chkPost=false)  {
 
		$f0 = array('lng1_c_name','lng2_c_name','lng3_c_name','e_status');
				
		if( $type == "Group" ){
			$c_table = "member_group" ;	
			$c_table2 = "" ;
			if($chkPost) $c_table2 = "member_group_" ;	 		
			//$hcode = "";
			//if( isset($member["member_group_hcode"]) )	$hcode = $member["member_group_hcode"];
			//else if( isset($member["hcode"]) )	$hcode = $member["hcode"];
			$c_id = "memberGroupNum";
			//$c_hcode = "MemberGroup";
			$id = 0 ;	
			if(isset($_POST['id']) )  $id = $_POST['id'];
			else if(isset($_POST[$c_id]) )  $id = $_POST[$c_id];		
						
		}else if( $type == "Type" ){
			$c_table = "member_type" ;
			$c_table2 = "" ;
			if($chkPost) $c_table2 = "member_type_" ;
			//$hcode = "";
			//if( isset($member["member_type_hcode"]) )	$hcode = $member["member_type_hcode"];	
			//else if( isset($member["hcode"]) )	$hcode = $member["hcode"];	
			$c_id = "memberTypeNum";
			//$c_hcode = "MemberType";
			$id = 0 ;			
			if(isset($_POST['id']) )  $id = $_POST['id'];
			else if(isset($_POST[$c_id]) )  $id = $_POST[$c_id];
		
		} 
		foreach( $f0 as $i1=>$f1){ 
			if(isset($member[$c_table2.$f1]) ) $ht1[$f1] = $member[$c_table2.$f1]; 	
		}
			
				
		$ht1["d_update"] = $this->now;
				  
		//$sql = " select * from $c_table where hcode = '$hcode' ";
		$sql = " select * from $c_table where $c_id = '$id' ";
		
		
		$row = $this->db->iGetRow($sql);		
		if( !$row ) { 		  
		 
			if( !isset($ht1["lng1_c_name"]) ){
				$sql = " select $c_id from $c_table where e_status='normal' limit 1 ";
				$id = $this->db->iGetField($sql);
				
			}else{
				$ht1["d_create"] = 	$ht1["d_update"];
				//$ht1["hcode"] = 	$this->iGet_hcode($c_hcode);
		
				$this->db->iInsert($c_table,$ht1);
				$id =$this->db->lastId ;				
			}
						
		}else{
			$chk = false;
			foreach( $f0 as $i1=>$f1){
				if(isset($member[$f1]) ){					
					if( $member[$f1] != $row[$f1] ) {
						$chk = true;
						break;
					}					 
				}
			}
			$id = $row[$c_id];
			if($chk) $this->db->iUpdate($c_table,$ht1," $c_id = '$id' ");			
		} 
 
		$sql = " select * from $c_table where $c_id = '$id' ";
		$row = $this->db->iGetRow($sql); 
		
		return $row;		
		
	} 
	
  	
  	public function iView_member_group(){  		
  		if( isset($this->params[0]) ) $e_status = $this->params[0] ;
  		else $e_status = $_POST['e_status'] ;
  		
		$sql = " select * from member_group a where a.memberGroupNum != 0 " ;
		if($e_status!='') $sql .= " and a.e_status = '$e_status' ";
		
		$rows = $this->db->iGetRows($sql);
		$this->send_ok($rows);
		
	}

  	public function iView_member_type(){
  		if( isset($this->params[0]) ) $e_status = $this->params[0] ;
  		else $e_status = $_POST['e_status'] ;
  		
		$sql = " select * from member_type a where a.memberTypeNum != 0 " ;
		if($e_status!='') $sql .= " and a.e_status = '$e_status' ";
		
		$rows = $this->db->iGetRows($sql);
		$this->send_ok($rows);
		
	}
	
	public function iGet_member_group() { 
		$memberGroupNum = 0 ;	   
		if(isset($_POST['id']) )  $memberGroupNum = $_POST['id'];
		else if(isset($_POST['memberGroupNum']) )  $memberGroupNum = $_POST['memberGroupNum'];
		
		$sql = " select * from member_group where memberGroupNum = '$memberGroupNum' ";
		$row = $this->db->iGetRow($sql);
		$this->send_ok($row);			
	} 

	public function iGet_member_type() { 
		$memberTypeNum = 0 ;	   
		if(isset($_POST['id']) )  $memberTypeNum = $_POST['id'];
		else if(isset($_POST['memberTypeNum']) )  $memberTypeNum = $_POST['memberTypeNum'];
 		
		$sql = " select * from member_type where memberTypeNum = '$memberTypeNum' ";
		$row = $this->db->iGetRow($sql);
		$this->send_ok($row);			
	} 
			
	////////////////////////////////////////////////////////////////////////////////////

 
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
   	
 	$c_code = substr((date("Y")+543),2);
 	$c_type = "member-".$c_code;
 	$size=5;
    $doc = $this->getLastNo($c_type,$c_code,$size,$update);
	$this->send_ok($doc); 
   }  	
 
  	
	public function iView_member_hdr() { 	
		if( isset($this->params[0]) ) $e_status = $this->params[0] ;
  		else $e_status = $_POST['e_status'] ;
  		
		$sql = $this->get_member_hdr_sql();
		$sql .= " where a.member_id != 0 " ;
		if($e_status!='') $sql .= " and a.e_status = '$e_status' ";
			
		$rows = $this->db->iGetRows($sql);
		$this->send_ok($rows);
	}
	
	public function iGet_member_hdr() { 		   
		$member_id = 0 ;
		if(isset($_POST['id']) )  $member_id = $_POST['id'];
		else if(isset($_POST['member_id']) )  $member_id = $_POST['member_id'];
						 
		$row = $this->get_member_hdr($member_id);
		
		if(isset($_POST['Insert'])) $row['Insert']=$_POST['Insert'];
		$this->send_ok($row);			
	} 
	function get_member_hdr_sql(){
		$sql = " 
select a.*  
, right(Mobile,4) as c_code
, if( year(BirthDay) < 1800 , '' 
       , year(now()) - year(BirthDay)  -  ( Right( date(now()) , 5 ) < Right( date(BirthDay) , 5 ) )  ) as age 
, concat(a.FName,_utf8' ',a.LName) as FLName
, ifnull(d.lng1_c_name , '' ) as lng1_Discount_name
, ifnull(d.lng2_c_name , '' ) as lng2_Discount_name
, ifnull(d.lng3_c_name , '' ) as lng3_Discount_name
, ifnull(d.DiscountNum , '0' ) as member_chk
, ifnull(b.lng1_c_name,'') as member_group_lng1_c_name
, ifnull(b.lng2_c_name,'') as member_group_lng2_c_name 
, ifnull(b.lng3_c_name,'') as member_group_lng3_c_name  
, ifnull(c.lng1_c_name,'') as member_type_lng1_c_name 
, ifnull(c.lng2_c_name,'') as member_type_lng2_c_name 
, ifnull(c.lng3_c_name,'') as member_type_lng3_c_name 

, ifnull(e.member_id,0) as member_hdr_use_id

from member_hdr a
left outer join(
  select * from member_group where e_status = 'normal'
) as b on a.memberGroupNum = b.memberGroupNum
left outer join(
  select * from member_type where e_status = 'normal'
) as c on a.memberTypeNum = c.memberTypeNum
left outer join(
	select * from setdiscount where e_status = 'normal' 
)as d on a.DiscountNum = d.DiscountNum	
left outer join(
	select member_id from membre_usehour group by member_id 
)as e on a.member_id = e.member_id	


		";
		return $sql;
	}

 	function get_member_hdr($member_id)	{
		$sql = $this->get_member_hdr_sql();
		$sql .= " where a.member_id = '$member_id' ";
		$row = $this->db->iGetRow($sql);
		return $row;
	}
		
	public function iInsert_member_hdr() { 
	 	
	 	$member_id=0;
		if(isset($_POST['id']) )  $member_id = $_POST['id'];
		else if(isset($_POST['member_id']) )  $member_id = $_POST['member_id'];
		 		 				
		$ht1["d_update"] = $this->now; 

		/*
		$this->col_member_hdr = array('member_id','hcode','MemCode','FName','LName','NickName','Address',
			'Mobile','Email','BirthDay','Gender','e_status','d_expire',
			'e_new_old','d_register',
			//'c_setting'
			);
		*/			
		$f0 = $this->col_member_hdr;
		foreach( $f0 as $i1=>$f1)
			if(isset($_POST[$f1]) ) $ht1[$f1] = $_POST[$f1]; 

	 	/*	
		if(isset($_POST["member_group_hcode"])){
			$row = $this->insert_member_group_type($_POST,"Group",true) ;
			$ht1["memberGroupNum"] = $row["memberGroupNum"];	
		}else if(isset($_POST["memberGroupNum"])){
			$ht1["memberGroupNum"] = $row["memberGroupNum"];	
		}
		*/
					
		if(isset($_POST["memberGroupNum"])) $ht1["memberGroupNum"] = $_POST["memberGroupNum"];					//unset($_POST["member_group_hcode"])	;
		unset($_POST["member_group_lng1_c_name"])	;
		unset($_POST["member_group_lng2_c_name"])	;
		unset($_POST["member_group_lng3_c_name"])	;
		unset($_POST["memberGroupNum"])	;		
		
		/*
		if(isset($_POST["member_type_hcode"])){
			$row = $this->insert_member_group_type($_POST,"Type",true) ;
			$ht1["memberTypeNum"] = $row["memberTypeNum"];			
		}else if(isset($_POST["memberTypeNum"])){
			$ht1["memberTypeNum"] = $row["memberTypeNum"];	
		}
		*/
	
		//unset($_POST["member_type_hcode"])	;
		unset($_POST["member_type_lng1_c_name"])	;
		unset($_POST["member_type_lng2_c_name"])	;
		unset($_POST["member_type_lng3_c_name"])	;
		unset($_POST["memberTypeNum"])	;	
		 
		if(isset($_POST["memberTypeNum"])) $ht1["memberTypeNum"] = $_POST["memberTypeNum"];	
		
		
		if( isset($_POST["c_setting"]) ){
			 $ht1["c_setting"] = $_POST["c_setting"]; 
			 unset($_POST["c_setting"])	;
		}else{
								 
			$f0 = array("d_update","d_create","Point_total"
			,"DiscountNum","lng1_Discount_name","lng2_Discount_name","lng3_Discount_name"
			,"member_chk","c_code","age","FLName"
			,"id"
			,"hcode"
			);
			$tmp = $_POST;
			foreach($f0 as $i1=>$r1)
				unset($tmp[$r1]);
			
			$table_cols = $this->col_member_hdr;
			$c_setting =array();
			foreach($tmp as $id=>$col)
				if(!in_array($id, $table_cols)){
					$c_setting[$id]=$col;
				}		
				
			unset($c_setting["member_id"]);		
			$ht1["c_setting"] =	json_encode($c_setting); 
		}
		
 
		if(isset($ht1["BirthDay"])) if($ht1["BirthDay"]=="0000-00-00") $ht1["BirthDay"]="0001-01-01";
		if(isset($ht1["d_expire"])) if($ht1["d_expire"]=="0000-00-00") $ht1["d_expire"]="0001-01-01";
		

		if( $member_id == 0 ){			
		
			$ht1["d_create"] = 	$ht1["d_update"];
			
			if( !isset($ht1["memberGroupNum"]) ){
				$sql = " select memberGroupNum from member_group where e_status='normal' limit 1 ";
				$ht1["memberGroupNum"] = $this->db->iGetField($sql);
			}
			if( !isset($ht1["memberTypeNum"]) ){
				$sql = " select memberTypeNum from member_type where e_status='normal' limit 1 ";
				$ht1["memberTypeNum"] = $this->db->iGetField($sql);
			}
			if( isset($ht1["memberGroupNum"]) ) 
				if($ht1["memberGroupNum"]=="" || $ht1["memberGroupNum"]==null) $ht1["memberGroupNum"] = 0;
			if( isset($ht1["memberTypeNum"]) ) 
				if($ht1["memberTypeNum"]==""  || $ht1["memberTypeNum"]==null) $ht1["memberTypeNum"] = 0;
			
			//var_dump($_POST);
			
			$c_code = substr((date("Y")+543),2);
 			$c_type = "member-".$c_code;
 			$size=5;
 			$update=true;
    		$doc = $this->getLastNo($c_type,$c_code,$size,$update);
    		$ht1["MemCode"] = $doc["doc_no"];
    
    
			
			$this->db->iInsert("member_hdr",$ht1);
			$member_id = $this->db->lastId ;	
		
			$_POST['Insert']=true;
			
			$c_type = "Insert";
																 
		}		
		else {		

		   $this->db->iUpdate("member_hdr",$ht1," member_id = '$member_id' ");
		   
		   $c_type = "Update";
	
		}
				
		unset($_POST['hcode']);
		unset($_POST['member_id']);
				 				   
		$_POST['id']=$member_id;
		$this->iGet_member_hdr();					
	}
	
	////////////////////////////////////////////////////////////////////////////////////
	public function iView_member_hdr_use() { 	
		$sql = $this->get_member_hdr_sql();
		$sql .= " having member_hdr_use_id != 0 ";
		
		$rows = $this->db->iGetRows($sql);
		$this->send_ok($rows);
		
	}
	 
	public function iGet_member_hdr_use() { 
		$member_id=0;
		if( isset($this->params[0]) ) $member_id = $this->params[0] ;
  		else if(isset($_POST['id']) )  $member_id = $_POST['id'];
		else if(isset($_POST['member_id']) )  $member_id = $_POST['member_id'];
		
		
		$sql = " select * from membre_usehour where member_id = '$member_id' ";
		
		$rows = $this->db->iGetRows($sql);
		$this->send_ok($rows);
		
	}
		 
	 
	 
		
	////////////////////////////////////////////////////////////////////////////////////
	public function iGet_member_point_PayNum() {
		$PayNum = 0 ;
		if(isset($_POST['PayNum']) )  $PayNum = $_POST['PayNum'];
		
		$sql = $this->get_member_point_sql() . " where a.PayNum = '$PayNum' $this->and_location_id ";
		$row = $this->db->iGetRow($sql);
		return $row;
	}
	
	public function iGet_member_point() { 		   
		$mem_point_id = 0 ;
		if(isset($_POST['id']) )  $mem_point_id = $_POST['id'];
		else if(isset($_POST['mem_point_id ']) )  $mem_point_id = $_POST['mem_point_id '];
						 
		$row = $this->get_member_point($mem_point_id);
		$this->send_ok($row);			
	} 
  	function get_member_point($mem_point_id)	{
		$sql = $this->get_member_point_sql() . " where a.mem_point_id = '$mem_point_id' ";
	 
		$row = $this->db->iGetRow($sql);
		return $row;
	}
	
	function get_member_point_sql()	{
		$sql = " select a.* , f.location_code , f.location_name
		from m_member_point a
		left outer join(
			select id as location_id , c_code as location_code , c_name as location_name
			from a_company $this->where_company_id 
		)as f on a.location_id = f.location_id		
		";
	  
		return $sql;
	}
	
	public function iView_member_point() { 		   
		$mem_hdr_id = 0 ;
		if( isset($_POST['hcode']) ){
			$hcode = $_POST['hcode'];	
			$row = $this->get_member_hdr_hcode($hcode);
			if($row) $mem_hdr_id = $row["mem_hdr_id"];
		}
		else if(isset($_POST['id']) )  $mem_hdr_id = $_POST['id'];
		else if(isset($_POST['mem_hdr_id']) )  $mem_hdr_id = $_POST['mem_hdr_id'];
						
		$sql = $this->get_member_point_sql() . " where a.mem_hdr_id = '$mem_hdr_id' ";
		$rows = $this->db->iGetRows($sql);
		$this->send_ok($rows);			
	}
	
	public function iInsert_member_point() { 
		 
		$mem_hdr_id = 0 ;
		if( isset($_POST['hcode']) ){
			$hcode = $_POST['hcode'];	
			$row = $this->get_member_hdr_hcode($hcode);
			if($row) $mem_hdr_id = $row["mem_hdr_id"];
		}
		else if(isset($_POST['id']) )  $mem_hdr_id = $_POST['id'];
		else if(isset($_POST['mem_hdr_id']) )  $mem_hdr_id = $_POST['mem_hdr_id'];
		 		 		
		if( $mem_hdr_id == 0 ) 	$this->send_ok(false);	
		
		$ht1["mem_hdr_id"] = $mem_hdr_id;		
		$ht1["d_create"] = $this->now;
		$ht1["d_update"] = $this->now;
		$ht1["company_id"] = $this->u_company_id;	
		$ht1["location_id"] = $this->u_location_id;	
		
		$f0 = $this->col_member_point;
		foreach( $f0 as $i1=>$f1)
			if(isset($_POST[$f1]) ) $ht1[$f1] = $_POST[$f1]; 

		$sql = "select * from  m_member_point a ,
		( select max(mem_point_id) as mem_point_id from m_member_point where mem_hdr_id = '$mem_hdr_id' ) as b
		where a.mem_point_id = b.mem_point_id
		";
		
		
		$ht1["m_prv"] = 0 ;
		$row = $this->db->iGetRow($sql);
		if($row) $ht1["m_prv"] = $row["m_remain"];
		$ht1["m_remain"] = $ht1["m_prv"] + $ht1["m_point"];
			
		$this->db->iInsert("m_member_point",$ht1);
		$mem_point_id = $this->db->lastId ;	
 
		$ht2["Point_total"] = $ht1["m_remain"] ;
		$ht2["d_update"] = $ht1["d_create"] ;
		$this->db->iUpdate("m_member_hdr",$ht2,array('mem_hdr_id'=>$mem_hdr_id));
 	 			   
		unset($_POST['mem_point_id']);   
		$_POST['id']=$mem_point_id;
		$this->iGet_member_point();		
			
	}
			

  			
		  
}
?>