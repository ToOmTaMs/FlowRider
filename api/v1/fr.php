<?php
 

 
class Fr extends Resource
{ 	
 	private $col_setitem ;
 	 	
	public function __construct($params) {
 		parent::__construct($params);
		
		
		$this->col_setitem = array('lng1_c_name','lng2_c_name','lng3_c_name','img_name','item_ext','e_status','menu_id','price',
		'e_special','setspecial_id','food_bevarage','prod_1to1','BarCode',
		'c_code','cost_type','cost_pct','cost_amt',
		'Printer_id',
		);
		
		
	}
	
	/////////////////////////////////////////////////////////////////////////

  	public function iView_menu(){
  		
  		if( isset($this->params[0]) ) $e_status = $this->params[0] ;
  		else $e_status = $_POST['e_status'] ;
		$sql = " select * from setmenu where menu_id !=0 and menu_ext='flow' ";
		if($e_status!='')
			$sql .= " and e_status = '$e_status' ";
		$sql .= "order by c_seq";
		
		$rows = $this->db->iGetRows($sql);
		$this->send_ok($rows);
		
	}

	public function iGet_menu() { 		   
		if(isset($_POST['id']) )  $menu_id = $_POST['id'];
		else if(isset($_POST['menu_id']) )  $menu_id = $_POST['menu_id'];
		else $menu_id = 0 ;
		
		$sql = " select * from setmenu where menu_id = '$menu_id' ";
		$row = $this->db->iGetRow($sql);
		$this->send_ok($row);			
	} 
	
 	public function iInsert_menu() { 		

		if(isset($_POST['id']) )  $menu_id = $_POST['id'];
		else if(isset($_POST['menu_id']) )  $menu_id = $_POST['menu_id'];
		else $menu_id = 0 ;
		
		$f0 = array('lng1_c_name','lng2_c_name','lng3_c_name','e_status');
		foreach( $f0 as $i1=>$f1)
			if(isset($_POST[$f1]) ) $ht1[$f1] = $_POST[$f1]; 			
			
		if( $menu_id == 0 ){
			
			if(isset($_POST['c_seq']) ){
				$c_seq = $_POST['c_seq'];				
				$ht1["c_seq"] = $this->iSet_menu_c_seq(0,$c_seq); 
			}			
			$ht1['menu_ext']="flow";
			$this->db->iInsert("setmenu",$ht1);
			$menu_id = $this->db->lastId ; 
		}		
		else {
			
		   $chk_del = false;
		   if( isset($ht1["e_status"] ) ){
			 if($ht1["e_status"] == 'cancel'){			 		
			 		$chk_del=true;
			 		$this->iSet_menu_c_seq($menu_id,$c_seq,$chk_del);
				}
			}
			
		   if(!$chk_del)	
			   if(isset($_POST['c_seq']) ){
			   	  $c_seq = $_POST['c_seq'];	
			   	  $ht1["c_seq"] = $this->iSet_menu_c_seq($menu_id,$c_seq); 
			   }
		   $this->db->iUpdate("setmenu",$ht1," menu_id='$menu_id' " );

		   if(isset($_POST['e_status']) ){
			   	if($ht1["e_status"] == 'cancel'){
			   		
					$sql=" update s_setitem 
						set e_status = 'cancel'
						where menu_id = '$menu_id'
					";
					$this->db->iQuery($sql);	
																						
				}
			}
			
					
		}
		
		unset($_POST['id']);		   
		$_POST['menu_id']=$menu_id;
		$this->iGet_menu();
	}
	
	function iSet_menu_c_seq($id,$c_seq,$isDel=false)
	{
	 	if( $c_seq == "0" || $c_seq == "" ){
			$sql = "select max(c_seq)+1 from setmenu where e_status='normal' " ;
			$c_seq = $this->db->iGetField($sql);
			 
		}
		else{		
			if($isDel) $c_seq = 0;
			
			$sql = " SET @x = $c_seq  " ;  
			$this->db->iQuery($sql);	

			$sql = "
update setmenu 
set  c_seq =  @x :=  @x + 1  
where c_seq  >=   @x  
and menu_id != '$id'   
and e_status='normal'
and menu_ext='flow'
order by c_seq " ;
 			 
			$this->db->iQuery($sql);			
		}
		return $c_seq ;
			 
	}


	
	/////////////////////////////////////////////////////////////////////////
 
  	public function iView_item(){
  		
  		if(isset($_POST['menu_id']) )  $menu_id = " and a.menu_id ='" . $_POST['menu_id'] . "' ";
  		else if(isset($this->params[0]) )  {
			if( $this->params[0] != "0" && $this->params[0] != "" ) $menu_id = " and a.menu_id ='" . $this->params[0] . "' ";
			else $menu_id = " and a.menu_id != '0'" ;
		}  			
		else $menu_id = " and a.menu_id != '0'" ;
		
		if(isset($_POST['e_status']) )  $e_status = " and a.e_status = '".$_POST['e_status']."' ";
		else if(isset($this->params[1]) ) $e_status = " and a.e_status ='" . $this->params[1] . "' ";
		else $e_status = "" ;
		
		if(isset($_POST['order_by']) )  $order_by = " order by a.".$_POST['order_by']." ";
		else if(isset($this->params[2]) ) $order_by = " order by a." . $this->params[2] . "' ";
		else $order_by = "" ;	
				
		$sql = $this->get_sql_item();
		$sql .= $menu_id . $e_status ;
		$sql .= $order_by ;
		
		//echo $sql ;
						
		$rows = $this->db->iGetRows($sql);
		$this->send_ok($rows);
		
	}
  			
