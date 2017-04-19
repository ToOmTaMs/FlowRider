<?php
 

 
class User extends Resource
{ 	
	public function __construct($params) {
 		parent::__construct($params);
 		 
 
	}
	public function test() { 
		$this->password();
	}	
	public function password() { 
	
		$c_passwd = "thanlok07";
		$id = "16" ;
		
		$a = $this->iHash($id.$c_passwd);
	
		$this->sendOk($a);
	}	
	  
	function get_user_sql(){
		$sql = "
select '1' as IsUser 
, a.* 

, concat( a.lng1_PreName , _utf8' ' , a.lng1_FName , _utf8' ' , a.lng1_LName  ) as lng1_FullName   
, concat( a.lng2_PreName , _utf8' ' , a.lng2_FName , _utf8' ' , a.lng2_LName  ) as lng2_FullName   
, concat( a.lng3_PreName , _utf8' ' , a.lng3_FName , _utf8' ' , a.lng3_LName  ) as lng3_FullName 

, concat( a.lng1_PreName , _utf8' ' , a.lng1_FName , _utf8' ' , a.lng1_LName  ) as lng1_UserName   
, concat( a.lng2_PreName , _utf8' ' , a.lng2_FName , _utf8' ' , a.lng2_LName  ) as lng2_UserName   
, concat( a.lng3_PreName , _utf8' ' , a.lng3_FName , _utf8' ' , a.lng3_LName  ) as lng3_UserName 

, ifnull( ur.Role_id , 0 ) as Role_id 
, ifnull( ur.RoleName , '' ) as RoleName
, '' as Note 
from user a   
left outer join
( 
	select a.* 
    , b.c_name as RoleName 
    from u_user_role a , u_role b  
	where a.Role_id = b.Role_id 
	group by a.UserNum 
) as ur on ur.UserNum = a.UserNum 
where 
a.e_status = 'normal' ";
		return $sql ; 
	}  

	public function iGetUser()
	{

		
		
		$UserName = "";
		$Password = "";
		if(isset($_POST['UserName'])) $UserName = trim($_POST['UserName']);  		
		if(isset($_POST['Password'])) $Password = trim($_POST['Password']); 
		
		//$UserName = "5555";			
		//$Password = "5555";	
				
		$sql = $this->get_user_sql();
		$sql .= " and a.UserName = '$UserName' " ; 

		//echo $sql ; 
		$dr = $this->db->iGetRow($sql);
				
		if( $dr == null )
		{
			$dr["IsUser"] = 0 ;
			$dr["UserNum"] = 0 ;
			$dr["Note"] = "No User Name" ;
		}
		else
		{
			//$UserNum = $dr["UserNum"] ; 
			//$UserPage = $this->iGetUser_UserPage($UserNum) ;
			//$dr["UserPage"] = $UserPage->result_array   ;
			
			$Password_md5 = md5($Password);
			
			if( $Password_md5 == $dr["Password"]  )
			{
				$dr["IsUser"] = "1" ;
				$dr["token"] = $this->iCreateToken($UserName);   					
				
			}else
			{
				$dr["IsUser"] = "0" ;
				$dr["Note"] = "Password is wrong" ;			 
			}
			
		}			
				
		
		$this->sendOk($dr);		
		
		
	}	
	  
	public function login() { 
		   
		$f1['c_email'] = $_POST['c_name'];
		$f1['c_passwd'] = $_POST['c_passwd'];

		$u_info = $this->db->iGetRow("select * from u_info where e_status = 'normal' and c_email=?",array($f1['c_email']));
		if ($u_info) {			
			if (!$this->iVerifyHash($u_info['id'].$f1['c_passwd'],$u_info['c_passwd']))
				$this->sendFail('รหัสผ่าน ไม่ถูกต้อง');
				//$this->sendFail('รหัสผ่าน ไม่ถูกต้อง'.$this->iHash($u_info['id'].$f1['c_passwd']));
			$f1 = $u_info;
			$this->db->iUpdate('u_info',array('d_last_login' =>$this->now),array('id'=>$f1['id']));
		}
		else {
			$this->sendFail('ไม่มีรหัสผู้ใช้ที่ระบุไว้s');
		}
		// create token
		$f1['token'] = $this->createToken($f1['id']);
		unset($f1['c_passwd']);
		

		if( $f1["c_setting"] != "\"\"" && $f1["c_setting"] != "" && $f1["c_setting"] != "{}"   ){
			$c_setting = json_decode($f1["c_setting"],true);
	
			foreach( $c_setting as $i1=>$f2)
				$f1[$i1]=$f2;		
		}		
		unset($f1['c_setting']);	
		
		$this->sendOk($f1);
	}
	
	public function settings() {
		$rows = $this->db->iGetRows("select * from u_meta where u_id=?",array($this->token['u_id']));
		$this->sendOk($rows);
	} 
 
  
}
?>