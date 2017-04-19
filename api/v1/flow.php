<?php
 

 
class Flow extends Resource
{ 	
 	 	
	public function __construct($params) {
 		parent::__construct($params);
		

	}
	
	/////////////////////////////////////////////////////////////////////////

  	public function iView_lanes(){
  		
  		if( isset($this->params[0]) ) $e_status = $this->params[0] ;
  		else $e_status = $_POST['e_status'] ;
		$sql = " select * from lanes where lane_id !=0 ";
		if($e_status!='')
			$sql .= " and e_status = '$e_status' ";
		$sql .= "order by c_seq";
		
		$rows = $this->db->iGetRows($sql);
		$this->send_ok($rows);
		
	}
	
	public function iGet_lanes() { 		   
		if(isset($_POST['id']) )  $lane_id = $_POST['id'];
		else if(isset($_POST['lane_id']) )  $lane_id = $_POST['lane_id'];
		else $lane_id = 0 ;
		
		$sql = " select * from lanes where lane_id = '$lane_id' ";
		$row = $this->db->iGetRow($sql);
		$this->send_ok($row);			
	} 
	
 	public function iInsert_lanes() { 		

		if(isset($_POST['id']) )  $lane_id = $_POST['id'];
		else if(isset($_POST['lane_id']) )  $lane_id = $_POST['lane_id'];
		else $lane_id = 0 ;
		
		$f0 = array('lng1_c_name','lng2_c_name','lng3_c_name','e_status','i_user');
		foreach( $f0 as $i1=>$f1)
			if(isset($_POST[$f1]) ) $ht1[$f1] = $_POST[$f1]; 			
		
		$ht1['d_update']=$this->now;
		if( $lane_id == 0 ){
			
			if(isset($_POST['c_seq']) ){
				$c_seq = $_POST['c_seq'];				
				$ht1["c_seq"] = $this->iSet_lanes_c_seq(0,$c_seq); 
			}			
			$ht1['d_create']=$ht1['d_update'];
			$this->db->iInsert("lanes",$ht1);
			$lane_id = $this->db->lastId ; 
		}		
		else {
			
		   if(isset($_POST['c_seq']) ){
		   	  $c_seq = $_POST['c_seq'];	
		   	  $ht1["c_seq"] = $this->iSet_lanes_c_seq($lane_id,$c_seq); 
		   }		   
		   
		   $this->db->iUpdate("lanes",$ht1," lane_id='$lane_id' " );
		   
		  
		  if( isset($ht1["e_status"] ) ){
			 if($ht1["e_status"] == 'cancel'){
				 
				 $sql = " set @x = 0 ";
				 $this->db->iQuery($sql);
				 
				 //เรียงใหม่
				$sql = "
update lanes 
set  c_seq =  @x :=  @x + 1  
where c_seq  >= @x   
and e_status='normal'
order by c_seq " ; 			 
				$this->db->iQuery($sql);	
			}		  	
		  } 
		
		}
		
		unset($_POST['id']);		   
		$_POST['lane_id']=$lane_id;
		$this->iGet_lanes();
	}
	
	function iSet_lanes_c_seq($id,$c_seq)
	{
	 	if( $c_seq == "0" || $c_seq == "" )
		{
			$sql = "select max(c_seq)+1 from lanes where e_status='normal' " ;
			$c_seq = $this->db->iGetField($sql);
			 
		}else
		{		
			$sql = " SET @x = $c_seq  " ;  
			$this->db->iQuery($sql);	

			$sql = "
update lanes 
set  c_seq =  @x :=  @x + 1  
where c_seq  >=   @x  
and lane_id != '$id'   
and e_status='normal'
order by c_seq " ;
 			 
			$this->db->iQuery($sql);			
		}
		return $c_seq ;
			 
	}


	
	/////////////////////////////////////////////////////////////////////////
  			
  	public function iView_agent(){
  		
  		if( isset($this->params[0]) ) $e_status = $this->params[0] ;
  		else $e_status = $_POST['e_status'] ;
		$sql = " select * from agent where agent_id !=0 ";
		if($e_status!='')
			$sql .= " and e_status = '$e_status' "; 
		$sql .= "order by c_seq";
		
		$rows = $this->db->iGetRows($sql);
		$this->send_ok($rows);
		
	}
	
	public function iGet_agent() { 		   
		if(isset($_POST['id']) )  $agent_id = $_POST['id'];
		else if(isset($_POST['agent_id']) )  $agent_id = $_POST['agent_id'];
		else $agent_id = 0 ;
		
		$sql = " select * from agent where agent_id = '$agent_id' ";
		$row = $this->db->iGetRow($sql);
		$this->send_ok($row);			
	} 
	
 	public function iInsert_agent() { 		

		if(isset($_POST['id']) )  $agent_id = $_POST['id'];
		else if(isset($_POST['agent_id']) )  $agent_id = $_POST['agent_id'];
		else $agent_id = 0 ;
		
		$f0 = array('lng1_c_name','lng2_c_name','lng3_c_name','e_status','i_price','i_hour','i_month','c_mobile');
		foreach( $f0 as $i1=>$f1)
			if(isset($_POST[$f1]) ) $ht1[$f1] = $_POST[$f1]; 			
		
		$ht1['d_update']=$this->now;
		if( $agent_id == 0 ){
			
			if(isset($_POST['c_seq']) ){
				$c_seq = $_POST['c_seq'];				
				$ht1["c_seq"] = $this->iSet_agent_c_seq(0,$c_seq); 
			}			
			$ht1['d_create']=$ht1['d_update'];
			$this->db->iInsert("agent",$ht1);
			$agent_id = $this->db->lastId ; 
		}		
		else {
			
		   if(isset($_POST['c_seq']) ){
		   	  $c_seq = $_POST['c_seq'];	
		   	  $ht1["c_seq"] = $this->iSet_agent_c_seq($agent_id,$c_seq); 
		   }		   
		   
		   $this->db->iUpdate("agent",$ht1," agent_id='$agent_id' " );
		   
		  
		  if( isset($ht1["e_status"] ) ){
			 if($ht1["e_status"] == 'cancel'){
				 
				 $sql = " set @x = 0 ";
				 $this->db->iQuery($sql);
				 
				 //เรียงใหม่
				$sql = "
update agent 
set  c_seq =  @x :=  @x + 1  
where c_seq  >= @x   
and e_status='normal'
order by c_seq " ; 			 
				$this->db->iQuery($sql);	
			}		  	
		  } 
		
		}
		
		unset($_POST['id']);		   
		$_POST['agent_id']=$agent_id;
		$this->iGet_agent();
	}
	
	function iSet_agent_c_seq($id,$c_seq)
	{
	 	if( $c_seq == "0" || $c_seq == "" )
		{
			$sql = "select max(c_seq)+1 from agent where e_status='normal' " ;
			$c_seq = $this->db->iGetField($sql);
			 
		}else
		{		
			$sql = " SET @x = $c_seq  " ;  
			$this->db->iQuery($sql);	

			$sql = "
update agent 
set  c_seq =  @x :=  @x + 1  
where c_seq  >=   @x  
and agent_id != '$id'   
and e_status='normal'
order by c_seq " ;
 			 
			$this->db->iQuery($sql);			
		}
		return $c_seq ;
			 
	}		

	
	/////////////////////////////////////////////////////////////////////////	
	
	
	
	
			  
}
?>