	function get_sql_item(){
		$sql = " 
		select a.* 
		, b.lng1_c_name as lng1_menu_name
		, b.lng2_c_name as lng2_menu_name
		, b.lng3_c_name as lng3_menu_name
		from setitem a , setmenu b 
		where a.menu_id = b.menu_id and b.menu_ext='flow' 
		"; 
		return $sql;		
	}
	
	public function iGet_item() { 		   
		if(isset($_POST['id']) )  $item_id = $_POST['id'];
		else if(isset($_POST['item_id']) )  $item_id = $_POST['item_id'];
		else $item_id = 0 ;

		$row = $this->get_setitem($item_id);
		$this->send_ok($row);			
	} 
	
	function get_setitem($item_id){			
		$sql = $this->get_sql_item();
		$sql .= " and a.item_id = '".$item_id."'   ";	 
		$row = $this->db->iGetRow($sql);	
		
		return $row;
	}	
	
	function iSet_item_c_seq($c_seq,$item_id,$menu_id,$isDel=false)  { 
	 	if( $c_seq == "0" || $c_seq == "" )	{
			$sql = "select max(c_seq)+1 from setitem where e_status='normal' and menu_id = '$menu_id' " ;
			$c_seq = $this->db->iSelectFld($sql);
		}
		else{		
	 		if($isDel) $c_seq = 0;
	 		
	 		
			$sql = " SET @x = $c_seq  ; " ;  
			$this->db->iQuery($sql);	
 
			$sql = "
update s_setitem set  c_seq =  @x :=  @x + 1   
where c_seq  >=   @x  
and menu_id = '$menu_id'  
and item_id != '$item_id'
and e_status = 'normal'
order by c_seq " ;
 			 
			$this->db->iQuery($sql);			
		}
		return $c_seq ;
			 
	}
	public function iInsert_item() { 
	
		if(isset($_POST['id']) )  $item_id = $_POST['id'];
		else if(isset($_POST['item_id']) )  $item_id = $_POST['item_id'];
		else $item_id = 0 ;
		 				
 

		$ht1["d_update"] = $this->now;		
		
		$f0 = $this->col_setitem;
		foreach( $f0 as $i1=>$f1)
			if(isset($_POST[$f1]) ) $ht1[$f1] = $_POST[$f1]; 
		
		$chk_menu_id = false;
		if( !isset($ht1["menu_id"]) ) $chk_menu_id = true ;
		else if($ht1["menu_id"]=="")$chk_menu_id = true ;
				
		if( $chk_menu_id){
			$sql="select  min(menu_id) from s_setmenu where menu_id != 0 and e_status = 'normal' and menu_ext='flow' ";
			$ht1["menu_id"] = $this->db->iGetField($sql) ;
		}
		
		$price = 0 ;
		if( isset($_POST["price"]) ) $price = $_POST["price"];
		

		if( $item_id == 0 ){
						
			$ht1["d_create"] = 	$ht1["d_update"];
			
		
			if(isset($_POST["c_seq"]) ){
				$c_seq = $_POST["c_seq"];
				$ht1["c_seq"] = $this->iSet_item_c_seq($c_seq, 0 ,$ht1["menu_id"],false);	
			}
		 									
			$this->db->iInsert("setitem",$ht1);
			$item_id = $this->db->lastId ;		
			
														 
		}		
		else {			
		  
		   if(isset($_POST['c_seq']) ){
		   	  $c_seq = $_POST['c_seq'];	 
		   	  $ht1["c_seq"] = $this->iSet_item_c_seq($c_seq,$item_id,$ht1["menu_id"],false); 
		   }
		 
		   $this->db->iUpdate("setitem",$ht1," item_id = '$item_id' ");
		   
			
		   if(isset($_POST['e_status']) ){
			   	if($ht1["e_status"] == 'cancel'){
			   		
			   		if(!isset($ht1['c_seq'])){
						$sql = "select c_seq from s_setitem where item_id='$item_id'" ;
						$ht1["c_seq"] = $this->db->iGetField($sql) ;
					} 
			   		 
			   		$this->iSet_item_c_seq($ht1["c_seq"],$item_id,$ht1["menu_id"],true);	
			   		$ht2["c_seq"] = 1000 ;
					$this->db->iUpdate("setitem",$ht2," item_id = '$item_id' ");
					
				}
			}
			
			
			
		}
		
		//stock_1To1  
		//$this->iInsert_stock_1To1($item_id);
		
		//Rawmat วัตถุดิบ
		//$this->iInsert_RawMatList($item_id);
 
		$_POST['id']=$item_id;
		$this->iGet_item();		
		
						 
		 
	}		


	/////////////////////////////////////////////////////////////////////////
 
  	public function iView_printer(){
		if(isset($_POST['e_status']) )  $e_status = " and a.e_status = '".$_POST['e_status']."' ";
		else if(isset($this->params[1]) ) $e_status = " and a.e_status ='" . $this->params[1] . "' ";
		else $e_status = "" ;
		
		
 		$sql = "select a.* from printer a where a.Printer_id != '0' $e_status ";
		
		$rows = $this->db->iGetRows($sql);
		$this->send_ok($rows);
		
		 		
	}
  				  
}
?>